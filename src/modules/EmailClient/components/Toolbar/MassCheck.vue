<template>
    <b-dropdown variant="light" size="sm">

        <template v-slot:button-content>
            <i class="icon-checkbox-checked"/>
        </template>

        <b-dropdown-item @click="checkAll()">Zaznacz wszystko</b-dropdown-item>
        <b-dropdown-item @click="checkSeenOnly()">Zaznacz przeczytane</b-dropdown-item>
        <b-dropdown-item @click="checkUnSeenOnly()">Zaznacz nieprzeczytane</b-dropdown-item>
        <b-dropdown-divider/>
        <b-dropdown-item @click="checkClear()">Wyczyść zaznaczenie</b-dropdown-item>
    </b-dropdown>
</template>

<script>

    import {mapState} from 'vuex';

    export default {
        name: "MassCheck",

        props: ['value'],

        computed: {
            ...mapState(['messages']),

            innerStore: {
                set(value) {
                    this.$emit('input', value);
                },

                get() {
                    return this.value;
                }
            }
        },

        methods: {
            checkAll() {
                this.innerStore = this.messages.map(m => m.uuid);
            },
            checkSeenOnly() {
                this.innerStore = this.messages.filter(m => m.flag.seen === true).map(m => m.uuid);
            },
            checkUnSeenOnly() {
                this.innerStore = this.messages.filter(m => m.flag.seen === false).map(m => m.uuid);
            },
            checkClear() {
                this.innerStore = [];
            }
        },

    }
</script>

<style scoped>

</style>