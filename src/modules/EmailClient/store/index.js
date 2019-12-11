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
            showing: 'list',
        },

        route: {
            componentName: 'emails-list',
            title: 'Lista wiadomości',
            props: {}
        }

    },
    mutations: {
        ADD_ACCOUNT(state, account) {
            state.availableAccounts.push(account);
        },
        SELECT_ACCOUNT(state, accountUuid) {
            state.activeAccountUuid = accountUuid;
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

        SET_FLAG(state, {uuids, flagName, flagState}) {
            if (Array.isArray(uuids)) {
                for(let uid of uuids) {
                    let message = state.messages.find(m => m.uuid === uid);
                    if (message) {
                        message.flag[flagName] = flagState;
                    }
                }
            }
        },

        SET_ROUTE(state, {componentName, title, props}) {
            state.route.componentName = componentName;
            state.route.title = title;
            state.route.props = props;
        },

        SET_ROUTE_BY_NAME(state, {routeName, args}) {
            const routes = {
                emailList: {
                    componentName: 'emails-list',
                    title: 'Lista wiadomości',
                },
                emailRead: {
                    componentName: 'email-read',
                    title: 'Treść wiadomości',
                },
                emailCreate: {
                    componentName: 'email-compose',
                    title: 'Tworzenie wiadomości',
                }
            };

            if (routes.hasOwnProperty(routeName)) {
                state.route.componentName = routes[routeName].componentName;
                state.route.title = routes[routeName].title;
                state.route.props = args || {};
            }
        },


        UPDATE_FOLDER_COUNTERS(state, data) {
            if (data.flagName === 'seen') {
                let folder = state.folders.find(f => f.type === state.activeFolderType);
                let modifier = data.flagState ? (data.uuids.length * -1) : data.uuids.length;
                folder.info.numUnread += modifier;
            }
        },

        REMOVE_FROM_FOLDER(state, data) {
            for (let i of data.uuids) {
                let idx = state.messages.findIndex(m => m.uuid === i);
                if (idx !== -1) {
                    state.messages.splice(idx, 1);
                }
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
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});

            return ApiDealerX.get('mailbox')
                .then(({data}) => {
                    if (Array.isArray(data.data)) {
                        for (let account of data.data) {
                            commit('ADD_ACCOUNT', account);
                        }
                        commit('SELECT_ACCOUNT', data.data[0].uuid)
                    }
                })
                .catch(error => {

                })
                .finally(() => {
                })
        },

        selectAccount({commit, dispatch}, account) {
            commit('SELECT_ACCOUNT', account.uuid);
            // commit('SELECT_FOLDER', null);

            commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});

            commit('SET_COMPONENT_STATE', {component: 'folders', newState: 1});
            commit('SET_COMPONENT_STATE', {component: 'messages', newState: 1});

            return ApiDealerX.get('mailbox/'.concat(account.uuid))
                .then(({data}) => {
                    if (data.data) {
                        commit('SET_FOLDERS', data.data.folders || []);

                        commit('SET_COMPONENT_STATE', {component: 'folders', newState: 0});

                        // Po załadowaniu listy folderów odpalamy akcję wybrania folderu 'INBOX'
                        // akcja odpowiada m.in. za pobranie wiadomości z tego folderu
                        dispatch('selectFolder', 'INBOX');

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
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailRead'});
            commit('SELECT_MESSAGE', emailUuid);
        },

        selectFolder({commit, dispatch}, type) {
            commit('SET_PAGE', 1);
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});
            commit('SELECT_FOLDER', type);
            dispatch('fetchMessages');
        },

        newEmail({commit}) {
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailCreate'});
        },

        setFlag({commit, state}, payload) {

            return ApiDealerX.post('mailbox/'.concat(state.activeAccountUuid, '/folder/', state.activeFolderType, '/flag/', payload.flagName, '/', (payload.flagState ? 1 : 0)), {
                uuids: payload.uuids
            })
                .then(() => {
                    commit('SET_FLAG', payload);
                    commit('UPDATE_FOLDER_COUNTERS', payload);
                })
        },

        moveMessage({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                ApiDealerX.post('mailbox/'.concat(state.activeAccountUuid, '/folder/', payload.sourceFolder, '/move/', payload.destinationFolder), {
                    uuids: payload.uids
                })
                    .then(() => {
                        commit('REMOVE_FROM_FOLDER', { uuids: payload.uids });
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    })
            });
        },

        deleteMessage({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                ApiDealerX.delete('mailbox/'.concat(state.activeAccountUuid, '/folder/TRASH'), {
                    data: {uuids: payload.uids}
                })
                    .then(() => {
                        commit('REMOVE_FROM_FOLDER', { uuids: payload.uids });
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    })
            });
        },

        fetchMessage({state}, uuid = null) {
            return ApiDealerX.get('mailbox/message/'.concat(uuid ? uuid : state.activeMessage))
        },

        sendMessage({state}, payload) {

            return new Promise((resolve, reject) => {
                ApiDealerX.post(
                    'mailbox/'.concat(state.activeAccountUuid, '/send'),
                    payload
                )
                    .then(() => {
                        resolve();
                    })
                    .catch((data) => {
                        reject(data);
                    })
            });
        }

    },
});
