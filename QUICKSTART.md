# 🚀 Quick Start Guide

Get the bread traceability demo running in 5 minutes!

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Local Blockchain

Open a terminal and run:

```bash
npm run node
```

Keep this terminal running. You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

## Step 3: Deploy Contract

Open a **new terminal** and run:

```bash
npm run deploy
```

You should see:
```
✅ Deployment Successful!
📝 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy this address!** You'll need it in the next step.

## Step 4: Configure Environment (Optional)

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add the contract address:
```
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Step 5: Start Relayer

Open a **new terminal** and run:

```bash
npm run relayer
```

You should see:
```
Relayer: set RELAYER_PK and RPC_URL in env to send txs. Running in mock mode if absent.
Relayer listening on 3001
```

## Step 6: Open the Web Interface

Open `index.html` in your browser. You can either:

**Option A: Direct file access**
```
file:///path/to/Trasabilitate-paine/index.html
```

**Option B: Local web server (recommended)**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/index.html
```



## 🎉 You're Ready!

You should now see the bread traceability flow with 5 blocks:
- 🌾 Bloc 1 — Ferma AgroVerde
- ⚙️ Bloc 2 — Moara PanMălina
- 🍞 Bloc 3 — Brutăria DeliPan
- 🏪 Bloc 4 — Magazinul EcoMarket
- 👤 Bloc 5 — Consumatorul final

Click "Verifică pe blockchain" on any block to verify its hash!

## 🐛 Troubleshooting

### "Cannot connect to localhost:8545"
Make sure the Hardhat node (Step 2) is still running.

### "Relayer not responding"
Make sure the relayer (Step 5) is still running on port 3001.

### Contract function not found
Make sure you've set the correct CONTRACT_ADDRESS in your .env file or in the HTML file (index.html line 222).

## 📚 Next Steps

- Read the full [README.md](README.md) for more details
- Check out [relayer/README.md](relayer/README.md) for API documentation
- Explore testnet deployment with Sepolia or Mumbai
- Customize the traceability data in index.html
