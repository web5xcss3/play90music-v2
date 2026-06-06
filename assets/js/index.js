/*=======================
 PLAY 90 MUSIC - SPA CORE
=========================*/

(function($) {

    "use strict";

    $(function() {

        let currentData = {
            featured: [],
            albums: [],
            singles: [],
            vinyls: [],
            instrumental: [],
            djs: [],
            musics: [],
            playlists: []
        };

        const originalData = {};

        loadPlay90Data()
            .then(({ allData, labels, genres }) => {

                console.log('API carregada:', allData);

                currentData = buildCurrentData(allData);

                window.currentData = currentData;
                window.mockFeatured = allData;
                window.mockLabels = labels;
                window.mockGenres = genres;

                originalData.featured = [...allData];
                originalData.albums = [...currentData.albums];
                originalData.singles = [...currentData.singles];
                originalData.vinyls = [...currentData.vinyls];
                originalData.instrumental = [...currentData.instrumental];
                originalData.djs = [...currentData.djs];
                originalData.musics = [...currentData.musics];
                originalData.playlists = [...currentData.playlists];

                renderAllAlbums();
                renderAllArtists();
                renderAllPlaylists();
                renderTimeline();
                renderMusics();
                renderAllSingles();
                renderAllVinyls();
                renderAllDjs();
                renderAllInstrumental();
                renderAllVideos();
                renderHomeVideos();
                renderFeaturedAlbums();
                renderRecentlyPlayed();
                renderFeaturedDjs();
                renderAllLabels();
                renderDailyFeaturedTitles();
                renderAllGenres();
                renderTopArtistsHome();

                initTabEvents();
                initPlayerEvents();

                if (typeof hydrateUI === 'function') {
                    hydrateUI();
                }

                if (typeof buildSearchIndex === 'function') {
                    buildSearchIndex();
                }

                if (typeof updateStats === 'function') {
                    updateStats();
                }

            })
            .catch(err => {
                console.error('Erro API:', err);
            });

        let searchTimeout;

        // =====
        // STATS
        // =====
        window.updateStats = function() {

            $('#albumCount').text((window.currentData?.albums || []).length);
            $('#artistCount').text((window.currentData?.artists || []).length);
            $('#playlistCount').text((window.currentData?.playlists || []).length);

        };

        // ==============================
        // TRANSIÇÃO VISUAL DOS CARDS
        // ==============================
        $(document).on('click', function(e) {

            const $target = $(e.target).closest(
                '.album-card, .playlist-card, .artist-card, .genre-card'
            );

            if (!$target.length) return;

            $target.css('transform', 'scale(0.98)');

            setTimeout(function() {
                $target.css('transform', '');
            }, 100);

        });

        // ==============================
        // SEARCH HELPERS
        // ==============================
        window.clearSearch = function() {

            if (typeof $searchInput !== 'undefined' && $searchInput.length) {
                $searchInput.val('');

                if (typeof handleSearch === 'function') {
                    handleSearch();
                }
            }

        };

        window.performSearch = function(term) {

            if (typeof $searchInput !== 'undefined' && $searchInput.length) {
                $searchInput.val(term);

                if (typeof handleSearch === 'function') {
                    handleSearch();
                }
            }

        };

        window.debugSearch = function(searchTerm = '') {

            console.log('=== DEBUG SEARCH ===');
            console.log('Search term:', searchTerm);
            console.log('Original data counts:', {
                albums: (originalData.albums || []).length,
                singles: (originalData.singles || []).length,
                vinyls: (originalData.vinyls || []).length,
                instrumental: (originalData.instrumental || []).length,
                djs: (originalData.djs || []).length,
                musics: (originalData.musics || []).length,
                playlists: (originalData.playlists || []).length,
                featured: (originalData.featured || []).length
            });

            console.log('Current data counts:', {
                albums: (window.currentData?.albums || []).length,
                singles: (window.currentData?.singles || []).length,
                vinyls: (window.currentData?.vinyls || []).length,
                instrumental: (window.currentData?.instrumental || []).length,
                djs: (window.currentData?.djs || []).length,
                musics: (window.currentData?.musics || []).length,
                playlists: (window.currentData?.playlists || []).length,
                featured: (window.currentData?.featured || []).length
            });

        };

        // ================================
        // PROGRESS BAR + SPINNER
        // ================================
        if (!$('#progress-bar').length) {
            $('body').prepend('<div id="progress-bar"></div>');
        }

        if (!$('#spinner').length && $('.player-embed').length) {
            $('.player-embed').prepend(`
                <div id="spinner" aria-label="Carregando">
                    <div class="inner">
                        <svg viewBox="0 0 50 50" class="spinner-svg">
                            <circle class="spinner-path"
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    stroke-width="3">
                            </circle>
                        </svg>
                    </div>
                </div>
            `);
        }

        if (!$('#progressSpinnerStyle').length) {
            $('head').append(`
                <style id="progressSpinnerStyle">
                    #progress-bar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 2px;
                        width: 0%;
                        background: #f00;
                        z-index: 100001;
                        opacity: 0;
                    }

                    .player-embed {
                        position: relative;
                        min-height: 300px;
                    }

                    #spinner {
                        position: relative;
                        background: #000;
                        height: 100%;
                        width: 100%;
                        display: none;
                        z-index: 1;
                    }

                    .inner {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 10;
                    }

                    .spinner-svg {
                        width: 48px;
                        height: 48px;
                        animation: rotate 2s linear infinite;
                    }

                    .spinner-path {
                        stroke: #f00;
                        stroke-linecap: round;
                        animation: dash 1.5s ease-in-out infinite;
                    }

                    @keyframes rotate {
                        100% {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes dash {
                        0% {
                            stroke-dasharray: 1, 150;
                            stroke-dashoffset: 0;
                        }

                        50% {
                            stroke-dasharray: 90, 150;
                            stroke-dashoffset: -35;
                        }

                        100% {
                            stroke-dasharray: 90, 150;
                            stroke-dashoffset: -124;
                        }
                    }
                </style>
            `);
        }

        const startProgress = function() {

            $('#progress-bar')
                .stop(true, true)
                .css({
                    width: '0%',
                    opacity: 1,
                    display: 'block'
                })
                .animate({
                    width: '80%'
                }, 500);

        };

        const finishProgress = function() {

            $('#progress-bar')
                .stop(true)
                .animate({
                    width: '100%'
                }, 300, function() {

                    $(this)
                        .delay(100)
                        .fadeOut(400, function() {

                            $(this).css({
                                width: '0%',
                                display: 'none'
                            });

                        });

                });

        };

        startProgress();

        setTimeout(function() {
            finishProgress();
        }, 500);

    });

})(jQuery);