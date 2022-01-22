
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { sendResponse({ msg: 'ready' }); });


async function callbackground(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, function (response) {
            resolve(response)
        });
    })
}

this.currentPage = 0
this.haveread = false

var baseUrl = 'http://localhost:3000'
const api = {
    translation: () => baseUrl + '/public/translation',
    script: () => baseUrl + '/public/script',
}
callbackground({ type: 'baseUrl' }).then(res => { baseUrl = res })

async function konjacNotification(msg, duration = 3000) {
    if ($('#konjacNotification').length) {
        $('#konjacNotification > div:nth-child(2)').text(msg)
        $('#konjacNotification').show('fast')
    } else {
        $('body').prepend(`<div id='konjacNotification' style='
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000000;
            padding:5px 10px;
            background-color: #fff;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            font-family: 微软雅黑, Microsoft YaHei, sans-serif;
            font-weight: normal;
            font-size: medium;
            user-select: none;
        '><div>KonJac : </div><div>${msg}</div></div>`)
    }
    if (duration) {
        setTimeout(() => { $('#konjacNotification').hide('fast') }, duration);
    }
}
// 监听长连接
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == 'connect-script') {
        port.onMessage.addListener(function (msg) {
            switch (msg.type) {
                case 'readingMode':
                    readingMode(msg)
                    break;
                case 'cookingMode':
                    cookingMode(msg)
                    break;
                default:
                    console.log(msg)
                    break;
            }
        });
    }
});

checkKonJacURL()
async function checkKonJacURL() {
    let konjac = new RegExp(/KonJac[a-z0-9]{24}Z/)
    if (konjac.test(location.href)) {
        let code = await callbackground({ type: 'readingMode', url: location.href })
        this.konjacQuery = location.href.match(/KonJac[a-z0-9]{24}Z/)[0].replace(/(^KonJac)|(Z$)/g, '')
        readingMode({ code: code })
    }
}


async function htmlGenerator(code, data) {
    switch (code) {
        case 'konjacLoad':
            let skip = data.rules ? data.rules.length ? data.rules[0].skip : 0 : 0
            $('#konjacLoad').append(`
            <div class='konjacLoad' data-id='${data.translation_id}' style='display:none'>
            <div><div title='${data.title}'>${data.title}</div>
            <div title='查看 ${data.avatar} 账号'>[译]:<a class='translator' data-id='${data.creator}'> ${data.avatar}</a></div>
            </div>
            <div>
            <div class='konjacButton' title='卸载' data-id='${data.translation_id}'>
            <svg t="1640691742897" class="icon" viewBox="0 0 1024 1024" version="1.1" fill='#37474F' xmlns="http://www.w3.org/2000/svg" p-id="4312" width="200" height="200"><path d="M512 128l184 192H544v448h-64V320H328l184-192z m384 384h-64v320H192V512h-64v384h768V512z" p-id="4313"></path></svg>
            </div>          
            <div title='调整页数'>
            <input type='number' data-id='${data.translation_id}'  value='${skip}'/>
            </div>
            </div>     
            </div>`)
            if (data.message) {
                $('#konjacMessage').append(`
            <div data-id='${data.translation_id}' class='konjacMessage' >
            <div>${data.avatar}</div>
            <p class='konjacBubbleTail'>${data.message}</p>
            </div>`)
            }
            $(`.konjacLoad[data-id='${data.translation_id}']`).show('fast', () => {
                $('#konjacLoadEmpty').hide('fast')
            })
            $(`.konjacLoad[data-id='${data.translation_id}'] input[type='number']`).change((e) => {
                $(`div.konjacItemContainer[data-id='${e.currentTarget.dataset.id}']`).remove()
                $(`img.konjacItemClip[data-id='${e.currentTarget.dataset.id}']`).remove()
                $(`svg.konjacItemSVG[data-id='${e.currentTarget.dataset.id}']`).remove()
                let data = this.translation.find(ele => ele.translation_id == e.currentTarget.dataset.id)
                if (data) { loadTranslation(data, e.target.value * 1) }
            })
            $(`.konjacLoad[data-id='${data.translation_id}'] div.konjacButton`).click((e) => {
                e.stopPropagation();
                $(e.currentTarget.parentElement.parentElement).hide('fast', () => {
                    $(e.currentTarget.parentElement.parentElement).remove()
                    if (!$('.konjacLoad').length) { $('#konjacLoadEmpty').show('fast') }
                })
                $(`div.konjacItemContainer[data-id='${e.currentTarget.dataset.id}']`).remove()
                $(`img.konjacItemClip[data-id='${e.currentTarget.dataset.id}']`).remove()
                $(`svg.konjacItemSVG[data-id='${e.currentTarget.dataset.id}']`).remove()
                $(`div.konjacMessage[data-id='${e.currentTarget.dataset.id}']`).remove()
                let data = this.translation.find(ele => ele.translation_id == e.currentTarget.dataset.id)
                if (data && !$(`.konjacSource[data-id='${data.translation_id}']`).length) { htmlGenerator('konjacSource', data) }
            })
            $(`.konjacLoad[data-id='${data.translation_id}'] a.translator`).click(e => {
                callbackground({ type: 'translator', id: e.currentTarget.dataset.id })
            })

            loadTranslation(data, skip)
            break;
        case 'konjacSource':
            $('#konjacSource').append(`
            <div class='konjacSource' data-id='${data.translation_id}' style='display:none'>
            <div class='konjacButton' title='装载'><svg t="1640691716396" class="icon" viewBox="0 0 1024 1024" fill='#37474F' version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4173" width="200" height="200"><path d="M328 576h152V128h64v448h152L512 768 328 576z m568-64h-64v320H192V512h-64v384h768V512z" p-id="4174"></path></svg></div>
            <div><div title='${data.title}'>${data.title}</div><div title='${data.avatar}'>[译]:${data.avatar}</div></div></div>`)
            $(`.konjacSource[data-id='${data.translation_id}']`).show('fast', () => {
                $('#konjacSourceEmpty').hide('fast')
            })
            $(`.konjacSource[data-id='${data.translation_id}'] div.konjacButton`).click((e) => {
                e.stopPropagation();
                let id = $(e.currentTarget.parentElement).attr('data-id')
                $(e.currentTarget.parentElement).hide('fast', () => {
                    $(e.currentTarget.parentElement).remove()
                    if (!$('.konjacSource').length) { $('#konjacSourceEmpty').show('fast') }
                })
                let item = this.source.find(ele => ele.translation_id == id)
                if (!item) {
                    item = this.translation.find(ele => ele.translation_id == id)
                    if (!item) { return }
                }
                if (!this.translation.includes(item)) { this.translation.push(item) }
                if (!$(`.konjacLoad[data-id='${item.translation_id}'] div.konjacButton`).length) { htmlGenerator('konjacLoad', item) }
            })
            break
        case 'initSource':
            if (!data.data.length) {
                konjacNotification('无可用译文');
                return
            }
            if (data.pageNo > 1) {
                this.source = this.source.concat(data.data)
            } else {
                this.source = data.data
                $('.konjacSource').remove()
            }
            if (!this.translation) {
                this.translation = []
            }
            for (let index = 0; index < data.data.length; index++) {
                const element = data.data[data.data.length - 1 - index]
                await htmlGenerator('konjacSource', element)
            }
            break
        default:
            break;
    }
    return Promise.resolve()
}

