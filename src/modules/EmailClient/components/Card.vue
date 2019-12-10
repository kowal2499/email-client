<template>

    <div class="card">

        <slot name="title">
            <div class="card-header bg-white">
                <h6 class="card-title">{{ title }}</h6>
            </div>
        </slot>

        <div class="c-body">

            <div>
                <slot name="content"/>
            </div>

            <div class="c-loading-overlay" v-if="isBusy">
                <div class="c-overlay-message">
                    <div>Trwa wczytywanie danych ...</div>
                    <i class="icon-spinner2"></i>
                </div>
            </div>

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

            this.$on('busy', (eventData) => {
                this.isBusy = eventData;
            })
        }
    }
</script>

<style lang="scss" scoped>

    .c-body {
        position: relative;
        min-height: 70px;

        .c-loading-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.92);
            z-index: 999999;

            .c-overlay-message {
                width: 100%;
                padding-top: 1rem;
                text-align: center;
                font-size: 1.04rem;

                i {
                    animation: anim-rotate 2s infinite linear;
                }
            }
        }

        @keyframes anim-rotate {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }

</style>