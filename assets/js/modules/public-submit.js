(function($) {

    "use strict";

    window.initPublicSubmitForm = function() {

        const $form = $('#publicSubmitForm');

        if (!$form.length) return;

        $form.off('submit').on('submit', async function(e) {

            e.preventDefault();

            const $status = $('#publicStatus');

            $status.text('Enviando álbum para aprovação...');

            const formData = new FormData(this);

            try {
                const response = await fetch(
                    'https://eurodance-api.onrender.com/public/submit-item',
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                const text = await response.text();

                let data;

                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('Resposta pública não JSON:', text);
                    throw new Error('A API retornou HTML/texto.');
                }

                if (!response.ok) {
                    throw new Error(data.error || 'Erro ao enviar álbum.');
                }

                $status.text('✅ Álbum enviado! Aguarde aprovação.');

                this.reset();

                $('#publicArtistImagePreview, #publicAlbumImagePreview')
                    .attr('src', '')
                    .removeClass('active');

            } catch (error) {
                console.error(error);
                $status.text('❌ Erro: ' + error.message);
            }
        });

        $('#publicArtistImage').off('change').on('change', function() {
            previewPublicImage(this, '#publicArtistImagePreview');
        });

        $('#publicImage').off('change').on('change', function() {
            previewPublicImage(this, '#publicAlbumImagePreview');
        });
    };

    function previewPublicImage(input, previewSelector) {

        const file = input.files && input.files[0];

        if (!file) {
            $(previewSelector)
                .attr('src', '')
                .removeClass('active');

            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            $(previewSelector)
                .attr('src', e.target.result)
                .addClass('active');
        };

        reader.readAsDataURL(file);
    }

})(jQuery);