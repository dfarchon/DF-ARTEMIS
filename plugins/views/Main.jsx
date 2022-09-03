import React, {useState} from "react"
import styled from "styled-components"

import {Loading} from "../components/Loading"
import {useContract} from "../helpers/AppHooks"
import {FooterPanel} from "./FooterPanel"
import {WelcomePanel} from "./WelcomePanel"
import {FunderPanel} from "./FunderPanel"
import {ManagerPanel} from "./ManagerPanel"
import {MercenaryPanel} from "./MercenaryPanel"
import {AdminPanel} from "./AdminPanel"
import {CreatorPanel} from "./CreatorPanel"

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
`

const MainDiv = styled.div`
    padding: 0 0 10px 0;
`

const activeButton = {
    background: "#fff",
    color: "#000",
    width: "100px",
    height: "30px",
    textAlign: "center",
}

const normalButton = {
    width: "100px",
    height: "30px",
    textAlign: "center",
}

const Artemis = () => {
    // ['welcome','funder','manager','mercenary','admin','creator']
    const [tab, setTab] = useState("welcome")

    const {isLobbyExists, isCreator, isAdmin} = useContract()

    return [
        <ButtonBar key={"bar"}>
            <button onClick={() => setTab("welcome")} style={tab === "welcome" ? activeButton : normalButton}>
                Welcome
            </button>
            <button onClick={() => setTab("funder")} style={tab === "funder" ? activeButton : normalButton}>
                Funder
            </button>
            <button onClick={() => setTab("manager")} style={tab === "manager" ? activeButton : normalButton}>
                Manager
            </button>
            <button onClick={() => setTab("mercenary")} style={tab === "mercenary" ? activeButton : normalButton}>
                Mercenary
            </button>

            {isAdmin ? (
                <button onClick={() => setTab("admin")} style={tab === "admin" ? activeButton : normalButton}>
                    Admin
                </button>
            ) : (
                ""
            )}

            {isCreator || isLobbyExists === false ? (
                <button onClick={() => setTab("creator")} style={tab === "creator" ? activeButton : normalButton}>
                    Creator
                </button>
            ) : (
                ""
            )}
        </ButtonBar>,

        <MainDiv key={"main"}>
            {tab === "welcome" ? (
                <WelcomePanel />
            ) : tab === "funder" ? (
                <FunderPanel />
            ) : tab === "manager" ? (
                <ManagerPanel />
            ) : tab === "mercenary" ? (
                <MercenaryPanel />
            ) : tab === "admin" ? (
                <AdminPanel />
            ) : (
                <CreatorPanel />
            )}
        </MainDiv>,
    ]
}

export function Main() {
    const {isLobbyExists} = useContract()
    return (
        <div>
            {isLobbyExists === undefined ? <Loading /> : <Artemis />}
            <FooterPanel />
        </div>
    )
}
