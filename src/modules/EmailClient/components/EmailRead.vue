<template>

    <div>
        <toolbar>
            <template v-slot:buttons-left>
                <reply-widget
                    icon-class="icon-reply"
                    label="Odpowiedz"
                    :disabled="false"
                    reply-type="reply"
                />
                <reply-widget
                        icon-class="icon-reply-all"
                        label="Odpowiedz wszystkim"
                        :disabled="false"
                        reply-type="replyAll"
                />
                <reply-widget
                        icon-class="icon-forward"
                        label="Przekaż dalej"
                        :disabled="false"
                        reply-type="forward"
                />
                <base-widget
                        icon-class="icon-bin"
                        label="Usuń"
                        :disabled="false"
                />
            </template>

            <template v-slot:buttons-right>
                <div class="text-right">
                    <b-dropdown v-if="message" variant="light">
                        <template v-slot:button-content>
                            <i class="icon-eye"/> Widok {{ viewHTML ? 'HTML' : 'tekstowy' }}
                        </template>

                        <b-dropdown-item v-if="!!message.textHtml" @click="viewHTML = true">Widok HTML</b-dropdown-item>
                        <b-dropdown-item v-if="!!message.textPlain" @click="viewHTML = false">Widok tekstowy</b-dropdown-item>
                    </b-dropdown>
                </div>
            </template>

        </toolbar>

        <div v-if="message">

            <div class="card-body">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h5 class="mb-1">{{ message.subject }}</h5>
                        <div><strong>Od: </strong><contact :name="message.from.name" :email="message.from.email"/></div>
                        <div><strong>Do: </strong><contact v-for="(contact, key) in message.to" :name="contact.name" :email="contact.email" :key="key"/></div>
                        <div v-if="message.cc.length > 0"><strong>Kopia: </strong><contact v-for="(contact, key) in message.cc" :name="contact.name" :email="contact.email" :key="key"/></div>
                        <div v-if="message.bcc.length > 0"><strong>Ukryta kopia: </strong><contact v-for="(contact, key) in message.bcc" :name="contact.name" :email="contact.email" :key="key"/></div>
                    </div>

                    <div class="col-2 text-right">
                        <div class="font-weight-bolder">{{ getTime() }}</div>
                        <div>{{ getDate() }}</div>
                    </div>
                </div>
            </div>

            <div class="card-body" v-if="message.attachments.length">
                <attachment v-for="attachment in message.attachments" :key="attachment.id" v-bind="attachment"/>
            </div>


            <div class="card-body">
                <div v-if="viewHTML">
                    <iframe :srcdoc="message.textHtml" frameborder="0" style="width: 100%; height: 700px"></iframe>
                </div>
                <pre v-else>
                    {{ message.textPlain }}
                </pre>
            </div>

        </div>

    </div>


</template>

<script>
    import dateHelper from "../utils/dateHelper";
    import Contact from "./email/Contact";
    import Attachment from "./email/Attachment";
    import Toolbar from "./Toolbar";
    import BaseWidget from "./Toolbar/BaseWidget";
    import ReplyWidget from "./Toolbar/ReplyWidget";

    export default {
        name: "EmailRead",
        components: {Contact, Attachment, Toolbar, BaseWidget, ReplyWidget},

        data() {
            return {
                message: null,
                viewHTML: true
            }
        },

        created() {

            this.$parent.$emit('busy', true);

            this.$store.dispatch('fetchMessage')
            .then(({data}) => {
                if (data.data) {
                    this.message = data.data;
                    this.viewHTML = !!this.message.textHtml;
                }
            })
            .catch(error => {})
            .finally(() => {
                this.$parent.$emit('busy', false);
            })
        },

        methods: {
            getTime() {
                return dateHelper.getTime(this.message.date);
            },

            getDate() {
                return dateHelper.getDate(this.message.date);
            }
        }
    }
</script>

<style scoped>

</style>