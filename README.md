# Trasabilitate-paine — Registry demo

Această ramură (feature/registry-demo) conține fișierele pentru demonstrația locală a publicării și verificării dovezilor (hash/CID) pe un registru blockchain local (Hardhat). Am pregătit contract, script de deploy, relayer skeleton și fișiere QR pentru fiecare bloc demo.

Conținut adăugat:
- contracts/SimpleRegistry.sol — contract OpenZeppelin cu rol RELAYER și event HashRegistered
- hardhat.config.js — configurație pentru rețele locale/testnet
- scripts/deploy.js — script deploy
- relayer/index.js — skeleton relayer (mock mode sau real, dacă setezi RELAYER_PK)
- .env.example — variabile mediu
- assets/qr-b1.svg .. assets/qr-b5.svg — imagini QR (placeholder SVG per bloc)

Scenariu recomandat (demo local — fără plăți reale):

1. Instalează dependențe:
   npm install

2. Pornește nod Hardhat:
   npx hardhat node

3. Deploy local:
   npx hardhat run scripts/deploy.js --network localhost
   Vei primi adresa contractului — seteaz-o în relayer/.env sau exporteaz-o ca CONTRACT_ADDRESS.

4. Pornește relayer (mock mode e OK pentru demo):
   node relayer/index.js

5. Importă una din cheile generate de Hardhat în Metamask (în nodul local primești conturi cu ETH fake). Deschide `index.html` (din branch main sau servește-l static) și folosește butoanele:
   - "Conectează Wallet" pentru a conecta Metamask
   - "Înregistrează hash (demo)" pentru a trimite tranzacție local (dacă wallet are ETH fake)
   - "Înregistrează via Relayer" pentru a trimite payload la relayer (mock mode returnează hash)
   - "Verifică pe blockchain" pentru a apela contract.isRegistered și/sau interoga logurile

QR codes
- Am adăugat fișiere SVG în `assets/` pentru fiecare bloc: qr-b1.svg .. qr-b5.svg.
- Acestea sunt placeholder-uri care conțin hash-ul blocului; pentru coduri QR scannabile recomand să generezi imagini QR cu linkul de verificare (ex: `https://your-demo.example/verify?hash=<hash>`), apoi înlocuiește fișierele din `assets/`.

Următorii pași pe care ți-i pot face imediat:
- Generez imagini QR scannabile (dacă îmi dai un endpoint de verificare public sau dacă vrei să folosesc serviciu public de generare QR) și le comit.
- Adaug buton "Înregistrează hash" în front-end pentru a lansa register() direct cu signer (dacă vrei). (pot comite pe branch sau main)
- Creez script deploy pentru testnet (Mumbai/Sepolia) și instrucțiuni complete după ce setezi RPC/cheie.