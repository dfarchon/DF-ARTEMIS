import React, {useCallback, useEffect, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "../components/Input"
import {Btn} from "../components/Btn"
import {ButtonGroup, Separator} from "../components/CoreUI"
import {BigNumber, utils} from "ethers"
import {useLobbyFees} from "../helpers/AppHooks"
import {Button} from "../components/Button"

export const ContractBalanceComponent = () => {
    const {a} = useContract()
    const [balance, setBalance] = useState(undefined)

    const query = async () => {
        let res = await a.getContractBalance()
        setBalance(utils.formatEther(res))
    }

    return (
        <div>
            <span> Contract Balance: {balance === undefined ? "?" : balance} ETH</span>{" "}
            <button onClick={query}>Query</button>
        </div>
    )
}
