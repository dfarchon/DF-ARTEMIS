import {log} from "./helpers"
import {locationIdToDecStr, locationIdFromDecStr} from "@darkforest_eth/serde"
import {BigNumber,utils} from "ethers"

export async function analysis(task, addr){
    const planetId = locationIdFromDecStr(task.planetId.toString());
    const beginTime = task.beginTime;
    const funder = task.funder.toLowerCase();
    const manager = task.manager.toLowerCase();
    const blacklist = task.blacklist.map(p=>p.toLowerCase());
    const account = addr.toLowerCase();

    const payoutTotal = BigNumber.from(task.payoutTotal);
    const x  = BigNumber.from(task.x);

    log("=== Arrival Analysis === ", "debug");
    log("planetId:" + planetId, "debug");
    log("beginTime:" + beginTime, "debug");
    log("x:" + x.toString(), "debug");
    log("payout total:" + utils.formatEther(payoutTotal), "debug");
    log("query account:" + account, "debug");
    log("funder:" + funder, "debug");
    log("manager:" + manager, "debug");
    log("blacklist:", "debug");
    log(blacklist, "debug");

    const  rawArrivals = await  df.getContractAPI().getTargetPlanetAllArrivals(planetId,beginTime);
    const arrivals = rawArrivals.filter((arr) => {
        let player = arr.player.toLowerCase()
        return player != funder && player != manager && blacklist.indexOf(player) === -1
    }).sort((a,b)=> a.departureTime<b.departureTime);


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

        let energy = Math.floor(arr.energyArriving)
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

            if (account === arr.player.toLowerCase()) energyOfMe += energyUse
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