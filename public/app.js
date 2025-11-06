// app.js - Client-side blockchain visualization with SHA-256 hashing
// Afișare blockchain cu hash-uri calculate în browser folosind Web Crypto API

/**
 * Datele pentru fiecare bloc în lanțul de trasabilitate
 * Each block represents a stage in the bread supply chain
 */
const blockchainData = [
    {
        index: 0,
        timestamp: '2025-10-15T08:00:00Z',
        icon: '🌱',
        title: 'Genesis Block',
        data: {
            'Tip': 'Bloc Inițial',
            'Descriere': 'Punct de pornire al lanțului blockchain',
            'Network': 'Bread Traceability Chain'
        }
    },
    {
        index: 1,
        timestamp: '2025-10-20T10:30:00Z',
        icon: '🌾',
        title: 'Ferma',
        data: {
            'Fermier': 'AgroVerde SRL',
            'Locație': 'Călărași, România',
            'Cultură': 'Grâu de toamnă (Triticum aestivum)',
            'Suprafață': '250 hectare',
            'Certificare': 'BIO Certificate',
            'Hibrid': 'Soiul Dropia'
        }
    },
    {
        index: 2,
        timestamp: '2025-10-22T14:15:00Z',
        icon: '⚙️',
        title: 'Moară',
        data: {
            'Moară': 'PanMălina Industrial',
            'Lot': 'GRAU-1025-CL',
            'Calitate': 'Clasa I - Proteină 12.5%',
            'Umiditate': '13.2%',
            'Certificări': 'ISO 22000, HACCP',
            'Data procesării': '2025-10-22'
        }
    },
    {
        index: 3,
        timestamp: '2025-10-23T09:45:00Z',
        icon: '📡',
        title: 'Senzori IoT',
        data: {
            'Temperatură': '22.5°C',
            'Umiditate': '65%',
            'Condiții': 'Parțial înnorat',
            'Monitorizare': 'Real-time sensors',
            'Status': 'Optimal pentru depozitare'
        }
    },
    {
        index: 4,
        timestamp: '2025-10-25T11:20:00Z',
        icon: '🍞',
        title: 'Brutărie',
        data: {
            'Brutărie': 'Pâinea Caldă',
            'Producție': 'Pâine artizanală',
            'Rețetă': 'Tradițională cu maia naturală',
            'Lot pâine': 'PAINE-1025-001',
            'Cantitate': '500 kg',
            'Data coacere': '2025-10-25'
        }
    },
    {
        index: 5,
        timestamp: '2025-10-26T07:00:00Z',
        icon: '🛒',
        title: 'Magazin',
        data: {
            'Magazin': 'SuperMarket Fresh',
            'Locație': 'București, Sector 3',
            'Data livrare': '2025-10-26',
            'Preț': '8.50 RON/kg',
            'Disponibilitate': 'În stoc',
            'Cod produs': 'BREAD-TRACE-001'
        }
    }
];

/**
 * Calculate SHA-256 hash using Web Crypto API
 * @param {string} message - Text to hash
 * @returns {Promise<string>} - Hex string of the hash
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Calculate hash for a block
 * @param {Object} block - Block data
 * @param {string} previousHash - Hash of previous block
 * @returns {Promise<string>} - Hash of current block
 */
async function calculateBlockHash(block, previousHash) {
    // Creăm un string cu toate datele blocului
    const dataString = JSON.stringify({
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: previousHash
    });
    
    return await sha256(dataString);
}

/**
 * Build the blockchain with calculated hashes
 * @returns {Promise<Array>} - Array of blocks with hashes
 */
async function buildBlockchain() {
    const blockchain = [];
    let previousHash = '0'.repeat(64); // Genesis block has no previous hash
    
    for (const blockData of blockchainData) {
        const blockHash = await calculateBlockHash(blockData, previousHash);
        
        blockchain.push({
            ...blockData,
            previousHash: previousHash,
            hash: blockHash
        });
        
        previousHash = blockHash;
    }
    
    return blockchain;
}

/**
 * Render a single block in the UI
 * @param {Object} block - Block with all data including hashes
 * @returns {string} - HTML string for the block
 */
function renderBlock(block) {
    const isGenesis = block.index === 0;
    
    // Render data rows
    const dataRows = Object.entries(block.data)
        .map(([key, value]) => `
            <div class="data-row">
                <span class="data-label">${key}:</span>
                <span class="data-value">${value}</span>
            </div>
        `).join('');
    
    // Format timestamp
    const date = new Date(block.timestamp);
    const formattedDate = date.toLocaleString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="block">
            <div class="block-header">
                <div class="block-title">
                    <span class="block-icon">${block.icon}</span>
                    <span>${block.title}</span>
                    ${isGenesis ? '<span class="genesis-badge">GENESIS</span>' : ''}
                </div>
                <div class="block-index">Bloc #${block.index}</div>
            </div>
            
            <div class="block-content">
                <div class="block-data">
                    ${dataRows}
                </div>
                
                <div class="timestamp">
                    📅 Timestamp: ${formattedDate}
                </div>
            </div>
            
            <div class="hash-section">
                <div class="hash-row">
                    <div class="hash-label">📋 Hash Bloc Anterior:</div>
                    <div class="hash-value">${block.previousHash}</div>
                </div>
                <div class="hash-row">
                    <div class="hash-label">🔐 Hash Bloc Curent:</div>
                    <div class="hash-value">${block.hash}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the entire blockchain
 * @param {Array} blockchain - Array of blocks with hashes
 */
function renderBlockchain(blockchain) {
    const container = document.getElementById('blockchain-container');
    
    if (!container) {
        console.error('Blockchain container not found');
        return;
    }
    
    const blocksHTML = blockchain.map(block => renderBlock(block)).join('');
    container.innerHTML = blocksHTML;
}

/**
 * Initialize and render blockchain
 */
async function init() {
    try {
        console.log('🔧 Building blockchain...');
        const blockchain = await buildBlockchain();
        console.log('✅ Blockchain built successfully:', blockchain);
        
        renderBlockchain(blockchain);
        console.log('✅ Blockchain rendered');
    } catch (error) {
        console.error('❌ Error building blockchain:', error);
        const container = document.getElementById('blockchain-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; color: #ef4444;">
                    <h2>Eroare la încărcarea blockchain-ului</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential testing/debugging
export { buildBlockchain, calculateBlockHash, sha256 };
