import axios from 'axios'


var baseUrl = 'http://api.konjac.fun'
var baseUrlComplete = false
const api = {
    login: () => baseUrl + '/sign/login',
    sendRegisterCaptcha: () => baseUrl + '/sign/sendRegisterCaptcha',
    register: () => baseUrl + '/sign/register',
    username: () => baseUrl + '/sign/username',

    passwordCaptcha: () => baseUrl + '/sign/passwordCaptcha',
    password: () => baseUrl + '/sign/password',

    userinfo: () => baseUrl + '/account/userinfo',
    script: () => baseUrl + '/public/script',
    scriptVersion: () => baseUrl + '/public/script/version',
    work: (id) => `${baseUrl}/v1.0/translation/work/${id ? id : ''}`,
    user: (id) => `${baseUrl}/public/user/${id ? id : ''}`
}



chrome.storage.local.get(['netconfig'], (res) => {
    if (res && res.netconfig) { baseUrl = res.netconfig }
    baseUrlComplete = true
});


async function complete() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['netconfig'], (res) => {
            baseUrlComplete = true
            if (res && res.netconfig) { baseUrl = res.netconfig }
            resolve()
        });
    })
}


async function headers() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['konjac_user'], (result) => {
            if (result && result.konjac_user) {
                resolve({
                    authorization: result.konjac_user.token
                })
            } else {
                resolve({})
            }
        })
    });
}

async function getUserList(params) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.user(params),
        method: 'get',
    })
}


async function login(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.login(),
        method: 'POST',
        data: data
    })
}


async function sendRegisterCaptcha(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.sendRegisterCaptcha(),
        method: 'POST',
        data: data
    })
}

async function register(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.register(),
        method: 'POST',
        data: data
    })
}

async function passwordCaptcha(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.passwordCaptcha(),
        method: 'POST',
        data: data
    })
}

async function resetPassword(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.password(),
        method: 'PUT',
        data: data
    })
}

async function getUserinfo(data) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.userinfo(),
        method: 'GET',
        params: data,
        headers: header
    })
}

async function setUserinfo(data) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.userinfo(),
        method: 'PUT',
        data: data,
        headers: header
    })
}

async function checkUsername(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.username(),
        method: 'POST',
        data: data,
    })
}

async function getScript(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.script(),
        method: 'GET',
        params: data
    })
}

async function getScriptVersion(data) {
    if (!baseUrlComplete) { await complete() }
    return axios.request({
        url: api.scriptVersion(),
        method: 'GET',
        params: data
    })
}

async function createWork(data) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.work(),
        method: 'POST',
        data: data,
        headers: header
    })
}

async function updateWork(id, data) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.work(id),
        method: 'PUT',
        data: data,
        headers: header
    })
}

async function getWorkList(data) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.work(),
        method: 'GET',
        params: data,
        headers: header
    })
}

async function getWork(id) {
    if (!baseUrlComplete) { await complete() }
    let header = await headers()
    return axios.request({
        url: api.work(id),
        method: 'GET',
        headers: header
    })
}

const ex = {
    login,
    sendRegisterCaptcha,
    register,
    getScript,
    getScriptVersion,
    createWork,
    updateWork,
    getWorkList,
    getWork,
    getUserinfo,
    setUserinfo,
    checkUsername,
    passwordCaptcha,
    resetPassword,
    getUserList
}

export default ex