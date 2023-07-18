const { network, ethers } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  /***********************************
   *
   * Deploy smart contract
   *
   ************************************/

  log("---------------------------------");
  log(`Deploy with owner : ${deployer}`);

  const chainId = network.config.chainId;
  const usdcTokenAddress = networkConfig[chainId].usdcToken;

  const turtleshell = await ethers.getContract("TurtleShellFirewall", deployer);
  const turtleshellAddress = await turtleshell.getAddress();

  const arguments = [usdcTokenAddress, turtleshellAddress];
  await deploy("LendingBorrowing", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
    /* adjust if ProviderError: transaction underpriced */
    //gasPrice: ethers.parseUnits("200", "gwei"),
    //gasLimit: 30000000,
  });

  log("---------------------------------");
  log(`deployed with owner : ${deployer}`);

  const lendingBorrowing = await ethers.getContract(
    "LendingBorrowing",
    deployer
  );
  await lendingBorrowing.initialize();
  log("---------------------------------");
  log(`lendingBorrowing initialized Turtlteshell parameters`);

  const contractAddress = await lendingBorrowing.getAddress();

  /***********************************
   *
   *  Verify the deployment
   *
   ************************************/
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`Verifying ${contractAddress} ...`);
    await verify(contractAddress, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "LendingBorrowing"];
