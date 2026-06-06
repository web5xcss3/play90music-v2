(function($) {

    "use strict";

    // =====================
    // HOME RECENT PLAYED
    // =====================
    window.renderRecentlyPlayed = function() {
        const $container = $('#recentlyPlayed');
        if (!$container.length) return;

        const $titleElement = $('#recentlyPlayedTitle');

        if ($titleElement.length) {
            $titleElement.text('Recently Played');
        }

        const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        const allItems = window.mockFeatured || currentData.featured || [];

        const items = stored.map(entry => {

            // YouTube
            if (entry.type === 'youtube') {
                return {
                    id: entry.id,
                    type: 'youtube',
                    title: entry.title || 'YouTube Video',
                    artist: entry.artist || 'YouTube',
                    image: entry.image || `https://img.youtube.com/vi/${entry.id}/hqdefault.jpg`
                };
            }

            // MockData
            const item = allItems.find(album =>
                String(album.id) === String(entry.id) &&
                String(album.type || 'featured') === String(entry.type || 'featured')
            );

            if (!item) return null;

            return {
                ...item,
                type: item.type || entry.type || 'featured'
            };

        }).filter(Boolean);

        if ($container.hasClass('slick-initialized')) {
            $container.slick('unslick');
        }

        if (!items.length) {
            $container.html('');
            return;
        }

        $container.html(items.map(item => {
            const title = item.title || item.name || 'Sem título';
            const artist = item.artist || 'Vários Artistas';
            const image = item.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg';

            return `
            <div class="album-card"
                 data-id="${item.id}"
                 data-type="${item.type}"
                 data-title="${escapeHtml(title)}"
                 data-artist="${escapeHtml(artist)}"
                 data-image="${image}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>

                        <ul class="icons">
                            <li>
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
                        </ul>
                    </div>

                    <header class="align-left">
                        <h3>${escapeHtml(artist)}</h3>
                        <p>${escapeHtml(title)}</p>
                    </header>
                </article>
            </div>
        `;
        }).join(''));

        $container.slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            speed: 300,
            appendArrows: $('#recentlyPlayed-slick-arrow'),
            nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
            prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 6
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });

        $container.find('.album-card').off('click').on('click', function() {
            const id = $(this).attr('data-id');
            const type = $(this).attr('data-type');
            const title = $(this).attr('data-title');
            const artist = $(this).attr('data-artist');
            const image = $(this).attr('data-image');

            if (type === 'youtube') {
                openPlayerYoutube(id, title, image, artist);
                return;
            }

            openPlayer(id, type);
        });
    }

    window.saveToRecentlyPlayed = function(item) {

        const key = 'recentlyPlayed';

        const stored = JSON.parse(
            localStorage.getItem(key)
        ) || [];

        const id = String(item.id);

        const type = String(
            item.type || 'featured'
        );

        const filtered = stored.filter(entry =>
            !(String(entry.id) === id &&
                String(entry.type || 'featured') === type)
        );

        filtered.unshift({
            id: id,
            type: type,
            title: item.title || '',
            artist: item.artist || '',
            image: item.image || ''
        });

        localStorage.setItem(
            key,
            JSON.stringify(filtered.slice(0, 8))
        );

        renderRecentlyPlayed();
    };

})(jQuery);