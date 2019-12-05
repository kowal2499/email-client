<template>
    <div class="row">
        <div class="col-3">
            <slot name="sidebar"></slot>
        </div>

        <div class="col-9">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SidebarLayout",
    }
</script>

<style scoped>

</style>