import React, {useCallback, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "../components/Input"
import {Btn} from "../components/Btn"
import {ButtonGroup, Separator} from "../components/CoreUI"
import {Button} from "../components/Button"
import {BigNumber, utils} from "ethers"
import {DFInput} from "../components/Input"

import {locationIdToDecStr, locationIdFromDecStr} from "@darkforest_eth/serde"

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
`

const funderPublishFont = {
    fontSize: "30px",
}

const buttonStyle = {
    width: "200px",
    textAlign: "center",
}

export const ze = {
    padding: "5px",
}

const fi = {
    width: "200px",
    display: "inline-block",
    textAlign: "right",
}

const se = {
    width: "100px",

    display: "inline-block",
    textAlign: "center",
}

const th = {
    width: "200px",

    display: "inline-block",
    textAlign: "left",
}

//todo: blacklist
export const FunderPublishPanel = () => {
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

    let addr = LOBBY_CONTRACT_ADDRESS
    const [planetId, setPlanetId] = useState(undefined)
    const [payout, setpayout] = useState(minFunderPayout)
    const [energy, setEnergy] = useState(100000000)
    // default to choose admin

    const [manager, setManager] = useState(admin)
    const [durationTime, setDurationTime] = useState(minDurationTime)
    const [blacklist, setBlacklist] = useState([])
    const [processing, setProcessing] = useState(false)

    const init = () => {
        setPlanetId(undefined)
        setpayout(minFunderPayout)
        setEnergy(100000000)
        setManager(admin)
        setDurationTime(minDurationTime)
        setBlacklist([])
        setProcessing(false)
    }

    // function funderPublish(
    //     address addr,
    //     uint256 planetId,
    //     uint256 payout,
    //     uint256 x,
    //     address manager,
    //     uint256 durationTime,
    //     address[] memory blacklist
    // ) external payable lobbyExists(addr) notPaused(addr) {

    const getPlanetId = () => {
        let p = ui.getSelectedPlanet()
        if (p === undefined) return
        setPlanetId(p.locationId)
    }

    const centerPlanet = () => {
        if (planetId === undefined) return

        let p = df.getPlanetWithId(planetId)
        if (p === undefined) {
            alert("This Planet Is Not In Your Map")
            return
        }

        ui.centerLocationId(planetId)
    }

    const changePayout = (e) => {
        const {value} = e.currentTarget
        log(minFunderPayout, "debug")
        log(maxFunderPayout, "debug")
        if (+value <= maxFunderPayout && +value >= minFunderPayout) {
            setpayout(+value)
        }
    }

    const changeEnergy = (e) => {
        const {value} = e.currentTarget
        if (+value >= 1000) {
            setEnergy(+value)
        }
    }

    const changeManager = (e) => {
        const {value} = e.currentTarget
        log(value.toLowerCase(), "debug")
        setManager(value.toLowerCase())
    }

    const changeDurationTime = (e) => {
        const {value} = e.currentTarget
        if (+value >= minDurationTime && +value <= maxDurationTime) {
            setDurationTime(+value)
        }
    }

    const addZero = (v) => {
        let res
        if (v < 10) res = "0" + v
        else res = v
        return res
    }

    const formatSecond = (result) => {
        var h = Math.floor(result / 3600)
        var m = Math.floor((result / 60) % 60)
        var s = Math.floor(result % 60)
        return h + ":" + addZero(m) + ":" + addZero(s)
    }

    const onKeyUp = (e) => {
        e.stopPropagation()
    }

    // const [planetId, setPlanetId] = useState(undefined)
    // const [payout, setpayout] = useState(minFunderPayout)
    // const [energy, setEnergy] = useState(100000)
    // const [x, setX] = useState(1) //x  /Y = payout /energy
    // // default to choose admin

    // const [manager, setManager] = useState(admin)
    // const [durationTime, setDurationTime] = useState(minDurationTime)
    // const [blacklist, setBlacklist] = useState([])

    const funderPublish = async () => {
        if (processing) return

        let methodName = "funderPublish"

        if (planetId === undefined) {
            alert("Need To Select One Planet First")
            return
        }

        setProcessing(true)
        let shang = utils.parseEther(payout.toString())
        let xia = BigNumber.from(energy)
        let x = shang.div(xia)

        console.log("----------------")
        console.log(shang.toString())
        console.log(xia.toString())
        console.log(x.toString())

        console.log("----------------")
        await df.hardRefreshPlanet(planetId)
        let p = df.getPlanetWithId(planetId)
        let blacklist_ = blacklist
        blacklist_.push(p.owner)
        setBlacklist(blacklist_)

        // function funderPublish(
        //     address addr,
        //     uint256 planetId,
        //     uint256 payout,
        //     uint256 x,
        //     address manager,
        //     uint256 durationTime,
        //     address[] memory blacklist

        const input = [
            addr,
            locationIdToDecStr(planetId),
            utils.parseEther(payout.toString()),
            x,
            manager,
            durationTime,
            blacklist,
        ]
        console.log(input)

        const overrides = {
            gasLimit: 5000000,
            gasPrice: undefined,
            value: utils.parseEther(payout.toString()),
        }

        console.log("funder publish input")
        console.log(input)
        console.log("--------------------")
        console.log(overrides)

        await callAction(a, methodName, input, overrides)
            .catch((err) => {
                console.error(err)
                notifyManager.txInitError(methodName, err.message)
            })
            .finally(() => {
                init()
                setProcessing(false)
            })
    }

    return (
        <div style={textCenter}>
            {/* <div style={funderPublishFont}>Funder Publish New Contract</div> */}
            {/* planetId */}
            <div>
                <Btn onClick={getPlanetId} style={buttonStyle}>
                    {" "}
                    Set Selected Planet{" "}
                </Btn>{" "}
                <Btn onClick={centerPlanet} style={buttonStyle}>
                    {" "}
                    Center Viewport{" "}
                </Btn>
                <div>{planetId === undefined ? "The selected planet's ID will show up here" : planetId}</div>
            </div>

            {/* payout */}
            <div style={ze}>
                <span style={fi}> Set Payout (xDai) </span>{" "}
                <span style={se}>
                    <Input
                        placeholder="xDai"
                        isAddress={false}
                        type="number"
                        value={payout}
                        onChange={changePayout}
                        onKeyUp={onKeyUp}
                        step={0.1}
                    />
                </span>{" "}
                <span style={th}>
                    Range is [{minFunderPayout},{maxFunderPayout}]
                </span>
            </div>

            {/* energy */}
            <div style={ze}>
                <span style={fi}>Set Damage Energy</span>{" "}
                <span style={se}>
                    <Input
                        placeholder="energy"
                        isAddress={false}
                        type="number"
                        value={energy}
                        onChange={changeEnergy}
                        onKeyUp={onKeyUp}
                        step={1000000}
                    />
                </span>{" "}
                <span style={th}>{energy.toLocaleString()}</span>
            </div>
            {/* manager */}
            <div style={{padding: "5px"}}>
                <span>Set Manager</span>{" "}
                <DFInput
                    placeholder="address"
                    isAddress={true}
                    type="string"
                    value={manager}
                    onChange={changeManager}
                />
            </div>

            {/* durationTime */}
            <div style={{textAlign: "left", marginLeft: "50px", padding: "5px"}}>
                <span> Set Min Cancellation Time (s) </span>{" "}
                <span style={se}>
                    <Input
                        placeholder="xDai"
                        isAddress={false}
                        type="number"
                        value={durationTime}
                        onChange={changeDurationTime}
                        onKeyUp={onKeyUp}
                        step={60}
                    />
                </span>{" "}
                <span>{formatSecond(durationTime)}</span>
            </div>
            {/* funder publish */}
            <div style={{padding: "5px"}}>
                <Btn disabled={processing} onClick={funderPublish} style={{width: "300px"}}>
                    Publish New Task
                </Btn>
            </div>
        </div>
    )
}
