<template>
  <div id="richTextEditorMenu" :style="textEditorMenuPositon">
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.bold}" title="加粗"
      @click="execute('font-weight',status.bold?'400':'700')">
      <a-icon type="bold" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.italic}" title="斜体"
      @click="execute('font-style',status.italic?'normal':'italic')">
      <a-icon type="italic" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.underline}" title="下划线"
      @click="execute('text-decoration-line',status.underline?'none':'underline')">
      <a-icon type="underline" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.strikeThrough}"
      title="删除线" @click="execute('text-decoration-line',status.strikeThrough?'none':'line-through')">
      <a-icon type="strikethrough" />
    </button>
    <button data-type="params" class="editor_options" :class="{'editor_options_active':status.overline}" title="上划线"
      @click="execute('text-decoration-line',status.overline?'none':'overline')">
      <svg t="1643458808280" class="icon" viewBox="0 0 1168 1168" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4139" width="200" height="200">
        <path
          d="M928 0H96A32 32 0 0 0 64 32v32a32 32 0 0 0 32 32h832a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM512 192A352 352 0 0 0 160 544v128a352 352 0 0 0 704 0v-128A352 352 0 0 0 512 192z m224 480a224 224 0 0 1-448 0v-128a224 224 0 0 1 448 0z"
          p-id="4140"></path>
      </svg>
    </button>
    <select data-type="params" class="editor_options" title="强调线类型"
      v-show="status.underline || status.strikeThrough || status.overline"
      @change="execute('text-decoration-style',status['text-decoration-style'])"
      v-model="status['text-decoration-style']">
      <option v-for="(item,index) in options['text-decoration-style']" class="editor_options"
        :key="'text-decoration-style-'+index" :value="item.value">
        {{item.label}}</option>
    </select>

    <select class="editor_options" data-type="params" title="文字尺寸" id='richTextEditorMenu-fontSize' style="width:55px"
      @change="execute('font-size',status.fontSize+'px')" v-model="status.fontSize">
      <option v-for="(item,index) in 229" class="editor_options" :key="'fontSize-'+index" :value="item+11">
        {{item+11}}px</option>
    </select>

    <select data-type="params" class="editor_options" @change="execute('font-family',status.fontName)" title="字体"
      v-model="status.fontName">
      <option v-for="(item,index) in options['font-family']" class="editor_options" :key="'fontName-'+index"
        :value="item.value">
        {{item.label}}</option>
    </select>

    <select data-type="params" class="editor_options" style="width:55px" title="字间距"
      @change="execute('letter-spacing',status['letter-spacing'])" v-model="status['letter-spacing']">
      <option v-for="(item,index) in 100" class="editor_options" :key="'letter-spacing--'+index"
        :value="`-${101-item}px`">
        -{{101-item}}px</option>
      <option value="normal">normal</option>
      <option value="0px">0px</option>
      <option v-for="(item,index) in 100" class="editor_options" :key="'letter-spacing-'+index" :value="`${item}px`">
        {{item}}px</option>
    </select>
    <select data-type="params" class="editor_options" style="width:55px" title="行距"
      @change="execute('line-height',status['line-height'])" v-model="status['line-height']">
      <option v-for="(item,index) in 26" class="editor_options" :key="'line-height--'+index"
        :value="`${(4 + item) / 10}`">
        {{ ((4 + item) / 10).toFixed(1)}}</option>
      <option value="normal">normal</option>
      <option value="0px">0px</option>
      <option v-for="(item,index) in 100" class="editor_options" :key="'line-height-'+index" :value="`${item}px`">
        {{item}}px</option>
    </select>

    <a-tooltip trigger="hover" placement="top" overlayClassName="tooltip-color-picker">
      <template slot="title">
        <div data-type="params" style="user-select:none">
          <sketch-picker v-model="status.colors" @input="execute('color',tool.colors2rgba(status.colors))" />
        </div>
      </template>
      <button data-type="params" class="editor_options" title="文字颜色">
        <a-icon :style="`color:${tool.colors2rgba(status.colors)}`" type="font-colors" />
      </button>
    </a-tooltip>
    <button data-type="params" class="editor_options" title="文字方向:水平,自左而右"
      :class="{'editor_options_active':status['writing-mode']=='horizontal-tb'}"
      @click="execute('writing-mode','horizontal-tb')">
      <svg t="1643460954582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="10220" width="200" height="200">
        <path
          d="M984.615385 128v59.076923c0 15.753846-13.784615 29.538462-29.538462 29.538462h-531.692308c-15.753846 0-29.538462-13.784615-29.538461-29.538462v-59.076923c0-15.753846 13.784615-29.538462 29.538461-29.538462h531.692308c15.753846 0 29.538462 13.784615 29.538462 29.538462zM423.384615 413.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538462h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538462v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462z m531.692308 177.230769h-531.692308c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h531.692308c15.753846 0 29.538462-13.784615 29.538462-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538462-29.538461z m-177.230769 196.923077h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538461zM68.923077 157.538462H118.153846v246.153846c0 15.753846 13.784615 29.538462 29.538462 29.538461h19.692307c15.753846 0 29.538462-13.784615 29.538462-29.538461V118.153846c0-21.661538-17.723077-39.384615-39.384615-39.384615H68.923077C53.169231 78.769231 39.384615 92.553846 39.384615 108.307692v19.692308C39.384615 143.753846 53.169231 157.538462 68.923077 157.538462zM236.307692 551.384615H68.923077c-15.753846 0-29.538462 13.784615-29.538462 29.538462v19.692308c0 15.753846 13.784615 29.538462 29.538462 29.538461H196.923077v78.769231H78.769231c-21.661538 0-39.384615 17.723077-39.384616 39.384615v157.538462c0 21.661538 17.723077 39.384615 39.384616 39.384615h167.384615c15.753846 0 29.538462-13.784615 29.538462-29.538461v-19.692308c0-15.753846-13.784615-29.538462-29.538462-29.538462H118.153846v-78.76923h118.153846c21.661538 0 39.384615-17.723077 39.384616-39.384616v-157.538461c0-21.661538-17.723077-39.384615-39.384616-39.384616z"
          p-id="10221"></path>
      </svg> </button>
    <button data-type="params" class="editor_options" title="文字方向:垂直,自右而左"
      :class="{'editor_options_active':status['writing-mode']=='vertical-rl'}"
      @click="execute('writing-mode','vertical-rl')">
      <svg t="1643460954582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="10220" width="200" height="200" transform="rotate(90)">
        <path
          d="M984.615385 128v59.076923c0 15.753846-13.784615 29.538462-29.538462 29.538462h-531.692308c-15.753846 0-29.538462-13.784615-29.538461-29.538462v-59.076923c0-15.753846 13.784615-29.538462 29.538461-29.538462h531.692308c15.753846 0 29.538462 13.784615 29.538462 29.538462zM423.384615 413.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538462h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538462v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462z m531.692308 177.230769h-531.692308c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h531.692308c15.753846 0 29.538462-13.784615 29.538462-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538462-29.538461z m-177.230769 196.923077h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538461zM68.923077 157.538462H118.153846v246.153846c0 15.753846 13.784615 29.538462 29.538462 29.538461h19.692307c15.753846 0 29.538462-13.784615 29.538462-29.538461V118.153846c0-21.661538-17.723077-39.384615-39.384615-39.384615H68.923077C53.169231 78.769231 39.384615 92.553846 39.384615 108.307692v19.692308C39.384615 143.753846 53.169231 157.538462 68.923077 157.538462zM236.307692 551.384615H68.923077c-15.753846 0-29.538462 13.784615-29.538462 29.538462v19.692308c0 15.753846 13.784615 29.538462 29.538462 29.538461H196.923077v78.769231H78.769231c-21.661538 0-39.384615 17.723077-39.384616 39.384615v157.538462c0 21.661538 17.723077 39.384615 39.384616 39.384615h167.384615c15.753846 0 29.538462-13.784615 29.538462-29.538461v-19.692308c0-15.753846-13.784615-29.538462-29.538462-29.538462H118.153846v-78.76923h118.153846c21.661538 0 39.384615-17.723077 39.384616-39.384616v-157.538461c0-21.661538-17.723077-39.384615-39.384616-39.384616z"
          p-id="10221"></path>
      </svg>
    </button>
    <button data-type="params" class="editor_options" title="文字方向:垂直,自左而右"
      :class="{'editor_options_active':status['writing-mode']=='vertical-lr'}"
      @click="execute('writing-mode','vertical-lr')">
      <svg t="1643460976476" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" width="200" transform="rotate(90)" height="200">
        <path d="M984.615385 128v59.076923c0 15.753846-13.784615 29.538462-29.538462 29.538462h-531.692308c-15.753846 0-29.538462-13.784615-29.538461-29.538462v-59.076923c0-15.753846 13.784615-29.538462 29.538461-29.538462h531.692308c15.753846 0 29.538462 13.784615 29.538462 29.538462z
  M423.384615 413.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538462h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538462v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462z 
  m531.692308 177.230769h-531.692308c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h531.692308c15.753846 0 29.538462-13.784615 29.538462-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538462-29.538461z 
  m-177.230769 196.923077h-354.461539c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076923c0 15.753846 13.784615 29.538462 29.538461 29.538462h354.461539c15.753846 0 29.538462-13.784615 29.538461-29.538462v-59.076923c0-15.753846-13.784615-29.538462-29.538461-29.538461z
   " />
        <path transform="translate(0,494)" d="M68.923077 157.538462H118.153846v246.153846c0 15.753846 13.784615 29.538462 29.538462 29.538461h19.692307c15.753846 0 29.538462-13.784615 29.538462-29.538461V118.153846c0-21.661538-17.723077-39.384615-39.384615-39.384615H68.923077C53.169231 78.769231 39.384615 92.553846 39.384615 108.307692v19.692308C39.384615 143.753846 53.169231 157.538462 68.923077 157.538462z