async function loadTranslation(element, skip) {
    let body = typeof element.body == 'string' ? JSON.parse(element.body) : element.body

    for (let i = 0; i < body.length; i++) {
        const ele = body[i];
        let index = ele.index + skip
        if (index < 0 || index > ($('.konjacImage').length - 1)) { continue }
        let img = $('.konjacImage')[index]
        let zoom = img.height / ele.height

        for (let b = 0; b < ele.item.length; b++) {
            const item = ele.item[b];
            if (!item.show) continue
            switch (item.type) {
                case 'text':
                    $('.konjacContainer').eq(index).append(
                        `<div data-id='${element.translation_id}' id='konjacItem-${item.uid}' class='konjacItemContainer' style='${obj2css(item.container)};${item.customContainer};top:${item.top * zoom}px;left:${item.left * zoom}px;zoom:${zoom}!important;z-index:${b+1}' >
                  <div class='konjacItemBackground' style='${obj2css(item.style, item.background)};${item.customBackground}!important;' >${item.body}</div>
                        <div class='konjacItemStyle' style='${obj2css(item.style)}${item.customStyle}!important;'>${item.body}</div>
                    <div>`
                    )
                    break;
                case 'clip':
                    createClip(img, item, zoom).then(clip => {
                        $('.konjacContainer').eq(index).append(
                            `<img data-id='${element.translation_id}' id='konjacItem-${item.uid}'  class='konjacItemClip'  style='top:${item.top * zoom}px;left:${item.left * zoom}px;zoom:${zoom};z-index:${b+1}' src='${item.src}' />`
                        )
                        body.forEach(ele => {
                            ele.item.forEach(items => {
                                if (items.quote && items.quote.length) {
                                    items.quote.forEach(quote => {
                                        if (quote.uid == clip.uid && quote.type == 'clip') {
                                            if ($(`#konjacItem-${items.uid}`)) {
                                                $(`#konjacItem-${items.uid}`).css('background-image', `url(${clip.src})`)
                                            }
                                            items["container"]["background-image"] = `url(${clip.src})`
                                        }
                                    })
                                }
                            })
                        })
                    })
                    break
                case 'svg':
                    $('.konjacContainer').eq(index).append(`
                    <svg xmlns="http://www.w3.org/2000/svg" data-id='${element.translation_id}' id='konjacItem-${item.uid}' class='konjacItemSVG' style="${obj2css(item.style)};top:${item.top * zoom}px;left:${item.left * zoom}px;zoom:${zoom};z-index:${b+1}">
                    <g transform="translate(${-item.translate.x},${-item.translate.y})">${item.body}</g></svg>`)
                    if (item.attributes) {
                        for (const key in item.attributes) {
                            $(`#konjacItem-${item.uid}`).attr({
                                [key]: item.attributes[key]
                            })
                        }
                    }
                    break
                default:
                    break;
            }

        }

    }
}

function obj2css(...obj) {
    let style = Object.assign({}, ...obj)
    let css = ''
    for (const key in style) {
        css += `${key}:${style[key]};`
    }
    return css
}

async function createClip(image, clip, zoom) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!image.complete) {
                image.onload = async () => {
                    let res = await canvas2src(image, clip, zoom);
                    resolve(res)
                }
            } else {
                let res = await canvas2src(image, clip, zoom);
                resolve(res)
            }
        } catch (error) {
            if (error.code * 1 == 18) {
                let src = await callbackground({ type: 'image', params: { src: image.src, } })
                image.src = src
                image.onload = async () => {
                    let res = await canvas2src(image, clip, zoom);
                    resolve(res)
                }
            } else {
                resolve(clip)
            }
        }
    })

}

