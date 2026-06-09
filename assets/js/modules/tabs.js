(function($) {

    "use strict";

    window.switchTab = function(tabName) {

        if (!tabName) return;

        $('[data-tab]').removeClass('active');
        $('[data-tab="' + tabName + '"]').addClass('active');

        $('.tab-content').removeClass('active');

        const $activeTab = $('#' + tabName).addClass('active');

        if (typeof updatePageTitle === 'function') {
            updatePageTitle(tabName, 'genre');
        }

        setTimeout(function() {

            if ($.fn.slick) {
                $activeTab
                    .find('.slick-initialized')
                    .slick('setPosition');
            }

            if (typeof hydrateUI === 'function') {
                hydrateUI();
            }

        }, 80);
    };

    window.initTabEvents = function() {

        // NAV TABS
        $(document)
            .off('click', '[data-tab]')
            .on('click', '[data-tab]', function(event) {
                event.preventDefault();

                const tab = $(this).data('tab');

                if (tab) {
                    switchTab(tab);
                }
            });

        // BOTÕES VOLTAR
        $(document)
            .off('click', `
                #backToArtistsBtn,
                #backToTimelineBtn,
                #backToTimelineFromGenres,
                #backToLabelsBtn,
                #backToHomeFromLabels,
                #backToMusicsBtn,
                #backToPlaylistsBtn,
                #backToAlbunsBtn,
                #backToSingleBtn,
                #backToVinylBtn,
                #backToDjsBtn,
                #backToInstrumentaisBtn,
                #backToVideos
            `)
            .on('click', `
                #backToArtistsBtn,
                #backToTimelineBtn,
                #backToTimelineFromGenres,
                #backToLabelsBtn,
                #backToHomeFromLabels,
                #backToMusicsBtn,
                #backToPlaylistsBtn,
                #backToAlbunsBtn,
                #backToSingleBtn,
                #backToVinylBtn,
                #backToDjsBtn,
                #backToInstrumentaisBtn,
                #backToVideos
            `, function(e) {
                e.preventDefault();

                let tab = $(this).data('tab');

                if (!tab) {
                    if (
                        this.id === 'backToTimelineBtn' ||
                        this.id === 'backToTimelineFromGenres'
                    ) {
                        tab = 'timeline';
                    } else if (this.id === 'backToLabelsBtn') {
                        tab = 'labels';
                    } else {
                        tab = 'artists';
                    }
                }

                switchTab(tab);
            });
        
    };

})(jQuery);
