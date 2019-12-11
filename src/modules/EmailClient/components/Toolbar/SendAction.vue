<script>
    import BaseWidget from "./BaseWidget";
    import errorsHelper from "../../utils/errorsHelper";

    export default {
        name: "SendAction",
        extends: BaseWidget,

        props: ['message'],

        methods: {
            handlerFn() {

                let msg = { ...this.message };
                delete msg.content;

                this.$emit('isSending', true);

                this.$store.dispatch('sendMessage', msg)
                .then(() => {
                    this.$emit('isSending', false);
                    this.$store.commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});
                    this.$flash.success('Wiadomość została wysłana');

                })
                .catch((error) => {
                    this.$emit('isSending', false);

                    if (error.response.data.errors) {
                        this.$flash.error('', {
                            title: 'Wiadomość nie została wysłana',
                            text: 'Odpowiedź serwera:<br>'.concat(errorsHelper.parseReasons(error.response.data.errors))}
                        );
                    } else {
                        this.$flash.error('Wiadomość nie została wysłana');
                    }
                })
            }
        }
    }
</script>
