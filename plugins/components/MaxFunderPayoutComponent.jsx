import React, {useState} from "react"
import {useContract} from "../helpers/AppHooks"
import {callAction, log} from "../helpers/helpers"
import {utils} from "ethers"
import {Button} from "./Button"
import {EMPTY_ADDRESS, LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {Input} from "./Input"
import {BigNumber} from "ethers"
import styled from "styled-components"
import {ze, fi, se, th} from "../helpers/styles"

export const MaxFunderPayoutComponent = ({a, minFunderPayout, maxFunderPayout}) => {
    const [maxFunderPayout_, setMaxFunderPayout_] = useState(maxFunderPayout)

    const [processing, setProcessing] = useState(false)

    const changeMaxFunderPayout = (e) => {
        const {value} = e.currentTarget
        if (+value >= minFunderPayout) {
            setMaxFunderPayout_(value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveMaxFunderPayout = () => {
        if (+maxFunderPayout_ < 0) {
            alert(" Max Funder Payout Must >= 0")
            setMaxFunderPayout_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [utils.parseEther(maxFunderPayout_)]
        const methodName = "setMaxFunderPayout"
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
        <div style={ze}>
            <span style={fi}> Max Funder Payout (xDai) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={maxFunderPayout_}
                    onChange={changeMaxFunderPayout}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button
                    onClick={saveMaxFunderPayout}
                    processing={processing}
                    on="Waiting"
                    off="Set Max Funder Payout"
                />
            </span>
        </div>
    )
}
