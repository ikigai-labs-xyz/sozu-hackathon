const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("AttackContract", () => {
      let attacker,
        attackContract,
        attackContractAddress,
        usdc,
        lendingBorrowing,
        turtleshell,
        lendingBorrowingAddress;
      const depositAmount = ethers.parseUnits("5000", 6);
      const withdrawAmount = ethers.parseUnits("30", 6);

      beforeEach(async () => {
        await deployments.fixture(["TurtleShellFirewall", "usdc"]);

        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user1;
        attacker = (await getNamedAccounts()).user2;

        usdc = await ethers.getContract("Usdc", deployer);
        const usdcTokenAddress = await usdc.getAddress();
        turtleshell = await ethers.getContract("TurtleShellFirewall", deployer);
        const turtleshellAddress = await turtleshell.getAddress();

        lendingBorrowing = await ethers.deployContract(
          "LendingBorrowing",
          [usdcTokenAddress, turtleshellAddress],
          {}
        );
        lendingBorrowingAddress = await lendingBorrowing.getAddress();
        await lendingBorrowing.initialize();

        await usdc.mint(attacker, depositAmount);
        await usdc
          .connect(attacker)
          .approve(lendingBorrowingAddress, ethers.MaxInt256);

        attackContract = await ethers.deployContract(
          "AttackContract",
          [usdcTokenAddress, lendingBorrowingAddress],
          { from: attacker }
        );
        attackContractAddress = await attackContract.getAddress();
      });

      it.only("exploits the reentrancy vulnerability", async () => {
        const initialBalance = await usdc.balanceOf(attacker);

        await attackContract.connect(attacker).attack(depositAmount);

        const finalBalance = await usdc.balanceOf(attacker);
        assert.isTrue(
          finalBalance.gt(initialBalance),
          "AttackContract did not manage to exploit the reentrancy vulnerability"
        );
      });

      it("allows the attacker to steal funds", async () => {
        await attackContract.connect(attacker).attack(depositAmount);

        const initialBalance = await ethers.provider.getBalance(attacker);
        await attackContract.connect(attacker).steal();
        const finalBalance = await ethers.provider.getBalance(attacker);

        assert.isTrue(
          finalBalance.gt(initialBalance),
          "The attacker was not able to steal the funds"
        );
      });
    });
