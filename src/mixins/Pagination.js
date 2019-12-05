export default {
    data() {
        return {
            pagination: {
                page: 1,
                pages: 0,
                total: 0,
                pageSize: 20
            }
        }
    },

    computed: {
        paginationQuery() {
            return {
                page: this.pagination.page,
                pageSize: this.pagination.pageSize
            }
        }
    },

    methods: {
        readPaginationFromMeta(meta) {
            this.pagination.page = meta.page || 1;
            this.pagination.pages = meta.pages || 0;
            this.pagination.total = meta.total || 0;
            this.pagination.pageSize = meta.pageSize || 20;
        }
    }
}
