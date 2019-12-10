<template>
    <div>

        <toolbar>
            <template v-slot:buttons-left>
                <mass-check v-model="checkedMessageUids"/>
                <mass-flag
                        :uuids="checkedMessageUids"
                        :busy-uuids="busyMessages"
                        @updatedBusyUuids="busyMessages=$event"
                        @updatedCheckedUuids="checkedMessageUids=$event"
                />
                <move
                        :source="activeFolderType"
                        destination="TRASH"
                        icon="icon-bin"
                        label="Usuń"
                        :uuids="checkedMessageUids"
                        :busy-uuids="busyMessages"
                        @updatedBusyUuids="busyMessages=$event"
                        @updatedCheckedUuids="checkedMessageUids=$event"
                        v-if="['INBOX', 'SENT', 'SPAM'].indexOf(activeFolderType) !== -1"
                />
                <move
                        :source="activeFolderType"
                        destination="SPAM"
                        icon="icon-spam"
                        label="Spam"
                        :uuids="checkedMessageUids"
                        :busy-uuids="busyMessages"
                        @updatedBusyUuids="busyMessages=$event"
                        @updatedCheckedUuids="checkedMessageUids=$event"
                        v-if="['INBOX'].indexOf(activeFolderType) !== -1"
                />
                <move
                        :source="activeFolderType"
                        destination="INBOX"
                        icon="icon-drawer-in"
                        label="Przywróć do Inbox"
                        :uuids="checkedMessageUids"
                        :busy-uuids="busyMessages"
                        @updatedBusyUuids="busyMessages=$event"
                        @updatedCheckedUuids="checkedMessageUids=$event"
                        v-if="['TRASH', 'SPAM'].indexOf(activeFolderType) !== -1"
                />
                <delete
                        icon="icon-bin2"
                        label="Skasuj"
                        :uuids="checkedMessageUids"
                        :busy-uuids="busyMessages"
                        @updatedBusyUuids="busyMessages=$event"
                        @updatedCheckedUuids="checkedMessageUids=$event"
                        v-if="['TRASH', 'DRAFTS', 'SPAM'].indexOf(activeFolderType) !== -1"
                />
            </template>

            <template v-slot:buttons-right>
                <pagination
                        :meta="messagesMeta"
                        @changePage="changePage($event)"
                />
            </template>
        </toolbar>

        <div v-if="messages && messages.length > 0" class="table-responsive">
            <table class="table">
                <tbody>


                    <template v-for="message in messages">

                        <tr :key="message.uuid" v-if="isBusy(message.uuid, 'move')">
                            <td colspan="5" class="text-center">
                                <i class="icon-spinner anim"/> Trwa przenoszenie ...
                            </td>
                        </tr>

                        <tr v-else :key="message.uuid" @click="readMessage(message.uuid)" style="cursor: pointer; position:relative;">
                            <td class="table-inbox-checkbox rowlink-skip" @click.stop="" style="background-color: #fcfcfc">
                                <base-checkbox :value="message.uuid" v-model="checkedMessageUids"/>
                            </td>

                            <td class="flags" @click.stop="">

                                <i v-if="isBusy(message.uuid, 'seen')" class="icon-spinner anim"/>
                                <i
                                        v-else
                                        :class="message.flag.seen ? 'icon-circle-small' : 'icon-circles unseen'"
                                        @click.prevent="updateFlag(message.uuid, 'seen', !message.flag.seen)"
                                />

                                <i v-if="isBusy(message.uuid, 'stared')" class="icon-spinner anim"/>
                                <i
                                        v-else
                                        :class="message.flag.stared ? 'icon-star-full2 stared' : 'icon-star-empty3'"
                                        @click.prevent="updateFlag(message.uuid, 'stared', !message.flag.stared)"
                                />
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

                    </template>

                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Pagination from "./list/Pagination";
    import BaseCheckbox from "../../../components/Form/CheckBox/BaseCheckbox";
    import dateHelper from "../utils/dateHelper";
    import Toolbar from "./Toolbar/Toolbar";

    import MassCheck from "./Toolbar/MassCheck";
    import MassFlag from "./Toolbar/MassFlag";
    import Move from "./Toolbar/Move";
    import Delete from "./Toolbar/Delete";

    export default {

        name: "EmailsList",
        components: {Toolbar, Pagination, BaseCheckbox, MassCheck, MassFlag, Move, Delete},

        computed: {
            ...mapState(['messages', 'componentsState', 'messagesMeta', 'activeFolderType']),
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
                return dateHelper.getDate(date).concat(' ', dateHelper.getTime(date));
            },

            readMessage(uuid) {
                this.$store.dispatch('selectEmail', uuid);
            },

            changePage(step) {
                this.$store.dispatch('changePage', step);
            },

            /**
             *  Aktualizacja flagi na pojedynczym wierszu tabeli
             */
            updateFlag(messageUuid, flagName, flagState) {

                // jeśli uid jest aktualnie przetwarzany to wyjdź
                if (this.busyMessages[flagName].indexOf(messageUuid) !== -1) {
                    return;
                }

                // dodanie uida do zajętych
                this.busyMessages[flagName].push(messageUuid);

                // aktualizacja
                this.$store.dispatch('setFlag', {uuids: [messageUuid], flagName, flagState})
                    .then(() => {
                        // usunięcie uida z zajętych
                        const idx = this.busyMessages[flagName].findIndex(b => b === messageUuid);
                        if (idx !== -1) {
                            this.busyMessages[flagName].splice(idx, 1);
                        }
                    })
                ;
            },

            isBusy(uid, groupName) {
                return this.busyMessages[groupName].indexOf(uid) !== -1;
            }
        },

        data() {
            return {
                checkedMessageUids: [],

                busyMessages: {
                    seen: [],
                    stared: [],
                    spam: [],
                    move: [],
                },
            }
        },
    }
</script>

<style lang="scss" scoped>

    tr.disabled-row {
        opacity: 0.2;
    }

    tr {
        position: relative;
    }

    td {

        &.flags {
            width: 6rem;
        }

        i {
            color: #d1d1d1;

            &.unseen {
                color: #5C6BC0
            }

            &.stared {
                color: goldenrod;
            }

            &+i {
                margin-left: 1rem;
            }

            &.anim {
                color: #333;
                animation: anim-rotate 2s infinite linear;

                @keyframes anim-rotate {
                    0% {
                        transform: rotate(0);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            }
        }
    }

</style>