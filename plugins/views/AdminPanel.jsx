import React from "react"
import {textCenter, textRight} from "../helpers/styles"
import styled from "styled-components"
import {useContract, useLobbyAnalysis} from "../helpers/AppHooks"
import dfstyles from "../helpers/dfstyles"
import {AdminFeeComponent} from "../components/AdminFeeComponent"
import {LobbyAnalysisComponenet} from "../components/LobbyAnalysisComponent"
import {AdminWithdrawComponent} from "../components/AdminWithdrawComponent"

const adminFont = {
    fontSize: "30px",
}

export function AdminPanel() {
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

    return (
        <div style={textCenter}>
            <div style={adminFont}> Admin </div>
            <div style={textRight}> admin : {admin} </div>

            <AdminFeeComponent a={a} adminFee={adminFee} maxFee={maxFee} />
            <AdminWithdrawComponent />
            <LobbyAnalysisComponenet />
        </div>
    )
}
