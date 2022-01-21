
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case 'editor-data':
        case 'editor-translation':
            sendResponse({ code: 0, sender: 'background.html' });
            editor2Data(request)
            break;
        case 'tab-insertCSS':
            sendResponse({ code: 0, sender: 'background.html' });
            insertCSS()
            break
        case 'ajax':
            axios(request.params).then(res => { sendResponse(res.data) }).catch(err => { sendResponse(err) })
            break
        case 'readingMode':
            getCode(request.url).then(res => { sendResponse(res) })
            break
        case 'image':
            let img = new Image
            img.src = request.params.src
            img.onload = () => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d')
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0, img.width, img.height);
                let src = canvas.toDataURL('image/png');
                sendResponse(src);
            }
            break
        case 'storage-get':
            chrome.storage.local.get([request.key], (res) => {
                sendResponse(res);
            });
            break
        case 'storage-set':
            chrome.storage.local.set(request.item, (res) => { sendResponse(res); });
            break
        case 'notifications':
            notifications(request.params)
            break
        case 'baseUrl':
            sendResponse(baseUrl)
            break
        case 'translator':
            createTab({
                url: chrome.runtime.getURL('user.html') + '#/' + request.id,
                active: true
            })
            break
        default:
            break;
    }
    return true
});


async function notifications(params) {
    let message = {}
    Object.assign(message, {
        type: 'basic',
        iconUrl: 'img/icon.png',
        title: 'KonJac',
    }, params)
    chrome.notifications.create('KonJac', message);
}



var baseUrl = 'http://localhost:4000'
const api = {
    translation: () => baseUrl + '/public/translation',
    script: () => baseUrl + '/public/script',
}

chrome.storage.local.get(['netconfig'], (res) => { if (res && res.netconfig) { baseUrl = res.netconfig } });

async function ajax(params) {
    return new Promise((resolve, rejcet) => {
        axios(params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                resolve(err)
            })
    })
}

async function insertCSS() {
    let tabs = await queryTab({ active: true })
    chrome.tabs.insertCSS(tabs[0].id, { file: 'css/konjac.css' });
}


async function editor2Data(data) {
    try {
        if (data.tabId == 'new') {
            let tab = await createTab({ url: chrome.runtime.getURL('editor.html'), active: false })
            data.tabId = tab.id
        }
        chrome.tabs.update(data.tabId, { active: true })
        await sendMessage(data.tabId, data)
    } catch (error) {
        console.error(error)
        setTimeout(() => { editor2Data(data) }, 1 * 1000);
    }
}
async function queryTab(options = {}) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(options, (tabs) => {
            resolve(tabs)
        });
    })
}

async function createTab(option) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create(option, (tab) => resolve(tab))
    })
}

async function sendMessage(tabId, message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (response) { resolve(response) } else { reject(response) }
        });
    })
}

function toConnectSrcipt(data) {
    getCurrentTabId((tabId) => {
        var port = chrome.tabs.connect(tabId, { name: 'connect-script' });
        port.postMessage(data);
    });
}

function getCurrentTabId(callback) {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    } catch (error) {
        console.error(error)
    }
}



async function getCode(url) {
    try {
        let list = await getlocal('srcipt_list')
        let host = url.split('/')[2]
        list = JSON.parse(list)
        list = list ? list : []
        let match = list.find(ele => {
            let reg = new RegExp(ele.match);
            return ele.host.includes(host) && reg.test(url)
        })
        if (!match) {
            let res = await ajax({ url: api.script(), method: 'GET', params: { host: host } })
            if (res.result) {
                let { codeMin, ...srcipt } = res.result
                srcipt.id = uuidv4()
                srcipt.source = 'konjac'
                list.push(srcipt)
                await savelocal({ 'srcipt_list': JSON.stringify(list) })
                await savelocal({ [`script-${srcipt.id}`]: codeMin })
                return Promise.resolve(codeMin)
            }
            return Promise.reject({ code: 1, message: '无匹配脚本' })
        }
        let code = await getlocal(`script-${match.id}`)
        return Promise.resolve(code)
    } catch (error) {
        return Promise.reject(error)
    }
}

async function getlocal(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (res) => {
            if (res && res[key]) { resolve(res[key]) } else {
                resolve(null)
            }
        });
    })
}

async function savelocal(item = {}) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(item, () => {
            resolve()
        });
    })
}

