import {Button} from "../components/Button"
import {callAction, log} from "../helpers/helpers"
import React, {useState} from "react"
import {notifyManager} from "../constants"
import {useBalance, useContract} from "../helpers/AppHooks"
import styled from "styled-components"
import dfstyles from "../helpers/dfstyles"
import {utils} from "ethers"

const FooterBar = styled.div`
    padding: 8px 8px 0px 8px;
    margin: 0px -5px;
    border-top: 1px solid ${dfstyles.colors.border};
    width: 555px;
`

const Support = styled.div`
    float: right;
`

function WithdrawButton({disabled}) {
    if (disabled) {
        return null
    }

    const {a} = useContract()
    const [processing, setProcessing] = useState(false)

    function withdraw() {
        if (!processing) {
            setProcessing(true)
            let methodName = "withdraw"
            callAction(a, methodName, [])
                .then(() => {
                    setProcessing(false)
                })
                .catch((err) => {
                    setProcessing(false)
                    log(err, "error")
                    notifyManager.txInitError(methodName, err.message)
                })
        }
    }

    return <Button onClick={withdraw} processing={processing} on="Waiting" off="Withdraw" />
}

export function FooterPanel() {
    const {balance} = useBalance()

    return (
        <FooterBar>
            {`Balance: ${utils.formatEther(balance)} ETH `}

            <WithdrawButton disabled={balance == 0} />

            <Support>
                <a href="https://discord.gg/XpBPEnsvgX" target="_blank">
                    Get Support
                </a>
            </Support>
        </FooterBar>
    )
}