async function canvas2src(image, clip, zoom) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d')
    canvas.width = clip.position.width * zoom
    canvas.height = clip.position.height * zoom
    ctx.translate(-clip.position.x * zoom, -clip.position.y * zoom)
    switch (clip.shape) {
        case 'rect':
            ctx.rect(clip.position.x * zoom, clip.position.y * zoom, clip.body.width * zoom, clip.body.height * zoom)
            break;
        case 'path':
            let path = getPointFromPath(clip.body)
            ctx.beginPath()
            path.forEach(ele => {
                switch (ele.type) {
                    case 'M':
                        path += `M${ele.x * zoom},${ele.y * zoom}`
                        ctx.moveTo(ele.x * zoom, ele.y * zoom)
                        break
                    case 'L':
                        path += `L${ele.x * zoom},${ele.y * zoom}`
                        ctx.lineTo(ele.x * zoom, ele.y * zoom)
                        break;
                    case 'Q':
                        path += `Q${ele.params.x1},${ele.params.y1},${ele.x * zoom},${ele.y * zoom}`
                        ctx.quadraticCurveTo(ele.params.x1, ele.params.y1, ele.x * zoom, ele.y * zoom)
                        break;
                    case 'C':
                        path += `C${ele.params.x1},${ele.params.y1},${ele.params.x2},${ele.params.y2},${ele.x * zoom},${ele.y * zoom}`
                        ctx.bezierCurveTo(ele.params.x1, ele.params.y1, ele.params.x2, ele.params.y2, ele.x * zoom, ele.y * zoom)
                        break;
                }
            })
            ctx.closePath()
            ctx.clip()
            break
    }
    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.restore();
    return new Promise((resolve, reject) => {
        try {
            let src = canvas.toDataURL('image/png');
            clip.src = src
            resolve(clip)
        } catch (error) {
            reject(error)
        }
    })
}







async function readingMode(data) {
    try {
        eval(data.code)
        if (typeof ready == 'function') {
            try {
                await ready()
                if (!this.data) {
                    konjacNotification('正在准备中···', 0)
                    this.data = await getData()
                }
                if (!$('#konjac').length) {
                    callbackground({ type: 'tab-insertCSS', });
                    initReading()
                } else {
                    $('body').attr({ style: 'overflow:hidden' })
                    $('#konjac').show()
                }
            } catch (error) {
                let waitTime = 0
                let waitForReady = setInterval(async () => {
                    waitTime++
                    if (waitTime > 60) { clearInterval(waitForReady) }
                    ready().then(async () => {
                        clearInterval(waitForReady)
                        if (!this.data) {
                            konjacNotification('正在准备中···', 0);
                            this.data = await getData()
                        }
                        if (!$('#konjac').length) {
                            callbackground({
                                type: 'tab-insertCSS',
                            });
                            initReading()
                        } else {
                            $('body').attr({ style: 'overflow:hidden' })
                            $('#konjac').show()
                        }
                    })
                }, 1000);
            }
        } else {
            if (!this.data) {
                konjacNotification('正在准备中···', 0);
                this.data = await getData()
            }
            if (!$('#konjac').length) {
                callbackground({ type: 'tab-insertCSS', });
                initReading()
            } else {
                $('body').attr({ style: 'overflow:hidden' })
                $('#konjac').show()
            }
        }
    } catch (error) {

    }
}



