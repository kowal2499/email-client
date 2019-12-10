import Vue from "vue";
import App from "./App.vue";
import store from './modules/EmailClient/store';

import BaseSelect from "./components/Form/Select/BaseSelect";
import BaseCheckbox from "./components/Form/CheckBox/BaseCheckbox";
import BaseCheckboxSelect from "./components/Form/Select/BaseCheckboxSelect";
import BaseCheckboxDropdownSelect from "./components/Form/DropdownSelect/BaseCheckboxDropdownSelect";
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

// VueFroala
import 'froala-editor/css/froala_editor.pkgd.min.css';
import VueFroala from 'vue-froala-wysiwyg';
Vue.use(VueFroala);

new Vue({
  components: {BaseSelect, BaseCheckbox, BaseCheckboxSelect, BaseCheckboxDropdownSelect},
  store,
  render: h => h(App)
}).$mount("#app");
