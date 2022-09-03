import ArtemisABI from "../abi/contracts/Artemis.sol/Artemis.json"

export const RPC_URL = df.ethConnection.provider.connection.url

export const LOBBY_CONTRACT_ADDRESS = df.getContractAddress()
// # v0.5
export const ARTEMIS_CONTRACT_ADDRESS = "0xeb267409bA681F72E6AFd978A9d7F637F93f2404"
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


