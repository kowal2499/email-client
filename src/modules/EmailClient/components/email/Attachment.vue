<template>
    <a href="#" :disabled="busy" @click.prevent="downloadFile()">

        <div class="attachment">
            <div class="icon" :class="{'anim': busy}"><i :class="getIcon()"></i></div>
            <div class="description">{{ name }}</div>
        </div>

    </a>
</template>

<script>
    import ApiDealerX from '../../api/ApiDealerX';

    export default {
        name: "Attachment",
        props: ['extension', 'id', 'name', 'messageId'],

        computed: {
            url() {
                return `mailbox/message/${this.$store.state.activeMessage}/attachment/${this.id}`;
            },
        },

        methods: {
            getIcon() {
                let iconName = '';

                if (this.busy) {
                    iconName = 'icon-spinner3';
                } else {
                    switch (this.extension.toLowerCase()) {
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                            iconName = 'icon-file-picture';
                            break;
                        case 'xls':
                        case 'xlsx':
                            iconName = 'icon-file-excel';
                            break;
                        case 'doc':
                        case 'docx':
                            iconName = 'icon-file-word';
                            break;
                        case 'pdf':
                            iconName = 'icon-file-pdf';
                            break;
                        case 'odt':
                        case 'ods':
                            iconName = 'icon-file-openoffice';
                            break;
                        case 'ppt':
                        case 'pptx':
                        case 'odp':
                            iconName = 'icon-file-presentation';
                            break;
                        default:
                            iconName = 'icon-file-text2';
                            break;
                    }
                }
                return iconName;
            },

            downloadFile() {

                this.busy = true;
                ApiDealerX.get(this.url, {responseType: 'blob'})
                   .then((response) => {
                       let fileURL = URL.createObjectURL(response.data);
                       window.open(fileURL);
                   })
                    .finally(() => { this.busy = false; })
               ;
            }

        },

        data() {
            return {
                busy: false
            }
        }
    }

</script>

<style lang="scss" scoped>
    a {
        display: inline-block;
        margin-right: 0.2rem;

        .attachment {
            display: flex;
            padding: 0.4rem;

            .icon {
                width: 30px;
                text-align: center;

                &.anim {
                    animation: anim-rotate 2s infinite linear;
                }

            }


        }
        &:hover .attachment {
            cursor: pointer;
            background-color: #dddddd;
        }

        @keyframes anim-rotate {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
</style>