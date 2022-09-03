import {useCallback, useEffect, useMemo, useState, useContext} from "react"
import {EMPTY_ADDRESS, ARTEMIS_CONTRACT_ADDRESS, LOBBY_CONTRACT_ADDRESS, own} from "../constants"
import {ContractContext} from "./ContractContext.js"
import {getAllTasks, notify, log} from "./helpers"
import {utils} from "ethers"
import {UnicodeNormalizationForm} from "ethers/lib/utils"

/**
 * React uses referential identity to detect changes, and rerender. Rather
 * than copying an object into a new object, to force a rerender, we can
 * just wrap it in a new {@code Wrapper}, which will force a rerender.
 */
export class Wrapper {
    constructor(value) {
        this.value = value
    }

    or(wrapper) {
        return new Wrapper(this.value || wrapper.value)
    }
}

/**
 * Executes the callback `cb` every `poll` ms
 * @param cb callback to execute
 * @param poll ms to poll
 * @param execFirst if we want to execute the callback on first render
 */
export function usePoll(
    cb, //: () => void,
    poll, // : number | undefined = undefined,
    execFirst //: boolean | undefined = undefined
) {
    useEffect(() => {
        if (execFirst) cb()

        if (!poll) return
        const interval = setInterval(() => cb(), poll)

        log(`Interval ${interval} created`, "debug")

        return () => {
            log(`Interval ${interval} cleared`, "debug")
            clearInterval(interval)
        }
    }, [poll, cb, execFirst])
}

export const useContract = () => useContext(ContractContext)

export function useBalance() {
    const {a} = useContract()
    const [balance, setBalance] = useState(0)

    async function updateBalance() {
        setBalance(await a.getMyBalance())
    }

    useEffect(() => {
        a.on("FunderPublish", updateBalance)
        a.on("FunderAddPayout", updateBalance)
        a.on("MercenarySubmit", updateBalance)
        a.on("GiveTips", updateBalance)
        a.on("ManagerConfirm", updateBalance)
        a.on("FunderLeave", updateBalance)
        a.on("Withdraw", updateBalance)

        return () => {
            a.off("FunderPublish", updateBalance)
            a.off("FunderAddPayout", updateBalance)
            a.off("MercenarySubmit", updateBalance)
            a.off("GiveTips", updateBalance)
            a.off("ManagerConfirm", updateBalance)
            a.off("FunderLeave", updateBalance)
            a.off("Withdraw", updateBalance)
        }
    }, [])

    useEffect(() => {
        a.getMyBalance().then((b) => setBalance(b))
    }, [])

    return {balance}
}

export function useCreatorFees() {
    const {a} = useContract()
    const [fee, setFee] = useState(0)

    const load = useCallback(async function load() {
        try {
            const res = await a.getFeeBalance()
            setFee(res)
        } catch (e) {
            log("error loading owner fees", "error", e)
        }
    }, [])

    usePoll(load, 10000, true)

    return {fee}
}

export function useLobbyFees() {
    const {a} = useContract()
    const [fee, setFee] = useState(0)

    const load = useCallback(async function load() {
        try {
            const fee = await a.getLobbyFeeBalance(LOBBY_CONTRACT_ADDRESS)
            setFee(fee)
        } catch (e) {
            log("error loading lobby fees", "error", e)
        }
    }, [])

    usePoll(load, 10000, true)
    return {fee}
}

export function usePause() {
    const {a} = useContract()
    const [pause, setPause] = useState(undefined)
    const load = useCallback(async function load() {
        try {
            const state = await a.getIfLobbyPause(LOBBY_CONTRACT_ADDRESS)
            setPause(state)
        } catch (e) {
            log("error loading pause state", "error", e)
        }
    }, [])

    usePoll(load, 2000, true)
    return {pause}
}

