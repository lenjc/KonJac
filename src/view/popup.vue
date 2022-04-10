<template>
  <div id="app">
    <div id="header">
      <div>
        <div v-if="$route.path!='/'" style="width:35px;cursor: pointer;" @click="$router.back()">
          <a-icon type="arrow-left" />
        </div>
        <div style="font-size:32px;font-weight:bold;user-select: none;color:#3993a4">
          <embed v-if="$route.path=='/'" src="img/KonJac.svg" width="24" height="24" type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/" style="margin:0 5px 0 5px" />
          <span style="color:#cba67e">K</span>on<span style="color:#1cbedb">J</span>ac
        </div>
      </div>
      <div v-if="$route.path=='/script'" style="width:100%;">
        <a-icon @click="$router.push('/scriptEdit')" type="plus" title="新建脚本" class="button" />
      </div>
    </div>
    <router-view class="scrollbar" style="max-height: 280px;" />
  </div>
</template>

<script>

import chromeApi from '../module/chrome'
import api from '../module/api'

export default {
  created() {
    document.oncontextmenu = () => { return false; }
    this.$message.config({
      top: `12px`,
      duration: 2,
      maxCount: 1,
    });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case 'process':
          sendResponse({ code: 0, sender: 'popup.html' })
          if (request.current == request.total) {
            this.$message.loading({ content: `准备中 ${request.current}/${request.total}`, key: 'msgLoading', duration: 1 });
            window.close();
          } else {
            this.$message.loading({ content: `准备中 ${request.current}/${request.total}`, key: 'msgLoading', duration: 0 });
          }
          break;
      }
    });
    this.updateDiff()
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    async updateDiff() {
      let updateTime = await chromeApi.getlocal('updateTime')
      let diff = (Date.parse(new Date) - updateTime) / (1000 * 60 * 60)
      if (diff > 24) {
        let list = await chromeApi.getlocal('srcipt_list')
        if(list){
          this.list = JSON.parse(list)
          this.refreshScript()
        }        
      }
    },
    async refreshScript() {
      let ids = []
      this.list.forEach(ele => {
        if (ele._id) { ids.push(ele._id) }
      });
      api.getScriptVersion({ id: ids.join(',') })
        .then(res => {
          let news = res.data.result.filter(ele => {
            let item = this.list.find(el => el._id == ele._id)
            return item.version != ele.version
          })
          this.updateScript(news)
        })
        .catch(err => {
          console.error(err)
        })
    },
    async updateScript(queue = []) {
      if (!queue.length) {
        await chromeApi.savelocal({ 'srcipt_list': JSON.stringify(this.list) })
        await chromeApi.savelocal({ 'updateTime': Date.parse(new Date) })
        return
      }
      let item = queue.pop()
      let res = await api.getScript({ _id: item._id })
      let { codeMin, ...script } = res.data.result
      let scripts = this.list.find(ele => ele._id == item._id)
      Object.assign(scripts, script)
      await chromeApi.savelocal({ [scripts.id]: codeMin })
      return this.updateScript(queue)
    },
  }
}
</script>

<style lang='less'>
body {
  background-color: #f6f6f6;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 200px;
  user-select: none;
  overflow: hidden;
  // height: 340px;
  max-height: 340px;
  background-color: #f6f6f6;
  #header {
    background-color: #fff;
    padding-left: 5px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    flex-direction: row;
    text-align: center;
    flex-wrap: nowrap;
    justify-content: space-between;
    vertical-align: middle;
    > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }
    > div {
      height: 60px;
      line-height: 60px;
      display: flex;
      flex-wrap: nowrap;
    }
    .button {
      cursor: pointer;
      font-size: 18px;
      line-height: 60px;
      margin: 0 auto;
    }
    .button:hover {
      color: #4f80ff;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
.scrollbar {
  overflow-y: auto;
}
.scrollbar::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  background-color: #4f80ff;
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #4f80ff;
  border-radius: 0;
}
.scrollbar::-webkit-scrollbar-track {
  border-left: 1px solid #ccc;
  background-color: #ccc;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
