<template>
  <div class="basetool-tab">
    <div class="param-tab-options">
      <div v-for="(item,index) in [{value:'base',label:'操作'}]" :key="'paramTab-'+index" @click="currentTab=item.value"
        data-type="params" :class="{'param-tab-option-selected':(currentTab==item.value)}">
        {{item.label}}
      </div>
    </div>
    <div class="param-tab">
      <div class="param-container" v-if="!customClip.currentLine">
        <button v-if="!customClip.status.onDraw && customClip.shape=='path'" class="param-button" 
          @click="drawPath">添加节点</button>
        <button class="param-button" @click="addClipItem">完成剪裁</button>
      </div>
      <div class="param-container" v-if="customClip.currentLine">
        <button class="param-button" @click="createNewPoint('pre')">向前添加节点</button>
        <button class="param-button" @click="createNewPoint('next')">向后添加节点</button>
        <button class="param-button" @click="deletePathNode">删除当前节点</button>
      </div>
      <div class="param-container" v-if="customClip.currentLine">
        <div>节点</div>
        <div>
          <paramsSelect title="类型" :full="true" :disabled="customClip.currentLine.type=='M'" :selected="customClip.currentLine.type"
            :options="options['lineType']" :args="['customClip','currentLine','type']" @paramChange="paramChange" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import tool from '../../../module/tool'
import paramsSelect from '../components/paramsSelect.vue'

const options = {
  lineType: [
    { value: 'M', label: '起点', disabled: true },
    { value: 'L', label: '直线' },
    { value: 'C', label: '三阶赛贝尔曲线' },
    { value: 'Q', label: '二阶赛贝尔曲线' },
  ]
}
export default {
  props: {
    customClip: Object,
    process:Array,
  },
  components: {
    paramsSelect: paramsSelect,
  },
  data() {
    this.options = options
    return {
      currentTab: 'base',
    }
  },
  methods: {
    drawPath(){
       this.$emit('paramChange', ['customClip','status','onDraw'], true)
       this.process.push('Darw')
    },
    addPathNode() {
      let node = tool.getMiddleNode(this.customClip.currentLine.start, this.customClip.currentLine.end)
      this.customClip.points.splice(this.customClip.points.indexOf(this.customClip.currentLine.start), 0, this.customClip.currentLine.start, node)
      this.$emit('paramChange', ['customClip', 'currentLine'], null)
    },
    createNewPoint(type) {
      let pre
      let aft
      let index = this.customClip.currentLineIndex
      switch (type) {
        case 'pre':
          if (!this.customClip.currentLineIndex) { return }
          pre = this.customClip.points[this.customClip.currentLineIndex - 1]
          aft = this.customClip.points[this.customClip.currentLineIndex]
          break;
        case 'next':
          index++
          pre = this.customClip.points[this.customClip.currentLineIndex]
          if (this.customClip.points[this.customClip.currentLineIndex + 1]) {
            aft = this.customClip.points[this.customClip.currentLineIndex + 1]
          } else { aft = { x: pre.x + 100, y: pre.y + 100 } }
          break
      }
      let point = {
        type: 'L',
        x: aft.x - (aft.x - pre.x) / 2,
        y: aft.y - (aft.y - pre.y) / 2,
        params: {
          x1: aft.x - (aft.x - pre.x) / 8 * 7,
          y1: aft.y - (aft.y - pre.y) / 8 * 7,
          x2: aft.x - (aft.x - pre.x) / 8 * 5,
          y2: aft.y - (aft.y - pre.y) / 8 * 5,
        }
      }
      this.customClip.points.splice(index, 0, point)
      if (type == 'pre') {
        this.customClip.preLine = point
        this.customClip.currentLineIndex += 1
      }
      this.$forceUpdate()
    },
    deletePathNode(type) {
      this.customClip.points.splice(this.customClip.currentLineIndex, 1,)
      this.$emit('paramChange', ['customClip', 'preLine'], null)
      this.$emit('paramChange', ['customClip', 'currentLine'], null)
      this.$emit('paramChange', ['customClip', 'currentLineIndex'], null)
    },
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    },
    addClipItem() {
      this.$emit('addClipItem')
      this.$emit('paramChange', ['customClip', 'status', 'show'], false)
    }
  }
}
</script>

<style lang="less">

</style>