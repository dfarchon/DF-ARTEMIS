import React, {useState} from "react"
import {textCenter, ze} from "../helpers/styles"
import styled from "styled-components"
import {usePause} from "../helpers/AppHooks"
import {Loading} from "../components/Loading"
import {FunderPublishPanel} from "./FunderPublishPanel"
import {ListingPanel} from "./ListingPanel"

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
`

const MainDiv = styled.div`
    padding: 0 0 10px 0;
`

const activeButton = {
    background: "#fff",
    color: "#000",
    width: "200px",
    height: "30px",
    textAlign: "center",
}

const normalButton = {
    width: "200px",
    height: "30px",
    textAlign: "center",
}

export const FunderPanel = () => {
    // ['pulbish','query']
    const {pause} = usePause()
    const [tab, setTab] = useState("publish")

    return pause === undefined ? (
        <Loading />
    ) : pause ? (
        <div style={textCenter}>
            <div style={{fontSize: "30px"}}> DF ARTEMIS IS PAUSED NOW</div>
        </div>
    ) : (
        <div style={{...textCenter, ...ze}}>
            <ButtonBar key={"funderButtonBar"}>
                <button onClick={() => setTab("publish")} style={tab === "publish" ? activeButton : normalButton}>
                    New Task
                </button>
                <button onClick={() => setTab("query")} style={tab === "query" ? activeButton : normalButton}>
                    Current Task(s)
                </button>
            </ButtonBar>
            <MainDiv key="funderMainDiv">
                {tab === "publish" ? <FunderPublishPanel /> : <ListingPanel state={1} />}
            </MainDiv>
        </div>
    )
}
