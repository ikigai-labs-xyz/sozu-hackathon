const { getNamedAccounts, ethers } = require("hardhat")

const main = async hre => {
  const { deployer, user1 } = await getNamedAccounts()
  // make deposit as deployer
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
