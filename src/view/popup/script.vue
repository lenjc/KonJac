<template>
  <div id="script">
    <div v-for="(item,index) in list" :key="'list-'+index" class="script-item">
      <div class="item-info">
        <div style="font-size:16px;color:rgba(0,0,0,0.9)">
          {{item.title}}
        </div>
        <div title="适用站点">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wangzhi"></use>
          </svg> <span>{{item.host.join(',')}}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span title="来源" style="width:50%"><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-laiyuan"></use>
            </svg> {{item.source}}</span>
          <span title="版本" style="width:50%"><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-banbenhao"></use>
            </svg> {{item.version}}</span>
        </div>
      </div>
      <div class="item-button">
        <div class="status-button">
          <a-popconfirm title="确认删除?" ok-text="是" cancel-text="否" @confirm="deleteScript(index)">
            <span class="status-on">删除</span>
          </a-popconfirm>
        </div>
        <div style="background-color:#666699">
          更新
        </div>
        <div @click="editScript(item)" style="background-color:#4f80ff">
          编辑
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import chromeApi from '../../module/chrome'

export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // this.init()
  },
  methods: {
    async deleteScript(index) {
      let item = this.list.splice(index, 1)
      await chromeApi.removelocal(`script-${item.id}`)
      await chromeApi.savelocal({ 'srcipt_list': JSON.stringify(this.list) })
    },
    editScript(item) {
      this.$router.push({
        name: 'scriptEdit',
        params: item
      })
    },
    init() {
      chrome.storage.local.clear()
    },
    async getList() {
      let res = await chromeApi.getlocal('srcipt_list')
      this.list = JSON.parse(res)
    }
  }
}
</script>

<style lang="less">
#script {
  padding: 10px 5px 0 5px;
  background-color:#fff;


}
.script-item {
  // padding: 0 3px 0 3px;
  border-radius: 3px;
  margin-bottom: 10px;
  overflow: hidden;
  .item-info {
    color: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(112, 112, 112, 0.2);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 0 3px 0 3px;
    > div {
      font-size: 12px;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .icon {
        font-size: 14px;
      }
    }
  }
  .item-button {
    color: #fff;
    line-height: 30px;
    margin: 0;
    font-size: 14px;
    height: 30px;
    display: flex;
    flex-direction: row;
    text-align: center;
    > div {
      width: 100%;
      cursor: pointer;
    }
  }
  .status-button {
    background-color: #ff6666;
  }
}
</style>