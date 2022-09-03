import React from "react"
import {useLobbyInfo} from "../helpers/AppHooks"
import {ContractProvider} from "../helpers/ContractContext"
import {Main} from "./Main"
import {log} from "../helpers/helpers"

export function App({a}) {
    log("Starting", "info")

    const {
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
    } = useLobbyInfo(a)

    const contract = {
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
    }

    return (
        <ContractProvider value={contract}>
            <Main />
        </ContractProvider>
    )
}
