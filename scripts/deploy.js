async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('\n========================================');
  console.log('🚀 Deploying SimpleRegistry Contract');
  console.log('========================================');
  console.log('📍 Network:', (await ethers.provider.getNetwork()).name);
  console.log('👤 Deployer:', deployer.address);
  console.log('💰 Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH');
  console.log('========================================\n');

  const Registry = await ethers.getContractFactory('SimpleRegistry');
  console.log('⏳ Deploying contract...');
  
  const registry = await Registry.deploy(deployer.address);
  await registry.waitForDeployment();
  
  const address = await registry.getAddress();

  console.log('\n========================================');
  console.log('✅ Deployment Successful!');
  console.log('========================================');
  console.log('📝 Contract Address:', address);
  console.log('========================================');
  console.log('\n💡 Next steps:');
  console.log('1. Update CONTRACT_ADDRESS in .env file:');
  console.log(`   CONTRACT_ADDRESS=${address}`);
  console.log('2. Start the relayer: npm run relayer');
  console.log('3. Open index.html in your browser\n');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});