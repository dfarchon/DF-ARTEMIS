import React from "react"
import {textCenter, textRight} from "../helpers/styles"
import styled from "styled-components"
import {useContract, useLobbyAnalysis} from "../helpers/AppHooks"
import dfstyles from "../helpers/dfstyles"
import {AdminFeeComponent} from "../components/AdminFeeComponent"

const lobbyAnalysisStyle = {
    textAlign: "left",
    marginLeft: "100px",
}
const lobbyAnalysisFont = {
    fontSize: "30px",
    textAlign: "center",
}

const fi = {
    width: "200px",

    display: "inline-block",
    textAlign: "right",
}

const se = {
    width: "20px",

    display: "inline-block",
}

const th = {
    marinLeft: "100px",

    display: "inline-block",
}

export const LobbyAnalysisComponenet = () => {
    const {
        pause,
        taskCount,
        funderPayoutSum,
        funderTakeAwaySum,
        creatorFeesSum,
        adminFeesSum,
        managerFeesSum,
        tipsSum,
        mercenariesSalarySum,
    } = useLobbyAnalysis()

    return (
        <div>
            <div style={lobbyAnalysisFont}> Lobby Analysis</div>

            <div style={lobbyAnalysisStyle}>
                <div>
                    {" "}
                    <span style={fi}>Pause State: </span>
                    <span style={se}> </span>
                    <span style={th}>{pause === undefined ? "?" : pause ? "true" : "false"}</span>
                </div>

                <div>
                    <span style={fi}> Task Count: </span>
                    <span style={se}> </span>
                    <span style={th}> {taskCount === undefined ? "?" : taskCount}</span>
                </div>
                <div>
                    <span style={fi}>Funder Payout Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{funderPayoutSum === undefined ? "?" : funderPayoutSum} ETH</span>
                </div>
                <div>
                    <span style={fi}>Funder Take Away Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{funderTakeAwaySum === undefined ? "?" : funderTakeAwaySum} ETH</span>
                </div>

                <div>
                    <span style={fi}>Creator Fees Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{creatorFeesSum === undefined ? "?" : creatorFeesSum} ETH</span>
                </div>

                <div>
                    <span style={fi}>Admin Fees Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{adminFeesSum === undefined ? "?" : adminFeesSum} ETH</span>
                </div>

                <div>
                    <span style={fi}>Manager Fees Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{managerFeesSum === undefined ? "?" : managerFeesSum} ETH</span>
                </div>

                <div>
                    <span style={fi}>Tips Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{tipsSum === undefined ? "?" : tipsSum} ETH</span>
                </div>
                <div>
                    <span style={fi}>Mercenaries Salary Sum: </span>
                    <span style={se}> </span>
                    <span style={th}>{mercenariesSalarySum === undefined ? "?" : mercenariesSalarySum} ETH</span>
                </div>
            </div>
        </div>
    )
}
