import React, {useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {useContract} from "../helpers/AppHooks"
import {InitializeComponent} from "../components/InitializeComponent"
import {EMPTY_ADDRESS, own} from "../constants"
import {LOBBY_CONTRACT_ADDRESS} from "../constants"
import {AddLobbyComponent} from "../components/AddLobbyComponent"
import {CreatorPauseComponent} from "../components/CreatorPauseComponent"
import {CreatorFeeComponent} from "../components/CreatorFeeComponent"
import {AdminFeeComponent} from "../components/AdminFeeComponent"
import {ManagerFeeComponent} from "../components/ManagerFeeComponent"
import {MinDurationTimeComponent} from "../components/MinDurationTimeComponent"
import {MaxDurationTimeComponent} from "../components/MaxDurationTimeComponent"
import {MaxFeeComponent} from "../components/MaxFeeComponent"
import {CreatorChangedComponent} from "../components/CreatorChangedComponent"
import {CreatorFeesWithdrawComponent} from "../components/CreatorFeesWithdrawComponent"
import {MinFunderPayoutComponent} from "../components/MinFunderPayoutComponent"
import {MaxFunderPayoutComponent} from "../components/MaxFunderPayoutComponent"
import {ContractBalanceComponent } from "../components/ContractBalanceComponent"

const creatorStyle = {
    ...textCenter,
    display: "block",
    flexDrection: "row",
}

export const CreatorPanel = () => {
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
        <div style={creatorStyle}>
            <InitializeComponent />
            <AddLobbyComponent />

            {creator !== undefined && creator !== EMPTY_ADDRESS ? (
                <div>
                    <CreatorPauseComponent a={a} />
                    <CreatorFeeComponent a={a} creatorFee={creatorFee} maxFee={maxFee} />
                    <AdminFeeComponent a={a} adminFee={adminFee} maxFee={maxFee} />
                    <ManagerFeeComponent a={a} managerFee={managerFee} maxFee={maxFee} />

                    <MinDurationTimeComponent
                        a={a}
                        minDurationTime={minDurationTime}
                        maxDurationTime={maxDurationTime}
                    />
                    <MaxDurationTimeComponent
                        a={a}
                        minDurationTime={minDurationTime}
                        maxDurationTime={maxDurationTime}
                    />

                    <MinFunderPayoutComponent
                        a={a}
                        minFunderPayout={minFunderPayout}
                        maxFunderPayout={maxFunderPayout}
                    />

                    <MaxFunderPayoutComponent
                        a={a}
                        minFunderPayout={minFunderPayout}
                        maxFunderPayout={maxFunderPayout}
                    />
                    <MaxFeeComponent a={a} maxFee={maxFee} creator={creator} />
                    <CreatorChangedComponent a={a} creator={creator} />
                   
                    < ContractBalanceComponent/>
                    <CreatorFeesWithdrawComponent />
                </div>
            ) : (
                ""
            )}
        </div>
    )
}
