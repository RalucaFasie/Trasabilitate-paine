# Frontend Demo Files

This directory contains legacy/demo files that are not part of the main application.

## Files

- **homepage.html** - Demo page showing json-server integration (not used in main app)
- **db.json** - Mock data for json-server (used only by homepage.html)
- **api/home.json** - Static API mock data (legacy)

## Usage

These files are kept for reference and testing purposes. The main application uses:
- `/public/index.html` - Main application entry point
- `/public/verify.html` - Verification page
- `/src/main.js` - Main JavaScript
- `/src/styles.css` - Main styles

To run the demo homepage (optional):
```bash
npm run dev:api  # Start json-server on port 3000
# Then open frontend/homepage.html in browser
```

**Note:** The main application at `/public/index.html` does not depend on these demo files.
