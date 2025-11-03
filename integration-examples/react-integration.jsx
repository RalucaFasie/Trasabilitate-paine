/**
 * React Integration Example for Trasabilitate-paine Blockchain System (Demo Mode)
 * 
 * This file demonstrates how to integrate the blockchain traceability system
 * into a React application in DEMO MODE - no wallet or Metamask required.
 * 
 * All transactions are submitted via the relayer service (gasless).
 * Read operations work directly through the JSON-RPC provider.
 * 
 * Installation:
 * npm install ethers
 * 
 * Usage:
 * Import and use the hooks and components in your React app
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';

// ============================================================================
// Configuration (Demo Mode - Relayer Service Only)
// ============================================================================

const BLOCKCHAIN_CONFIG = {
  // Local development (Hardhat) - Demo mode uses relayer
  local: {
    rpcUrl: 'http://localhost:8545',
    chainId: 31337,
    contractAddress: 'YOUR_LOCAL_CONTRACT_ADDRESS',
    relayerUrl: 'http://localhost:3001',
  },
  // Sepolia testnet - Demo mode uses relayer
  sepolia: {
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 11155111,
    contractAddress: 'YOUR_SEPOLIA_CONTRACT_ADDRESS',
    relayerUrl: 'YOUR_RELAYER_URL',
  },
  // Mumbai testnet (Polygon) - Demo mode uses relayer
  mumbai: {
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    chainId: 80001,
    contractAddress: 'YOUR_MUMBAI_CONTRACT_ADDRESS',
    relayerUrl: 'YOUR_RELAYER_URL',
  },
};

const CONTRACT_ABI = [
  'function register(bytes32 h, string calldata ipfsCid) external',
  'function registerByRelayer(bytes32,address,string) external',
  'function isRegistered(bytes32 h) external view returns (bool)',
  'function registrations(bytes32) external view returns (address reporter, uint256 timestamp, string ipfsCid)',
  'event HashRegistered(bytes32 indexed h, address indexed reporter, string ipfsCid, uint256 timestamp)',
];

// ============================================================================
// Blockchain Context (for app-wide blockchain state)
// ============================================================================

const BlockchainContext = createContext(null);

export function BlockchainProvider({ children, network = 'local' }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const config = BLOCKCHAIN_CONFIG[network];

  useEffect(() => {
    initializeProvider();
  }, [network]);

  const initializeProvider = async () => {
    try {
      // Use JSON-RPC provider (read-only mode for demo)
      const web3Provider = new ethers.JsonRpcProvider(config.rpcUrl);
      console.log('Connected to blockchain in read-only mode (demo)');

      const contractInstance = new ethers.Contract(
        config.contractAddress,
        CONTRACT_ABI,
        web3Provider
      );

      setProvider(web3Provider);
      setSigner(null);
      setContract(contractInstance);
      setConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setConnected(false);
      console.error('Failed to initialize blockchain connection:', err);
    }
  };

  // Network switching removed - demo mode only uses relayer service

  const value = {
    provider,
    signer,
    contract,
    account,
    connected,
    error,
    config,
    initializeProvider,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within BlockchainProvider');
  }
  return context;
}

// ============================================================================
// Custom Hook: Read-Only Contract Interaction (Demo Mode)
// ============================================================================

export function useContract() {
  const { contract, connected } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyHash = async (data) => {
    if (!contract) {
      throw new Error('Contract not connected');
    }

    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      const isRegistered = await contract.isRegistered(hash);
      return { hash, isRegistered };
    } catch (err) {
      throw err;
    }
  };

  const getRegistrationDetails = async (hash) => {
    if (!contract) {
      throw new Error('Contract not connected');
    }

    try {
      const registration = await contract.registrations(hash);
      return {
        reporter: registration.reporter,
        timestamp: new Date(Number(registration.timestamp) * 1000),
        ipfsCid: registration.ipfsCid,
        exists: registration.timestamp > 0,
      };
    } catch (err) {
      throw err;
    }
  };

  return {
    verifyHash,
    getRegistrationDetails,
    loading,
    error,
  };
}

// ============================================================================
// Custom Hook: Relayer Service (Gasless Transactions)
// ============================================================================

/**
 * Hook for submitting data via relayer service (gasless, no wallet required)
 * This is the primary method for demo mode - users don't need wallets or gas fees.
 */
