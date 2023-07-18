// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./sdk/interfaces/ITurtleShellFirewallUser.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LendingBorrowing {
    ITurtleShellFirewallUser public turtleShell;

    IERC20 private s_usdc;
    uint public constant USDC_DECIMALS = 6;

    mapping(address => uint256) public balances;

    function deposit(uint256 depositAmount) public {
        require(depositAmount > 0, "deposit: Amount must be greater than zero");
        require(
            s_usdc.allowance(msg.sender, address(this)) >= depositAmount,
            "deposit: Insufficient allowance"
        );

        uint256 formatedDepositAmount = depositAmount * 10 ** USDC_DECIMALS;
        require(
            s_usdc.transferFrom(
                msg.sender,
                address(this),
                formatedDepositAmount
            ),
            "deposit: transferFrom failed"
        );

        balances[msg.sender] += depositAmount;
    }
}
