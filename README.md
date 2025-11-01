# Trasabilitate-paine — Registry demo

Această ramură (feature/registry-demo) conține fișierele pentru demonstrația locală a publicării și verificării dovezilor (hash/CID) pe un registru blockchain local (Hardhat). Am pregătit contract, script de deploy, relayer skeleton și fișiere QR pentru fiecare bloc demo.

Conținut adăugat:
- contracts/SimpleRegistry.sol — contract OpenZeppelin cu rol RELAYER și event HashRegistered
- hardhat.config.js — configurație pentru rețele locale/testnet
- scripts/deploy.js — script deploy
- relayer/index.js — skeleton relayer (mock mode sau real, dacă setezi RELAYER_PK)
- .env.example — variabile mediu
- assets/qr-b1.svg .. assets/qr-b5.svg — imagini QR (placeholder SVG per bloc)

## Scenariu recomandat (demo local — fără plăți reale)

### 1. Instalează dependențe:
```bash
npm install
```

### 2. Configurează environment (opțional pentru demo):
```bash
cp .env.example .env
# Editează .env cu cheile tale (opțional pentru testnet)
```

### 3. Pornește nod Hardhat local:
```bash
npm run node
# Sau: npx hardhat node
```

### 4. Deploy local (într-un terminal nou):
```bash
npm run deploy
# Sau: npx hardhat run scripts/deploy.js --network localhost
```
**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

### 5. Pornește relayer (mock mode e OK pentru demo):
```bash
npm run relayer
# Sau: node relayer/index.js
```
Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)

### 6. Deschide aplicația web:
Servește fișierele HTML cu un server local:
```bash
# Opțiune 1: Python
python -m http.server 8000

# Opțiune 2: Node.js http-server (instalează global: npm i -g http-server)
http-server -p 8000
```

Apoi deschide în browser: http://localhost:8000/index.html

### 7. Conectează Metamask:
- Importă una din cheile generate de Hardhat în Metamask
- Configurează rețeaua custom: RPC URL = http://localhost:8545, Chain ID = 31337
- Folosește butoanele din interfață:
  - **"Conectează Wallet"** - conectează Metamask
  - **"Verifică pe blockchain"** - verifică hash-uri înregistrate
  - **"Export JSON"** - exportă datele de trasabilitate

QR codes
- Am adăugat fișiere SVG în `assets/` pentru fiecare bloc: qr-b1.svg .. qr-b5.svg.
- Acestea sunt placeholder-uri care conțin hash-ul blocului; pentru coduri QR scannabile recomand să generezi imagini QR cu linkul de verificare (ex: `https://your-demo.example/verify?hash=<hash>`), apoi înlocuiește fișierele din `assets/`.

## Deploy pe testnet (Sepolia sau Mumbai)

### 1. Configurează .env cu chei reale:
```bash
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# sau
MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

### 2. Deploy pe testnet:
```bash
npm run deploy:sepolia
# sau
npm run deploy:mumbai
```

### 3. Configurează relayer pentru testnet:
```bash
RELAYER_PK=your_relayer_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=deployed_contract_address
npm run relayer
```

## Structura proiectului

```
├── contracts/           # Smart contracts Solidity
│   └── SimpleRegistry.sol
├── scripts/            # Scripts de deploy
│   └── deploy.js
├── relayer/            # Serviciu relayer backend
│   └── index.js
├── assets/             # QR codes și resurse
├── index.html          # Interfață principală de vizualizare
├── verify.html         # Pagină de verificare
├── hardhat.config.js   # Configurare Hardhat
└── package.json        # Dependencies și scripturi npm
```

## Tehnologii utilizate

- **Blockchain:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend:** Express.js, ethers.js v6
- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Network:** Ethereum-compatible (Hardhat local, Sepolia, Mumbai)