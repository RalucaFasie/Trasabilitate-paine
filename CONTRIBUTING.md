# Contributing to Trasabilitate-paine

Thank you for your interest in contributing to the bread traceability blockchain project! 🍞

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Create a branch** for your feature: `git checkout -b feature/my-feature`

## Development Workflow

### Before Making Changes

1. **Start local blockchain**: `npm run node`
2. **Deploy contract**: `npm run deploy`
3. **Run tests**: `npm test` (to verify everything works)

### Making Changes

1. **Write code** following the existing style
2. **Add tests** for new functionality
3. **Test locally** to ensure nothing breaks
4. **Update documentation** if needed

### Before Submitting

1. **Run all tests**: `npm test`
2. **Check code compilation**: `npm run compile`
3. **Update README** if you added features
4. **Commit with clear messages**

## Code Style

### Solidity
- Use Solidity 0.8.20
- Follow OpenZeppelin patterns
- Add NatSpec comments for functions
- Keep gas costs in mind

### JavaScript
- Use ES6+ features
- Use async/await for promises
- Add JSDoc comments for complex functions
- Keep functions small and focused

### HTML/CSS
- Keep semantic HTML
- Use CSS variables for theming
- Ensure mobile responsiveness
- Test on multiple browsers

## Testing

We use Hardhat testing framework with Chai assertions.

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/SimpleRegistry.test.js
```

### Writing Tests

- Test both success and failure cases
- Use descriptive test names
- Group related tests with `describe`
- Clean up state with `beforeEach`

Example:
```javascript
describe("Feature Name", function () {
  it("Should do something expected", async function () {
    // Arrange
    const input = "test";
    
    // Act
    const result = await contract.doSomething(input);
    
    // Assert
    expect(result).to.equal(expected);
  });
});
```

## Commit Messages

Use clear, descriptive commit messages:

- ✅ Good: "Add hash verification to relayer API"
- ✅ Good: "Fix: Correct ethers v6 provider initialization"
- ❌ Bad: "update stuff"
- ❌ Bad: "fix bug"

## Pull Request Process

1. **Update your branch** with latest main: `git pull origin main`
2. **Push your changes**: `git push origin feature/my-feature`
3. **Open a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Link to related issues

4. **Wait for review** and address feedback
5. **Squash commits** if requested
6. **Celebrate** when merged! 🎉

## Areas for Contribution

### High Priority
- [ ] Add more comprehensive tests
- [ ] Implement EIP-712 signature verification in relayer
- [ ] Add input validation and error handling
- [ ] Improve mobile UI responsiveness

### Features
- [ ] Add batch hash registration
- [ ] Implement QR code generation
- [ ] Add event listener for contract events
- [ ] Create admin dashboard

### Documentation
- [ ] Add video tutorial
- [ ] Translate to English
- [ ] Add architecture diagrams
- [ ] Create API reference

### Infrastructure
- [ ] Add GitHub Actions CI/CD
- [ ] Set up automatic testing
- [ ] Add code coverage reports
- [ ] Deploy demo to testnet

## Security

⚠️ **Security is critical** in blockchain projects!

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email the maintainer directly
- Provide detailed description and steps to reproduce

### Security Best Practices
- Never commit private keys
- Validate all user inputs
- Use OpenZeppelin audited contracts
- Follow the checks-effects-interactions pattern
- Be cautious with external calls

## Questions?

- Open a GitHub Discussion for questions
- Check existing Issues for similar problems
- Read the [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

Thank you for contributing! 🙏
