// Relayer skeleton (demo). Do NOT commit real private keys.
// Usage: RELAYER_PK=... RPC_URL=... CONTRACT_ADDRESS=... node index.js
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const app = express();
app.use(bodyParser.json());

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const CONTRACT_ABI = [
  'function registerByRelayer(bytes32,address,string)',
  'event HashRegistered(bytes32 indexed h, address indexed reporter, string ipfsCid, uint256 timestamp)'
];

if(!process.env.RELAYER_PK || !process.env.RPC_URL) {
  console.warn('Relayer: set RELAYER_PK and RPC_URL in env to send txs. Running in mock mode if absent.');
}

const provider = process.env.RPC_URL ? new ethers.JsonRpcProvider(process.env.RPC_URL) : null;
const relayerWallet = (process.env.RELAYER_PK && provider) ? new ethers.Wallet(process.env.RELAYER_PK, provider) : null;
const contract = (relayerWallet && CONTRACT_ADDRESS) ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, relayerWallet) : null;

app.post('/submit', async (req, res) => {
  try {
    const { payload, reporter } = req.body;
    
    // Input validation - consolidated for efficiency
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ ok: false, error: 'Invalid payload: must be an object' });
    }
    if (!reporter || !ethers.isAddress(reporter) || reporter === ethers.ZeroAddress) {
      return res.status(400).json({ ok: false, error: 'Invalid reporter: must be a valid non-zero Ethereum address' });
    }
    
    // Compute hash once
    const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(payload)));
    
    // Mock mode - return early without blockchain interaction
    if (!contract) {
      return res.json({ ok: true, note: 'Relayer running in mock mode (no tx sent)', hash });
    }
    
    // Production mode - send transaction
    const tx = await contract.registerByRelayer(hash, reporter, payload.ipfsCid || '');
    await tx.wait();
    res.json({ ok: true, txHash: tx.hash, hash });
  } catch(err) {
    console.error('Relayer error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log('Relayer listening on', PORT));