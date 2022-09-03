import React, {useCallback, useEffect, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract, useCreatorFees} from "../helpers/AppHooks"
import {Input} from "./Input"
import {Btn} from "./Btn"
import {ButtonGroup, Separator} from "./CoreUI"
import {BigNumber, utils} from "ethers"
import {Button} from "./Button"
import dfstyles from "../helpers/dfstyles"
import {DFInput} from "./Input"
import {ze, fi, se, th} from "../helpers/styles"

export const CreatorChangedComponent = ({a, creator}) => {
    const [creator_, setCreator_] = useState(creator)
    const [processing, setProcessing] = useState(false)

    const changeCreator = (e) => {
        const {value} = e.currentTarget
        log(value.toLowerCase(), "debug")
        setCreator_(value.toLowerCase())
    }

    const saveCreator = () => {
        if (processing) return
        setProcessing(true)
        const input = [creator_]
        log(input, "debug")
        const methodName = "creatorChanged"
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
            <DFInput
                placeholder="someone's address"
                isAddress={true}
                type="string"
                value={creator_}
                onChange={changeCreator}
            />{" "}
            <span>
                <Button onClick={saveCreator} processing={processing} on="Waiting" off="Set Creator" />
            </span>
        </div>
    )
}
