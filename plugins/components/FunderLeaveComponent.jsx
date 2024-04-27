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

export const FunderLeaveComponent = ({t}) => {
    let addr = LOBBY_CONTRACT_ADDRESS
    const {a} = useContract()

    const [processing, setProcessing] = useState(false)

    async function funderLeave() {
        if (!processing) {
            setProcessing(true)
            const methodName = "funderLeave"

            let input = [addr, t.taskId]

            const overrides = {
                gasLimit: 5000000,
                gasPrice: undefined,
            }

            console.log(input)
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
        <div style={{padding: "5px"}}>
            <Btn disabled={processing} onClick={funderLeave} wide="100%">
                Mastermind end this mission
            </Btn>
        </div>
    )
}
