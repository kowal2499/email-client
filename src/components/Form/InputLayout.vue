<template>
    <div :class="parentClass">
        <label :class="formattedLabelClass" v-if="showLabel">
            {{ label }}
        </label>

        <div class="col" :class="formattedInputClass">
            <slot></slot>
            <div class="form-text text-danger" v-for="(error, index) in errors" :key="index">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InputLayout",

        props: {

            showLabel: {
                type: Boolean,
                default: true
            },
            label: {
                type: String,
                default: ''
            },
            // placeholder: {
            //     type: String,
            //     default: ''
            // },
            // disabled: {
            //     type: Boolean,
            //     default: false
            // },
            labelClass: {
                type: String,
                default: 'col-form-label col-lg-2'
            },
            // inputClass: {
            //     type: String,
            //     default: 'col-lg-10'
            // },
            parentClass: {
                type: String,
                default: 'form-group row'
            },

            errors: {
                type: Array,
                default: () => []
            }
        },

        computed: {
            formattedLabelClass() {
                if (this.errors.length > 0) {
                    return this.labelClass.concat(' font-weight-bold text-danger')
                }

                return this.labelClass
            },

            formattedInputClass() {
                if (this.errors.length > 0) {
                    return this.inputClass.concat(' border-danger')
                }

                return this.inputClass
            }
        }
    }
</script>
