<template>
  <div :class="`param-item ${full?'param-item-full':''}`" data-type="params">
    <div>  <input type="checkbox" v-if="checkbox" value="启用" :checked="checked" @click="checked=!checked" @change="paramChange(args,data)" />
     <span>{{title}}</span> </div>
    <select style="border:none" class="param-select" v-model="data" @change="paramChange(args,data)" :disabled="disabled">
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
    checkbox: false,
    cssstyle: ''
  },
  data() {
    return {
      data: this.selected,
       checked: false,
    }
  },
  watch: {
    selected(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args,data) {
      if (this.checkbox) {
        this.$emit('paramChange', args, data, this.checked)
      } else {
        this.$emit('paramChange', args, data)
      }
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