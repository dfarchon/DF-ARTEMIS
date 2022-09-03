import React, {useState} from "react"
import {utils} from "ethers"
import {textCenter, table} from "../helpers/styles"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {querySubgraph} from "../helpers/subgraph"
import {callAction} from "../helpers/helpers"
import {useContract} from "../helpers/AppHooks"
import {Btn} from "./Btn"

const fi = {
    textAlign: "right",
    width: "200px",
    display: "inline-block",
}

const se = {
    textAlign: "center",
    width: "100px",
    display: "inline-block",
}
export const MercenarySubmitComponent = ({t}) => {
    const {a} = useContract()
    const [amount, setAmount] = useState(undefined)
    const [myEnergySum, setMyEnergySum] = useState(undefined)
    const [energySum, setEnergySum] = useState(undefined)
    const [energyBonusLimit, setEnergyBonusLimit] = useState(undefined)
    const [processing, setProcessing] = useState(false)

    async function query() {
        if (!processing) {
            setProcessing(true)

            let {amount, energyOfMe, energySum, energyPayoutLimit} = await querySubgraph(t, own)

            if (amount === undefined) {
                alert("subgraph query fail")
                setProcessing(false)
                return
            }

            // console.log(amount)
            // console.log(energyOfMe)
            // console.log(energySum)
            // console.log(energyPayoutLimit)

            setAmount(amount)
            setMyEnergySum(energyOfMe)
            setEnergySum(energySum)
            setEnergyBonusLimit(energyPayoutLimit)

            setProcessing(false)
        }
    }

    async function claim() {
        if (amount === undefined) {
            alert("Please Query First")
            return
        }
        if (amount === 0) {
            alert("Don't Have Amount To Submit")
            return
        }

        if (processing) return
        setProcessing(true)

        const methodName = "mercenarySubmit"

        let addr = LOBBY_CONTRACT_ADDRESS
        const input = [addr, t.taskId, utils.parseEther(amount.toString())]

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
        <div>
            <div style={textCenter}>
                <div>
                    <span style={fi}> Your Total Payout: </span>
                    <span style={se}> {amount === undefined ? "?" : amount} xDai </span>
                </div>
                <div>
                    <span style={fi}> Your Energy Sent: </span>

                    <span style={se}>{myEnergySum === undefined ? "?" : myEnergySum.toLocaleString()}</span>
                </div>
                <div>
                    {" "}
                    <span style={fi}>Total Mercenaries Sent:</span>
                    <span style={se}>{energySum === undefined ? "?" : energySum.toLocaleString()}</span>
                </div>
                <div>
                    <span style={fi}>Total Energy Needed:</span>
                    <span style={se}>{energyBonusLimit === undefined ? "?" : energyBonusLimit.toLocaleString()}</span>
                </div>
                <Btn className="btn" disabled={processing} onClick={query}>
                    {"query"}
                </Btn>{" "}
                <Btn className="btn" disabled={processing} onClick={claim}>
                    {"claim"}
                </Btn>
            </div>
        </div>
    )
}
