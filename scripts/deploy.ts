import { ethers } from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();


  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ArtemisTask = await ethers.getContractFactory("ArtemisTask");
  const artemisTask = await ArtemisTask.deploy();
  console.log("artemisTask addr:");
  console.log(artemisTask.address);


  const Artemis = await ethers.getContractFactory("Artemis", {
    libraries: {
      ArtemisTask: artemisTask.address,
    },
  });

  const artemis = await Artemis.deploy();
  console.log('artemis address:');
  console.log(artemis.address);

  await artemis.deployed();
  console.log("deploy finished");
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
