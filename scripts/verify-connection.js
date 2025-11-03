#!/usr/bin/env node

/**
 * Blockchain Connection Verification Script
 * 
 * This script verifies that all components of the blockchain system
 * are properly configured and accessible.
 * 
 * Usage: node scripts/verify-connection.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

async function checkRpcConnection() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('1. Checking RPC Connection', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  
  const rpcUrl = process.env.RPC_URL;
  
  if (!rpcUrl) {
    error('RPC_URL not set in environment variables');
    warning('Set RPC_URL in .env file');
    return null;
  }
  
  info(`RPC URL: ${rpcUrl}`);
  
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    success(`Connected to network: ${network.name}`);
    success(`Chain ID: ${network.chainId}`);
    success(`Current block: ${blockNumber}`);
    
    return provider;
  } catch (err) {
    error(`Failed to connect to RPC: ${err.message}`);
    warning('Check that:');
    console.log('  - RPC URL is correct');
    console.log('  - Network is accessible');
    console.log('  - For localhost, ensure Hardhat node is running (npm run node)');
    return null;
  }
}

async function checkContractDeployment(provider) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('2. Checking Contract Deployment', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    warning('CONTRACT_ADDRESS not set in environment variables');
    info('Deploy contract with: npm run deploy');
    info('Then set CONTRACT_ADDRESS in .env file');
    return null;
  }
  
  info(`Contract address: ${contractAddress}`);
  
  try {
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      error(`No contract deployed at ${contractAddress}`);
      warning('Deploy contract with: npm run deploy');
      return null;
    }
    
    success(`Contract found at ${contractAddress}`);
    success(`Bytecode size: ${(code.length - 2) / 2} bytes`);
    
    // Try to interact with contract
    const contractABI = [
      'function RELAYER_ROLE() view returns (bytes32)',
      'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    try {
      const relayerRole = await contract.RELAYER_ROLE();
      const adminRole = await contract.DEFAULT_ADMIN_ROLE();
      success('Contract interface verified');
      info(`RELAYER_ROLE: ${relayerRole}`);
      info(`DEFAULT_ADMIN_ROLE: ${adminRole}`);
    } catch (err) {
      warning('Could not verify contract interface');
      warning('Contract may not be SimpleRegistry or ABI mismatch');
    }
    
    return contract;
  } catch (err) {
    error(`Failed to check contract: ${err.message}`);
    return null;
  }
}

async function checkRelayerService() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('3. Checking Relayer Service', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  
  const relayerUrl = `http://localhost:${process.env.PORT || 3001}`;
  info(`Relayer URL: ${relayerUrl}`);
  
  try {
    // Try to make a test request (will fail validation but confirms service is running)
    const response = await fetch(`${relayerUrl}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: { test: 'connection-check' },
        reporter: ethers.ZeroAddress,
        signature: '0x',
      }),
    });
    
    // Service is running if we get any response (even 400 for bad request)
    if (response.status === 400 || response.status === 200 || response.status === 500) {
      success('Relayer service is running');
      const data = await response.json();
      
      if (data.note && data.note.includes('mock mode')) {
        warning('Relayer running in MOCK MODE');
        info('Set RELAYER_PK in .env to enable real transactions');
      } else {
        success('Relayer configured for real transactions');
      }
      
      return true;
    }
    
    error(`Unexpected response status: ${response.status}`);
    return false;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      warning('Relayer service is not running');
      info('Start relayer with: npm run relayer');
    } else {
      error(`Failed to connect to relayer: ${err.message}`);
    }
    return false;
  }
}

async function checkEnvironmentVariables() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('4. Checking Environment Configuration', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  
  const requiredVars = {
    RPC_URL: process.env.RPC_URL,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  };
  
  const optionalVars = {
    RELAYER_PK: process.env.RELAYER_PK,
    PORT: process.env.PORT || '3001 (default)',
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    MUMBAI_RPC: process.env.MUMBAI_RPC,
    SEPOLIA_RPC: process.env.SEPOLIA_RPC,
  };
  
  log('\nRequired Variables:', colors.cyan);
  let allRequired = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      success(`${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
    } else {
      error(`${key}: NOT SET`);
      allRequired = false;
    }
  }
  
  log('\nOptional Variables:', colors.cyan);
  for (const [key, value] of Object.entries(optionalVars)) {
    if (value && value !== '3001 (default)') {
      success(`${key}: ${key.includes('KEY') || key.includes('PK') ? '****' : value.substring(0, 50)}`);
    } else if (value === '3001 (default)') {
      info(`${key}: ${value}`);
    } else {
      info(`${key}: Not set`);
    }
  }
  
  if (!allRequired) {
    log('\nℹ️  Copy .env.example to .env and configure required variables', colors.cyan);
  }
  
  return allRequired;
}

async function main() {
  log('\n╔════════════════════════════════════════════╗', colors.blue);
  log('║  Blockchain Connection Verification Tool  ║', colors.blue);
  log('╚════════════════════════════════════════════╝', colors.blue);
  
  const envOk = await checkEnvironmentVariables();
  const provider = await checkRpcConnection();
  const contract = provider ? await checkContractDeployment(provider) : null;
  const relayerOk = await checkRelayerService();
  
  // Summary
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('Summary', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  
  const results = {
    'Environment Configuration': envOk,
    'RPC Connection': !!provider,
    'Contract Deployment': !!contract,
    'Relayer Service': relayerOk,
  };
  
  for (const [check, passed] of Object.entries(results)) {
    if (passed) {
      success(check);
    } else {
      error(check);
    }
  }
  
  const allPassed = Object.values(results).every((v) => v);
  
  if (allPassed) {
    log('\n🎉 All checks passed! System is ready for use.', colors.green);
  } else {
    log('\n⚠️  Some checks failed. Review the output above for details.', colors.yellow);
    log('\nQuick Start Guide:', colors.cyan);
    if (!envOk) {
      console.log('  1. Copy .env.example to .env');
      console.log('  2. Configure RPC_URL and other variables');
    }
    if (!provider) {
      console.log('  3. For local dev: npm run node (in separate terminal)');
    }
    if (!contract) {
      console.log('  4. Deploy contract: npm run deploy');
      console.log('  5. Copy contract address to CONTRACT_ADDRESS in .env');
    }
    if (!relayerOk) {
      console.log('  6. Start relayer: npm run relayer');
    }
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run verification
main().catch((error) => {
  error(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
