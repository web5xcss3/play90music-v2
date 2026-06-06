(function($) {

    "use strict";

    let vinylsData = [];
    let vinylsVisible = 0;
    const vinylsPerLoad = 11;

    window.renderAllVinyls = function() {

        const $container = $('#allVinyls');
        if (!$container.length) return;

        $('#vinylsTitle').text('Vinyl, 12"');

        vinylsData = [
            ...(window.currentData?.featured || []).filter(item =>
                item.format?.toLowerCase().includes('vinyl')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        vinylsVisible = 0;

        $container.empty();

        loadMoreVinyls();
    };

    window.loadMoreVinyls = function() {

        const $container = $('#allVinyls');
        if (!$container.length) return;

        $('.loadmore-vinyls-card').remove();

        const nextItems = vinylsData.slice(
            vinylsVisible,
            vinylsVisible + vinylsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(album => `
            <div class="album-card"
                 data-id="${album.id || ''}"
                 data-type="${album.type || 'featured'}">

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
                        <h3 class="album-artist">
                            ${escapeHtml(album.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(album.title || '')}
                        </p>
                    </header>

                </article>
            </div>
        `).join('');

        $container.append(html);

        vinylsVisible += vinylsPerLoad;

        renderLoadMoreVinylsCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allVinyls', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-vinyls-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    function renderLoadMoreVinylsCard() {

        const $container = $('#allVinyls');

        $('#loadMoreVinyls')
            .closest('.align-center')
            .remove();

        $('.loadmore-vinyls-card').remove();

        if (vinylsVisible >= vinylsData.length) return;

        $container.append(`
            <div class="album-card loadmore-vinyls-card">
                <article class="box post loadmore-post">

                    <button id="loadMoreVinyls"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Vinyls</small>

                    </button>

                </article>
            </div>
        `);
    }

    $(document)
        .off('click.vinylsLoadMore', '#loadMoreVinyls')
        .on('click.vinylsLoadMore', '#loadMoreVinyls', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreVinyls();
        });

})(jQuery);