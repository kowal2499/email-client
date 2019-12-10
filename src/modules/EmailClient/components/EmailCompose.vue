<template>
    <overlay :show="isBusy" :message="'Trwa wczytywanie wiadomości ...'">

        <toolbar>
            <template v-slot:buttons-left>
                Treść dla toolbara
            </template>
            <template v-slot:buttons-right/>
        </toolbar>


        <div class="card-body">
            <froala v-model="message.textHtml" :config="config"/>
        </div>

    </overlay>
</template>

<script>

    import Toolbar from "./Toolbar";
    import Overlay from "../utils/Overlay";

    import VueFroala from 'vue-froala-wysiwyg';

    export default {
        name: "EmailCompose",
        components: { Toolbar, Overlay },
        props: {
            replyTo: {
                type: String,
                default: '',
            }
        },

        created() {
            if (this.replyTo.length > 0) {
                this.isBusy = true;

                this.$store.dispatch('fetchMessage', this.replyTo)
                    .then(({data}) => {
                        if (data.data) {
                            this.message = {
                                ...this.message,
                                ...data.data
                            }
                        }
                    })
                    .catch(error => {})
                    .finally(() => {
                        this.isBusy = false
                    })
            }
        },

        data() {
            return {

                message: {
                    from: '',
                    to: [],
                    bcc: [],
                    cc: [],
                    subject: '',
                    content: '',
                    attachments: [],
                    replyTo: [],
                    textHtml: '',
                    textPlain: '',
                },

                isBusy: false,

                config: {
                    language: 'pl',
                    key: 'EE4A2E2A2tA6B4C3D4C7E1F1E1D4A3oa2Pe2HTPYh1RNc2E1KDc1==',
                    attribution: false,
                    toolbarButtons: {
                        'moreText': {
                            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
                        },
                        'moreParagraph': {
                            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
                        },
                        'moreRich': {
                            'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
                        },
                        'moreMisc': {
                            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help']
                        }
                    }

                }
            }
        }
    }
</script>

<style scoped>

</style>