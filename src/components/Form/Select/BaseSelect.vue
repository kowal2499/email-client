<template>
    <div :class="getClass" v-on-clickaway="closeMenu">
        <div class="base-select" :class="{'-opened': this.show}">
            <div class="container-field form-control" @click.prevent="toggleMenu()">
                <ul>
                    <li class="-bs-option -bs-selected"
                        v-for="option in selectedOptions"
                        :key="option.id"
                        @click="clickOnSelected(option, $event)"
                    >
                        <span class="-bs-unselect" @click="select(option, $event)">×</span>
                        <slot :option="option" name="selected">
                            <div v-html="renderSelectedOption(option)"></div>
                        </slot>
                    </li>
                    <li v-if="multiple" class="search-option">
                        <input
                                tabindex="0"
                                autocomplete="off"
                                autocapitalize="off"
                                spellcheck="false"
                                role="textbox"
                                aria-autocomplete="list"
                                type="search"
                                v-model="searchText"
                                ref="input"
                                :placeholder="inputPlaceholder"
                                @focusin.native="focusIn"
                                @focusout.native="focusOut"
                                @keyup.enter.prevent="onInputEnter"
                                @keyup.esc.prevent="onInputEscape"
                                @keyup.up="onInputUp"
                                @keyup.down="onInputDown"
                        >
                    </li>
                    <li v-else-if="0 === selectedOptions.length" class="-bs-option">
                        {{ placeholder }}
                    </li>
                </ul>
            </div>

            <div class="dropdown-menu">
                <div v-if="!multiple">
                    <div class="input-group search-option">
                        <span class="input-group-prepend">
                            <span class="input-group-text"><i class="icon-search4"></i></span>
                        </span>
                        <input
                                class="form-control"
                                tabindex="0"
                                autocomplete="off"
                                autocapitalize="off"
                                spellcheck="false"
                                role="textbox"
                                aria-autocomplete="list"
                                type="search"
                                v-model="searchText"
                                ref="input"
                                @keyup.enter.prevent="onInputEnter"
                                @keyup.esc.prevent="onInputEscape"
                                @keyup.up="onInputUp"
                                @keyup.down="onInputDown"
                        >
                    </div>
                </div>

                <div class="options-list" ref="optionsList">
                    <div
                            class="-bs-option"
                            v-for="option in searchedOptions"
                            :ref="'option-' + option.id"
                            :key="option.id"
                            :class="{'-bs-selected': isSelected(option)}"
                            @click="select(option, $event)"
                    >
                        <slot :option="option">
                            <div v-html="renderOption(option)"></div>
                        </slot>
                    </div>
                    <div v-if="searchedOptions.length === 0" class="-bs-option">
                        <slot name="notFound">
                            <i class="icon-folder-remove mr-1"></i> Nie znaleziono żadnych opcji.
                            <span v-if="tags">
                                Naciśnij enter aby dodać tag.
                            </span>
                        </slot>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="toolbar" class="d-flex align-items-baseline py-1 mt-2 justify-content-end">
            <a href class="d-block font-size-xs text-secondary pl-2" @click.prevent="clear">
                Resetuj
            </a>
        </div>
    </div>
</template>
<script>

    import formOptionSelectMixin from "../../../mixins/option-select-mixin"
    import { mixin as clickAway } from 'vue-clickaway';
    import _last from "lodash/findLast";
    import _head from "lodash/head";

    export default {
        name: `BaseSelect`,
        mixins: [formOptionSelectMixin, clickAway],
        props: {
            type: {
                type: String,
                default: 'linear'
            },
            placeholder: {
                type: String,
                required: false,
                default: 'Wybierz'
            },
            search: {
                type: Boolean,
                default: true
            },
            toolbar: {
                type: Boolean,
                default: false
            },
            containerClass: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                show: false,
                inputFocus: false,
                currentOption: null,
                clickedOption: null,
                editedTag: null,
            }
        },

        computed: {
            inputPlaceholder() {
                return false === this.inputFocus && 0 === this.selectedOptions.length ? this.placeholder : '';
            },

            getClass() {
                return this.$options.name + (this.containerClass ? ` ${this.containerClass}` : '');
            }
        },

        methods: {
            toggleMenu() {
                this.show = !this.show;
                this.setInputFocus();
            },

            closeMenu() {
                this.show = false;
            },

            focusIn() {
                this.inputFocus = this.show = true;
            },

            focusOut() {
                this.inputFocus = this.show = false;
            },

            setInputFocus() {
                if (this.$refs.input) {
                    this.$nextTick(() => this.$refs.input.focus());
                }
            },

            select(option, event){
                event.stopPropagation();

                if( this.isSelected(option) ){
                    this.remove(option);
                } else {
                    this.add(option);
                }
            },

            /** Kliknięcie na element **/
            clickOnSelected(option, event) {
                event.stopPropagation(); // Nie odpalaj  handler rodzica

                // Jeżeli zezwolono na tagi i kliknięto w tag
                if (this.tags && this.isTag(option)) {
                    // Jeżeli kliknięto dwa razy w ten sam tag
                    if (this.clickedOption === option) {
                        this.editedTag = option;
                        this.searchText = option.id;
                        this.remove(option);
                        this.setInputFocus();
                        // Jeżeli kliknięto w inny tag a wcześniejszy został otwarty do edycji przywróć go
                    } else if (this.editedTag !== null && !this.isSelected(this.editedTag)) {
                        this.addTag(this.editedTag.id);
                        this.resetVariable();
                    }
                }

                this.clickedOption = option;
                this.show = true;
            },

            /** Element zaznaczony **/
            renderSelectedOption(option){
                return option.label;
            },
            /** Element wyboru **/
            renderOption(option){
                return option.label;
            },
            /** Arrow do góry **/
            onInputUp(){
                this.setCurrentOption('up');
            },
            /** Arrow do dołu **/
            onInputDown(){
                this.setCurrentOption('down');
            },
            /** Zaznacza aktualny element **/
            setCurrentOption(direction){
                if (0 === this.adaptedOptions().length) {
                    this.currentOption = null;
                    return;
                }

                if( this.currentOption === null ){
                    this.currentOption = direction === 'down'
                        ? _head(this.adaptedOptions)
                        : _last(this.adaptedOptions);
                } else {
                    let index = this.adaptedOptions.indexOf(this.currentOption);
                    let newIndex = direction === 'down' ? index + 1 : index - 1;

                    if( newIndex < this.adaptedOptions.length && newIndex >= 0 ){
                        this.currentOption = this.adaptedOptions[newIndex];
                    }
                }

                const el = this.$refs.optionsList;
                const elOption = this.$refs[ 'option-' + this.currentOption.id ][0] || null;

                if( el && elOption ){
                    el.scrollTop = elOption.offsetTop - elOption.offsetHeight;
                }
            },

            /** Wciśnięcie entera w input **/
            onInputEnter(){
                if (this.currentOption) {
                    this.select(this.currentOption, event);
                } else if (this.tags && this.searchText !== '') {
                    this.addTag(this.searchText);
                    this.resetVariable();
                }
            },

            /** Wciśnięcie escape w input **/
            onInputEscape(){
                if (this.tags && this.editedTag !== null) {
                    this.add(this.editedTag);
                    this.resetVariable();
                }

                this.currentOption = null;
                this.show = false;
            },

            resetVariable() {
                this.clickedOption = null;
                this.editedTag = null;
                this.searchText = '';
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "./BaseSelect.scss";
</style>
