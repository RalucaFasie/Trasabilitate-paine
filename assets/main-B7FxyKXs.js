(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=e(t);fetch(t.href,i)}})();const s={ferma:{title:"Ferma",icon:"🌾",color:"#6a994e",fields:[{label:"Cultură",value:"Grâu de toamnă (Triticum aestivum)"},{label:"Suprafață",value:"250 hectare"},{label:"Lucrări",value:"Arătură, semănat, fertilizare, irigare"},{label:"Hibrid",value:"Hibrid rezistent la secetă - Soiul Dropia"},{label:"Tratamente",value:"Erbicidare selectivă, fungicide naturale"}]},transport:{title:"Transport & Logistică",icon:"🚚",color:"#3b82f6",fields:[{label:"Tip transport",value:"Transport rutier - Camion frigorific"},{label:"Distanță",value:"145 km (Ferma AgroVerde - Moara PanMălina)"},{label:"Emisii CO₂",value:"23.5 kg CO₂ per transport"},{label:"Detalii camion",value:"Mercedes-Benz Actros, Euro 6, capacitate 18 tone"}]},moara:{title:"Moară / Procesare",icon:"⚙️",color:"#f59e0b",fields:[{label:"Data recepției",value:"20 iulie 2025, ora 08:30"},{label:"Lot",value:"GRAU-0725-CL"},{label:"Calitate",value:"Clasa I - Proteină 12.5%, gluten 28%"},{label:"Umiditate",value:"13.2% (conform standard)"},{label:"Certificări",value:"ISO 22000, HACCP, BIO Certificate"}]},senzori:{title:"Senzorii IoT",icon:"📡",color:"#8b5cf6",fields:[{label:"Temperatură",value:"22.5°C (optimă pentru depozitare)"},{label:"Umiditate sol",value:"65% - nivel adecvat pentru cultură"},{label:"Date meteo",value:"Partly cloudy, 24°C, vânt 12 km/h NE"},{label:"Last update",value:"01 noiembrie 2025, 17:43 UTC"}]},magazin:{title:"Magazin / Consumator",icon:"🛒",color:"#ef4444",fields:[{label:"Locul de vânzare",value:"EcoMarket - Str. Libertății nr. 45, București"},{label:"Cod lot",value:"DP-0725-01-ECO"},{label:"Termen valabilitate",value:"5 zile de la producție (27 iulie 2025)"},{label:"QR",value:"Cod QR disponibil pe ambalaj pentru trasabilitate completă"}]}};function l(r){const o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return r.replace(/[&<>"']/g,function(e){return o[e]})}const p=/^#[0-9A-Fa-f]{6}$/;function d(r){return p.test(r)?r:"#6a994e"}function m(r){const o=s[r];if(!o)return"";const e=l(o.title),a=d(o.color),t=o.fields.map(i=>{const n=l(i.label),u=l(i.value);return`<li><strong>${n}:</strong> ${u}</li>`}).join("");return`<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${e} - Detalii</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${a}22 0%, ${a}11 100%);
            padding: 2rem;
            line-height: 1.6;
            color: #2c3e50;
        }
        .popup-container {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            max-width: 100%;
        }
        .popup-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid ${a};
        }
        .popup-icon {
            font-size: 2.5rem;
        }
        .popup-title {
            font-size: 1.75rem;
            color: ${a};
            font-weight: 700;
        }
        .popup-content {
            margin-bottom: 1.5rem;
        }
        .popup-content h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }
        .popup-content ul {
            list-style: none;
            padding: 0;
        }
        .popup-content li {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid ${a};
        }
        .popup-content strong {
            color: ${a};
            display: inline-block;
            min-width: 140px;
        }
        .popup-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        .meta-note {
            font-size: 0.85rem;
            color: #6c757d;
            font-style: italic;
        }
        .close-button {
            background: ${a};
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .close-button:hover {
            background: ${a}dd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .close-button:active {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="popup-container">
        <div class="popup-header">
            <span class="popup-icon">${o.icon}</span>
            <h1 class="popup-title">${e}</h1>
        </div>
        <div class="popup-content">
            <h3>Informații detaliate:</h3>
            <ul>
                ${t}
            </ul>
        </div>
        <div class="popup-footer">
            <span class="meta-note">Date statice de exemplu - pot fi adaptate pentru API</span>
            <button class="close-button" onclick="window.close()">Închide</button>
        </div>
    </div>
</body>
</html>`}function c(r){const o=m(r),e=window.open("","_blank","width=520,height=640,scrollbars=yes,resizable=yes");e?(e.document.open(),e.document.write(o),e.document.close(),e.focus()):alert("Vă rugăm să permiteți pop-up-urile pentru a vizualiza detaliile etapei.")}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(".stage-button[data-stage]").forEach(o=>{o.addEventListener("click",function(){const e=this.getAttribute("data-stage");e&&s[e]&&c(e)}),o.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();const a=this.getAttribute("data-stage");a&&s[a]&&c(a)}})})});
