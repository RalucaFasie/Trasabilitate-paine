# Blockchain Connection Guide

## Overview

This document describes how to establish a blockchain connection with the Trasabilitate-paine system, enabling external applications (web apps, mobile apps, or other services) to interact with the smart contracts and relayer service.

## Architecture

The system consists of three main components:

### 1. Smart Contract Layer (On-Chain)
- **Contract**: `SimpleRegistry.sol`
- **Functions**: Hash registration, verification, and role-based access control
- **Networks**: Ethereum-compatible (Hardhat local, Sepolia, Mumbai, or any EVM chain)

### 2. Relayer Service (Off-Chain)
- **Purpose**: Gasless transaction submission for users
- **API**: REST endpoint for hash submission
- **Port**: 3001 (configurable via PORT env variable)

### 3. Frontend/Client Application
- **Current**: Vanilla JavaScript web interface
- **Extensible**: Can be integrated with React, Vue, Angular, or mobile apps

## Connection Methods

### Method 1: Direct Smart Contract Interaction

External applications can interact directly with the deployed smart contract using ethers.js or web3.js.

#### Prerequisites
```bash
npm install ethers
```

#### JavaScript Example
```javascript
import { ethers } from 'ethers';

// Contract ABI (minimal interface)
const CONTRACT_ABI = [
  'function register(bytes32 h, string calldata ipfsCid) external',
  'function isRegistered(bytes32 h) external view returns (bool)',
  'function registrations(bytes32) external view returns (address reporter, uint256 timestamp, string ipfsCid)',
  'event HashRegistered(bytes32 indexed h, address indexed reporter, string ipfsCid, uint256 timestamp)'
];

// Connect to blockchain
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const signer = provider.getSigner(); // or use wallet

// Connect to contract
const contractAddress = 'DEPLOYED_CONTRACT_ADDRESS';
const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

// Register a hash
const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(yourData)));
const tx = await contract.register(dataHash, 'optional-ipfs-cid');
await tx.wait();

// Verify a hash
const isRegistered = await contract.isRegistered(dataHash);
console.log('Hash registered:', isRegistered);

// Get registration details
const registration = await contract.registrations(dataHash);
console.log('Reporter:', registration.reporter);
console.log('Timestamp:', new Date(Number(registration.timestamp) * 1000));
console.log('IPFS CID:', registration.ipfsCid);
```

#### React Integration Example
```javascript
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

function BlockchainConnector() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
  const CONTRACT_ABI = [/* ABI as above */];

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        // Use MetaMask or injected provider
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = await web3Provider.getSigner();
        
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        
        setProvider(web3Provider);
        setContract(contractInstance);
        setConnected(true);
      }
    };
    init();
  }, []);

  const registerHash = async (data) => {
    if (!contract) return;
    const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
    const tx = await contract.register(hash, '');
    await tx.wait();
    return hash;
  };

  const verifyHash = async (hash) => {
    if (!contract) return false;
    return await contract.isRegistered(hash);
  };

  return { connected, registerHash, verifyHash };
}

export default BlockchainConnector;
```

### Method 2: Relayer Service Integration (Gasless Transactions)

The relayer service allows users to submit transactions without paying gas fees. This is ideal for end-users who don't have cryptocurrency.

#### API Endpoint
```
POST http://localhost:3001/submit
```

#### Request Format
```json
{
  "payload": {
    "ipfsCid": "optional-cid",
    "data": "any additional metadata"
  },
  "reporter": "0xUserAddress",
  "signature": "0x..." 
}
```

#### Response (Mock Mode)
```json
{
  "ok": true,
  "note": "Relayer running in mock mode (no tx sent)",
  "hash": "0x..."
}
```

#### Response (Production Mode)
```json
{
  "ok": true,
  "txHash": "0x...",
  "hash": "0x..."
}
```

#### JavaScript/TypeScript Client Example

⚠️ **SECURITY WARNING**: The examples below use empty signatures (`'0x'`) for demonstration purposes only. In production environments, you MUST implement proper EIP-712 signature verification to prevent unauthorized transactions through the relayer service.

```javascript
async function submitToRelayer(data, userAddress) {
  const response = await fetch('http://localhost:3001/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload: data,
      reporter: userAddress,
      signature: '0x' // ⚠️ INSECURE: In production, implement EIP-712 signature
    })
  });
  
  const result = await response.json();
  return result;
}

// Usage
const data = {
  ipfsCid: 'QmExample',
  productId: 'BREAD-001',
  timestamp: Date.now()
};

const result = await submitToRelayer(data, '0xUserAddress');
console.log('Hash registered:', result.hash);
console.log('Transaction:', result.txHash);
```

#### React Hook for Relayer
```javascript
import { useState } from 'react';

function useRelayer(relayerUrl = 'http://localhost:3001') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitData = async (payload, reporter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${relayerUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, reporter, signature: '0x' })
      });
      
      if (!response.ok) {
        throw new Error('Relayer submission failed');
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitData, loading, error };
}

export default useRelayer;
```

## Network Configuration

### Local Development (Hardhat)
```javascript
const config = {
  rpcUrl: 'http://localhost:8545',
  chainId: 31337,
  contractAddress: 'DEPLOYED_LOCAL_ADDRESS'
};
```

