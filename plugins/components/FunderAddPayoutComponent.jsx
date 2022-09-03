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

const fi = {
    width: "100px",
    textAlign: "right",
}

const se = {
    width: "80px",
    textAlign: "center",
}

const th = {
    width: "160px",
}
const fo = {
    width: "200px",
}

export const FunderAddPayoutComponent = ({t}) => {
    let addr = LOBBY_CONTRACT_ADDRESS
    const {
        a,
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
    } = useContract()

    let _ = utils.formatEther(t.payoutTotal)
    const [payout, setPayout] = useState(_)

    const changePayout = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFunderPayout && +value >= _) {
            setPayout(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const [processing, setProcessing] = useState(false)

    async function save() {
        if (!processing) {
            setProcessing(true)
            const methodName = "funderAddPayout"

            let amount = payout - _

            if (amount <= 0) {
                alert("payout should be more")

                setProcessing(false)
                return
            }

            console.log(amount)

            let input = [addr, t.taskId, utils.parseEther(amount.toString())]
            console.log(input)

            const overrides = {
                gasLimit: 5000000,
                gasPrice: undefined,
                value: utils.parseEther(amount.toString()),
            }
            console.log(overrides)

            callAction(a, methodName, input, overrides)
                .catch((err) => {
                    console.error(err)
                    notifyManager.txInitError(methodName, err.message)
                })
                .finally(() => {
                    setProcessing(false)
                })
        }
    }

    return (
        <div>
            <span style={fi}> New Payout (xDai)</span>{" "}
            <span style={se}>
                <Input
                    placeholder="xDai"
                    wide={true}
                    type="number"
                    value={payout}
                    onChange={changePayout}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            {/* <span style={th}> </span> */}
            <span style={th}>
                <Btn className="btn" disabled={processing} style={th} onClick={save}>
                    {"Set New Payout"}
                </Btn>
            </span>
        </div>
    )
}
