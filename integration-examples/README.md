# Integration Examples

This directory contains integration examples showing how to connect external applications to the Trasabilitate-paine blockchain system.

## Available Examples

### 1. React Integration (`react-integration.jsx`)
Complete React integration with:
- Context provider for blockchain state management
- Custom hooks for contract interaction
- Custom hooks for relayer service
- Example components for registration and verification
- Support for MetaMask and read-only connections

**Usage in React App:**
```bash
# Install dependencies
npm install ethers

# Copy react-integration.jsx to your React project
# Import and use the components
import BlockchainApp from './react-integration';

function App() {
  return <BlockchainApp />;
}
```

### 2. Node.js Integration (`nodejs-integration.js`)
Backend integration examples for:
- Server-side contract interaction
- Batch hash registration
- Event listening and monitoring
- Integration with REST APIs

**Usage:**
```bash
npm install ethers dotenv
node integration-examples/nodejs-integration.js
```

## Quick Start

### For Frontend Applications (React, Vue, Angular)

1. **Install ethers.js:**
   ```bash
   npm install ethers
   ```

2. **Configure your blockchain connection:**
   ```javascript
   const config = {
     rpcUrl: 'http://localhost:8545', // or testnet RPC
     contractAddress: 'YOUR_CONTRACT_ADDRESS',
     relayerUrl: 'http://localhost:3001'
   };
   ```

3. **Choose your integration method:**
   - **Direct Contract Interaction**: Users pay gas fees (requires MetaMask)
   - **Relayer Service**: Gasless transactions (no wallet required)
   - **Hybrid**: Both methods available

### For Backend Applications (Node.js, Python, etc.)

1. **Set up environment variables:**
   ```bash
   RPC_URL=http://localhost:8545
   CONTRACT_ADDRESS=0x...
   PRIVATE_KEY=your_private_key
   ```

2. **Use ethers.js or web3.js to interact with the contract**

3. **Consider using the relayer service for user-initiated transactions**

## Integration Patterns

### Pattern 1: Client-Side DApp
```
User Browser → MetaMask → Smart Contract
```
- **Pros**: Fully decentralized, no backend needed
- **Cons**: Users need wallet and gas fees

### Pattern 2: Relayer-Based
```
User Browser → Relayer Service → Smart Contract
```
- **Pros**: No wallet or gas fees for users
- **Cons**: Requires trusted relayer service

### Pattern 3: Hybrid Backend
```
User Browser → Your Backend → Smart Contract
                         ↘ → Relayer Service
```
- **Pros**: Flexible, can implement custom logic
- **Cons**: More complex architecture

## Configuration

### Local Development
```javascript
{
  rpcUrl: 'http://localhost:8545',
  chainId: 31337,
  contractAddress: 'LOCAL_DEPLOYED_ADDRESS',
  relayerUrl: 'http://localhost:3001'
}
```

### Sepolia Testnet
```javascript
{
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  chainId: 11155111,
  contractAddress: 'SEPOLIA_DEPLOYED_ADDRESS',
  relayerUrl: 'YOUR_RELAYER_URL'
}
```

### Mumbai Testnet (Polygon)
```javascript
{
  rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  chainId: 80001,
  contractAddress: 'MUMBAI_DEPLOYED_ADDRESS',
  relayerUrl: 'YOUR_RELAYER_URL'
}
```

## Common Integration Tasks

### Register a Hash
```javascript
import { ethers } from 'ethers';

const data = { productId: 'BREAD-001', batch: 'B123' };
const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
const tx = await contract.register(hash, '');
await tx.wait();
```

### Verify a Hash
```javascript
const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
const isRegistered = await contract.isRegistered(hash);
console.log('Registered:', isRegistered);
```

### Get Registration Details
```javascript
const registration = await contract.registrations(hash);
console.log('Reporter:', registration.reporter);
console.log('Timestamp:', new Date(Number(registration.timestamp) * 1000));
console.log('IPFS CID:', registration.ipfsCid);
```

### Use Relayer (Gasless)
```javascript
const response = await fetch('http://localhost:3001/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    payload: { productId: 'BREAD-001' },
    reporter: '0xUserAddress',
    signature: '0x'
  })
});
const result = await response.json();
```

## Security Considerations

1. **Input Validation**: Always validate and sanitize user input
2. **Signature Verification**: Implement EIP-712 for relayer submissions
3. **Rate Limiting**: Prevent spam and abuse
4. **CORS Configuration**: Restrict allowed origins
5. **Environment Variables**: Never commit private keys or secrets

## Testing

### Test Your Integration

1. **Start local Hardhat node:**
   ```bash
   npm run node
   ```

2. **Deploy contract:**
   ```bash
   npm run deploy
   ```

3. **Start relayer:**
   ```bash
   npm run relayer
   ```

4. **Run your integration code**

### Test Checklist
- [ ] Can connect to blockchain network
- [ ] Can interact with deployed contract
- [ ] Can register hashes successfully
- [ ] Can verify registered hashes
- [ ] Can retrieve registration details
- [ ] Relayer service responds correctly
- [ ] Error handling works properly
- [ ] Network switching works (if applicable)

## Troubleshooting

### Common Issues

**"Cannot connect to provider"**
- Check RPC_URL is correct
- Ensure network is accessible
- For localhost, start Hardhat node

**"Contract not found"**
- Verify CONTRACT_ADDRESS is correct
- Ensure contract is deployed
- Check you're on the correct network

**"Transaction reverted"**
- Hash might already be registered
- Check account has sufficient balance
- Verify contract permissions

**"Relayer not responding"**
- Ensure relayer service is running
- Check PORT is correct
- Verify CORS configuration

## Additional Resources

- [Main Documentation](../BLOCKCHAIN_CONNECTION.md)
- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js v6 Docs](https://docs.ethers.org/v6/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## Support

For issues or questions:
1. Review the [BLOCKCHAIN_CONNECTION.md](../BLOCKCHAIN_CONNECTION.md) guide
2. Check the troubleshooting section above
3. Open an issue on GitHub with detailed information

---

**Note**: These examples are for demonstration purposes. In production, implement proper security measures, error handling, and testing.