### Sepolia Testnet
```javascript
const config = {
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  chainId: 11155111,
  contractAddress: 'DEPLOYED_SEPOLIA_ADDRESS'
};
```

### Mumbai Testnet (Polygon)
```javascript
const config = {
  rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  chainId: 80001,
  contractAddress: 'DEPLOYED_MUMBAI_ADDRESS'
};
```

## Connection Verification

### Health Check Script

Create a simple script to verify blockchain connectivity:

```javascript
// verify-connection.js
const { ethers } = require('ethers');
require('dotenv').config();

async function verifyConnection() {
  try {
    // 1. Check RPC connection
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId);
    
    // 2. Check contract deployment
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      console.log('❌ Contract not deployed at', contractAddress);
      return false;
    }
    console.log('✅ Contract deployed at:', contractAddress);
    
    // 3. Check relayer service
    try {
      const response = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: { test: true },
          reporter: ethers.ZeroAddress,
          signature: '0x'
        })
      });
      if (response.ok || response.status === 400) {
        console.log('✅ Relayer service is running');
      }
    } catch (err) {
      console.log('⚠️  Relayer service not available:', err.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection verification failed:', error.message);
    return false;
  }
}

verifyConnection();
```

### Environment Setup Checklist

- [ ] Node.js >= 18.0.0 installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured with RPC_URL and CONTRACT_ADDRESS
- [ ] Smart contract compiled (`npm run compile`)
- [ ] Contract deployed (`npm run deploy` or `npm run deploy:sepolia`)
- [ ] Relayer service running (`npm run relayer`)
- [ ] Network accessible (for testnet deployments)

## Integration Patterns

### Pattern 1: Client-Side Only (Direct Contract Interaction)
**Best for**: DApps where users have wallets and can pay gas
```
User Browser → MetaMask → Smart Contract
```

### Pattern 2: Hybrid (Relayer + Direct)
**Best for**: Applications needing both gasless and direct interactions
```
User Browser → Relayer Service → Smart Contract (gasless)
          ↘ → MetaMask → Smart Contract (user-initiated)
```

### Pattern 3: Backend-Integrated
**Best for**: Enterprise applications with backend services
```
User Browser → Your Backend → Relayer Service → Smart Contract
```

## Security Considerations

⚠️ **CRITICAL**: The code examples in this document use empty signatures (`'0x'`) for demonstration purposes ONLY. This is NOT secure for production use.

### For Direct Contract Interaction
1. **Input Validation**: Always validate and sanitize data before hashing
2. **Signature Verification**: Implement EIP-712 for typed data signing
3. **Rate Limiting**: Prevent spam transactions
4. **Gas Estimation**: Check gas costs before submitting transactions

### For Relayer Integration
1. **⚠️ SIGNATURE VERIFICATION (CRITICAL)**: The current relayer accepts empty signatures for testing. In production, you MUST implement proper EIP-712 signature verification to authenticate users and prevent unauthorized transaction submission.
2. **Authentication**: Implement API authentication (JWT, API keys)
3. **Rate Limiting**: Prevent abuse of gasless transactions
4. **Monitoring**: Monitor relayer wallet balance
5. **CORS Configuration**: Configure CORS for allowed origins

### EIP-712 Signature Implementation (Required for Production)

For production relayer deployments, implement signature verification:

```javascript
// Example: EIP-712 signature verification (to be implemented)
const domain = {
  name: 'TrasabilitatePaine',
  version: '1',
  chainId: await provider.getNetwork().chainId,
  verifyingContract: contractAddress
};

const types = {
  Registration: [
    { name: 'payload', type: 'string' },
    { name: 'reporter', type: 'address' },
    { name: 'timestamp', type: 'uint256' }
  ]
};

// Verify signature before accepting relayer request
const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
if (recoveredAddress !== reporter) {
  throw new Error('Invalid signature');
}
```

See [EIP-712 specification](https://eips.ethereum.org/EIPS/eip-712) for implementation details.

## Troubleshooting

### Common Connection Issues

#### "Cannot connect to RPC"
- Check RPC_URL is correct and accessible
- Verify network connectivity
- For local development, ensure Hardhat node is running

#### "Contract not deployed"
- Verify CONTRACT_ADDRESS is set correctly
- Ensure contract is deployed to the correct network
- Check deployment logs for deployment address

#### "Relayer not responding"
- Verify relayer service is running (`npm run relayer`)
- Check relayer is configured with correct RPC_URL
- Ensure PORT is not blocked by firewall

#### "Transaction reverted"
- Check if hash is already registered
- Verify wallet has sufficient balance (for direct interaction)
- Ensure proper role permissions for relayer operations

## Testing Connection

### Quick Test Script
```bash
# In project directory
node -e "
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
provider.getNetwork().then(n => console.log('Connected:', n.name));
"
```

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712)

## Support

For issues or questions about blockchain connectivity:
1. Check this documentation
2. Review error logs
3. Open an issue on GitHub with:
   - Network configuration
   - Error messages
   - Steps to reproduce

---

**Last Updated**: November 2025
**Version**: 1.0.0
