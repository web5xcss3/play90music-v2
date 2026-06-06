(function($) {

    "use strict";

    let scrollInitialized = false;

    // =======================================
    // BANNER FILLCOLOR
    // =======================================
    window.setupBannerFillColorEvents = function(sectionId, options = {}) {

        const {
            cardSelector = '.album-card, .artist-card',
            autoFirstImage = false
        } = options;

        const $section = $('#' + sectionId);
        const $banner = $('.filtered');

        if (!$section.length || !$banner.length) return;

        function applyBanner(src) {

            if (!src) return;

            if ($banner.data('current') === src) return;

            $banner.data('current', src);

            $banner.html(`
                <img src="${src}" alt="Banner">
            `);

            const img = new Image();

            img.onload = function() {

                if ($.fn.fillColor) {

                    $banner.fillColor({
                        type: 'avgYUV'
                    });

                }
            };

            img.src = src;
        }

        if (autoFirstImage) {

            const $firstImage = $section
                .find(`${cardSelector}:not(.slick-cloned) img`)
                .first();

            if ($firstImage.length) {
                applyBanner($firstImage.attr('src'));
            }
        }

        $section
            .off('click.bannerFillColor')
            .on(
                'click.bannerFillColor',
                `${cardSelector}:not(.slick-cloned)`,
                function() {

                    const src = $(this)
                        .find('img')
                        .attr('src');

                    applyBanner(src);
                }
            );
    };

    // =======================================
    // GLOBAL PLUGINS
    // =======================================
    window.initPlugins = function() {

        // reservado
    };

    // =======================================
    // SCROLL WATCH
    // =======================================
    window.setupScrollWatch = function() {

        const $banner = $('#banner');
        const $header = $('#header');
        const $menu = $('#menu');

        if (!$banner.length || !$.fn.scrollwatch) return;

        $banner.scrollwatch({

            delay: 0,
            range: 0,
            anchor: 'top',

            on: function() {

                $header.addClass('alt reveal');
                $menu.addClass('alt reveal');
            },

            off: function() {

                $header.removeClass('alt reveal');
                $menu.removeClass('alt reveal');
            }
        });
    };

    // =======================================
    // HYDRATE UI
    // =======================================
    window.hydrateUI = function() {

        initPlugins();

        if (!scrollInitialized) {

            setupScrollWatch();

            scrollInitialized = true;
        }
    };

})(jQuery);