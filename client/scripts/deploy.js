
const hre = require("hardhat");



async function main() {
  let deployer;
  [deployer] = await hre.ethers.getSigners();

  console.log("Contract deployed by:", deployer.address);

  console.log("Account Balance:", (await deployer.getBalance()).toString());
  
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortalS");
  const waveContract = await waveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.01")});

  console.log("Contract deployed to:", waveContract.address);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
