<template>
  <a-modal :visible="visible" title="设置" @cancel="showModal" @ok="showModal" :bodyStyle="{'padding-top':0}" okText="确定"
    cancelText="取消">
    <a-form :label-col="{span:4}" :wrapper-col="{span:20}" style="padding-top:10px">
      <a-form-item label="自动保存" class="setting-params">
        <a-switch checked-children="开" un-checked-children="关" v-model="setting.autoSave" @change="autoSave" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
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
    autoSave(){
        this.$emit('triggetMethod',['autoSave'],this.setting.autoSave)
    }
  },
}
</script>

<style lang="less">
.setting-params {
  margin-top: 10px;
}
</style>