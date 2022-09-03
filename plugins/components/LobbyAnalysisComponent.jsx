import React from "react"
import {textCenter, textRight} from "../helpers/styles"
import styled from "styled-components"
import {useContract, useLobbyAnalysis} from "../helpers/AppHooks"
import dfstyles from "../helpers/dfstyles"
import {AdminFeeComponent} from "../components/AdminFeeComponent"

const lobbyAnalysisFont = {
    fontSize: "30px",
}

const fi = {
    width: "200px",
    display: "inline-block",
    textAlign: "right",
}

const se = {
    width: "80px",
    display: "inline-block",
}

const th = {
    width: "100px",
    display: "inline-block",
    textAlign: "left",
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
        <div style={textCenter}>
            <div style={lobbyAnalysisFont}> Lobby Analysis</div>
            <div>
                {" "}
                <span style={fi}>Pause State : </span>
                <span style={se}>{pause === undefined ? "?" : pause ? "true" : "false"}</span>
                <span style={th}>{"           "}</span>
            </div>

            <div>
                <span style={fi}> Task Count : </span>
                <span style={se}> {taskCount === undefined ? "?" : taskCount}</span>
                <span style={th}>{"           "}</span>
            </div>
            <div>
                <span style={fi}>Funder Payout Sum : </span>
                <span style={se}>{funderPayoutSum === undefined ? "?" : funderPayoutSum}</span>
                <span style={th}>xDai</span>
            </div>
            <div>
                <span style={fi}>Funder Take Away Sum : </span>
                <span style={se}>{funderTakeAwaySum === undefined ? "?" : funderTakeAwaySum}</span>
                <span style={th}>xDai</span>
            </div>

            <div>
                <span style={fi}>Creator Fees Sum : </span>
                <span style={se}>{creatorFeesSum === undefined ? "?" : creatorFeesSum}</span>
                <span style={th}>xDai</span>
            </div>

            <div>
                <span style={fi}>Admin Fees Sum : </span>
                <span style={se}>{adminFeesSum === undefined ? "?" : adminFeesSum}</span>
                <span style={th}>xDai</span>
            </div>

            <div>
                <span style={fi}>Manager Fees Sum :</span>
                <span style={se}>{managerFeesSum === undefined ? "?" : managerFeesSum}</span>
                <span style={th}>xDai</span>
            </div>

            <div>
                <span style={fi}>Tips Sum : </span>
                <span style={se}>{tipsSum === undefined ? "?" : tipsSum}</span>
                <span style={th}>xDai</span>
            </div>
            <div>
                <span style={fi}>Mercenaries Salary Sum : </span>
                <span style={se}>{mercenariesSalarySum === undefined ? "?" : mercenariesSalarySum}</span>
                <span style={th}>xDai</span>
            </div>
        </div>
    )
}