" />
        <path transform="translate(0,-494)" d="M236.307692 551.384615H68.923077c-15.753846 0-29.538462 13.784615-29.538462 29.538462v19.692308c0 15.753846 13.784615 29.538462 29.538462 29.538461H196.923077v78.769231H78.769231c-21.661538 0-39.384615 17.723077-39.384616 39.384615v157.538462c0 21.661538 17.723077 39.384615 39.384616 39.384615h167.384615c15.753846 0 29.538462-13.784615 29.538462-29.538461v-19.692308c0-15.753846-13.784615-29.538462-29.538462-29.538462H118.153846v-78.76923h118.153846c21.661538 0 39.384615-17.723077 39.384616-39.384616v-157.538461c0-21.661538-17.723077-39.384615-39.384616-39.384616z
" />
      </svg>
    </button>
    <button title="清空格式" data-type="params" class="editor_options" @click="execute('removeFormat')">
      <svg t="1643464238359" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="11541" width="200" height="200">
        <path
          d="M622 112c17.673 0 32 14.327 32 32l-0.001 139H879c17.673 0 32 14.327 32 32v164c0 17.673-14.327 32-32 32h-25.001L854 880c0 17.673-14.327 32-32 32H201c-17.673 0-32-14.327-32-32l-0.001-369H144c-17.673 0-32-14.327-32-32V315c0-17.673 14.327-32 32-32h224.999L369 144c0-17.673 14.327-32 32-32h221z m176 400H225v344h87.343V739.4c0-30.927 25.072-56 56-56V856h115.656L484 739.4c0-30.927 25.072-56 56-56l-0.001 172.6h115L655 739.4c0-30.927 25.072-56 56-56l-0.001 172.6H798V512z m49-165H176v100h671V347zM590 176H433v100h157V176z"
          p-id="11542"></path>
      </svg>
      <!-- <a-icon type="delete" /> -->
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
  'letter-spacing': [

  ],
  'text-decoration-style': [
    { value: "solid", label: '实线' },
    { value: "double", label: '双实线' },
    { value: "dotted", label: '点线' },
    { value: "dashed", label: '虚线' },
    { value: "wavy", label: '波浪线' }
  ],
  'writing-mode': [
    { value: "horizontal-tb", label: '水平,自上而下' },
    { value: "vertical-rl", label: '垂直,自右而左' },
    { value: "vertical-lr", label: '垂直,自左而右' }
  ],
  'font-family': [
    { value: "\"Microsoft YaHei\", 微软雅黑, sans-serif", label: "微软雅黑" },
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
        overline: false,
        textAlign: 'left',
        'writing-mode': 'horizontal-tb',
        'text-decoration-style': 'solid',
        'letter-spacing': 'normal',
        'line-height': 'normal',
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
      this.status.overline = val['textDecorationLine'].includes('overline')
      this.status.textAlign = val['textAlign']
      this.status['writing-mode'] = val['writingMode']
      this.status['text-decoration-style'] = val['textDecorationStyle']
      this.status['letter-spacing'] = val['letterSpacing']
      this.status['line-height'] = val['lineHeight']
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
    getEditDOM(node) {
      if (!node) { return null } else if (node.nodeName == '#document') {
        return null
      } else if (node.nodeName == 'DIV' && node.dataset.type == 'editor') {
        return node
      } else {
        return this.getEditDOM(node.parentElement)
      }
    },
    getAllChildNodes(node, type = '#text') {
      let collection = []
      for (let index = 0; index < node.childNodes.length; index++) {
        const element = node.childNodes[index];
        switch (element.nodeName) {
          case type:
            collection.push(element)
            if (node.childNodes && node.childNodes.length) {
              let res = this.getAllChildNodes(element, type)
              collection = collection.concat(res)
            }
            break;
          default:
            if (node.childNodes && node.childNodes.length) {
              let res = this.getAllChildNodes(element, type)
              collection = collection.concat(res)
            }
            break;
        }
      }
      return collection
    },
    createElement(type, text = '', style = {}) {
      let element = document.createElement('span')
      if (Object.keys(style).length) {
        for (const key in style) {
          element.style[key] = style[key]
        }
      }
      element.innerText = text
      return element
    },
    execute(cmd = 'bold', args = null) {
      let selection = window.getSelection()
      let dom = this.getEditDOM(selection.anchorNode)
      // this.status[cmd] = !this.status[cmd]
      if (!dom) { return }
      let style = {}
      switch (cmd) {
        case 'color': case 'font-weight': case 'font-style': case 'letter-spacing':
        case 'font-family': case 'font-size': case 'writing-mode': case 'text-decoration-style': case 'line-height':
          style[cmd] = args
          break
        case 'text-decoration-line':
          style[cmd] = args
          if (args = 'none') {
            style['text-decoration-style'] = 'solid'
          }
          break
        case 'removeFormat':
          document.execCommand('useCSS', false, false)
          document.execCommand(cmd, false, args)
          return
        default:
          break;
      }
      if (selection.isCollapsed) {
        let span = document.createElement('span')
        for (const key in style) {
          span.style[key] = style[key]
        }
        if (selection.focusOffset != selection.focusNode.length) {
          let nextValue = selection.focusNode.nodeValue.slice(selection.focusOffset)
          selection.focusNode.nodeValue = selection.focusNode.nodeValue.slice(0, selection.focusOffset)
          selection.focusNode.after(document.createTextNode(nextValue))
        }
        selection.focusNode.after(span)
        span.innerHTML = '&#8203;'
        selection.collapse(span.firstChild, 1)
      } else {
        if (selection.anchorNode == selection.focusNode) {
          let { anchorNode, anchorOffset, focusNode, focusOffset } = selection
          let pre = anchorNode.nodeValue.slice(0, anchorOffset > focusOffset ? focusOffset : anchorOffset)
          let next = focusNode.nodeValue.slice(anchorOffset > focusOffset ? anchorOffset : focusOffset)
          let value = anchorNode.nodeValue.slice(anchorOffset > focusOffset ? focusOffset : anchorOffset, anchorOffset > focusOffset ? anchorOffset : focusOffset)
          let nextTextNode = document.createTextNode(next)
          focusNode.after(nextTextNode)
          anchorNode.nodeValue = pre
          let newSpan = this.createElement('span', '', style)
          let newTextNode = document.createTextNode(value)
          newSpan.appendChild(newTextNode)
          anchorNode.after(newSpan)
          selection.setBaseAndExtent(newTextNode, 0, newTextNode, newTextNode.length)
        } else {

          let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

          let textNode = this.getAllChildNodes(dom)


          textNode = textNode.filter(ele => selection.containsNode(ele, false) && ele != selection.anchorNode && ele != selection.focusNode)
          textNode.forEach(element => {
            if (selection.containsNode(element, false)) {
              element.after(this.createElement('span', element.nodeValue, style))
              element.nodeValue = ''
            }
          });


          if (position == 4) { // anchorNode 在 focusNode 前面
            let anchorNodeNextValue = selection.anchorNode.nodeValue.slice(selection.anchorOffset)
            let newPreSpan = this.createElement('span', '', style)
            let newPreTextNode = document.createTextNode(anchorNodeNextValue)
            selection.anchorNode.nodeValue = selection.anchorNode.nodeValue.slice(0, selection.anchorOffset)
            selection.anchorNode.after(newPreSpan)
            newPreSpan.appendChild(newPreTextNode)

            let focusNodeNextValue = selection.focusNode.nodeValue.slice(0, selection.focusOffset)
            let newNextSpan = this.createElement('span', '', style)
            let newNextTextNode = document.createTextNode(focusNodeNextValue)
            selection.focusNode.after(document.createTextNode(selection.focusNode.nodeValue.slice(selection.focusOffset)))
            newNextSpan.appendChild(newNextTextNode)
            selection.focusNode.replaceWith(newNextSpan)

            selection.setBaseAndExtent(newPreTextNode, 0, newNextTextNode, newNextTextNode.length)
          } else {
            let anchorNodeNextValue = selection.focusNode.nodeValue.slice(selection.focusOffset)
            let newPreSpan = this.createElement('span', '', style)
            let newPreTextNode = document.createTextNode(anchorNodeNextValue)
            selection.focusNode.nodeValue = selection.focusNode.nodeValue.slice(0, selection.focusOffset)
            selection.focusNode.after(newPreSpan)
            newPreSpan.appendChild(newPreTextNode)

            let focusNodeNextValue = selection.anchorNode.nodeValue.slice(0, selection.anchorOffset)
            let newNextSpan = this.createElement('span', '', style)
            let newNextTextNode = document.createTextNode(focusNodeNextValue)
            selection.anchorNode.after(document.createTextNode(selection.anchorNode.nodeValue.slice(selection.anchorOffset)))
            newNextSpan.appendChild(newNextTextNode)
            selection.anchorNode.replaceWith(newNextSpan)

            selection.setBaseAndExtent(newPreTextNode, 0, newNextTextNode, newNextTextNode.length)
          }

        }
      }

    },
  }
}
</script>


<style lang="less" scoped>
#richTextEditorMenu {
  z-index: 99999;
  position: fixed;
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
  .editor_options:active {
    background-color: rgba(79, 128, 255, 0.5);
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

#richTextEditorMenu-fontSize::before {
  content: "T";
  float: left;
  width: 25%;
  background: yellow;
  color: red;
}
</style>