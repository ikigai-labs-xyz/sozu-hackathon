const { network, ethers } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async hre => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer, user1 } = await getNamedAccounts()

  log(`Starting protocol setup`)

  const userNonFirewalledProtocol = await ethers.getContract("NonFirewalledProtocol", user1)
  const nonFirewalledProtocol = await ethers.getContract("NonFirewalledProtocol", deployer)
  const nonFirewalledProtocolAddress = await nonFirewalledProtocol.getAddress()

  const userFirewalledProtocol = await ethers.getContract("FirewalledProtocol", user1)
  const firewalledProtocol = await ethers.getContract("FirewalledProtocol", deployer)
  const firewalledProtocolAddress = await firewalledProtocol.getAddress()

  const usdc = await ethers.getContract("Usdc", deployer)
  const userUsdc = await ethers.getContract("Usdc", user1)

  const totalAmountRaw = 10000000
  const depositAmountRaw = totalAmountRaw / 2
  const totalAmount = ethers.parseUnits(String(totalAmountRaw), 6)
  const depositAmount = ethers.parseUnits(String(depositAmountRaw), 6)

  // initialize firewalled protocol
  await firewalledProtocol.initialize()
  log(`Initialized Firewall at protected protocol ${firewalledProtocolAddress}`)

  // mint 10 million USDC to the user (from deployer)
  const mintTx = await usdc.mint(user1, totalAmount)
  await mintTx.wait()
  log(`Minted 10 million USDC to user1 (${user1})`)

  // mint 5 million USDC to the deployer
  const mintDeployerTx = await usdc.mint(deployer, depositAmount)
  await mintDeployerTx.wait()
  log(`Minted 5 million USDC to deployer (${deployer})`)

  // deposit 5million into the non firewalled protocol
  const firstApproveTx = await userUsdc.approve(nonFirewalledProtocolAddress, depositAmount.toString())
  await firstApproveTx.wait()
  await userNonFirewalledProtocol.deposit(depositAmount)
  log(`Deposited 5 million USDC to non-protected protocol (${nonFirewalledProtocolAddress}) from user1`)

  // deposit 5million into the firewalled protocol
  const secondApproveTx = await userUsdc.approve(firewalledProtocolAddress, depositAmount)
  await secondApproveTx.wait()
  await userFirewalledProtocol.deposit(depositAmount)

  log(`Deposited 5 million USDC to protected (firewalled) protocol (${firewalledProtocolAddress}) from user1`)

  log("---------------------------------")
}

module.exports.tags = ["all", "Setup"]
