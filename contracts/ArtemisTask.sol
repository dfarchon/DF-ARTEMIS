// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "./ArtemisTypes.sol";

library ArtemisTask {
    function s() public pure returns (ArtemisTypes.Storage storage ret) {
        bytes32 position = bytes32(uint256(1));
        assembly {
            ret.slot := position
        }
    }

    function funderPublish(
        address addr,
        uint256 planetId,
        uint256 payout,
        uint256 x,
        uint256 durationTime,
        address[] memory blacklist
    ) public returns (uint256) {
        uint256 taskId = s().nextTaskId;
        s().nextTaskId++;
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        task.taskId = taskId;
        task.planetId = planetId;
        task.funder = msg.sender;
        task.payoutTotal = payout;
        task.payoutBalance = payout;
        task.beginTime = block.timestamp;
        task.durationTime = durationTime;
        task.x = x;
        task.manager = s().lobbies[addr].admin;
        task.blacklist = blacklist;
        address banAcount;
        for (uint256 i = 0; i < blacklist.length; i++) {
            banAcount = blacklist[i];
            task.blacklistMap[banAcount] = true;
        }
        s().lobbies[addr].taskIds.push(taskId);
        s().lobbies[addr].taskCount++;
        s().lobbies[addr].funderPayoutSum += payout;
        return taskId;
    }

    function funderAddPayout(
        address addr,
        uint256 taskId,
        uint256 amount
    ) public {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        require(task.funder == msg.sender, "only funder");
        require(amount > 0, "need amount > 0");
        require(amount + task.payoutTotal <= s().maxFunderPayout, "payout<=max");
        // v0.0.2: no need to set add payout time limit
        // require(task.beginTime + task.durationTime >= block.timestamp, "have no time");

        task.payoutTotal += amount;
        task.payoutBalance += amount;
        s().lobbies[addr].funderPayoutSum += amount;
    }

    function funderChangeTime(
        address addr,
        uint256 taskId,
        uint256 durationTime
    ) public {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        require(task.funder == msg.sender, "only funder");
        require(durationTime >= s().minDurationTime, "duration time too short");
        require(durationTime <= s().maxDurationTime, "duration time too long");
        require(task.durationTime < durationTime, "duration time only can be longer");
        task.durationTime = durationTime;
    }

    // function funderChangeX(
    //     address addr,
    //     uint256 taskId,
    //     uint256 x
    // ) public {
    //     ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
    //     require(task.funder == msg.sender, "only funder");
    //     require(x != 0, "x can't be 0");
    //     require(task.x < x, "x only can be bigger");
    //     task.x = x;
    // }

    function mercenaryClaim(
        address addr,
        uint256 taskId,
        uint256 amount
    ) public {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        require(amount > 0, "amount need > 0");
        require(task.blacklistMap[msg.sender] == false, "in blacklist");
        require(task.funder != msg.sender, "funder!=mercenary");
        require(task.manager != msg.sender, "manager!=mercenary");

        if (task.mercenarySubmit[msg.sender] == 0) task.mercenaries.push(msg.sender);

        task.mercenarySubmit[msg.sender] = amount;
    }

    function giveTips(
        address addr,
        address account,
        uint256 amount
    ) public {
        require(msg.sender != account, "can't give tips to yourself");
        require(amount > 0, "amount need > 0");
        if (s().lobbies[addr].tipGiveTotal[msg.sender] == 0) s().lobbies[addr].tipGivers.push(msg.sender);

        if (s().lobbies[addr].tipReceiveTotal[msg.sender] == 0) s().lobbies[addr].tipReceivers.push(msg.sender);

        s().lobbies[addr].tipGiveTotal[msg.sender] += amount;
        s().lobbies[addr].tipReceiveTotal[msg.sender] += amount;

        s().lobbies[addr].tipsSum += amount;
        s().fund[account] += amount;
    }

    function managerConfirm(
        address addr,
        uint256 taskId,
        address mercenary,
        uint256 amount
    ) public {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];

        require(msg.sender == task.manager, "only manager");
        require(task.blacklistMap[mercenary] == false, "mercenary in blacklist");
        require(task.mercenarySubmit[mercenary] == amount, "confirm value != claim value");
        require(task.managerConfirm[mercenary] < amount, "only can confirm more");
        require(mercenary != task.funder, "mercenary!=task.funder");
        amount -= task.managerConfirm[mercenary];
        require(amount > 0, "amount need > 0");
        require(task.payoutBalance >= amount, "funder payout is not enough");
        uint256 creatorFees = (s().creatorFee * amount) / 10000;
        uint256 adminFees = (s().lobbies[addr].fee * amount) / 10000;
        uint256 managerFees = (s().managerFee * amount) / 10000;
        uint256 mercenaryGet = amount - creatorFees - adminFees - managerFees;

        s().fund[mercenary] += mercenaryGet;
        s().feeBalance += creatorFees;
        s().lobbies[addr].feeBalance += adminFees;
        s().fund[task.manager] += managerFees;
        task.payoutBalance -= amount;
        // v0.0.2: state update for manager confirm
        task.managerConfirm[mercenary] += amount;

        s().lobbies[addr].creatorFeesSum += creatorFees;
        s().lobbies[addr].adminFeesSum += adminFees;
        s().lobbies[addr].managerFeesSum += managerFees;
        s().lobbies[addr].mercenarySalary[mercenary] += mercenaryGet;
        s().lobbies[addr].mercenariesSalarySum += mercenaryGet;
    }

    // funderLeave

    function getIfTaskExists(address addr, uint256 taskId) public view returns (bool) {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        return task.funder != address(0) && task.manager != address(0);
    }

    function getTaskState(address addr, uint256 taskId) public view returns (ArtemisTypes.TaskState memory ret) {
        ArtemisTypes.Task storage task = s().lobbies[addr].tasks[taskId];
        ret.taskId = task.taskId;
        ret.planetId = task.planetId;
        ret.funder = task.funder;
        ret.payoutTotal = task.payoutTotal;
        ret.payoutBalance = task.payoutBalance;
        ret.beginTime = task.beginTime;
        ret.durationTime = task.durationTime;
        ret.x = task.x;
        ret.manager = task.manager;
        ret.mercenaries = task.mercenaries;
        ret.blacklist = task.blacklist;
    }

    function bulkGetTasks(
        address addr,
        uint256 startIdx,
        uint256 endIdx
    ) public view returns (ArtemisTypes.TaskState[] memory ret) {
        ret = new ArtemisTypes.TaskState[](endIdx - startIdx);
        for (uint256 idx = startIdx; idx < endIdx; idx++) {
            ret[idx - startIdx] = getTaskState(addr, s().lobbies[addr].taskIds[idx]);
        }
    }

    function getTaskPage(
        address addr,
        uint256 pageIdx,
        uint256 pageSize
    ) public view returns (ArtemisTypes.TaskState[] memory ret) {
        uint256 startIdx = pageIdx * pageSize;
        require(startIdx <= s().lobbies[addr].taskIds.length, "Page number too high");
        uint256 pageEnd = startIdx + pageSize;
        uint256 endIdx = pageEnd <= s().lobbies[addr].taskIds.length ? pageEnd : s().lobbies[addr].taskIds.length;
        return bulkGetTasks(addr, startIdx, endIdx);
    }

    function getNTasksByFunder(address addr, address funder) public view returns (uint256) {
        uint256 cnt = 0;
        ArtemisTypes.TaskState memory taskState;

        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskState = getTaskState(addr, s().lobbies[addr].taskIds[i]);
            if (taskState.funder == funder) cnt++;
        }
        return cnt;
    }

    function getTasksByFunder(address addr, address funder) public view returns (ArtemisTypes.TaskState[] memory ret) {
        ret = new ArtemisTypes.TaskState[](getNTasksByFunder(addr, funder));
        uint256 pos = 0;
        ArtemisTypes.TaskState memory taskState;
        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskState = getTaskState(addr, s().lobbies[addr].taskIds[i]);
            if (taskState.funder == funder) {
                ret[pos] = taskState;
                pos++;
            }
        }
    }

    function getNTasksByManager(address addr, address manager) public view returns (uint256) {
        uint256 cnt = 0;
        ArtemisTypes.TaskState memory taskState;
        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskState = getTaskState(addr, s().lobbies[addr].taskIds[i]);
            if (taskState.manager == manager) cnt++;
        }
        return cnt;
    }

    function getTasksByManager(address addr, address manager)
        public
        view
        returns (ArtemisTypes.TaskState[] memory ret)
    {
        ret = new ArtemisTypes.TaskState[](getNTasksByManager(addr, manager));
        uint256 pos = 0;
        ArtemisTypes.TaskState memory taskState;
        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskState = getTaskState(addr, s().lobbies[addr].taskIds[i]);
            if (taskState.manager == manager) {
                ret[pos] = taskState;
                pos++;
            }
        }
    }

    function getNTasksByMercenary(address addr, address mercenary) public view returns (uint256) {
        uint256 cnt = 0;
        uint256 taskId;
        ArtemisTypes.Task storage task;
        ArtemisTypes.TaskState memory taskState;
        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskId = s().lobbies[addr].taskIds[i];
            task = s().lobbies[addr].tasks[taskId];
            taskState = getTaskState(addr, taskId);

            if (task.mercenarySubmit[mercenary] != 0) cnt++;
        }
        return cnt;
    }

    function getTasksByMercenary(address addr, address mercenary)
        public
        view
        returns (ArtemisTypes.TaskState[] memory ret)
    {
        ret = new ArtemisTypes.TaskState[](getNTasksByMercenary(addr, mercenary));
        uint256 pos = 0;
        uint256 taskId;
        ArtemisTypes.Task storage task;
        ArtemisTypes.TaskState memory taskState;
        for (uint256 i = 0; i < s().lobbies[addr].taskIds.length; i++) {
            taskId = s().lobbies[addr].taskIds[i];
            task = s().lobbies[addr].tasks[taskId];
            taskState = getTaskState(addr, taskId);
            if (task.mercenarySubmit[mercenary] != 0) {
                ret[pos] = taskState;
                pos++;
            }
        }
    }
}
