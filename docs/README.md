# Blockchain Visualization - Docs Folder

Acest folder conține site-ul static pentru vizualizarea blockchain-ului de trasabilitate al pâinii.

## 📁 Structură

- `index.html` - Pagina principală interactivă
- `blockchain.html` - Vizualizare blockchain cu hash-uri
- `app.js` - Client-side hashing (Opțiunea 1)
- `app-static.js` - Load from static JSON (Opțiunea 2)
- `verify.html` - Pagina de verificare
- `assets/` - Resurse statice (imagini, etc.)
- `data/` - Date generate de CI (blocks.json)

## 🔐 Două Opțiuni de Hashing

### Opțiunea 1: Client-Side Hashing (DEFAULT)

Fișierul `blockchain.html` folosește `app.js` care calculează hash-urile SHA-256 în browser folosind Web Crypto API.

**Avantaje:**
- Nu necesită server sau build step
- Hash-urile sunt calculate fresh la fiecare încărcare
- Poate demonstra cum funcționează hashing-ul în timp real

**Cum funcționează:**
```javascript
// Browser calculează SHA-256 pentru fiecare bloc
const hash = await crypto.subtle.digest('SHA-256', data);
```

### Opțiunea 2: CI-Generated Static Data

Dacă dorești să folosești date precalculate, schimbă în `blockchain.html`:

```html
<!-- Schimbă din: -->
<script type="module" src="./app.js"></script>

<!-- În: -->
<script type="module" src="./app-static.js"></script>
```

**Avantaje:**
- Mai rapid - hash-urile sunt deja calculate
- Nu depinde de Web Crypto API
- Poate include date suplimentare generate de CI

**Cum funcționează:**
1. GitHub Actions rulează `scripts/generate-blocks.js`
2. Script-ul generează `docs/data/blocks.json` cu hash-uri precalculate
3. `app-static.js` încarcă JSON-ul și afișează datele

## 🚀 Deployment pe GitHub Pages

GitHub Actions workflow (`.github/workflows/static.yml`) se ocupă automat de:

1. **Install dependencies** - `npm ci`
2. **Generate blockchain data** - `node scripts/generate-blocks.js`
3. **Deploy docs/ folder** - doar folderul docs/ este deploiat pe Pages

## 🔧 Testare Locală

### Testează client-side hashing:
```bash
# Pornește un server local în folderul docs
cd docs
python -m http.server 8000
# sau
npx serve .
```

Deschide: http://localhost:8000/blockchain.html

### Testează cu date statice:

```bash
# Generează datele
node scripts/generate-blocks.js

# Schimbă app.js cu app-static.js în blockchain.html
# Apoi pornește serverul local
cd docs
python -m http.server 8000
```

## 📝 Modificarea Datelor Blockchain

Pentru a modifica datele blocurilor, editează:
- `docs/app.js` - pentru client-side hashing
- `scripts/generate-blocks.js` - pentru CI-generated data

Ambele fișiere conțin același array `blockchainData` cu structura:

```javascript
{
    index: 0,
    timestamp: '2025-10-15T08:00:00Z',
    icon: '🌱',
    title: 'Numele Blocului',
    data: {
        'Cheie': 'Valoare',
        // ...
    }
}
```

## 🎨 Personalizare

CSS-ul este inline în `blockchain.html` pentru simplitate. Poți:
- Schimba culorile în secțiunea `<style>`
- Modifica layout-ul blocurilor
- Adăuga animații sau efecte

## 🔗 Asset Paths

Toate path-urile sunt relative (`./ `) pentru a funcționa corect pe GitHub Pages:
- `./app.js` ✅
- `./assets/image.png` ✅
- `/app.js` ❌ (absolut - nu funcționează pe subdomain)

## 📊 Exemplu Hash Output

```
Block #0 (Genesis):
  Previous: 0000000000000000000000000000000000000000000000000000000000000000
  Current:  a1b2c3d4e5f6...

Block #1 (Ferma):
  Previous: a1b2c3d4e5f6...
  Current:  f7e8d9c0b1a2...
```

Fiecare bloc conține hash-ul blocului anterior, creând un lanț verificabil.
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trasabilitatea Pâinii - Homepage Interactiv</title>
    <meta name="description" content="Sistem interactiv de trasabilitate pentru pâine - de la fermă la consumator">

    <!-- Styles will be imported by main.js -->
</head>
<body>
    <div class="container">
        <!-- Illustration Area -->
        <div class="illustration-area">
            <div class="header">
                <h1>Trasabilitatea Pâinii</h1>
                <p class="subtitle">Urmărește călătoria pâinii tale de la fermă la masă</p>
            </div>
            <div class="illustration-wrapper">
                <img src="./assets/bread-traceability-map.png" alt="Harta trasabilității - ilustrare a lanțului de aprovizionare" class="illustration-image">
            </div>
        </div>

        <!-- Stage Buttons Panel -->
        <nav class="stages-panel" role="navigation" aria-label="Etape de trasabilitate">
            <h2 class="panel-title">Etape de Trasabilitate</h2>
            <div class="stages-buttons">
                <button class="stage-button stage-ferma" data-stage="ferma" aria-haspopup="true">
                    <span class="stage-icon">🌾</span>
                    <span class="stage-label">Ferma</span>
                </button>
                <button class="stage-button stage-transport" data-stage="transport" aria-haspopup="true">
                    <span class="stage-icon">🚚</span>
                    <span class="stage-label">Transport & Logistică</span>
                </button>
                <button class="stage-button stage-moara" data-stage="moara" aria-haspopup="true">
                    <span class="stage-icon">⚙️</span>
                    <span class="stage-label">Moară / Procesare</span>
                </button>
                <button class="stage-button stage-senzori" data-stage="senzori" aria-haspopup="true">
                    <span class="stage-icon">📡</span>
                    <span class="stage-label">Senzorii IoT</span>
                </button>
                <button class="stage-button stage-magazin" data-stage="magazin" aria-haspopup="true">
                    <span class="stage-icon">🛒</span>
                    <span class="stage-label">Magazin / Consumator</span>
                </button>
            </div>
            
            <!-- Blockchain Visualization Link -->
            <div style="margin-top: 20px; text-align: center;">
                <a href="blockchain.html" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s;">
                    🔗 Vizualizează Blockchain-ul
                </a>
            </div>
        </nav>
    </div>

    <footer class="footer">
        <p>&copy; 2025 Trasabilitatea Pâinii - Realizat de Raluca Fășie</p>
    </footer>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
