const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("LendingBorrowing", () => {
      let deployer, user, lendingBorrowing, lendingBorrowingAddress, usdc;
      const depositAmount = ethers.parseUnits("50", 6);
      const withdrawAmount = ethers.parseUnits("30", 6);

      beforeEach(async () => {
        await deployments.fixture(["TurtleShellFirewall", "usdc"]);

        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user1;

        usdc = await ethers.getContract("Usdc", deployer);
        const usdcTokenAddress = await usdc.getAddress();
        const turtleshell = await ethers.getContract(
          "TurtleShellFirewall",
          deployer
        );
        const turtleshellAddress = await turtleshell.getAddress();

        lendingBorrowing = await ethers.deployContract(
          "LendingBorrowing",
          [usdcTokenAddress, turtleshellAddress],
          {}
        );
        lendingBorrowingAddress = await lendingBorrowing.getAddress();
        await lendingBorrowing.initialize();

        const amount = ethers.parseUnits("1000", 6);
        await usdc.mint(deployer, amount);

        await usdc.approve(lendingBorrowingAddress, ethers.MaxInt256);
      });

      describe("deposit", () => {
        it("sets deposited amount", async () => {
          await lendingBorrowing.deposit(depositAmount);

          const balanceDeployer = await lendingBorrowing.balances(deployer);
          assert.equal(balanceDeployer.toString(), depositAmount.toString());

          const balanceUser = await lendingBorrowing.balances(user);
          assert.equal(balanceUser.toString(), "0");
        });

        it("transfers funds from user to contract", async () => {
          const startLendingBorrowingBalance = await usdc.balanceOf(
            lendingBorrowingAddress
          );
          assert.equal(startLendingBorrowingBalance.toString(), "0");

          const startDeployerBalance = await usdc.balanceOf(deployer);

          await lendingBorrowing.deposit(depositAmount);

          const finalDeployerBalance = await usdc.balanceOf(deployer);
          assert.equal(
            finalDeployerBalance.toString(),
            (startDeployerBalance - depositAmount).toString()
          );

          const finalLendingBorrowingBalance = await usdc.balanceOf(
            lendingBorrowingAddress
          );
          assert.equal(
            finalLendingBorrowingBalance.toString(),
            (startLendingBorrowingBalance + depositAmount).toString()
          );
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await lendingBorrowing.deposit(depositAmount);
        });

        it("sets withdrawn amount", async () => {
          await lendingBorrowing.withdraw(withdrawAmount);

          const balanceDeployer = await lendingBorrowing.balances(deployer);
          assert.equal(
            balanceDeployer.toString(),
            (depositAmount - withdrawAmount).toString()
          );
        });

        it("transfers funds from contract to user", async () => {
          const startLendingBorrowingBalance = await usdc.balanceOf(
            lendingBorrowingAddress
          );

          const startDeployerBalance = await usdc.balanceOf(deployer);

          await lendingBorrowing.withdraw(withdrawAmount);

          const finalDeployerBalance = await usdc.balanceOf(deployer);
          assert.equal(
            finalDeployerBalance.toString(),
            (startDeployerBalance + withdrawAmount).toString()
          );

          const finalLendingBorrowingBalance = await usdc.balanceOf(
            lendingBorrowingAddress
          );
          assert.equal(
            finalLendingBorrowingBalance.toString(),
            (startLendingBorrowingBalance - withdrawAmount).toString()
          );
        });
      });
    });
