pragma solidity ^0.8.1;

import "hardhat/console.sol";

contract WavePortalS{
    constructor () payable {
        console.log("This has been uppdated");
    }

    uint totalWaves;
    uint seed;

    struct Wave{
        address waver;
        string message;
        uint timestamp;
    }

    mapping(address => uint) lastWaveAt;

    Wave[] waves;

    event NewWave(address indexed from, uint timestamp, string message);

    function wave(string memory _message) public {
        require(lastWaveAt[msg.sender] + 1 minutes < block.timestamp, "Wait 1minutes");
        lastWaveAt[msg.sender] = block.timestamp;
        totalWaves++;
        console.log("%s has waved and said %s", msg.sender,_message);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        uint randomNumber = (block.difficulty + block.timestamp + seed)%100;
        seed = randomNumber;
        console.log(randomNumber);

        if(randomNumber < 50) {
            console.log("%s won", msg.sender);
            uint prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "Trying to withdraw more than the contract");
            (bool success,)= (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contracti");
        }

        
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function TotalWaves() public view returns(uint){
        console.log("We have %s total waves", totalWaves);
        return totalWaves;
    }
}