export function useLobbyAnalysis() {
    const {a} = useContract()

    let addr = LOBBY_CONTRACT_ADDRESS
    const [pause, setPause] = useState(undefined)
    const [taskCount, setTaskCount] = useState(undefined)
    const [funderPayoutSum, setFunderPayoutSum] = useState(undefined)
    const [funderTakeAwaySum, setFunderTakeAwaySum] = useState(undefined)
    const [creatorFeesSum, setCreatorFeesSum] = useState(undefined)
    const [adminFeesSum, setAdminFeesSum] = useState(undefined)
    const [managerFeesSum, setManagerFeesSum] = useState(undefined)
    const [tipsSum, setTipsSum] = useState(undefined)
    const [mercenariesSalarySum, setMercenariesSalarySum] = useState(undefined)

    const load = useCallback(async function load() {
        try {
            setPause(await a.getIfLobbyPause(addr))
            let value = await a.getTaskCount(addr)

            setTaskCount(value.toString())

            value = await a.getFunderPayoutSum(addr)
            setFunderPayoutSum(utils.formatEther(value))
            value = await a.getFunderTakeAwaySum(addr)
            setFunderTakeAwaySum(utils.formatEther(value))
            value = await a.getCreatorFeesSum(addr)
            setCreatorFeesSum(utils.formatEther(value))
            value = await a.getAdminFeesSum(addr)
            setAdminFeesSum(utils.formatEther(value))
            value = await a.getManagerFeesSum(addr)
            setManagerFeesSum(utils.formatEther(value))
            value = await a.getTipsSum(addr)
            setTipsSum(utils.formatEther(value))
            value = await a.getMercenariesSalarySum(addr)
            setMercenariesSalarySum(utils.formatEther(value))
        } catch (e) {
            log("error loading lobby analysis data", "error", e)
        }
    }, [])

    usePoll(load, 10000, true)

    return {
        pause,
        taskCount,
        funderPayoutSum,
        funderTakeAwaySum,
        creatorFeesSum,
        adminFeesSum,
        managerFeesSum,
        tipsSum,
        mercenariesSalarySum,
    }
}

// todo: only left useAll tasks

export function useAllTasks(a, poll) {
    const [listingTasks, setListingTasks] = useState(new Wrapper([]))
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime())

    const load = useCallback(async function load() {
        try {
            log("Loading Tasks", "debug")
            setLastRefreshTime(new Date().getTime())
            let tasks = await getAllTasks(a)

            // tasks = tasks.map(t=>buildTask(t));
            log("function useAllTasks", "info")
            // console.log(tasks)
            setListingTasks(new Wrapper(tasks))
        } catch (e) {
            log("error Loding Tasks", "error", e)
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    // event FunderPublish(address indexed addr, uint256 indexed taskId);

    async function onFunderPublish(addr, taskId) {
        log("on Funder Publish", "info")
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }
        notify(`Funder Publish: Task #${taskId}`)
    }

    async function onFunderAddPayout(addr, taskId, addPayoutAmount) {
        log("on Boss Add Payout", "info")
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }

        let amount = utils.formatEther(addPayoutAmount)
        notify(`Funder Add Payout: Task #${taskId} ${amount} xDai`)
    }

    async function onMercenarySubmit(addr, taskId, killer, amount) {
        log("on Mercenary Submit", "info")
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }

        let showAddress = killer.slice(0, 10)
        let showAmount = utils.formatEther(amount)
        notify(`Mercenary Submit: Task #${taskId} Mercenary ${showAddress} Claim ${showAmount} xDai`)
    }

    async function onGiveTips(addr, from, to, amount) {
        log("on Give Tips", "info")

        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }

        let showFrom = from.slice(0, 10)
        let showTo = to.slice(0, 10)
        let showAmount = utils.formatEther(amount)
        notify(`Give Tips: ${showFrom} to ${showTo} ${showAmount} xDai`)
    }

    async function onManagerConfirm(addr, taskId, killer, amount) {
        log("on Manager Confirm", "info")

        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }

        let showAddress = killer.slice(0, 10)
        let showAmount = utils.formatEther(amount)
        notify(`task #${taskId} Manager Confirm Mercenary ${showAddress} for ${showAmount} xDai`)
    }

    async function onFunderLeave(addr, taskId, amount) {
        log("on Funder Leave", "info")

        if (new Date().getTime() - lastRefreshTime > 1000) {
            load()
        }

        // let showAddress = killer.slice(0,10);
        let showAmount = utils.formatEther(amount)
        notify(`Funder Leave : Task #${taskId} Get Back ${showAmount} xDai`)
    }

    useEffect(() => {
        a.on("FunderPublish", onFunderPublish)
        a.on("FunderAddPayout", onFunderAddPayout)
        a.on("MercenarySubmit", onMercenarySubmit)
        a.on("GiveTips", onGiveTips)
        a.on("ManagerConfirm", onManagerConfirm)
        a.on("FunderLeave", onFunderLeave)

        return () => {
            a.off("FunderPublish", onFunderPublish)
            a.off("FunderAddPayout", onFunderAddPayout)
            a.off("MercenarySubmit", onMercenarySubmit)
            a.off("GiveTips", onGiveTips)
            a.off("ManagerConfirm", onManagerConfirm)
            a.off("FunderLeave", onFunderLeave)

            setLastRefreshTime(new Date().getTime())
            setListingTasks([])
            setLoading(false)
            setError(undefined)
        }
    }, [])

    usePoll(load, poll, listingTasks.value.length == 0)
    return {listingTasks, loading, error}
}

