<template>

    <div class="card">

        <slot name="title">
            <div class="card-header bg-white">
                <h6 class="card-title">{{ title }}</h6>
            </div>
        </slot>

        <div>
            <slot name="content"/>
        </div>

    </div>

</template>

<script>

    export default {
        name: "Card",
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
        }
    }
</script>

<style lang="scss" scoped>

</style>