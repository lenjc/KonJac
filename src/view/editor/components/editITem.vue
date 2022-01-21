<template>
  <a-modal :visible="visible" title="编辑" @cancel="visible=false" :width="300">
    <a-form layout="horizontal" :label-col="{span:6}" :wrapper-col="{span:18}" >
         <a-form-item label="Height:">
        <a-input type="number" v-model="data.height"></a-input>
      </a-form-item>
      <a-form-item label="Width:">
        <a-input type="number"  v-model="data.width"></a-input>
      </a-form-item>     
    </a-form>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      data: {
        width: 0,
        height: 0,
        index: 0,
      }
    }
  },
  methods: {
    showModal(data) {
        this.data = data
    //   this.data.height = data.height
    //   this.data.width = data.width
    //   this.data.index = data.index
      this.visible = true
    },
    edit() {
      this.visible = false
    }
  }
}
</script>