<template>

    <div>

        <full-width-layout v-if="activeComponent === 'loading'">
            <div class="alert alert-light text-center" slot="content">{{ statusMessage }}</div>
        </full-width-layout>

        <sidebar-layout v-else>
            <template slot="sidebar">

                <card :no-init="true">

                    <div slot="title" class="card-header bg-white font-weight-bold">

                        <b-dropdown class="w-100">
                            <template v-slot:button-content>
                                {{ selectedAccount.email }}
                            </template>

                            <b-dropdown-item v-for="account in this.availableAccounts" :key="account.uuid" @click.prevent="$store.dispatch('selectAccount', account)">
                                {{ account.email }}
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>

                    <div class="card-body" slot="content">
                        <a @click.prevent="newMessage" href="#" class="btn bg-indigo-400 btn-block">Nowa wiadomość</a>
                        <a @click.prevent="fetchMessages" href="#" class="btn bg-info btn-block">Pobierz</a>
                    </div>
                </card>

                <card title="Nawigacja">
                    <folders-list slot="content" />
                </card>

            </template>

            <!-- Widok głównego komponentu -->

            <card slot="content" :title="route.title">
                <component
                        :is="route.componentName"
                        v-bind="route.props"
                        slot="content"
                />
            </card>

            <!-- -->

        </sidebar-layout>

    </div>

</template>

<script>

    import SidebarLayout from "./components/layouts/SidebarLayout";

    import FoldersList from "./components/FoldersList";
    import EmailsList from "./components/EmailsList";
    import EmailCompose from "./components/EmailCompose";
    import EmailRead from "./components/EmailRead";
    import FullWidthLayout from "./components/layouts/FullWidthLayout";
    import Card from "./components/Card";

    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "EmailClient",
        components: {FullWidthLayout, EmailsList, SidebarLayout, FoldersList, Card, EmailCompose, EmailRead},

        computed: {
            ...mapState(['availableAccounts', 'componentsState', 'activeAccountUuid', 'route']),
            ...mapGetters(['selectedAccount']),


            statusMessage() {
                if (false === this.isLoaded) {
                    return 'Trwa inicjalizacja komponentu ...'
                } else if (this.availableAccounts.length === 0) {
                    return 'Brak ustawionych skrzynek email.'
                }
                return '';
            },

            activeComponent() {
                let name = 'loading';
                if (this.isLoaded) {
                    name = this.componentsState.showing;
                }
                return name;
            }
        },

        methods: {
            newMessage() {
                this.$store.dispatch('newEmail');
            },
            fetchMessages() {
                this.$store.dispatch('selectAccount', this.$store.getters.selectedAccount);
            }
        },

        created() {
            this.$store.dispatch('initialize')
                .then(() => {
                    // jeżeli są dostępne konta email to pobierz wiadomości z pierwszego z nich
                    if (this.availableAccounts.length > 0) {
                        this.isLoaded = true;
                        this.$store.dispatch('selectAccount', this.availableAccounts[0]);
                    }
                })

            ;
        },

        data() {
            return {
                isLoaded: false
            }
        }
    }
</script>

<style scoped>

</style>