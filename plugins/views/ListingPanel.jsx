import React, {useCallback, useState} from "react"
import {listStyle, textCenter, table} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract, useAllTasks, usePause} from "../helpers/AppHooks"
import {Input} from "../components/Input"
import {Btn} from "../components/Btn"
import {ButtonGroup, Separator} from "../components/CoreUI"
import {Button} from "../components/Button"
import {BigNumber, utils} from "ethers"
import {locationIdToDecStr, locationIdFromDecStr} from "@darkforest_eth/serde"
import {Loading} from "../components/Loading"
import {FunderAddPayoutComponent} from "../components/FunderAddPayoutComponent"
import {FunderLeaveComponent} from "../components/FunderLeaveComponent"
import {MercenarySubmitComponent} from "../components/MercenarySubmitComponent"
import {ManagerConfirmComponent} from "../components/ManagerConfirmComponent"

// import { BossAddBonusPanel } from "../components/BossAddBonusPanel";
// import { BossLeavePanel } from "../components/BossLeavePlanel";
// import { KillerClaimPanel } from "../components/KillerClaimPanel";
// import { AdminConfirmPanel } from "../components/AdminConfirmPanel";

//todo: sort
//todo: about pausedDurationTime

const defaultSort = [
    {key: "rarity", d: -1},
    {key: "price", d: 1},
]
function sortByKey(sorts) {
    // task1 task2
    function doSort(n1, n2) {
        let ret = 0
        for (let i = 0; i < sorts.length; i++) {
            let {key, d} = sorts[i]
        }
    }
}

