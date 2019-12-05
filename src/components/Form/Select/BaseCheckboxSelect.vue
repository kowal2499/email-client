<template>
    <div :class="getClass">
        <div v-if="searchable" class="form-group" :class="searchContainerClass">
            <input type="text" class="form-control mb-3" placeholder="Szukaj" v-model="searchText">
        </div>

        <div class="has-scroll" :class="containerOptionsClass" ref="optionsList">
            <div v-if="visibleOptions.length === 0" class="text-muted pb-2 text-center">
                <span v-if="!initialized"><fa-icon icon="spinner" spin /> Wczytuje dane...</span>
                <span v-else-if="searchText.length > 0">Nie dopasowano żadnych opcji</span>
                <span v-else>Nie znaleziono żadnych opcji</span>
            </div>

            <BaseCheckbox
                    v-for="option in visibleOptions"
                    :key="option.id"
                    :class="`${$options.name}__option ${checkboxClass}`"
                    :value="option.id"
                    v-model="selected"
                    @change="updateValue"
                    :type="type"
            >
                {{ option.label }}
            </BaseCheckbox>

            <div v-if="processingPagination" class="text-muted pb-2 text-center">
                <fa-icon icon="spinner" spin /> Wczytuje opcje...
            </div>
        </div>

        <slot v-if="toolbar" name="toolbar-body">
            <div v-if="toolbar || (visibleOptionsQty && !!moreOptionQty)" class="d-flex align-items-baseline py-1 mt-3 justify-content-end">
                <a v-if="visibleOptionsQty && !!moreOptionQty"
                   href
                   @click.prevent="showAll = !showAll"
                   class="d-block flex-grow-1"
                >
                    <span v-if="showAll" class="pl-2">Mniej</span>
                    <span v-else class="pl-2">Więcej ({{moreOptionQty}})</span>
                </a>


                <a v-if="toolbar" href class="d-block font-size-xs text-secondary pl-2"  @click.prevent="clear">
                    Resetuj
                </a>
            </div>
        </slot>
    </div>
</template>

<script>
    import formOptionSelectMixin from "../../../mixins/option-select-mixin"
    import BaseCheckbox from "../CheckBox/BaseCheckbox.vue";

    export default {
        name: `BaseCheckboxSelect`,
        components: {BaseCheckbox},
        props: {
            type: {
                type: String,
                default: 'linear'
            },
            visibleOptionsQty: {
                type: [Boolean, Number],
                default: false
            },
            search: {
                type: [Boolean, Function],
                default: false
            },
            toolbar: {
                type: Boolean,
                default: false
            },
            containerClass: {
                type: String,
                default: ''
            },
            checkboxClass: {
                type: String,
                default: 'custom-checkbox--no-pl'
            },
            searchContainerClass: {
                type: String,
                default: ''
            }
        },
        mixins: [formOptionSelectMixin],

        data() {
            return {
                showAll: false
            }
        },

        computed: {
            searchable() {
                if (this.search instanceof Function) {
                    return this.search(this.adaptedOptions, this.selected);
                }

                return this.search;
            },

            visibleOptions() {
                let opts;

                if (! this.visibleOptionsQty || this.showAll || this.moreOptionQty === 0) {
                    opts = this.searchedOptions;
                } else {
                    opts = this.searchedOptions.slice(0, this.visibleOptionsQty);
                }

                return opts;
            },

            moreOptionQty() {
                if (! this.visibleOptionsQty) {
                    return 0;
                }

                let qty = this.adaptedOptions.length - this.visibleOptionsQty;

                return qty < 1 ? 0 : qty;
            },

            getClass() {
                return this.$options.name + ' mt-1'
                    + (this.containerClass ? ` ${this.containerClass}` : '')
                    + (!this.initialized ? ' busy' : '');
            },

            containerOptionsClass() {
                return this.processing ? 'busy' : '';
            }
        },

        methods: {
            clear() {
                this.selected = this.multiple ? [] : null;
                this.searchText = '';
                this.updateValue();
            }
        }
    };
</script>

<style scoped>
    .has-scroll {
        max-height: 192px;
        overflow-y: auto;
    }

    div.busy {
        opacity: 0.5;
    }
</style>
