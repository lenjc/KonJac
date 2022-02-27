<template>
  <div class="basetool-tab">
    <div class="param-tab-options">
      <div v-for="(item,index) in [{value:'base',label:'基础'}]" :key="'paramTab-'+index" @click="currentTab=item.value"
        data-type="params" :class="{'param-tab-option-selected':(currentTab==item.value)}">
        {{item.label}}
      </div>
    </div>
    <div class="param-tab" v-if="!svgData.currentNode">
      <div class="param-container">
        <div>
          <button class="param-button" :class="{'param-button-selected':svgData && svgData.shape=='rect'}"
            @click="paramChange(['svgData','shape'],'rect')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-juxing" />
            </svg> 矩形</button>
          <div v-show="svgData && svgData.shape=='rect'">
            点击起始位置拖动鼠标创建矩形
          </div>
          <button class="param-button" :class="{'param-button-selected':svgData && svgData.shape=='ellipse'}"
            @click="paramChange(['svgData','shape'],'ellipse')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuoyuan1" />
            </svg> 椭圆
          </button>
          <div v-show="svgData && svgData.shape=='ellipse'">
            点击起始位置拖动鼠标创建椭圆
          </div>
          <button class="param-button" :class="{'param-button-selected':svgData && svgData.shape=='path'}"
            @click="paramChange(['svgData','shape'],'path')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pen" />
            </svg> 路径
          </button>
          <div v-show="svgData && svgData.shape=='path'">
            点击生成路径点创建形状
          </div>
        </div>
      </div>
      <div class="param-container">
        <div>预设参数</div>
        <div>
          <paramsInputNum title="边框宽度" :value="svgData.defaultStyle['stroke-width']"
            :args="['svgData','defaultStyle','stroke-width']" @paramChange="paramChange" />
          <paramsColor title="边框颜色" :colors="svgData.defaultStyle['stroke']" :args="['svgData','defaultStyle','stroke']"
            @paramChange="paramChange" />
          <paramsColor title="填充" :colors="svgData.defaultStyle['fill']" :args="['svgData','defaultStyle','fill']"
            @paramChange="paramChange" />
        </div>
      </div>
    </div>
    <div class="param-tab" v-if="svgData.currentNode && svgData.status.edit && !svgData.currentLine ">
      <div class="param-container">
        <div>操作</div>
        <div>
          <button class="param-button" v-if="!['line'].includes(svgData.currentNode.type)" :class="{'param-button-selected':svgData.addNewPoint=='L'}"
            @click="triggetMethod(['$refs','svgEditorView','addNewPoint'],'L')">添加点</button>
          <button class="param-button" v-if="['path'].includes(svgData.currentNode.type)" :class="{'param-button-selected':svgData.addNewPoint=='M'}"
            @click="triggetMethod(['$refs','svgEditorView','addNewPoint'],'M')">添加起点</button>
        </div>
      </div>
    </div>
    <div class="param-tab" v-if="svgData.currentNode && svgData.status.edit && svgData.currentLine   ">
      <div class="param-container" v-if="svgData.currentNode.type!='line'">
        <div>点</div>
        <div>
          <button class="param-button" :v-if="!svgData.currentLineIndex"
            @click="triggetMethod(['$refs','svgEditorView','createNewPoint'],'pre')">向前新增点</button>
          <button class="param-button" @click="triggetMethod(['$refs','svgEditorView','createNewPoint'],'next')">向后新增点
          </button>
          <button class="param-button" @click="triggetMethod(['$refs','svgEditorView','deletePoint'],)">删除点</button>
        </div>
      </div>
      <div class="param-container">
        <div>点</div>
        <div>
          <paramsInputNum title="x" :value="svgData.currentLine.x.toFixed(0)*1" :args="['svgData','currentLine','x']"
            @paramChange="paramChange" />
          <paramsInputNum title="y" :value="svgData.currentLine.y.toFixed(0)*1" :args="['svgData','currentLine','y']"
            @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container" v-if="svgData.currentNode.type=='path'">
        <div>点</div>
        <div>
          <paramsSelect title='类型' :full="true" :selected="svgData.currentLine.type"
            :disabled="svgData.currentLine.type=='M'" :options="options['pathType']"
            :args="['svgData','currentLine','type']" @paramChange="paramChange" />
          <paramsInputNum v-if="svgData.currentLine.type=='C' || svgData.currentLine.type=='Q'" title="控制点1-x"
            :value="svgData.currentLine.params.x1*1" :args="['svgData','currentLine','params','x1']"
            @paramChange="paramChange" />
          <paramsInputNum v-if="svgData.currentLine.type=='C' || svgData.currentLine.type=='Q'" title="控制点1-y"
            :value="svgData.currentLine.params.y1*1" :args="['svgData','currentLine','params','y1']"
            @paramChange="paramChange" />
          <paramsInputNum v-if="svgData.currentLine.type=='C'" title="控制点2-x" :value="svgData.currentLine.params.x2*1"
            :args="['svgData','currentLine','params','x2']" @paramChange="paramChange" />
          <paramsInputNum v-if="svgData.currentLine.type=='C'" title="控制点2-y" :value="svgData.currentLine.params.y2*1"
            :args="['svgData','currentLine','params','y2']" @paramChange="paramChange" />
        </div>
      </div>
    </div>
    <div class="param-tab" v-if="svgData.currentNode && !svgData.status.edit ">
      <div class="param-container">
        <div>基础</div>
        <div>
          <paramsInputNum v-if="svgData.box" title="x" :value="svgData.box.x.toFixed(0)*1"
            :args="['$refs','svgEditorView','controlPositionX']" @paramChange="triggetMethod" />
          <paramsInputNum v-if="svgData.box" title="y" :value="svgData.box.y.toFixed(0)*1"
            :args="['$refs','svgEditorView','controlPositionY']" @paramChange="triggetMethod" />
          <paramsInputNum v-if="svgData.box && svgData.currentNode.type!='rect'" title="width"
            :value="svgData.box.width.toFixed(0)*1" :args="['$refs','svgEditorView','controlWidth']"
            @paramChange="triggetMethod" />
          <paramsInputNum v-if="svgData.box && svgData.currentNode.type!='rect'" title="height"
            :value="svgData.box.height.toFixed(0)*1" :args="['$refs','svgEditorView','controlHeight']"
            @paramChange="triggetMethod" />

          <paramsColor v-if="!['line'].includes(svgData.currentNode.type) && svgData.currentNode.style.fill.rgba"
            title="填充" :colors="svgData.currentNode.style.fill" :args="['svgData','currentNode','style','fill']"
            @paramChange="paramChange" />

          <paramsInputAuto v-if="!['line'].includes(svgData.currentNode.type) && !svgData.currentNode.style.fill.rgba"
            title="填充" :full="true" :value="svgData.currentNode.style.fill"
            :options="['none','#000000','rgba(0,0,0,1)']" :args="['svgData','currentNode','style','fill']"
            @paramChange="paramChange" />
          <paramsInputNum v-if="!['circle','line'].includes(svgData.currentNode.type)" title="旋转"
            :value="svgData.currentNode.rotate*1" step="1" :args="['svgData','currentNode','rotate']"
            @paramChange="paramChange" />
          <paramsSelect title='闭合' v-if="svgData.currentNode.type=='path'" :selected="svgData.currentNode.closePath"
            :options="options['closePath']" :args="['svgData','currentNode','closePath']" @paramChange="paramChange" />
          <paramsSelect title='填充规则' v-if="['path','polygon','polyline'].includes(svgData.currentNode.type)"
            :selected="svgData.currentNode.params['fill-rule']" :options="options['fillRule']"
            :args="['svgData','currentNode','params','fill-rule']" @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container" v-if="svgData.currentNode.type=='rect'">
        <div>矩形</div>
        <div>
          <paramsInputNum title="width" :value="svgData.currentNode.params.width*1"
            :args="['svgData','currentNode','params','width']" @paramChange="paramChange" />
          <paramsInputNum title="height" :value="svgData.currentNode.params.height*1"
            :args="['svgData','currentNode','params','height']" @paramChange="paramChange" />
          <paramsInputNum title="圆角X" :value="svgData.currentNode.params.rx*1"
            :args="['svgData','currentNode','params','rx']" @paramChange="paramChange" />
          <paramsInputNum title="圆角Y" :value="svgData.currentNode.params.ry*1"
            :args="['svgData','currentNode','params','ry']" @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>描边</div>
        <div>
          <paramsColor v-if="svgData.currentNode.style.stroke.rgba" title="填充"
            :colors="svgData.currentNode.style.stroke" :args="['svgData','currentNode','style','stroke']"
            @paramChange="paramChange" />

          <paramsInputAuto v-if="!svgData.currentNode.style.stroke.rgba" title="颜色"
            :value="svgData.currentNode.style.stroke" :options="['none','#000000','rgba(0,0,0,1)']"
            :args="['svgData','currentNode','style','stroke']" @paramChange="paramChange" />
          <paramsInputNum title="宽度" :value="svgData.currentNode.style['stroke-width']*1"
            :args="['svgData','currentNode','style','stroke-width']" min="0" @paramChange="paramChange" />
          <paramsInputNum title="透明度" :value="svgData.currentNode.style['stroke-opacity']*1"
            :args="['svgData','currentNode','style','stroke-opacity']" min="0" max="1" step="0.1"
            @paramChange="paramChange" />
          <paramsInputAuto title="图案" :value="svgData.currentNode.style['stroke-dasharray']" :options="['none','3 3']"
            :args="['svgData','currentNode','style','stroke-dasharray']" @paramChange="paramChange" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import tool from '../../../module/tool'
