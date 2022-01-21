<template>
  <div id="netconfig">
    <a-input type="text" v-model="ip" placeholder="http://api.konjac.fun">
      <a-icon slot="prefix" type="api" :style="{ color: 'rgba(0,0,0,.25)' }" />
    </a-input>
    <div id="netconfig-submit">
      <a-button type="default" style="width:45%" @click="$router.back()">返回</a-button>
      <a-button type="primary" style="width:45%" @click="saveItem">保存</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ip: ''
    }
  },
  created() {
    chrome.storage.local.get(['netconfig'], (res) => {
      if (res) { this.ip = res.netconfig }
    });
  },
  methods: {
    saveItem() {
      chrome.storage.local.set({ 'netconfig': this.ip }, (res) => { });
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="less">
#netconfig {
  padding: 0 10px;
  background-color: #fff;
  position: relative;
  height: 100%;
}
#netconfig-submit {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 45px;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 0 10px 0 10px;
  justify-content: space-around;
  align-items: center;
}
</style>