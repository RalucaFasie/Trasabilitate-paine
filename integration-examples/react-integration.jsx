/**
 * React Integration Example for Trasabilitate-paine Blockchain System
 * 
 * This file demonstrates how to integrate the blockchain traceability system
 * into a React application (e.g., codespaces-react or any other React project).
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
// Configuration
// ============================================================================

const BLOCKCHAIN_CONFIG = {
  // Local development (Hardhat)
  local: {
    rpcUrl: 'http://localhost:8545',
    chainId: 31337,
    contractAddress: 'YOUR_LOCAL_CONTRACT_ADDRESS',
    relayerUrl: 'http://localhost:3001',
  },
  // Sepolia testnet
  sepolia: {
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 11155111,
    contractAddress: 'YOUR_SEPOLIA_CONTRACT_ADDRESS',
    relayerUrl: 'YOUR_RELAYER_URL',
  },
  // Mumbai testnet (Polygon)
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
      let web3Provider;
      let web3Signer;

      // Check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        // Use MetaMask
        web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        web3Signer = await web3Provider.getSigner();
        const address = await web3Signer.getAddress();
        setAccount(address);
      } else {
        // Fallback to JSON-RPC provider (read-only)
        web3Provider = new ethers.JsonRpcProvider(config.rpcUrl);
        console.warn('MetaMask not detected. Running in read-only mode.');
      }

      const contractInstance = new ethers.Contract(
        config.contractAddress,
        CONTRACT_ABI,
        web3Signer || web3Provider
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setConnected(false);
      console.error('Failed to initialize blockchain connection:', err);
    }
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toQuantity(targetChainId) }],
      });
    } catch (err) {
      if (err.code === 4902) {
        console.error('Network not added to MetaMask');
      }
      throw err;
    }
  };

  const value = {
    provider,
    signer,
    contract,
    account,
    connected,
    error,
    config,
    initializeProvider,
    switchNetwork,
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
// Custom Hook: Direct Contract Interaction
// ============================================================================

export function useContract() {
  const { contract, account, connected } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerHash = async (data, ipfsCid = '') => {
    if (!contract || !connected) {
      throw new Error('Contract not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      const tx = await contract.register(hash, ipfsCid);
      const receipt = await tx.wait();

      setLoading(false);
      return {
        hash,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

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
    registerHash,
    verifyHash,
    getRegistrationDetails,
    loading,
    error,
    account,
  };
}

// ============================================================================
// Custom Hook: Relayer Service (Gasless Transactions)
// ============================================================================

export function useRelayer() {
  const { config, account } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitToRelayer = async (data, reporter = null) => {
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
          reporter: reporter || account,
          signature: '0x', // TODO: Implement EIP-712 signature
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
// Example Component: Hash Registration Form
// ============================================================================

export function HashRegistrationForm() {
  const { registerHash, loading, error } = useContract();
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
      const dataToHash = {
        productId: formData.productId,
        batchNumber: formData.batchNumber,
        location: formData.location,
        timestamp: Date.now(),
      };

      const res = await registerHash(dataToHash, formData.ipfsCid);
      setResult(res);
      alert('Hash registered successfully!');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="hash-registration-form">
      <h2>Register Product on Blockchain</h2>
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
          {loading ? 'Registering...' : 'Register on Blockchain'}
        </button>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {result && (
        <div className="result">
          <h3>Registration Successful!</h3>
          <p>
            <strong>Hash:</strong> {result.hash}
          </p>
          <p>
            <strong>Transaction:</strong> {result.txHash}
          </p>
          <p>
            <strong>Block:</strong> {result.blockNumber}
          </p>
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

// ============================================================================
// Example Component: Gasless Registration (via Relayer)
// ============================================================================

export function GaslessRegistration() {
  const { submitToRelayer, loading, error } = useRelayer();
  const { account } = useBlockchain();
  const [formData, setFormData] = useState({
    productId: '',
    description: '',
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        timestamp: Date.now(),
        ipfsCid: '',
      };

      const res = await submitToRelayer(payload, account);
      setResult(res);
      alert('Registered via relayer!');
    } catch (err) {
      console.error('Relayer submission failed:', err);
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="gasless-registration">
      <h2>Register (Gasless - No Wallet Required)</h2>
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
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            required
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
// Example App Component
// ============================================================================

export default function BlockchainApp() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <BlockchainProvider network="local">
      <div className="blockchain-app">
        <header>
          <h1>🌾 Bread Traceability System</h1>
          <ConnectedAccount />
        </header>

        <nav>
          <button onClick={() => setActiveTab('register')}>Register</button>
          <button onClick={() => setActiveTab('verify')}>Verify</button>
          <button onClick={() => setActiveTab('gasless')}>
            Gasless Registration
          </button>
        </nav>

        <main>
          {activeTab === 'register' && <HashRegistrationForm />}
          {activeTab === 'verify' && <HashVerification />}
          {activeTab === 'gasless' && <GaslessRegistration />}
        </main>
      </div>
    </BlockchainProvider>
  );
}

function ConnectedAccount() {
  const { account, connected, error } = useBlockchain();

  if (error) {
    return <div className="connection-error">Error: {error}</div>;
  }

  if (!connected) {
    return <div className="connection-status">Connecting...</div>;
  }

  return (
    <div className="connected-account">
      <span>Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Read-only'}</span>
    </div>
  );
}
