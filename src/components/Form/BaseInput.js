import InputLayout from "./InputLayout";

export default {
    components: {InputLayout},
    props: {
        name: {
            type: String,
            default: ''
        },

        showLabel: {
            type: Boolean,
            default: true
        },

        label: {
            type: String,
            default: ''
        },

        placeholder: {
            type: String,
            default: ''
        },

        disabled: {
            type: Boolean,
            default: false
        },

        labelClass: {
            type: String,
            default: 'col-form-label col-lg-2'
        },

        inputClass: {
            type: String,
            default: 'col-lg-10'
        },

        parentClass: {
            type: String,
            default: 'form-group row'
        },

        errors: {
            type: Array,
            default: () => []
        },

        value: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            inputProperties: {
                name: this.name,
                showLabel: this.showLabel,
                label: this.label,
                disabled: this.disabled,
                placeholder: this.placeholder,
                labelClass: this.labelClass,
                inputClass: this.inputClass,
                parentClass: this.parentClass,
                errors: this.errors,
                value: this.value
            }
        }
    }
}
