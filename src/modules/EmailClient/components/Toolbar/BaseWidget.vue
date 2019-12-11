<template>
    <button
            type="button"
            @click="handlerFn()"
            class="btn"
            :class="buttonClass"
            :disabled="disabled"
    >
        <i :class="iconClass"/> <span class="d-none d-lg-inline-block ml-2 ">{{ label }}</span>
    </button>
</template>

<script>
    export default {
        props: {
            iconClass: {
                type: String,
            },
            buttonClass: {
                type: String,
                default: 'btn-light',
            },
            label: {
                type: String,
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        name: "BaseWidget",

        methods: {
            handlerFn() {}
        }
    }
</script>

<style scoped>

</style>