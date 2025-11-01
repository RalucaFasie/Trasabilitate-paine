const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleRegistry", function () {
  let registry;
  let owner;
  let relayer;
  let user;

  beforeEach(async function () {
    [owner, relayer, user] = await ethers.getSigners();
    
    const Registry = await ethers.getContractFactory("SimpleRegistry");
    registry = await Registry.deploy(owner.address);
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct admin role", async function () {
      const DEFAULT_ADMIN_ROLE = await registry.DEFAULT_ADMIN_ROLE();
      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should set the deployer as relayer", async function () {
      const RELAYER_ROLE = await registry.RELAYER_ROLE();
      expect(await registry.hasRole(RELAYER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Registration", function () {
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("test-data"));
    const testCid = "QmTest123";

    it("Should allow anyone to register a hash", async function () {
      await expect(registry.connect(user).register(testHash, testCid))
        .to.emit(registry, "HashRegistered")
        .withArgs(testHash, user.address, testCid, await getBlockTimestamp());
      
      expect(await registry.isRegistered(testHash)).to.be.true;
    });

    it("Should not allow duplicate registrations", async function () {
      await registry.connect(user).register(testHash, testCid);
      
      await expect(registry.connect(user).register(testHash, testCid))
        .to.be.revertedWith("already registered");
    });

    it("Should store registration details correctly", async function () {
      await registry.connect(user).register(testHash, testCid);
      
      const registration = await registry.registrations(testHash);
      expect(registration.reporter).to.equal(user.address);
      expect(registration.ipfsCid).to.equal(testCid);
      expect(registration.timestamp).to.be.gt(0);
    });
  });

  describe("Relayer Registration", function () {
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("relayer-test"));
    const testCid = "QmRelayer123";

    it("Should allow relayer to register on behalf of reporter", async function () {
      // Grant relayer role to relayer account
      const RELAYER_ROLE = await registry.RELAYER_ROLE();
      await registry.grantRole(RELAYER_ROLE, relayer.address);

      await expect(registry.connect(relayer).registerByRelayer(testHash, user.address, testCid))
        .to.emit(registry, "HashRegistered")
        .withArgs(testHash, user.address, testCid, await getBlockTimestamp());
      
      const registration = await registry.registrations(testHash);
      expect(registration.reporter).to.equal(user.address);
    });

    it("Should not allow non-relayer to use registerByRelayer", async function () {
      await expect(registry.connect(user).registerByRelayer(testHash, user.address, testCid))
        .to.be.reverted;
    });

    it("Should not allow duplicate registrations via relayer", async function () {
      const RELAYER_ROLE = await registry.RELAYER_ROLE();
      await registry.grantRole(RELAYER_ROLE, relayer.address);
      
      await registry.connect(relayer).registerByRelayer(testHash, user.address, testCid);
      
      await expect(registry.connect(relayer).registerByRelayer(testHash, user.address, testCid))
        .to.be.revertedWith("already registered");
    });
  });

  describe("Hash Verification", function () {
    it("Should return false for unregistered hash", async function () {
      const testHash = ethers.keccak256(ethers.toUtf8Bytes("unregistered"));
      expect(await registry.isRegistered(testHash)).to.be.false;
    });

    it("Should return true for registered hash", async function () {
      const testHash = ethers.keccak256(ethers.toUtf8Bytes("registered"));
      await registry.connect(user).register(testHash, "test-cid");
      expect(await registry.isRegistered(testHash)).to.be.true;
    });
  });

  // Helper function to get current block timestamp
  async function getBlockTimestamp() {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block.timestamp;
  }
});
