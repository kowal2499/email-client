<template>

    <div>
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
    </div>

</template>

<script>
    import {mapState} from 'vuex';

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

        computed: {
            ...mapState(['activeFolderType', 'folders', 'componentsState']),
            hardcodedFolders: () => foldersMap,
            hardcodedFoldersTypes: () => {
                return foldersMap.map(f => f.type);
            },
            currentFoldersTypes() {
                return this.folders.map(f => f.type);
            },
        },

        watch: {
            'componentsState.folders': {
                deep: true,
                handler(value) {
                    this.$parent.$emit('busy', !!value)
                }
            },


            activeFolderType: {
                deep: true,
                handler(value) {

                    // Aktywny folder jest nullem w czasie pobierania listy folderów.
                    // Wiadomości pobieramy dopiero gdy otrzyma inną niż null wartość.
                    if (value !== null) {
                        this.$store.dispatch('fetchMessages');
                    }

                }
            }
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
                this.$store.dispatch('', type);
            }
        },

        created() {
        }
    }
</script>

<style scoped>

</style>