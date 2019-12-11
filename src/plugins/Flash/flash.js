import PNotify from 'pnotify/dist/es/PNotifyCompat';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

const $flashStack = {
    dir1: 'down',
    dir2: 'left',
    push: 'top',
    spacing1: 10
};

export default {

    "install": function (Vue) {
        window.$flash = {
            options: this.options,
            success: this.success,
            warning: this.warning,
            error: this.error
        };
        // Załaduj buttony do flashy
        PNotifyButtons;

        Vue.prototype.$flash = window.$flash;
        // Czas wyświetlania komunikatu
        PNotify.prototype.options.delay = 3000;

    },

    options: {
        mouseReset: true,
        textTrusted: true,
        stack: $flashStack,
        Buttons: {
            closer: true,
            closerHover: true,
            sticker: true,
            stickerHover: true
        }
    },

    success(message,options = {})
    {
        return new PNotify({
            text: message || 'Operacja zakończona sukcesem.',
            addclass: 'alert bg-success alert-styled-right app-flash-messages',
            ...this.options,
            ...options
        });
    },

    warning(message,options = {})
    {
        return new PNotify({
            text: message || 'Operacja zakończona sukcesem.',
            addclass: 'alert bg-warning alert-styled-right app-flash-messages',
            ...this.options,
            ...options
        });
    },

    error(message,options = {})
    {
        return new PNotify({
            text: message || 'Operacja zakończona niepowodzeniem.',
            addclass: 'alert bg-danger alert-styled-right app-flash-messages',
            ...this.options,
            ...options
        });
    }
}