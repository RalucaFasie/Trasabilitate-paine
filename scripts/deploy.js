async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const Registry = await ethers.getContractFactory('SimpleRegistry');
  const registry = await Registry.deploy(deployer.address);
  await registry.deployed();

  console.log('SimpleRegistry deployed to:', registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});