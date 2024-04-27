import React, {useState} from "react"
import {utils} from "ethers"
import {textCenter, table} from "../helpers/styles"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
// import {querySubgraph} from "../helpers/subgraph"
import {analysis} from "../helpers/arrivalAnalysis"
import {callAction} from "../helpers/helpers"
import {useContract} from "../helpers/AppHooks"
import {Btn} from "./Btn"
import styled from "styled-components"

const Row = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;

    & > span:first-child {
        /* flex-grow: 1; */
        width: "100px";
    }

    & > span:second-child {
        width: "400px";
    }
`

const fi = {
    textAlign: "left",
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
    const [mercenarySubmitAmount, setMercenarySubmitAmount] = useState(undefined)
    const [managerConfirmAmount, setManagerConfirmAmount] = useState(undefined)

    async function query() {
        if (!processing) {
            setProcessing(true)

            let addr = LOBBY_CONTRACT_ADDRESS
            let account = df.getAccount()

            let submitAmount = await a.getMercenarySubmitAmount(addr, t.taskId, account)
            let _ = utils.formatEther(submitAmount)

            let confirmAmount = await a.getManagerConfirmAmount(addr, t.taskId, account)
            let __ = utils.formatEther(confirmAmount)

            setManagerConfirmAmount(__)

            setMercenarySubmitAmount(_)

            let {amount, energyOfMe, energySum, energyPayoutLimit} = await analysis(t, own)

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

        if (amount === mercenarySubmitAmount) {
            alert("you have already submitted, waiting for the response for middleman")
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

    //generate by chatgpt 3.5
    function formatIntegerWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return (
        <div>
            <div style={textCenter}>
                <Row>
                    <span> Your Submit: </span>
                    <span> {mercenarySubmitAmount === undefined ? "?" : mercenarySubmitAmount} ETH </span>
                </Row>

                <Row>
                    <span> Middleman Confirm: </span>
                    <span> {managerConfirmAmount === undefined ? "?" : managerConfirmAmount} ETH </span>
                </Row>

                <Row>
                    <span> Your Reward: </span>
                    <span> {amount === undefined ? "?" : amount} ETH </span>
                </Row>
                <Row>
                    <span> Your Energy Sent: </span>

                    <span>{myEnergySum === undefined ? "?" : myEnergySum.toLocaleString()}</span>
                </Row>
                <Row>
                    {" "}
                    <span>Total Hunter Sent: </span>
                    <span>{energySum === undefined ? "?" : energySum.toLocaleString()}</span>
                </Row>
                <Row>
                    <span>Total Energy Needed:</span>
                    <span>{energyBonusLimit === undefined ? "?" : formatIntegerWithCommas(energyBonusLimit)}</span>
                </Row>

                <Row>
                    <Btn className="btn" disabled={processing} onClick={query} wide="48%">
                        query
                    </Btn>

                    <Btn className="btn" disabled={processing} onClick={claim} wide="48%">
                        claim
                    </Btn>
                </Row>
            </div>
        </div>
    )
}
