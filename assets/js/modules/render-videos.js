(function($) {

    "use strict";

    // =========
    // YT VIDEOS CACHE
    // =========
    window.loadVideos = function(query = 'eurodance 90s', options = {}) {

        const cacheKey = options.cacheKey || null;
        const cacheDate = options.cacheDate || null;
        const artist = options.artist || '';

        if (cacheKey) {
            const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');

            if (
                cached.date === cacheDate &&
                cached.items &&
                cached.items.length
            ) {
                renderVideos(cached.items);
                return Promise.resolve(cached.items);
            }
        }

        $('#allVideos').html('<p>Carregando vídeos...</p>');

        return fetch(`${API}/youtube?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {

                if (!data.items || !data.items.length) {
                    $('#allVideos').html('<p>Nenhum vídeo encontrado.</p>');
                    return [];
                }

                if (cacheKey) {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            date: cacheDate,
                            artist: artist,
                            query: query,
                            items: data.items
                        })
                    );
                }

                renderVideos(data.items);

                return data.items;
            })
            .catch(err => {
                console.error('Erro YouTube:', err);
                $('#allVideos').html('<p>Erro ao carregar vídeos.</p>');
                return [];
            });
    };

    window.renderVideos = function(items) {

        const $container = $('#allVideos');

        if (!$container.length) return;

        $container.html(items.map(video => {

            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const thumb = video.snippet.thumbnails.medium.url;

            return `
                <div class="video-card"
                     data-video-id="${videoId}"
                     data-title="${escapeHtml(title)}"
                     data-thumb="${thumb}">

                    <article class="box post">
                        <div class="content">
                            <div class="image fit md-ripples ripples-light"
                                 data-position="center">

                                <img src="${thumb}"
                                     alt="${escapeHtml(title)}"
                                     loading="lazy">

                            </div>

                            <ul class="icons">
                                <li class="alt1">
                                    <button type="button"
                                            class="icon solid fa-play"></button>
                                </li>
                            </ul>
                        </div>

                        <header class="align-left">
                            <h3 class="album-title">
                                ${escapeHtml(title)}
                            </h3>
                        </header>
                    </article>
                </div>
            `;
        }).join(''));
    };

    window.openPlayerYoutube = function(
        videoId,
        title,
        thumb,
        artist = 'YouTube'
    ) {

        if (!videoId) return;

        const embedUrl =
            `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;

        $('.player-embed').html(`
            <iframe
                src="${embedUrl}"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>
        `);

        $('#playerImage').attr(
            'src',
            thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        );

        $('#playerTitle').text(title || 'YouTube Video');
        $('#playerArtist').text(artist || 'YouTube');

        $('#detailArtist').text(artist || 'YouTube');
        $('#detailYear').text('');
        $('#detailLabel').text('');
        $('#detailCountry').text('');
        $('#detailFormat').text('Video');
        $('#detailGenre').text('');
        $('#detailStyle').text('');

        openPlayerPanels();

        if (typeof saveToRecentlyPlayed === 'function') {
            saveToRecentlyPlayed({
                id: videoId,
                type: 'youtube',
                title: title || 'YouTube Video',
                artist: artist || 'YouTube',
                image: thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            });
        }

        if (
            artist &&
            artist !== 'YouTube' &&
            typeof showRelatedAlbums === 'function'
        ) {
            showRelatedAlbums(artist, videoId, 'youtube');
        }
    };

    window.getRandomArtist = function() {

        const counts = {};

        (window.mockFeatured || []).forEach(item => {

            if (!item.artist) return;

            counts[item.artist] =
                (counts[item.artist] || 0) + 1;
        });

        const artists = Object.entries(counts)
            .filter(([artist, count]) => count >= 2)
            .map(([artist]) => artist);

        if (!artists.length) return 'eurodance';

        return artists[
            Math.floor(Math.random() * artists.length)
        ];
    };

    window.renderAllVideos = function() {

        const today = new Date().toISOString().split('T')[0];

        const cacheKey = 'allVideosCache_v1';
        const artistKey = 'allVideosArtist_v1';

        let cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');

        let artist = '';

        if (cached.date === today && cached.artist) {
            artist = cached.artist;
        } else {
            artist = getRandomArtist();

            localStorage.setItem(
                artistKey,
                JSON.stringify({
                    date: today,
                    artist: artist
                })
            );
        }

        $('#videosTitle').html(
            `Vídeos de <span class="artist-name">${escapeHtml(artist)}</span>`
        );

        loadVideos(`${artist} eurodance`, {
            cacheKey: cacheKey,
            cacheDate: today,
            artist: artist
        });

        renderVideosArtistAlbums(artist);
    };

    window.renderVideosArtistAlbums = function(artist) {

        const $container = $('#videosArtistAlbums');
        const $title = $('#videosArtistAlbumsTitle');

        if (!$container.length) return;

        const items = (window.mockFeatured || [])
            .filter(item =>
                normalize(item.artist) === normalize(artist)
            );

        if ($title.length) {
            $title.html(
                `Músicas de <span class="artist-name">${escapeHtml(artist)}</span>`
            );
        }

        if (!items.length) {
            $container.html('<p>Nenhuma música encontrada.</p>');
            return;
        }

        $container.html(items.map(item => `
            <div class="album-card"
                 data-id="${item.id}"
                 data-type="${item.type || 'featured'}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light">

                            <img src="${item.image || ''}"
                                 alt="${escapeHtml(item.title || '')}"
                                 loading="lazy">

                        </div>

                        <ul class="icons">
                            <li class="alt1">
                                <button type="button"
                                        class="icon solid fa-play"></button>
                            </li>
                        </ul>
                    </div>

                    <header class="align-left">
                        <h3 class="album-artist">
                            ${escapeHtml(item.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(item.title || '')}
                        </p>
                    </header>
                </article>
            </div>
        `).join(''));

        if ($.fn.fillColor) {
            $container.find('.avg').fillColor({
                type: 'avg'
            });
        }

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('videosArtistAlbums', {
                autoFirstImage: false
            });
        }
    };

    // ===========
    // HOME VIDEOS
    // ===========
    window.renderHomeVideos = function() {

        const today = new Date().toISOString().split('T')[0];

        const cacheKey = 'homeVideosCache_v1';

        const cached = JSON.parse(
            localStorage.getItem(cacheKey) || '{}'
        );

        if (
            cached.date === today &&
            cached.artist &&
            cached.items &&
            cached.items.length
        ) {
            $('#homeVideosTitle').html(
                `Vídeos de <span class="artist-name">${escapeHtml(cached.artist)}</span>`
            );

            renderHomeVideosSlider(cached.items);
            return;
        }

        const artist = getRandomArtist();

        $('#homeVideosTitle').html(
            `Vídeos de <span class="artist-name">${escapeHtml(artist)}</span>`
        );

        loadHomeVideos(`${artist} eurodance`, {
            cacheKey: cacheKey,
            cacheDate: today,
            artist: artist
        });
    };

    window.loadHomeVideos = function(query, options = {}) {

        const cacheKey = options.cacheKey || null;
        const cacheDate = options.cacheDate || null;
        const artist = options.artist || '';

        $('#homeVideos').html('<p>Carregando vídeos...</p>');

        return fetch(`${API}/youtube?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {

                if (!data.items || !data.items.length) {
                    $('#homeVideos').html(
                        '<p>Nenhum vídeo encontrado.</p>'
                    );

                    return [];
                }

                if (cacheKey) {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            date: cacheDate,
                            artist: artist,
                            query: query,
                            items: data.items
                        })
                    );
                }

                renderHomeVideosSlider(data.items);

                return data.items;
            })
            .catch(err => {

                console.error('Erro Home Videos:', err);

                $('#homeVideos').html(
                    '<p>Erro ao carregar vídeos.</p>'
                );

                return [];
            });
    };

    window.renderHomeVideosSlider = function(items) {

        const $container = $('#homeVideos');

        if (!$container.length) return;

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(items.map(video => {

            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const thumb = video.snippet.thumbnails.medium.url;

            return `
                <div class="video-card"
                     data-video-id="${videoId}"
                     data-title="${escapeHtml(title)}"
                     data-thumb="${thumb}">

                    <article class="box post">
                        <div class="content">
                            <div class="image fit md-ripples ripples-light"
                                 data-position="center">

                                <img src="${thumb}"
                                     alt="${escapeHtml(title)}"
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
                            <p class="album-title">
                                ${escapeHtml(title)}
                            </p>
                        </header>
                    </article>
                </div>
            `;
        }).join(''));

        $container.slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            speed: 300,

            appendArrows: $('#homeVideos-slick-arrow'),

            nextArrow: `
                <ul class="icons">
                    <li>
                        <button type="button"
                                class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                    </li>
                </ul>
            `,

            prevArrow: `
                <ul class="icons">
                    <li>
                        <button type="button"
                                class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                    </li>
                </ul>
            `,

            responsive: [{
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4
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

    // ===========
    // EVENTS
    // ===========
    $(document)
        .off('click.videosCard', '.video-card')
        .on('click.videosCard', '.video-card', function(e) {

            e.preventDefault();

            const videoId = $(this).attr('data-video-id');
            const title = $(this).attr('data-title');
            const thumb = $(this).attr('data-thumb');

            const artist =
                $(this).attr('data-artist') ||
                $('#videosTitle .artist-name, #homeVideosTitle .artist-name')
                .first()
                .text() ||
                'YouTube';

            openPlayerYoutube(videoId, title, thumb, artist);
        });

    $(document)
        .off('click.videoArtistAlbums', '#videosArtistAlbums .album-card')
        .on('click.videoArtistAlbums', '#videosArtistAlbums .album-card', function(e) {

            e.preventDefault();

            const id = $(this).attr('data-id');

            openPlayer(id);
        });

})(jQuery);