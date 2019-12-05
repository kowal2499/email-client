<template>
    <InputLayout v-bind="inputProperties">
            <select :name="name" class="form-control" v-model="selected" :disabled="isDisabled">
                <option :value="null" disabled selected>Wybierz model</option>
                <option v-for="option in options" :key="option.id" :value="option.id">
                    {{ option.name }}
                </option>
            </select>
    </InputLayout>
</template>

<script>

    import ApiDealerX from '../../../api/ApiDealerX';
    import BaseInput from "../BaseInput";

    export default {
        extends: BaseInput,
        name: 'FormModels',

        data() {
            return {
                options: [],

                lock: true
            }
        },

        created() {
            if (this.value) {
                this.getModels();
            }
        },

        watch: {
            brandSlug: {
                handler(value) {
                    if (value) {
                        this.getModels();
                    } else {
                        this.options = [];
                        this.lock = true;
                    }
                }
            }
        },

        methods: {
            getModels() {

                this.options = [];
                this.lock = true;
                // this.value = 0;
              ApiDealerX.get('/brands-structure/brands/' + this.brandSlug + '/models').then(({data}) => {
                    data.data.forEach(model => {
                        this.options.push({id: model.id, name: model.name});
                    });

                    if (this.options.length) {
                        this.lock = false;
                    }
                });
            }
        },

        computed: {
            selected: {
                set(value) {
                    this.$emit('input', value)
                },

                get() {
                    return this.value;
                }
            },

            isDisabled() {
                return this.disabled || this.lock;
            }
        },

        props: {
            brandSlug: {
                type: String,
                default: ''
            },

            value: {
                type: Number,
                default: null
            }

        }
    }
</script>

<style scoped>

</style>
