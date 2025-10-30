# Trasabilitatea Pâinii — AgroVerde

Aceasta repo conține o demonstrație de trasabilitate a pâinii folosind un lanț de evenimente (blocuri).

Am actualizat README pentru a include descrierea noilor funcții și legătura către o pagină interactivă (index.html) cu vizualizarea fluxului și funcționalități suplimentare.

Funcționalități nou adăugate (în index.html):

- Diagramă interactivă cu noduri (blocuri) și conexiuni SVG între ele.
- Click pe un nod deschide un modal cu detalii complete.
- Dark / Light mode toggle (salvat în localStorage).
- Buton "Copiază hash" pentru fiecare bloc.
- Buton "Export JSON" pentru a descărca traseul ca fișier JSON.
- Conexiuni dinamice care se recalculază la redimensionare sau când se schimbă layout-ul.
- Accesibilitate: focus navigation și aria-labels, keyboard support (Esc închide modal).

Cum testezi local:

1. Descarcă repo.
2. Deschide index.html în browser (sau rulează un server local: `python -m http.server` și accesează `http://localhost:8000`).

Publicare pe GitHub Pages:

- Dacă vrei o pagină publică, activează GitHub Pages pentru acest repo (Settings → Pages) și setează root sau branch gh-pages; index.html va fi folosit pentru afișarea interactivă.

Conținutul index.html este adăugat în repo și conține toate funcționalitățile menționate.

© 2025 AgroVerde — realizat de Raluca Fășie
