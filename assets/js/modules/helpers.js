(function() {

    "use strict";

    window.normalize = function(str) {
        return String(str || '')
            .toLowerCase()
            .trim();
    };

    window.escapeHtml = function(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    window.getUniqueItems = function(items = []) {

        const seen = new Set();

        return items.filter(item => {

            if (!item) return false;

            const key = [
                item.id,
                item.type,
                normalize(item.artist),
                normalize(item.title || item.name)
            ].join('|');

            if (seen.has(key)) return false;

            seen.add(key);

            return true;
        });
    };

    window.shuffleArray = function(array = []) {

        const arr = [...array];

        for (let i = arr.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    };

    window.CDN_BASE =
        'https://cdn.jsdelivr.net/gh/web5xcss3/play90music-v2@main';

    window.APP_VERSION =
        window.APP_VERSION || '1.0.3';

    window.resolveAsset = function(path) {

        if (!path) return '';

        if (path.startsWith('http')) return path;

        return `${window.CDN_BASE}/${path}?v=${window.APP_VERSION}`;
    };

    window.loadScriptOnce = function(id, src, callback) {

        if (document.getElementById(id)) {
            if (typeof callback === 'function') callback();
            return;
        }

        const script = document.createElement('script');

        script.id = id;
        script.src = window.resolveAsset(src);
        script.async = false;

        console.log('Carregando script dinâmico:', script.src);

        script.onload = function() {
            console.log('Script dinâmico carregado:', script.src);

            if (typeof callback === 'function') callback();
        };

        script.onerror = function() {
            console.error('Erro ao carregar script:', script.src);
        };

        document.body.appendChild(script);
    };

})();
