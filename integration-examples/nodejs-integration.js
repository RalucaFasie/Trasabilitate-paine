/**
 * Node.js Backend Integration Example
 * 
 * This example demonstrates how to integrate the blockchain traceability system
 * into a Node.js backend service.
 * 
 * Installation:
 * npm install ethers dotenv express
 * 
 * Usage:
 * node integration-examples/nodejs-integration.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  privateKey: process.env.PRIVATE_KEY || '',
  relayerUrl: process.env.RELAYER_URL || 'http://localhost:3001',
};

const CONTRACT_ABI = [
  'function register(bytes32 h, string calldata ipfsCid) external',
  'function registerByRelayer(bytes32,address,string) external',
  'function isRegistered(bytes32 h) external view returns (bool)',
  'function registrations(bytes32) external view returns (address reporter, uint256 timestamp, string ipfsCid)',
  'event HashRegistered(bytes32 indexed h, address indexed reporter, string ipfsCid, uint256 timestamp)',
];

// ============================================================================
// Blockchain Connection Class
// ============================================================================

class BlockchainConnector {
  constructor(config) {
    this.config = config;
    this.provider = null;
    this.wallet = null;
    this.contract = null;
  }

  /**
   * Initialize blockchain connection
   */
  async connect() {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId);
      
      // Initialize wallet if private key is provided
      if (this.config.privateKey) {
        this.wallet = new ethers.Wallet(this.config.privateKey, this.provider);
        console.log('✅ Wallet initialized:', await this.wallet.getAddress());
      }
      
      // Initialize contract
      if (this.config.contractAddress) {
        this.contract = new ethers.Contract(
          this.config.contractAddress,
          CONTRACT_ABI,
          this.wallet || this.provider
        );
        console.log('✅ Contract initialized:', this.config.contractAddress);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
  }

  /**
   * Register a hash on the blockchain
   * @param {Object|string} data - Data to hash and register
   * @param {string} ipfsCid - Optional IPFS CID
   * @returns {Promise<Object>} Transaction result
   */
  async registerHash(data, ipfsCid = '') {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

    console.log('📝 Registering hash:', hash);

    const tx = await this.contract.register(hash, ipfsCid);
    console.log('⏳ Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

    return {
      hash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  }

  /**
   * Verify if a hash is registered
   * @param {Object|string} data - Data to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyHash(data) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

    const isRegistered = await this.contract.isRegistered(hash);

    return {
      hash,
      isRegistered,
      data: dataString,
    };
  }

  /**
   * Get registration details for a hash
   * @param {string} hash - Hash to query
   * @returns {Promise<Object>} Registration details
   */
  async getRegistrationDetails(hash) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const registration = await this.contract.registrations(hash);

    return {
      hash,
      reporter: registration.reporter,
      timestamp: new Date(Number(registration.timestamp) * 1000),
      ipfsCid: registration.ipfsCid,
      exists: registration.timestamp > 0,
    };
  }

  /**
   * Submit data via relayer service (gasless)
   * @param {Object} payload - Data to submit
   * @param {string} reporter - Reporter address
   * @returns {Promise<Object>} Relayer response
   */
  async submitToRelayer(payload, reporter) {
    try {
      const response = await fetch(`${this.config.relayerUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          reporter,
          signature: '0x', // In production, implement EIP-712 signature
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Relayer submission failed');
      }

      const result = await response.json();
      console.log('✅ Submitted to relayer:', result.hash);

      return result;
    } catch (error) {
      console.error('❌ Relayer submission failed:', error.message);
      throw error;
    }
  }

  /**
   * Listen for HashRegistered events
   * @param {Function} callback - Callback function for each event
   */
  async listenForEvents(callback) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    console.log('👂 Listening for HashRegistered events...');

    this.contract.on('HashRegistered', (hash, reporter, ipfsCid, timestamp, event) => {
      const eventData = {
        hash,
        reporter,
        ipfsCid,
        timestamp: new Date(Number(timestamp) * 1000),
        blockNumber: event.log.blockNumber,
        txHash: event.log.transactionHash,
      };

      callback(eventData);
    });
  }

  /**
   * Get past events from a specific block range
   * @param {number} fromBlock - Starting block number
   * @param {number} toBlock - Ending block number (or 'latest')
   * @returns {Promise<Array>} Array of events
   */
  async getPastEvents(fromBlock = 0, toBlock = 'latest') {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const filter = this.contract.filters.HashRegistered();
    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

    return events.map((event) => ({
      hash: event.args[0],
      reporter: event.args[1],
      ipfsCid: event.args[2],
      timestamp: new Date(Number(event.args[3]) * 1000),
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
    }));
  }

  /**
   * Batch register multiple hashes
   * @param {Array} dataArray - Array of data objects to register
   * @returns {Promise<Array>} Array of transaction results
   */
  async batchRegister(dataArray) {
    const results = [];

    for (const data of dataArray) {
      try {
        const result = await this.registerHash(data);
        results.push({ success: true, data, result });
      } catch (error) {
        console.error('Failed to register:', data, error.message);
        results.push({ success: false, data, error: error.message });
      }
    }

    return results;
  }
}

// ============================================================================
// Example Usage
// ============================================================================

async function exampleUsage() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Node.js Blockchain Integration Demo    ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Initialize connector
  const connector = new BlockchainConnector(CONFIG);

  // Connect to blockchain
  const connected = await connector.connect();
  if (!connected) {
    console.error('Failed to connect to blockchain');
    process.exit(1);
  }

  // Example 1: Register a hash
  console.log('\n--- Example 1: Register Hash ---');
  try {
    const productData = {
      productId: 'BREAD-001',
      batchNumber: 'B20231101',
      location: 'Calarasi',
      timestamp: Date.now(),
    };

    const result = await connector.registerHash(productData, 'QmExampleCID');
    console.log('Registration result:', result);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }

  // Example 2: Verify a hash
  console.log('\n--- Example 2: Verify Hash ---');
  try {
    const dataToVerify = {
      productId: 'BREAD-001',
      batchNumber: 'B20231101',
      location: 'Calarasi',
      timestamp: Date.now(),
    };

    const verification = await connector.verifyHash(dataToVerify);
    console.log('Verification result:', verification);
  } catch (error) {
    console.error('Verification failed:', error.message);
  }

  // Example 3: Get registration details
  console.log('\n--- Example 3: Get Registration Details ---');
  try {
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes('test-data'));
    const details = await connector.getRegistrationDetails(sampleHash);
    console.log('Registration details:', details);
  } catch (error) {
    console.error('Failed to get details:', error.message);
  }

  // Example 4: Submit via relayer
  console.log('\n--- Example 4: Submit via Relayer (Gasless) ---');
  try {
    const relayerData = {
      productId: 'BREAD-002',
      ipfsCid: 'QmRelayerExample',
    };

    const relayerResult = await connector.submitToRelayer(
      relayerData,
      '0x1234567890123456789012345678901234567890'
    );
    console.log('Relayer result:', relayerResult);
  } catch (error) {
    console.error('Relayer submission failed:', error.message);
  }

  // Example 5: Get past events
  console.log('\n--- Example 5: Get Past Events ---');
  try {
    const currentBlock = await connector.provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 100); // Last 100 blocks

    const events = await connector.getPastEvents(fromBlock);
    console.log(`Found ${events.length} events in last 100 blocks`);
    
    if (events.length > 0) {
      console.log('Recent event:', events[events.length - 1]);
    }
  } catch (error) {
    console.error('Failed to get past events:', error.message);
  }

  // Example 6: Listen for new events (commented out to avoid hanging)
  console.log('\n--- Example 6: Listen for Events ---');
  console.log('Event listening setup available (commented out in example)');
  /*
  connector.listenForEvents((event) => {
    console.log('New event detected:', event);
  });
  */

  console.log('\n✅ Demo completed!\n');
}

// ============================================================================
// Express API Example (REST endpoints for blockchain integration)
// ============================================================================

async function createExpressAPI() {
  const express = require('express');
  const app = express();
  app.use(express.json());

  const connector = new BlockchainConnector(CONFIG);
  await connector.connect();

  // Register hash endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { data, ipfsCid } = req.body;
      const result = await connector.registerHash(data, ipfsCid || '');
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Verify hash endpoint
  app.post('/api/verify', async (req, res) => {
    try {
      const { data } = req.body;
      const result = await connector.verifyHash(data);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get registration details endpoint
  app.get('/api/registration/:hash', async (req, res) => {
    try {
      const { hash } = req.params;
      const result = await connector.getRegistrationDetails(hash);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const network = await connector.provider.getNetwork();
      const blockNumber = await connector.provider.getBlockNumber();
      res.json({
        success: true,
        network: network.name,
        chainId: network.chainId.toString(),
        blockNumber,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const PORT = process.env.API_PORT || 3002;
  app.listen(PORT, () => {
    console.log(`\n🚀 API server running on http://localhost:${PORT}`);
    console.log(`   POST /api/register - Register a hash`);
    console.log(`   POST /api/verify - Verify a hash`);
    console.log(`   GET /api/registration/:hash - Get details`);
    console.log(`   GET /api/health - Health check\n`);
  });
}

// ============================================================================
// Main
// ============================================================================

// Run example usage
if (require.main === module) {
  // Uncomment the example you want to run:
  
  exampleUsage().catch(console.error);
  
  // Or start the Express API server:
  // createExpressAPI().catch(console.error);
}

// Export for use in other modules
module.exports = {
  BlockchainConnector,
  CONFIG,
  CONTRACT_ABI,
};
