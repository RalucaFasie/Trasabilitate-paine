import React from 'react'; import { useState } from 'react'; import { motion } from 'framer-motion';

// App single-file React component (default export) // Instrucțiuni de utilizare: // 1. Creează un nou repo GitHub numit TrasabilitatePaineEcoBread // 2. Pune acest fișier ca src/App.jsx într-un proiect creat cu Vite sau Create React App // 3. Pune imaginea QR file_000000002a4462439bfbf4d35ae6c6e8.png în public/ sau în repo la rădăcină // 4. Build & deploy pe GitHub Pages / Netlify (detalii la final comentariu)

const blocks = [ { id: 'ferma', title: 'Fermă – AgroVerde', summary: 'Originea cerealelor: grâu de tip Dârzu, 12.5 ha - Călărași', details: { suprafata_ha: 12.5, sortiment: 'Grâu Dârzu (rezistent secetă)', data_semanat: '2024-10-01', data_recoltare: '2025-07-15', tratamente: 'Fără pesticide sistemice – tratament cu biostimulatori', certificate: 'Certificat ECO (RO-ECO-2024-77)' }, hash: 'a1f5c7d9e2b3f6a7c8d9e0b1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1' }, { id: 'transport', title: 'Transport & Logistică – Siloz TransAgro', summary: 'Transport de la fermă la siloz și apoi la moară (distanta 40 km)', details: { data_plecare: '2025-07-16', vehicul: 'CT-1234 (camion frigorific)', temperatura_medie: '20°C', umiditate: '13%', verificari: 'Control vizual, analiză umiditate la sosire' }, hash: 'b2e6d8f0a3c4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0' }, { id: 'moara', title: 'Moară – PanifCalarași', summary: 'Măcinare și control calitate pentru lotul F-2025-001', details: { data_macinare: '2025-07-22', lot_faina: 'F-2025-001', puritate: '99.3%', umiditate: '13%', teste: 'Test alveografic, doză proteică, control pesticide' }, hash: 'c3f7e9a1b4d5c6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1' }, { id: 'senzori', title: 'Senzorii IoT – Monitorizare lanț rece', summary: 'Senzori de temperatură/humiditate montați în depozit și vehicul', details: { ultimul_update: '2025-07-23T09:32:00Z', temperatura_depozit: '22°C', umiditate_depozit: '14%', gps_vehicul: '44.2000 N, 27.3300 E', avertismente: 'Niciun incident înregistrat în 7 zile' }, hash: 'd4a8f0b2c5e6d7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2' }, { id: 'magazin', title: 'Magazin – Profi Călărași', summary: 'Punct de vânzare final; lot P-2025-001', details: { data_receptie: '2025-07-23', pret: '5.00 RON/buc', data_vanzare_start: '2025-07-24', stoc_initial: 1200, stoc_ram: 200 }, hash: 'e5b9c1d3f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3' } ];

export default function App() { const [selected, setSelected] = useState(null);

return ( <div style={{ padding: 20, fontFamily: 'Segoe UI, Roboto, Arial' }}> <header style={{ textAlign: 'center', marginBottom: 24 }}> <h1 style={{ color: '#2e7d32', margin: 0 }}>Trasabilitate Pâine – Demo</h1> <p style={{ margin: '6px 0 0 0' }}>Proiect: TrasabilitatePâineEcoBread — Apasă un bloc pentru detalii</p> </header>

<main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

    <section style={{ background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h2 style={{ color: '#388e3c' }}>Harta interactivă</h2>
      <p style={{ color: '#666' }}>Apasă pe oricare bloc pentru a vedea informațiile detaliate.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {blocks.map((b, i) => (
          <motion.div
            key={b.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#f8fff8',
              border: '1px solid #e6f3e6',
              padding: 12,
              borderRadius: 8,
              cursor: 'pointer'
            }}
            onClick={() => setSelected(b)}
          >
            <strong>{b.title}</strong>
            <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{b.summary}</div>
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <span style={{ background: '#eef7ee', padding: '4px 8px', borderRadius: 6 }}>{b.id.toUpperCase()}</span>
            </div>
          </motion.div>
        ))}
      </div>

    </section>

    <aside style={{ background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h3 style={{ marginTop: 0 }}>Detalii bloc</h3>
      {!selected && <p>Selectează un bloc din hartă pentru a vedea toate detaliile.</p>}

      {selected && (
        <div>
          <h4 style={{ marginBottom: 6 }}>{selected.title}</h4>
          <p style={{ margin: '6px 0' }}>{selected.summary}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <tbody>
              {Object.entries(selected.details).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '6px 8px', fontWeight: 600, width: 140, verticalAlign: 'top' }}>{formatKey(k)}</td>
                  <td style={{ padding: '6px 8px' }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Hash bloc (simulat):</div>
            <div style={{ fontFamily: 'monospace', background: '#f4f4f4', padding: 8, borderRadius: 6 }}>{selected.hash}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => verifyChain(selected)} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Verifică integritate</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <img src="file_000000002a4462439bfbf4d35ae6c6e8.png" alt="QR" width={150} style={{ borderRadius: 8, border: '1px solid #ddd' }} />
          </div>

        </div>
      )}

    </aside>

  </main>

  <footer style={{ marginTop: 24, textAlign: 'center', color: '#666' }}>
    <small>© 2025 TrasabilitatePâineEcoBread — Demo creat de Raluca Fășie</small>
  </footer>
</div>

); }

// Helpers function formatKey(k) { return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

function verifyChain(selected) { // Simulare verificare -> în realitate aici s-ar calcula hash și compara alert('Verificare integritate: toate blocurile sunt valide (simulare).\nHash bloc: ' + selected.hash); }

// Notes for deployment (copy in README): /* Deployment steps (Vite):

1. npm create vite@latest my-app -- --template react


2. copy this file to src/App.jsx


3. put file_000000002a4462439bfbf4d35ae6c6e8.png into /public


4. npm install


5. npm run build


6. deploy the dist (or use npm run preview) to GitHub Pages or Netlify



For GitHub Pages with gh-pages package (Create React App):

1. Add homepage in package.json: "homepage": "https://RalucaFasie.github.io/TrasabilitatePaineEcoBread"


2. npm install --save-dev gh-pages


3. add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d build"


4. npm run deploy */


