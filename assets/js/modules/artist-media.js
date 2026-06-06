(function($) {

    "use strict";
	
	// ==============================
    // ARTIST MIDIA
    // ==============================
    let currentArtistPage = '';

    window.setCurrentArtistPage = function(artist) {
        currentArtistPage = artist || '';
    };

    function getArtistItems(artist) {
        return getUniqueItems([
            ...(window.currentData?.albums || []),
            ...(window.currentData?.singles || []),
            ...(window.currentData?.vinyls || []),
            ...(window.currentData?.instrumental || []),
            ...(window.currentData?.djs || []),
            ...(window.currentData?.musics || []),
            ...(window.currentData?.playlists || []),
            ...(window.currentData?.featured || [])
        ])
        .filter(item =>
            normalize(item.artist) === normalize(artist)
        )
        .sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    window.renderArtistMusic = function(artist) {
        renderSubAlbumsByArtist(artist);
    };

    window.renderArtistVideos = function(artist) {

        const $container = $('#suballAlbums');
        const $title = $('#subalbumsTitle');

        if (!$container.length) return;

        $title.html(`Vídeos de <span class="artist-name">${escapeHtml(artist)}</span>`);

        $container.html('<p>Carregando vídeos...</p>');

        fetch(`${API}/youtube?q=${encodeURIComponent(artist + ' eurodance')}`)
            .then(res => res.json())
            .then(data => {

                if (!data.items || !data.items.length) {
                    $container.html('<p>Nenhum vídeo encontrado.</p>');
                    return;
                }

                $container.html(data.items.map(video => {

                    const videoId = video.id.videoId;
                    const title = video.snippet.title;
                    const thumb = video.snippet.thumbnails.medium.url;

                    return `
                    <div class="video-card"
                         data-video-id="${videoId}"
                         data-title="${escapeHtml(title)}"
                         data-thumb="${thumb}"
                         data-artist="${escapeHtml(artist)}">

                        <article class="box post">
                            <div class="content">
                                <div class="image fit md-ripples ripples-light">
                                    <img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">
                                </div>

                                <ul class="icons">
                                    <li>
                                        <button type="button" class="icon solid fa-video"></button>
                                    </li>
                                </ul>
                            </div>

                            <header class="align-left">
                                <h3 class="album-title">${escapeHtml(title)}</h3>
                            </header>
                        </article>
                    </div>
                `;
                }).join(''));
            })
            .catch(() => {
                $container.html('<p>Erro ao carregar vídeos.</p>');
            });
    };

    window.renderArtistLyrics = function(artist) {

        const $container = $('#suballAlbums');
        const $title = $('#subalbumsTitle');

        if (!$container.length) return;

        const items = getArtistItems(artist);

        $title.html(`Lyrics de <span class="artist-name">${escapeHtml(artist)}</span>`);

        if (!items.length) {
            $container.html('<p>Nenhuma música encontrada.</p>');
            return;
        }

        $container.html(items.map(item => `
        <div class="lyrics-track"
             data-artist="${escapeHtml(item.artist || artist)}"
             data-title="${escapeHtml(item.title || item.name || '')}">

            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li>
                            <button type="button" class="icon solid fa-align-left"></button>
                        </li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-title">${escapeHtml(item.title || item.name || '')}</h3>
                    <p class="album-artist">${escapeHtml(item.artist || artist)}</p>
                </header>
            </article>
        </div>
    `).join(''));
    };

    window.loadLyrics = async function(artist, title) {

        const $container = $('#suballAlbums');
        const $heading = $('#subalbumsTitle');

        if (!$container.length) return;

        $heading.html(`
        Lyrics:
        <span class="artist-name">${escapeHtml(artist)}</span>
    `);

        $container.html('<p>Carregando letra...</p>');

        try {
            const response = await fetch(
                `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
            );

            const data = await response.json();

            if (!data.lyrics) {
                $container.html(`
                <p>Letra não encontrada para <strong>${escapeHtml(title)}</strong>.</p>
                <button type="button" id="backToArtistLyrics" class="button small">Voltar para letras</button>
            `);
                return;
            }

            $container.html(`
            <article class="lyrics-box">
                <h3>${escapeHtml(title)}</h3>
                <p>${data.lyrics.replace(/\n/g, '<br>')}</p>

                <button type="button" id="backToArtistLyrics" class="button small">Voltar para letras</button>
            </article>
        `);

        } catch (error) {
            console.error('Erro Lyrics.ovh:', error);
            $container.html('<p>Erro ao carregar letra.</p>');
        }
    };

    $(document)
        .off('click.artistMusic', '#playMusic')
        .on('click.artistMusic', '#playMusic', function(e) {
            e.preventDefault();

            const artist = $('#artistName').text();

            setCurrentArtistPage(artist);
            renderArtistMusic(artist);
        });

    $(document)
        .off('click.artistVideos', '#playVideos')
        .on('click.artistVideos', '#playVideos', function(e) {
            e.preventDefault();

            const artist = $('#artistName').text();

            setCurrentArtistPage(artist);
            renderArtistVideos(artist);
        });

    $(document)
        .off('click.artistLyrics', '#playLyrics')
        .on('click.artistLyrics', '#playLyrics', function(e) {
            e.preventDefault();

            const artist = $('#artistName').text();

            setCurrentArtistPage(artist);
            renderArtistLyrics(artist);
        });

    $(document)
        .off('click.lyricsTrack', '.lyrics-track')
        .on('click.lyricsTrack', '.lyrics-track', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const artist = $(this).data('artist');
            const title = $(this).data('title');

            loadLyrics(artist, title);
        });

    $(document)
        .off('click.backToArtistLyrics', '#backToArtistLyrics')
        .on('click.backToArtistLyrics', '#backToArtistLyrics', function(e) {
            e.preventDefault();

            renderArtistLyrics(currentArtistPage || $('#artistName').text());
        });

})(jQuery);