// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./sdk/interfaces/ITurtleShellFirewallUser.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingBorrowing is Ownable {
    ITurtleShellFirewallUser public turtleShell;

    IERC20 private s_usdc;

    mapping(address => uint256) public balances;

    constructor(address _usdcAddress, address _turtleShellAddress) {
        s_usdc = IERC20(_usdcAddress);
        turtleShell = ITurtleShellFirewallUser(_turtleShellAddress);
    }

    function initialize() public onlyOwner {
        turtleShell.setUserConfig(15, 10, 0, 8);
    }

    function deposit(uint256 depositAmount) public {
        require(depositAmount > 0, "deposit: Amount must be greater than zero");
        require(
            s_usdc.allowance(msg.sender, address(this)) >= depositAmount,
            "deposit: Insufficient allowance"
        );
        require(
            s_usdc.balanceOf(msg.sender) >= depositAmount,
            "deposit: Insufficient balance"
        );

        balances[msg.sender] += depositAmount;
        turtleShell.increaseParameter(depositAmount);

        require(
            s_usdc.transferFrom(msg.sender, address(this), depositAmount),
            "deposit: transferFrom failed"
        );
    }

    function withdraw(uint256 withdrawAmount) public {
        require(
            withdrawAmount > 0,
            "withdraw: Amount must be greater than zero"
        );
        require(
            balances[msg.sender] >= withdrawAmount,
            "withdraw: Insufficient balance"
        );

        //bool firewallTriggered = turtleShell.decreaseParameter(withdrawAmount);
        //require(!firewallTriggered, "withdraw: Firewall triggered");
        require(
            s_usdc.transfer(msg.sender, withdrawAmount),
            "withdraw: transfer failed"
        );

        // We introduce a reentrancy vulnerability here
        balances[msg.sender] -= withdrawAmount;
    }

    //getAmountSupplied by address
    function getAmountSupplied() public view returns (uint256) {
        return balances[msg.sender];
    }
}
