// Import styles
import './styles.css';

// Stage data with structured content
const stageData = {
  ferma: {
    title: 'Ferma',
    icon: '🌾',
    color: '#6a994e',
    fields: [
      { label: 'Cultură', value: 'Grâu de toamnă (Triticum aestivum)' },
      { label: 'Suprafață', value: '250 hectare' },
      { label: 'Lucrări', value: 'Arătură, semănat, fertilizare, irigare' },
      { label: 'Hibrid', value: 'Hibrid rezistent la secetă - Soiul Dropia' },
      {
        label: 'Tratamente',
        value: 'Erbicidare selectivă, fungicide naturale',
      },
    ],
  },
  transport: {
    title: 'Transport & Logistică',
    icon: '🚚',
    color: '#3b82f6',
    fields: [
      { label: 'Tip transport', value: 'Transport rutier - Camion frigorific' },
      {
        label: 'Distanță',
        value: '145 km (Ferma AgroVerde - Moara PanMălina)',
      },
      { label: 'Emisii CO₂', value: '23.5 kg CO₂ per transport' },
      {
        label: 'Detalii camion',
        value: 'Mercedes-Benz Actros, Euro 6, capacitate 18 tone',
      },
    ],
  },
  moara: {
    title: 'Moară / Procesare',
    icon: '⚙️',
    color: '#f59e0b',
    fields: [
      { label: 'Data recepției', value: '20 iulie 2025, ora 08:30' },
      { label: 'Lot', value: 'GRAU-0725-CL' },
      { label: 'Calitate', value: 'Clasa I - Proteină 12.5%, gluten 28%' },
      { label: 'Umiditate', value: '13.2% (conform standard)' },
      { label: 'Certificări', value: 'ISO 22000, HACCP, BIO Certificate' },
    ],
  },
  senzori: {
    title: 'Senzorii IoT',
    icon: '📡',
    color: '#8b5cf6',
    fields: [
      { label: 'Temperatură', value: '22.5°C (optimă pentru depozitare)' },
      { label: 'Umiditate sol', value: '65% - nivel adecvat pentru cultură' },
      { label: 'Date meteo', value: 'Partly cloudy, 24°C, vânt 12 km/h NE' },
      { label: 'Last update', value: '01 noiembrie 2025, 17:43 UTC' },
    ],
  },
  magazin: {
    title: 'Magazin / Consumator',
    icon: '🛒',
    color: '#ef4444',
    fields: [
      {
        label: 'Locul de vânzare',
        value: 'EcoMarket - Str. Libertății nr. 45, București',
      },
      { label: 'Cod lot', value: 'DP-0725-01-ECO' },
      {
        label: 'Termen valabilitate',
        value: '5 zile de la producție (27 iulie 2025)',
      },
      {
        label: 'QR',
        value: 'Cod QR disponibil pe ambalaj pentru trasabilitate completă',
      },
    ],
  },
};

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// Function to validate and sanitize color values (hex format only)
// Compile regex once for better performance
const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;
function sanitizeColor(color) {
  // Only allow valid hex colors (#RRGGBB format)
  if (hexColorPattern.test(color)) {
    return color;
  }
  // Fallback to a safe default color if validation fails
  return '#6a994e';
}

