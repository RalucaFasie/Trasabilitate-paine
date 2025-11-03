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

## 🔗 Blockchain Connection & Integration

Pentru a integra acest sistem în aplicații externe (React, Node.js, etc.) sau pentru a verifica conexiunea blockchain:

- 📖 **[BLOCKCHAIN_CONNECTION.md](BLOCKCHAIN_CONNECTION.md)** - Ghid complet de conectare și integrare
- 📁 **[integration-examples/](integration-examples/)** - Exemple de integrare pentru React și Node.js
- 🔧 **Verificare conexiune**: `npm run verify-connection`

Sistemul funcționează în **modul demo**:
- **Relayer Service** - Tranzacții fără gas fees (nu necesită wallet sau MetaMask)
- Verificare read-only prin JSON-RPC provider

## Dezvoltare locală (Frontend)

### 1. Instalează dependențe
Sistem interactiv de trasabilitate pentru pâine folosind blockchain. Acest proiect oferă o interfață web modernă pentru urmărirea întregului lanț de aprovizionare al pâinii, de la fermă la consumator, cu suport pentru înregistrare pe blockchain.

## 🚀 Getting Started

### Cerințe preliminare
- Node.js >= 18.0.0
- npm >= 9.0.0
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

### Instalare și rulare locală

#### 1. Instalează dependențele:
```bash
npm install
```

### 2. Pornește serverul de dezvoltare
#### 2. Pornește serverul de dezvoltare (Vite):
```bash
npm run dev
```

Aplicația va fi disponibilă la http://localhost:5173/

### 3. Build pentru producție
Aplicația va fi disponibilă la `http://localhost:5173`

#### 3. Build pentru producție:
```bash
npm run build
```

Fișierele de producție vor fi generate în directorul `dist/`

### 4. Preview build-ul de producție
Aceasta va genera folderul `dist/` cu fișierele optimizate pentru producție.

#### 4. Previzualizare build producție:
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

### 5. Linting și formatare
### Linting și formatare

```bash
# Verifică codul cu ESLint
npm run lint

# Formatează codul cu Prettier
npm run format
```

## Dezvoltare blockchain (Smart Contracts)

### 1. Configurează environment (opțional pentru demo)
## 📁 Structura proiectului

```
├── public/              # Fișiere statice și HTML
│   ├── assets/         # Imagini și resurse statice
│   ├── index.html      # Pagina principală
│   └── verify.html     # Pagina de verificare
├── src/                # Cod sursă JavaScript și CSS
│   ├── main.js         # Entry point JavaScript
│   └── styles.css      # Stiluri CSS
├── contracts/          # Smart contracts Solidity
│   └── SimpleRegistry.sol
├── scripts/            # Scripts de deploy blockchain
│   └── deploy.js
├── relayer/            # Serviciu relayer backend
│   └── index.js
├── test/               # Contract tests
│   └── SimpleRegistry.test.js
├── vite.config.js      # Configurare Vite
├── .eslintrc.json      # Configurare ESLint
├── .prettierrc         # Configurare Prettier
└── package.json        # Dependencies și scripturi

```

## 🔗 Blockchain Integration

### Setup pentru dezvoltare locală cu Hardhat

#### 1. Configurează environment (opțional pentru demo):
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

### 2. Pornește nod Hardhat local
#### 2. Pornește nod Hardhat local:
```bash
npm run node
```

### 3. Deploy local (într-un terminal nou)
#### 3. Deploy contractul local (într-un terminal nou):
### 3. Deploy local (terminal 2):
```bash
npm run deploy
```

**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

### 4. Pornește relayer (mock mode e OK pentru demo)
```bash
npm run relayer
#### 4. Pornește relayer (mock mode OK pentru demo):
```bash
npm run relayer
```
Relayer va rula pe http://localhost:3001


### 4. Pornește relayer (terminal 3):
```bash
npm run relayer
```
Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)

Relayer va rula pe http://localhost:3001 (mock mode dacă RELAYER_PK nu este setat)



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

## 🌐 GitHub Pages Deployment

După ce rulezi `npm run build`, folderul `dist/` conține toate fișierele necesare pentru GitHub Pages.

**Opțiuni de deployment:**
1. **Manual:** Copiază conținutul din `dist/` în branch-ul `gh-pages`
2. **GitHub Actions:** Configurează un workflow pentru a publica automat din `dist/`

Configurația `base: './'` din `vite.config.js` asigură compatibilitatea cu GitHub Pages.
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
├── dist/                # Build output (generat automat, ignorat de git)
├── vite.config.js       # Configurare Vite
├── hardhat.config.js    # Configurare Hardhat
├── .eslintrc.json       # Configurare ESLint
├── .prettierrc          # Configurare Prettier
├── package.json         # Dependencies și scripturi npm
├── CODE_OF_CONDUCT.md   # Contributor guidelines
├── SECURITY.md          # Security policy
└── CONTRIBUTING.md      # Development guidelines
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