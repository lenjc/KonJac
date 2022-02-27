<template>
  <div class="param-item" data-type="params">
    <div>  <input type="checkbox" v-if="checkbox" value="启用" :checked="checked" @click="checked=!checked" @change="paramChange(args,data)" />
     <span>{{title}}</span> </div>
    <a-tooltip trigger="click" placement="rightBottom" overlayClassName="tooltip-color-picker">
      <template slot="title">
        <div data-type="params" style="user-select:none">
          <sketch-picker v-model.sync="data" @input="paramChange(args)" />
        </div>
      </template>
      <div class="param-color" style="user-select: none;">
        <div class="transparent-square">
        </div>
        <div :style="{'background-color':(tool.colors2rgba(data))}">
        </div>
      </div>
    </a-tooltip>
  </div>
</template>

<script>

import { Sketch } from 'vue-color'
import tool from '../../../module/tool'

export default {
  components: {
    'sketch-picker': Sketch,
  },
  props: {
    colors: Object,
    title: String,
    args: Array,
     checkbox: false,
    cssstyle: ''
  },
  data() {
    this.tool = tool
    return {
      data: this.colors,
       checked: false,
    }
  },
  watch: {
    colors(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args) {
      if (this.checkbox) {
        this.$emit('paramChange', args, this.data, this.checked)
      } else {
        this.$emit('paramChange', args, this.data)
      }
    }
  }
}
</script>

<style lang="less" >
.param-color {
  padding: 0;
  height: 30px;
  position: relative;
  bottom: 0px;
  cursor: pointer;
  box-shadow:  0 0 1px #000;
  border-end-end-radius: 3px;
  user-select: none;
  border-end-start-radius: 3px;
  > div {
    position: absolute;
    width: 100%;
    height: 100%;
    border-end-end-radius: 3px;
    border-end-start-radius: 3px;
  }
}
</style>