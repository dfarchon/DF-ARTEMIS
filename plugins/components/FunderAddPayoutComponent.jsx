import React, {useCallback, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "./Input"
import {Btn} from "./Btn"
import {BigNumber, utils} from "ethers"
import { EmSpacer } from "./CoreUI"

const SectionHeader = styled.div`
    color: "color(" #bbb ").hex()";
    text-decoration: underline;
    font-weight: bold;
    display: inline;
    margin-bottom: 3px;
    display: block;
`

const Section = styled.div`
    padding: 5px 0;

    &:first-child {
        margin-top: -3px;
    }

    &:last-child {
        border-bottom: none;
    }
`

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
    width: "100px",
    textAlign: "right",
}

const se = {
    width: "80px",
    textAlign: "center",
}

const th = {
    width: "160px",
}
const fo = {
    width: "200px",
}

export const FunderAddPayoutComponent = ({t}) => {
    let addr = LOBBY_CONTRACT_ADDRESS
    const {
        a,
        isLobbyExists,
        creatorFee,
        adminFee,
        managerFee,
        maxFee,
        creator,
        admin,
        isCreator,
        isAdmin,
        minDurationTime,
        maxDurationTime,
        minFunderPayout,
        maxFunderPayout,
    } = useContract()

    let _ = utils.formatEther(t.payoutTotal)
    const [payout, setPayout] = useState(_)

    const changePayout = (e) => {
        const {value} = e.currentTarget
        if (+value <= maxFunderPayout && +value >= _) {
            setPayout(+value)
        }
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    const [processing, setProcessing] = useState(false)

    async function save() {
        if (!processing) {
            setProcessing(true)
            const methodName = "funderAddPayout"

            let amount = payout - _

            if (amount <= 0) {
                alert("payout should be more")

                setProcessing(false)
                return
            }

            console.log(amount)

            let input = [addr, t.taskId, utils.parseEther(amount.toString())]
            console.log(input)

            const overrides = {
                gasLimit: 5000000,
                gasPrice: undefined,
                value: utils.parseEther(amount.toString()),
            }
            console.log(overrides)

            callAction(a, methodName, input, overrides)
                .catch((err) => {
                    console.error(err)
                    notifyManager.txInitError(methodName, err.message)
                })
                .finally(() => {
                    setProcessing(false)
                })
        }
    }

    return (
        <div>
            <Section>
                <SectionHeader> Add Reward (ETH) </SectionHeader>
                <Row>
                    <span>
                        Add reward amount: {payout} ETH
                    </span>
                    <span>
                    <Input
                        placeholder="ETH"
                        wide={true}
                        type="number"
                        value={payout}
                        onChange={changePayout}
                        onKeyUp={onKeyUp}
                        step={0.001}
                        style={{width:'200px'}}
                    />
                    </span>
                    
                </Row>
                <EmSpacer height='10px' />
                <div>
                <Btn className="btn" disabled={processing}  onClick={save} wide='500px'>
                    Add Mission Reward
                </Btn>
                </div>
            </Section>
      
            
        </div>
    )
}