export function useRelayer() {
  const { config } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitToRelayer = async (data, reporter = '0x0000000000000000000000000000000000000001') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.relayerUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: data,
          reporter: reporter,
          signature: '0x', // Demo mode - no signature verification
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Relayer submission failed');
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { submitToRelayer, loading, error };
}

// ============================================================================
// Example Component: Registration via Relayer (Demo Mode)
// ============================================================================

export function RegistrationForm() {
  const { submitToRelayer, loading, error } = useRelayer();
  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    location: '',
    ipfsCid: '',
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        productId: formData.productId,
        batchNumber: formData.batchNumber,
        location: formData.location,
        timestamp: Date.now(),
        ipfsCid: formData.ipfsCid || '',
      };

      const res = await submitToRelayer(dataToSubmit);
      setResult(res);
      alert('Data submitted successfully via relayer!');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed: ' + err.message);
    }
  };

  return (
    <div className="registration-form">
      <h2>Register Product (Demo Mode - No Wallet Required)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Batch Number:</label>
          <input
            type="text"
            value={formData.batchNumber}
            onChange={(e) =>
              setFormData({ ...formData, batchNumber: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>IPFS CID (optional):</label>
          <input
            type="text"
            value={formData.ipfsCid}
            onChange={(e) =>
              setFormData({ ...formData, ipfsCid: e.target.value })
            }
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit (No Gas Fee)'}
        </button>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {result && (
        <div className="result">
          <h3>Submitted Successfully!</h3>
          <p>
            <strong>Hash:</strong> {result.hash}
          </p>
          {result.txHash && (
            <p>
              <strong>Transaction:</strong> {result.txHash}
            </p>
          )}
          {result.note && <p className="note">{result.note}</p>}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example Component: Hash Verification
// ============================================================================

export function HashVerification() {
  const { verifyHash, getRegistrationDetails } = useContract();
  const [inputData, setInputData] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let dataToVerify;
      try {
        dataToVerify = JSON.parse(inputData);
      } catch {
        dataToVerify = inputData;
      }

      const result = await verifyHash(dataToVerify);
      setVerificationResult(result);

      if (result.isRegistered) {
        const regDetails = await getRegistrationDetails(result.hash);
        setDetails(regDetails);
      }
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Verification failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hash-verification">
      <h2>Verify Product Authenticity</h2>
      <form onSubmit={handleVerify}>
        <div>
          <label>Enter Data (JSON or text):</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={5}
            placeholder='{"productId": "BREAD-001", "batchNumber": "20231101"}'
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {verificationResult && (
        <div
          className={`result ${verificationResult.isRegistered ? 'success' : 'failure'}`}
        >
          <h3>
            {verificationResult.isRegistered
              ? '✅ Verified on Blockchain'
              : '❌ Not Found on Blockchain'}
          </h3>
          <p>
            <strong>Hash:</strong> {verificationResult.hash}
          </p>

          {details && details.exists && (
            <>
              <p>
                <strong>Registered by:</strong> {details.reporter}
              </p>
              <p>
                <strong>Timestamp:</strong> {details.timestamp.toLocaleString()}
              </p>
              {details.ipfsCid && (
                <p>
                  <strong>IPFS CID:</strong> {details.ipfsCid}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// (GaslessRegistration component removed - use RegistrationForm instead)

// ============================================================================
// Example App Component
// ============================================================================

export default function BlockchainApp() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <BlockchainProvider network="local">
      <div className="blockchain-app">
        <header>
          <h1>🌾 Bread Traceability System (Demo Mode)</h1>
          <ConnectionStatus />
        </header>

        <nav>
          <button onClick={() => setActiveTab('register')}>Register</button>
          <button onClick={() => setActiveTab('verify')}>Verify</button>
        </nav>

        <main>
          {activeTab === 'register' && <RegistrationForm />}
          {activeTab === 'verify' && <HashVerification />}
        </main>
      </div>
    </BlockchainProvider>
  );
}

function ConnectionStatus() {
  const { connected, error } = useBlockchain();

  if (error) {
    return <div className="connection-error">Error: {error}</div>;
  }

  if (!connected) {
    return <div className="connection-status">Connecting...</div>;
  }

  return (
    <div className="connected-status">
      <span>✅ Connected (Demo Mode - Read-only)</span>
    </div>
  );
}
