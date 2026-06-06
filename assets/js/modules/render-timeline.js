(function($) {

    "use strict";

    // ==========================
    // YEAR ALBUMS STATE
    // ==========================
    let yearAlbumsData = [];
    let yearAlbumsVisible = 0;
    const yearAlbumsPerLoad = 11;

    // ====================
    // RENDER TIMELINE
    // ====================
    window.renderTimeline = function() {

        const $container = $('#allTimeline');

        if (!$container.length) return;

        const $titleElement = $('#timelineTitle');

        if ($titleElement.length) {
            $titleElement.text('Linha do Tempo');
        }

        const $descElement = $('#timelineTitleDesc');

        if ($descElement.length) {
            $descElement.text('A história da música eletrônica no tempo');
        }

        const allAlbums = getUniqueItems([
            ...(window.currentData?.albums || []),
            ...(window.currentData?.singles || []),
            ...(window.currentData?.vinyls || []),
            ...(window.currentData?.featured || [])
        ]);

        const albumsByYear = allAlbums.reduce((acc, album) => {

            if (!album || !album.year) return acc;

            const yearStr = album.year.toString();

            if (!acc[yearStr]) {
                acc[yearStr] = {
                    name: yearStr,
                    albumCount: 0
                };
            }

            acc[yearStr].albumCount++;

            return acc;

        }, {});

        const timelineYears = Object.values(albumsByYear)
            .sort((a, b) =>
                parseInt(b.name, 10) - parseInt(a.name, 10)
            );

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(timelineYears.map(year => `
            <div class="timeline-card md-ripples ripples-light"
                 data-year="${escapeHtml(year.name)}">

                <h3>${escapeHtml(year.name)}</h3>
                <p>${year.albumCount} álbuns</p>
            </div>
        `).join(''));

        $container
            .find('.timeline-card')
            .off('click')
            .on('click', function() {

                const year = $(this).data('year');

                renderAlbumsByYear(year);
            });

        $container.slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            speed: 300,

            appendArrows: $('#timeline-slick-arrow'),

            nextArrow: `
                <ul class="icons">
                    <li>
                        <button type="button"
                                class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                    </li>
                </ul>
            `,

            prevArrow: `
                <ul class="icons">
                    <li>
                        <button type="button"
                                class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                    </li>
                </ul>
            `,

            responsive: [{
				breakpoint: 1280, settings: { slidesToShow: 6 } }, {
				breakpoint: 980, settings: { slidesToShow: 4 } }, {
				breakpoint: 736, settings: { slidesToShow: 3 } }, {
				breakpoint: 480, settings: { slidesToShow: 2 } }
            ]
        });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allTimeline', {
                autoFirstImage: false
            });
        }
    };

    // ====================
    // RENDER ALBUMS BY YEAR
    // ====================
    window.renderAlbumsByYear = function(year) {

        const allAlbums = getUniqueItems([
            ...(window.currentData?.albums || []),
            ...(window.currentData?.singles || []),
            ...(window.currentData?.vinyls || []),
            ...(window.currentData?.featured || [])
        ]).sort((a, b) => (b.id || 0) - (a.id || 0));

        yearAlbumsData = allAlbums.filter(album =>
            album &&
            album.year &&
            album.year.toString() === year.toString()
        );

        yearAlbumsVisible = 0;

        const $container = $('#yearAlbumsList');
        const $title = $('#yearAlbumsTitle');

        if (!$container.length || !$title.length) return;

        if (typeof updatePageTitle === 'function') {
            updatePageTitle(year, 'genre');
        }

        $title.html(`
            Álbuns de
            <span class="artist-year">
                ${escapeHtml(year)}
            </span>
        `);

        $container.empty();

        loadMoreYearAlbums();

        switchTab('yearAlbums');
    };

    // ====================
    // LOAD MORE YEAR ALBUMS
    // ====================
    window.loadMoreYearAlbums = function() {

        const $container = $('#yearAlbumsList');

        if (!$container.length) return;

        $('.loadmore-yearalbums-card').remove();

        const nextItems = yearAlbumsData.slice(
            yearAlbumsVisible,
            yearAlbumsVisible + yearAlbumsPerLoad
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
                            <h3 class="album-artist">
                                ${escapeHtml(album.artist || '')}
                            </h3>

                            <p class="album-title">
                                ${escapeHtml(album.title || '')}
                            </p>
                        </header>
                    </article>
                </div>
            `;
        }).join('');

        $container.append(html);

        yearAlbumsVisible += yearAlbumsPerLoad;

        renderLoadMoreYearAlbumsCard();

        $container
            .find('.album-card')
            .not('.loadmore-yearalbums-card')
            .off('click')
            .on('click', function(e) {

                e.preventDefault();

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('yearAlbumsList', {
                autoFirstImage: false
            });
        }
    };

    // ====================
    // LOAD MORE CARD
    // ====================
    function renderLoadMoreYearAlbumsCard() {

        const $container = $('#yearAlbumsList');

        $('#loadMoreYearAlbums')
            .closest('.align-center')
            .remove();

        $('.loadmore-yearalbums-card').remove();

        if (yearAlbumsVisible >= yearAlbumsData.length) return;

        $container.append(`
            <div class="album-card loadmore-yearalbums-card">
                <article class="box post loadmore-post">
                    <button id="loadMoreYearAlbums"
                            type="button"
                            class="loadmore-card-button md-ripples ripples-light">

                        <span class="loadmore-plus">
                            <i class="icon solid fa-plus"></i>
                        </span>

                        <strong>Adicionar mais</strong>
                        <small>Álbuns</small>

                    </button>
                </article>
            </div>
        `);
    }

    // ====================
    // EVENTS
    // ====================
    $(document)
        .off('click.yearAlbumsLoadMore', '#loadMoreYearAlbums')
        .on('click.yearAlbumsLoadMore', '#loadMoreYearAlbums', function(e) {

            e.preventDefault();
            e.stopPropagation();

            loadMoreYearAlbums();
        });

})(jQuery);