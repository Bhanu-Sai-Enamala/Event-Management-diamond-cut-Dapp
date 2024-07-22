require('@nomiclabs/hardhat-waffle')
require('dotenv').config({ path: './.env' });
// process.env.INFURA_ENDPOINT



let mnemonic = process.env.MNEMONIC;
let infuraEP = process.env.INFURA_ENDPOINT;

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})



module.exports = {
  solidity: '0.8.17',
  networks: {
    sepolia: {
      url: infuraEP,
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
