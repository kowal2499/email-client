export default {
    name: "FlagUpdate",

    methods: {
        update(uuids, flagName, flagState) {

            if (uuids.length === 0) {
                return;
            }

            return new Promise((resolve, reject) => {
                this.$store.dispatch('setFlag', {
                    uuids,
                    flagName,
                    flagState
                })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    })
            });

        }
    }
}