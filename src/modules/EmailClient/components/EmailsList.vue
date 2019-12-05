<template>
    <div>

        <div class="row bg-light no-gutters p-3" style="border-bottom: 1px solid #DFDFDF">
            <div class="col">
                <div class="btn-group">

                    <b-dropdown variant="light" size="sm">

                        <template v-slot:button-content>
                            <i class="icon-checkbox-checked"></i>
                        </template>

                        <b-dropdown-item @click="checkedCheckAll()">Zaznacz wszystko</b-dropdown-item>
                        <b-dropdown-item @click="checkedCheckBySeen(true)">Zaznacz przeczytane</b-dropdown-item>
                        <b-dropdown-item @click="checkedCheckBySeen(false)">Zaznacz nieprzeczytane</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item @click="checkedClear()">Wyczyść zaznaczenie</b-dropdown-item>
                    </b-dropdown>

                    <b-dropdown variant="light" size="sm">

                        <template v-slot:button-content>
                            Ustaw zaznaczone jako
                        </template>

                        <b-dropdown-item @click="setFlag('seen', true)">Przeczytane</b-dropdown-item>
                        <b-dropdown-item @click="setFlag('seen', false)">Nieprzeczytane</b-dropdown-item>
                    </b-dropdown>

                    <button type="button" class="btn btn-light"><i class="icon-bin"></i> <span class="d-none d-lg-inline-block ml-2">Usuń</span></button>
                    <button type="button" @click="setFlag('spam', true)" class="btn btn-light"><i class="icon-spam"></i> <span class="d-none d-lg-inline-block ml-2">Spam</span></button>


                </div>
            </div>

            <div class="col">
                <pagination
                        :meta="messagesMeta"
                        @changePage="changePage($event)"
                />
            </div>
        </div>

<!--        <div class="card-body"></div>-->
        <div v-if="messages && messages.length > 0" class="table-responsive">
            <table class="table">
                <tbody>
                    <tr v-for="(message, key) in messages" :key="key" @click="readMessage(message.uuid)" style="cursor: pointer">
                        <td class="table-inbox-checkbox rowlink-skip" @click.stop="" style="background-color: #fcfcfc">

                            <base-checkbox :value="message.uuid" v-model="checkedMessageUuids"/>
                        </td>

                        <td style="width: 1.3rem" @click.stop="toggleFlag(message, 'seen')">
                            <i :class="message.flag.seen ? 'icon-circle-small' : 'icon-circles'"></i>
                        </td>

                        <td style="width: 20%">
                            <div><strong>{{ message.from.name }}</strong></div>
                        </td>
                        <td>
                            <strong v-if="!message.flag.seen">{{ message.subject }}</strong>
                            <span v-else>{{ message.subject }}</span>

                        </td>

                        <td class="text-right" style="width: 20%">
                            {{ formatDate(message.date) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import moment from 'moment';
    import Pagination from "./list/Pagination";
    import BaseCheckbox from "../../../components/Form/CheckBox/BaseCheckbox";

    export default {

        name: "EmailsList",
        components: {Pagination, BaseCheckbox},

        computed: {
            ...mapState(['messages', 'componentsState', 'messagesMeta']),

        },

        watch: {
            'componentsState.messages': {
                deep: true,
                handler(value) {
                    this.$parent.$emit('busy', !!value)
                }
            },

        },

        methods: {
            formatDate(date) {

                let mDate = moment(date);

                if (mDate && mDate.isValid()) {
                    return mDate.format('YYYY-MM-DD HH:mm:ss');
                }
                return '';
            },

            readMessage(uuid) {
                this.$store.dispatch('selectEmail', uuid);
            },

            changePage(step) {
                this.$store.dispatch('changePage', step);
            },

            checkedClear() {
                this.checkedMessageUuids = [];
            },

            checkedCheckAll() {
                this.checkedMessageUuids = this.messages.map(m => m.uuid);
            },

            checkedCheckBySeen(seen) {
                this.checkedMessageUuids = this.messages.filter(m => m.flag.seen === seen).map(m => m.uuid);
            },

            setFlag(flag, state) {

                // odrzuć te wiadomości przy których flaga już jest taka jak wymagana
                let filteredMessages = this.checkedMessageUuids.filter(uid => {
                    const message = this.messages.find(m => m.uuid === uid);

                    if (!message || message.flag[flag] === state) {
                        return false;
                    }
                    return true;
                });

                this.$store.dispatch('setFlag', {
                    uids: filteredMessages,
                    flagName: flag,
                    flagState: state
                })
                .then(() => {
                    this.checkedMessageUuids = [];
                })
                .catch(() => {
                    console.log('fail')
                })

                ;
            },

            toggleFlag(message, flag) {
                this.$store.dispatch('setFlag', {
                    uids: [message.uuid],
                    flagName: flag,
                    flagState: !message.flag.seen
                })
            }

        },

        data() {
            return {
                checkedMessageUuids: [],
            }
        },

        created() {

        }
    }
</script>

<style scoped>

</style>