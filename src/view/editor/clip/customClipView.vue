<template>
  <div id='customClipView' :style="customClip.style" data-type="customClipView" @mousemove="listenMouse"
    @mouseenter="listenMouse" @click="drawShape" @contextmenu="lineListen">
    <svg xmlns="http://www.w3.org/2000/svg" :style="{width:customClip.style.width,height:customClip.style.height}">
      <g v-if="customClip.shape=='path'">
        <path v-for="(path,index) in customClip.points" :key="'svgPath1-'+index"
          :d="customClip.points | pathType(index)" stroke="#000" class="svg-line" stroke-width="1px"
          @click="selectLine(index)" fill="none" :stroke-dasharray="customClip.currentLine==path?0:4"
          stroke-dashoffset="4">
          <animate attributeType="CSS" attributeName="stroke-dashoffset" from="4" to="-4" dur="1s"
            repeatCount="indefinite" />
        </path>
        <path v-if="customClip.status.onDraw"
          :d="`M${customClip.points[0].x},${customClip.points[0].y} L${position.x},${position.y} L${customClip.points[customClip.points.length-1].x},${customClip.points[customClip.points.length-1].y}`"
          fill="none" stroke="#4F80FF" stroke-width="1" stroke-dasharray="4 4" />

        <path v-if="!customClip.status.onDraw && customClip.points.length>1"
          :d="`M${customClip.points[customClip.points.length-1].x},${customClip.points[customClip.points.length-1].y} L${customClip.points[0].x},${customClip.points[0].y}`"
          fill="none" stroke="#4F80FF" stroke-width="1" stroke-dasharray="4" stroke-dashoffset="4">
          <animate attributeType="CSS" attributeName="stroke-dashoffset" from="4" to="-4" dur="1s"
            repeatCount="indefinite" />
        </path>

        <path v-if="customClip.currentLine && customClip.currentLine.type=='C'"
          :d="customClip.currentLine | lineFilter(customClip.preLine,'x1y1')" fill="none" stroke="#4F80FF"
          stroke-width="1" />
        <path v-if="customClip.currentLine && customClip.currentLine.type=='C'"
          :d="customClip.currentLine | lineFilter(customClip.preLine,'x2y2')" fill="none" stroke="#4F80FF"
          stroke-width="1" />
        <path v-if="customClip.currentLine && customClip.currentLine.type=='Q'"
          :d="customClip.currentLine | lineFilter(customClip.preLine,'x1y1x2y2')" fill="none" stroke="#4F80FF"
          stroke-width="1" />

        <rect v-for="(point,index) in customClip.points" :key="'svgPoint-'+index" :x="point.x-4" :y="point.y-4"
          class="svg-point" data-type="point" width="8" height="8"
          :fill="customClip.currentLine==point?'#4F80FF':'#fff'" stroke='#4F80FF' stroke-width='2'
          @click="selectLine(index)" @mousedown.stop="movePoint($event,point,{x:'x',y:'y'})" />

        <circle v-if="customClip.currentLine && (customClip.currentLine.type=='C'|| customClip.currentLine.type=='Q')"
          :cx="customClip.currentLine.params.x1" :cy="customClip.currentLine.params.y1" r="4" fill="#4F80FF"
          class="svg-point" @mousedown.stop="movePoint($event,customClip.currentLine.params,{x:'x1',y:'y1'})" />

        <circle v-if="customClip.currentLine && customClip.currentLine.type=='C'" :cx="customClip.currentLine.params.x2"
          :cy="customClip.currentLine.params.y2" r="4" fill="#4F80FF" class="svg-point"
          @mousedown.stop="movePoint($event,customClip.currentLine.params,{x:'x2',y:'y2'})" />

      </g>
      <g v-if="customClip.shape=='rect'">
        <path v-if="!customClip.points[1]" :d="customClip.points[0] | rectFilter(position)" stroke="#000"
          stroke-width="1" stroke-dasharray="4" stroke-dashoffset="4" fill='none'>
          <animate attributeType="CSS" attributeName="stroke-dashoffset" from="4" to="-4" dur="1s"
            repeatCount="indefinite" />
        </path>

        <path v-if="customClip.points[1]" :d="customClip.points[0] | rectFilter(customClip.points[1])" stroke="#000"
          stroke-width="1" stroke-dasharray="4" stroke-dashoffset="4" fill='none'>
          <animate attributeType="CSS" attributeName="stroke-dashoffset" from="4" to="-4" dur="1s"
            repeatCount="indefinite" />
        </path>

        <rect :x="customClip.points[0].x-4" :y="customClip.points[0].y-4" width="8" height="8" fill="#4f80ff"
          class="svg-point" @mousedown.stop="movePoint($event,customClip.points[0],{x:'x',y:'y'})" />
        <rect v-if="customClip.points[1]" :x="customClip.points[1].x-4" :y="customClip.points[1].y-4" width="8"
          height="8" class="svg-point" fill="#4f80ff"
          @mousedown.stop="movePoint($event,customClip.points[1],{x:'x',y:'y'})" />
      </g>
      <g id="customClipView-preview">
        <path v-if="customClip.shape=='path'" :d="customClip.points | pathShape" fill="none" stroke="transparent" />
        <path v-if="customClip.shape=='rect'" :d="customClip.points | rectPath" fill="none" stroke="transparent" />
      </g>
    </svg>
  </div>
</template>

