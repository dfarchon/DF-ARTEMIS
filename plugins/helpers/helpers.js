import {ARTEMIS_CONTRACT_ADDRESS, ARTEMIS_CONTRACT_ABI, LOBBY_CONTRACT_ADDRESS, notifyManager} from "../constants"

export async function getArtemisContract() {
    const addr = ARTEMIS_CONTRACT_ADDRESS
    const abi = ARTEMIS_CONTRACT_ABI
    return df.loadContract(addr, abi)
}

export async function getAllTasks(contract) {
    const addr = LOBBY_CONTRACT_ADDRESS
    const taskCount = await contract.getTaskCount(addr)
    const tasks = await contract.bulkGetTasks(addr, 0, taskCount)
    return tasks
}

export function notify(msg) {
    notifyManager.notify(100, `[ARTEMIS] ${msg}`)
}

export function getRandomActionId() {
    const hex = "0123456789abcdef"
    let ret = ""
    for (let i = 0; i < 10; i += 1) {
        ret += hex[Math.floor(hex.length * Math.random())]
    }
    return ret
}

export async function callAction(
    contract,
    methodName,
    args,
    overrides = {
        gasPrice: undefined,
        gasLimit: 2000000,
    }
) {
    if (!df.contractsAPI.txExecutor) {
        throw new Error("no signer, cannot execute tx")
    }

    const tx = {
        methodName: methodName,
        contract: contract,
        args: args,
    }

    const e = await df.contractsAPI.submitTransaction(tx, overrides)
    return e.confirmedPromise
}

export function log(msg, level, ...optionalParams) {
    switch (level) {
        case "debug":
            console.debug(`[${new Date()}][Artemis]] ${msg}`, ...optionalParams)
            break
        case "info":
            console.info(`[${new Date()}][Artemis] ${msg}`, ...optionalParams)
            break
        case "warn":
            console.warn(`[${new Date()}][Artemis] ${msg}`, ...optionalParams)
            break
        case "error":
            console.error(`[${new Date()}][Artemis] ${msg}`, ...optionalParams)
            break
    }
}
