<template>
    <button
            type="button"
            @click="deleteHandler"
            class="btn btn-light"
            :disabled="this.uuids.length === 0"
    >
        <i :class="icon"/> <span class="d-none d-lg-inline-block ml-2 ">{{ label }}</span>
    </button>
</template>

<script>
    export default {
        name: "Delete",
        props: ['icon', 'label', 'uuids', 'busyUuids'],

        computed: {
            innerCheckedUuids: {
                get() {
                    return this.uuids;
                },
                set(val) {
                    this.$emit('updatedCheckedUuids', val)
                }
            },

            innerBusyUuids: {
                get() {
                    return this.busyUuids;
                },
                set(val) {
                    this.$emit('updatedBusyUuids', val)
                }
            },
        },

        methods: {
            deleteHandler() {
                if (this.innerCheckedUuids.length === 0) {
                    return;
                }

                // dodanie uidów do zajętych
                this.innerBusyUuids.move = [
                    ...this.innerBusyUuids.move,
                    ...this.innerCheckedUuids
                ];

                this.$store.dispatch('deleteMessage', {
                    uids: this.innerCheckedUuids,
                })
                    .finally(() => {
                        this.innerCheckedUuids = [];
                        this.innerBusyUuids.move = [];
                    })
            }
        }
    }
</script>

<style scoped>
    i {
        color: red;
    }

</style>