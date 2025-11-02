# Trasabilitate-paine — Registry demo

[![CI](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml/badge.svg)](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)

Acest repository conține un sistem de trasabilitate pentru pâine bazat pe blockchain, cu contracte inteligente Hardhat și o interfață web modernă construită cu Vite.

**Componente:**
- **Frontend:** Interfață web interactivă (public/ + src/) construită cu Vite
- **Smart Contracts:** Contracte Solidity pentru trasabilitate on-chain
- **Relayer:** Serviciu backend pentru interacțiunea cu blockchain
- **Assets:** Imagini QR și resurse vizuale

## Dezvoltare locală (Frontend)

### 1. Instalează dependențe
```bash
npm install
```

### 2. Pornește serverul de dezvoltare
```bash
npm run dev
```

Aplicația va fi disponibilă la http://localhost:5173/

### 3. Build pentru producție
```bash
npm run build
```

Fișierele de producție vor fi generate în directorul `dist/`

### 4. Preview build-ul de producție
```bash
npm run preview
```

### 5. Linting și formatare
```bash
# Verifică codul cu ESLint
npm run lint

# Formatează codul cu Prettier
npm run format
```

## Dezvoltare blockchain (Smart Contracts)

### 1. Configurează environment (opțional pentru demo)
```bash
cp .env.example .env
# Editează .env cu cheile tale (opțional pentru testnet)
```

### 2. Pornește nod Hardhat local
```bash
npm run node
```

### 3. Deploy local (într-un terminal nou)
```bash
npm run deploy
```

**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

### 4. Pornește relayer (mock mode e OK pentru demo)
```bash
npm run relayer
```

Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)

### 5. Conectează Metamask:
- Importă una din cheile generate de Hardhat în Metamask
- Configurează rețeaua custom: RPC URL = http://localhost:8545, Chain ID = 31337
- Folosește butoanele din interfață:
  - **"Conectează Wallet"** - conectează Metamask
  - **"Verifică pe blockchain"** - verifică hash-uri înregistrate
  - **"Export JSON"** - exportă datele de trasabilitate

## Deploy pe GitHub Pages

Proiectul este configurat pentru GitHub Pages folosind Vite cu `base: './'` pentru compatibilitate.

### Opțiunea 1: Deploy manual
```bash
# Build proiectul
npm run build

# Deploy directorul dist/ pe branch-ul gh-pages
# Folosește gh-pages package sau GitHub Actions
```

### Opțiunea 2: GitHub Actions (recomandat)
Configurează un workflow GitHub Actions pentru a construi automat și a publica directorul `dist/` pe branch-ul `gh-pages` la fiecare push pe main.

**Pași:**
1. Build-ul creează directorul `dist/` cu fișiere statice
2. Configurează GitHub Pages să servească din branch-ul `gh-pages` sau direct din `dist/` (dacă este disponibil)
3. Aplicația va fi disponibilă la `https://<username>.github.io/<repository>/`

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
├── public/              # Static files și entry HTML
│   ├── assets/          # Imagini, QR codes, resurse statice
│   ├── index.html       # Pagina principală
│   └── verify.html      # Pagina de verificare
├── src/                 # Source code frontend
│   ├── main.js          # JavaScript entry point
│   └── styles.css       # Stiluri CSS
├── contracts/           # Smart contracts Solidity
│   └── SimpleRegistry.sol
├── scripts/             # Scripts de deploy blockchain
│   └── deploy.js
├── relayer/             # Serviciu relayer backend
│   └── index.js
├── test/                # Contract tests
│   └── SimpleRegistry.test.js
├── dist/                # Build output (generat automat, ignorat de git)
├── vite.config.js       # Configurare Vite
├── hardhat.config.js    # Configurare Hardhat
├── .eslintrc.json       # Configurare ESLint
├── .prettierrc          # Configurare Prettier
├── package.json         # Dependencies și scripturi npm
├── CODE_OF_CONDUCT.md   # Contributor guidelines
├── SECURITY.md          # Security policy
└── CONTRIBUTING.md      # Development guidelines
```

## Tehnologii utilizate

- **Blockchain:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend:** Express.js, ethers.js v6
- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Network:** Ethereum-compatible (Hardhat local, Sepolia, Mumbai)