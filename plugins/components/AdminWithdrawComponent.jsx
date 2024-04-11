import React, {useCallback, useEffect, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "../components/Input"
import {Btn} from "../components/Btn"
import {ButtonGroup, Separator} from "../components/CoreUI"
import {BigNumber, utils} from "ethers"
import {useLobbyFees} from "../helpers/AppHooks"
import {Button} from "../components/Button"

function WithdrawButton({disabled}) {
    if (disabled) {
        return null
    }

    const {a} = useContract()
    const [processing, setProcessing] = useState(false)
    let addr = LOBBY_CONTRACT_ADDRESS

    function withdraw() {
        if (!processing) {
            setProcessing(true)
            let methodName = "collectLobbyFees"
            let input = [addr]

            callAction(a, methodName, input)
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

export function AdminWithdrawComponent() {
    // const {kc} = useContract();
    const {fee} = useLobbyFees()

    return (
        <div style={{textAlign: "center"}}>
            {`Admin Fee Balance: ${utils.formatEther(fee)} ETH `}
            <WithdrawButton disabled={fee == 0} />
        </div>
    )
}