import paramsInputNum from '../components/paramsInputNum.vue'
import paramsInputAuto from '../components/paramsInputAuto.vue'
import paramsColor from '../components/paramsColor.vue'
import paramsSelect from '../components/paramsSelect.vue'

export default {
  props: {
    svgData: Object,
  },
  components: {
    paramsInputNum: paramsInputNum,
    paramsColor: paramsColor,
    paramsInputAuto: paramsInputAuto,
    paramsSelect: paramsSelect
  },
  data() {
    return {
            selected:'',
      currentTab: 'base',
      options: {
        pathType: [
          { value: 'M', label: '起点', disabled: true },
          { value: 'L', label: '直线' },
          { value: 'C', label: '三次赛贝尔曲线' },
          { value: 'Q', label: '二次赛贝尔曲线' },
          { value: 'A', label: '圆弧', disabled: true },
        ],
        closePath: [
          { value: '1', label: '是', },
          { value: '0', label: '否' },
        ],
        fillRule: [
          { value: 'nonzero', label: 'nonzero', },
          { value: 'evenodd', label: 'evenodd' },
        ]
      }
    }
  },
  watch() {

  },
  methods: {
    addPathNode() {
      let node = tool.getMiddleNode(this.selectedLine.start, this.selectedLine.end)
      this.customClip.points.splice(this.customClip.points.indexOf(this.selectedLine.start), 1, this.selectedLine.start, node)
      let newLine1 = {
        type: 'L',
        start: this.selectedLine.start,
        end: node,
        params: tool.getDefault(this.selectedLine.start, node)
      }
      let newLine2 = {
        type: 'L',
        start: node,
        end: this.selectedLine.end,
        params: tool.getDefault(node, this.selectedLine.end)
      }
      this.customClip.lines.splice(this.customClip.lines.indexOf(this.selectedLine), 1, newLine1, newLine2)
      this.$emit('paramChange', ['selectedLine'], null)
    },
    deletePathNode(type) {
      let otherLine = this.customClip.lines.find(ele => ele[type ? 'end' : 'start'] == this.selectedLine[type ? 'start' : 'end'])
      if (otherLine) {
        let newLine = {
          type: 'L',
          start: type ? otherLine.start : this.selectedLine.start,
          end: type ? this.selectedLine.end : otherLine.end,
          params: tool.getDefault(type ? otherLine.start : this.selectedLine.start, type ? this.selectedLine.end : otherLine.end)
        }
        this.customClip.lines.splice(type ? this.customClip.lines.indexOf(otherLine) : this.customClip.lines.indexOf(this.selectedLine), 2, newLine)
      } else {
        this.customClip.lines.splice(this.customClip.lines.indexOf(this.selectedLine), 1,)
      }
      this.customClip.points.splice(this.customClip.points.indexOf(this.selectedLine[type ? 'start' : 'end']), 1,)
      this.$emit('paramChange', ['selectedLine'], null)
    },
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    },
    addClipItem() {
      this.$emit('addClipItem')
      this.$emit('paramChange', ['customClip', 'status', 'show'], false)
    },
    triggetMethod(args, data) {
      this.$emit('triggetMethod', args, data)
    }
  }
}
</script>

<style lang="less">
.param-button-selected {
  background-color: #4f80ff !important;
}
</style>