# GitHub Copilot Instructions for Trasabilitate-paine

This document provides context and guidelines for GitHub Copilot coding agent when working on this blockchain-based bread traceability project.

## Project Overview

This is a blockchain-based traceability system for bread production built with:
- **Smart Contracts**: Solidity 0.8.20 with OpenZeppelin libraries
- **Blockchain Framework**: Hardhat for development, testing, and deployment
- **Backend**: Express.js relayer service with ethers.js v6
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## Development Environment Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Initial Setup
```bash
npm install
```

### Build and Test Commands
```bash
# Compile smart contracts
npm run compile

# Run test suite
npm test

# Clean build artifacts
npm run clean

# Start local Hardhat blockchain node
npm run node

# Deploy contract locally (in separate terminal)
npm run deploy

# Deploy to testnets
npm run deploy:mumbai
npm run deploy:sepolia

# Start relayer service
npm run relayer
```

## Code Conventions

### Solidity Smart Contracts
- **Version**: Use Solidity 0.8.20 exactly (defined in hardhat.config.js)
- **Style**: Follow OpenZeppelin patterns and conventions
- **Security**: Use OpenZeppelin audited contracts and access control patterns
- **Comments**: Add NatSpec documentation (`@notice`, `@dev`, `@param`, `@return`) for all public/external functions
- **Gas optimization**: Be mindful of gas costs in contract design
- **Pattern**: Follow checks-effects-interactions pattern to prevent reentrancy

### JavaScript (Backend/Relayer)
- **Version**: ES6+ features
- **Async**: Use async/await for asynchronous operations, not callbacks
- **ethers.js**: This project uses ethers.js v6 (not v5) - syntax differences are important
- **Error handling**: Always use try/catch blocks for contract interactions
- **Environment variables**: Load from .env using dotenv package
- **Comments**: Add JSDoc comments for complex functions

### Frontend (HTML/JavaScript)
- **Style**: Use semantic HTML5 elements
- **JavaScript**: Vanilla JavaScript (no frameworks)
- **CSS**: CSS variables for theming (defined in styles.css)
- **Responsive**: Ensure mobile responsiveness
- **Browser compatibility**: Test on multiple browsers

## Testing Guidelines

### Test Framework
- Use Hardhat testing framework with Chai assertions
- Tests are in `test/` directory

### Test Structure
```javascript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup - deploy contracts, get signers
  });

  it("Should handle expected behavior", async function () {
    // Arrange
    const input = "test";
    
    // Act
    const result = await contract.method(input);
    
    // Assert
    expect(result).to.equal(expected);
  });

  it("Should revert with proper error message", async function () {
    await expect(contract.method()).to.be.revertedWith("Error message");
  });
});
```

### What to Test
- Test both success and failure cases
- Test access control and permissions
- Test event emissions
- Test edge cases and boundary conditions
- Use descriptive test names that explain what is being tested

## File Structure

```
├── contracts/           # Solidity smart contracts
│   └── SimpleRegistry.sol
├── scripts/            # Deployment scripts
│   └── deploy.js
├── relayer/            # Backend Express.js relayer service
│   └── index.js
├── test/               # Hardhat tests
│   └── SimpleRegistry.test.js
├── assets/             # QR codes and static resources
├── index.html          # Main web interface
├── verify.html         # Verification page
├── script.js           # Frontend JavaScript
├── styles.css          # Styles
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Dependencies and npm scripts
└── .env.example        # Environment variables template
```

## Common Tasks for Automation

### High-Priority Tasks
These are well-suited for GitHub Copilot coding agent:
- Adding unit tests for existing functions
- Improving error handling and input validation
- Adding NatSpec documentation to smart contracts
- Fixing linting issues
- Updating dependencies (with security checks)
- Adding JSDoc comments to JavaScript functions
- Improving responsive CSS for mobile
- Adding event listeners for contract events

### Tasks Requiring Human Review
These tasks should be done with caution or human oversight:
- Modifying smart contract logic (security implications)
- Changing access control mechanisms
- Upgrading ethers.js or Hardhat versions (breaking changes)
- Modifying deployment scripts
- Changing network configurations
- Handling private keys or sensitive data

## Security Best Practices

⚠️ **Critical**: This is a blockchain project where security is paramount!

### Never
- Commit private keys, mnemonics, or API keys
- Skip input validation on user-provided data
- Use external calls before state changes (reentrancy risk)
- Deploy untested contract changes

### Always
- Use OpenZeppelin contracts when possible
- Validate all inputs (especially in smart contracts)
- Follow checks-effects-interactions pattern
- Add comprehensive error messages
- Test with negative/attack scenarios
- Use appropriate access control (OpenZeppelin's AccessControl)

## Documentation Updates

When making changes:
- Update README.md if adding/changing features
- Update CONTRIBUTING.md if changing development workflow
- Update CHANGELOG.md for notable changes
- Update .env.example if adding new environment variables
- Keep comments synchronized with code changes

## Blockchain-Specific Notes

### Hardhat Network
- Local network runs on http://localhost:8545
- Chain ID: 31337
- 20 test accounts pre-funded with 10000 ETH each
- State resets on restart

### ethers.js v6 Syntax
Important differences from v5:
```javascript
// Provider initialization
const provider = new ethers.JsonRpcProvider(rpcUrl); // v6
// not: new ethers.providers.JsonRpcProvider(rpcUrl); // v5

// Contract factories
const factory = await ethers.getContractFactory("MyContract"); // v6
const contract = await factory.deploy(); // v6
await contract.waitForDeployment(); // v6
// not: await contract.deployed(); // v5

// Getting addresses
const address = await contract.getAddress(); // v6
// not: contract.address // v5

// Getting transaction receipts
const receipt = await tx.wait(); // still works in v6
```

### Network Configuration
- Local: Hardhat node (localhost:8545)
- Testnet options: Sepolia (Ethereum), Mumbai (Polygon)
- Configure via hardhat.config.js and .env

## Troubleshooting

### Common Issues
1. **"Cannot find module"**: Run `npm install`
2. **"Network connection error"**: Check Hardhat node is running (`npm run node`)
3. **"Contract not deployed"**: Run deployment script (`npm run deploy`)
4. **"Invalid address"**: Check CONTRACT_ADDRESS in .env
5. **ethers.js errors**: Verify using v6 syntax, not v5

### Development Workflow
1. Start with tests to understand existing behavior
2. Make minimal changes to achieve the goal
3. Run tests after each change
4. Update documentation if public API changes
5. Ensure contracts compile before pushing

## Quality Standards

### Before Submitting Changes
- [ ] All tests pass (`npm test`)
- [ ] Contracts compile successfully (`npm run compile`)
- [ ] Code follows existing style conventions
- [ ] New functionality has tests
- [ ] Security implications considered
- [ ] Documentation updated if needed
- [ ] No hardcoded secrets or private keys
- [ ] Error handling is comprehensive

## Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **ethers.js v6 Docs**: https://docs.ethers.org/v6/
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/
- **Solidity Documentation**: https://docs.soliditylang.org/

## Project-Specific Context

This project demonstrates a traceability system where:
1. Bread production data is hashed and stored on blockchain
2. A relayer service helps users submit transactions without paying gas
3. QR codes link physical bread to blockchain records
4. Users can verify authenticity through the web interface

The main smart contract (`SimpleRegistry.sol`) uses role-based access control where only addresses with the RELAYER_ROLE can register hashes on behalf of users.
