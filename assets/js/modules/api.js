(function() {

    "use strict";

    window.API = 'https://eurodance-api.onrender.com';

    window.buildCurrentData = function(allData = []) {

        return {
            featured: allData,

            albums: allData.filter(item =>
                item.type === 'albums'
            ),

            singles: allData.filter(item =>
                item.type === 'singles'
            ),

            vinyls: allData.filter(item =>
                item.type === 'vinyls'
            ),

            instrumental: allData.filter(item =>
                item.type === 'instrumental'
            ),

            djs: allData.filter(item =>
                item.type === 'djs'
            ),

            musics: allData.filter(item =>
                item.type === 'musics' || item.type === 'music'
            ),

            playlists: allData.filter(item =>
                item.type === 'playlists'
            )
        };

    };

    window.loadPlay90Data = async function() {

        const [featured, publicItems, labels, genres] = await Promise.all([
            fetch(`${API}/mock`).then(res => res.json()),
            fetch(`${API}/items`).then(res => res.json()),
            fetch(`${API}/labels`).then(res => res.json()),
            fetch(`${API}/genres`).then(res => res.json())
        ]);

        const allData = getUniqueItems([
            ...(publicItems || []),
            ...(featured || [])
        ]);

        return {
            allData,
            labels,
            genres
        };

    };

})();
