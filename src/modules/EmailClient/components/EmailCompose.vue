<template>
    <div>
        <h2>Email compose</h2>
        <toolbar>
            <template v-slot:buttons-left/>
            <template v-slot:buttons-right/>
        </toolbar>
    </div>

</template>

<script>

    import Toolbar from "./Toolbar";
    export default {
        name: "EmailCompose"
    }
</script>

<style scoped>

</style>