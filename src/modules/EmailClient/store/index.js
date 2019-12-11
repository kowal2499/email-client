import Vue from 'vue';
import Vuex from 'vuex';
import ApiDealerX from '../api/ApiDealerX';

Vue.use(Vuex);

const STATE_FOLDERS_KEY = 'foldersList';
const STATE_MESSAGES_KEY = 'messagesList';
const STATE_EMAIL_READ_KEY = 'emailRead';
const STATE_EMAIL_COMPOSE_KEY = 'emailCompose';

const STATE_BUSY = 'busy';
const STATE_IDLE = 'idle';

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

            [STATE_FOLDERS_KEY]: 'idle',
            [STATE_MESSAGES_KEY]: 'idle',
            [STATE_EMAIL_READ_KEY]: 'idle',
            [STATE_EMAIL_COMPOSE_KEY]: 'idle',
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
                    props: {
                        stateIndicator: STATE_MESSAGES_KEY
                    }
                },
                emailRead: {
                    componentName: 'email-read',
                    title: 'Treść wiadomości',
                    props: {
                        stateIndicator: STATE_EMAIL_READ_KEY
                    },
                },
                emailCreate: {
                    componentName: 'email-compose',
                    title: 'Tworzenie wiadomości',
                    props: {
                        stateIndicator: STATE_EMAIL_COMPOSE_KEY
                    }
                }
            };

            if (routes.hasOwnProperty(routeName)) {
                state.route.componentName = routes[routeName].componentName;
                state.route.title = routes[routeName].title;
                state.route.props = {
                    ...routes[routeName].props,
                    ...args
                };
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
        },

        SET_STATE(state, {elementKey, elementState}) {
            state.componentsState[elementKey] = elementState;
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

            commit('SET_STATE', {elementKey: STATE_FOLDERS_KEY, elementState: STATE_BUSY});
            commit('SET_STATE', {elementKey: STATE_MESSAGES_KEY, elementState: STATE_BUSY});
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});

            return ApiDealerX.get('mailbox')
                .then(({data}) => {
                    if (Array.isArray(data.data)) {
                        for (let account of data.data) {
                            commit('ADD_ACCOUNT', account);
                        }
                    }
                })
                .catch(error => {

                })
                .finally(() => {
                })
        },

        selectAccount({commit, dispatch, state}, account) {
            commit('SELECT_ACCOUNT', account.uuid);
            commit('SET_ROUTE_BY_NAME', {routeName: 'emailList'});

            if (state.componentsState[STATE_FOLDERS_KEY] !== STATE_BUSY) {
                commit('SET_STATE', {elementKey: STATE_FOLDERS_KEY, elementState: STATE_BUSY});
            }

            if (state.componentsState[STATE_MESSAGES_KEY] !== STATE_BUSY) {
                commit('SET_STATE', {elementKey: STATE_MESSAGES_KEY, elementState: STATE_BUSY});
            }

            return ApiDealerX.get('mailbox/'.concat(account.uuid))
                .then(({data}) => {
                    if (data.data) {
                        commit('SET_FOLDERS', data.data.folders || []);
                        commit('SET_STATE', {elementKey: STATE_FOLDERS_KEY, elementState: STATE_IDLE});

                        // Po załadowaniu listy folderów odpalamy akcję wybrania folderu 'INBOX'
                        // akcja odpowiada m.in. za pobranie wiadomości z tego folderu
                        if (state.folders.map(f => f.type).indexOf('INBOX') !== -1) {
                            dispatch('selectFolder', 'INBOX');
                        }
                    }
                })
                .catch(() => {})
        },

        fetchMessages({commit, state}) {

            if (state.componentsState[STATE_MESSAGES_KEY] !== STATE_BUSY) {
                commit('SET_STATE', {elementKey: STATE_MESSAGES_KEY, elementState: STATE_BUSY});
            }

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
                    commit('SET_STATE', {elementKey: STATE_MESSAGES_KEY, elementState: STATE_IDLE});
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

        fetchSingleMessage({state, commit}, uuid = null) {

            commit('SET_STATE', {elementKey: STATE_EMAIL_READ_KEY, elementState: STATE_BUSY});

            return new Promise((resolve, reject) => {
                ApiDealerX.get('mailbox/message/'.concat(uuid ? uuid : state.activeMessage))
                    .then((data) => {
                        commit('SET_STATE', {elementKey: STATE_EMAIL_READ_KEY, elementState: STATE_IDLE});
                        resolve(data);
                    })
                    .catch((data) => {
                        reject(data);
                    })
            });


        },

        fetchMessageForEdit({state, commit}, uuid) {

            commit('SET_STATE', {elementKey: STATE_EMAIL_COMPOSE_KEY, elementState: STATE_BUSY});

            return new Promise((resolve, reject) => {
                ApiDealerX.get('mailbox/message/'.concat(uuid, '/to_edit'))
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((data) => {
                        reject(data);
                    })
                    .finally(() => {
                        commit('SET_STATE', {elementKey: STATE_EMAIL_COMPOSE_KEY, elementState: STATE_IDLE});
                    })
            });
        },

        sendMessage({state, commit}, payload) {

            commit('SET_STATE', {elementKey: STATE_EMAIL_COMPOSE_KEY, elementState: STATE_BUSY});
            return new Promise((resolve, reject) => {
                ApiDealerX.post(
                    'mailbox/'.concat(state.activeAccountUuid, '/send'),
                    payload
                )
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((data) => {
                        reject(data);
                    })
                    .finally(() => {
                        commit('SET_STATE', {elementKey: STATE_EMAIL_COMPOSE_KEY, elementState: STATE_IDLE});
                    })
            });
        }

    },
});
