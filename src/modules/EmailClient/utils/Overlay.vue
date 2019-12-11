<template>
    <div class="overlay-wrapper">
        <slot></slot>

        <div class="overlay-base" v-if="show">
            <div class="overlay-message">
                <div>{{ message }}</div>
                <i :class="iconClass"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            message: {
                type: String,
                default: 'Trwa wczytywanie danych ...',
            },
            iconClass: {
                type: String,
                default: 'icon-spinner2',
            }
        },
        name: "Overlay",

        mounted() {
            this.$on('initialized', (eventData) => {
                this.$parent.$emit('initialized', eventData)
            });

            this.$on('busy', (eventData) => {
                this.$parent.$emit('busy', eventData)
            });
        }
    }
</script>

<style lang="scss" scoped>

    .overlay-wrapper {
        position: relative;
        min-height: 70px;

        .overlay-base {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.92);
            z-index: 100000;

            .overlay-message {
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