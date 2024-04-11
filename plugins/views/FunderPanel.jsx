import React, {useState} from "react"
import {textCenter, ze} from "../helpers/styles"
import styled from "styled-components"
import {usePause} from "../helpers/AppHooks"
import {Loading} from "../components/Loading"
import {FunderPublishPanel} from "./FunderPublishPanel"
import {ListingPanel} from "./ListingPanel"
import { Btn } from "../components/Btn";
import { Spacer,EmSpacer } from "../components/CoreUI";


const Content = styled.div`
  width: 530px;
  margin-left: 10px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* text-align: justify; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  & > span:first-child {
    flex-grow: 1;
  }
`;


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
    textAlign: "center",
}

const normalButton = {
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

        <Content>
         
  
    
           <Row>
              <Btn onClick={() => setTab("publish")}  wide={'40%'} style={ tab==='publish'?activeButton:normalButton}>
                Publish Mission
              </Btn>
              <Spacer width={16} />

              <Btn  onClick={() =>setTab("query")} wide={'40%'} style={tab==='query'?activeButton:normalButton}>
                Mission Records
              </Btn>
              
           </Row>
   

           <Row>
              <MainDiv key="funderMainDiv">
                {tab === "publish" ? <FunderPublishPanel /> : <ListingPanel state={1} />}
              </MainDiv>
           </Row>
        </Content>
    )
}


