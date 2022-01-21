<template>
  <div class="param-item" data-type="params">
    <div>{{title}}</div>
    <input v-model="data" type="number" :min="min" :step="step" :max="max" 
      @input="paramChange(args)" />
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
  },
  data() {
    return {
      data: this.value
    }
  },
  watch: {
    value(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args) {
      this.$emit('paramChange', args, this.format ? this.format(this.data) : this.data*1)
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