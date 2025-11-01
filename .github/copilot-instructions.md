# GitHub Copilot Instructions for Trasabilitate-paine

## Project Overview

**Trasabilitate-paine** is a blockchain-based traceability system for bread, tracking its journey from farm to table. This project demonstrates the registration and verification of proofs (hash/CID) on a local blockchain registry using Hardhat and Ethereum smart contracts.

### Purpose
- Track bread supply chain stages (farm, mill, bakery, distribution, consumer)
- Register immutable proofs on blockchain
- Verify authenticity through QR codes and smart contracts
- Provide transparent supply chain visibility

## Technology Stack

- **Blockchain**: Ethereum-compatible networks (Hardhat local, Mumbai testnet, Sepolia testnet)
- **Smart Contracts**: Solidity ^0.8.20
- **Framework**: Hardhat for development and deployment
- **Libraries**: 
  - OpenZeppelin Contracts (AccessControl)
  - ethers.js for blockchain interactions
- **Backend**: Node.js with Express.js (relayer service)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Languages**: Romanian (UI and comments)

## Project Structure

```
.
├── contracts/              # Solidity smart contracts
│   └── SimpleRegistry.sol  # Main registry contract with role-based access
├── scripts/                # Deployment and utility scripts
│   └── deploy.js          # Contract deployment script
├── relayer/               # Relayer service for meta-transactions
│   └── index.js          # Express.js relayer server
├── assets/                # Static assets (QR codes, images)
│   └── qr-b*.svg         # QR code placeholders for each block
├── index.html             # Main interactive UI
├── verify.html            # Verification page
├── script.js              # Frontend logic and Web3 interactions
├── styles.css             # Styling
├── hardhat.config.js      # Hardhat network configurations
└── .env.example           # Environment variables template
```

## Development Environment Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MetaMask browser extension (for testing)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```
   Expected packages: `hardhat`, `@nomiclabs/hardhat-ethers`, `@openzeppelin/contracts`, `ethers`, `express`, `body-parser`, `dotenv`

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

### Running the Development Environment

1. **Start local Hardhat node:**
   ```bash
   npx hardhat node
   ```
   This will start a local blockchain at `http://localhost:8545` with test accounts.

2. **Deploy contracts to local network:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   Note the deployed contract address and update `.env` with `CONTRACT_ADDRESS`.

3. **Start the relayer service:**
   ```bash
   cd relayer
   node index.js
   ```
   The relayer runs in mock mode if `RELAYER_PK` is not set.

4. **Serve the frontend:**
   Open `index.html` in a browser or use a local server:
   ```bash
   npx http-server . -p 8080
   ```

### Testing
Currently, there are no automated test scripts. Manual testing involves:
- Deploying to Hardhat local network
- Interacting through MetaMask with the frontend
- Verifying transactions on the local blockchain

## Environment Variables

Create a `.env` file based on `.env.example`:

- `PRIVATE_KEY`: Private key for deployment (testnet only, NEVER commit real keys)
- `MUMBAI_RPC`: RPC URL for Polygon Mumbai testnet
- `SEPOLIA_RPC`: RPC URL for Ethereum Sepolia testnet  
- `RPC_URL`: RPC endpoint for relayer (default: `http://localhost:8545`)
- `RELAYER_PK`: Private key for relayer wallet (keep secret)
- `CONTRACT_ADDRESS`: Deployed contract address

**Security**: Never commit `.env` or files containing private keys to version control.

## Coding Standards and Best Practices

### Solidity Contracts

- **Solidity Version**: Use `^0.8.20` for all contracts
- **License**: MIT (specify with `// SPDX-License-Identifier: MIT`)
- **Comments**: Use NatSpec format (`/// @notice`, `/// @param`, `/// @return`)
- **Security**:
  - Use OpenZeppelin libraries for access control and security patterns
  - Implement role-based access control (RBAC) where needed
  - Follow checks-effects-interactions pattern
  - Add `require` statements for input validation
  - Emit events for important state changes (indexed parameters for efficient filtering)
- **Naming**:
  - Contracts: PascalCase (e.g., `SimpleRegistry`)
  - Functions: camelCase (e.g., `registerByRelayer`)
  - Constants: UPPER_SNAKE_CASE (e.g., `RELAYER_ROLE`)

### JavaScript/Node.js

