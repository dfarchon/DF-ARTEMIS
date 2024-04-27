import React, {useCallback, useEffect, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract, useCreatorFees} from "../helpers/AppHooks"
import {Input} from "./Input"
import {Btn} from "./Btn"
import {ButtonGroup, Separator} from "./CoreUI"
import {BigNumber, utils} from "ethers"
import {Button} from "./Button"
import dfstyles from "../helpers/dfstyles"

function WithdrawButton({disabled}) {
    if (disabled) {
        return null
    }

    const {a} = useContract()
    const [processing, setProcessing] = useState(false)

    function withdraw() {
        if (!processing) {
            setProcessing(true)
            let methodName = "collectFees"
            callAction(a, methodName, [])
                .then(() => {
                    setProcessing(false)
                })
                .catch((err) => {
                    setProcessing(false)
                    console.error(err)
                    notifyManager.txInitError(methodName, err.message)
                })
        }
    }

    return <Button onClick={withdraw} processing={processing} on="Waiting" off="Withdraw" />
}

function CreatorTakeAwayAllComponent() {
    const {a} = useContract()
    const [processing, setProcessing] = useState(false)

    function func() {
        if (!processing) {
            setProcessing(true)
            let methodName = "creatorTakeAwayAll"
            callAction(a, methodName, [])
                .then(() => setProcessing(false))
                .catch((err) => {
                    setProcessing(false)
                    console.error(err)
                    notifyManager.txInitError(methodName, err.message)
                })
        }
    }

    return <Button onClick={func} processing={processing} on="Waiting..." off="CreatorTakeAwayAll" />
}
export const CreatorFeesWithdrawComponent = () => {
    const {fee} = useCreatorFees()

    return (
        <div>
            {`Creator Fee Balance : ${utils.formatEther(fee)} ETH `}
            <WithdrawButton disabled={fee == 0} />

            <CreatorTakeAwayAllComponent />
        </div>
    )
}
