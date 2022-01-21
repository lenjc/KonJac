<template>
  <div id="richTextEditorMenu" :style="textEditorMenuPositon">
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.bold}"
      @click="execute('bold',true)">
      <a-icon type="bold" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.italic}"
      @click="execute('italic')">
      <a-icon type="italic" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.underline}"
      @click="execute('underline')">
      <a-icon type="underline" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.strikeThrough}"
      @click="execute('strikeThrough')">
      <a-icon type="strikethrough" />
    </button>

    <select data-type="params" class="editor_options" @change="execute('fontName',status.fontName)"
      v-model="status.fontName">
      <option v-for="(item,index) in options['font-family']" class="editor_options" :key="'fontName-'+index"
        :value="item.value">
        {{item.label}}</option>
    </select>
    <select data-type="params" class="editor_options" style="width:55px" @change="execute('fontSize',status.fontSize)"
      v-model="status.fontSize">
      <option v-for="(item,index) in 229" class="editor_options" :key="'fontSize-'+index" :value="item+11">
        {{item+11}}</option>
    </select>
    <a-tooltip trigger="hover" placement="top" overlayClassName="tooltip-color-picker">
      <template slot="title">
        <div data-type="params" style="user-select:none">
          <sketch-picker v-model="status.colors" @input="execute('foreColor',tool.colors2rgba(status.colors))" />
        </div>
      </template>
      <button data-type="params" class="editor_options">
        <a-icon :style="`color:${tool.colors2rgba(status.colors)}`" type="font-colors" />
      </button>
    </a-tooltip>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.textAlign=='left'}"
      @click="execute('justifyLeft')">
      <a-icon type="align-left" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.textAlign=='center'}"
      @click="execute('justifyCenter')">
      <a-icon type="align-center" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.textAlign=='right'}"
      @click="execute('justifyRight')">
      <a-icon type="align-right" />
    </button>
    <button data-type="params" class="editor_options" @click="execute('removeFormat')">
      <a-icon type="delete" />
    </button>
  </div>
</template>

<script>


import { Sketch } from 'vue-color'
import tool from '../../../module/tool'

const options = {
  paramTab: {
    text: [{ value: 'text', label: '文本' },
    { value: 'container', label: '容器' }]
  },
  'font-family': [
    { value: "\"Microsoft YaHei\", \"微软雅黑\", sans-serif", label: "微软雅黑" },
    { value: "NSimSun, serif", label: "新宋体" },
    { value: "\"STHeiti Light\", sans-serif", label: "华文细黑" },
    { value: "YouYuan, sans-serif", label: "幼圆" },
    { value: "KaiTi, serif", label: "楷体" },
    { value: "SimHei, serif", label: "黑体" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "\"Book Antiqua\", serif", label: "Book Antiqua" },
    { value: "\"Century Gothic\", sans-serif", label: "Century Gothic" },
    { value: "\"Courier New\", serif", label: "Courier New" },
    { value: "\"Times New Roman\", serif", label: "Times New Roman" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Impact, fantasy", label: "Impact" },
    { value: "PmingLiu, sans-serif", label: "PmingLiu" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Tahoma, sans-serif", label: "Tahoma" }
  ],
}

export default {
  components: {
    'sketch-picker': Sketch,
  },
  props: {
    textEditorMenuPositon: Object,
  },
  data() {
    this.options = options
    this.tool = tool
    return {
      status: {
        bold: false,
        italic: false,
        fontName: "\"Microsoft YaHei\",sans-serif",
        fontSize: 18,
        colors: {
          rgba: { r: 0, g: 0, b: 0, a: 1, }
        },
        underline: false,
        strikeThrough: false,
        textAlign: 'left'
      },
      selectionStyle: null,
    }
  },
  watch: {
    selectionStyle(val, oldVal) {
      this.status.bold = (val['fontWeight'] > 400 ? true : false)
      this.status.italic = (val['fontStyle'] == 'italic') ? true : false
      this.status.fontName = val['fontFamily']
      this.status.fontSize = parseInt(val['fontSize'])
      this.status.colors = tool.format2colors(val['color'])
      this.status.underline = val['textDecorationLine'].includes('underline')
      this.status.strikeThrough = val['textDecorationLine'].includes('line-through')
      this.status.textAlign = val['textAlign']
    },
  },
  created() {
    document.addEventListener("selectionchange", this.getSelectionStyle);
  },
  methods: {
    getSelectionStyle(e) {
      let activeElement = document.activeElement;
      if (activeElement.dataset && activeElement.dataset.type == 'editor') {
        this.selectionStyle = window.getComputedStyle(window.getSelection().anchorNode.parentElement, null)
      }
    },
    execute(cmd = 'bold', args = null) {
      switch (cmd) {
        case 'foreColor': case 'fontName': case 'fontSize': case 'removeFormat': break;
        case 'justifyCenter':
          this.status['textAlign'] = 'center'
          break;
        case 'justifyLeft':
          this.status['textAlign'] = 'left'
          break;
        case 'justifyRight':
          this.status['textAlign'] = 'right'
          break;
        default:
          this.status[cmd] = !this.status[cmd]
          break;
      }
      document.execCommand('useCSS', false, false)
      document.execCommand(cmd, false, args)
      if (window.getSelection().focusNode.parentElement.dataset.type == 'editor') { return }
      switch (cmd) {
        case 'fontSize':
          this.$nextTick(() => {
            window.getSelection().focusNode.parentElement.style[cmd] = args + 'px'
          })
          break;
      }
    },
  }
}
</script>


<style lang="less" scoped>
#richTextEditorMenu {
  z-index: 999;
  position: absolute;
  // width: 200px;
  // height: 50px;
  padding: 10px;
  background-color: #2f2f2f;
  border-radius: 5px;
  transform: translateY(-100%) translateY(-10px);
  display: flex;
  align-items: center;
  .editor_options {
    width: 30px;
    height: 30px;
    cursor: pointer;
    padding: 0;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
    line-height: 30px;
    background-color: #444;
    border-top: 1px solid #444;
    border-bottom: 1px solid #444;
    border-left: 1px solid #444;
    border-right: none;
    border-radius: 0px;
    vertical-align: middle;
  }
  .editor_options:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .editor_options:last-child {
    border-right: 1px solid #444;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .editor_options_active {
    color: #ddd;
    background-color: #4f80ff;
  }
  select.editor_options {
    height: 30px;
    font-size: 14px;
    width: 90px;
    padding: 0;
    border: none;
  }
  input.editor_options {
    width: 60px;
  }
}
#richTextEditorMenu:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 20px;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: solid;
  border-color: transparent;
  border-top-width: 8px;
  border-top-color: currentColor;
  color: #2f2f2f;
}
</style>