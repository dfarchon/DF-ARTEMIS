import ArtemisABI from "../abi/contracts/Artemis.sol/Artemis.json"

export const RPC_URL = df.ethConnection.provider.connection.url

export const LOBBY_CONTRACT_ADDRESS = df.getContractAddress()
// # v0.0.2
// export const ARTEMIS_CONTRACT_ADDRESS = "0xEe2A8A1ccF2D422b92c78cfb850b1E6BCC5A37eC"
// export const ARTEMIS_CONTRACT_ADDRESS = "0x8B81fdEa2fF97aC75570985946A8fe38bB9B0B75"
export const ARTEMIS_CONTRACT_ADDRESS = "0xDCf0e438c10Deb6e37bd09E0439e4FA5C16f5BBE";
export const ARTEMIS_CONTRACT_ABI = ArtemisABI

export const REFRESH_INTERVAL = 20000

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"

export const own = df.getAccount()

export const privateKey = df.getPrivateKey()

export const notifyManager = df.getNotificationsManager()

export const isLobbyAdmin = own.toLowerCase() === df.contractConstants.adminAddress.toLowerCase()

const lobbyRound = ["0x9cf22c4b7ecbb1eaf3daf55ad72c24bbfdc2aa68"]

export const isLobbyRound = lobbyRound.indexOf(LOBBY_CONTRACT_ADDRESS) > -1

export const SUBGRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/fromddy/df-artemis"

export const version = "DFArtemis-v0.1.3"
