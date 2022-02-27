<template>
  <a-modal :visible="visible" title="设置" @cancel="showModal" @ok="showModal" :bodyStyle="{'padding-top':0}" okText="确定"
    cancelText="取消">
    <a-form :label-col="{span:4}" :wrapper-col="{span:20}" style="padding-top:10px">
      <a-form-item label="自动保存" class="setting-params">
        <a-switch checked-children="开" un-checked-children="关" v-model="setting.autoSave"
          @change="triggetMethod('autoSave','autoSave')" />
      </a-form-item>
      <a-form-item label="工作模式" class="setting-params">
        <a-radio-group button-style="solid" v-model="setting.viewMode"
          @change="triggetMethod('viewModeInit','viewMode')">
          <a-radio-button value="scroll">
            卷轴
          </a-radio-button>
          <a-radio-button value="page">
            翻页
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="浏览页数" class="setting-params">
        <a-radio-group v-model="setting.viewPage" button-style="solid"
          @change="triggetMethod('viewModeInit','viewPage')">
          <a-radio-button :value="1">
            单页
          </a-radio-button>
          <a-radio-button :value="2">
            双页
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="首面页数" class="setting-params">
        <a-radio-group v-model="setting.viewIndex" button-style="solid"
          @change="triggetMethod('viewModeInit','viewIndex')">
          <a-radio-button :value="1">
            单页
          </a-radio-button>
          <a-radio-button :value="2">
            双页
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script>
import chromeApi from '../../../module/chrome'

export default {
  props: {
    setting: Object,
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    showModal() {
      this.visible = !this.visible
    },
    triggetMethod(method, data) {
      this.$emit('triggetMethod', [method], this.setting[data])
      chromeApi.savelocal({ 'editor-config': this.setting })
    },
  },
}
</script>

<style lang="less">
.setting-params {
  margin-top: 10px;
}
</style>