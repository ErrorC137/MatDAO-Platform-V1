// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MatDAO_Swap
 * @dev Fixed-rate swap contract for IPT/USDC secondary market liquidity
 * Provides instant liquidity for investors to trade their Investment Participation Tokens
 */
contract MatDAO_Swap is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public usdcToken;
    IERC20 public iptToken;
    uint256 public exchangeRate; // 1 IPT = X USDC (scaled by 1e6 for USDC decimals)
    
    // Events
    event SwapUSDCForIPT(address indexed user, uint256 usdcAmount, uint256 iptAmount);
    event SwapIPTForUSDC(address indexed user, uint256 iptAmount, uint256 usdcAmount);
    event LiquidityAdded(uint256 usdcAmount, uint256 iptAmount);
    event LiquidityRemoved(uint256 usdcAmount, uint256 iptAmount);
    event ExchangeRateUpdated(uint256 newRate);

    /**
     * @dev Constructor to initialize the swap contract
     * @param _usdcToken The USDC token address
     * @param _iptToken The IPT token address
     * @param _exchangeRate Initial exchange rate (1 IPT = X USDC, scaled by 1e6)
     */
    constructor(
        address _usdcToken,
        address _iptToken,
        uint256 _exchangeRate
    ) {
        require(_usdcToken != address(0), "Invalid USDC token");
        require(_iptToken != address(0), "Invalid IPT token");
        require(_exchangeRate > 0, "Invalid exchange rate");

        usdcToken = IERC20(_usdcToken);
        iptToken = IERC20(_iptToken);
        exchangeRate = _exchangeRate;
    }

    /**
     * @dev Swap USDC for IPT tokens
     * @param usdcAmount The amount of USDC to swap
     */
    function swapUSDCForIPT(uint256 usdcAmount) external nonReentrant {
        require(usdcAmount > 0, "Amount must be > 0");
        
        // Calculate IPT amount (USDC / exchangeRate)
        uint256 iptAmount = (usdcAmount * 1e6) / exchangeRate;
        require(iptAmount > 0, "Insufficient exchange rate");
        
        // Check contract has enough IPT
        require(iptToken.balanceOf(address(this)) >= iptAmount, "Insufficient IPT liquidity");
        
        // Transfer USDC from user to contract
        usdcToken.safeTransferFrom(msg.sender, address(this), usdcAmount);
        
        // Transfer IPT from contract to user
        iptToken.safeTransfer(msg.sender, iptAmount);
        
        emit SwapUSDCForIPT(msg.sender, usdcAmount, iptAmount);
    }

    /**
     * @dev Swap IPT tokens for USDC
     * @param iptAmount The amount of IPT to swap
     */
    function swapIPTForUSDC(uint256 iptAmount) external nonReentrant {
        require(iptAmount > 0, "Amount must be > 0");
        
        // Calculate USDC amount (IPT * exchangeRate / 1e6)
        uint256 usdcAmount = (iptAmount * exchangeRate) / 1e6;
        require(usdcAmount > 0, "Insufficient exchange rate");
        
        // Check contract has enough USDC
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC liquidity");
        
        // Transfer IPT from user to contract
        iptToken.safeTransferFrom(msg.sender, address(this), iptAmount);
        
        // Transfer USDC from contract to user
        usdcToken.safeTransfer(msg.sender, usdcAmount);
        
        emit SwapIPTForUSDC(msg.sender, iptAmount, usdcAmount);
    }

    /**
     * @dev Add liquidity to the swap contract (admin only)
     * @param usdcAmount The amount of USDC to add
     * @param iptAmount The amount of IPT to add
     */
    function addLiquidity(uint256 usdcAmount, uint256 iptAmount) external onlyOwner {
        require(usdcAmount > 0 && iptAmount > 0, "Amounts must be > 0");
        
        // Transfer tokens from admin to contract
        usdcToken.safeTransferFrom(msg.sender, address(this), usdcAmount);
        iptToken.safeTransferFrom(msg.sender, address(this), iptAmount);
        
        emit LiquidityAdded(usdcAmount, iptAmount);
    }

    /**
     * @dev Remove liquidity from the swap contract (admin only)
     * @param usdcAmount The amount of USDC to remove
     * @param iptAmount The amount of IPT to remove
     */
    function removeLiquidity(uint256 usdcAmount, uint256 iptAmount) external onlyOwner {
        require(usdcAmount > 0 && iptAmount > 0, "Amounts must be > 0");
        
        // Check contract has enough tokens
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC");
        require(iptToken.balanceOf(address(this)) >= iptAmount, "Insufficient IPT");
        
        // Transfer tokens from contract to admin
        usdcToken.safeTransfer(msg.sender, usdcAmount);
        iptToken.safeTransfer(msg.sender, iptAmount);
        
        emit LiquidityRemoved(usdcAmount, iptAmount);
    }

    /**
     * @dev Update the exchange rate (admin only)
     * @param _exchangeRate The new exchange rate
     */
    function setExchangeRate(uint256 _exchangeRate) external onlyOwner {
        require(_exchangeRate > 0, "Invalid exchange rate");
        exchangeRate = _exchangeRate;
        emit ExchangeRateUpdated(_exchangeRate);
    }

    /**
     * @dev Get the estimated IPT amount for a given USDC amount
     * @param usdcAmount The amount of USDC
     */
    function getQuoteUSDCForIPT(uint256 usdcAmount) public view returns (uint256) {
        return (usdcAmount * 1e6) / exchangeRate;
    }

    /**
     * @dev Get the estimated USDC amount for a given IPT amount
     * @param iptAmount The amount of IPT
     */
    function getQuoteIPTForUSDC(uint256 iptAmount) public view returns (uint256) {
        return (iptAmount * exchangeRate) / 1e6;
    }

    /**
     * @dev Get current liquidity status
     */
    function getLiquidityStatus() public view returns (
        uint256 usdcBalance,
        uint256 iptBalance,
        uint256 currentRate
    ) {
        usdcBalance = usdcToken.balanceOf(address(this));
        iptBalance = iptToken.balanceOf(address(this));
        currentRate = exchangeRate;
    }
}
