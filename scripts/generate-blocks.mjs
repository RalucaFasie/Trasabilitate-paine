#!/usr/bin/env node
/**
 * generate-blocks.mjs - Generează date blockchain statice cu hash-uri precalculate
 *
 * Acest script rulează în GitHub Actions și generează docs/data/blocks.json
 * cu toate hash-urile calculate, astfel încât site-ul să nu mai calculeze
 * hash-urile în browser (opțiunea 2 din requirements).
 *
 * Usage: node scripts/generate-blocks.mjs
 */

import { createHash } from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function sha256(message) {
    return createHash('sha256').update(message).digest('hex');
}

function calculateBlockHash(block, previousHash) {
    const dataString = JSON.stringify({
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: previousHash
    });
    
    return sha256(dataString);
}

function buildBlockchain() {
    const blockchain = [];
    let previousHash = '0'.repeat(64);
    
    for (const blockData of blockchainData) {
        const blockHash = calculateBlockHash(blockData, previousHash);
        
        blockchain.push({
            ...blockData,
            previousHash: previousHash,
            hash: blockHash
        });
        
        previousHash = blockHash;
    }
    
    return blockchain;
}

function main() {
    console.log('🔧 Generating blockchain data...');
    
    try {
        const blockchain = buildBlockchain();
        console.log(`✅ Generated ${blockchain.length} blocks`);
        
        const outputDir = join(__dirname, '..', 'docs', 'data');
        mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Created directory: ${outputDir}`);
        
        const outputFile = join(outputDir, 'blocks.json');
        const jsonOutput = JSON.stringify({
            blockchain: blockchain,
            metadata: {
                generatedAt: new Date().toISOString(),
                totalBlocks: blockchain.length,
                version: '1.0.0'
            }
        }, null, 2);
        
        writeFileSync(outputFile, jsonOutput, 'utf8');
        console.log(`✅ Blockchain data saved to: ${outputFile}`);
        
        console.log('\n📊 Blockchain Summary:');
        blockchain.forEach(block => {
            console.log(`  Block #${block.index}: ${block.title}`);
            console.log(`    Hash: ${block.hash.substring(0, 16)}...`);
        });
        
        console.log('\n✨ Done! Blockchain data generated successfully.');
        
    } catch (error) {
        console.error('❌ Error generating blockchain:', error);
        process.exit(1);
    }
}

main();
