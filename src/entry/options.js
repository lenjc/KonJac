import Vue from 'vue'
import App from '../view/options.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false
Vue.use(Antd);
import Router from 'vue-router'

Vue.use(Router);


import router from '../router/options'

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app')