// Function to generate popup HTML content
function generatePopupHTML(stage) {
  const data = stageData[stage];
  if (!data) return '';

  const escapedTitle = escapeHtml(data.title);
  const safeColor = sanitizeColor(data.color);
  const fieldsHTML = data.fields
    .map((field) => {
      const escapedLabel = escapeHtml(field.label);
      const escapedValue = escapeHtml(field.value);
      return `<li><strong>${escapedLabel}:</strong> ${escapedValue}</li>`;
    })
    .join('');

  return `<!DOCTYPE html>\n<html lang="ro">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${escapedTitle} - Detalii</title>\n    <style>\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        body {\n            font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;\n            background: linear-gradient(135deg, ${safeColor}22 0%, ${safeColor}11 100%);\n            padding: 2rem;\n            line-height: 1.6;\n            color: #2c3e50;\n        }\n        .popup-container {\n            background: white;\n            border-radius: 12px;\n            padding: 2rem;\n            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n            max-width: 100%;\n        }\n        .popup-header {\n            display: flex;\n            align-items: center;\n            gap: 1rem;\n            margin-bottom: 1.5rem;\n            padding-bottom: 1rem;\n            border-bottom: 2px solid ${safeColor};\n        }\n        .popup-icon {\n            font-size: 2.5rem;\n        }\n        .popup-title {\n            font-size: 1.75rem;\n            color: ${safeColor};\n            font-weight: 700;\n        }\n        .popup-content {\n            margin-bottom: 1.5rem;\n        }\n        .popup-content h3 {\n            color: #2c3e50;\n            margin-bottom: 1rem;\n            font-size: 1.25rem;\n        }\n        .popup-content ul {\n            list-style: none;\n            padding: 0;\n        }\n        .popup-content li {\n            padding: 0.75rem;\n            margin-bottom: 0.5rem;\n            background: #f8f9fa;\n            border-radius: 8px;\n            border-left: 4px solid ${safeColor};\n        }\n        .popup-content strong {\n            color: ${safeColor};\n            display: inline-block;\n            min-width: 140px;\n        }\n        .popup-footer {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding-top: 1rem;\n            border-top: 1px solid #e9ecef;\n        }\n        .meta-note {\n            font-size: 0.85rem;\n            color: #6c757d;\n            font-style: italic;\n        }\n        .close-button {\n            background: ${safeColor};\n            color: white;\n            border: none;\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-size: 1rem;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.2s ease;\n        }\n        .close-button:hover {\n            background: ${safeColor}dd;\n            transform: translateY(-2px);\n            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n        }\n        .close-button:active {\n            transform: translateY(0);\n        }\n    </style>\n</head>\n<body>\n    <div class="popup-container">\n        <div class="popup-header">\n            <span class="popup-icon">${data.icon}</span>\n            <h1 class="popup-title">${escapedTitle}</h1>\n        </div>\n        <div class="popup-content">\n            <h3>Informații detaliate:</h3>\n            <ul>\n                ${fieldsHTML}\n            </ul>\n        </div>\n        <div class="popup-footer">\n            <span class="meta-note">Date statice de exemplu - pot fi adaptate pentru API</span>\n            <button class="close-button" onclick="window.close()">Închide</button>\n        </div>\n    </div>\n</body>\n</html>`;
}

// Function to open popup window
function openStagePopup(stage) {
  const popupHTML = generatePopupHTML(stage);

  // Open new window with specified dimensions
  const popup = window.open(
    '',
    '_blank',
    'width=520,height=640,scrollbars=yes,resizable=yes'
  );

  if (popup) {
    // Write the generated HTML to the popup window
    // Note: document.write is used intentionally here for GitHub Pages compatibility
    // The HTML content is generated from internal, validated data (not user input)
    // All user-facing text is escaped via escapeHtml() and colors are validated via sanitizeColor()
    popup.document.open();
    popup.document.write(popupHTML);
    popup.document.close();

    // Focus the popup window
    popup.focus();
  } else {
    // Fallback if popup was blocked
    alert(
      'Vă rugăm să permiteți pop-up-urile pentru a vizualiza detaliile etapei.'
    );
  }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get all stage buttons
  const stageButtons = document.querySelectorAll('.stage-button[data-stage]');

  // Attach click event listener to each button
  stageButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const stage = this.getAttribute('data-stage');
      if (stage && stageData[stage]) {
        openStagePopup(stage);
      }
    });

    // Add keyboard accessibility (Enter and Space keys)
    button.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const stage = this.getAttribute('data-stage');
        if (stage && stageData[stage]) {
          openStagePopup(stage);
        }
      }
    });
  });
});
