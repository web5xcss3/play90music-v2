(function($) {

    "use strict";

    // ==========================
    // HOME DAILY FEATURED TITLES
    // ==========================
    window.renderDailyFeaturedTitles = function() {

        const $container = $('#dailyFeaturedTitles');
        const $titleElement = $('#dailyFeaturedTitle');

        if (!$container.length) return;

        const today = new Date().toISOString().split('T')[0];

        const cacheKey = 'dailyFeaturedTitlesCache_v4';
        const indexKey = 'dailyFeaturedItemIndex_v4';

        const allItemsRaw =
            window.mockFeatured ||
            window.currentData?.featured || [];

        const seen = new Set();

        const allItems = allItemsRaw
            .filter(item => {

                if (!item) return false;

                const key = [
                    item.id,
                    normalize(item.artist),
                    normalize(item.title || item.name),
                    normalize(item.embedUrl)
                ].join('|');

                if (seen.has(key)) return false;

                seen.add(key);

                return true;
            })
            .sort((a, b) => (b.id || 0) - (a.id || 0));

        if (!allItems.length) {
            $container.html('');
            return;
        }

        let selected = [];
        let themeOfDay = '';

        let cachedData =
            JSON.parse(localStorage.getItem(cacheKey)) || {};

        if (cachedData.date !== today) {
            localStorage.removeItem(cacheKey);
            cachedData = {};
        }

        if (cachedData.items?.length) {

            selected = cachedData.items;
            themeOfDay = cachedData.theme || 'Destaques';

        } else {

            let currentIndex =
                parseInt(localStorage.getItem(indexKey), 10) || 0;

            const mainItem =
                allItems[currentIndex % allItems.length];

            themeOfDay =
                mainItem.artist || 'Destaques';

            const artistItems = allItems.filter(item =>
                normalize(item.artist) === normalize(mainItem.artist)
            );

            selected = artistItems.length ?
                artistItems :
                [mainItem];

            localStorage.setItem(
                indexKey,
                (currentIndex + 1) % allItems.length
            );

            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    date: today,
                    theme: themeOfDay,
                    mainId: mainItem.id,
                    items: selected
                })
            );
        }

        if ($titleElement.length) {
            $titleElement.html(
                `Especial do dia • <span class="artist-name">${escapeHtml(themeOfDay)}</span>`
            );
        }

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(selected.map(item => `
        <div class="daily-hero-slide">
            <article class="daily-hero-card avgYUV">

                <div class="daily-hero-content">

                    <span class="daily-badge">DESTAQUE</span>

                    <h2>
                        ${escapeHtml(item.artist || '')}<br>
                        ${escapeHtml(item.title || item.name || '')}
                    </h2>

                    <p>Os clássicos que marcaram uma geração. Reviva agora!</p>

                    <button type="button" class="daily-play md-ripples ripples-light" data-id="${item.id || ''}" data-type="${item.type || 'featured'}">Ouvir agora</button>

                </div>

                <div class="daily-hero-image">
                    <img src="${item.image || ''}"alt="${escapeHtml(item.title || item.name || '')}" loading="lazy">
                </div>

            </article>
        </div>
    `).join(''));

        if ($.fn.fillColor) {
            $container.find('.avgYUV').fillColor({
                type: 'avgYUV'
            });
        }

        $container.slick({
            focusOnSelect: true,
            infinite: selected.length > 1,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 300,

            appendArrows: $('#daily-slick-arrow'),

            nextArrow: `
            <button type="button"
                    class="daily-arrow next icon solid fa-chevron-right md-ripples ripples-light">
            </button>
        `,

            prevArrow: `
            <button type="button"
                    class="daily-arrow prev icon solid fa-chevron-left md-ripples ripples-light">
            </button>
        `
        });

        $container
            .find('.daily-play')
            .off('click')
            .on('click', function() {

                const id = $(this).data('id');

                if (id) {
                    openPlayer(id);
                }
            });
    };

    // ===================
    // TOP ARTISTS HOME
    // ===================
    window.renderTopArtistsHome = function() {

        const $container = $('#topArtistsHome');

        if (!$container.length) return;

        $('#topArtistsHomeTitle')
            .text('Top Artistas');

        const allAlbums = [
            ...(window.currentData?.albums || []),
            ...(window.currentData?.singles || []),
            ...(window.currentData?.vinyls || []),
            ...(window.currentData?.featured || [])
        ];

        const albumsByArtist = {};

        allAlbums.forEach(album => {

            if (!album?.artist) return;

            if (!albumsByArtist[album.artist]) {

                albumsByArtist[album.artist] = {
                    name: album.artist,
                    albumCount: 0,
                    image: album.image ||
                        'https://i.ibb.co/m5Cb336C/music-default.jpg'
                };
            }

            albumsByArtist[album.artist]
                .albumCount++;
        });

        const topArtists =
            Object.values(albumsByArtist)
            .sort((a, b) =>
                b.albumCount - a.albumCount
            )
            .slice(0, 12);

        if (!topArtists.length) {
            $container.html('<p>Nenhum artista encontrado.</p>');
            return;
        }

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(topArtists.map(artist => `
            <div class="top-artist-slide">

                <article class="box post avg top-artist-card"
                         data-artist="${escapeHtml(artist.name)}">

                    <div class="content">

                        <div class="image fit md-ripples ripples-light">

                            <img src="${artist.image}"
                                 alt="${escapeHtml(artist.name)}"
                                 loading="lazy">

                        </div>

                        <ul class="icons">
                            <li>
                                <button type="button"
                                        class="icon solid fa-play"></button>
                            </li>
                        </ul>

                    </div>

                    <header class="align-center">

                        <h3 class="album-artist">
                            ${escapeHtml(artist.name)}
                        </h3>

                        <p class="album-title">
                            ${artist.albumCount} Álbuns
                        </p>

                    </header>

                </article>

            </div>
        `).join(''));

        $container.slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            speed: 300,
            appendArrows: $('#topArtists-slick-arrow'),

            nextArrow: `
                <ul class="icons">
                    <li>
                        <button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                    </li>
                </ul>`,

            prevArrow: `
                <ul class="icons">
                    <li>
                        <button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                    </li>
                </ul>`,

            responsive: [{
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5
                }
            }, {
                breakpoint: 980,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 736,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2
                }
            }]
        });

        if ($.fn.fillColor) {
            $container.find('.avg').fillColor({
                type: 'avg'
            });
        }

        $container
            .find('.top-artist-card')
            .off('click')
            .on('click', function() {

                const artist =
                    $(this).data('artist');

                switchTab('subalbums');

                renderSubAlbumsByArtist(artist);
            });
    };

    // =================
    // HOME FEATURED DJS
    // =================
    window.renderFeaturedDjs = function() {

        const $container = $('#featuredDjs');

        if (!$container.length) return;

        $('#featuredDjsTitle')
            .text('Mix de DJs');

        const featuredDjs =
            (window.currentData?.featured || [])
            .filter(item =>
                (item.format || '')
                .toLowerCase()
                .includes('dj')
            )
            .sort((a, b) =>
                (b.id || 0) - (a.id || 0)
            )
            .slice(0, 12);

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(featuredDjs.map(item => `
            <div class="album-card"
                 data-id="${item.id || ''}">

                <article class="box post">

                    <div class="content">

                        <div class="image fit md-ripples ripples-light">

                            <img src="${item.image || ''}"
                                 alt="${escapeHtml(item.artist || '')}"
                                 loading="lazy">

                        </div>

                        <ul class="icons">
                            <li>
                                <button type="button"
                                        class="icon solid fa-play"></button>
                            </li>
                        </ul>

                    </div>

                    <header class="align-left">

                        <h3 class="playlist-artist">
                            ${escapeHtml(item.artist || '')}
                        </h3>

                        <p class="playlist-title">
                            ${escapeHtml(item.title || '')}
                        </p>

                    </header>

                </article>

            </div>
        `).join(''));

        $container
            .find('.album-card')
            .off('click')
            .on('click', function() {

                const id =
                    parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });

        $container.slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            speed: 300,
            appendArrows: $('#djs-slick-arrow'),
            nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
            prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
            responsive: [{
                breakpoint: 1280,
                settings: {
                    slidesToShow: 6
                }
            }, {
                breakpoint: 980,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 736,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2
                }
            }]
        });
    };

})(jQuery);