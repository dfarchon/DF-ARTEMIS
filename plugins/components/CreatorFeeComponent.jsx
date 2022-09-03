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

export const CreatorFeeComponent = ({a, creatorFee, maxFee}) => {
    const [creatorFee_, setCreatorFee_] = useState(creatorFee)
    const [processing, setProcessing] = useState(false)

    const changeCreatorFee = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFee && +value >= 0) {
            setCreatorFee_(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveCreatorFee = () => {
        if (+creatorFee_ < 0) {
            alert(" Min Creator Fee Must >= 0")
            setCreatorFee_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [BigNumber.from(Math.round(creatorFee_ * 100))]
        log(input, "debug")
        const methodName = "setCreatorFee"
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
            <span style={fi}> Creator Fee (%) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={creatorFee_}
                    onChange={changeCreatorFee}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button onClick={saveCreatorFee} processing={processing} on="Waiting" off="Set Creator Fee" />
            </span>
        </div>
    )
}
