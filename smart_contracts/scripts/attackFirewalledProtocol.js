const { network, ethers } = require("hardhat")

const main = async hre => {
  const chainId = network.config.chainId
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
