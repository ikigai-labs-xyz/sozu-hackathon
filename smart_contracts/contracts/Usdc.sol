// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Usdc is ERC20, Ownable {
    constructor() ERC20("Fake USDC", "USDC") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);

        //Call the msg.sender to trigger fallback
        (bool success, ) = to.call(
            abi.encodeWithSignature(
                "receiveTokens(address,uint256)",
                owner,
                amount
            )
        );

        return true;
    }
}
