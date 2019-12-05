<template>
  <div id="app"  class="p-5">
    <email-client/>
  </div>
</template>

<script>

  import EmailClient from "./modules/EmailClient/EmailClient";

  export default {
    name: "BaseLayout",
    components: {EmailClient}
  }
</script>

<style lang="scss">
  @import "./assets/scss/app.scss";
</style>
