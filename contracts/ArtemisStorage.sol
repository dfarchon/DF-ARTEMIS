// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./ArtemisTypes.sol";

// Creator handle with Storage (all the contract state).
contract ArtemisStorage {
    ArtemisTypes.Storage internal s;
    modifier onlyCreator() {
        require(s.creator == msg.sender, "only creator");
        _;
    }
    modifier feeTooHigh(uint256 fee) {
        require(fee <= s.maxFee, "fee too high");
        _;
    }

    function getCreatorFee() public view returns (uint256) {
        return s.creatorFee;
    }

    event CreatorFeeChanged(uint256 creatorfee);

    function setCreatorFee(uint256 fee) external onlyCreator feeTooHigh(fee) {
        s.creatorFee = fee;
        emit CreatorFeeChanged(s.creatorFee);
    }

    function getManagerFee() public view returns (uint256) {
        return s.managerFee;
    }

    event ManagerFeeChanged(uint256 managerfee);

    function setManagerFee(uint256 fee) external onlyCreator feeTooHigh(fee) {
        s.managerFee = fee;
        emit ManagerFeeChanged(s.managerFee);
    }

    function getMinDurationTime() public view returns (uint256) {
        return s.minDurationTime;
    }

    event MinDurationTimeChanged(uint256 minDurationTime);

    function setMinDurationTime(uint256 minDurationTime) external onlyCreator {
        s.minDurationTime = minDurationTime;
        emit MinDurationTimeChanged(s.minDurationTime);
    }

    function getMaxDurationTime() public view returns (uint256) {
        return s.maxDurationTime;
    }

    event MaxDurationTimeChanged(uint256 minDurationTime);

    function setMaxDurationTime(uint256 minDurationTime) external onlyCreator {
        s.maxDurationTime = minDurationTime;
        emit MaxDurationTimeChanged(s.minDurationTime);
    }

    function getMinFunderPayout() public view returns (uint256) {
        return s.minFunderPayout;
    }

    event MinFunderPayoutChanged(uint256 minFunderPayout);

    function setMinFunderPayout(uint256 minFunderPayout) external onlyCreator {
        s.minFunderPayout = minFunderPayout;
        emit MaxFunderPayoutChanged(s.minFunderPayout);
    }

    function getMaxFunderPayout() public view returns (uint256) {
        return s.maxFunderPayout;
    }

    event MaxFunderPayoutChanged(uint256 maxFunderPayout);

    function setMaxFunderPayout(uint256 maxFunderPayout) external onlyCreator {
        s.maxFunderPayout = maxFunderPayout;
        emit MaxFunderPayoutChanged(s.maxFunderPayout);
    }

    function getMaxFee() public view returns (uint256) {
        return s.maxFee;
    }

    event MaxFeeChanged(uint256 maxFee);

    function setMaxFee(uint256 maxFee) external onlyCreator {
        s.maxFee = maxFee;
        emit MaxFeeChanged(s.maxFee);
    }

    function getCreator() public view returns (address) {
        return s.creator;
    }

    event CreatorChanged(address oldCreator, address newCreator);

    function creatorChanged(address creator) public onlyCreator {
        require(creator != address(0), "ownable: new creator is zero address");
        address oldCreator = s.creator;
        s.creator = creator;
        emit CreatorChanged(oldCreator, s.creator);
    }

    function getFeeBalance() external view onlyCreator returns (uint256) {
        return s.feeBalance;
    }

    function sendFees(address to, uint256 amount) public onlyCreator {
        require(s.feeBalance >= amount, "Not enough fee left");
        s.feeBalance -= amount;
        AddressUpgradeable.sendValue(payable(to), amount);
    }

    function collectFees() external onlyCreator {
        sendFees(getCreator(), s.feeBalance);
    }

    function pause() external onlyCreator {
        s.paused = true;
    }

    function unpause() external onlyCreator {
        s.paused = false;
    }

    function getLobbyIds() public view returns (address[] memory) {
        return s.lobbyIds;
    }

    function getBalance(address account) public view returns (uint256) {
        return s.fund[account];
    }

    function getMyBalance() public view returns (uint256) {
        return s.fund[msg.sender];
    }

    event Withdraw(address indexed owner, uint256 amount);

    function withdraw() external {
        uint256 amount = s.fund[msg.sender];
        if (amount > 0) {
            s.fund[msg.sender] = 0;
            AddressUpgradeable.sendValue(payable(msg.sender), amount);
            emit Withdraw(msg.sender, amount);
        }
    }

    event SetupStorage(
        uint256 creatorFee,
        uint256 managerFee,
        uint256 minDurationTime,
        uint256 maxDurationTime,
        uint256 minFunderPayout,
        uint256 getMaxFunderPayout,
        uint256 maxFee
    );

    // set all the state variables except creator && paused
    function setupStorage(
        uint256 creatorFee,
        uint256 managerFee,
        uint256 minDurationTime,
        uint256 maxDurationTime,
        uint256 minFunderPayout,
        uint256 maxFunderPayout,
        uint256 maxFee
    ) external onlyCreator {
        require(creatorFee <= maxFee, "creator fee is too high");
        require(managerFee <= maxFee, "manager fee is too high");
        require(minDurationTime <= maxDurationTime, "about duration time");
        require(minFunderPayout <= maxFunderPayout, "about funder time");

        s.creatorFee = creatorFee;
        s.managerFee = managerFee;
        s.minDurationTime = minDurationTime;
        s.maxDurationTime = maxDurationTime;
        s.minFunderPayout = minFunderPayout;
        s.maxFunderPayout = maxFunderPayout;
        s.maxFee = maxFee;

        emit SetupStorage(
            s.creatorFee,
            s.managerFee,
            s.minDurationTime,
            s.maxDurationTime,
            s.minFunderPayout,
            s.maxFunderPayout,
            s.maxFee
        );
    }

    function getContractBalance() public view onlyCreator returns (uint256) {
        return address(this).balance;
    }
}
