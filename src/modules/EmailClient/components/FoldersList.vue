<template>

    <overlay :show="busy">
        <ul class="list-group list-group-flush" v-if="folders.length > 0">

            <template v-for="folder in hardcodedFolders">
                <a v-if="currentFoldersTypes.indexOf(folder.type) !== -1"
                   href="#"
                   class="list-group-item list-group-item-action"
                   :key="folder.type"
                   @click.prevent="switchFolder(folder.type)"
                >
                    <span class="font-weight-semibold">
                        <i class="mr-2" :class="folder.icon"></i>{{ folder.name }}
                    </span>
                    <span class="badge bg-indigo-400 badge-pill ml-auto" v-if="getCount(folder.type, 'numUnread') > 0">
                        {{ getCount(folder.type, 'numUnread') }}
                    </span>
                </a>
            </template>
        </ul>
    </overlay>

</template>

<script>
    import {mapState} from 'vuex';
    import StateControl from "../utils/StateControl";
    import Overlay from "../utils/Overlay";

    const foldersMap = [
        {
            type: 'INBOX',
            name: 'Inbox',
            icon: 'icon-drawer-in',
        },

        {
            type: 'SENT',
            name: 'Wysłane',
            icon: 'icon-drawer-out',
        },

        {
            type: 'DRAFTS',
            name: 'Szkice',
            icon: 'icon-drawer3',
        },

        {
            type: 'TRASH',
            name: 'Kosz',
            icon: 'icon-bin',
        },

        {
            type: 'SPAM',
            name: 'Spam',
            icon: 'icon-spam',
        },
    ];

    export default {
        name: "FoldersList",
        extends: StateControl,
        components: {Overlay},

        computed: {
            ...mapState(['folders', 'componentsState']),
            hardcodedFolders: () => foldersMap,
            hardcodedFoldersTypes: () => {
                return foldersMap.map(f => f.type);
            },
            currentFoldersTypes() {
                return this.folders.map(f => f.type);
            },
        },

        methods: {
            getCount(type, key) {
                const folder = this.folders.find(f => f.type === type);
                let num = 0;
                if (folder) {
                    num = parseInt(folder.info[key]);
                }
                return num;
            },

            switchFolder(type) {
                this.$store.dispatch('selectFolder', type);
            }
        },

    }
</script>

<style scoped>

</style>