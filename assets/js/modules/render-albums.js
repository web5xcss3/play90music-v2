(function($) {

    "use strict";

    // ==================
    // ALL ALBUMS
    // ==================
    let albumsData = [];
    let albumsVisible = 0;
    const albumsPerLoad = 11;

    window.renderAllAlbums = function() {

        const $container = $('#allAlbums');

        if (!$container.length) return;

        $('#albumsTitle').text('Álbuns');

        albumsData = [
            ...(currentData.featured || []).filter(item =>
                item.format?.toLowerCase().includes('album')
            )
        ].sort((a, b) => (b.id || 0) - (a.id || 0));

        albumsVisible = 0;

        $container.empty();

        loadMoreAlbums();
    };

    // ==================
    // LOAD MORE ALBUMS
    // ==================
    window.loadMoreAlbums = function() {

        const $container = $('#allAlbums');

        if (!$container.length) return;

        $('.loadmore-card').remove();

        const nextItems = albumsData.slice(
            albumsVisible,
            albumsVisible + albumsPerLoad
        );

        const html = nextItems.map(album => `
            <div class="album-card"
                 data-id="${album.id || ''}"
                 data-type="featured">

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

        albumsVisible += albumsPerLoad;

        if (albumsVisible < albumsData.length) {

            $container.append(`
                <div class="album-card loadmore-card">
                    <article class="box post loadmore-post">
                        <button id="loadMoreAlbums"
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

            $('#loadMoreAlbums')
                .off('click')
                .on('click', function() {
                    loadMoreAlbums();
                });
        }

        if (typeof setupBannerFillColorEvents === 'function') {
            setupBannerFillColorEvents('allAlbums', {
                autoFirstImage: false
            });
        }

        $container
            .find('.album-card')
            .not('.loadmore-card')
            .off('click')
            .on('click', function() {

                const id = parseInt($(this).data('id'), 10);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

    // ====================
    // HOME FEATURED ALBUMS
    // ====================
    window.renderFeaturedAlbums = function() {

        const $container = $('#featuredAlbums');

        if (!$container.length) return;

        const $titleElement = $('#featuredTitle');

        if ($titleElement.length) {
            $titleElement.text('Featured álbuns');
        }

        const $banner = $('.filtered');

        let bannerTimeout;

        const featuredAlbums = (currentData.featured || [])
            .slice()
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .slice(0, 20);

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        $container.html(featuredAlbums.map(item => `
            <div class="album-card"
                 data-id="${item.id || ''}"
                 data-type="featured">

                <article class="box post">
                    <div class="content">

                        <div class="stack1"></div>
                        <div class="stack2"></div>

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
                        <h3 class="album-artist">
                            ${escapeHtml(item.artist || '')}
                        </h3>

                        <p class="album-title">
                            ${escapeHtml(item.title || '')}
                        </p>
                    </header>
                </article>
            </div>
        `).join(''));

        function updateBannerFromImage(imgUrl) {

            if (!imgUrl || !$banner.length) return;

            clearTimeout(bannerTimeout);

            bannerTimeout = setTimeout(() => {

                if ($banner.data('current') === imgUrl) return;

                $banner.data('current', imgUrl);

                $banner.html(`
                    <img src="${imgUrl}" alt="Banner Image">
                `);

                const img = new Image();

                img.onload = function() {
                    if ($.fn.fillColor) {
                        $banner.fillColor({
                            type: 'avgYUV'
                        });
                    }
                };

                img.src = imgUrl;

            }, 80);
        }

        function updateBannerFromSlide($slide) {

            const imgUrl = $slide
                .find('img')
                .attr('src');

            updateBannerFromImage(imgUrl);
        }

        $container
            .off('init.featuredBanner')
            .off('afterChange.featuredBanner')
            .on('init.featuredBanner', function(event, slick) {

                const $firstSlide = slick.$slides.eq(0);

                updateBannerFromSlide($firstSlide);
            })
            .slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                speed: 300,

                appendArrows: $('#new-slick-arrow'),

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
					breakpoint: 1280, settings: { slidesToShow: 3 } }, {
					breakpoint: 980, settings: { slidesToShow: 2 } }, {
					breakpoint: 736, settings: { slidesToShow: 2 } }, {
					breakpoint: 480, settings: { slidesToShow: 1 } }
                ]
            })
            .on('afterChange.featuredBanner', function(event, slick, currentSlide) {

                const $current = slick.$slides.eq(currentSlide);

                updateBannerFromSlide($current);
            });

        $container
            .off('click.featuredPlayer')
            .on('click.featuredPlayer', '.album-card:not(.slick-cloned)', function() {

                const id = parseInt($(this).data('id'), 10);

                const imgUrl = $(this)
                    .find('img')
                    .attr('src');

                updateBannerFromImage(imgUrl);

                if (!isNaN(id)) {
                    openPlayer(id);
                }
            });
    };

})(jQuery);