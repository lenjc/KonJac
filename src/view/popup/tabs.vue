<template>
  <div id="tabs">
    <div class="tab-options" @click="newItem">创建新项目</div>
    <div v-for="(item,index) in tabs" :key="'tab-'+index" class="tab-options" @click="toTab(item)" :title="item.title">
      {{item.title}}
    </div>
  </div>
</template>

<script>
const bg = chrome.extension.getBackgroundPage()
import chromeApi from '../../module/chrome'

export default {
  data() {
    return {
      tabs: []
    }
  },
  created() {
    this.getTabs()
  },
  methods: {
    newItem() {
      this.$router.push(
        {
          name: 'newItem',
          params: this.$route.params
        })
    },
    getTabs() {
      chrome.tabs.query({ url: chrome.runtime.getURL('editor.html') }, (tabs) => {
        this.tabs = tabs
      })
    },
    async toTab(tab) {
      let code = await chromeApi.getlocal(`script-${this.$route.params.codeId}`)
      bg.toConnectSrcipt({ type: 'cookingMode', code: code, tabId: tab.id })
      this.$router.push('/')
    }
  }
}
</script>

<style lang='less'>
#tabs {
  // padding: 0 10px 0 10px;
  background-color: transparent;
}
.tab-options {
  width: 100%;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
  background-color: #fff;
  border-radius: 3px;
  text-overflow: ellipsis;
  cursor: pointer;
  // margin-bottom: 10px;
  padding-left: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  // border: 1px solid rgba(0, 0, 0, 0.1);
}
.tab-options:hover{
  background-color: #e8ecf1;
}
.tab-options:last-of-type {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>