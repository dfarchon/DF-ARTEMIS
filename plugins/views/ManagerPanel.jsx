import React, {useState} from "react"
import {textCenter} from "../helpers/styles"
import styled from "styled-components"
import {ListingPanel} from "./ListingPanel"

export const ManagerPanel = () => {
    return (
        <div style={{...textCenter, padding: "5px"}}>
            <ListingPanel state={2} />
        </div>
    )
}
