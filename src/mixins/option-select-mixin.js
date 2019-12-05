import _ from 'lodash';

import props from './option-select-mixin-props';

export default {
    model: {
        event: 'change'
    },
    mixins: [props],

    data() {
        return {
            initializedOptions: false,
            initializedSelected: false,
            processingOptions: false,
            processingSearch: false,
            proxyValue: this.value,
            paginationOptions: false,
            paginationSearch: false,
            page: 1,
            searchText: '',
            adaptedOptions: [],
            selected: []
        };
    },

    mounted() {
        this.initialize();
    },

    computed: {
        initialized() {
            return this.initializedOptions && this.initializedSelected;
        },
        processing() {
            return this.processingOptions || this.processingSearch;
        },
        processingPagination() {
            return this.page > 1 && this.processing;
        },
        searching() {
            return this.search && this.searchText.length > 0
        },
        multiple() {
            return Array.isArray(this.proxyValue);
        },
        searchedOptions() {
            if (!this.searching || this.processing) {
                return this.adaptedOptions;
            }

            return this.adaptedOptions.filter(this.compareSearch);
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
        }
    },

    watch: {
        options:{
            handler() {
                this.adaptedOptions = [];
                this.initialize();
            }
        },
        value: {
            immediate: true,
            handler(value) {
                // Proxy wartości
                this.proxyValue = value;
                this.initializeSelected().then(() => {});
            }
        },
        searchText() {
            this.processingSearch = true;

            if (!this.searching || !this.providerSearchedOptions) {
                this.processingSearch = false;
            } else {
                this.page = 1;
                this.provideSearchedOptions(this.page);
            }
        }
    },

    methods: {
        /**
         * Inicjalizacja mixin
         */
        async initialize() {
            this.proxyValue = this.value;
            this.selected = this.multiple ? [] : null;

            await this.initializeOptions();
            this.initializeInfiniteScroll();
        },

        /**
         * Inicjalizacja dostępnych opcji
         */
        initializeOptions() {
            this.page = 1;
            this.initializedOptions = false;
            return this.provideOptions(this.page).then(() => {
                this.initializedOptions = true;
                this.initializeSelected().then(() => {});
            });
        },

        /**
         * Inicjalizacja zaznaczonych opcji
         */
        async initializeSelected() {
            this.initializedSelected = false;

            let selected = [];
            let option;

            if (this.multiple) {
                this.proxyValue.forEach(v => {
                    if (null !== (option = this.mapSelectedOptions(v))) {
                        selected.push(String(option.id));
                    }
                });

                selected = selected.concat(await this.provideSelectedOptions(_.difference(this.proxyValue, selected)));
            } else {
                selected = null;

                if (null !== this.proxyValue) {
                    option = this.mapSelectedOptions(this.proxyValue) || await this.provideSelectedOptions([this.proxyValue]);

                    if (null !== option) {
                        selected = String(option.id);
                    }
                }
            }

            this.selected = selected;
            this.initializedSelected = true;
        },

        initializeInfiniteScroll() {
            let el = this.$refs.optionsList;

            if (!el || null !== el.onscroll) {
                return;
            }

            el.onscroll = () => {
                if (el.scrollTop < (el.scrollHeight - el.offsetHeight)) {
                    return false;
                }

                if (this.searching) {
                    if (this.paginationSearch) {
                        this.provideSearchedOptions(++this.page);
                    }
                } else if (this.paginationOptions) {
                    this.provideOptions(++this.page);
                }
            };
        },

        /**
         * @param {Array} options
         * @returns {Array}
         */
        adaptOptions(options) {
            return options.map((x, idx) => this.optionAdapter(x, idx));
        },

        /**
         * @param {Array} options
         */
        mergeAdaptedOptions(options) {
            this.adaptedOptions = _.unionBy(this.adaptedOptions.concat(options), 'id');
        },

        /**
         * @param {Object} option
         * @param id
         * @returns {boolean}
         */
        compareId(option, id) {
            return String(option.id) === String(id);
        },

        /**
         * @param {Object} option
         * @param value
         * @returns {boolean}
         */
        compareValue(option, value) {
            return String(option.value) === String(value);
        },

        /**
         * @param {Object} option
         * @returns {boolean}
         */
        compareSearch(option) {
            return option.label.toLowerCase().includes(this.searchText.toLowerCase())
        },

        /**
         * @param {Object} option
         * @returns {Boolean}
         */
        isSelected(option) {
            return this.multiple
                ? this.selected.includes(String(option.id))
                : this.selected === String(option.id);
        },

        /**
         * @param {String} value
         * @returns {Boolean}
         */
        isSelectedValue(value) {
            return null !== this.mapSelectedOptions(value);
        },

        /**
         * @param {Object,String} value
         * @returns {Object|null}
         */
        mapSelectedOptions(value) {
            // Jeśli w opcjach trzymany jest cały obiekt
            if (typeof value === 'object') {
                return this.optionAdapter(value) || null;
            }
            // Jeśli w opcjach trzymamy tylko value
            return this.adaptedOptions.find(o => this.compareValue(o, value)) || null;
        },

        /**
         * Emitowanie wartości
         */
        updateValue() {
            let option, emittedValue, emittedOptions;

            if (this.multiple) {
                emittedValue = [];
                emittedOptions = [];

                this.selected.forEach(id => {
                    if (null === (option = this.adaptedOptions.find(x => this.compareId(x, id)) || null)) {
                        return;
                    }

                    emittedValue.push(option.value);
                    emittedOptions.push({...option});
                });
            } else {
                option = this.adaptedOptions.find(o => this.compareId(o, this.selected)) || null;
                emittedValue = null;
                emittedOptions = null;

                if (null !== option) {
                    emittedValue = option.value;
                    emittedOptions = {...option};
                }
            }

            this.$emit('change', emittedValue);
            this.$emit('selected', emittedOptions)
        },

        /**
         * Dostawca opcji
         * @param page
         * @returns {Promise<unknown>|Function | any | Q.Promise<any> | void | PromiseLike<any>}
         */
        provideOptions(page) {
            this.processingOptions = true;
            this.paginationOptions = false;

            if (page > 1) {
                this.$nextTick(this.scrollOptionsListToBottom);
            }

            if (null === this.providerOptions) {
                return new Promise(resolve => {
                    this.mergeAdaptedOptions(this.adaptOptions(this.options));
                    this.processingOptions = false;
                    resolve();
                });
            }

            return this.providerOptions(page).then(({options, meta = null}) => {
                this.mergeAdaptedOptions(this.adaptOptions(options));
                // Zabezpieczenie przed zapętleniem
                this.paginationOptions = meta && meta.page < meta.pages && +meta.page === +page;
                this.processingOptions = false;
            });
        },

        /**
         * Dostawca wyszukiwanych opcji
         */
        provideSearchedOptions: _.debounce(function (page) {
            this.processingSearch = true;
            this.paginationSearch = false;

            if (page > 1) {
                this.$nextTick(this.scrollOptionsListToBottom);
            }

            return this.providerSearchedOptions(page, this.searchText).then(({options, meta = null}) => {
                this.mergeAdaptedOptions(this.adaptOptions(options));
                // Zabezpieczenie przed zapętleniem
                this.paginationSearch = meta && meta.page < meta.pages && +meta.page === +page;
                this.processingSearch = false;
            });
        }, 600),

        /**
         * Dostawca zaznaczonych opcji
         * @param {Array} values
         * @returns {Promise<T>|*}
         */
        provideSelectedOptions(values) {
            if (!this.providerSelectedOptions || 0 === values.length) {
                return this.multiple ? [] : null;
            }

            return this.providerSelectedOptions(values).then(options => {
                values = values.map(value => String(value));

                let adaptOptions = this.adaptOptions(options).filter(option => values.includes(String(option.value)));
                let selected = [];

                adaptOptions.forEach(option => selected.push(String(option.id)));

                this.mergeAdaptedOptions(adaptOptions);

                return this.multiple ? selected : selected[0] || null;
            });
        },

        /**
         * Przesuń listę opcji na sam koniec
         */
        scrollOptionsListToBottom() {
            let el = this.$refs.optionsList;

            if (undefined !== el) {
                el.scrollTop = el.scrollHeight;
            }
        },

        /**
         * Dodaje opcje do listy zaznaczonych
         * @param {Object} option - adaptedOptions
         */
        add(option) {
            if(this.isSelected(option)){
                return;
            }

            if (this.multiple) {
                this.selected.push(String(option.id));
            } else {
                this.selected = String(option.id);
            }

            this.updateValue();
        },
    }
};
