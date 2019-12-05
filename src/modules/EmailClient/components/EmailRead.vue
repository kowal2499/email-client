<template>
        
    <div v-if="message && message.textHtml">
        <iframe :srcdoc="message.textHtml" frameborder="0" style="width: 100%; height: 700px"></iframe>
    </div>
</template>

<script>
    export default {
        name: "EmailRead",

        data() {
            return {
                message: null
            }
        },

        created() {

            this.$parent.$emit('busy', true);

            this.$store.dispatch('fetchCurrentMessage')
            .then(({data}) => {
                if (data.data) {
                    this.message = data.data;
                }
            })
            .catch(error => {})
            .finally(() => {
                this.$parent.$emit('busy', false);
            })
        }
    }
</script>

<style scoped>

</style>