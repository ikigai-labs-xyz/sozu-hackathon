const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { mintUsdc } = require("../utils/mintUsdc");
const { getUSDC } = require("../utils/tokens");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("LendingBorrowing", () => {
      let deployer, user, lendingBorrowing, lendingBorrowingAddress, usdc;
      const depositAmount = ethers.parseUnits("50", 6);

      beforeEach(async () => {
        await deployments.fixture(["all"]);
        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user;

        lendingBorrowing = await ethers.getContract(
          "LendingBorrowing",
          deployer
        );

        lendingBorrowingAddress = await lendingBorrowing.getAddress();

        usdc = await getUSDC(deployer);

        const amount = ethers.parseUnits("1000", 6);
        const actual_amount_minted = await mintUsdc(deployer, amount);

        await usdc.approve(lendingBorrowingAddress, ethers.MaxInt256);
      });

      describe("deposit", () => {
        it("sets deposited amount", async () => {
          console.log("foo5");
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
            startDeployerBalance.sub(depositAmount).toString()
          );

          const finalLendingBorrowingBalance = await usdc.balanceOf(
            lendingBorrowingAddress
          );
          assert.equal(
            finalLendingBorrowingBalance.toString(),
            startLendingBorrowingBalance.add(depositAmount).toString()
          );
        });
      });
    });
