(function($) {

    "use strict";

    // ==========================
    // GENRES ALBUMS STATE
    // ==========================
    let genresAlbumsData = [];
    let genresAlbumsVisible = 0;
    const genresAlbumsPerLoad = 11;

    // ==================
    // RENDER ALL GENRES
    // ==================
    window.renderAllGenres = function() {

        const $container = $('#AllGenres');

        if (!$container.length) return;

        const $titleElement = $('#genresTitle');

        if ($titleElement.length) {
            $titleElement.text('Gêneros');
        }

        const featured = window.currentData?.featured || [];

        const getStyles = function(styleString) {
            return String(styleString || '')
                .split(',')
                .map(style => normalize(style))
                .filter(Boolean);
        };

        let usedStyles = [];

        featured.forEach(item => {
            if (!item || !item.style) return;

            usedStyles.push(
                ...getStyles(item.style)
            );
        });

        usedStyles = [...new Set(usedStyles)];

        const validGenres = (window.mockGenres || [])
            .filter(genre =>
                usedStyles.includes(
                    normalize(genre.name)
                )
            );

        if (!validGenres.length) {
            $container.html('<p>Nenhum gênero encontrado.</p>');
            return;
        }

        const sortedGenres = validGenres
            .slice()
            .sort((a, b) => (b.id || 0) - (a.id || 0));

        $container.html(sortedGenres.map(genre => {

            const image = typeof resolveAsset === 'function' ?
                resolveAsset(genre.image || 'assets/images/music-default.webp') :
                (genre.image || 'assets/images/music-default.webp');

            return `
            <div class="genre-card md-ripples ripples-light"
                 data-genre="${escapeHtml(genre.name)}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${image}"alt="${escapeHtml(genre.name)}"loading="lazy">
                        </div>
                    </div>

                    <header class="align-center">
                        <h3>${escapeHtml(genre.name)}</h3>
                    </header>
                </article>
            </div>
        `;
        }).join(''));

        $container
            .find('.genre-card')
            .off('click')
            .on('click', function() {

                const genreName = $(this).data('genre');

                renderAlbumsByStyle(genreName);
            });
    };

    // ==================
    // RENDER BY STYLE
    // ==================
    window.renderAlbumsByStyle = function(styleName) {

        const allAlbums = getUniqueItems([
            ...(window.currentData?.albums || []),
            ...(window.currentData?.singles || []),
            ...(window.currentData?.vinyls || []),
            ...(window.currentData?.featured || [])
        ]).sort((a, b) => (b.id || 0) - (a.id || 0));

        const getStyles = function(styleString) {
            return String(styleString || '')
                .split(',')
                .map(style => normalize(style))
                .filter(Boolean);
        };

        genresAlbumsData = allAlbums.filter(album => {

            if (!album || !album.style) return false;

            return getStyles(album.style)
                .includes(
                    normalize(styleName)
                );
        });

        genresAlbumsVisible = 0;

        const $container = $('#genresAlbumsList');
        const $title = $('#genresAlbumsTitle');

        if (!$container.length || !$title.length) return;

        $title.html(`
            Gênero:
            <span class="artist-year">
                ${escapeHtml(styleName)}
            </span>
        `);

        if (!genresAlbumsData.length) {
            $container.html('<p>Nenhum álbum encontrado.</p>');
            switchTab('genresAlbums');
            return;
        }

        $container.empty();

        loadMoreGenresAlbums();

        switchTab('genresAlbums');
    };

    // ==================
    // LOAD MORE
    // ==================
    window.loadMoreGenresAlbums = function() {

        const $container = $('#genresAlbumsList');

        if (!$container.length) return;

        $('.loadmore-genres-card').remove();

        const nextItems = genresAlbumsData.slice(
            genresAlbumsVisible,
            genresAlbumsVisible + genresAlbumsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(album => {

            let albumType = album.type || 'albums';

            if ((window.currentData?.singles || []).find(s => s.id === album.id)) {
                albumType = 'singles';
            } else if ((window.currentData?.vinyls || []).find(v => v.id === album.id)) {
                albumType = 'vinyls';
            } else if ((window.currentData?.featured || []).find(f => f.id === album.id)) {
                albumType = album.type || 'featured';
            }

            return `
                <div class="album-card"
                     data-id="${album.id}"
                     data-type="${albumType}">

                    <article class="box post">
                        <div class="content">

                            <div class="image fit md-ripples ripples-light"
                                 data-position="center">

                                <img src="${album.image || ''}"
                                     alt="${escapeHtml(album.title || '')}"
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
                            <h3>${escapeHtml(album.artist || '')}</h3>
                            <p>${escapeHtml(album.title || '')}</p>
                        </header>
                    </article>
                </div>
            `;
        }).join('');

        $container.append(html);

        genresAlbumsVisible += genresAlbumsPerLoad;

        renderLoadMoreGenresCard();

        $container
            .find('.album-card')
            .not('.loadmore-genres-card')
            .off('click')
            .on('click', function(e) {

                e.preventDefault();

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('genresAlbumsList', {
                autoFirstImage: false
            });
        }
    };

    // ==================
    // LOAD MORE CARD
    // ==================
    function renderLoadMoreGenresCard() {

        const $container = $('#genresAlbumsList');

        $('#loadMoreGenresAlbums')
            .closest('.align-center')
            .remove();

        $('.loadmore-genres-card').remove();

        if (genresAlbumsVisible >= genresAlbumsData.length) return;

        $container.append(`
            <div class="album-card loadmore-genres-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreGenresAlbums"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Gêneros</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ==================
    // EVENTS
    // ==================
    $(document)
        .off('click.genresLoadMore', '#loadMoreGenresAlbums')
        .on('click.genresLoadMore', '#loadMoreGenresAlbums', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreGenresAlbums();
        });

})(jQuery);
