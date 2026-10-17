/**
 * jQuery fillColor Plugin Enhanced
 * Author original: bashkos
 * Enhanced by ChatGPT for Hil_w53
 *
 * Modes:
 * - avg
 * - avgYUV
 * - gradient
 *
 * Extras:
 * - opacity
 * - shadow
 * - CSS variables: --r --g --b
 *
 * Version: 1.0.3-enhanced
 */

(function($) {

    'use strict';

    var getColor = {

        avg: function(imageData) {

            var rgb = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                count = 0,
                step = Math.ceil(imageData.data.length / 40000) * 4;

            for (var i = 0; i < imageData.data.length; i += step) {

                if (
                    imageData.data[i] !== 255 ||
                    imageData.data[i + 1] !== 255 ||
                    imageData.data[i + 2] !== 255
                ) {
                    rgb.r += imageData.data[i];
                    rgb.g += imageData.data[i + 1];
                    rgb.b += imageData.data[i + 2];

                    count++;
                }
            }

            if (!count) {
                return {
                    r: 20,
                    g: 20,
                    b: 20
                };
            }

            rgb.r = Math.round(rgb.r / count);
            rgb.g = Math.round(rgb.g / count);
            rgb.b = Math.round(rgb.b / count);

            return rgb;
        },

        avgYUV: function(imageData) {

            var rgb = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                yuv = {
                    y: 0,
                    u: 0,
                    v: 0
                },
                count = 0,
                step = Math.ceil(imageData.data.length / 40000) * 4,

                sigma = function(x) {
                    return x / (Math.abs(x) + 0.4);
                };

            for (var i = 0; i < imageData.data.length; i += step) {

                if (
                    imageData.data[i] !== 255 ||
                    imageData.data[i + 1] !== 255 ||
                    imageData.data[i + 2] !== 255
                ) {
                    rgb.r = imageData.data[i] / 255;
                    rgb.g = imageData.data[i + 1] / 255;
                    rgb.b = imageData.data[i + 2] / 255;

                    yuv.y += 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                    yuv.u += -0.147 * rgb.r - 0.289 * rgb.g + 0.436 * rgb.b;
                    yuv.v += 0.615 * rgb.r - 0.515 * rgb.g - 0.100 * rgb.b;

                    count++;
                }
            }

            if (!count) {
                return {
                    r: 20,
                    g: 20,
                    b: 20
                };
            }

            yuv.y = sigma(yuv.y / count);
            yuv.u = sigma(yuv.u / count);
            yuv.v = sigma(yuv.v / count);

            rgb.r = yuv.y + 1.3983 * yuv.v;
            rgb.g = yuv.y - 0.3946 * yuv.u - 0.58060 * yuv.v;
            rgb.b = yuv.y + 2.0321 * yuv.u;

            rgb.r = Math.max(0, Math.min(255, Math.round(rgb.r * 255)));
            rgb.g = Math.max(0, Math.min(255, Math.round(rgb.g * 255)));
            rgb.b = Math.max(0, Math.min(255, Math.round(rgb.b * 255)));

            return rgb;
        },

        gradient: function(imageData) {

            var left = {
                    r: 0,
                    g: 0,
                    b: 0,
                    count: 0
                },
                right = {
                    r: 0,
                    g: 0,
                    b: 0,
                    count: 0
                },
                data = imageData.data,
                width = imageData.width,
                height = imageData.height,
                step = 8;

            for (var y = 0; y < height; y += step) {

                for (var x = 0; x < width; x += step) {

                    var index = (y * width + x) * 4,
                        r = data[index],
                        g = data[index + 1],
                        b = data[index + 2];

                    // ignora branco puro
                    if (r === 255 && g === 255 && b === 255) {
                        continue;
                    }

                    if (x < width / 2) {
                        left.r += r;
                        left.g += g;
                        left.b += b;
                        left.count++;
                    } else {
                        right.r += r;
                        right.g += g;
                        right.b += b;
                        right.count++;
                    }
                }
            }

            if (!left.count) {
                left = {
                    r: 20,
                    g: 20,
                    b: 20,
                    count: 1
                };
            }

            if (!right.count) {
                right = {
                    r: 60,
                    g: 60,
                    b: 60,
                    count: 1
                };
            }

            left.r = Math.round(left.r / left.count);
            left.g = Math.round(left.g / left.count);
            left.b = Math.round(left.b / left.count);

            right.r = Math.round(right.r / right.count);
            right.g = Math.round(right.g / right.count);
            right.b = Math.round(right.b / right.count);

            return {
                start: left,
                end: right
            };
        },
		
		gradientYUV: function(imageData) {

			var color = getColor.avgYUV(imageData);

			return {
				start: {
					r: color.r,
					g: color.g,
					b: color.b
				},
				end: {
					r: Math.max(0, color.r - 70),
					g: Math.max(0, color.g - 70),
					b: Math.max(0, color.b - 70)
				}
			};
		}
    };

    $.fn.fillColor = function(options) {

        var $body = $('body'),
            settings = $.extend({
                type: 'avg',
                opacity: 0.65,
                shadow: false,
                shadowOpacity: 0.35,
                gradientOpacityEnd: 0.18,
                angle: 135
            }, options);

        return this.each(function() {

            var $fillRect = $(this),
                $image = $('img', $fillRect).eq(0),
                $shadowImage = $('<img/>');

            if (!$image.length || !$image.attr('src')) {
                return;
            }

            $shadowImage
                .attr('crossOrigin', 'anonymous')
                .css({
                    position: 'absolute',
                    left: '-99999px',
                    top: '-99999px',
                    width: 'auto',
                    height: 'auto',
                    opacity: 0,
                    pointerEvents: 'none'
                })
                .on('load cached', function() {

                    var w = this.naturalWidth || $shadowImage.width(),
                        h = this.naturalHeight || $shadowImage.height();

                    if (w > 0 && h > 0) {

                        var canvas = document.createElement('canvas'),
                            context = canvas.getContext('2d'),
                            imageData,
                            rgb;

                        canvas.width = w;
                        canvas.height = h;

                        context.fillStyle = 'rgb(255, 255, 255)';
                        context.fillRect(0, 0, w, h);
                        context.drawImage($shadowImage[0], 0, 0, w, h);

                        $shadowImage.remove();

                        try {

                            imageData = context.getImageData(0, 0, w, h);

                            if (!getColor[settings.type]) {
                                settings.type = 'avg';
                            }

                            rgb = getColor[settings.type](imageData);

							if (
								settings.type === 'gradient' ||
								settings.type === 'gradientYUV'
							) {
								
								$fillRect.css({
									'--r': rgb.start.r,
									'--g': rgb.start.g,
									'--b': rgb.start.b,
									'--r2': rgb.end.r,
									'--g2': rgb.end.g,
									'--b2': rgb.end.b,
									'background': 'linear-gradient(' +
										settings.angle + 'deg, ' +
										'rgba(' + rgb.start.r + ',' + rgb.start.g + ',' + rgb.start.b + ',' + settings.opacity + '), ' +
										'rgba(' + rgb.end.r + ',' + rgb.end.g + ',' + rgb.end.b + ',' + settings.gradientOpacityEnd + ')' +
									')'
								});
								
								if (settings.shadow) {
									$fillRect.css(
										'box-shadow',
										'0 0 25px rgba(' + rgb.start.r + ',' + rgb.start.g + ',' + rgb.start.b + ',' + settings.shadowOpacity + ')'
									);
								}
								
							} else {

                                $fillRect.css({
                                    '--r': rgb.r,
                                    '--g': rgb.g,
                                    '--b': rgb.b,
                                    'background-color': 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + settings.opacity + ')'
                                });

                                if (settings.shadow) {
                                    $fillRect.css(
                                        'box-shadow',
                                        '0 0 25px rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + settings.shadowOpacity + ')'
                                    );
                                }
                            }

                        } catch (e) {
                            if (window.console) {
                                console.error(e.message + ' (jQuery.fillColor)');
                            }
                        }

                    } else {
                        $shadowImage.remove();
                    }
                })
                .on('abort error', function() {
                    $shadowImage.remove();
                })
                .attr('src', $image.attr('src'));

            $body.append($shadowImage);

            // ajuda quando a imagem já está em cache
            if ($shadowImage[0].complete) {
                $shadowImage.trigger('cached');
            }
        });
    };

})(jQuery);


