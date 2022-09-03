// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

library ArtemisTypes {
    struct Task {
        uint256 taskId;
        uint256 planetId;
        address funder;
        uint256 payoutTotal;
        uint256 payoutBalance;
        uint256 beginTime;
        uint256 durationTime;
        uint256 x; // x wei/energy
        address manager;
        address[] mercenaries;
        address[] blacklist;
        mapping(address => bool) blacklistMap;
        mapping(address => uint256) mercenarySubmit;
        mapping(address => uint256) managerConfirm;
    }

    struct TaskState {
        uint256 taskId;
        uint256 planetId;
        address funder;
        uint256 payoutTotal;
        uint256 payoutBalance;
        uint256 beginTime;
        uint256 durationTime;
        uint256 x; // x wei / energy
        address manager;
        address[] mercenaries;
        address[] blacklist;
    }

    struct Lobby {
        address addr;
        address admin;
        uint256 fee;
        uint256 feeBalance;
        bool paused;
        uint256[] taskIds;
        uint256 taskCount;
        uint256 idx; // begin from 1  lobby id
        mapping(uint256 => Task) tasks;
        address[] tipGivers;
        mapping(address => uint256) tipGiveTotal;
        address[] tipReceivers;
        mapping(address => uint256) tipReceiveTotal;
        // to do data analysis
        uint256 funderPayoutSum;
        uint256 funderTakeAwaySum;
        uint256 creatorFeesSum;
        uint256 adminFeesSum;
        uint256 managerFeesSum;
        uint256 tipsSum;
        mapping(address => uint256) mercenarySalary;
        uint256 mercenariesSalarySum;
    }

    struct Storage {
        uint256 creatorFee; // 200 means 2%
        uint256 managerFee;
        uint256 minDurationTime;
        uint256 maxDurationTime;
        uint256 minFunderPayout;
        uint256 maxFunderPayout;
        uint256 maxFee;
        address creator;
        uint256 feeBalance;
        uint256 nextTaskId; //
        bool paused;
        address[] lobbyIds;
        mapping(address => Lobby) lobbies;
        mapping(address => uint256) fund;
    }
}
