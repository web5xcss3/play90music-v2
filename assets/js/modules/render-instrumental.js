(function($) {

    "use strict";

    // =========================
    // ALL INSTRUMENTALS
    // =========================
    let instrumentalData = [];
    let instrumentalVisible = 0;
    const instrumentalPerLoad = 11;

    window.renderAllInstrumental = function() {

        const $container = $('#allInstrumentals');

        if (!$container.length) return;

        const $titleElement = $('#instrumentalTitle');

        if ($titleElement.length) {
            $titleElement.text('Instrumentais');
        }

        instrumentalData = [
            ...(window.currentData?.featured || []).filter(item =>
                item.format?.toLowerCase().includes('instrumental')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        instrumentalVisible = 0;

        $container.empty();

        loadMoreInstrumental();
    };

    // =========================
    // LOAD MORE INSTRUMENTAL
    // =========================
    window.loadMoreInstrumental = function() {

        const $container = $('#allInstrumentals');

        if (!$container.length) return;

        $('.loadmore-instrumental-card').remove();

        const nextItems = instrumentalData.slice(
            instrumentalVisible,
            instrumentalVisible + instrumentalPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(inst => `
            <div class="album-card"
                 data-id="${inst.id || ''}"
                 data-type="${inst.type || 'featured'}">

                <article class="box post">
                    <div class="content">

                        <div class="image fit md-ripples ripples-light"
                             data-position="center">

                            <img src="${inst.image || ''}"
                                 alt="${escapeHtml(inst.title || '')}"
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
                            ${escapeHtml(inst.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(inst.title || '')}
                        </p>
                    </header>
                </article>
            </div>
        `).join('');

        $container.append(html);

        instrumentalVisible += instrumentalPerLoad;

        renderLoadMoreInstrumentalCard();

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allInstrumentals', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-instrumental-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // =========================
    // LOAD MORE CARD
    // =========================
    function renderLoadMoreInstrumentalCard() {

        const $container = $('#allInstrumentals');

        $('#loadMoreInstrumental')
            .closest('.align-center')
            .remove();

        $('.loadmore-instrumental-card').remove();

        if (instrumentalVisible >= instrumentalData.length) return;

        $container.append(`
            <div class="album-card loadmore-instrumental-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreInstrumental"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Instrumentais</small>

                    </button>
                </article>
            </div>
        `);
    }

    // =========================
    // EVENTS
    // =========================
    $(document)
        .off('click.instrumentalLoadMore', '#loadMoreInstrumental')
        .on('click.instrumentalLoadMore', '#loadMoreInstrumental', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreInstrumental();
        });

})(jQuery);