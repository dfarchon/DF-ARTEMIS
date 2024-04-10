import {HardhatUserConfig} from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import "hardhat-abi-exporter"

require("dotenv").config()
import "./tasks/wallet"
const {DEPLOYER_MNEMONIC, ADMIN_PUBLIC_ADDRESS} = process.env

// some configs are from :
// https://github.com/darkforest-eth/eth

// The xdai config, but it isn't added to networks unless we have a DEPLOYER_MNEMONIC
const xdai = {
    url: process.env.XDAI_RPC_URL ?? "https://rpc-df.xdaichain.com/",
    accounts: {
        mnemonic: DEPLOYER_MNEMONIC,
    },
    chainId: 100,
    gasMultiplier: 5,
}

// The mainnet config, but it isn't added to networks unless we have a DEPLOYER_MNEMONIC
const mainnet = {
    // Brian's Infura endpoint (free tier)
    url: "https://mainnet.infura.io/v3/5459b6d562eb47f689c809fe0b78408e",
    accounts: {
        mnemonic: DEPLOYER_MNEMONIC,
    },
    chainId: 1,
}

const redstoneTestnet = {
    url: process.env.REDSTONE_TESTNET_RPC_URL,
    accounts: {
      mnemonic: process.env.DEPLOYER_MNEMONIC,
    },
    chainId: Number(process.env.REDSTONE_TESTNET_CHAINID),
  };

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        // Check for a DEPLOYER_MNEMONIC before we add xdai/mainnet network to the list of networks
        // Ex: If you try to deploy to xdai without DEPLOYER_MNEMONIC, you'll see this error:
        // > Error HH100: Network xdai doesn't exist
        ...(DEPLOYER_MNEMONIC ? {xdai} : undefined),
        ...(DEPLOYER_MNEMONIC ? {mainnet} : undefined),
        ...(DEPLOYER_MNEMONIC ? { redstoneTestnet } : undefined),
        localhost: {
            url: "http://localhost:8545/",
            accounts: {
                // Same mnemonic used in the .env.example
                mnemonic: "change typical hire slam amateur loan grid fix drama electric seed label",
            },
            chainId: 31337,
        },
        // Used when you dont specify a network on command line, like in tests
        hardhat: {},
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
}

export default config
