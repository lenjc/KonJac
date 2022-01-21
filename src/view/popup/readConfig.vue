<template>
  <div id="readConfig">
    <div class="readConfigItem">
      <div>
        模式 ：
      </div>
      <div>
        <a-radio-group v-model="data.mode" button-style="solid" @change="setConfig">
          <a-radio-button value="scroll">
            卷轴
          </a-radio-button>
          <a-radio-button value="page">
            翻页
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="readConfigItem">
      <div>
        浏览 ：
      </div>
      <div>
        <a-radio-group v-model="data.page" button-style="solid" @change="setConfig">
          <a-radio-button value="1">
            单页
          </a-radio-button>
          <a-radio-button value="2">
            双页
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="readConfigItem">
      <div>
        首面 ：
      </div>
      <div>
        <a-radio-group v-model="data.index" button-style="solid" @change="setConfig">
          <a-radio-button value="0">
            单页
          </a-radio-button>
          <a-radio-button value="1">
            双页
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import chromeApi from '../../module/chrome'

export default {
  data() {
    return {
      data: { mode: 'scroll', page: 2, index: 0, turn: 'left' }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      let config = await chromeApi.getlocal('konjac-config')
      this.data = config ? config : { mode: 'scroll', page: 2, index: 0, turn: 'left' }
    },
    async setConfig() {
      await chromeApi.savelocal({ 'konjac-config': this.data })
    }
  }
}
</script>

<style lang="less">
#readConfig {
    background-color: #fff;
  padding: 5px;
}
.readConfigItem {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-bottom: 10px;
}
</style>