// state == 1   boss listing
// state == 2   admin listing
// state == 3    killer listing
export function ListingPanel({state}) {
    const [active, setActive] = useState(undefined)
    const [sort, setSort] = useState(defaultSort)
    const {a} = useContract()
    const {pause} = usePause()

    // return {listingTasks,loading,error};
    const {listingTasks, loading} = useAllTasks(a, 60000)
    const tasks = listingTasks.value || []

    async function showTaskInfo() {
        console.log("showTaskInfo")
        console.log(listingTasks)
        console.log(tasks)
        // tasks.forEach((t) => {
        //     console.log(t.mercenaries)
        // })

        tasks.forEach((t) => {
            if (t.taskId.toNumber() === 22) {
                console.log(t)

                console.log("Payout Balance: " + utils.formatEther(t.payoutBalance))
                console.log(t.mercenaries)

                console.log("confirm before: " + value)
            }
        })
    }

    const listingChildren = tasks
        .filter((t) => {
            if (t.payoutBalance.isZero() === true) return false
            if (state === 1) return t.funder.toLowerCase() === own.toLowerCase()
            else if (state === 2) return t.manager.toLowerCase() === own.toLowerCase()
            else return true
        })
        // todo
        // .sort(sortByKey(sort))
        .map((t) => {
            let payoutBalance = BigNumber.from(t.payoutBalance)
            let x = BigNumber.from(t.x) //x wei/ energy
            let energy = payoutBalance.div(x)
            const formatBigNumber = (str) => {
                if (str.length <= 6) return str
                let num = str.length - 1
                let prefix = ""
                if (str[1] === "0" && str[2] === "0" && str[3] === "0" && str[4] === "0") prefix = "" + str[0]
                else if (str[1] !== "0" && str[2] === "0" && str[3] === "0" && str[4] === "0")
                    prefix = "" + str[0] + "." + str[1]
                else if (str[1] !== "0" && str[2] !== "0" && str[3] === "0" && str[4] === "0")
                    prefix = "" + str[0] + "." + str[1] + str[2]
                else if (str[1] !== "0" && str[2] !== "0" && str[3] !== "0" && str[4] === "0")
                    prefix = "" + str[0] + "." + str[1] + str[2] + str[3]
                else prefix = "" + str[0] + "." + str[1] + str[2] + str[3] + str[4]
                let res = prefix + "e" + num
                return res
            }

            const center = () => {
                let pid = locationIdFromDecStr(t.planetId.toString())
                log(pid, "info")

                let p = df.getPlanetWithId(pid)
                if (p === undefined) {
                    alert("This Planet Is Not In Your Map")
                    return
                }

                ui.centerLocationId(pid)
            }

            let showBlacklist = []
            let blacklist = t.blacklist
            for (let i = 0; i < blacklist.length; i++) {
                let account = blacklist[i].toString().toLowerCase()
                showBlacklist.push(
                    <div key={t.taskId + "blacklist" + i}>
                        {" "}
                        Blacklist #{i}: {account}{" "}
                    </div>
                )
            }

            // timer is Date()
            const formatTime = (timer) => {
                let date
                if (timer === undefined) date = new Date()
                else date = new Date(timer)
                let res = date.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
                return res
            }

            let beginTime = t.beginTime * 1000
            let endTime = t.beginTime.add(t.durationTime) * 1000

            const rows = [
                <tr
                    key={t.taskId}
                    style={{...table, backgroundColor: active && active.taskId == t.taskId ? "#252B43" : ""}}
                >
                    <td> #{t.taskId.toString()}</td>
                    <td>
                        {" "}
                        <Btn onClick={center}>Center View</Btn>
                    </td>
                    <td> {utils.formatEther(t.payoutBalance)} xDai</td>

                    <td> {formatBigNumber(t.x.toString())} </td>

                    <td> {formatBigNumber(energy.toString())}</td>
                    <td>
                        <Btn
                            style={{width: "100px"}}
                            onClick={
                                active === undefined || active.taskId !== t.taskId
                                    ? () => setActive(t)
                                    : () => setActive(undefined)
                            }
                        >
                            {active === undefined || active.taskId !== t.taskId ? "Details" : "Cancel"}
                        </Btn>
                    </td>
                </tr>,
            ]

            if (active && active.taskId == t.taskId) {
                rows.push(
                    <tr
                        key={t.taskId + "detail"}
                        style={{...table, backgroundColor: active && active.taskId == t.taskId ? "#252B43" : ""}}
                    >
                        <td colSpan="8">
                            <div key={t.taskId + "time"}>
                                {formatTime(beginTime) + " UTC+0 - " + formatTime(endTime) + " UTC+0"}
                            </div>

                            <div key={t.taskId + "now"}>Now:{formatTime(undefined) + " UTC+0"} </div>
                            <div key={t.taskId + "funder"}>Funder: {t.funder.toString()}</div>
                            <div key={t.taskId + "manager"}>Manager: {t.manager.toString()}</div>
                            {showBlacklist}
                            <div key={t.taskId + "x"}> {utils.formatEther(t.x)} xDai / Energy </div>
                            <div key={t.taskId + "payout"}>
                                Payout Balance: {utils.formatEther(t.payoutBalance)} xDai ; Payout Total:{" "}
                                {utils.formatEther(t.payoutTotal)} xDai
                            </div>

                            {state === 1 ? <FunderAddPayoutComponent t={t} /> : ""}
                            {state === 1 ? <FunderLeaveComponent t={t} /> : ""}
                            {state === 2 ? <ManagerConfirmComponent t={t} /> : ""}
                            {state === 3 ? <MercenarySubmitComponent t={t} /> : ""}
                        </td>
                    </tr>
                )
            }
            return rows
        })

    return (
        <div style={listStyle}>
            {/* <button onClick={showListTasks}> show list tasks</button> */}
            {/* {loading || pauseDurationTime===undefined? ( */}
            {/* <div><Btn onClick={showTaskInfo}> Show Task Info</Btn>{" "}</div> */}
            {loading || pause === undefined ? (
                <Loading />
            ) : pause ? (
                <div style={textCenter}>
                    <div style={{fontSize: "30px"}}> DF ARTEMIS IS PAUSED NOW</div>
                </div>
            ) : listingChildren.length ? (
                <table style={table}>
                    <thead>
                        <tr>
                            <th> Task </th>
                            <th> Selected Planet </th>
                            <th> Balance </th>
                            <th> Pay Rate</th>
                            <th> Energy </th>
                            <th> More </th>
                        </tr>
                    </thead>
                    <tbody>{listingChildren}</tbody>
                </table>
            ) : (
                <div style={textCenter}>No task listing right now.</div>
            )}
        </div>
    )
}
