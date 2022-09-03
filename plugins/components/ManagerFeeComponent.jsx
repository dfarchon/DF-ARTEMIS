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

export const ManagerFeeComponent = ({a, managerFee, maxFee}) => {
    const [managerFee_, setManagerFee_] = useState(managerFee)
    const [processing, setProcessing] = useState(false)

    const changeManagerFee = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFee && +value >= 0) {
            setManagerFee_(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveManagerFee = () => {
        if (+managerFee_ < 0) {
            alert(" Min Manager Fee Must >= 0")
            setManagerFee_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        const input = [BigNumber.from(Math.round(managerFee_ * 100))]
        log(input, "debug")
        const methodName = "setManagerFee"

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
            <span style={fi}> Manager Fee (%) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={managerFee_}
                    onChange={changeManagerFee}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button onClick={saveManagerFee} processing={processing} on="Waiting" off="Set Manager Fee" />
            </span>
        </div>
    )
}
