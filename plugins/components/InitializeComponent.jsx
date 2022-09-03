import React, {useState} from "react"
import {useContract} from "../helpers/AppHooks"
import {callAction, log} from "../helpers/helpers"
import {utils} from "ethers"
import {Button} from "./Button"
import {EMPTY_ADDRESS, own} from "../constants"
import {textRight, ze} from "../helpers/styles"

export const InitializeComponent = () => {
    const {a, creator} = useContract()
    const [processing, setProcessing] = useState(false)

    async function initialize() {
        if (processing === false) setProcessing(true)

        // function initialize(
        //     uint256 creatorFee,
        //     uint256 managerFee,
        //     uint256 minDurationTime,
        //     uint256 maxDurationTime,
        //     uint256 minFunderPayout,
        //     uint256 maxFunderPayout,
        //     uint256 maxFee,
        //     address creator
        // ) public initializer

        let creatorFee = 1000
        let managerFee = 1000
        let minDurationTime = 60 * 5
        let maxDurationTime = 60 * 60 * 24
        let minFunderPayout = utils.parseEther("0.1")
        let maxFunderPayout = utils.parseEther("1000")
        let maxFee = 2000
        let creator = own

        let methodName = "initialize"
        let input = [
            creatorFee,
            managerFee,
            minDurationTime,
            maxDurationTime,
            minFunderPayout,
            maxFunderPayout,
            maxFee,
            creator,
        ]

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

    return creator === undefined || creator === EMPTY_ADDRESS ? (
        <div style={ze}>
            <Button onClick={initialize} processing={processing} on="Waiting" off="Initialize" />
        </div>
    ) : (
        <div style={ze}>
            <div style={textRight}>creator : {creator}</div>
        </div>
    )
}
