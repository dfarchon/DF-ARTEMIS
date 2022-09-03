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

// for creator && admin
export const AdminFeeComponent = ({a, adminFee, maxFee}) => {
    const [adminFee_, setAdminFee_] = useState(adminFee)
    const [processing, setProcessing] = useState(false)

    const changeAdminFee = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFee && +value >= 0) {
            setAdminFee_(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const saveAdminFee = () => {
        if (+adminFee_ < 0) {
            alert(" Min Admin Fee Must >= 0")
            setAdminFee_(0)
            return
        }

        if (processing) return
        setProcessing(true)

        let addr = LOBBY_CONTRACT_ADDRESS
        let fee = BigNumber.from(Math.round(adminFee_ * 100))

        const input = [addr, fee]
        log(input, "debug")
        const methodName = "setLobbyFee"
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
            <span style={fi}> Admin Fee (%) </span>{" "}
            <span style={se}>
                <Input
                    placeholder="%"
                    isAddress={false}
                    type="number"
                    value={adminFee_}
                    onChange={changeAdminFee}
                    onKeyUp={onKeyUp}
                    step={0.1}
                />
            </span>{" "}
            <span style={th}>
                <Button onClick={saveAdminFee} processing={processing} on="Waiting" off="Set Admin Fee" />
            </span>
        </div>
    )
}
