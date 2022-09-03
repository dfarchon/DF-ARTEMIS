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

export const MaxDurationTimeComponent = ({a, minDurationTime, maxDurationTime}) => {
    const [maxDurationTime_, setMaxDurationTime_] = useState(maxDurationTime)
    const [processing, setProcessing] = useState(false)

    const changeMaxDurationTime = (e) => {
        const {value} = e.currentTarget
        if (+value <= 60 * 60 * 24 * 10 && +value >= minDurationTime) {
            setMaxDurationTime_(value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveMaxDurationTimeFee = () => {
        if (+maxDurationTime_ < 0) {
            alert(" Max Duration Time Must >= 0")
            setMaxDurationTime_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [maxDurationTime_]
        const methodName = "setMaxDurationTime"
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
            <span style={fi}> Max Duration Time (s) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={maxDurationTime_}
                    onChange={changeMaxDurationTime}
                    onKeyUp={onKeyUp}
                    step={30}
                />
            </span>{" "}
            <span style={th}>
                <Button
                    onClick={saveMaxDurationTimeFee}
                    processing={processing}
                    on="Waiting"
                    off="Set Max Duration Time"
                />
            </span>
        </div>
    )
}
