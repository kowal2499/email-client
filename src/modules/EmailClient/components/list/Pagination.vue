<template>
    <div class="d-flex align-items-center justify-content-end" style="min-height: 36px">
        <div>{{ currentPosition }}</div>
        <div class="btn-group ml-3" v-if="buttonsNeeded">
            <button type="button"
                    class="btn btn-light btn-icon"
                    :disabled="meta.page === 1"
                    @click.prevent="$emit('changePage', -1)"
            >
                <i class="icon-arrow-left12"></i>
            </button>
            <button type="button"
                    class="btn btn-light btn-icon"
                    :disabled="meta.page === meta.pages"
                    @click.prevent="$emit('changePage', 1)"
            >
                <i class="icon-arrow-right13"></i>
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Pagination",
        props: {
            meta: {
                type: Object
            }
        },

        computed: {
            currentPosition() {
                let txt = '';

                if (this.meta.total) {
                    if (this.meta.pageSize < this.meta.total) {
                        txt = String((this.meta.page - 1) * this.meta.pageSize + 1);
                        txt = txt.concat('-',
                            (this.meta.page * this.meta.pageSize) > this.meta.total ? this.meta.total : (this.meta.page * this.meta.pageSize)
                        );
                        txt = txt.concat(' z ', String(this.meta.total));
                    } else {
                        txt = String(this.meta.total);
                        if (this.meta.total === 1) {
                            txt = txt.concat(' wiadomość');
                        } else {
                            txt = txt.concat(' wiadomości');
                        }
                    }
                }

                return txt;
            },

            buttonsNeeded() {
                return this.meta.total && this.meta.pages > 1;
            }
        }
    }
</script>

<style scoped>

</style>