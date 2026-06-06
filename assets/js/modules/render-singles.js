(function($) {

    "use strict";

    // ===================
    // ALL SINGLES
    // ===================
    let singlesData = [];
    let singlesVisible = 0;
    const singlesPerLoad = 11;

    window.renderAllSingles = function() {

        const $container = $('#allSingles');

        if (!$container.length) return;

        $('#singlesTitle').text('CD, Maxi-Single');

        singlesData = [
            ...(window.currentData?.featured || []).filter(item =>
                item.format?.toLowerCase().includes('single')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        singlesVisible = 0;

        $container.empty();

        loadMoreSingles();
    };

    // ===================
    // LOAD MORE SINGLES
    // ===================
    window.loadMoreSingles = function() {

        const $container = $('#allSingles');

        if (!$container.length) return;

        $('.loadmore-singles-card').remove();

        const nextItems = singlesData.slice(
            singlesVisible,
            singlesVisible + singlesPerLoad
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

        singlesVisible += singlesPerLoad;

        renderLoadMoreSinglesCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allSingles', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-singles-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // ===================
    // LOAD MORE CARD
    // ===================
    function renderLoadMoreSinglesCard() {

        const $container = $('#allSingles');

        $('#loadMoreSingles')
            .closest('.align-center')
            .remove();

        $('.loadmore-singles-card').remove();

        if (singlesVisible >= singlesData.length) return;

        $container.append(`
            <div class="album-card loadmore-singles-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreSingles"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Singles</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ===================
    // EVENTS
    // ===================
    $(document)
        .off('click.singlesLoadMore', '#loadMoreSingles')
        .on('click.singlesLoadMore', '#loadMoreSingles', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreSingles();
        });

})(jQuery);