async function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length) {
                resolve(tabs[0])
            } else {
                reject(null)
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

async function getlocal(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (res) => {
            if (res && res[key]) { resolve(res[key]) } else {
                resolve(null)
            }
        });
    })
}

async function removelocal(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, () => {
            resolve()
        });
    })
}

async function queryTab(option = {}) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(option, (tabs) => {
            resolve(tabs)
        });
    })
}

async function createTab(option) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create(option, (tab) => resolve(tab))
    })
}

const api = {
    getCurrentTab,
    savelocal,
    getlocal,
    removelocal,
    queryTab,
    createTab,
}

export default api


