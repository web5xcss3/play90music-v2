/* ==========================================================
   Play 90 Music - Analytics Manager
   Desenvolvido por Web5xCSS3 Developer (W53)

   Responsável por:
   ✔ Carregar o Google Analytics
   ✔ Inicializar o GA4
   ✔ Enviar eventos
   ✔ Registrar páginas SPA
   ✔ Permitir futuras integrações (Clarity, Umami...)
========================================================== */

(function (window) {

    'use strict';

    const CONFIG = {

        enabled: true,

        measurementId: 'G-M9599KK88V',

        debug: false

    };

    // Aguarda carregamento do GA
    let ready = false;

    // ----------------------------
    // Carrega o gtag.js
    // ----------------------------

    function loadGoogleAnalytics() {

        return new Promise((resolve) => {

            const script = document.createElement('script');

            script.async = true;

            script.src =
                'https://www.googletagmanager.com/gtag/js?id=' +
                CONFIG.measurementId;

            script.onload = resolve;

            document.head.appendChild(script);

        });

    }

    // ----------------------------
    // Inicializa GA4
    // ----------------------------

    function initialize() {

        window.dataLayer = window.dataLayer || [];

        window.gtag = function () {

            dataLayer.push(arguments);

        };

        gtag('js', new Date());

        gtag('config', CONFIG.measurementId);

        ready = true;

        console.log('[Analytics] GA4 inicializado');

    }

    // ----------------------------
    // Envia eventos
    // ----------------------------

    function send(event, data = {}) {

        if (!CONFIG.enabled) return;

        if (!ready) return;

        if (CONFIG.debug) {

            console.log('[Analytics]', event, data);

        }

        gtag('event', event, data);

    }

    // ----------------------------
    // API pública
    // ----------------------------

    window.Analytics = {

        page(name) {

            send('page_view', {

                page_title: name,

                page_location: location.href,

                page_path: '/' + name.toLowerCase()

            });

        },

        track(event, data = {}) {

            send(event, data);

        },

        album(album) {

            send('album_open', {

                album_id: album.id,

                album_name: album.title

            });

        },

        artist(artist) {

            send('artist_open', {

                artist_id: artist.id,

                artist_name: artist.name

            });

        },

        playlist(playlist) {

            send('playlist_open', {

                playlist_name: playlist.title

            });

        },

        music(track) {

            send('music_play', {

                music_name: track.title,

                artist_name: track.artist

            });

        },

        search(term) {

            send('search', {

                search_term: term

            });

        },

        player(state) {

            send('player_' + state);

        },

        loadMore(section) {

            send('load_more', {

                section

            });

        }

    };

    // ----------------------------
    // Inicialização automática
    // ----------------------------

    loadGoogleAnalytics()

        .then(initialize)

        .catch(console.error);

})(window);