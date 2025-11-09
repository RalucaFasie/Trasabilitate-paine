// app-static.js - Alternative: Load blockchain from pregenerated static JSON
// Încarcă blockchain din fișierul JSON generat de CI (opțiunea 2)

/**
 * Load blockchain data from static JSON file
 * @returns {Promise<Object>} - Blockchain data with metadata
 */
async function loadBlockchainData() {
    try {
        const response = await fetch('./data/blocks.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading blockchain data:', error);
        throw error;
    }
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
 * Initialize and render blockchain from static data
 */
async function init() {
    try {
        console.log('📥 Loading blockchain from static JSON...');
        const data = await loadBlockchainData();
        console.log('✅ Blockchain loaded:', data.metadata);
        
        renderBlockchain(data.blockchain);
        console.log('✅ Blockchain rendered');
        
        // Display metadata
        console.log('📊 Metadata:', {
            generatedAt: data.metadata.generatedAt,
            totalBlocks: data.metadata.totalBlocks,
            version: data.metadata.version
        });
        
    } catch (error) {
        console.error('❌ Error loading blockchain:', error);
        const container = document.getElementById('blockchain-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; color: #ef4444;">
                    <h2>Eroare la încărcarea blockchain-ului</h2>
                    <p>${error.message}</p>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #6b7280;">
                        Asigură-te că fișierul data/blocks.json există și este accesibil.
                    </p>
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

export { loadBlockchainData };
