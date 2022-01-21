import Vue from 'vue'
import App from '../view/popup.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'

// import Router from 'vue-router'
import Router from 'vue-router'

Vue.use(Router);
Vue.config.productionTip = false
Vue.use(Antd);
Vue.prototype.$axios = axios  

import router from '../router/popup.js'

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
// Vue.use(router)

