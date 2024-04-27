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

const Row = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;

    & > span:first-child {
        /* flex-grow: 1; */
        width: "100px";
    }

    & > span:second-child {
        width: "400px";
    }
`

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
                    <Row key={t.taskId + "-blacklist-" + i}>
                        <span>Blacklist #{i}:</span>
                        <span>{account}</span>
                    </Row>
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
                        <Btn style={{width: "100px"}} onClick={center}>
                            {" "}
                            Center{" "}
                        </Btn>
                    </td>
                    <td> {utils.formatEther(t.payoutBalance)} ETH</td>

                    <td> {utils.formatEther(t.x)} </td>

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
                            <Row key={t.taskId + "-beginTime"}>
                                <span> Begin Time</span>
                                <span>{formatTime(beginTime) + " UTC+0"}</span>
                            </Row>

                            <Row key={t.taskId + "-endTime"}>
                                <span> End Time</span>
                                <span>{formatTime(endTime) + " UTC+0"}</span>
                            </Row>

                            <Row key={t.taskId + "-currentTime"}>
                                <span>Current Time</span>
                                <span>{formatTime(undefined) + " UTC+0"}</span>
                            </Row>

                            <Row key={t.taskId + "-mastermind"}>
                                <span>Mastermind</span>
                                <span>{t.funder.toString()}</span>
                            </Row>

                            <Row key={t.taskId + "-middleman"}>
                                <span>Middleman</span>
                                <span>{t.manager.toString()}</span>
                            </Row>
                            {showBlacklist}

                            <Row key={t.taskId + "-balance/energy"}>
                                <span>{"Reward <=> Energy"}</span>
                                <span>{utils.formatEther(t.x.mul(1000)) + " ETH <=> 1000 Energy"} </span>
                            </Row>

                            <Row key={t.taskId + "-reward"}>
                                <span>Mission Reward Balance / Total</span>
                                <span>
                                    {utils.formatEther(t.payoutBalance)} ETH / {utils.formatEther(t.payoutTotal)} ETH{" "}
                                </span>
                            </Row>

                            {/* {state === 1 ? <FunderAddPayoutComponent t={t} /> : ""} */}
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
                            <th> Mission </th>
                            <th> Planet </th>
                            <th> Balance </th>
                            <th> Balance/Energy </th>
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
