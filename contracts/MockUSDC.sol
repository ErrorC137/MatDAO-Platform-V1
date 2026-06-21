// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing and demo purposes
 * Includes a faucet function to mint tokens for testing
 */
contract MockUSDC is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 10000 * 10**6; // 10,000 USDC
    
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1000000 * 10**6); // Mint 1M tokens to deployer
    }

    /**
     * @dev Faucet function to mint tokens for testing
     * Anyone can call this to get FAUCET_AMOUNT tokens
     */
    function faucet() public {
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation
     * USDC uses 6 decimals
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
