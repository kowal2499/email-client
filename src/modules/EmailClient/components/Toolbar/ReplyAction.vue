<script>
    import BaseWidget from "./BaseWidget";

    export default {
        name: "ReplyAction",
        extends: BaseWidget,

        props: {
            replyType: {
                type: String,
                validator: (value) => {
                    return ['reply', 'replyAll', 'forward'].indexOf(value) !== -1;
                },
                required: true,
            },
            messageUuid: {
                type: String,
            }
        },

        methods: {
            handlerFn() {
                if (!this.messageUuid) {
                    return;
                }

                this.$store.commit('SET_ROUTE_BY_NAME', {
                    routeName: 'emailCreate',
                    args: {
                        'reply-to': this.messageUuid,
                        'reply-type': this.replyType,
                    }
                });
            }
        }
    }
</script>