<script>
import tool from '../../../module/tool'
export default {
  props: {
    customClip: Object,
    zoom: Number,
    process: Array,
  },
  filters: {
    rectPath(points) {
      if (points.length < 2) {
        return ''
      } else {
        return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`
      }
    },
    pathShape(points) {
      if (!points.length) { return '' }
      let d = ''
      points.forEach((item) => {
        switch (item.type) {
          case 'L': case 'M':
            d += ` ${item.type}${item.x},${item.y}`
            break;
          case 'C':
            d += ` C${item.params.x1},${item.params.y1},${item.params.x2},${item.params.y2},${item.x},${item.y}`
            break;
          case 'Q':
            d += ` Q${item.params.x1},${item.params.y1},${item.x},${item.y}`
            break;
        }
      });
      return d
    },
    rectFilter(item1, item2) {
      return `M${item1.x},${item1.y} L${item2.x},${item1.y} L${item2.x},${item2.y} L${item1.x},${item2.y} Z`
    },
    pathType(points, index) {
      if (!index) { return '' }
      let current = points[index]
      let pre = points[index - 1]
      switch (current.type) {
        case 'L':
          return `M${pre.x},${pre.y} L${current.x},${current.y}`
        case 'C':
          return `M${pre.x},${pre.y} C${current.params.x1},${current.params.y1},${current.params.x2},${current.params.y2},${current.x},${current.y}`
        case 'Q':
          return `M${pre.x},${pre.y} Q${current.params.x1},${current.params.y1},${current.x},${current.y}`
      }
    },
    pathPart(points, index) {
      let ele = points[index]
      let pre
      if (index > 0) { pre = points[index - 1] } else { return '' }
      switch (ele.type) {
        case 'L':
          return `M${pre.x},${pre.y} L${ele.x},${ele.y}`
        case 'C':
          return `M${pre.x},${pre.y} ${ele.type}${ele.params.x1},${ele.params.y1},${ele.params.x2},${ele.params.y2},${ele.x},${ele.y}`
        case 'Q':
          return `M${pre.x},${pre.y} ${ele.type}${ele.params.x1},${ele.params.y1},${ele.x},${ele.y}`
      }
    },
    lineFilter(item, pre, type) {
      switch (type) {
        case 'x1y1':
          return `M${item.x},${item.y} L${item.params.x1},${item.params.y1}`
        case 'x2y2':
          return `M${pre.x},${pre.y} L${item.params.x2},${item.params.y2}`
        case 'x1y1x2y2':
          return `M${item.x},${item.y} L${item.params.x1},${item.params.y1} L${pre.x},${pre.y}`
        default:
          break;
      }
    }
  },
  data() {
    return {
      position: { x: 0, y: 0 },
      shiftKey: false,
    }
  },
  created() {
    this.shiftKey = false
    window.addEventListener('mouseup', this.cancelDraw)
    document.addEventListener('keydown', this.shiftChange)
    document.addEventListener('keyup', this.shiftChange)
  },
  destroyed() {
    window.removeEventListener('mouseup', this.cancelDraw)
    document.removeEventListener('keydown', this.shiftChange)
    document.removeEventListener('keyup', this.shiftChange)
  },
  watch: {

  },
  methods: {
    selectLine(index) {
      if (this.customClip.status.onDraw) { return }
      if (index) {
        this.customClip.preLine = this.customClip.points[index - 1]
      }
      if (!this.customClip.currentLine) { this.process.push('Point') }
      this.customClip.currentLineIndex = index
      this.customClip.currentLine = this.customClip.points[index]
    },
    shiftChange(e) {
      if (this.shiftKey != e.shiftKey) { this.shiftKey = e.shiftKey }
    },
    cancelDraw(e) {
      let param = e.path.find(ele => ele.id == 'workspace-param')
      let view = e.path.find(ele => ele.id == 'customClipView')
      if (!(param || view)) {
        this.$emit('paramChange', ['customClip', 'currentLine'], null)
        this.$emit('paramChange', ['customClip', 'status', 'onDraw'], false)
        this.$emit('addClipItem')
        this.$emit('paramChange', ['customClip', 'status', 'show'], false)
      }
    },
    drawShape(e) {
      if (this.customClip.status.onDraw) {
        this.customClip.points.push({
          type: 'L',
          x: this.position.x,
          y: this.position.y,
          params: tool.getDefault(this.customClip.points.slice(-1)[0], { x: this.position.x, y: this.position.y, })
        })
      }
    },
    listenMouse(e) {
      if (this.customClip.status.onDraw) {
        if (this.shiftKey) {
          let point = this.customClip.points[this.customClip.points.length - 1]
          if (Math.abs(e.offsetY / this.zoom - point.y) > Math.abs(e.offsetX / this.zoom - point.x)) {
            this.position.x = point.x
            this.position.y = e.offsetY / this.zoom
          } else {
            this.position.x = e.offsetX / this.zoom
            this.position.y = point.y
          }
        } else {
          this.position.x = e.offsetX / this.zoom
          this.position.y = e.offsetY / this.zoom
        }
      }
    },
    movePoint(e, point, key) {
      document.onmousemove = (e) => {
        point[key.x] += e.movementX / this.zoom;
        point[key.y] += e.movementY / this.zoom;
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    lineListen(e) {
      if (this.customClip.currentLine) {
        this.$emit('paramChange', ['customClip', 'currentLine'], null)
        this.process.pop()
      } else if (this.customClip.status.onDraw) {
        this.$emit('paramChange', ['customClip', 'status', 'onDraw'], false)
        this.process.pop()
      } else if (this.customClip.status.show) {
        this.$emit('addClipItem')
        this.$emit('paramChange', ['customClip', 'status', 'show'], false)
      }
      return false
    },
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    }
  }
}
</script>

<style lang="less">
#customClipView {
  position: absolute;
  z-index: 999;
  user-select: none;
  cursor: crosshair;
  .svg-point {
    cursor: move;
  }
  .svg-line {
    cursor: pointer;
  }
}
</style>