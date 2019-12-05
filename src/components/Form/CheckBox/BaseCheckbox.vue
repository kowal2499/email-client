<template>
    <div class="custom-control custom-checkbox" :class="{'custom-checkbox--linear': type === 'linear'}">
        <input
                type="checkbox"
                class="custom-control-input"
                :id="'checkbox-' + id"
                v-model="internalValue"
                :value="value"
                :true-value="computedTrueValue"
                :false-value="falseValue"
        >

        <label class="custom-control-label"
               :for="'checkbox-' + id"
        >
            <slot/>
        </label>
    </div>
</template>

<script>
    export default {

        props: {
            type: {
                type: String,
                default: 'linear'
            },
            trueValue: {
                default: undefined
            },
            falseValue: {
                default: null
            },
            checked: {},
            value: {}
        },

        model: {
            prop: "checked",
            event: "change"
        },
        data() {
            return {
                id: this._uid
            }
        },

        computed:{
            computedTrueValue() {
                return undefined === this.trueValue ? this.value : this.trueForkContext;
            },

            internalValue: {
                get() {
                    return this.checked
                },
                set(v){
                    this.$emit("change", v)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-control-label {
        &::before {
            left: -2rem;
        }
        &::after {
            left: -2rem;
        }
    }

    .custom-checkbox {
        &.custom-checkbox--no-pl {
            padding-left: 2rem;
        }
    }

    .custom-checkbox {
        .custom-control-label{
            &:before{
                border: none;
                left: -2rem;
            }
        }

        &--linear {
            .custom-control-input:checked ~ .custom-control-label:before {
                background-color: transparent;
                border: 2px solid #455A64;
            }

            .custom-control-input:checked ~ .custom-control-label:after {
                background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23455A64' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E");
            }

            .custom-control-label{
                &:before{
                    border: 2px solid #455A64;
                    background-color: transparent;
                }
            }
        }
    }
</style>
