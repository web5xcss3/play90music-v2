(function($) {

    "use strict";

    // ===================
    // OPEN PLAYER
    // ===================
    window.openPlayer = function(id) {

        const item = (window.currentData?.featured || [])
            .find(x => parseInt(x.id, 10) === parseInt(id, 10));

        if (!item || !item.embedUrl) {
            console.warn('❌ Item não encontrado:', id);
            return;
        }

        if (typeof updatePageTitle === 'function') {
            updatePageTitle(item, 'song');
        }

        console.log('🎵 PLAYER:', item);

        const $embedContainer = $('.player-embed');

        $embedContainer
            .stop(true, true)
            .show()
            .html(`
                <div class="player-loading">
                    <span class="spinner"></span>
                    <p>Carregando...</p>
                </div>
            `);

        const $iframe = $(`
            <iframe
                src="${item.embedUrl}"
                frameborder="0"
                allow="autoplay; encrypted-media; clipboard-write; fullscreen"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                scrolling="no">
            </iframe>
        `);

        $iframe.css({
            opacity: 0,
            width: '100%',
            display: 'block'
        });

        let iframeLoaded = false;

        function showIframe() {

            if (iframeLoaded) return;

            iframeLoaded = true;

            $iframe.css('opacity', 1);

            $embedContainer
                .stop(true, true)
                .html($iframe);
        }

        $iframe.on('load', function() {
            showIframe();
        });

        $embedContainer.append($iframe);

        setTimeout(function() {
            showIframe();
        }, 3500);

        $('#playerImage').attr('src', item.image || '');
        $('#playerTitle').text(item.title || '');
        $('#playerArtist').text(item.artist || '');

        $('#detailArtist').text(item.artist || '');
        $('#detailYear').text(item.year || '');
        $('#detailLabel').text(item.label || '');
        $('#detailCountry').text(item.country || '');
        $('#detailFormat').text(item.format || '');
        $('#detailGenre').text(item.genre || '');
        $('#detailStyle').text(item.style || '');

        openPlayerPanels();

        if (typeof showRelatedAlbums === 'function') {
            showRelatedAlbums(item.artist, id);
        }

        if (typeof saveToRecentlyPlayed === 'function') {
            saveToRecentlyPlayed({
                id: item.id,
                type: item.type || 'featured',
                title: item.title || item.name || '',
                artist: item.artist || '',
                image: item.image || '',
                embedUrl: item.embedUrl || ''
            });
        }
    };

    // ===================
    // OPEN PLAYER PANELS
    // ===================
    window.openPlayerPanels = function() {
        $('#player-bar').addClass('opened active').fadeIn(200);
        $('#player-page').addClass('showmore').fadeIn(200);
        $('#main-panel, #side-panel').fadeIn(200);
    };

    // ===================
    // TOGGLE PLAYER BODY
    // ===================
    window.togglePlayerBody = function() {

        const $playerPage = $('#player-page');
        const $mainPanel = $('#main-panel');
        const $sidePanel = $('#side-panel');
        const $arrow = $('#player-bar .fa-long-arrow-down');

        if (!$playerPage.length) return;

        $playerPage.toggleClass('showmore');

        const isOpen = $playerPage.hasClass('showmore');

        if ($mainPanel.length) {
            $mainPanel.css('display', isOpen ? 'block' : 'none');
        }

        if ($sidePanel.length) {
            $sidePanel.css('display', isOpen ? 'block' : 'none');
        }

        $arrow.toggleClass('rotated', isOpen);
    };

    // ===================
    // PLAYER EVENTS
    // ===================
    window.initPlayerEvents = function() {

        $(document)
            .off('click.playerToggle', '#player-bar .fa-long-arrow-down')
            .on('click.playerToggle', '#player-bar .fa-long-arrow-down', function(e) {
                e.preventDefault();
                togglePlayerBody();
            });

        $(document)
            .off('click.playerAlbumCard', '.album-card')
            .on('click.playerAlbumCard', '.album-card', function() {

                const $playerPage = $('#player-page');
                const $arrow = $('#player-bar .fa-long-arrow-down');

                $playerPage.addClass('showmore');
                $('#main-panel, #side-panel').css('display', 'block');
                $arrow.addClass('rotated');
            });
    };

    // ======================
    // FUCTION RELATED ALBUMS
    // ======================
    function showRelatedAlbums(artist, currentId, currentType = '') {
        const $container = $('#relatedAlbums');
        const $title = $('#relatedArtistName');

        if (!$container.length || !$title.length) return;

        const normalize = text => String(text || '').toLowerCase().trim();

        const allItemsRaw = window.mockFeatured || currentData.featured || [];

        const seen = new Set();

        const allItems = allItemsRaw.filter(item => {
            if (!item) return false;

            const key = [
                normalize(item.artist),
                normalize(item.title || item.name),
                normalize(item.embedUrl)
            ].join('|');

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });

        const artistAlbums = allItems
            .filter(item => normalize(item.artist) === normalize(artist))
            .sort((a, b) => {
                const aCurrent =
                    String(a.id) === String(currentId) &&
                    String(a.type || 'featured') === String(currentType || a.type || 'featured');

                const bCurrent =
                    String(b.id) === String(currentId) &&
                    String(b.type || 'featured') === String(currentType || b.type || 'featured');

                if (aCurrent) return -1;
                if (bCurrent) return 1;

                return String(b.id).localeCompare(String(a.id));
            });

        $title.html(`Mais de <span class="artist-name">${escapeHtml(artist || '')}</span>`);

        if (!artistAlbums.length) {
            $container.html('<p>Nenhum álbum encontrado.</p>');
            return;
        }

        $container.html(artistAlbums.map(album => `
        <div class="album-card ${
            String(album.id) === String(currentId) &&
            String(album.type || 'featured') === String(currentType || album.type || 'featured')
                ? 'current'
                : ''
        }"
             data-id="${album.id}"
             data-type="${album.type || 'featured'}">

            <article class="box post avg md-ripples ripples-light">
                <div class="content">
                    <div class="image fit" data-position="center">
                        <img src="${album.image || ''}" alt="${escapeHtml(album.title || album.name || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li class="alt1">
                            <button type="button" class="icon solid fa-play"></button>
                        </li>
                        <li class="alt2">
                            <button type="button" class="icon wave">
                                <span></span><span></span><span></span>
                            </button>
                        </li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(album.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(album.title || album.name || '')}</p>
                </header>
            </article>
        </div>
    `).join(''));

        $container.find('.avg').fillColor({
            type: 'avg'
        });

        $container.find('.album-card').off('click').on('click', function() {
            const id = $(this).attr('data-id');
            const type = $(this).attr('data-type');

            openPlayer(id, type);
        });
    }

    function toggleRelated(li) {
        const $relatedContainer = $('#relatedContainer');
        if (!$relatedContainer.length) return;

        $relatedContainer.slideToggle(300, () => {
            if ($relatedContainer.is(':visible')) {
                $(li).addClass('active'); // marca como ativo
            } else {
                $(li).removeClass('active'); // remove ativo
            }
        });
    }

    $(document).on("click", ".fa-list", function(e) {
        e.preventDefault();
        toggleRelated(this);
    });

})(jQuery);