async function initReading() {
    let config = await callbackground({ type: 'storage-get', key: 'konjac-config' })
    this.config = config ? config['konjac-config'] ? config['konjac-config'] : { mode: 'scroll', page: 2, index: 0, turn: 'left' } : { mode: 'scroll', page: 2, index: 0, turn: 'left' }
    $('body').attr({ style: 'overflow:hidden' })
    $('body').prepend(`
	<div id='konjac' >    
    <div id='konjacHeader'>
        <div class='konjacAbsoluteCenter'>
        ${this.data.title ? this.data.title : ''}${this.data.chapter ? `- ${this.data.chapter}` : ''}
        </div>       
        <div id='konjacExit'>退出 </div>
    </div>
    <div id='konjacContent' >
        <div id='konjacContainer' class='konjacContainerUnfold'>            
            <div id='konjacBlankPage' ></div>
        </div>	  
        <div id='konjacFold'>
        <svg t="1642595766805" class="icon" fill='#37474F' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26548" width="20" height="20"><path d="M538.112 1001.472h-48.64c-6.144 0-11.776-0.512-15.36-6.656-3.072-6.144 1.024-10.24 4.096-14.848 107.52-137.216 214.528-274.432 322.048-412.16 12.8-15.872 25.088-32.256 37.888-48.128 3.584-4.608 4.096-7.68 0-12.8-57.856-73.728-116.224-147.456-173.568-221.184-62.464-79.36-124.416-159.232-186.368-239.104-3.584-4.096-7.168-8.704-4.096-14.848 3.072-5.632 8.704-6.656 14.336-6.656h99.84c11.264 0 18.944 6.144 25.6 14.848 71.168 91.136 142.336 181.76 213.504 272.896 44.032 56.32 88.064 112.64 132.096 169.472 17.408 22.016 17.408 40.96 0.512 62.464-95.744 122.368-191.488 245.248-287.744 367.616-19.456 25.088-39.424 50.176-58.88 75.776-7.68 10.24-16.896 14.848-29.184 14.336-15.36-1.536-30.72-1.024-46.08-1.024z" fill="#3D403F" p-id="26549"></path><path d="M117.248 1001.472h-48.64c-6.144 0-12.8 0.512-16.384-7.168-3.072-7.168 1.536-11.264 5.12-15.872 76.288-97.28 152.064-195.072 228.352-292.352 42.496-54.272 84.992-109.056 128-162.816 6.144-7.68 6.656-12.288 0-19.968-117.76-150.016-235.52-300.544-353.28-451.072-2.048-2.56-3.584-4.608-5.632-7.168-7.168-10.752-3.584-18.944 9.728-19.968 8.192-0.512 16.384 0 24.064 0h72.704c12.288 0 20.992 4.096 28.672 13.312 115.712 147.968 231.424 296.448 347.136 444.416 16.896 21.504 16.896 39.936 0 61.44-115.712 147.968-230.912 295.424-346.624 443.392-7.68 9.728-16.896 14.848-29.696 14.336-13.312-1.024-28.672-0.512-43.52-0.512z" p-id="26550"></path></svg>
        </div>
        <div id='konjacSider'>    
            <div id='konjacTitle'>
                <div>${this.data.title ? this.data.title : ''}</div>
                <div>${this.data.chapter ? this.data.chapter : ''}</div>
            </div>
        <div id='konjacConfig'>   
            <span class='konjacColumn'>阅读设置</span>
            <div class='konjacConfigParams'>  
                <div style='width:100%;color: #455A64;'>      
                    显示比例： <input id='konjacZoom' min='10' max='990' onfocus="this.blur();" type='number' step='5' value='100' />%
                </div>
                <div id='konjacConfigMode-size'>                    
                    <div class='konjacConfigMode-size' data-type='1' title='适应高度'>
                    <svg t="1642561512255" class="icon" fill='#37474F' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  p-id="2457" width="20" height="20"><path d="M32 32v960h956.8V32H32z m896 896H96V96h832v832z" p-id="2458"></path><path d="M361.6 384c-6.4-6.4-6.4-19.2 0-25.6l140.8-140.8c6.4-6.4 19.2-6.4 25.6 0l140.8 140.8c6.4 6.4 6.4 19.2 0 25.6M665.6 640c6.4 6.4 6.4 19.2 0 25.6l-140.8 140.8c-6.4 6.4-19.2 6.4-25.6 0l-140.8-140.8c-6.4-6.4-6.4-19.2 0-25.6" p-id="2459"></path></svg>
                    </div> 
                    <div class='konjacConfigMode-size' data-type='0' title='原始比例'>
                    <svg t="1642596498105" class="icon" fill='#37474F' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4705" width="20" height="20"><path d="M861.582222 48.924444c62.691556 0 113.493333 50.744889 113.493334 113.322667v698.709333c0 62.577778-50.801778 113.322667-113.493334 113.322667h-699.733333A113.436444 113.436444 0 0 1 48.355556 860.956444V162.247111c0-62.577778 50.801778-113.322667 113.493333-113.322667h699.733333z m0 69.404445h-699.733333a43.918222 43.918222 0 0 0-43.52 37.944889l-0.455111 5.973333v698.709333c0 22.186667 16.554667 40.561778 38.001778 43.463112l5.973333 0.398222h699.733333c22.243556 0 40.675556-16.497778 43.576889-37.944889l0.398222-5.916445V162.247111c0-22.186667-16.497778-40.561778-38.001777-43.463111l-5.973334-0.398222z m-43.690666 489.528889a34.702222 34.702222 0 1 1 0 69.461333h-105.244445v123.847111l-0.512 5.461334a34.759111 34.759111 0 0 1-69.006222-6.257778v-183.978667l8.533333-8.533333h166.229334z m-428.600889 0l8.533333 8.533333v183.978667a34.702222 34.702222 0 0 1-69.575111 0v-123.050667H223.061333a34.759111 34.759111 0 1 1 0-69.404444h166.229334z m288.597333-419.271111c19.228444 0 34.816 15.587556 34.816 34.816V346.453333h105.187556a34.759111 34.759111 0 1 1 0 69.404445h-166.229334l-8.533333-8.533334V223.459556c0-19.228444 15.587556-34.759111 34.759111-34.759112z m-314.88 0a34.702222 34.702222 0 0 1 34.816 34.816V407.324444l-8.533333 8.533334H222.321778l-5.461334-0.568889a34.702222 34.702222 0 0 1 6.257778-68.892445H328.248889V222.606222l0.568889-5.461333a34.759111 34.759111 0 0 1 34.190222-28.501333z" p-id="4706"></path></svg>
                    </div>
                </div> 
            </div>
            <div class='konjacConfigParams'>
                <div id='konjacConfigMode-scroll' class='konjacConfigParamsHalf konjacConfigMode'>卷轴模式</div>
                <div id='konjacConfigMode-page' class='konjacConfigParamsHalf konjacConfigMode' >翻页模式</div>
            </div>
            <div class='konjacConfigParams konjacConfigParamsPage'>
                <div class='konjacConfigParamsHalf konjacConfigPage' data-page='1'>单页浏览</div>
                <div class='konjacConfigParamsHalf konjacConfigPage' data-page='2' >双页浏览</div>
            </div>
            <div class='konjacConfigParams konjacConfigParamsIndex'>
                <div class='konjacConfigParamsHalf konjacConfigIndex' data-index='0'>首面单页</div>
                <div class='konjacConfigParamsHalf konjacConfigIndex' data-index='1'>首面双页</div>
            </div>
        </div>
        
        <div id='konjacTranslation'>
            <span  class='konjacColumn'>译文管理</span>
            <div id='konjacSearch'>
                <select id='konjacLang'>
                    <option value ="zh">中文</option>
                    <option value ="en">English</option>
                </select>
                <input id='konjacSearchTitle' placeholder="请输入标题" />
                <button id='konjacSearchButton'>搜索</button>
            </div>
            <div id='konjacSource' class='konjacSiderItem'>
                <span class='konjacSiderSpan'>可用译文：</span>
                <div id='konjacSourceEmpty'>
                    <svg t="1642594764553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14215" width="40" height="40"><path d="M734.208 354.461538a78.769231 78.769231 0 0 1 73.216 49.703385L866.461538 552.881231V787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923v-231.699693l59.195076-151.433846A78.769231 78.769231 0 0 1 290.107077 354.461538h444.100923z m-358.636308 216.615385H196.923077V787.692308a39.384615 39.384615 0 0 0 34.776615 39.108923L236.307692 827.076923h551.384616a39.384615 39.384615 0 0 0 39.108923-34.776615L827.076923 787.692308v-216.615385h-178.648615a137.846154 137.846154 0 0 1-272.856616 0z m358.636308-177.230769H290.107077a39.384615 39.384615 0 0 0-34.658462 20.676923l-2.048 4.371692-44.110769 112.797539h180.302769l-0.039384 0.472615A19.771077 19.771077 0 0 1 413.538462 551.384615a98.461538 98.461538 0 1 0 196.923076 0 19.692308 19.692308 0 0 1 18.786462-19.692307h186.407385l-44.819693-112.994462a39.384615 39.384615 0 0 0-31.822769-24.576L734.208 393.846154z m-203.539692-295.384616a19.692308 19.692308 0 0 1 19.37723 16.147693l0.315077 3.544615v155.254154a19.692308 19.692308 0 0 1-39.069538 3.544615l-0.315077-3.544615V118.153846a19.692308 19.692308 0 0 1 19.692308-19.692308z m-241.506462 5.316924l2.363077 2.678153 114.648615 155.254154a19.692308 19.692308 0 0 1-29.302153 26.033231l-2.363077-2.638769-114.648616-155.254154a19.692308 19.692308 0 0 1 29.302154-26.072615z m509.518769-1.496616a19.692308 19.692308 0 0 1 6.025847 24.497231l-1.851077 3.032615-114.294154 155.254154a19.692308 19.692308 0 0 1-33.555693-20.322461l1.811693-3.032616 114.333538-155.214769a19.692308 19.692308 0 0 1 27.569231-4.214154z" fill="#B0BEC5" p-id="14216"></path></svg>
                    <span>空空如也</span>
                </div>  
            </div>
            <div id='konjacLoad' class='konjacSiderItem'>
                <span class='konjacSiderSpan'>已装填：</span>    
                <div id='konjacLoadEmpty'>
                    <svg t="1642594764553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14215" width="40" height="40"><path d="M734.208 354.461538a78.769231 78.769231 0 0 1 73.216 49.703385L866.461538 552.881231V787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923v-231.699693l59.195076-151.433846A78.769231 78.769231 0 0 1 290.107077 354.461538h444.100923z m-358.636308 216.615385H196.923077V787.692308a39.384615 39.384615 0 0 0 34.776615 39.108923L236.307692 827.076923h551.384616a39.384615 39.384615 0 0 0 39.108923-34.776615L827.076923 787.692308v-216.615385h-178.648615a137.846154 137.846154 0 0 1-272.856616 0z m358.636308-177.230769H290.107077a39.384615 39.384615 0 0 0-34.658462 20.676923l-2.048 4.371692-44.110769 112.797539h180.302769l-0.039384 0.472615A19.771077 19.771077 0 0 1 413.538462 551.384615a98.461538 98.461538 0 1 0 196.923076 0 19.692308 19.692308 0 0 1 18.786462-19.692307h186.407385l-44.819693-112.994462a39.384615 39.384615 0 0 0-31.822769-24.576L734.208 393.846154z m-203.539692-295.384616a19.692308 19.692308 0 0 1 19.37723 16.147693l0.315077 3.544615v155.254154a19.692308 19.692308 0 0 1-39.069538 3.544615l-0.315077-3.544615V118.153846a19.692308 19.692308 0 0 1 19.692308-19.692308z m-241.506462 5.316924l2.363077 2.678153 114.648615 155.254154a19.692308 19.692308 0 0 1-29.302153 26.033231l-2.363077-2.638769-114.648616-155.254154a19.692308 19.692308 0 0 1 29.302154-26.072615z m509.518769-1.496616a19.692308 19.692308 0 0 1 6.025847 24.497231l-1.851077 3.032615-114.294154 155.254154a19.692308 19.692308 0 0 1-33.555693-20.322461l1.811693-3.032616 114.333538-155.214769a19.692308 19.692308 0 0 1 27.569231-4.214154z" fill="#B0BEC5" p-id="14216"></path></svg>
                    <span>空空如也</span>
                </div>        
            </div>
        </div>
    </div>
    </div>   	
    <div id='konjacFotter'>   
        <div id='konjacCurrentPage' class='konjacAbsoluteCenter'>
            <div class='konjacTurnPage' data-type='pre'>
            <svg t="1642568805529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2907" width="20" height="20" fill='#fff'><path d="M377.052007 512l386.3073-388.203486L705.12909 65.290005 318.845327 453.493491l-58.20668 58.506509 58.20668 58.505485 386.283764 388.203486 58.230216-58.506509L377.052007 512zM377.052007 512" p-id="2908"></path></svg>            </div>
            <span></span> / <span></span>
            <div class='konjacTurnPage' data-type='next'>
            <svg t="1642568788244" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2768" width="20" height="20" fill='#fff'><path d="M260.638647 900.202463l58.230216 58.506509L705.15365 570.505485l58.20668-58.505485-58.20668-58.506509L318.868863 65.290005l-58.230216 58.505485 386.3073 388.203486L260.638647 900.202463zM646.945947 512" p-id="2769"></path></svg>            </div>
        </div>
    </div>
	</div>`)

    // zoom 
    $('#konjacZoom').change((e) => {
        let zoom = e.target.value * 1
        if (zoom) { $('#konjacContainer').css({ 'zoom': zoom / 100 }) }
    })



    $('.konjacConfigMode-size').click((e) => {
        if (e.currentTarget.dataset.type * 1 == 0) { $('#konjacZoom').val(100); $('#konjacContainer').css({ 'zoom': 1 }); return }
        if ($('.konjacImage:visible')[0].complete) {
            let zoom = Math.floor((window.innerHeight - 70) / $('.konjacImage:visible')[0].scrollHeight * 100)
            $('#konjacZoom').val(zoom)
            $('#konjacContainer').css({ 'zoom': zoom / 100 })
        } else {
            $('.konjacImage:visible').eq(0).one('load', (e) => {
                let zoom = Math.floor((window.innerHeight - 70) / e.currentTarget.scrollHeight * 100)
                $('#konjacZoom').val(zoom)
                $('#konjacContainer').css({ 'zoom': zoom / 100 })
            })
        }
    })

    // change mode
    $('#konjacConfigMode-scroll').click(() => {
        if ($('#konjacContainer').hasClass('konjacConfigMode-scroll')) { return }
        $('#konjacContainer').removeClass('konjacConfigMode-page')
        $('#konjacConfigMode-scroll').addClass('konjacConfigSeleted')
        $('#konjacConfigMode-page').removeClass('konjacConfigSeleted')
        $('#konjacContainer').addClass('konjacConfigMode-scroll')
        this.config.mode = 'scroll'
        scrollModeInit()
    })

    $('#konjacConfigMode-page').click(() => {
        if ($('#konjacContainer').hasClass('konjacConfigMode-page')) { return }
        $('#konjacContainer').removeClass('konjacConfigMode-scroll')
        $('#konjacConfigMode-scroll').removeClass('konjacConfigSeleted')
        $('#konjacConfigMode-page').addClass('konjacConfigSeleted')
        $('#konjacContainer').addClass('konjacConfigMode-page')
        this.config.mode = 'page'
        pageModeInit()
    })

    // change Page 
    $('.konjacConfigPage').click((e) => {
        $('.konjacConfigPage').toggleClass('konjacConfigSeleted')
        this.config.page = e.target.dataset.page * 1
        this.currentPage = this.currentPage - this.currentPage % this.config.page
        pageModeInit()
    })

    $('.konjacConfigIndex').click((e) => {
        $('.konjacConfigIndex').toggleClass('konjacConfigSeleted')
        this.config.index = e.target.dataset.index * 1
        pageModeInit()
    })

    this.data.pages.forEach((element, index) => {
        $('#konjacContainer').append(`
        <div id='konjacPage-${index}' class='konjacPage '>
        <div class='konjacContainer'> </div>
        <img class='konjacImage' src='${element.src}' />
        </div>
        `)
    });
    $('#konjacContainer').append(`<div id='konjacMessage' class='konjacPage'><div id='konjacEND'><span>THE END</span></div></div>`)
    if ($('.konjacImage:last')[0].complete) {
        $('#konjacMessage').width($('.konjacImage:last')[0].width)
        $('#konjacMessage').height($('.konjacImage:last')[0].height)
    } else {
        $('.konjacImage:last').one('load', (e) => {
            $('#konjacMessage').width(e.currentTarget.width)
            $('#konjacMessage').height(e.currentTarget.height)
        })
    }


    $("#konjacExit").click(function () {
        $('#konjac').hide();
        $('body').removeAttr('style')
    });

    $('#konjacFold').click(function () {
        $(this).toggleClass('konjacFold')
        $('.konjacAbsoluteCenter').toggleClass('konjacAbsoluteCenterFix')
        if ($(this).hasClass('konjacFold')) {
            $('#konjacSider').hide()
        } else {
            $('#konjacSider').show()
        }
    })

    // config init
    for (const key in this.config) {
        switch (key) {
            case 'mode':
                $(`#konjacConfigMode-${this.config[key]}`).click();
                break;
            case 'page': $(`.konjacConfigPage[data-page='${this.config[key]}'] `).addClass('konjacConfigSeleted '); break
            case 'index': $(`.konjacConfigIndex[data-index='${this.config[key]}'] `).addClass('konjacConfigSeleted '); break
            default:
                break;
        }
    }

    $('.konjacTurnPage').click(e => { pageTurn(e.currentTarget.dataset.type, this.config.page * 1) })

    $('#konjacSearchButton').click(async () => {
        let params = {
            url: location.href,
            language: $('#konjacLang').val()
        }
        if ($('#konjacSearchTitle').val()) { params.title = $('#konjacSearchTitle').val() }
        let res = await callbackground({
            type: 'ajax',
            params: {
                methods: 'GET',
                url: api.translation(),
                params: params
            }
        });
        htmlGenerator('initSource', res.result)
    })
    let res = await callbackground({
        type: 'ajax',
        params: {
            methods: 'GET',
            url: api.translation(),
            params: {
                url: location.href,
                language: navigator.language.slice(0, 2)
            },
        }
    });
    console.log('res',res)
    $('#konjacNotification').hide('fast')

    await htmlGenerator('initSource', res.result)
    if ($('.konjacSource').length) {
        if (this.konjacQuery && $(`.konjacSource[data-id='${this.konjacQuery}']`)) {
            $(`.konjacSource[data-id='${this.konjacQuery}'] div.konjacButton`).click()
        } else {
            $('.konjacSource .konjacButton').eq(0).click()
        }
    }

}

