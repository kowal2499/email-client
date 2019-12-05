import Vue from "vue";
import App from "./App.vue";
import store from './modules/EmailClient/store';

import BaseSelect from "./components/Form/Select/BaseSelect";
import BaseCheckbox from "./components/Form/CheckBox/BaseCheckbox";
import BaseCheckboxSelect from "./components/Form/Select/BaseCheckboxSelect";
import BaseCheckboxDropdownSelect from "./components/Form/DropdownSelect/BaseCheckboxDropdownSelect";
import BootstrapVue from 'bootstrap-vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  components: {BaseSelect, BaseCheckbox, BaseCheckboxSelect, BaseCheckboxDropdownSelect},
  store,
  render: h => h(App)
}).$mount("#app");
