<template>
    <button
            type="button"
            @click="handlerFn()"
            class="btn btn-light"
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
            label: {
                type: String,
            },
            disabled: {
                type: Boolean
            }
        },
        name: "BaseWidget",

        methods: {
            handlerFn() {
                console.log('jestem zwyczają bazą')
            }
        }
    }
</script>

<style scoped>

</style>