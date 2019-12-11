<template>
    <div>
        <toolbar>
            <template v-slot:buttons-left>
                <send-action
                        :label="'Wyślij'"
                        :disabled="busy || isInvalid"
                        :icon-class="'icon-paperplane'"
                        :button-class="'btn-primary'"
                        :message="message"
                        @isSending="sendingNotify($event)"
                />
            </template>
            <template v-slot:buttons-right/>
        </toolbar>

        <overlay :show="busy" :message="busyMessage">

            <div style="border-bottom: 1px solid rgb(223, 223, 223)">
    <!--            <div class="row no-gutters py-1 px-3">-->
    <!--                <label class="col-sm-1 col-form-label">Od: </label>-->
    <!--                <div class="col-sm-11">-->
    <!--                    <v-select taggable multiple-->
    <!--                              :disabled="true"-->
    <!--                              :options="[message.from.email]"-->
    <!--                              v-model="message.from.email"></v-select>-->
    <!--                </div>-->
    <!--            </div>-->
                <div class="row no-gutters py-1 px-3">
                    <label class="col-sm-1 col-form-label">Do: </label>
                    <div class="col-sm-11">
                        <v-select taggable multiple push-tags
                                  :create-option="createOption"
                                  :selectOnKeyCodes="[188,13,9]"
                                  v-model="to"></v-select>
                    </div>
                </div>
                <div class="row no-gutters pb-1 px-3">
                    <label class="col-sm-1 col-form-label">DW: </label>
                    <div class="col-sm-11">
                        <v-select taggable multiple push-tags
                                  :create-option="createOption"
                                  :selectOnKeyCodes="[188,13,9]"
                                  v-model="cc"></v-select>
                    </div>
                </div>
                <div class="row no-gutters pb-1 px-3">
                    <label class="col-sm-1 col-form-label">UDW: </label>
                    <div class="col-sm-11">
                        <v-select taggable multiple push-tags
                                   :create-option="createOption"
                                  :selectOnKeyCodes="[188,13,9]"
                                   v-model="bcc"></v-select>
                    </div>
                </div>
                <div class="row no-gutters pb-1 px-3">
                    <label class="col-sm-1 col-form-label">Temat: </label>
                    <div class="col-sm-11">
                        <input type="text" class="form-control" v-model="message.subject">
                    </div>
                </div>
            </div>

            <div class="card-body">
                <froala v-model="message.textHtml" :config="froalaConfig"/>
            </div>

            <div class="card-body">
                <div class="row">
                    <i class="icon-attachment col-sm-1"/>
                    <vue2dropzone
                            class="col-sm-11"
                            ref="emailComposeDropzone"
                            id="emailComposeDropzone"
                            :options="dropzoneConfig"
                            @vdropzone-error="onDropzoneError"
                            @vdropzone-success="onDropzoneSuccess"
                            @vdropzone-removed-file="onDropzoneFileRemove"
                    />
                </div>
            </div>

        </overlay>
    </div>
</template>

