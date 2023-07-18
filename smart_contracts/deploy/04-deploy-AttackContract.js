const { network, ethers } = require("hardhat")
const {
	developmentChains,
	VERIFICATION_BLOCK_CONFIRMATIONS,
	networkConfig,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
	const { getNamedAccounts, deployments } = hre
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()
	const waitBlockConfirmations = developmentChains.includes(network.name)
		? 1
		: VERIFICATION_BLOCK_CONFIRMATIONS

	/***********************************
	 *
	 * Deploy smart contract
	 *
	 ************************************/

	log("---------------------------------")
	log(`Deploy with owner : ${deployer}`)

	const chainId = network.config.chainId
	const usdcTokenAddress = networkConfig[chainId].usdcToken

	const nonFirewalledProtocol = await ethers.getContract("NonFirewalledProtocol", deployer)
	const nonFirewalledProtocolAddress = await nonFirewalledProtocol.getAddress()

	const arguments = [usdcTokenAddress, nonFirewalledProtocolAddress]
	await deploy("AttackContract", {
		from: deployer,
		args: arguments,
		log: true,
		waitConfirmations: waitBlockConfirmations,
		/* adjust if ProviderError: transaction underpriced */
		//gasPrice: ethers.parseUnits("200", "gwei"),
		//gasLimit: 30000000,
	})

	log("---------------------------------")
	log(`deployed with owner : ${deployer}`)

	log("----------------------------------------------------")
}

module.exports.tags = ["all", "AttackContract"]
