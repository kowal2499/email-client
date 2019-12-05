export default {
    props: {
        optionAdapter: {
            type: Function,
            default: value => {
                // Jeśli string
                if (typeof value === 'string') {
                    return {
                        id: value,
                        label: value,
                        value,
                    };
                }

                return {
                    id: value.id,
                    label: value.text,
                    value,
                };
            },
        },
        options: {
            type: [Array],
            default: () => [],
        },
        providerOptions: {
            type: Function,
            default: null
        },
        providerSearchedOptions: {
            type: Function,
            default: null
        },
        providerSelectedOptions: {
            type: Function,
            default: null
        },
        value: {
            type: [Array, String, Number, Object, Boolean],
            default: null,
        },
        search: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
};