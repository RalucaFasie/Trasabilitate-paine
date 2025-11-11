/**
 * Script pentru interfața de navigare a sistemului de trasabilitate pâine
 * Gestionează click-urile pe butoane și verifică existența paginilor țintă
 */

// Așteptăm ca DOM-ul să fie complet încărcat
document.addEventListener('DOMContentLoaded', function() {
    // Selectăm toate butoanele de navigare
    const navigationButtons = document.querySelectorAll('.nav-btn');
    const statusElement = document.getElementById('status');

    // Funcție pentru afișarea mesajelor în elementul status
    function showStatus(message, isError = false) {
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.background = isError 
                ? 'rgba(220, 53, 69, 0.1)' 
                : 'rgba(255, 255, 255, 0.7)';
            statusElement.style.color = isError ? '#a71d2a' : '#6B5644';
            statusElement.style.fontWeight = isError ? '600' : 'normal';
            
            // Curățăm mesajul după 5 secunde
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.style.background = 'rgba(255, 255, 255, 0.7)';
            }, 5000);
        }
    }

    // Funcție pentru verificarea existenței unui fișier
    async function checkFileExists(fileName) {
        try {
            // Încercăm să facem un HEAD request pentru a verifica existența
            // Folosim fetch cu method HEAD pentru eficiență
            const response = await fetch(fileName, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            return response.ok;
        } catch (error) {
            // Dacă HEAD nu funcționează, încercăm cu GET
            try {
                const response = await fetch(fileName, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                return response.ok;
            } catch (getError) {
                console.error('Eroare la verificarea fișierului:', getError);
                return false;
            }
        }
    }

    // Funcție pentru gestionarea click-ului pe buton
    async function handleButtonClick(event) {
        const button = event.currentTarget;
        const targetFile = button.getAttribute('data-target');

        if (!targetFile) {
            showStatus('Eroare: Lipsește atributul data-target pe buton.', true);
            return;
        }

        // Afișăm un mesaj de încărcare
        showStatus(`Verificare pagină: ${targetFile}...`);

        // Adăugăm un efect vizual pe buton
        button.style.opacity = '0.7';

        try {
            // Verificăm dacă fișierul există
            const fileExists = await checkFileExists(targetFile);

            // Restaurăm opacitatea butonului
            button.style.opacity = '1';

            if (fileExists) {
                // Dacă fișierul există, navigăm la el
                showStatus(`Navigare către ${targetFile}...`);
                
                // Mic delay pentru ca utilizatorul să vadă mesajul
                setTimeout(() => {
                    window.location.href = targetFile;
                }, 500);
            } else {
                // Dacă fișierul nu există, afișăm mesaj și alert
                const message = `Pagina "${targetFile}" nu există încă. Va fi disponibilă în curând.`;
                showStatus(message, true);
                
                // Afișăm și un alert pentru utilizator
                alert(`⚠️ Pagină indisponibilă\n\n${message}`);
            }
        } catch (error) {
            // Gestionăm erorile neașteptate
            button.style.opacity = '1';
            const errorMessage = `Eroare la verificarea paginii: ${error.message}`;
            showStatus(errorMessage, true);
            console.error('Eroare:', error);
            alert(`❌ Eroare\n\n${errorMessage}`);
        }
    }

    // Atașăm event listener pentru fiecare buton
    navigationButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
        
        // Adăugăm și suport pentru Enter/Space când butonul are focus
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleButtonClick(event);
            }
        });
    });

    // Mesaj de bun venit în consolă
    console.log('🍞 Interfață de trasabilitate pâine - Script încărcat cu succes');
    console.log(`📍 Butoane de navigare găsite: ${navigationButtons.length}`);
    
    // Afișăm un mesaj de bun venit dacă există elementul status
    if (statusElement && navigationButtons.length > 0) {
        showStatus(`Bine ați venit! Selectați o secțiune pentru a începe.`);
    }
});
