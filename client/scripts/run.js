const hre = require("hardhat");

let owner,
    waveCount,
    waveTxn,
    allwaves,
    contractBalance;

async function main(){
    [owner, randoPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortalS");
    const waveContract = await waveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.01")});
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log("ContractBalance", ethers.utils.formatEther(contractBalance));

    waveCount = await waveContract.TotalWaves();
    console.log(waveCount.toNumber());

    waveTxn = await waveContract.wave("Hello Life");
    await waveTxn.wait();

    waveTxn = await waveContract.wave("Boundaries");
    await waveTxn.wait();

    contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log("ContractBalance", ethers.utils.formatEther(contractBalance));
    
    allwaves = await waveContract.getAllWaves();
    console.log(allwaves);

    waveCount = await waveContract.TotalWaves();
    console.log(waveCount.toNumber());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });