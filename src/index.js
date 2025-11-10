// Trasabilitate-paine - Entry point
console.log('Trasabilitate-paine application started');

// Application initialization
function init() {
  console.log('Initializing application...');
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
