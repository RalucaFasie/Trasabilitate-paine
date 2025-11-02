# Trasabilitate-paine — Registry demo

[![CI](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml/badge.svg)](https://github.com/RalucaFasie/Trasabilitate-paine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)

Sistem interactiv de trasabilitate pentru pâine folosind blockchain. Acest proiect oferă o interfață web modernă pentru urmărirea întregului lanț de aprovizionare al pâinii, de la fermă la consumator, cu suport pentru înregistrare pe blockchain.

## 🚀 Getting Started

### Cerințe preliminare
- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalare și rulare locală

#### 1. Instalează dependențele:
```bash
npm install
```

#### 2. Pornește serverul de dezvoltare (Vite):
```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173`

#### 3. Build pentru producție:
```bash
npm run build
```

Aceasta va genera folderul `dist/` cu fișierele optimizate pentru producție.

#### 4. Previzualizare build producție:
```bash
npm run preview
```

### Linting și formatare

```bash
# Verifică codul cu ESLint
npm run lint

# Formatează codul cu Prettier
npm run format
```

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
```bash
cp .env.example .env
# Editează .env cu cheile tale (opțional pentru testnet)
```

#### 2. Pornește nod Hardhat local:
```bash
npm run node
```

#### 3. Deploy contractul local (într-un terminal nou):
```bash
npm run deploy
```
**Important:** Notează adresa contractului din output și seteaz-o în `.env` ca `CONTRACT_ADDRESS=0x...`

#### 4. Pornește relayer (mock mode OK pentru demo):
```bash
npm run relayer
```
Relayer va rula pe http://localhost:3001

#### 5. Conectează Metamask:
- Importă una din cheile generate de Hardhat în Metamask
- Configurează rețeaua custom: RPC URL = http://localhost:8545, Chain ID = 31337

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

## Tehnologii utilizate

- **Blockchain:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend:** Express.js, ethers.js v6
- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Network:** Ethereum-compatible (Hardhat local, Sepolia, Mumbai)