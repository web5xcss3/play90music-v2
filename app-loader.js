(function() {

    "use strict";

    // ===================================
    // VERSION
    // ===================================
    const VERSION = '1.0.12';

    // ===================================
    // CONFIG
    // ===================================
    const CDN_BASE =
        'https://cdn.jsdelivr.net/gh/web5xcss3/play90music-v2@main';

    // ===================================
    // Config
    // ===================================
    window.APP_VERSION = VERSION;
    window.CDN_BASE = CDN_BASE;

    // ===================================
    // CSS
    // ===================================
    const STYLES = [
        `${CDN_BASE}/assets/slick/slick.css`,
        `${CDN_BASE}/assets/css/main.css`
    ];

    // ===================================
    // BASE
    // ===================================
    const BASE = [
        `${CDN_BASE}/assets/js/jquery.min.js`,
        `${CDN_BASE}/assets/js/jquery.scrollgress.min.js`,
        `${CDN_BASE}/assets/js/breakpoints.min.js`,
        `${CDN_BASE}/assets/slick/slick.min.js`,
        `${CDN_BASE}/assets/js/ripples.js`,
        `${CDN_BASE}/assets/js/fillcolor.js`
    ];

    // ===================================
	// ANALYTICS
	// ===================================
	const ANALYTICS = [
		`${CDN_BASE}/assets/js/core/play90-events.js`,
		`${CDN_BASE}/assets/js/modules/analytics.js`
	];

    // ===================================
    // TEMPLATE
    // ===================================
    const TEMPLATE = [
        `${CDN_BASE}/assets/js/main.js`
    ];

    // ===================================
    // CORE
    // ===================================
    const CORE = [
        `${CDN_BASE}/assets/js/modules/helpers.js?v=${VERSION}`,
        `${CDN_BASE}/assets/js/modules/api.js`,
        `${CDN_BASE}/assets/js/modules/ui-effects.js`,
        `${CDN_BASE}/assets/js/modules/tabs.js?v=${VERSION}`,
        `${CDN_BASE}/assets/js/modules/player.js`,
        `${CDN_BASE}/assets/js/modules/recently-played.js`
    ];

    // ===================================
    // RENDERS
    // ===================================
    const RENDERS = [
        `${CDN_BASE}/assets/js/modules/render-artists.js`,
        `${CDN_BASE}/assets/js/modules/artist-media.js`,
        `${CDN_BASE}/assets/js/modules/render-albums.js`,
        `${CDN_BASE}/assets/js/modules/render-labels.js`,
        `${CDN_BASE}/assets/js/modules/render-genres.js?v=${VERSION}`,
        `${CDN_BASE}/assets/js/modules/render-timeline.js`,
        `${CDN_BASE}/assets/js/modules/render-singles.js`,
        `${CDN_BASE}/assets/js/modules/render-vinyls.js`,
        `${CDN_BASE}/assets/js/modules/render-djs.js`,
        `${CDN_BASE}/assets/js/modules/render-instrumental.js`,
        `${CDN_BASE}/assets/js/modules/render-music.js`,
        `${CDN_BASE}/assets/js/modules/render-playlists.js`,
        `${CDN_BASE}/assets/js/modules/render-videos.js`,
        `${CDN_BASE}/assets/js/modules/home-featured.js`
    ];

    // ===================================
    // APP
    // ===================================
    const APP = [
        `${CDN_BASE}/assets/js/app.js`,
        `${CDN_BASE}/assets/js/index.js`
    ];

    // ===================================
    // EXTRAS
    // ===================================
    const EXTRAS = [
        `${CDN_BASE}/assets/js/jquery.fullscreen.min.js`,
        `${CDN_BASE}/assets/js/jquery.fullscreen.init.js`
    ];

    // ===================================
    // LOAD CSS
    // ===================================
    function loadCss(href) {

        return new Promise(resolve => {

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = href;

            link.onload = resolve;

            document.head.appendChild(link);
        });
    }

    // ===================================
    // LOAD JS
    // ===================================
    function loadScript(src) {

        return new Promise((resolve, reject) => {

            const script = document.createElement('script');

            script.src = src;
            script.async = false;

            script.onload = function() {
                console.log('✅', src);
                resolve();
            };

            script.onerror = function() {
                console.error('❌', src);
                reject(src);
            };

            document.body.appendChild(script);
        });
    }

    // ===================================
    // LOAD GROUP
    // ===================================
    async function loadGroup(name, files) {

        console.log(`📦 ${name}`);

        for (const file of files) {
            await loadScript(file);
        }
    }

    // ===================================
    // START
    // ===================================
    async function start() {

        try {

            // CSS
            for (const css of STYLES) {
                await loadCss(css);
            }

            // JS
            await loadGroup('BASE', BASE);
            await loadGroup('TEMPLATE', TEMPLATE);
            await loadGroup('CORE', CORE);
            await loadGroup('ANALYTICS', ANALYTICS);
            await loadGroup('RENDERS', RENDERS);
            await loadGroup('APP', APP);
            await loadGroup('EXTRAS', EXTRAS);

            console.log('🚀 Play90 Music iniciado');

        } catch (error) {

            console.error(
                'Erro ao iniciar Play90 Music:',
                error
            );
        }
    }

    start();

})();
