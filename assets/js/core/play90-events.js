/* ==========================================================
   Play 90 Event System
   Desenvolvido por Web5xCSS3 Developer (W53)

   Central de eventos da aplicação.
========================================================== */

(function (window) {

    'use strict';

    const PREFIX = "play90";

    const Events = {

        emit(event, detail = {}) {

            document.dispatchEvent(

                new CustomEvent(

                    `${PREFIX}:${event}`,

                    {
                        detail
                    }

                )

            );

        },

        on(event, callback) {

            document.addEventListener(

                `${PREFIX}:${event}`,

                callback

            );

        },

        off(event, callback) {

            document.removeEventListener(

                `${PREFIX}:${event}`,

                callback

            );

        }

    };

    window.Play90Events = Events;

})(window);