let pageTurnByMousewheel = (e) => {
    let scrollTop = $('#konjacContainer').scrollTop()
    let scrollHeight = $('#konjacContainer')[0].scrollHeight
    let clientHeight = $('#konjacContainer')[0].clientHeight
    // console.log(scrollTop , (scrollHeight - clientHeight))
    if (scrollTop == 0 && e.originalEvent.deltaY < 0) {
        pageTurn('pre', this.config.page * 1)
    }
    if (scrollTop >= (scrollHeight - clientHeight) && e.originalEvent.deltaY > 0) {
        pageTurn('next', this.config.page * 1)
    }
}

let pageScrollByMousewheel = (e) => {
    // let sTop = $('#konjac').scrollTop();
    let sh = $(window).height();
    let s = sh
    let ft
    for (let index = 0; index < $(".konjacPage").length; index++) {
        ft = $(".konjacPage").eq(index).offset().top
        if (sh - ft >= 0) {
            if (s > sh - ft) {
                s = sh - ft
                this.currentPage = index
            }
        }
    }
    pageChange(this.currentPage)
}

function pageChange(page) {
    $('#konjacCurrentPage > span').eq(0).text(page + 1)
    $('#konjacCurrentPage > span').eq(1).text($('.konjacPage').length)
    if (page > $('.konjacPage').length - 3 && !this.haveread) { this.haveread = true }
}

