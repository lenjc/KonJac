import VueRouter from 'vue-router'

import Home from '../view/popup/home.vue'
import script from '../view/popup/script.vue'
import scriptEdit from '../view/popup/scriptEdit.vue'
import tabs from '../view/popup/tabs.vue'
import newItem from '../view/popup/newItem.vue'
import netconfig from '../view/popup/netconfig.vue'
import readConfig from '../view/popup/readConfig.vue'

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    
    {
        path: '/script',
        name: 'script',
        component: script
    },
    {
        path: '/scriptEdit',
        name: 'scriptEdit',
        component: scriptEdit
    },
    {
        path: '/tabs',
        name: 'tabs',
        component: tabs
    },

    {
        path: '/newItem',
        name: 'newItem',
        component: newItem
    },
    {
        path: '/netconfig',
        name: 'netconfig',
        component: netconfig
    },
    {
        path: '/readConfig',
        name: 'readConfig',
        component: readConfig
    },
]

const router = new VueRouter({
    routes: routes
})

export default router