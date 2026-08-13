// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MatDAO_RoyaltySplitter
 * @dev Automated royalty distribution contract for IP revenue sharing
 * Supports percentage-based and fixed-amount distributions with multiple recipients
 * Integrates with Story Protocol and ERC-3643 for compliant RWA tokenization
 */
contract MatDAO_RoyaltySplitter is AccessControl, ReentrancyGuard {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Royalty recipient structure
    struct Recipient {
        address account;
        uint256 sharePercentage; // In basis points (10000 = 100%)
        uint256 fixedAmount;
        bool isActive;
        uint256 totalReceived;
    }
    
    // Distribution structure
    struct Distribution {
        uint256 id;
        uint256 timestamp;
        uint256 totalAmount;
        address tokenAddress;
        bool isCompleted;
    }
    
    // IP Asset mapping
    mapping(bytes32 => Recipient[]) public ipRecipients;
    mapping(bytes32 => uint256) public ipTotalDistributed;
    
    // Distribution history
    mapping(bytes32 => Distribution[]) public distributionHistory;
    mapping(bytes32 => uint256) public distributionCount;
    
    // Token blacklist (tokens that cannot be distributed)
    mapping(address => bool) public tokenBlacklist;
    
    // Events
    event RecipientAdded(bytes32 indexed ipId, address indexed account, uint256 sharePercentage);
    event RecipientRemoved(bytes32 indexed ipId, address indexed account);
    event RecipientUpdated(bytes32 indexed ipId, address indexed account, uint256 sharePercentage);
    event RoyaltyDistributed(bytes32 indexed ipId, uint256 distributionId, uint256 totalAmount);
    event DistributionCompleted(bytes32 indexed ipId, uint256 distributionId, uint256 timestamp);
    event TokenBlacklisted(address indexed token, bool blacklisted);
    
    /**
     * @dev Constructor
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Add royalty recipient for an IP asset
     * @param ipId IP asset identifier (e.g., from Story Protocol)
     * @param account Recipient wallet address
     * @param sharePercentage Share in basis points (10000 = 100%)
     */
    function addRecipient(
        bytes32 ipId,
        address account,
        uint256 sharePercentage
    ) external onlyRole(OPERATOR_ROLE) {
        require(account != address(0), "Invalid recipient address");
        require(sharePercentage <= 10000, "Share percentage exceeds 100%");
        
        // Check if recipient already exists
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].account == account) {
                revert("Recipient already exists");
            }
        }
        
        // Validate total shares don't exceed 100%
        uint256 totalShares = sharePercentage;
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            totalShares += ipRecipients[ipId][i].sharePercentage;
        }
        require(totalShares <= 10000, "Total shares would exceed 100%");
        
        ipRecipients[ipId].push(Recipient({
            account: account,
            sharePercentage: sharePercentage,
            fixedAmount: 0,
            isActive: true,
            totalReceived: 0
        }));
        
        emit RecipientAdded(ipId, account, sharePercentage);
    }
    
    /**
     * @dev Remove royalty recipient
     * @param ipId IP asset identifier
     * @param account Recipient wallet address
     */
    function removeRecipient(
        bytes32 ipId,
        address account
    ) external onlyRole(OPERATOR_ROLE) {
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].account == account) {
                ipRecipients[ipId][i].isActive = false;
                emit RecipientRemoved(ipId, account);
                return;
            }
        }
        revert("Recipient not found");
    }
    
    /**
     * @dev Update recipient share百分比
     * @param ipId IP asset identifier
     * @param account Recipient wallet address
     * @param newSharePercentage New share in basis points
     */
    function updateRecipientShare(
        bytes32 ipId,
        address account,
        uint256 newSharePercentage
    ) external onlyRole(OPERATOR_ROLE) {
        require(newSharePercentage <= 10000, "Share percentage exceeds 100%");
        
        uint256 oldShare = 0;
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].account == account) {
                oldShare = ipRecipients[ipId][i].sharePercentage;
                ipRecipients[ipId][i].sharePercentage = newSharePercentage;
                emit RecipientUpdated(ipId, account, newSharePercentage);
                return;
            }
        }
        revert("Recipient not found");
    }
    
    /**
     * @dev Set fixed amount for a recipient
     * @param ipId IP asset identifier
     * @param account Recipient wallet address
     * @param fixedAmount Fixed amount to receive
     */
    function setFixedAmount(
        bytes32 ipId,
        address account,
        uint256 fixedAmount
    ) external onlyRole(OPERATOR_ROLE) {
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].account == account) {
                ipRecipients[ipId][i].fixedAmount = fixedAmount;
                return;
            }
        }
        revert("Recipient not found");
    }
    
    /**
     * @dev Distribute royalties to recipients
     * @param ipId IP asset identifier
     * @param tokenAddress Token address to distribute (address(0) for native ETH)
     * @param amount Total amount to distribute
     */
    function distributeRoyalties(
        bytes32 ipId,
        address tokenAddress,
        uint256 amount
    ) external nonReentrant onlyRole(OPERATOR_ROLE) {
        require(amount > 0, "Amount must be greater than 0");
        require(!tokenBlacklist[tokenAddress], "Token is blacklisted");
        
        // Get active recipients
        Recipient[] memory activeRecipients = getActiveRecipients(ipId);
        require(activeRecipients.length > 0, "No active recipients");
        
        // Create distribution record
        uint256 distributionId = distributionCount[ipId]++;
        distributionHistory[ipId].push(Distribution({
            id: distributionId,
            timestamp: block.timestamp,
            totalAmount: amount,
            tokenAddress: tokenAddress,
            isCompleted: false
        }));
        
        emit RoyaltyDistributed(ipId, distributionId, amount);
        
        // Calculate and distribute shares
        uint256 remainingAmount = amount;
        
        for (uint256 i = 0; i < activeRecipients.length; i++) {
            Recipient memory recipient = activeRecipients[i];
            
            uint256 shareAmount;
            if (recipient.fixedAmount > 0) {
                shareAmount = recipient.fixedAmount;
            } else {
                shareAmount = (amount * recipient.sharePercentage) / 10000;
            }
            
            // Ensure we don't exceed remaining amount
            if (shareAmount > remainingAmount) {
                shareAmount = remainingAmount;
            }
            
            if (shareAmount > 0) {
                if (tokenAddress == address(0)) {
                    // Distribute native ETH
                    (bool success, ) = payable(recipient.account).call{value: shareAmount}("");
                    require(success, "ETH transfer failed");
                } else {
                    // Distribute ERC20 tokens
                    IERC20 token = IERC20(tokenAddress);
                    require(token.transfer(recipient.account, shareAmount), "Token transfer failed");
                }
                
                // Update recipient total received
                for (uint256 j = 0; j < ipRecipients[ipId].length; j++) {
                    if (ipRecipients[ipId][j].account == recipient.account) {
                        ipRecipients[ipId][j].totalReceived += shareAmount;
                        break;
                    }
                }
                
                remainingAmount -= shareAmount;
            }
        }
        
        ipTotalDistributed[ipId] += amount;
        
        // Mark distribution as completed
        distributionHistory[ipId][distributionId].isCompleted = true;
        emit DistributionCompleted(ipId, distributionId, block.timestamp);
    }
    
    /**
     * @dev Get active recipients for an IP
     * @param ipId IP asset identifier
     * @return Array of active recipients
     */
    function getActiveRecipients(bytes32 ipId) public view returns (Recipient[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].isActive) {
                activeCount++;
            }
        }
        
        Recipient[] memory activeRecipients = new Recipient[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < ipRecipients[ipId].length; i++) {
            if (ipRecipients[ipId][i].isActive) {
                activeRecipients[index] = ipRecipients[ipId][i];
                index++;
            }
        }
        
        return activeRecipients;
    }
    
    /**
     * @dev Get all recipients for an IP
     * @param ipId IP asset identifier
     * @return Array of all recipients
     */
    function getAllRecipients(bytes32 ipId) external view returns (Recipient[] memory) {
        return ipRecipients[ipId];
    }
    
    /**
     * @dev Get distribution history for an IP
     * @param ipId IP asset identifier
     * @return Array of distributions
     */
    function getDistributionHistory(bytes32 ipId) external view returns (Distribution[] memory) {
        return distributionHistory[ipId];
    }
    
    /**
     * @dev Blacklist a token from being distributed
     * @param tokenAddress Token address
     * @param blacklisted Blacklist status
     */
    function setTokenBlacklist(
        address tokenAddress,
        bool blacklisted
    ) external onlyRole(ADMIN_ROLE) {
        tokenBlacklist[tokenAddress] = blacklisted;
        emit TokenBlacklisted(tokenAddress, blacklisted);
    }
    
    /**
     * @dev Emergency withdraw for admin
     * @param tokenAddress Token address (address(0) for native ETH)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address tokenAddress,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        if (tokenAddress == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            IERC20 token = IERC20(tokenAddress);
            require(token.transfer(msg.sender, amount), "Token withdrawal failed");
        }
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
}
