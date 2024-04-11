import {createClient} from "urql"
import {utils} from "ethers"
import {SUBGRAPH_API_URL, notifyManager} from "../constants"
import {log} from "./helpers"
import {locationIdToDecStr, locationIdFromDecStr} from "@darkforest_eth/serde"
import {BigNumber} from "ethers"

export async function querySubgraph(t, account) {
    let planetId = locationIdFromDecStr(t.planetId.toString())

    console.log(planetId)

    let beginTime = t.beginTime
    let funder = t.funder.toLowerCase()
    let manager = t.manager.toLowerCase()
    let blacklist = t.blacklist.map((p) => p.toLowerCase())

    account = account.toLowerCase()

    let payoutTotal = BigNumber.from(t.payoutTotal)
    let x = BigNumber.from(t.x)

    log("XXX query Graph", "debug")
    log("planetId:" + planetId, "debug")
    log("beginTime:" + beginTime, "debug")
    log("x:" + t.x, "debug")
    log("payout total:" + utils.formatEther(t.payoutTotal.toString()), "debug")
    log("query account:" + account, "debug")
    log("funder:" + funder, "debug")
    log("manager:" + manager, "debug")
    log("blacklist:", "debug")
    log(blacklist, "debug")

    // query subgraph to get arrivals
    let arrivals = []

    const client = createClient({url: SUBGRAPH_API_URL})

    try {
        for (let i = 0; ; i++) {
            let first = 1000
            let skip = i * 1000

            let query = `
        {
            arrivals(first: ${first}, skip: ${skip},orderBy: arrivalTime, orderDirection: asc,where: {toPlanet:"${planetId}",  departureTime_gt:${beginTime}}){
                id
            player {
              id
            }
            milliEnergyArriving
            departureTime
            arrivalTime
            arrived    
            }
          }
        `
            const data = await client.query(query).toPromise()
            let queryResult = data?.data?.arrivals
            queryResult.forEach((arr) => arrivals.push(arr))

            if (queryResult.length < 1000) break
        }
    } catch (e) {
        log(e, "error")
        notifyManager.txInitError("query graph error", "")
        let fi = undefined
        let se = undefined
        let th = undefined
        let fo = undefined
        let fiv = undefined
        return {fi, se, th, fo, fiv}
    }

    arrivals = arrivals.filter((arr) => {
        let player = arr.player.id.toLowerCase()
        return player != funder && player != manager && blacklist.indexOf(player) === -1
    })

    // sort arrival by arrivalTime
    arrivals = arrivals.sort((a, b) => {
        if (a.arrivalTime === b.arrivalTime) return a.departureTime < b.departureTime
        else return a.arrivalTime < b.arrivalTime
    })

    for (let i = 0; i < arrivals.length; i++) {
        let rhs = arrivals[i]
        console.log("%s %s %s", beginTime, rhs.departureTime, rhs.arrivalTime)
    }

    let energyPayoutLimit = payoutTotal.div(x)
    let energySum = 0
    let energyOfMe = 0
    let energyCounted = 0

    for (let i = 0; i < arrivals.length; i++) {
        let arr = arrivals[i]

        let energy = Math.floor(0.001 * parseInt(arr.milliEnergyArriving))
        log(i + " " + energy, "debug")

        energySum += energy

        let energyUse = 0
        if (energyCounted + energy >= energyPayoutLimit) {
            let _ = Math.floor(energyPayoutLimit - energyCounted)
            energyUse = Math.max(0, _)
        } else {
            energyUse = energy
        }

        if (energyUse !== 0) {
            energyCounted += energyUse

            if (account === arr.player.id.toLowerCase()) energyOfMe += energyUse
        }
    }

    let amount = utils.formatEther(x.mul(energyOfMe).toString())
    // A has account
    // A can claim ${amount} ETH
    // A sent ${energyOfMe} energy
    // planet (ID is planetId) recevied energySum energy
    // ${energyPayoutLimit} energy are needed

    energyPayoutLimit = energyPayoutLimit.toString()

    return {amount, energyOfMe, energySum, energyCounted, energyPayoutLimit}
}