<script>

    import Toolbar from "./Toolbar";
    import Overlay from "../utils/Overlay";
    import SendAction from "./Toolbar/SendAction";
    import vSelect from 'vue-select'
    import "vue-select/src/scss/vue-select.scss";
    import Vue2dropzone from "vue2-dropzone";
    import StateControl from "../utils/StateControl";
    import client from "../api/ApiDealerX";
    import {mapGetters} from 'vuex';

    const busyDefaultMessage = 'Trwa wczytywanie wiadomości ...';

    export default {
        name: "EmailCompose",
        extends: StateControl,

        components: { Toolbar, Overlay, SendAction, vSelect, Vue2dropzone },
        props: {
            replyTo: {
                type: String,
                default: '',
            },
            replyType: {
                type: String,
                validator: (value) => {
                    return ['reply', 'replyAll', 'forward', ''].indexOf(value) !== -1;
                },
            }
        },

        computed: {
            ...mapGetters(['selectedAccount']),

            to: {
                get() { return this.unifiedGetter('to'); },
                set(val) { this.unifiedSetter('to', val); },
            },

            cc: {
                get() { return this.unifiedGetter('cc'); },
                set(val) { this.unifiedSetter('cc', val); },
            },

            bcc: {
                get() { return this.unifiedGetter('bcc'); },
                set(val) { this.unifiedSetter('bcc', val); },
            },

            isInvalid() {
                return this.message.to.length === 0 && this.message.cc.length === 0 && this.message.bcc.length === 0;
            },
        },

        created() {

            // dodanie stopki
            this.message.textHtml = `<br>${this.selectedAccount.footer}`;

            this.message.from = {
                name: this.selectedAccount.email,
                email: this.selectedAccount.email
            };

            this.message.attachments = [];

            if (this.replyTo.length > 0) {

                this.$store.dispatch('fetchMessageForEdit', this.replyTo)
                    .then(({data}) => {
                        if (data.data) {
                            let htmlTmp = this.message.textHtml;
                            this.message = {
                                ...this.message,
                                ...data.data
                            };

                            this.message.inReplyTo = this.message.messageId;
                            this.message.textHtml = htmlTmp.concat('<br>', this.message.textHtml);
                            this.forwardedAttachments = [
                                ...this.message.attachments
                            ];

                            this.message.from = {
                                name: this.selectedAccount.email,
                                email: this.selectedAccount.email
                            };
                            switch (this.replyType) {
                                case 'reply':
                                case 'replyAll':
                                    this.message.to = this.message.replyTo;
                                    this.message.subject = `Re: ${this.message.subject}`;
                                    break;
                                case 'forward':
                                    this.message.to = [];
                                    this.message.subject = `Fwd: ${this.message.subject}`;
                                    break;
                            }

                        }
                    })
                    .catch(error => {})
                ;
            }

        },

        methods: {

            /**
             *  Konwertuje obiekt adresu na opcję multiselekta
             */
            generateAddressOption: address => {
                let label = '';
                if (address.name) {
                    label = `${address.name} <${address.email}>`;
                } else {
                    label = `${address.email} <${address.email}>`;
                }

                return {...address, label}
            },

            /**
             * Konwertuje wpisany tekst na opcję multiselekta
             */
            createOption: item => ({ name: item, email: item, label: `${item} <${item}>`}),

            /**
             * Gettery i settery wiążące multiselekty z modelem
             */
            unifiedGetter(key) {
                return this.message[key].map(addr => this.generateAddressOption(addr))
            },
            unifiedSetter(key, val) {
                this.message[key] = val.map(v => ({ email: v.email, name: v.name}));
            },

            sendingNotify(isSending) {
                if (isSending) {
                    // this.isBusy = true;
                    this.busyMessage = 'Trwa wysyłanie wiadomości...';
                } else {
                    // this.isBusy = false;
                    this.busyMessage = busyDefaultMessage;
                }
            },

            /**
             * Dodawanie załączników do wiadomości
             */
            onDropzoneSuccess(file, response) {
                let responseObject = JSON.parse(response);
                if (Array.isArray(responseObject.data)) {

                    responseObject.data.forEach(attachment => {
                        this.message.attachments.push(attachment);
                        this.$flash.success('Załącznik został dodany');

                        this.dropzoneFilesMap[file.upload.uuid] = attachment.id;
                    });
                }
            },

            /**
             *  Usuwanie załączników z wiadomości
             */
            onDropzoneFileRemove(file, error, xhr) {
                let idx = this.message.attachments.findIndex(a => a.id === this.dropzoneFilesMap[file.upload.uuid])
                this.message.attachments.splice(idx, 1);
            },

            onDropzoneError() {
                this.$flash.error('Błąd podczas dodawania załącznika');
            },
        },

        data() {
            return {

                message: {
                    from: '',
                    to: [],
                    cc: [],
                    bcc: [],
                    subject: '',
                    content: '',
                    attachments: [],
                    replyTo: [],
                    inReplyTo: '',
                    textHtml: '',
                    textPlain: '',
                },

                isBusy: false,

                busyMessage: 'Trwa wczytywanie wiadomości ...',

                forwardedAttachments: [],
                dropzoneFilesMap: {},

                dropzoneConfig: {
                    url: client.defaults.baseURL.concat('mailbox/', this.$store.state.activeAccountUuid, '/attachment'),
                    headers: {
                        'Authorization': client.defaults.headers.common.Authorization,
                        'Cache-Control': '',
                        'X-Requested-With': ''
                    },
                    createImageThumbnails: false,
                    thumbnailWidth: 150,
                    maxFilesize: 5,
                    maxFiles: 5,
                    paramName: 'files',
                    acceptedFiles: 'image/*,application/pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx',
                    autoProcessQueue: true,
                    addRemoveLinks: true,
                    uploadMultiple: true,
                    dictRemoveFile: 'Usuń plik',
                    dictDefaultMessage: 'Kliknij by załączyć pliki',
                    dictCancelUpload: 'Przerwij przesyłanie'
                },

                froalaConfig: {
                    language: 'pl',
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