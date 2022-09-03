import React, {useCallback, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "./Input"
import {Btn} from "./Btn"
import {ButtonGroup, Separator} from "./CoreUI"
import {Button} from "./Button"
import {BigNumber, utils} from "ethers"
import {querySubgraph} from "../helpers/subgraph"

// function adminConfirm(
//     address addr,
//     uint256 taskId,
//     address killer,
//     uint256 amount
// ) external lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
//     KillerClubTask.adminConfirm(addr, taskId, killer, amount);
//     emit AdminConfirm(addr, taskId, killer, amount);
// }

const fi = {width: "150px"}
const se = {width: "150px"}
const th = {width: "60px", display: "inline-block"}
const fo = {width: "60px", display: "inline-block"}

const ManagerConfirmForOne = ({t, account}) => {
    const {a} = useContract()

    const [mercenarySubmitAmount, setMercenarySubmitAmount] = useState(undefined)
    const [managerQueryAmount, setManagerQueryAmount] = useState(undefined)
    const [processing, setProcessing] = useState(false)

    async function query() {
        if (!processing) {
            setProcessing(true)
            let addr = LOBBY_CONTRACT_ADDRESS

            let submitAmount = await a.getMercenarySubmitAmount(addr, t.taskId, account)
            let _ = utils.formatEther(submitAmount)

            setMercenarySubmitAmount(_)

            let {amount, energyOfMe, energySum, energyCounted, energyPayoutLimit} = await querySubgraph(t, account)

            if (amount === undefined) {
                alert("Subgraph Query Fail")
                setProcessing(false)
                return
            }

            setManagerQueryAmount(amount)
            setProcessing(false)
        }
    }

    async function confirm() {
        if (mercenarySubmitAmount === undefined) {
            alert("Please Query First")
            return
        }

        if (+mercenarySubmitAmount !== +managerQueryAmount) {
            console.log(+mercenarySubmitAmount)
            console.log(+managerQueryAmount)
            alert("Amount Not Equal")
            return
        }

        if (processing) return
        setProcessing(true)
        const methodName = "managerConfirm"
        let addr = LOBBY_CONTRACT_ADDRESS
        const input = [addr, t.taskId, account.toLowerCase(), utils.parseEther(managerQueryAmount)]

        const overrides = {
            gasLimit: 5000000,
            gasPrice: undefined,
        }

        callAction(a, methodName, input, overrides)
            .catch((err) => {
                console.error(err)
                notifyManager.txInitError(methodName, err.message)
            })
            .finally(() => {
                setProcessing(false)
            })
    }

    return (
        <tr key={t.taskId + account}>
            <th style={fi}> {mercenarySubmitAmount === undefined ? "?" : mercenarySubmitAmount} xDai </th>
            <th style={se}> {managerQueryAmount === undefined ? "?" : managerQueryAmount} xDai</th>

            <th style={th}>
                <Btn className="btn" disabled={processing} onClick={query}>
                    Query
                </Btn>
            </th>
            <th style={fo}>
                <Btn className="btn" disabled={processing} onClick={confirm}>
                    Confirm
                </Btn>
            </th>
        </tr>
    )
}

export const ManagerConfirmComponent = ({t}) => {
    const mercenaries = t.mercenaries || []

    const mercenaryRows = mercenaries.map((killer) => {
        const res = [<ManagerConfirmForOne t={t} account={killer.toString()} key={t.taskId + t.manager + killer} />]
        return res
    })

    return (
        <div>
            <div>
                {" "}
                {mercenaries.length} {mercenaries.length <= 1 ? "Mercenary" : "Mercenaries"} Submit Task{" "}
            </div>
            {mercenaries.length > 0 ? (
                <div>
                    <table style={{margin: "auto"}}>
                        <thead>
                            <tr>
                                <th style={fi}> Mercenary Submit </th>
                                <th style={se}> Manager Query </th>

                                <th style={th}> </th>
                                <th style={fo}> </th>
                            </tr>
                        </thead>
                        <tbody style={{textAlign: "center"}}>{mercenaryRows}</tbody>
                    </table>
                </div>
            ) : (
                ""
            )}
        </div>
    )
}
