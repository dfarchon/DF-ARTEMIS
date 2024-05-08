import React, {useCallback, useState} from "react"
import {listStyle, textCenter} from "../helpers/styles"
import styled from "styled-components"
import {callAction, log} from "../helpers/helpers"
import {LOBBY_CONTRACT_ADDRESS, notifyManager, own} from "../constants"
import {useContract} from "../helpers/AppHooks"
import {Input} from "../components/Input"
import {Btn} from "../components/Btn"
import {ButtonGroup, EmSpacer, Separator} from "../components/CoreUI"
import {Button} from "../components/Button"
import {BigNumber, utils} from "ethers"
import {DFInput} from "../components/Input"
import {locationIdToDecStr, locationIdFromDecStr} from "@darkforest_eth/serde"
import {TextPreview} from "../components/TextPreview"

const SectionHeader = styled.div`
    color: "color(" #bbb ").hex()";
    text-decoration: underline;
    font-weight: bold;
    display: inline;
    margin-bottom: 3px;
    display: block;
`

const Section = styled.div`
    padding: 5px 0;

    &:first-child {
        margin-top: -3px;
    }

    &:last-child {
        border-bottom: none;
    }
`

const Content = styled.div`
    width: 530px;
    margin-left: 10px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    /* text-align: justify; */
`

const Row = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    align-items: center;

    & > span:first-child {
        flex-grow: 1;
    }
`

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
    width: "48%",
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
        if (p === undefined) {
            alert("You need to select a planet first 👾")
            return
        }
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
        <div>
            {/* <div style={funderPublishFont}>Funder Publish New Contract</div> */}
            {/* planetId */}

            <Section>
                <SectionHeader>Set Target Planet</SectionHeader>
                <Row>
                    <div> Target Planet Id: </div>

                    <div>
                        {" "}
                        {planetId === undefined
                            ? "(none)"
                            : planetId.toString().slice(0, 20) + "..." + planetId.toString().slice(-20)}{" "}
                    </div>
                </Row>

                <div style={textCenter}>
                    <Btn onClick={getPlanetId} wide={"40%"} style={buttonStyle}>
                        Set Target Planet
                    </Btn>{" "}
                    <Btn onClick={centerPlanet} wide={"40%"} style={buttonStyle}>
                        Center Target Planet
                    </Btn>
                </div>
            </Section>

            {/* payout */}

            <Section>
                <SectionHeader style={{marginTop: "0px"}}>Set Mission Reward</SectionHeader>
                <Row>
                    <span style={th}>
                        Range is [{minFunderPayout},{maxFunderPayout}] ETH
                    </span>
                    <span>
                        <Input
                            placeholder="ETH"
                            isAddress={false}
                            type="number"
                            value={payout}
                            onChange={changePayout}
                            onKeyUp={onKeyUp}
                            step={0.0001}
                            style={{width: "250px"}}
                        />
                    </span>
                </Row>
            </Section>

            {/* energy */}
            <Section>
                <SectionHeader style={{marginTop: "0px"}}>Set Expected energy</SectionHeader>
                <Row>
                    <span style={th}>Energy: {energy.toLocaleString()}</span>
                    <span>
                        <Input
                            placeholder="ETH"
                            isAddress={false}
                            type="number"
                            value={energy}
                            onChange={changeEnergy}
                            onKeyUp={onKeyUp}
                            step={1000000}
                            style={{width: "250px"}}
                        />
                    </span>
                </Row>
            </Section>

            {/* default is creater  */}
            {/* manager */}
            {/* <div style={{padding: "5px"}}>
                <span>Set Manager</span>{" "}
                <DFInput
                    placeholder="address"
                    isAddress={true}
                    type="string"
                    value={manager}
                    onChange={changeManager}
                />
            </div> */}

            {/* durationTime */}

            <Section>
                <SectionHeader style={{marginTop: "0px"}}>Set Duration</SectionHeader>
                <Row>
                    <span style={th}>Duration: {formatSecond(durationTime)}</span>
                    <span>
                        <Input
                            placeholder="ETH"
                            isAddress={false}
                            type="number"
                            value={durationTime}
                            onChange={changeDurationTime}
                            onKeyUp={onKeyUp}
                            step={60}
                            style={{width: "250px"}}
                        />
                    </span>
                </Row>
            </Section>

            <EmSpacer height="20px" />

            {/* funder publish */}
            <div style={{padding: "0px"}}>
                <Btn disabled={processing} onClick={funderPublish} wide="50%">
                    Publish New Mission
                </Btn>
            </div>
        </div>
    )
}
