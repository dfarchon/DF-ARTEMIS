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

export const MinDurationTimeComponent = ({a, minDurationTime, maxDurationTime}) => {
    const [minDurationTime_, setMinDurationTime_] = useState(minDurationTime)
    const [processing, setProcessing] = useState(false)

    const changeMinDurationTime = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxDurationTime && +value >= 0) {
            setMinDurationTime_(value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveMinDurationTimeFee = () => {
        if (+minDurationTime_ < 0) {
            alert(" Min Duration Time Must >= 0")
            setMinDurationtime_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [minDurationTime_]
        const methodName = "setMinDurationTime"
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
            <span style={fi}> Min Duration Time (s) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={minDurationTime_}
                    onChange={changeMinDurationTime}
                    onKeyUp={onKeyUp}
                    step={30}
                />
            </span>{" "}
            <span style={th}>
                <Button
                    onClick={saveMinDurationTimeFee}
                    processing={processing}
                    on="Waiting"
                    off="Set Min Duration Time"
                />
            </span>
        </div>
    )
}
