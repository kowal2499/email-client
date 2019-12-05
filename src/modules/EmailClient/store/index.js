import Vue from 'vue';
import Vuex from 'vuex';
import ApiDealerX from '../api/ApiDealerX';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        availableAccounts: [],
        activeAccountUuid: '',

        folders: [],
        activeFolderType: null,

        messages: null,
        messagesMeta: {},
        activeMessage: null,

        componentsState: {
            folders: 1,
            messages: 1,
            showing: 'list'
        }

    },
    mutations: {
        ADD_ACCOUNT(state, account) {
            state.availableAccounts.push(account);
        },
        SELECT_ACCOUNT(state, accountUuid) {
            state.activeAccountUuid = accountUuid;
            state.componentsState.folders = 1
        },
        SET_FOLDERS(state, folders) {
            state.folders = folders;
        },
        SELECT_FOLDER(state, folderType) {
            state.activeFolderType = folderType;
        },
        SET_MESSAGES(state, messages) {
            state.messages = messages;
        },
        SET_MESSAGES_META(state, meta) {
            state.messagesMeta = meta;
        },
        SET_COMPONENT_STATE(state, {component, newState}) {
            state.componentsState[component] = newState;
        },
        SELECT_MESSAGE(state, messageUuid) {
            state.activeMessage = messageUuid;
        },
        SET_SHOWING(state, data) {
            state.componentsState.showing = data;
        },
        SET_PAGE(state, pageNum) {
            state.messagesMeta.page = pageNum;
        },

        SET_FLAG(state, {uids, flagName, flagState}) {
            if (Array.isArray(uids)) {
                for(let uid of uids) {
                    let message = state.messages.find(m => m.uuid === uid);
                    if (message) {
                        message.flag[flagName] = flagState;
                    }
                }
            }
        },

        UPDATE_FOLDER_COUNTERS(state, data) {

            if (data.flagName === 'seen') {
                let folder = state.folders.find(f => f.type === state.activeFolderType);
                let modifier = data.flagState ? (data.uids.length * -1) : data.uids.length;
                folder.info.numUnread += modifier;
            }

        }

    },
    getters: {
        selectedAccount: state => {
            return state.availableAccounts.find(a => a.uuid === state.activeAccountUuid);
        }
    },
    actions: {

        /**
         * Pobiera listę dostępnych skrzynek email
         */
        initialize({commit}) {

            commit('SET_COMPONENT_STATE', {component: 'folders', newState: 1});
            commit('SET_COMPONENT_STATE', {component: 'messages', newState: 1});
            commit('SET_SHOWING', 'list');


            return ApiDealerX.get('mailbox')
                .then(({data}) => {
                    if (Array.isArray(data.data)) {
                        for (let account of data.data) {
                            commit('ADD_ACCOUNT', account);
                        }
                    }
                })
                .catch(error => {
                    console.log(error.response);
                })
                .finally(() => {
                })
        },

        selectAccount({commit}, account) {
            commit('SELECT_ACCOUNT', account.uuid);
            commit('SELECT_FOLDER', null);

            return ApiDealerX.get('mailbox/'.concat(account.uuid))
                .then(({data}) => {
                    if (data.data) {
                        commit('SET_FOLDERS', data.data.folders || []);

                        commit('SET_COMPONENT_STATE', {component: 'folders', newState: 0});
                        // Po załadowaniu listy folderów wybieramy folder 'INBOX' jako aktywny.
                        // Zmiana aktywnego folderu odpala event pobrania jego wiadomości.
                        commit('SELECT_FOLDER', 'INBOX');

                    }
                })
                .catch(() => {})
        },

        fetchMessages({commit, state}) {
            // commit('SET_MESSAGES', null);
            commit('SET_COMPONENT_STATE', {component: 'messages', newState: 1});

            let params = {};
            if (state.messagesMeta.page) {
                params = {params: {page: state.messagesMeta.page}}
            }

            return ApiDealerX.get(
                'mailbox/'.concat(state.activeAccountUuid, '/folder/', state.activeFolderType), params)
                .then(({data}) => {
                    if (data) {
                        commit('SET_MESSAGES_META', data.meta)
                    }
                    if (Array.isArray(data.data)) {
                        commit('SET_MESSAGES', data.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    commit('SET_COMPONENT_STATE', {component: 'messages', newState: 0});
                })
        },

        changePage(context, step) {
            context.commit('SET_PAGE', context.state.messagesMeta.page + step)
            context.dispatch('fetchMessages')
        },

        selectEmail({commit}, emailUuid) {
            commit('SET_SHOWING', 'read');
            commit('SELECT_MESSAGE', emailUuid);
        },

        selectFolder({commit}, type) {
            commit('SET_PAGE', 1);
            commit('SET_SHOWING', 'list');
            commit('SELECT_FOLDER', type);
        },

        newEmail({commit}) {
            commit('SET_SHOWING', 'create')
        },

        setFlag({commit}, payload) {
            // tu idzie request


            return new Promise((resolve, reject) => {

                commit('SET_FLAG', payload);
                commit('UPDATE_FOLDER_COUNTERS', payload);
                resolve(true);

            })
        },

        fetchCurrentMessage({state}) {
            return ApiDealerX.get('mailbox/message/'.concat(state.activeMessage))
        }

    },
});
