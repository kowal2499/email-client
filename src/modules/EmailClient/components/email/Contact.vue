<template>
    <div class="contact font-weight-semibold">{{ name }} <a :href="email">&lt;{{ email }}&gt;</a></div>
</template>

<script>
    export default {
        name: "Contact",

        props: ['name', 'email']
    }
</script>

<style scoped>
    .contact {
        display: inline-block;
        padding: 0.05rem 0.4rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 0.3rem;
        margin-right: 0.3rem;

    }

</style>