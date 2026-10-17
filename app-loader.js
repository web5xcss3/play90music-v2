(function() {

    "use strict";

    const scripts = [
        // Base
        'assets/js/jquery.scrollgress.min.js',
        'assets/js/breakpoints.min.js',
        'slick/slick.min.js',
        'assets/js/ripples.js',
        'assets/js/fillcolor.js',

        // Template
        'assets/js/main.js',

        // Core modules
        'assets/js/modules/helpers.js',
        'assets/js/modules/api.js',
        'assets/js/modules/ui-effects.js',
        'assets/js/modules/tabs.js',
        'assets/js/modules/player.js',
        'assets/js/modules/recently-played.js',
		
		// Event System + Analytics
		'assets/js/core/play90-events.js',
		'assets/js/modules/analytics.js',

        // Render modules
        'assets/js/modules/render-artists.js',
		'assets/js/modules/artist-media.js',
        'assets/js/modules/render-albums.js',
        'assets/js/modules/render-labels.js',
        'assets/js/modules/render-genres.js',
        'assets/js/modules/render-timeline.js',
        'assets/js/modules/render-singles.js',
        'assets/js/modules/render-vinyls.js',
        'assets/js/modules/render-djs.js',
        'assets/js/modules/render-instrumental.js',
        'assets/js/modules/render-music.js',
        'assets/js/modules/render-playlists.js',
        'assets/js/modules/render-videos.js',
        'assets/js/modules/home-featured.js',

        // App
        'assets/js/app.js',
        'assets/js/index.js',

        // Extras
        'assets/js/jquery.fullscreen.min.js',
        'assets/js/jquery.fullscreen.init.js'
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Erro ao carregar: ' + src));

            document.body.appendChild(script);
        });
    }

    async function loadAllScripts() {
        for (const src of scripts) {
            await loadScript(src);
        }

        console.log('Play90 Music scripts carregados.');
    }

    loadAllScripts();

})(jQuery);
