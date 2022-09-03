import React, {useState} from "react"
import {listStyle, textCenter, ze} from "../helpers/styles"
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

export const MercenaryPanel = () => {
    return (
        <div style={{...textCenter, ...ze}}>
            <ListingPanel state={3} />
        </div>
    )
}
