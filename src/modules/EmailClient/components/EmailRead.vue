<template>

    <div>
        <toolbar>
            <template v-slot:buttons-left>

                <reply-action v-for="(widget, key) in widgets.replyWidgets"
                        :icon-class="widget.icon"
                        :label="widget.label"
                        :disabled="false"
                        :reply-type="widget.replyType"
                        :message-uuid="$store.state.activeMessage"
                        :key="key"
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

        <overlay :show="busy">
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
        </overlay>

    </div>


</template>

<script>
    import dateHelper from "../utils/dateHelper";
    import Contact from "./email/Contact";
    import Attachment from "./email/Attachment";
    import Toolbar from "./Toolbar";
    import BaseWidget from "./Toolbar/BaseWidget";
    import ReplyAction from "./Toolbar/ReplyAction";
    import StateControl from "../utils/StateControl";
    import Overlay from "../utils/Overlay";

    export default {
        name: "EmailRead",
        extends: StateControl,
        components: {Contact, Attachment, Toolbar, BaseWidget, ReplyAction, Overlay},

        data() {
            return {
                message: null,
                viewHTML: true,

                widgets: {
                    replyWidgets: [
                        { icon: 'icon-reply', label: 'Odpowiedz', replyType: 'reply' },
                        { icon: 'icon-reply-all', label: 'Odpowiedz wszystkim', replyType: 'replyAll' },
                        { icon: 'icon-forward', label: 'Przekaż', replyType: 'forward' },
                    ],
                }
            }
        },

        created() {

            this.$store.dispatch('fetchSingleMessage')
            .then(({data}) => {
                if (data.data) {
                    this.message = data.data;
                    this.viewHTML = !!this.message.textHtml;
                }
            })
            .catch(error => {})
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