async function scrollModeInit() {
    $('#konjacContainer').off('mousewheel', pageTurnByMousewheel)
    $('#konjacContainer').off('mousewheel', pageScrollByMousewheel)
    $('#konjacContainer').on('mousewheel', pageScrollByMousewheel)
    $('.konjacConfigParamsPage').hide()
    $('.konjacConfigParamsIndex').hide()
    $('.konjacTurnPage').hide()
    if ($('.konjacPageTurn').length) { $('.konjacPage').unwrap() }
    $('#konjacBlankPage').removeClass("konjacPage")
    $('#konjacContainer').scrollTop($('.konjacPage').eq(this.currentPage).offset().top)
    pageChange(this.currentPage)
}

async function pageModeInit() {
    $('#konjacContainer').off('mousewheel', pageTurnByMousewheel)
    $('#konjacContainer').off('mousewheel', pageScrollByMousewheel)
    $('#konjacContainer').on('mousewheel', pageTurnByMousewheel)
    $('.konjacConfigParamsPage').show()
    $('.konjacTurnPage').show()
    if ($('.konjacPageTurn').length) { $('.konjacPage').unwrap() }

    if (!(this.config.index * 1)) { $('#konjacBlankPage').addClass("konjacPage") } else { $('#konjacBlankPage').removeClass("konjacPage") }
    if (this.config.page * 1 == 1) {
        $('#konjacBlankPage').removeClass("konjacPage")
        $('.konjacPage').wrap("<div class='konjacPageTurn'></div>")
        $('.konjacConfigParamsIndex').hide()
        $('.konjacPageTurn').hide()
        $('.konjacPageTurn').eq((this.currentPage)).show()
    } else {
        $('.konjacConfigParamsIndex').show()
        let len = Math.ceil($('.konjacPage').length / 2)
        for (let index = 0; index < len; index++) {
            $('.konjacPage').slice(index * 2, index * 2 + 2).wrapAll("<div class='konjacPageTurn'></div>")
        }
        $('.konjacPageTurn').hide()
        $('.konjacPageTurn').eq(Math.floor(this.currentPage / 2)).show()
    }
    pageChange(this.currentPage)

    // callbackground({ type: 'storage-set', item: { 'konjac-config': this.config } })
}

