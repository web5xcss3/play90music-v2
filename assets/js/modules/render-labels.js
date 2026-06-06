(function($) {

    "use strict";

    // ==========
    // ALL LABELS
    // ==========
    let allLabelsData = [];
    let labelsVisible = 0;
    const labelsPerLoad = 11;

    // ==================
    // RENDER ALL LABELS
    // ==================
    window.renderAllLabels = function() {

        const $container = $('#labelsList');

        if (!$container.length) return;

        const $titleElement = $('#labelsTitle');

        if ($titleElement.length) {
            $titleElement.text('Labels / Selos');
        }

        if (!window.mockLabels || !window.mockLabels.length) {
            $container.html('<p>Nenhuma label disponível.</p>');
            return;
        }

        allLabelsData = window.mockLabels
            .slice()
            .sort((a, b) => (b.id || 0) - (a.id || 0));

        labelsVisible = 0;

        $container.empty();

        loadMoreLabels();
    };

    // ==================
    // LOAD MORE LABELS
    // ==================
    window.loadMoreLabels = function() {

        const $container = $('#labelsList');

        if (!$container.length) return;

        $('.loadmore-labels-card').remove();

        const nextItems = allLabelsData.slice(
            labelsVisible,
            labelsVisible + labelsPerLoad
        );

        if (!nextItems.length) return;

        const html = nextItems.map(label => `
            <div class="label-card"
                 data-label="${escapeHtml(label.name)}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit circles md-ripples ripples-light"
                             data-position="center">

                            <img src="${label.image || ''}"
                                 alt="${escapeHtml(label.name)}"
                                 loading="lazy">

                        </div>
                    </div>

                    <header class="align-center">
                        <h3>${escapeHtml(label.name)}</h3>
                        <p>${escapeHtml(label.country || '')}</p>
                    </header>
                </article>
            </div>
        `).join('');

        $container.append(html);

        labelsVisible += labelsPerLoad;

        renderLoadMoreLabelsCard();

        $container
            .find('.label-card')
            .not('.loadmore-labels-card')
            .off('click')
            .on('click', function() {

                const labelName = $(this).data('label');

                renderLabelDetails(labelName);

                switchTab('labelDetails');
            });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('labelsList', {
                autoFirstImage: false
            });
        }
    };

    // ==================
    // LOAD MORE CARD
    // ==================
    function renderLoadMoreLabelsCard() {

        const $container = $('#labelsList');

        $('#loadMoreLabels')
            .closest('.align-center')
            .remove();

        $('.loadmore-labels-card').remove();

        if (labelsVisible >= allLabelsData.length) return;

        $container.append(`
            <div class="album-card label-card loadmore-labels-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreLabels"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Labels</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ==================
    // LABEL DETAILS
    // ==================
    window.renderLabelDetails = function(labelName) {

        if (typeof updatePageTitle === 'function') {
            updatePageTitle(labelName, 'label');
        }

        const $title = $('#labelTitle');
        const $container = $('#labelArtistsList');

        if (!$container.length || !$title.length) return;

        $title.html(`
            Selos de
            <span class="artist-labels">
                ${escapeHtml(labelName)}
            </span>
        `);

        const items = (window.currentData?.featured || [])
            .filter(item =>
                (item.label || '').toLowerCase() ===
                String(labelName || '').toLowerCase()
            );

        if (!items.length) {
            $container.html(`
                <p class="no-artists-found icon solid fa-record-vinyl">
                    Nenhum álbum encontrado.
                </p>
            `);
            return;
        }

        $container.html(items.map(item => `
            <div class="album-card"
                 data-id="${item.id}"
                 data-type="${item.type || 'featured'}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light"
                             data-position="center">

                            <img src="${item.image || ''}"
                                 alt="${escapeHtml(item.title || '')}"
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
                        <h3>${escapeHtml(item.artist || '')}</h3>
                        <p>${escapeHtml(item.title || '')}</p>
                    </header>
                </article>
            </div>
        `).join(''));

        $container
            .find('.album-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // ==================
    // EVENTS
    // ==================
    $(document)
        .off('click.labelsLoadMore', '#loadMoreLabels')
        .on('click.labelsLoadMore', '#loadMoreLabels', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreLabels();
        });

})(jQuery);