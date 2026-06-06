(function() {

    "use strict";

    // ==========================
    // BLOQUEAR MENU CONTEXTUAL
    // ==========================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // ==========================
    // BLOQUEAR TECLAS
    // ==========================
    document.addEventListener('keydown', function(e) {

        const key = e.key.toUpperCase();

        // Ctrl+U
        if (e.ctrlKey && key === 'U') {
            e.preventDefault();
        }

        // Ctrl+S
        if (e.ctrlKey && key === 'S') {
            e.preventDefault();
        }

        // Ctrl+P
        if (e.ctrlKey && key === 'P') {
            e.preventDefault();
        }

        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && key === 'I') {
            e.preventDefault();
        }

        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && key === 'J') {
            e.preventDefault();
        }

        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && key === 'C') {
            e.preventDefault();
        }

        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
        }
    });

})();