import VueRouter from 'vue-router'

import home from '../view/options/home.vue'
import local from '../view/options/local.vue'
import online from '../view/options/online.vue'
import account from '../view/options/account.vue'
import login from '../view/options/login.vue'
import register from '../view/options/register.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: home,
    redirect: '/local',
    children: [{
        path: '/local',
        name: 'local',
        component: local,
        meta: { title: '本地工作区' }
    },
    {
        path: '/online',
        name: 'online',
        meta: { requireAuth: true, title: '在线项目' },
        component: online,
    },
    {
        path: '/account',
        name: 'account',
        meta: { requireAuth: true, title: '本地工作区' },
        component: account,
    },
    ]
},
{
    path: '/login',
    name: 'login',
    component: login,
    meta: { title: '登录' }
},
{
    path: '/register',
    name: 'register',
    component: register,
    meta: { title: '注册' }
},
]

const router = new VueRouter({
    routes: routes
})

async function getlocal(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (res) => {
            if (res && res[key]) { resolve(res[key]) } else {
                resolve(null)
            }
        });
    })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}


router.beforeEach(async (to, from, next) => {
    try {
        if (to.meta.title) { document.title = `KonJac - ${to.meta.title}` }
        if (to.matched.some(record => record.meta.requireAuth)) {
            let token = await getlocal('konjac_user')
            if (!token) { next({ path: '/login', }) }
        }
        return next()
    } catch (error) {
        return next()
    }
})

export default router