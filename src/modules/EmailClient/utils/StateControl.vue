
<script>
    export default {

        name: 'StateControl',

        props: {
            stateIndicator: {
                type: String,
                required: true,
            }
        },

        computed: {
            busy() {
                return this.$store.state.componentsState[this.stateIndicator] === 'busy';
            }
        },

        methods: {},

    }
</script>
