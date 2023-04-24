import {ethers} from "hardhat"
import artemisABI from "../abi/contracts/Artemis.sol/Artemis.json"

require("dotenv").config()
const {ARTEMIS_CREATOR_PRIVATE_KEY} = process.env

async function main() {
    // const [deployer] = await ethers.getSigners()

    let amount = ethers.BigNumber.from(0)
    const creator = new ethers.Wallet(ARTEMIS_CREATOR_PRIVATE_KEY!, ethers.provider)

    // v0.0.2
    const artemisAddress = "0xEe2A8A1ccF2D422b92c78cfb850b1E6BCC5A37eC"

    const artemisContract = new ethers.Contract(artemisAddress, artemisABI, creator)

    const contractOwner = await artemisContract.getCreator()

    if (contractOwner != creator.address) {
        console.log("Contract Owner -> " + contractOwner)
        console.log("Please find the right account!")
        return
    }

    // const fromBlock = 24001838;
    // const toBlock = 	27592754;
    // const res = await artemisContract.queryFilter("*",	fromBlock,toBlock);
    // console.log(res);
    // console.log(res.length);

    let lobbyIds = await artemisContract.getLobbyIds()

    let creatorFeeBalance = await artemisContract.getFeeBalance()
    amount = amount.add(creatorFeeBalance)
    creatorFeeBalance = ethers.utils.formatUnits(creatorFeeBalance, "ether")
    console.log("Creator Fee Balance -> " + creatorFeeBalance)

    for (let k = 0; k < lobbyIds.length; k++) {
        let lobbyId = lobbyIds[k]

        let taskIds = await artemisContract.getTaskIds(lobbyId)
        let tasks = await artemisContract.bulkGetTasks(lobbyId, 0, taskIds.length)

        let adminFeeBalance = await artemisContract.getLobbyFeeBalance(lobbyId)
        amount = amount.add(adminFeeBalance)
        adminFeeBalance = ethers.utils.formatUnits(adminFeeBalance, "ether")

        console.log("----------------------------------------")
        console.log("Lobby: " + lobbyId)
        console.log("Task Amount: " + tasks.length)
        console.log("Admin Fee Balance -> " + adminFeeBalance)

        const accountSet = new Set()

        for (let i = 0; i < tasks.length; i++) {
            let t = tasks[i]
            let taskId = t.taskId
            let mercenaries = t.mercenaries
            let manager = t.manager

            accountSet.add(manager)

            if (t.payoutBalance.gt(0)) {
                amount = amount.add(t.payoutBalance)
                let payoutBalance = ethers.utils.formatUnits(t.payoutBalance, "ether")
                console.log("Task Id " + taskId + " -> funder -> " + t.funder + " -> " + payoutBalance)
            }

            for (let j = 0; j < mercenaries.length; j++) {
                let m = mercenaries[j]
                // let mercenarySubmit = await artemisContract.getMercenarySubmitAmount(lobbyId, taskId, m)
                // let managerConfirm = await artemisContract.getManagerConfirmAmount(lobbyId, taskId, m)
                // let fund = await artemisContract.getBalance(m);
                // let x = ethers.utils.formatUnits(mercenarySubmit, "ether")
                // let y = ethers.utils.formatUnits(managerConfirm, "ether")
                // let z = ethers.utils.formatUnits(fund, "ether")

                // console.log(m)
                // console.log(x)
                // console.log(y)
                // console.log(z)
                // console.log("----------------------")
                accountSet.add(m)
            }
        }

        const accounts = Array.from(accountSet)

        console.log("For Manager & Mercenaries")
        for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i]
            // console.log(account)
            let salary = await artemisContract.getBalance(account)
            if (salary.gt(0)) {
                amount = amount.add(salary)
                salary = ethers.utils.formatUnits(salary, "ether")
                console.log(account + " -> " + salary)
            }
        }

        let contractBalance = await artemisContract.getContractBalance()
        console.log("amount: " + ethers.utils.formatUnits(amount))
        console.log("actual: " + ethers.utils.formatUnits(contractBalance))

        if (amount.eq(contractBalance)) {
            console.log("Analysis Successfully !")
        } else {
            console.log("Continue to find out the cash flow...")
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
