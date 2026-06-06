(function($) {

    "use strict";

    // =====================
    // ALL PLAYLISTS
    // =====================
    let playlistsData = [];
    let playlistsVisible = 0;
    const playlistsPerLoad = 11;

    window.renderAllPlaylists = function() {

        const $container = $('#allPlaylists');

        if (!$container.length) return;

        const $titleElement = $('#playlistsTitle');

        if ($titleElement.length) {
            $titleElement.text('Playlists');
        }

        playlistsData = [
            ...(window.currentData?.featured || []).filter(item =>
                item.format?.toLowerCase().includes('playlist')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        playlistsVisible = 0;

        if (!playlistsData.length) {
            $container.html(`
                <p class="icon solid fa-record-vinyl empty-message">
                    Nenhuma playlist encontrada.
                </p>
            `);
            return;
        }

        $container.empty();

        loadMorePlaylists();
    };

    // =====================
    // LOAD MORE PLAYLISTS
    // =====================
    window.loadMorePlaylists = function() {

        const $container = $('#allPlaylists');

        if (!$container.length) return;

        $('.loadmore-playlists-card').remove();

        const nextItems = playlistsData.slice(
            playlistsVisible,
            playlistsVisible + playlistsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(playlist => `
            <div class="album-card"
                 data-id="${playlist.id || ''}"
                 data-type="${playlist.type || 'featured'}">

                <article class="box post">
                    <div class="content">

                        <div class="image fit md-ripples ripples-light"
                             data-position="center">

                            <img src="${playlist.image || ''}"
                                 alt="${escapeHtml(playlist.title || '')}"
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
                        <h3 class="album-artist">
                            ${escapeHtml(playlist.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(playlist.title || '')}
                        </p>
                    </header>
                </article>
            </div>
        `).join('');

        $container.append(html);

        playlistsVisible += playlistsPerLoad;

        renderLoadMorePlaylistsCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allPlaylists', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-playlists-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // =====================
    // LOAD MORE CARD
    // =====================
    function renderLoadMorePlaylistsCard() {

        const $container = $('#allPlaylists');

        $('#loadMorePlaylists')
            .closest('.align-center')
            .remove();

        $('.loadmore-playlists-card').remove();

        if (playlistsVisible >= playlistsData.length) return;

        $container.append(`
            <div class="album-card loadmore-playlists-card">
                <article class="box post loadmore-post">
                    <button id="loadMorePlaylists"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Playlists</small>

                    </button>
                </article>
            </div>
        `);
    }

    // =====================
    // EVENTS
    // =====================
    $(document)
        .off('click.playlistsLoadMore', '#loadMorePlaylists')
        .on('click.playlistsLoadMore', '#loadMorePlaylists', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMorePlaylists();
        });

})(jQuery);