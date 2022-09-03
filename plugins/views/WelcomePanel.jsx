import React from "react"
import {textCenter} from "../helpers/styles"
import styled from "styled-components"
import {useContract} from "../helpers/AppHooks"
import dfstyles from "../helpers/dfstyles"
import {ArtemisLabel} from "../components/labels/ArtemisLabel"
import {RiskLabel} from "../components/labels/RiskLabel"

const font = {
    fontSize: "30px",
    color: dfstyles.colors.dfyellow,
}

const warning = {
    color: "red",
}

export function WelcomePanel() {
    const {
        creatorFee,
        adminFee,
        managerFee,
        maxFee,
        isLobbyExists
    } = useContract()

    return (
        <div style={textCenter}>
            <div style={font}>
                <ArtemisLabel />
            </div>

            {isLobbyExists ? (
                <div>
                    <div>the smart contract and plugin have not been audited</div>
                    <div>you may lost your xdai or private key</div>
                    <RiskLabel />
                    <div> Creator Fee: {creatorFee} % </div>
                    <div> Admin Fee: {adminFee} % </div>
                    <div> manager Fee: {managerFee} % </div>




                </div>
            ) : (
                <div>
                    <div>Artemis is not open in this lobby,</div>
                    <div>please contact with the lobby admin to enable it.</div>
                </div>
            )}
        </div>
    )
}
