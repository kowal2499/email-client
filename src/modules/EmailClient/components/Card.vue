<template>

    <div class="card">

        <slot name="title">
            <div class="card-header bg-white">
                <h6 class="card-title">{{ title }}</h6>
            </div>
        </slot>

        <overlay :show="isBusy">
            <div>
                <slot name="content"/>
            </div>

        </overlay>

    </div>

</template>

<script>
    import Overlay from "../utils/Overlay";

    export default {
        name: "Card",
        components: {Overlay},
        props: {
            title: {
                type: String
            },
            noInit: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                isBusy: true
            }
        },


        created() {
            if (this.noInit) {
                this.isBusy = false;
            }

            this.$on('initialized', () => {
                this.isBusy = false;
            });

            this.$on('busy', (eventData) => {
                this.isBusy = eventData;
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>