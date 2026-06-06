(function($) {

    "use strict";

    // ==================
    // ALL MUSICS
    // ==================
    let musicsData = [];
    let musicsVisible = 0;
    const musicsPerLoad = 11;

    window.renderMusics = function() {

        const $container = $('#allMusics');

        if (!$container.length) return;

        const $titleElement = $('#musicsTitle');

        if ($titleElement.length) {
            $titleElement.text('Músicas');
        }

        musicsData = (window.currentData?.featured || [])
            .filter(music =>
                String(music.format || '').toLowerCase() === 'music' ||
                String(music.type || '').toLowerCase() === 'music' ||
                String(music.type || '').toLowerCase() === 'musics'
            )
            .sort((a, b) => (b.id || 0) - (a.id || 0));

        musicsVisible = 0;

        if (!musicsData.length) {
            $container.html(`
                <p class="icon solid fa-record-vinyl empty-message">
                    Nenhuma música encontrada.
                </p>
            `);
            return;
        }

        $container.empty();

        loadMoreMusics();
    };

    // ==================
    // LOAD MORE MUSICS
    // ==================
    window.loadMoreMusics = function() {

        const $container = $('#allMusics');

        if (!$container.length) return;

        $('.loadmore-musics-card').remove();

        const nextItems = musicsData.slice(
            musicsVisible,
            musicsVisible + musicsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(music => {

            const id = music.id || '';
            const title = escapeHtml(music.title || 'Sem título');
            const artist = escapeHtml(music.artist || 'Desconhecido');
            const image = music.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg';

            return `
                <div class="album-card"
                     data-id="${id}"
                     data-type="${music.type || 'featured'}">

                    <article class="box post">
                        <div class="content">

                            <div class="image fit md-ripples ripples-light"
                                 data-position="center">

                                <img src="${image}"
                                     alt="${title} - ${artist}"
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
                            <h3 class="album-artist">${artist}</h3>
                            <p class="album-title">${title}</p>
                        </header>
                    </article>
                </div>
            `;
        }).join('');

        $container.append(html);

        musicsVisible += musicsPerLoad;

        renderLoadMoreMusicsCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allMusics', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-musics-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // ==================
    // LOAD MORE CARD
    // ==================
    function renderLoadMoreMusicsCard() {

        const $container = $('#allMusics');

        $('#loadMoreMusics')
            .closest('.align-center')
            .remove();

        $('.loadmore-musics-card').remove();

        if (musicsVisible >= musicsData.length) return;

        $container.append(`
            <div class="album-card loadmore-musics-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreMusics"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Músicas</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ==================
    // EVENTS
    // ==================
    $(document)
        .off('click.musicsLoadMore', '#loadMoreMusics')
        .on('click.musicsLoadMore', '#loadMoreMusics', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreMusics();
        });

})(jQuery);