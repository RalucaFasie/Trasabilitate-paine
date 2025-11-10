# 🌐 Informații de Acces - Interfața Utilizator

## ✅ Status Verificare Proiect

Proiectul a fost verificat și toate componentele funcționează corect:

- ✅ **Dependențe instalate** - Toate pachetele npm sunt instalate cu succes
- ✅ **Build reușit** - Proiectul se compilează fără erori folosind Vite
- ✅ **Linting** - Codul JavaScript trece testele ESLint
- ✅ **Interfața funcțională** - UI-ul este complet funcțional și interactiv
- ✅ **Pagini verificate** - Atât pagina principală cât și pagina de verificare funcționează

## 🔗 Link-uri de Acces pentru Interfața Utilizator

### 1. GitHub Pages (Hosting Public)

**URL Principal:** 
```
https://ralucafasie.github.io/Trasabilitate-paine/
```

**Pagina de Verificare:**
```
https://ralucafasie.github.io/Trasabilitate-paine/verify.html
```

**Exemplu de verificare cu hash:**
```
https://ralucafasie.github.io/Trasabilitate-paine/verify.html?hash=8ac2f97b5dfe91c44a5f3b9c78e4a2120d33ef
```

### 2. Dezvoltare Locală

Pentru a rula proiectul local:

```bash
# Instalează dependențele
npm install

# Pornește serverul de dezvoltare
npm run dev
```

Aplicația va fi disponibilă la: **http://localhost:5173/**

### 3. Preview Build Production (Local)

Pentru a testa build-ul de producție local:

```bash
# Build-uiește proiectul
npm run build

# Pornește serverul de preview
npm run preview
```

Preview va fi disponibil la: **http://localhost:4173/**

## 📱 Funcționalități Interfață

### Pagina Principală (`index.html`)

**Caracteristici:**
- ✨ Interfață interactivă cu hartă de trasabilitate
- 🎨 Design modern și responsive
- 🌾 5 butoane pentru etapele de trasabilitate:
  - **Ferma** - Informații despre originea cerealelor
  - **Transport & Logistică** - Detalii despre transport
  - **Moară / Procesare** - Procesarea grâului în făină
  - **Senzorii IoT** - Monitorizare în timp real
  - **Magazin / Consumator** - Punctul final de vânzare

**Interactivitate:**
- Click pe fiecare buton deschide o fereastră modală cu informații detaliate
- Design cu culori distinctive pentru fiecare etapă
- Footer cu copyright și autor

### Pagina de Verificare (`verify.html`)

**Caracteristici:**
- 🔍 Verificare trasabilitate prin hash
- 📊 Afișare informații detaliate pentru fiecare bloc
- 🔗 Link-uri către verificări exemplu:
  - Ferma AgroVerde
  - Moara PanMălina
  - Brutăria DeliPan
  - Magazinul EcoMarket
  - Consumator final
- 📱 Buton pentru deschidere pe telefon (QR code)

## 🛠️ Tehnologii Utilizate

- **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
- **Build Tool:** Vite 5.x
- **Styling:** CSS custom cu design modern
- **Icons:** Emoji Unicode pentru interfață intuitivă
- **Responsive:** Design adaptat pentru mobile și desktop

## 📦 Structura Fișiere Publicate

După build, folderul `dist/` conține:
```
dist/
├── index.html                    # Pagina principală
├── verify.html                   # Pagina de verificare
├── assets/                       # CSS și JS optimizate
│   ├── main-*.css
│   └── main-*.js
├── bread-traceability-map.png   # Ilustrație hartă
└── qr-b*.svg                    # Coduri QR pentru blocuri
```

## 🔄 Deployment pe GitHub Pages

Proiectul este configurat pentru deployment automat pe GitHub Pages prin workflow-ul `.github/workflows/static.yml`.

**Pași pentru deployment:**
1. Push-ul pe branch-ul `main` trigger-ează automat workflow-ul
2. GitHub Actions construiește și publică site-ul
3. Site-ul devine disponibil la URL-ul GitHub Pages în câteva minute

**Manual Deployment:**
```bash
# Build proiectul
npm run build

# Conținutul din dist/ poate fi publicat pe orice hosting static
```

## 📸 Capturi de Ecran

### Pagina Principală
![Homepage](https://github.com/user-attachments/assets/641a25f6-a86c-40ba-b409-5dc66f8e3f9a)

### Pagina de Verificare
![Verify Page](https://github.com/user-attachments/assets/e14e2a48-f7dd-4848-b3a7-301de9be7f38)

### Verificare cu Hash
![Verify with Hash](https://github.com/user-attachments/assets/ae10fdb0-ab10-4c20-8a8c-e6895401b908)

## 🚀 Quick Start

Pentru utilizare rapidă:

1. **Accesează direct:** https://ralucafasie.github.io/Trasabilitate-paine/
2. **Explorează etapele:** Click pe butoanele colorate pentru informații
3. **Verifică trasabilitatea:** Navighează la pagina de verificare pentru detalii despre fiecare bloc

## 📝 Note

- Proiectul funcționează în modul demo cu date statice
- Pentru integrare blockchain reală, consultă `BLOCKCHAIN_CONNECTION.md`
- Pentru ghid rapid de setup local, vezi `QUICKSTART.md`
- Pentru detalii complete, citește `README.md`

## 🔒 Securitate

- ✅ Nu sunt expuse chei private sau credențiale
- ✅ Aplicația rulează în modul read-only pentru demonstrație
- ✅ Verificat cu ESLint pentru best practices

---

**Autor:** Raluca Fășie  
**Licență:** MIT  
**Repository:** https://github.com/RalucaFasie/Trasabilitate-paine
