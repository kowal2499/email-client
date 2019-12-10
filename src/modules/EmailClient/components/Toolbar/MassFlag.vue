<template>
    <b-dropdown variant="light" size="sm" :disabled="uuids.length === 0">

        <template v-slot:button-content>
            Ustaw zaznaczone jako
        </template>

        <b-dropdown-item @click="setFlagMany('seen', true)">Przeczytane</b-dropdown-item>
        <b-dropdown-item @click="setFlagMany('seen', false)">Nieprzeczytane</b-dropdown-item>
    </b-dropdown>
</template>

<script>

    import {mapState} from 'vuex';
    import FlagUpdate from "./FlagUpdate";

    export default {
        name: "MassFlag",
        extends: FlagUpdate,

        props: ['uuids', 'busyUuids'],

        computed: {
            ...mapState(['messages']),

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
            }
        },

        methods: {
            setFlagMany(flagType, state) {

                // odrzuć te wiadomości przy których flaga już jest taka jak wymagana lub które już są zajęte
                let filteredUuids = this.innerCheckedUuids.filter(uid => {
                    const message = this.messages.find(m => m.uuid === uid);
                    return !(!message || message.flag[flagType] === state || this.innerBusyUuids[flagType].indexOf(uid) !== -1);
                });

                // aktualizacja listy zajętych uuidów

                this.innerBusyUuids[flagType] = [
                    ...this.innerBusyUuids[flagType],
                    ...filteredUuids
                ];

                this.update(filteredUuids, flagType, state)
                    .then(() => {

                        // usuń zaktualizowane uuidy z zajętych
                        this.innerBusyUuids[flagType] = this.innerBusyUuids[flagType].filter(b => filteredUuids.indexOf(b) === -1)

                        // opróżnij listę zaznaczonych uuidów
                        this.innerCheckedUuids = [];
                    });
                ;
            },

        },

    }
</script>

<style scoped>

</style>