import React, {useMemo} from "react"
import {textCenter} from "../helpers/styles"
import styled from "styled-components"
import {useContract} from "../helpers/AppHooks"
import dfstyles from "../helpers/dfstyles"
import {ArtemisLabel} from "../components/labels/ArtemisLabel"
import {RiskLabel} from "../components/labels/RiskLabel"
import {version} from "../constants"

const font = {
    fontSize: "30px",
    color: dfstyles.colors.dfyellow,
}

const warning = {
    color: "red",
}

export function WelcomePanel() {
    const {creatorFee, adminFee, managerFee, maxFee, isLobbyExists} = useContract()

    const fee = useMemo(() => {
        return creatorFee + adminFee + managerFee
    }, [creatorFee, adminFee, managerFee])

    return (
        <div style={textCenter}>
            <div style={font}>
                <ArtemisLabel />
            </div>

            <div style={{color: "gold"}}>
                {version} / Total Fee: {fee}%
            </div>
            {isLobbyExists ? (
                <div>
                    <div>
                        <div>💰 Mastermind offers a planet reward.</div>
                        <div>🥷 Hunter sends energy to the target planet. </div>
                        <div>👨‍💼 Middleman contacts mastermind & hunter. </div>
                    </div>
                    <RiskLabel />

                    <div>
                        <div>This is an experimental application & has not been audited. </div>
                        <div> Please refrain from depositing large amounts of ETH. </div>
                    </div>
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
