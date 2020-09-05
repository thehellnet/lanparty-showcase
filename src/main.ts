import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import vuescroll from "vuescroll";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(vuescroll, {
  ops: {
    bar: {
      disable: true,
    },
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
