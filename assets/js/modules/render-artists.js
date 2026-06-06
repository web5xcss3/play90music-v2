(function($) {

    "use strict";

    // ===================
    // FUCTION ALL ARTISTS
    // ===================

    // 1:VARIÁVEIS
    let allArtistsData = [];
    let artistsVisible = 0;
    const artistsPerLoad = 17;

    // 2:FUNÇÃO PRINCIPAL (renderAllArtists)
    window.renderAllArtists = function() {

        const $container = $('#allArtists');

        if (!$container.length) return;

        const $titleElement = $('#artistsTitle');

        if ($titleElement.length) {
            $titleElement.text('Artistas');
        }

        const allAlbumsRaw = [
            ...(currentData.albums || []),
            ...(currentData.singles || []),
            ...(currentData.vinyls || []),
            ...(currentData.instrumental || []),
            ...(currentData.djs || []),
            ...(currentData.musics || []),
            ...(currentData.playlists || []),
            ...(currentData.featured || [])
        ];

        // REMOVE DUPLICADOS
        const seen = new Set();

        const allAlbums = allAlbumsRaw.filter(item => {

            if (!item) return false;

            const key = [
                item.id,
                item.type,
                item.artist,
                item.title || item.name
            ].join('|');

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;
        });

        const albumsByArtist = allAlbums.reduce((acc, album) => {

            if (!album || !album.artist) return acc;

            if (!acc[album.artist]) {

                acc[album.artist] = {
                    name: album.artist,
                    albumCount: 0,
                    image: album.artistImage || album.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg',
                    latestId: album.id || 0
                };
            }

            acc[album.artist].albumCount++;

            if ((album.id || 0) > acc[album.artist].latestId) {
                acc[album.artist].latestId = album.id;

                acc[album.artist].image =
                    album.artistImage ||
                    album.image ||
                    acc[album.artist].image;
            }

            return acc;

        }, {});

        // ORDENA PELOS MAIS RECENTES
        allArtistsData = Object.values(albumsByArtist)
            .sort((a, b) => (b.latestId || 0) - (a.latestId || 0));

        artistsVisible = 0;

        $container.empty();

        loadMoreArtists();
    }

    // 3:FUNÇÃO LOAD MORE
    window.loadMoreArtists = function() {

        const $container = $('#allArtists');
        if (!$container.length) return;

        // remove o card antigo antes de adicionar novos artistas
        $('.loadmore-artist-card').remove();

        const nextItems = allArtistsData.slice(
            artistsVisible,
            artistsVisible + artistsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(artist => `
        <div class="artist-card" data-artist="${escapeHtml(artist.name)}">
            <article class="box post avg">
                <div class="content">
                    <div class="image fit md-ripples ripples-light" data-position="center">
                        <img src="${artist.image}" alt="${escapeHtml(artist.name)}" loading="lazy">
                    </div>
                </div>

                <header class="align-center">
                    <h3>${escapeHtml(artist.name)}</h3>
                    <p>${artist.albumCount} Álbuns</p>
                </header>
            </article>
        </div>
    `).join('');

        $container.append(html);

        artistsVisible += artistsPerLoad;

        // adiciona o botão/card no final
        renderLoadMoreArtistCard();

        // eventos
        $container.find('.artist-card')
            .not('.loadmore-artist-card')
            .off('click')
            .on('click', function() {
                const artist = $(this).data('artist');
                renderSubAlbumsByArtist(artist);
            });

        // efeito visual
        $container.find('.avg').fillColor({
            type: 'avg'
        });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allArtists', {
                autoFirstImage: false
            });
        }

    }

    // 4:BOTÃO LOAD MORE COMO CARD
    window.renderLoadMoreArtistCard = function() {

        const $container = $('#allArtists');

        // remove qualquer botão antigo fora do grid
        $('#loadMoreArtists').closest('.align-center').remove();

        // remove card antigo
        $('.loadmore-artist-card').remove();

        if (artistsVisible >= allArtistsData.length) return;

        $container.append(`
        <div class="artist-card loadmore-artist-card">
            <article class="box post loadmore-post">
                <button id="loadMoreArtists"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Artistas</small>

                </button>
            </article>
        </div>
    `);
    }


    // 5:EVENTO DO BOTÃO
    $(document).off('click', '#loadMoreArtists').on('click', '#loadMoreArtists', function(e) {
        e.preventDefault();
        e.stopPropagation();

        loadMoreArtists();
    });

    // =================================================
    // Funções de renderização suballAlbums dos artistas
    // =================================================
    window.renderSubAlbumsByArtist = function(artist) {

        const normalize = str => String(str || '').toLowerCase().trim();

        const allAlbumsRaw = [
            ...(currentData.albums || []),
            ...(currentData.singles || []),
            ...(currentData.vinyls || []),
            ...(currentData.instrumental || []),
            ...(currentData.djs || []),
            ...(currentData.musics || []),
            ...(currentData.playlists || []),
            ...(currentData.featured || [])
        ];

        // REMOVE DUPLICADOS
        const seen = new Set();

        const allAlbums = allAlbumsRaw
            .filter(album => {

                if (!album) return false;

                const key = [
                    album.id,
                    album.type,
                    normalize(album.artist),
                    normalize(album.title || album.name)
                ].join('|');

                if (seen.has(key)) {
                    return false;
                }

                seen.add(key);

                return true;
            })
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .slice(0, 5000);

        const albums = allAlbums.filter(album =>
            album && normalize(album.artist) === normalize(artist)
        );

        const $container = $('#suballAlbums');
        const $title = $('#subalbumsTitle');

        const $artistName = $('#artistName');
        const $artistImage = $('#artistImage');

        if (!$container.length || !$title.length) return;

        $title.html(`Álbuns de <span class="artist-name">${escapeHtml(artist)}</span>`);

        if ($artistName.length) {
            $artistName.text(artist);
        }

        $('#artist-bio').text('Carregando biografia...');

        if (typeof loadArtistBioOnly === 'function') {
            loadArtistBioOnly(artist);
        }

        const firstAlbum = albums[0];

        if ($artistImage.length && firstAlbum) {
            $artistImage.attr(
                'src',
                firstAlbum.artistImage ||
                firstAlbum.image ||
                'https://i.ibb.co/m5Cb336C/music-default.jpg'
            );
        }

        if (!albums.length) {
            $container.html(`
            <div class="no-results">
                <p>Nenhum álbum encontrado para ${escapeHtml(artist)}.</p>
            </div>
        `);

            switchTab('subalbums');
            return;
        }

        $container.html(albums.map(album => {

            const albumType = album.type || 'featured';

            return `
            <div 
                class="album-card md-ripples ripples-light" 
                data-id="${album.id || ''}" 
                data-type="${albumType}"
            >
                <article class="box post">
                    <div class="image fit" data-position="center">
                        <img 
                            src="${album.image || ''}" 
                            alt="${escapeHtml(album.title || album.name || '')}" 
                            loading="lazy">
                    </div>

                    <header class="song-info">
                        <h3 class="album-title">
                            ${escapeHtml(album.title || album.name || '')}
                        </h3>

                        <span class="album-artist">
                            ${escapeHtml(album.artist || '')}
                        </span>
                    </header>
                </article>
            </div>
        `;
        }).join(''));

        $container.off('click').on('click', '.album-card', function(e) {
            e.preventDefault();

            const id = $(this).attr('data-id');

            if (id) {
                openPlayer(parseInt(id, 10));
            }
        });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('suballAlbums', {
                autoFirstImage: false
            });
        }

        switchTab('subalbums');
    }

    // ==========================================
    // BIO
    // ==========================================
    window.loadArtistBioOnly = function(artist) {

        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=4959ac7ccf2055437d47a70303cc0ee0&format=json`;

        fetch(url)
            .then(res => res.json())
            .then(data => {

                const info = data.artist;

                if (!info) {
                    $('#artist-bio').text(`Sem informações para ${artist}`);
                    return;
                }

                let bio = info.bio?.content || info.bio?.summary || '';

                bio = bio
                    .replace(/<a.*?>.*?<\/a>/g, '')
                    .replace(/User-contributed text[\s\S]*$/i, '')
                    .replace(/Read more[\s\S]*$/i, '')
                    .trim();

                if (!bio || bio.length < 20) {
                    bio = `Informações sobre ${artist} não disponíveis no momento.`;
                }

                renderBioReadMore(formatBio(bio));

            })
            .catch(() => {
                $('#artist-bio').text(`Não foi possível carregar a biografia de ${artist}`);
            });
    }

    function formatBio(text) {

        if (!text) return '';

        return text
            .replace(/<a.*?>.*?<\/a>/g, '')
            .replace(/User-contributed text[\s\S]*$/i, '')
            .replace(/Read more[\s\S]*$/i, '')
            .replace(/\n/g, '<br>')
            .trim();
    }

    // ==============================
    // LER MAIS BIO
    // ==============================
    function renderBioReadMore(bio) {

        const limit = 300;
        const isLong = bio.length > limit;
        const shortBio = isLong ? bio.substring(0, limit) + '...' : bio;

        $('#artist-bio').html(`
		<span class="bio-text">${shortBio}</span>

        ${isLong ? `
            <button type="button" class="bio-read-more">
                Ler mais
            </button>
        ` : ''}
    `);

        $('#artist-bio')
            .data('full-bio', bio)
            .data('short-bio', shortBio);
    }

    // ===================================================
    // EVENTO LER MAIS / LER MENOS
    // ===================================================
    $(document).on('click', '.bio-read-more', function() {

        const $btn = $(this);
        const $box = $('#artist-bio');
        const $text = $box.find('.bio-text');

        const fullBio = $box.data('full-bio');
        const shortBio = $box.data('short-bio');

        const opened = $btn.hasClass('opened');

        if (opened) {
            $text.html(shortBio);
            $btn.removeClass('opened').text('Ler mais');
        } else {
            $text.html(fullBio);
            $btn.addClass('opened').text('Ler menos');
        }

    });

})(jQuery);