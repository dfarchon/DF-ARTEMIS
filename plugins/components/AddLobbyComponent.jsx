import React, {useState} from "react"
import {useContract} from "../helpers/AppHooks"
import {callAction, log} from "../helpers/helpers"
import {utils} from "ethers"
import {Button} from "./Button"
import {LOBBY_CONTRACT_ADDRESS, own} from "../constants"
import {textRight, ze} from "../helpers/styles"

export const AddLobbyComponent = () => {
    const {a, isLobbyExists, admin} = useContract()
    const [processing, setProcessing] = useState(false)

    async function addLobby() {
        if (processing === false) setProcessing(true)

        let addr_ = LOBBY_CONTRACT_ADDRESS
        let admin_ = own
        let fee_ = 0

        let methodName = "addLobby"
        let input = [addr_, admin_, fee_]

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

    const test = () => {
        console.log(admin)
    }
    return isLobbyExists ? (
        <div style={ze}>
            <div style={textRight}>admin : {admin} </div>
        </div>
    ) : (
        <div style={ze}>
            <Button onClick={addLobby} processing={processing} on="Waiting" off="Add Lobby" />
        </div>
    )
}
