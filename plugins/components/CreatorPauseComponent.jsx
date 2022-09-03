import React, {useState} from "react"
import {useContract, usePause} from "../helpers/AppHooks"
import {callAction, log} from "../helpers/helpers"
import {utils} from "ethers"
import {Button} from "./Button"
import {Btn} from "./Btn"
import {EMPTY_ADDRESS, LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {Input} from "../components/Input"
import {BigNumber} from "ethers"
import styled from "styled-components"
import {ze, fi, se, th} from "../helpers/styles"
import {Loading} from "./Loading"

export const CreatorPauseComponent = ({a}) => {
    const {pause} = usePause()

    const [processing, setProcessing] = useState(false)

    const creatorPause = () => {
        if (processing) return
        setProcessing(true)
        const methodName = "pause"
        callAction(a, methodName, [])
            .catch((err) => {
                console.error(err)
                notifyManager.txInitError(methodName, err.message)
            })
            .finally(() => {
                setProcessing(false)
            })
    }

    const creatorUnpause = () => {
        if (processing) return
        setProcessing(true)
        const methodName = "unpause"
        callAction(a, methodName, [])
            .catch((err) => {
                console.error(err)
                notifyManager.txInitError(methodName, err.message)
            })
            .finally(() => {
                setProcessing(false)
            })
    }

    return (
        <div style={ze}>
            {pause === undefined ? (
                <Loading />
            ) : (
                <div>
                    {/* <div> Pause State : {pause ? "true" : "false"}</div> */}
                    <Btn onClick={creatorPause} disabled={processing || pause} style={se}>
                        Pause
                    </Btn>{" "}
                    <Btn onClick={creatorUnpause} disabled={processing || !pause} style={se}>
                        Unpause
                    </Btn>
                </div>
            )}
        </div>
    )
}
