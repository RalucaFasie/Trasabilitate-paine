# Trasabilitate-paine — Registry demo

[![CI](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml/badge.svg)](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)

Sistem de trasabilitate pentru pâine construit cu blockchain (Hardhat) și interfață web modernă (Vite). Proiectul conține contracte smart Solidity, un serviciu relayer backend și o interfață web interactivă pentru vizualizarea și verificarea trasabilității produselor.

## Pornire rapidă

### Development local (interfață web)

1. **Instalează dependențe:**
```bash
npm install
```

2. **Pornește serverul de dezvoltare:**
```bash
npm run dev
```

Aplicația va rula pe http://localhost:5173 (portul default Vite).

3. **Build pentru producție:**
```bash
npm run build
```

Fișierele pentru producție vor fi generate în directorul `dist/`.

4. **Preview build de producție:**
```bash
npm run preview
```

### Development blockchain (Hardhat + Relayer)

1. **Configurează environment (opțional pentru demo):**
```bash
cp .env.example .env
# Editează .env cu cheile tale (opțional pentru testnet)
```

2. **Pornește nod Hardhat local:**
```bash
npm run node
```

3. **Deploy local (într-un terminal nou):**
```bash
npm run deploy
```
**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

4. **Pornește relayer (mock mode e OK pentru demo):**
```bash
npm run relayer
```
Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)

5. **Conectează Metamask:**
- Importă una din cheile generate de Hardhat în Metamask
- Configurează rețeaua custom: RPC URL = http://localhost:8545, Chain ID = 31337
- Folosește butoanele din interfață:
  - **"Conectează Wallet"** - conectează Metamask
  - **"Verifică pe blockchain"** - verifică hash-uri înregistrate
  - **"Export JSON"** - exportă datele de trasabilitate

## Linting și formatare

```bash
# Verifică codul cu ESLint
npm run lint

# Formatează codul cu Prettier
npm run format
```

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
│   ├── assets/          # Images, QR codes
│   ├── index.html       # Interfață principală
│   └── verify.html      # Pagină de verificare
├── src/                 # Source code (JS, CSS)
│   ├── main.js          # Entry point JavaScript
│   ├── styles.css       # Stylesheet principal
│   └── assets/          # Source assets (dacă există)
├── contracts/           # Smart contracts Solidity
│   └── SimpleRegistry.sol
├── scripts/             # Scripts de deploy blockchain
│   └── deploy.js
├── relayer/             # Serviciu relayer backend
│   └── index.js
├── test/                # Contract tests
│   └── SimpleRegistry.test.js
├── dist/                # Build output (generat de Vite)
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

- **Frontend:** Vite 5, HTML5, CSS3, JavaScript (vanilla)
- **Dev Tools:** ESLint, Prettier
- **Blockchain:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend:** Express.js, ethers.js v6
- **Network:** Ethereum-compatible (Hardhat local, Sepolia, Mumbai)

## GitHub Pages

Pentru a publica aplicația pe GitHub Pages:

1. **Build proiectul:**
```bash
npm run build
```

2. **Deploy directorul `dist/` pe GitHub Pages:**
   - Opțiune A: Folosește GitHub Actions pentru a publica automat din branch-ul `dist` sau `gh-pages`
   - Opțiune B: Manual - copiază conținutul din `dist/` într-un branch dedicat și configurează GitHub Pages să servească din acel branch

**Notă:** Configurația Vite folosește `base: './'` pentru compatibilitate cu GitHub Pages.