export function useLobbyInfo(a) {
    const [isLobbyExists, setIsLobbyExists] = useState(undefined)

    const [creatorFee, setCreatorFee] = useState(0)
    const [adminFee, setAdminFee] = useState(0)
    const [managerFee, setManagerFee] = useState(0)
    const [maxFee, setMaxFee] = useState(0)

    const [creator, setCreator] = useState(undefined)
    const [admin, setAdmin] = useState(undefined)

    const [isCreator, setIsCreator] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const [minDurationTime, setMinDurationTime] = useState(0)
    const [maxDurationTime, setMaxDurationTime] = useState(0)
    const [minFunderPayout, setMinFunderPayout] = useState(0)
    const [maxFunderPayout, setMaxFunderPayout] = useState(0)

    useEffect(() => {
        a.getIfLobbyExists(LOBBY_CONTRACT_ADDRESS).then((b) => {
            setIsLobbyExists(b)
            if (b) {
                a.getLobbyFee(LOBBY_CONTRACT_ADDRESS).then((c) => setAdminFee(parseInt(c, 10) / 100))
                a.getLobbyAdmin(LOBBY_CONTRACT_ADDRESS).then((c) => {
                    setAdmin(c.toLowerCase())
                    setIsAdmin(c.toLowerCase() === own.toLowerCase())
                })
            }
        })
        a.getCreatorFee().then((b) => setCreatorFee(parseInt(b, 10) / 100))
        a.getManagerFee().then((b) => setManagerFee(parseInt(b, 10) / 100))
        a.getMaxFee().then((b) => setMaxFee(parseInt(b, 10) / 100))
        a.getCreator().then((b) => {
            setCreator(b.toLowerCase())
            setIsCreator(b.toLowerCase() === own.toLowerCase())
        })
        a.getMinDurationTime().then((b) => setMinDurationTime(b))
        a.getMaxDurationTime().then((b) => setMaxDurationTime(b))
        a.getMinFunderPayout().then((b) => setMinFunderPayout(utils.formatEther(b)))
        a.getMaxFunderPayout().then((b) => setMaxFunderPayout(utils.formatEther(b)))
    }, [])

    async function CreatorFeeChanged(creatorFee) {
        setCreatorFee(parseInt(creatorFee, 10) / 100)
    }

    async function ManagerFeeChanged(managerFee) {
        setManagerFee(parseInt(managerFee, 10) / 100)
    }

    async function LobbyFeeChanged(addr, fee) {
        if (addr.toLowerCase() === LOBBY_CONTRACT_ADDRESS.toLowerCase()) {
            setAdminFee(parseInt(fee, 10) / 100)
        }
    }

    async function CreatorChanged(oldCreator, newCreator) {
        setCreator(newCreator.toLowerCase())
        setIsCreator(newCreator.toLowerCase() === own.toLowerCase())
    }

    async function LobbyAdminChanged(lobbyAddress, oldAdmin, newAdmin) {
        if (lobbyAddress.toLowerCase() === LOBBY_CONTRACT_ADDRESS.toLowerCase()) {
            setAdmin(newAdmin.toLowerCase())
            setIsAdmin(newAdmin.toLowerCase() === own.toLowerCase())
        }
    }

    async function MinDurationTimeChanged(minDurationTime) {
        setMinDurationTime(minDurationTime)
    }

    async function MaxDurationTimeChanged(maxDurationTime) {
        setMaxDurationTime(maxDurationTime)
    }

    async function MinFunderPayoutChanged(minFunderPayout) {
        setMinFunderPayout(utils.formatEther(minFunderPayout))
    }

    async function MaxFunderPayoutChanged(maxFunderPayout) {
        setMaxFunderPayout(utils.formatEther(maxFunderPayout))
    }

    async function MaxFeeChanged(maxFee) {
        setMaxFee(parseInt(maxFee, 10) / 100)
    }

    async function lobbyChange(addr, admin, fee) {
        if (addr.toLowerCase() === LOBBY_CONTRACT_ADDRESS.toLowerCase()) {
            setIsLobbyExists(true)
            setAdmin(admin.toLowerCase())
            setAdminFee(parseInt(fee, 10) / 100)
        }
    }

    useEffect(() => {
        a.on("CreatorFeeChanged", CreatorFeeChanged)
        a.on("ManagerFeeChanged", ManagerFeeChanged)
        a.on("LobbyFeeChanged", LobbyFeeChanged)
        a.on("CreatorChanged", CreatorChanged)
        a.on("LobbyAdminChanged", LobbyAdminChanged)
        a.on("MinDurationTimeChanged", MinDurationTimeChanged)
        a.on("MaxDurationTimeChanged", MaxDurationTimeChanged)
        a.on("MinFunderPayoutChanged", MinFunderPayoutChanged)
        a.on("MaxFunderPayoutChanged", MaxFunderPayoutChanged)
        a.on("MaxFeeChanged", MaxFeeChanged)
        a.on("AddLobby", lobbyChange)
        a.on("EditLobby", lobbyChange)

        return () => {
            a.off("CreatorFeeChanged", CreatorFeeChanged)
            a.off("ManagerFeeChanged", ManagerFeeChanged)
            a.off("LobbyFeeChanged", LobbyFeeChanged)
            a.off("CreatorChanged", CreatorChanged)
            a.off("LobbyAdminChanged", LobbyAdminChanged)
            a.off("MinDurationTimeChanged", MinDurationTimeChanged)
            a.off("MaxDurationTimeChanged", MaxDurationTimeChanged)
            a.off("MinFunderPayoutChanged", MinFunderPayoutChanged)
            a.off("MaxFunderPayoutChanged", MaxFunderPayoutChanged)
            a.off("MaxFeeChanged", MaxFeeChanged)
            a.off("AddLobby", lobbyChange)
            a.off("EditLobby", lobbyChange)
        }
    }, [])

    return {
        isLobbyExists,
        creatorFee,
        adminFee,
        managerFee,
        maxFee,
        creator,
        admin,
        isCreator,
        isAdmin,
        minDurationTime,
        maxDurationTime,
        minFunderPayout,
        maxFunderPayout,
    }
}
