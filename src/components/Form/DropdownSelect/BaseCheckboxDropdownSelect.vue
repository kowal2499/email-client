<template>
    <div class="multiselect-native-select" style="position: relative" v-on-clickaway="closeMenu">
        <button :disabled="disabled" class="multiselect dropdown-toggle btn btn-light" @click="show = true">
            <slot name="button-text" :selected="selected" :selectedLength="selectedLength" :buttonText="buttonText">
                {{buttonText}}
            </slot>
        </button>
        {{$scopedSlots['toolbar-bodsy']}}

        <div v-if="show" class="multiselect-container dropdown-menu show">
            <BaseCheckboxSelect
                    v-model="selected"
                    v-bind="$props"
                    checkboxClass=""
                    searchContainerClass="pl-3 pr-3"
                    @selected="$emit('selected', arguments[0])"
            >
                <template v-slot:toolbar-body><slot name="toolbar-body"></slot></template>
            </BaseCheckboxSelect>
        </div>
    </div>
</template>

<script>
    import formOptionSelectMixinProps from "../../../mixins/option-select-mixin-props"
    import BaseCheckboxSelect from "../Select/BaseCheckboxSelect.vue";
    import { mixin as clickAway } from 'vue-clickaway';

    export default {
        name: "BaseCheckboxDropdownSelect",
        components: {BaseCheckboxSelect},
        mixins: [formOptionSelectMixinProps, clickAway],
        props: {
            search: {
                type: [Boolean, Function],
                default: false
            },
            toolbar: {
                type: Boolean,
                default: false
            },
            visibleValues: {
                type: Number,
                default: 3
            }
        },

        data() {
            return {
                show: false,
            }
        },

        computed: {
            selected: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value)
                }
            },

            multiple() {
                return Array.isArray(this.selected);
            },

            adaptedOptions() {
                return this.options.map(el => this.optionAdapter(el));
            },

            selectedOptions() {
                let options = [];
                let option;

                if (this.multiple) {
                    this.selected.forEach(id => {
                        if (null !== (option = this.adaptedOptions.find(x => this.compareId(x, id)) || null)) {
                            options.push(option);
                        }
                    });
                } else if (null !== (option = this.adaptedOptions.find(o => this.compareId(o, this.selected)) || null)) {
                    options.push(option);
                }

                return options;
            },

            selectedLabels() {
                return this.selectedOptions.map(el => el.label);
            },

            selectedLength() {
                if (this.multiple) {
                    return this.selected.length;
                }

                return null === this.selected ? 0 : 1;
            },

            buttonText() {

                if (this.selectedLength === 0) {
                    return 'Nic nie zaznaczono';
                }

                if (this.visibleValues >= this.selectedLength) {
                    return this.selectedLabels.join(', ');
                }

                if (this.selectedLength === this.options.length) {
                    return `Zaznaczono wszystko (${this.selectedLength})`;
                }

                return `Zaznaczone opcje: ${this.selectedLength}`;
            }
        },

        methods: {
            /**
            * @param {Object} option
            * @param id
            * @returns {boolean}
            */
            compareId(option, id) {
                return String(option.id) === String(id);
            },

            closeMenu() {
                this.show = false;
            },
        }

    }
</script>

<style scoped>

</style>
