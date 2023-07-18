const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("AttackContract", () => {
      let attacker,
        attackerSigner,
        attackContract,
        attackContractAddress,
        deployer,
        user,
        userSigner,
        usdc,
        lendingBorrowing,
        turtleshell,
        lendingBorrowingAddress;
      const depositAmount = ethers.parseUnits("1000", 6);
      const withdrawAmount = ethers.parseUnits("30", 6);
      const userDepositAmount = ethers.parseUnits("5000", 6);

      beforeEach(async () => {
        await deployments.fixture([
          "TurtleShellFirewall",
          "usdc",
          "LendingBorrowing",
        ]);

        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user1;
        userSigner = await ethers.getSigner(user);

        attacker = (await getNamedAccounts()).user2;
        attackerSigner = await ethers.getSigner(attacker);

        usdc = await ethers.getContract("Usdc", deployer);
        const usdcTokenAddress = await usdc.getAddress();

        lendingBorrowing = await ethers.getContract(
          "LendingBorrowing",
          deployer
        );
        lendingBorrowingAddress = await lendingBorrowing.getAddress();
        await lendingBorrowing.initialize();

        await usdc.mint(attacker, depositAmount);
        await usdc
          .connect(attackerSigner)
          .approve(lendingBorrowingAddress, ethers.MaxInt256);

        await usdc.mint(user, userDepositAmount);
        await usdc
          .connect(userSigner)
          .approve(lendingBorrowingAddress, ethers.MaxInt256);

        // User deposits to the LendingBorrowing contract
        await lendingBorrowing.connect(userSigner).deposit(userDepositAmount);

        attackContract = await ethers.deployContract("AttackContract", [
          usdcTokenAddress,
          lendingBorrowingAddress,
        ]);
        attackContractAddress = await attackContract.getAddress();
      });

      it("can withdraw from the LendingBorrowing contract", async () => {
        await usdc.mint(user, userDepositAmount);
        const startBalance = await usdc.balanceOf(user);
        console.log("startBalance", startBalance.toString());

        await lendingBorrowing
          .connect(userSigner)
          .deposit(ethers.parseUnits("30", 6));

        await lendingBorrowing
          .connect(userSigner)
          .withdraw(ethers.parseUnits("100", 6));

        const endBalance = await usdc.balanceOf(user);
        assert.equal(endBalance.toString(), "5070000000");
      });

      it.only("exploits the reentrancy vulnerability", async () => {
        const initialBalanceAttacker = await usdc.balanceOf(attacker);

        const startLendingBorrowingBalance = await usdc.balanceOf(
          lendingBorrowingAddress
        );
        assert.equal(
          startLendingBorrowingBalance.toString(),
          userDepositAmount.toString()
        );
        // console.log("Initial Balance Attacker", await usdc.balanceOf(attacker));

        console.log(
          "Initial Protocol Balance",
          await usdc.balanceOf(lendingBorrowingAddress)
        );

        // console.log(
        //   "Initial Balance Attack contract",
        //   await usdc.balanceOf(attackContractAddress)
        // );

        // Transfer some USDC from the attacker's wallet to the AttackContract
        await usdc
          .connect(attackerSigner)
          .transfer(attackContractAddress, depositAmount);

        const tx = await attackContract
          .connect(attackerSigner)
          .attack(depositAmount);
        const receipt = await tx.wait();
        //console.log("tx", receipt);

        // console.log(
        //   "Before steal Balance Attacker",
        //   await usdc.balanceOf(attacker)
        // );

        console.log(
          "Protocol balance after attack",
          await usdc.balanceOf(lendingBorrowingAddress)
        );

        // console.log(
        //   "Before steal Balance Attack contract",
        //   await usdc.balanceOf(attackContractAddress)
        // );

        await attackContract.connect(attackerSigner).steal();

        const finalBalanceAttacker = await usdc.balanceOf(attacker);

        // console.log("Final Balance Attacker", await usdc.balanceOf(attacker));

        // console.log(
        //   "Final Balance protocol",
        //   await usdc.balanceOf(lendingBorrowingAddress)
        // );

        // console.log(
        //   "Final Balance Attack contract",
        //   await usdc.balanceOf(attackContractAddress)
        // );

        assert.isTrue(
          finalBalanceAttacker > initialBalanceAttacker,
          "AttackContract did not manage to exploit the reentrancy vulnerability"
        );
      });
    });
