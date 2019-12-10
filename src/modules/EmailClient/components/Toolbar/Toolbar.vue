<template>
    <div class="row bg-light no-gutters p-3" style="border-bottom: 1px solid #DFDFDF">

        <div class="col-8">
            <div class="btn-group">
                <slot name="buttons-left">

                </slot>
            </div>
        </div>

        <div class="col-4">
            <slot name="buttons-right">

            </slot>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Toolbar"
    }
</script>

<style scoped>

</style>