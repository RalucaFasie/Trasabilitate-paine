# Relayer Service

The relayer service acts as a backend intermediary that can submit blockchain transactions on behalf of users, allowing them to interact with the smart contract without paying gas fees directly.

## Features

- **Mock Mode**: Runs without blockchain connection for testing
- **Real Mode**: Submits actual transactions when configured with private key
- **REST API**: Simple HTTP endpoint for hash registration

## Configuration

Set these environment variables (or add to `.env` in project root):

```bash
RPC_URL=http://localhost:8545          # Blockchain RPC endpoint
RELAYER_PK=your_private_key_here       # Relayer wallet private key
CONTRACT_ADDRESS=0x...                 # Deployed SimpleRegistry address
PORT=3001                              # Server port (optional)
```

## Running

```bash
# From project root
npm run relayer

# Or directly
node relayer/index.js
```

## API Endpoint

### POST /submit

Submit a hash registration request to be relayed to the blockchain.

**Request Body:**
```json
{
  "payload": {
    "ipfsCid": "optional-cid-or-metadata",
    "data": "any additional data"
  },
  "reporter": "0x...",  // Address of the actual submitter
  "signature": "0x..."  // (Currently not verified in demo mode)
}
```

**Response (Mock Mode):**
```json
{
  "ok": true,
  "note": "Relayer running in mock mode (no tx sent)",
  "hash": "0x..."
}
```

**Response (Real Mode):**
```json
{
  "ok": true,
  "txHash": "0x...",
  "hash": "0x..."
}
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit real private keys to version control
- In production, implement proper signature verification (EIP-712)
- Use a dedicated wallet for the relayer with limited funds
- Consider rate limiting and authentication for the API endpoint
- Monitor the relayer wallet balance

## Development vs Production

### Development (Mock Mode)
- No private key needed
- Returns computed hash without blockchain interaction
- Perfect for UI/UX testing

### Production
- Requires funded wallet (RELAYER_PK)
- Verifies signatures before submitting
- Implements proper error handling and logging
- Uses secure environment variable management
