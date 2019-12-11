
<script>
    export default {

        name: 'StateControl',

        props: {
            elementId: {
                type: String,
                required: true,
            }
        },

        computed: {
            busy() {
                return this.$store.state.componentsState[this.elementId] === 'busy'
            }
        },

        methods: {
            setBusy() {
                this.$store.commit('SET_STATE', {
                    elementId,
                    elementState: 'busy'
                });
            },

            setIdle() {
                this.$store.commit('SET_STATE', {
                    elementId,
                    elementState: 'idle'
                });
            }
        }

    }
</script>