async function pageTurn(type = 'pre', page = 2) {
    switch (type) {
        case 'next':
            if (this.currentPage + page >= $('.konjacPage').length) { break }
            $('.konjacPageTurn').hide()
            this.currentPage = this.currentPage + page
            if (page == 2) {
                $('.konjacPageTurn').eq(Math.floor(this.currentPage / 2)).show()
            } else {
                $('.konjacPageTurn').eq(this.currentPage).show()
            }
            break;
        case 'pre':
            if (this.currentPage <= 0) { break }
            $('.konjacPageTurn').hide()
            this.currentPage = this.currentPage - page < 0 ? 0 : this.currentPage - page
            if (page == 2) {
                $('.konjacPageTurn').eq(Math.floor(this.currentPage / 2)).show()
            } else {
                $('.konjacPageTurn').eq(this.currentPage).show()
            }
            break
        default:
            break;
    }
    pageChange(this.currentPage)
    return Promise.resolve()
}

async function cookingMode(msg) {
    try {
        eval(msg.code)
        let data = await getData()
        let res = {
            type: 'editor-data',
            pages: data.pages,
            tabId: msg.tabId,
            info: {
                title: (data.title ? data.title : '') + (data.chapter ? data.chapter : ''),
                url: window.location.href
            },
        }
        if (msg.info && msg.info.language) {
            res.info.language = msg.info.language
        }
        callbackground(res);
    } catch (error) {
        console.error('cookingMode', error)
    }
}