/*
=====================================================
COMO USAR O FILLCOLOR ENHANCED
=====================================================

1) Cor média normal:

$('.album-card').fillColor({
    type: 'avg'
});


2) Cor média mais viva:

$('.album-card').fillColor({
    type: 'avgYUV',
    opacity: 0.6
});


3) Gradiente automático pela capa:

$('.album-card').fillColor({
    type: 'gradient',
    opacity: 0.70,
    gradientOpacityEnd: 0.18
});

4) Gradiente control:
$('.fillcolor').fillColor({
    type: 'gradient',
    opacity: 0.65,
    gradientOpacityEnd: 0.18,
    angle: 135
});

5) Gradiente com Cor média mais viva:
$('.fillcolor').fillColor({
    type: 'gradientYUV',
    opacity: 0.99,
    gradientOpacityEnd: 0.2,
    angle: 180
});

6) Gradiente com box-shadow direto pelo plugin:

$('.album-card').fillColor({
    type: 'gradient',
    opacity: 0.70,
    shadow: true,
    shadowOpacity: 0.35
});


7) Box-shadow no hover usando variáveis CSS:

.album-card {
    transition: .3s ease;
}

.album-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 10px 30px rgba(0,0,0,.35),
        0 0 25px rgba(var(--r),var(--g),var(--b),.45),
        0 0 60px rgba(var(--r),var(--g),var(--b),.20);
}


8) Para cards carregados dinamicamente:

function initFillColor() {
    $('.album-card, .daily-hero-card, .player-card').fillColor({
        type: 'gradient',
        opacity: 0.65,
        shadow: false
    });
}

initFillColor();

Depois de usar .load(), AJAX, Slick refresh ou renderização dinâmica,
chame novamente:

initFillColor();


9) IMPORTANTE

O plugin precisa encontrar uma imagem dentro do card:

<div class="album-card">
    <img src="capa.jpg" alt="">
</div>

Se a imagem vier de outro domínio, ela precisa permitir CORS.
Com imagens sem CORS, o canvas pode bloquear getImageData().
*/
