import { ethers } from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();
  const beginBalance = await deployer.getBalance();

  
  console.log("begin balance:", (beginBalance.toString()));
  const ArtemisTask = await ethers.getContractFactory("ArtemisTask");
  const artemisTask = await ArtemisTask.deploy();
  await artemisTask.deployed();
  console.log("artemisTask addr:");
  console.log(artemisTask.address);


  const Artemis = await ethers.getContractFactory("Artemis", {
    libraries: {
      ArtemisTask: artemisTask.address,
    },
  });

  const artemis = await Artemis.deploy();
  await artemis.deployed();
  console.log("deploy finished");

  console.log('artemis address:');
  console.log(artemis.address);
  console.log('gasPrice:')
  console.log(artemis.deployTransaction.gasPrice);




  const endBalance = await deployer.getBalance();
  console.log("end balance:", endBalance.toString());

  const cost = beginBalance.sub(endBalance);

  console.log('cost:',cost.toString(),' wei');
  const gweiAmount = ethers.utils.formatUnits(cost, 'gwei');
  console.log(gweiAmount,'gwei');
  const ethAmount = ethers.utils.formatUnits(cost);
  console.log(ethAmount,'eth');
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
