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

export const MinFunderPayoutComponent = ({a, minFunderPayout, maxFunderPayout}) => {
    const [minFunderPayout_, setMinFunderPayout_] = useState(minFunderPayout)

    const [processing, setProcessing] = useState(false)

    const changeMinFunderPayout = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFunderPayout && +value >= 0) {
            setMinFunderPayout_(value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveMinFunderPayout = () => {
        if (+minFunderPayout_ < 0) {
            alert(" Min Funder Payout Must >= 0")
            setMinFunderPayout_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [utils.parseEther(minFunderPayout_)]
        const methodName = "setMinFunderPayout"
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
            <span style={fi}> Min Funder Payout (ETH) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={minFunderPayout_}
                    onChange={changeMinFunderPayout}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button onClick={saveMinFunderPayout} processing={processing} on="Waiting" off="Set Min Payout" />
            </span>
        </div>
    )
}