- **Style**: Use modern ES6+ syntax
- **Async/Await**: Prefer async/await over promises
- **Error Handling**: Always use try-catch blocks for async operations
- **Comments**: In Romanian for UI-related code, English for technical blockchain code
- **Security**:
  - Validate all user inputs
  - Never expose private keys in code
  - Use environment variables for sensitive configuration
  - Implement signature verification in production relayer

### Frontend

- **Compatibility**: Support modern browsers with Web3 capabilities
- **Web3 Provider**: Use MetaMask or similar Web3 providers
- **User Experience**: Provide clear feedback for wallet connections and transactions
- **Language**: UI text in Romanian

## Smart Contract Architecture

### SimpleRegistry Contract

**Purpose**: Store immutable registration records on-chain with role-based access.

**Key Features**:
- Role-based access control using OpenZeppelin's `AccessControl`
- Two registration methods:
  - `register()`: Direct registration by any address
  - `registerByRelayer()`: Meta-transaction support via relayer role
- Mapping of `bytes32` hashes to registration records
- Events for off-chain indexing

**Roles**:
- `DEFAULT_ADMIN_ROLE`: Contract admin (can grant/revoke roles)
- `RELAYER_ROLE`: Authorized to call `registerByRelayer()`

## Contribution Guidelines

### When Making Changes

1. **Understand the context**: Review related files and the overall architecture
2. **Minimal changes**: Make the smallest possible changes to achieve the goal
3. **Test locally**: Deploy to Hardhat local network and verify functionality
4. **Security first**: 
   - Never commit private keys or secrets
   - Validate inputs and handle errors
   - Consider gas optimization for contract changes
5. **Documentation**: Update comments and documentation for significant changes
6. **Language**: Keep Romanian for user-facing content, English for technical docs

### Contract Changes

- Test deployment on local Hardhat network first
- Verify contract logic with manual testing
- Consider upgradeability implications (current contract is not upgradeable)
- Document any new functions or events

### Frontend Changes

- Test with MetaMask on Hardhat local network
- Ensure responsive design is maintained
- Verify all user interactions provide clear feedback
- Keep UI text in Romanian

### Relayer Changes

- Test in mock mode first (without `RELAYER_PK`)
- Implement proper signature verification for production
- Ensure error handling for blockchain interactions
- Log important events for debugging

## Deployment

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment
```bash
# Configure .env with testnet RPC and PRIVATE_KEY
npx hardhat run scripts/deploy.js --network mumbai
# or
npx hardhat run scripts/deploy.js --network sepolia
```

### Post-Deployment
1. Update `CONTRACT_ADDRESS` in `.env`
2. Verify contract on block explorer (if using testnet)
3. Grant `RELAYER_ROLE` to relayer address if needed
4. Update frontend configuration with contract address

## Common Tasks

### Adding a New Stage to Supply Chain
1. Update frontend UI in `index.html` (add button and modal)
2. Update `script.js` with new stage logic
3. Update styles in `styles.css`
4. Generate QR code for new stage in `assets/`

### Modifying Contract Logic
1. Update `contracts/SimpleRegistry.sol`
2. Redeploy to local network for testing
3. Update frontend/relayer if ABI changes
4. Test end-to-end flow

### Adding Network Support
1. Update `hardhat.config.js` with new network configuration
2. Add corresponding RPC URL to `.env.example`
3. Document network-specific setup in README

## Security Considerations

- **Private Keys**: NEVER commit private keys. Use environment variables.
- **Input Validation**: Validate all inputs in contracts and relayer
- **Access Control**: Use role-based permissions appropriately
- **Signature Verification**: Implement EIP-712 signature verification in production relayer
- **Rate Limiting**: Consider rate limiting for relayer endpoints
- **Gas Limits**: Set appropriate gas limits for transactions
- **Front-running**: Be aware of MEV and front-running risks for public transactions

## Known Limitations

- No automated test suite (manual testing required)
- Relayer runs in mock mode by default (for demo purposes)
- QR codes are placeholders (need to be generated with actual verification URLs)
- Contract is not upgradeable (requires redeployment for changes)
- No package.json (dependencies must be installed manually based on project needs)

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Notes for Copilot

- This is a demonstration/educational project for blockchain traceability
- The frontend uses Romanian for UI text - maintain this convention
- The project lacks package.json - dependencies are installed globally or locally
- Focus on security when handling private keys and blockchain interactions
- Test all changes with Hardhat local network before suggesting testnet deployment
- Consider gas costs for contract modifications
- Maintain the existing code structure and patterns
