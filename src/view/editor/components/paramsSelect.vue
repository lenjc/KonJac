<template>
  <div :class="`param-item ${full?'param-item-full':''}`" data-type="params">
    <div>{{title}}</div>
    <select style="border:none" class="param-select" v-model="data" @change="paramChange(args)" :disabled="disabled">
      <option v-for="(item,index) in options" :key="`${args.join('-')}-${index}`" :value="item.value"
        :disabled="item.disabled?true:false">
        {{item.label}}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    full: { type: Boolean, default: false },
    title: String,
    options: Array,
    selected: String,
    args: Array,
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      data: this.selected
    }
  },
  watch: {
    selected(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args) {
      this.$emit('paramChange', args, this.data)
    }
  }
}
</script>

<style lang="less" >
.param-select {
  background-color: transparent;
  height: 30px;
  border: none;
  outline: none;
  padding: 0 10px 0 5px;
  width: calc(100% - 5px);
  color: #4f80ff;
}
</style>