function getPointFromPath(d) {
    let path = []
    if (typeof d == 'string') {
        path = d.match(/[MmLlCcSsQqTtAHhVv][^MmLlCcSsQqTtAHhVv]*/g)
    } else {
        path = d
    }
    let point = []
    path.forEach(ele => {
        let type = ele.match(/[MmLlCcSsQqTtAHhVv]/)[0]
        let params = ele.match(/-?\d+\.?\d*/g)
        let len = params.length / 2
        switch (type) {
            case 'M':
                point.push({
                    type: 'M',
                    x: params[0] * 1,
                    y: params[1] * 1,
                })
                break;
            case 'm':
                if (point.length > 0) {
                    point.push({
                        type: 'M',
                        x: params[0] * 1 + point[point.length - 1].x,
                        y: params[1] * 1 + point[point.length - 1].y
                    })
                } else {
                    point.push({
                        type: 'M',
                        x: params[0] * 1,
                        y: params[1] * 1,
                    })
                }
                break;
            case 'L':
                for (let index = 0; index < len; index++) {
                    let Lpoint = params.splice(0, 2)
                    point.push({
                        type: 'L',
                        params: {
                            x1: point[point.length - 1].x + (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y1: point[point.length - 1].y + (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                            x2: Lpoint[0] * 1 - (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y2: Lpoint[1] * 1 - (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                        },
                        x: Lpoint[0] * 1,
                        y: Lpoint[1] * 1
                    })
                }
                break;
            case 'l':
                for (let index = 0; index < len; index++) {
                    let Lpoint = params.splice(0, 2)
                    point.push({
                        type: 'L',
                        params: {
                            x1: point[point.length - 1].x + (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y1: point[point.length - 1].y + (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                            x2: Lpoint[0] * 1 + point[point.length - 1].x - (Lpoint[0] * 1 - point[point.length - 1].x) / 4,
                            y2: Lpoint[1] * 1 + point[point.length - 1].y - (Lpoint[1] * 1 - point[point.length - 1].y) / 4,
                        },
                        x: Lpoint[0] * 1 + point[point.length - 1].x,
                        y: Lpoint[1] * 1 + point[point.length - 1].y
                    })
                }
                break
            case 'C':
                point.push({
                    type: 'C',
                    x: params[4] * 1,
                    y: params[5] * 1,
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[2] * 1,
                        y2: params[3] * 1,
                    }
                })
                break;
            case 'c':
                point.push({
                    type: 'C',
                    x: params[4] * 1 + point[point.length - 1].x,
                    y: params[5] * 1 + point[point.length - 1].y,
                    params: {
                        x1: params[0] * 1 + point[point.length - 1].x,
                        y1: params[1] * 1 + point[point.length - 1].y,
                        x2: params[2] * 1 + point[point.length - 1].x,
                        y2: params[3] * 1 + point[point.length - 1].y,
                    }
                })
                break;
            case 'S':
                point.push({
                    type: 'C',
                    x: params[2] * 1,
                    y: params[3] * 1,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x2,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y2,
                        x2: params[0] * 1,
                        y2: params[1] * 1,
                    }
                })
                break;
            case 's':
                point.push({
                    type: 'C',
                    x: params[2] * 1 + point[point.length - 1].x,
                    y: params[3] * 1 + point[point.length - 1].y,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x2,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y2,
                        x2: params[0] * 1 + point[point.length - 1].x,
                        y2: params[1] * 1 + point[point.length - 1].y,
                    }
                })
                break;
            case 'Q':
                point.push({
                    type: 'Q',
                    x: params[2] * 1,
                    y: params[3] * 1,
                    params: {
                        x1: params[0] * 1,
                        y1: params[1] * 1,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'q':
                point.push({
                    type: 'Q',
                    x: params[2] * 1 + point[point.length - 1].x,
                    y: params[3] * 1 + point[point.length - 1].y,
                    params: {
                        x1: params[0] * 1 + point[point.length - 1].x,
                        y1: params[1] * 1 + point[point.length - 1].y,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 + point[point.length - 1].y - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'T':
                point.push({
                    type: 'Q',
                    x: params[0] * 1,
                    y: params[1] * 1,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x1,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y1,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 't':
                point.push({
                    type: 'Q',
                    x: params[0] * 1 + point[point.length - 1].x,
                    y: params[1] * 1 + point[point.length - 1].y,
                    params: {
                        x1: 2 * point[point.length - 1].x - point[point.length - 1].params.x1,
                        y1: 2 * point[point.length - 1].y - point[point.length - 1].params.y1,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: params[1] * 1 + point[point.length - 1].y - (params[1] * 1 - point[point.length - 1].y) / 4,
                    }
                })
                break;
            case 'A':
                point.push({
                    type: 'A',
                    x: params[5] * 1,
                    y: params[6] * 1,
                    params: {
                        x1: point[point.length - 1].x + (params[5] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (params[6] * 1 - point[point.length - 1].y) / 4,
                        x2: params[5] * 1 - (params[5] * 1 - point[point.length - 1].x) / 4,
                        y2: params[6] * 1 - (params[6] * 1 - point[point.length - 1].y) / 4,
                        rx: params[0] * 1,
                        ry: params[1] * 1,
                        angle: params[2] * 1,
                        arc: params[3] * 1,
                        sweep: params[4] * 1,
                    }
                })
                break;
            case 'a':
                point.push({
                    type: 'A',
                    x: params[5] * 1 + point[point.length - 1].x,
                    y: params[6] * 1 + point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[5] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (params[6] * 1 - point[point.length - 1].y) / 4,
                        x2: params[5] * 1 + point[point.length - 1].x - (params[5] * 1 - point[point.length - 1].x) / 4,
                        y2: params[6] * 1 + point[point.length - 1].y - (params[6] * 1 - point[point.length - 1].y) / 4,
                        rx: params[0] * 1 + point[point.length - 1].x,
                        ry: params[1] * 1 + point[point.length - 1].y,
                        angle: params[2] * 1,
                        arc: params[3] * 1,
                        sweep: params[4] * 1,
                    }
                })
                break;
            case 'H':
                point.push({
                    type: 'L',
                    x: params[0] * 1,
                    y: point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[0] * 1 - point[point.length - 1].x) / 4,
                        y1: point[point.length - 1].y + (point[point.length - 1].y - point[point.length - 1].y) / 4,
                        x2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].x) / 4,
                        y2: point[point.length - 1].y - (point[point.length - 1].y - point[point.length - 1].y) / 4,
                    },
                })
                break
            case 'h':
                point.push({
                    type: 'L',
                    x: params[0] * 1 + point[point.length - 1].x,
                    y: point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x + (params[0] * 1) / 4,
                        y1: point[point.length - 1].y,
                        x2: params[0] * 1 + point[point.length - 1].x - (params[0] * 1) / 4,
                        y2: point[point.length - 1].y
                    },
                })
                break
            case 'V':
                point.push({
                    type: 'L',
                    x: point[point.length - 1].x,
                    y: params[0] * 1,
                    params: {
                        y1: point[point.length - 1].y + (params[0] * 1 - point[point.length - 1].y) / 4,
                        x1: point[point.length - 1].x,
                        y2: params[0] * 1 - (params[0] * 1 - point[point.length - 1].y) / 4,
                        x2: point[point.length - 1].x,
                    },
                })
                break
            case 'v':
                point.push({
                    type: 'L',
                    x: point[point.length - 1].x,
                    y: params[0] * 1 + point[point.length - 1].y,
                    params: {
                        x1: point[point.length - 1].x,
                        y1: point[point.length - 1].y + (params[0] * 1 + point[point.length - 1].y - point[point.length - 1].y) / 4,
                        x2: point[point.length - 1].x,
                        y2: params[0] * 1 + point[point.length - 1].y - (params[0] * 1 + point[point.length - 1].y - point[point.length - 1].y) / 4,

                    },
                })
                break
        }
    })
    return point
}