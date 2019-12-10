<script>
    import BaseWidget from "./BaseWidget";

    export default {
        name: "ReplyWidget",
        extends: BaseWidget,

        props: {
            replyType: {
                type: String,
                validator: (value) => {
                    return ['reply', 'replyAll', 'forward'].indexOf(value) !== -1;
                },
                required: true,

            }
        },

        methods: {
            handlerFn() {

                console.log('Jestem porucznik Reply')
            }
        }
    }
</script>
