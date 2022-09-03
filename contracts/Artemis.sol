// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ArtemisTypes.sol";
import "./ArtemisStorage.sol";
import "./ArtemisTask.sol";

contract Artemis is Initializable, ArtemisStorage {
    modifier onlyAdmin(address addr) {
        require(s.lobbies[addr].admin == msg.sender, "not admin");
        _;
    }

    modifier onlyCreatorOrAdmin(address addr) {
        require(s.creator == msg.sender || s.lobbies[addr].admin == msg.sender, "only creator or admin");
        _;
    }

    modifier lobbyExists(address addr) {
        require(s.lobbies[addr].idx > 0, "lobby not exists");
        _;
    }

    modifier lobbyNotExists(address addr) {
        require(s.lobbies[addr].idx == 0, "lobby exists");
        _;
    }

    modifier notPaused(address addr) {
        require(!s.paused, "paused");
        require(!s.lobbies[addr].paused, "lobby paused");
        _;
    }

    modifier taskExists(address addr, uint256 taskId) {
        require(
            s.lobbies[addr].tasks[taskId].funder != address(0) && s.lobbies[addr].tasks[taskId].manager != address(0),
            "task not exists"
        );
        _;
    }

    function initialize(
        uint256 creatorFee,
        uint256 managerFee,
        uint256 minDurationTime,
        uint256 maxDurationTime,
        uint256 minFunderPayout,
        uint256 maxFunderPayout,
        uint256 maxFee,
        address creator
    ) public initializer {
        console.log("initialize");
        require(creatorFee <= maxFee, "creatorFee need <= maxFee");
        require(managerFee <= maxFee, "managerFee need <= maxFee");
        require(minDurationTime <= maxDurationTime, "about duration time");
        require(minFunderPayout <= maxFunderPayout, "about funder payout");
        s.creatorFee = creatorFee;
        s.managerFee = managerFee;
        s.minDurationTime = minDurationTime;
        s.maxDurationTime = maxDurationTime;
        s.minFunderPayout = minFunderPayout;
        s.maxFunderPayout = maxFunderPayout;
        s.maxFee = maxFee;
        s.creator = creator;
        s.paused = false;
    }

    event FunderPublish(address indexed addr, uint256 indexed taskId);

    function funderPublish(
        address addr,
        uint256 planetId,
        uint256 payout,
        uint256 x,
        address manager,
        uint256 durationTime,
        address[] memory blacklist
    ) external payable lobbyExists(addr) notPaused(addr) {
        require(planetId != uint256(0), "need true planetId");
        require(payout >= s.minFunderPayout, "payout >= min");
        require(payout <= s.maxFunderPayout, "payout<=max");
        require(x > 0, "x need > 0");
        require(durationTime >= s.minDurationTime, "duration time too short");
        require(durationTime <= s.maxDurationTime, "duration time too long");
        require(msg.value == payout, "wrong msg.value");

        uint256 taskId = ArtemisTask.funderPublish(addr, planetId, payout, x, manager, durationTime, blacklist);
        emit FunderPublish(addr, taskId);
    }

    event FunderAddPayout(address indexed addr, uint256 indexed taskId, uint256 addPayoutAmount);

    function funderAddPayout(
        address addr,
        uint256 taskId,
        uint256 amount
    ) external payable lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
        require(amount == msg.value, "wrong msg.value");
        ArtemisTask.funderAddPayout(addr, taskId, amount);
        emit FunderAddPayout(addr, taskId, amount);
    }

    event FunderChangeTime(address indexed addr, uint256 indexed taskId, uint256 durationTime);

    function funderChangeTime(
        address addr,
        uint256 taskId,
        uint256 durationTime
    ) public lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
        ArtemisTask.funderChangeTime(addr, taskId, durationTime);
        emit FunderChangeTime(addr, taskId, durationTime);
    }

    event FunderChangeX(address indexed addr, uint256 indexed taskId, uint256 x);

    function funderChangeX(
        address addr,
        uint256 taskId,
        uint256 x
    ) public lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
        ArtemisTask.funderChangeX(addr, taskId, x);
        emit FunderChangeX(addr, taskId, x);
    }

    event MercenarySubmit(address indexed addr, uint256 indexed taskId, address indexed killer, uint256 amount);

    function mercenarySubmit(
        address addr,
        uint256 taskId,
        uint256 amount
    ) external lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
        ArtemisTask.mercenaryClaim(addr, taskId, amount);
        emit MercenarySubmit(addr, taskId, msg.sender, amount);
    }

    event GiveTips(address indexed addr, address indexed from, address indexed to, uint256 amount);

    function giveTips(
        address addr,
        address account,
        uint256 amount
    ) external payable lobbyExists(addr) notPaused(addr) {
        require(msg.value == amount, "wrong msg.value");
        ArtemisTask.giveTips(addr, account, amount);
        emit GiveTips(addr, msg.sender, account, amount);
    }

    event ManagerConfirm(address indexed addr, uint256 indexed taskId, address indexed killer, uint256 amount);

    function managerConfirm(
        address addr,
        uint256 taskId,
        address killer,
        uint256 amount
    ) external lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) {
        ArtemisTask.managerConfirm(addr, taskId, killer, amount);
        emit ManagerConfirm(addr, taskId, killer, amount);
    }

    event FunderLeave(address indexed addr, uint256 indexed taskId, uint256 amount);

    function funderLeave(address addr, uint256 taskId)
        external
        lobbyExists(addr)
        notPaused(addr)
        taskExists(addr, taskId)
    {
        ArtemisTypes.Task storage task = s.lobbies[addr].tasks[taskId];
        require(msg.sender == task.funder, "only creator");
        require(task.payoutBalance > 0, "no bonus left");
        require(task.beginTime + task.durationTime <= block.timestamp, "hold on");
        uint256 amount = task.payoutBalance;
        task.payoutBalance = 0;
        s.lobbies[addr].funderTakeAwaySum += amount;
        AddressUpgradeable.sendValue(payable(msg.sender), amount);
        emit FunderLeave(addr, taskId, amount);
    }

    function getIfTaskExists(address addr, uint256 taskId) public view returns (bool) {
        return ArtemisTask.getIfTaskExists(addr, taskId);
    }

    function getTaskState(address addr, uint256 taskId) public view returns (ArtemisTypes.TaskState memory ret) {
        return ArtemisTask.getTaskState(addr, taskId);
    }

    function bulkGetTasks(
        address addr,
        uint256 startIdx,
        uint256 endIdx
    ) public view returns (ArtemisTypes.TaskState[] memory ret) {
        ret = ArtemisTask.bulkGetTasks(addr, startIdx, endIdx);
    }

    function getTaskPage(
        address addr,
        uint256 pageIdx,
        uint256 pageSize
    ) public view returns (ArtemisTypes.TaskState[] memory ret) {
        ret = ArtemisTask.getTaskPage(addr, pageIdx, pageSize);
    }

    function getNTasksByFunder(address addr, address funder) public view returns (uint256) {
        return ArtemisTask.getNTasksByFunder(addr, funder);
    }

    function getTasksByFunder(address addr, address funder) public view returns (ArtemisTypes.TaskState[] memory ret) {
        ret = ArtemisTask.getTasksByFunder(addr, funder);
    }

    function getNTasksByManager(address addr, address manager) public view returns (uint256) {
        return ArtemisTask.getNTasksByManager(addr, manager);
    }

    function getTasksByManager(address addr, address manager)
        public
        view
        returns (ArtemisTypes.TaskState[] memory ret)
    {
        ret = ArtemisTask.getTasksByManager(addr, manager);
    }

    function getNTasksByMercenary(address addr, address mercenary) public view returns (uint256) {
        return ArtemisTask.getNTasksByMercenary(addr, mercenary);
    }

    function getTasksByMercenary(address addr, address mercenary)
        public
        view
        returns (ArtemisTypes.TaskState[] memory ret)
    {
        ret = ArtemisTask.getTasksByMercenary(addr, mercenary);
    }

    function getIfInBlacklist(
        address addr,
        uint256 taskId,
        address account
    ) public view lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) returns (bool) {
        return s.lobbies[addr].tasks[taskId].blacklistMap[account];
    }

    function getMercenarySubmitAmount(
        address addr,
        uint256 taskId,
        address mercenary
    ) public view lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) returns (uint256) {
        return s.lobbies[addr].tasks[taskId].mercenarySubmit[mercenary];
    }

    function getManagerConfirmAmount(
        address addr,
        uint256 taskId,
        address mercenary
    ) public view lobbyExists(addr) notPaused(addr) taskExists(addr, taskId) returns (uint256) {
        return s.lobbies[addr].tasks[taskId].managerConfirm[mercenary];
    }

    // About Lobby
    event AddLobby(address indexed addr, address indexed admin, uint256 fee);

    function addLobby(
        address addr,
        address admin,
        uint256 fee
    ) external onlyCreator lobbyNotExists(addr) feeTooHigh(fee) {
        s.lobbies[addr].addr = addr;
        s.lobbies[addr].admin = admin;
        s.lobbies[addr].fee = fee;
        s.lobbies[addr].idx = s.lobbyIds.length + 1;
        s.lobbies[addr].paused = false;
        s.lobbyIds.push(addr);
        emit AddLobby(addr, admin, fee);
    }

    event EditLobby(address indexed addr, address indexed admin, uint256 fee);

    function editLobby(
        address addr,
        address admin,
        uint256 fee
    ) external onlyCreator lobbyExists(addr) feeTooHigh(fee) {
        s.lobbies[addr].admin = admin;
        s.lobbies[addr].fee = fee;
        emit EditLobby(addr, admin, fee);
    }

    event LobbyAdminChanged(address indexed lobbyAddress, address indexed oldAdmin, address indexed newAdmin);

    function lobbyAdminChanged(address addr, address newAdmin) public lobbyExists(addr) onlyCreatorOrAdmin(addr) {
        require(newAdmin != address(0), "Ownable: new admin is the zero address");

        address oldAdmin = s.lobbies[addr].admin;
        s.lobbies[addr].admin = newAdmin;
        emit LobbyAdminChanged(addr, oldAdmin, newAdmin);
    }

    function getLobbyAdmin(address addr) public view returns (address) {
        return s.lobbies[addr].admin;
    }

    function getLobbyFee(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].fee;
    }

    event LobbyFeeChanged(address indexed addr, uint256 fee);

    function setLobbyFee(address addr, uint256 fee) public lobbyExists(addr) onlyCreatorOrAdmin(addr) feeTooHigh(fee) {
        s.lobbies[addr].fee = fee;
        emit LobbyFeeChanged(addr, fee);
    }

    function getLobbyFeeBalance(address addr)
        external
        view
        lobbyExists(addr)
        onlyCreatorOrAdmin(addr)
        returns (uint256)
    {
        return s.lobbies[addr].feeBalance;
    }

    function sendLobbyFees(
        address addr,
        address to,
        uint256 amount
    ) public lobbyExists(addr) onlyAdmin(addr) {
        require(s.lobbies[addr].feeBalance >= amount, "Not enough fee left");
        s.lobbies[addr].feeBalance -= amount;
        AddressUpgradeable.sendValue(payable(to), amount);
    }

    function collectLobbyFees(address addr) external lobbyExists(addr) onlyAdmin(addr) {
        sendLobbyFees(addr, s.lobbies[addr].admin, s.lobbies[addr].feeBalance);
    }

    function pauseLobby(address addr) external onlyAdmin(addr) lobbyExists(addr) {
        require(s.lobbies[addr].paused == false, "lobby is already paused");
        s.lobbies[addr].paused = true;
    }

    function unpauseLobby(address addr) external onlyAdmin(addr) lobbyExists(addr) {
        require(s.lobbies[addr].paused, "lobby is already unpaused");
        s.lobbies[addr].paused = false;
    }

    function getIfLobbyPause(address addr) public view lobbyExists(addr) returns (bool) {
        return s.lobbies[addr].paused || s.paused;
    }

    function getIfLobbyExists(address addr) public view returns (bool) {
        return s.lobbies[addr].idx > 0;
    }

    function getTaskIds(address addr) public view lobbyExists(addr) returns (uint256[] memory) {
        return s.lobbies[addr].taskIds;
    }

    function getTaskCount(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].taskCount;
    }

    function getTipGivers(address addr) public view lobbyExists(addr) returns (address[] memory) {
        return s.lobbies[addr].tipGivers;
    }

    function getTipGiveTotal(address addr, address account) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].tipGiveTotal[account];
    }

    function getTipReceivers(address addr) public view lobbyExists(addr) returns (address[] memory) {
        return s.lobbies[addr].tipReceivers;
    }

    function getTipReceiveTotal(address addr, address account) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].tipReceiveTotal[account];
    }

    function getFunderPayoutSum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].funderPayoutSum;
    }

    function getFunderTakeAwaySum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].funderTakeAwaySum;
    }

    function getCreatorFeesSum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].creatorFeesSum;
    }

    function getAdminFeesSum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].adminFeesSum;
    }

    function getManagerFeesSum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].managerFeesSum;
    }

    function getTipsSum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].tipsSum;
    }

    function getMercenarySalary(address addr, address account) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].mercenarySalary[account];
    }

    function getMercenariesSalarySum(address addr) public view lobbyExists(addr) returns (uint256) {
        return s.lobbies[addr].mercenariesSalarySum;
    }
}
