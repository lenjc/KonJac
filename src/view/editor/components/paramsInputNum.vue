<template>
  <div class="param-item" data-type="params">
    <div> <input type="checkbox" v-if="checkbox" value="启用" :checked="checked" @click="checked=!checked"
        @change="paramChange(args,data)" />
      <span>{{title}}</span>
    </div>
    <input v-model="data" type="number" :min="min" :step="step" :max="max" @input="paramChange(args)" />
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    title: String,
    max: String,
    min: String,
    step: String,
    args: Array,
    format: Function,
    checkbox: false,
    cssstyle: ''
  },
  data() {
    return {
      data: this.value,
      checked: false,
    }
  },
  watch: {
    value(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args) {
      let data = this.data
      if(this.format){
        data = this.format(this.data)}
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
.param-item {
  input {
    background-color: transparent;
    border: none;
    color: #4f80ff;
    width: 100%;
    outline: none;
    padding: 0 5px 0 5px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
}
</style>