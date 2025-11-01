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
    const { payload, reporter, signature } = req.body;
    // In production: verify signature (EIP-712) that reporter signed payload
    // For demo: accept payload and compute hash
    const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(payload)));
    if(!contract) {
      return res.json({ ok: true, note: 'Relayer running in mock mode (no tx sent)', hash });
    }
    const tx = await contract.registerByRelayer(hash, reporter, payload.ipfsCid || '');
    await tx.wait();
    res.json({ ok: true, txHash: tx.hash, hash });
  } catch(err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log('Relayer listening on', PORT));