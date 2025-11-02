# Trasabilitate-paine — Registry demo

[![CI](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml/badge.svg)](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)

Aplicație web de trasabilitate pentru pâine cu smart contracts Hardhat și serviciu relayer pentru înregistrarea pe blockchain.

**Structura modernă:**
- `src/` — JavaScript și CSS sursă (ES modules)
- `public/` — HTML și assets statice
- Build tool: Vite pentru dev și production builds

**Componente:**
- contracts/SimpleRegistry.sol — contract OpenZeppelin cu rol RELAYER și event HashRegistered
- hardhat.config.js — configurație pentru rețele locale/testnet
- scripts/deploy.js — script deploy
- relayer/index.js — skeleton relayer (mock mode sau real, dacă setezi RELAYER_PK)
- .env.example — variabile mediu
- public/assets/ — imagini QR și ilustrații

## Rulare locală - Frontend

### 1. Instalează dependențe:
```bash
npm install
```

### 2. Pornește dev server:
```bash
npm run dev
```
Apoi deschide în browser: http://localhost:5173/

### 3. Build pentru producție:
```bash
npm run build
```
Generează folderul `dist/` care poate fi servit direct sau urcat pe GitHub Pages.

### 4. Preview build de producție:
```bash
npm run preview
```

### 5. Lint și format cod:
```bash
npm run lint      # Verifică codul cu ESLint
npm run format    # Formatează codul cu Prettier
```

## Rulare cu blockchain local (Hardhat)

### 1. Configurează environment (opțional pentru demo):
```bash
cp .env.example .env
# Editează .env cu cheile tale (opțional pentru testnet)
```

### 2. Pornește nod Hardhat local (terminal 1):
```bash
npm run node
```

### 3. Deploy local (terminal 2):
```bash
npm run deploy
```
**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

### 4. Pornește relayer (terminal 3):
```bash
npm run relayer
```
Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)

### 5. Conectează Metamask:
- Importă una din cheile generate de Hardhat în Metamask
- Configurează rețeaua custom: RPC URL = http://localhost:8545, Chain ID = 31337
- Folosește butoanele din interfață pentru a interacționa cu blockchain-ul

### QR codes
- Fișierele SVG din `public/assets/` conțin placeholder-uri pentru QR codes (qr-b1.svg .. qr-b5.svg).
- Pentru coduri QR scannabile, generează imagini QR cu linkul de verificare (ex: `https://your-demo.example/verify.html?hash=<hash>`).

## GitHub Pages

Pentru publicare pe GitHub Pages:

1. Build-ează proiectul:
```bash
npm run build
```

2. Conținutul din folderul `dist/` poate fi publicat pe GitHub Pages fie prin:
   - Configurare directă în Settings → Pages → Source: "gh-pages branch"
   - GitHub Actions workflow pentru deploy automat

3. Asigură-te că `base: './'` este setat în `vite.config.js` pentru compatibilitate cu GitHub Pages.

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
├── .github/             # GitHub configurations
│   ├── workflows/       # CI/CD workflows
│   ├── ISSUE_TEMPLATE/  # Issue templates
│   └── pull_request_template.md
├── public/              # Static assets și HTML
│   ├── index.html       # Interfață principală
│   ├── verify.html      # Pagină de verificare
│   └── assets/          # Images, QR codes
├── src/                 # Source files (JS, CSS)
│   ├── main.js          # Entry point JavaScript (ES module)
│   └── styles.css       # Main stylesheet
├── contracts/           # Smart contracts Solidity
│   └── SimpleRegistry.sol
├── scripts/             # Scripts de deploy
│   └── deploy.js
├── relayer/             # Serviciu relayer backend
│   └── index.js
├── test/                # Contract tests
│   └── SimpleRegistry.test.js
├── dist/                # Production build output (generated)
├── vite.config.js       # Vite configuration
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── hardhat.config.js    # Configurare Hardhat
├── package.json         # Dependencies și scripturi npm
└── README.md            # Acest fișier
```

## Tehnologii utilizate

- **Blockchain:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend:** Express.js, ethers.js v6
- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Network:** Ethereum-compatible (Hardhat local, Sepolia, Mumbai)