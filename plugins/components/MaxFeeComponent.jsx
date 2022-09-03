import React, {useState} from "react"
import {useContract} from "../helpers/AppHooks"
import {callAction, log} from "../helpers/helpers"
import {utils} from "ethers"
import {Button} from "./Button"
import {EMPTY_ADDRESS, LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {Input} from "../components/Input"
import {BigNumber} from "ethers"
import styled from "styled-components"
import {ze, fi, se, th} from "../helpers/styles"

export const MaxFeeComponent = ({a, maxFee, creator}) => {
    const [maxFee_, setMaxFee_] = useState(maxFee)
    const [processing, setProcessing] = useState(false)

    const changeMaxFee = (e) => {
        const {value} = e.currentTarget
        if (+value <= 100 && +value >= 0) {
            setMaxFee_(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveMaxFee = () => {
        if (+maxFee_ < 0) {
            alert(" Min Fee must >= 0")
            setMaxFee_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [BigNumber.from(Math.round(maxFee_ * 100))]

        log(input, "debug")

        const methodName = "setMaxFee"
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
            <span style={fi}> Max Fee (%) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={maxFee_}
                    onChange={changeMaxFee}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button onClick={saveMaxFee} processing={processing} on="Waiting" off="Set Max Fee" />
            </span>
        </div>
    )
}
