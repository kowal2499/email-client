import Vue from "vue";
import App from "./App.vue";
import store from './modules/EmailClient/store';

import BaseSelect from "./components/Form/Select/BaseSelect";
import BaseCheckbox from "./components/Form/CheckBox/BaseCheckbox";
import BaseCheckboxSelect from "./components/Form/Select/BaseCheckboxSelect";
import BaseCheckboxDropdownSelect from "./components/Form/DropdownSelect/BaseCheckboxDropdownSelect";
import VueFlashes from './plugins/Flash/flash.js';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

// VueFroala
import 'froala-editor/css/froala_editor.pkgd.min.css';
import VueFroala from 'vue-froala-wysiwyg';
Vue.use(VueFroala);

Vue.use(VueFlashes);

Vue.config.productionTip = false;

new Vue({
  components: {BaseSelect, BaseCheckbox, BaseCheckboxSelect, BaseCheckboxDropdownSelect},
  store,
  render: h => h(App)
}).$mount("#app");
