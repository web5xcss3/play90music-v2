(function($) {

    "use strict";

    // ===============
    // ALL DJS
    // ===============
    let djsData = [];
    let djsVisible = 0;
    const djsPerLoad = 11;

    window.renderAllDjs = function() {

        const $container = $('#allDjs');

        if (!$container.length) return;

        $('#djsTitle').text('Mix de DJs');

        djsData = [
            ...(window.currentData?.featured || []).filter(item =>
                item.format?.toLowerCase().includes('dj')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        djsVisible = 0;

        $container.empty();

        loadMoreDjs();
    };

    // ===============
    // LOAD MORE DJS
    // ===============
    window.loadMoreDjs = function() {

        const $container = $('#allDjs');

        if (!$container.length) return;

        $('.loadmore-djs-card').remove();

        const nextItems = djsData.slice(
            djsVisible,
            djsVisible + djsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(dj => `
            <div class="album-card"
                 data-id="${dj.id || ''}"
                 data-type="${dj.type || 'featured'}">

                <article class="box post">
                    <div class="content">

                        <div class="image fit md-ripples ripples-light"
                             data-position="center">

                            <img src="${dj.image || ''}"
                                 alt="${escapeHtml(dj.title || '')}"
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
                            ${escapeHtml(dj.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(dj.title || '')}
                        </p>
                    </header>
                </article>
            </div>
        `).join('');

        $container.append(html);

        djsVisible += djsPerLoad;

        renderLoadMoreDjsCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allDjs', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-djs-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // ===============
    // LOAD MORE CARD
    // ===============
    function renderLoadMoreDjsCard() {

        const $container = $('#allDjs');

        $('#loadMoreDjs')
            .closest('.align-center')
            .remove();

        $('.loadmore-djs-card').remove();

        if (djsVisible >= djsData.length) return;

        $container.append(`
            <div class="album-card loadmore-djs-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreDjs"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>DJs</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ===============
    // EVENTS
    // ===============
    $(document)
        .off('click.djsLoadMore', '#loadMoreDjs')
        .on('click.djsLoadMore', '#loadMoreDjs', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreDjs();
        });

})(jQuery);