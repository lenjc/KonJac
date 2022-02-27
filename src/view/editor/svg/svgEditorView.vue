<template>
  <div id='svgEditorView' :style="svgData.style" data-type="svgEditorView" @contextmenu="lineListen">
    <svg id="svgEditor" xmlns="http://www.w3.org/2000/svg"
      :style="{width:svgData.style.width,height:svgData.style.height,cursor:(svgData.shape)?'crosshair':'auto'}"
      @click="clickWatch" @mousedown="mousedownWatch">
      <g id="svgEditor-body" v-html="svgData.body" :transform="`translate(${svgData.offset.x},${svgData.offset.y})`">
      </g>
    </svg>
    <svg id="drawPanel" xmlns="http://www.w3.org/2000/svg"
      :style="{width:svgData.style.width,height:svgData.style.height,position:'absolute',left:0,top:0,cursor:(svgData.shape)?'crosshair':'auto'}"
      v-if="drawPanel.show">
      <g id='drawPanel-body' :transform="`translate(${svgData.offset.x},${svgData.offset.y})`">
        <path v-if="drawPanel.shape=='rect'" :d="drawPanel | drawShape('rect')"
          :style="svgData.defaultStyle | styleFormat" />
        <path v-if="drawPanel.shape=='ellipse'" :d="drawPanel | drawShape('rect')" fill='none' stroke='#4f80ff'
          stroke-width='1' />

        <ellipse v-if="drawPanel.shape=='ellipse'" :cx="drawPanel | drawShape('cx')" :cy="drawPanel | drawShape('cy')"
          :rx="drawPanel | drawShape('rx')" :ry="drawPanel | drawShape('ry')"
          :style="svgData.defaultStyle | styleFormat" />

        <path v-if="drawPanel.shape=='path'" :d="drawPanel | drawShape('path')"
          :style="svgData.defaultStyle | styleFormat">
        </path>
        <path v-if="drawPanel.shape=='path'" :d="drawPanel | drawShape('path')" stroke-dasharray="4 4" fill='none'
          stroke='#4f80ff' stroke-width='2'>
          <animate attributeType="CSS" attributeName="stroke-dashoffset" from="4" to="-4" dur="1s"
            repeatCount="indefinite" />
        </path>
        <rect v-if="drawPanel.shape=='path'" v-for="(item,index) in drawPanel.points" :key="'drawpath-'+index"
          :x="item.x-3" :y="item.y-3" width='6' height='6' fill="#4f80ff" />
      </g>
    </svg>
    <svg id="svgEditor-panel" xmlns="http://www.w3.org/2000/svg"
      :style="{width:svgData.style.width,height:svgData.style.height,cursor:(svgData.addNewPoint)?'crosshair':'auto'}"
      v-if="svgData.currentNode" @click.stop="listenPanel">
      <g :transform="`${svgData.status.move?`translate(${svgData.move.x},${svgData.move.y})`:''}`">
        <g id="svgTarget" :transform="svgData | transformFilter">
          <rect v-if="svgData.currentNode.type=='rect'" :x="svgData.currentNode.params.x"
            :y="svgData.currentNode.params.y" :width="svgData.currentNode.params.width"
            :rx="svgData.currentNode.params.rx" :ry="svgData.currentNode.params.ry"
            :height="svgData.currentNode.params.height" :style="svgData.currentNode.style | styleFormat"
            @mousedown.stop="moveDom" />

          <ellipse v-if="svgData.currentNode.type=='ellipse'" :style="svgData.currentNode.style | styleFormat"
            :cx="svgData.currentNode.params.cx" :cy="svgData.currentNode.params.cy" :rx="svgData.currentNode.params.rx"
            :ry="svgData.currentNode.params.ry" @mousedown.stop="moveDom" />

          <circle v-if="svgData.currentNode.type=='circle'" :cx="svgData.currentNode.params.cx"
            :cy="svgData.currentNode.params.cy" :r="svgData.currentNode.params.r"
            :style="svgData.currentNode.style | styleFormat" @mousedown.stop="moveDom" />

          <path v-if="svgData.currentNode.type=='line'" :d="svgData.currentNode | pathShape('line')"
            :style="svgData.currentNode.style | styleFormat" @dblclick="reeditPath"
            :fill-rule="svgData.currentNode.params['fill-rule']" @mousedown.stop="moveDom" />

          <path v-if="svgData.currentNode.type=='polyline'" :d="svgData.currentNode | pathShape('path')"
            :style="svgData.currentNode.style | styleFormat" @dblclick="reeditPath"
            :fill-rule="svgData.currentNode.params['fill-rule']" @mousedown.stop="moveDom" />

          <path v-if="svgData.currentNode.type=='polygon'" :d="svgData.currentNode | pathShape('path')"
            :style="svgData.currentNode.style | styleFormat" @dblclick="reeditPath"
            :fill-rule="svgData.currentNode.params['fill-rule']" @mousedown.stop="moveDom" />

          <path v-if="svgData.currentNode.type=='path'" :d="svgData.currentNode | pathShape('path')"
            :style="svgData.currentNode.style | styleFormat" @dblclick="reeditPath"
            :fill-rule="svgData.currentNode.params['fill-rule']" @mousedown.stop="moveDom" />
        </g>
        <g v-if="!svgData.status.edit">
          <g :transform="svgData | transformFilter" display="inline" v-if="box">
            <path :d="box | boxPath(svgData.currentNode,'box')" stroke='#4f80ff' stroke-width='1' fill='none' />
            <rect v-for="(item,index) in ['sw','ne','nw','se','s','n','w','e']" :key="'resize-'+index"
              :x="box | boxPath(svgData.currentNode,item,'x')" :y="box | boxPath(svgData.currentNode,item,'y')"
              width="6" height="6" fill="#4f80ff" :style="`cursor:${item}-resize;`"
              @mousedown.stop="resizeDom($event,item)" />
          </g>
        </g>
        <g v-if="svgData.status.edit" :transform="svgData | transformFilter" id="svgLine">
          <path v-for="(point,index) in svgData.currentNode.points" :key="'pathPoint-'+index"
            :d="svgData.currentNode.points | pathPart(index)" :stroke="svgData.currentLine==point?'#0ff':'#4f80ff'"
            stroke-width='2' style="cursor: pointer;" @click.stop="selectPoint(index)" fill='none' />

          <g v-if="svgData.currentLine && svgData.currentLine.type=='C'">
            <path
              :d="`M${svgData.preLine.x},${svgData.preLine.y} L${svgData.currentLine.params.x1},${svgData.currentLine.params.y1}`"
              stroke="#4f80ff" stroke-width='1' />
            <path
              :d="`M${svgData.currentLine.x},${svgData.currentLine.y} L${svgData.currentLine.params.x2},${svgData.currentLine.params.y2}`"
              stroke="#4f80ff" stroke-width='1' />
            <circle :cx="svgData.currentLine.params.x1" :cy="svgData.currentLine.params.y1" r='4' fill='#4f80ff'
              style="cursor: move;" @mousedown.stop="movePoint($event,svgData.currentLine.params,{x:'x1',y:'y1'})" />
            <circle :cx="svgData.currentLine.params.x2" :cy="svgData.currentLine.params.y2" r='4' fill='#4f80ff'
              style="cursor: move;" @mousedown.stop="movePoint($event,svgData.currentLine.params,{x:'x2',y:'y2'})" />
          </g>

          <g v-if="svgData.currentLine && svgData.currentLine.type=='Q'">
            <path
              :d="`M${svgData.currentLine.params.x1},${svgData.currentLine.params.y1} L${svgData.preLine.x},${svgData.preLine.y} M${svgData.currentLine.params.x1},${svgData.currentLine.params.y1} L${svgData.currentLine.x},${svgData.currentLine.y}`"
              stroke="#4f80ff" stroke-width='1' fill='none' />
            <circle :cx="svgData.currentLine.params.x1" :cy="svgData.currentLine.params.y1" r='4' fill='#4f80ff'
              style="cursor: move;" @mousedown.stop="movePoint($event,svgData.currentLine.params,{x:'x1',y:'y1'})" />
          </g>

          <rect v-for="(point,index) in svgData.currentNode.points" :key="'pathRect-'+index" :x="point.x-3"
            :y="point.y-3" width='6' height='6' :fill="svgData.currentLine==point?'#4f80ff':'#fff'"
            style="cursor: move;" stroke='#4f80ff' stroke-width='2' @click.stop="selectPoint(index)"
            @mousedown.stop="movePoint($event,point,{x:'x',y:'y'})" />

        </g>
      </g>
    </svg>
  </div>
</template>

<script>

const defaultStyle = {
  polyline: {
    params: { 'fill-rule': 'nonzero', },
    style: {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  line: {
    params: {},
    style: {
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  polygon: {
    params: { 'fill-rule': 'nonzero', },
    style: {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  circle: {
    params: {},
    style: {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  ellipse: {
    params: {},
    'style': {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  rect: {
    params: { rx: 0, ry: 0 },
    'style': {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
  path: {
    params: {
      'fill-rule': 'nonzero',
    },
    'style': {
      'fill': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
      'stroke': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
      'stroke-width': '0',
      'stroke-opacity': '1',
      'stroke-dasharray': 'none',
    },
    'rotate': 0,
    'resize': {
      on: false,
      type: '',
      sp: { x: 0, y: 0 },
      count: { x: 0, y: 0 }
    }
  },
}

import tool from '../../../module/tool'


export default {
  props: {
    svgData: Object,
    zoom: Number,
    process: Array
  },
  filters: {
    styleFormat(item) {
      let style = {}
      for (const key in item) {
        switch (key) {
          case 'fill': case 'stroke':
            if (item[key].rgba) {
              style[key] = tool.colors2rgba(item[key])
            } else {
              style[key] = item[key]
            }
            break;
          default:
            style[key] = item[key]
            break;
        }
      }
      return style
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
        case 'A':
          return `M${pre.x},${pre.y} ${ele.type}${ele.params.rx},${ele.params.ry},${ele.params.angle},${ele.params.arc},${ele.params.sweep},${ele.x},${ele.y}`
      }
    },
    drawShape(drawPanel, type) {
      switch (type) {
        case 'rect':
          return `M${drawPanel.start.x},${drawPanel.start.y} L${drawPanel.end.x},${drawPanel.start.y},${drawPanel.end.x},${drawPanel.end.y},${drawPanel.start.x},${drawPanel.end.y} Z`
        case 'path':
          let d = `M${drawPanel.points[0].x},${drawPanel.points[0].y}`
          drawPanel.points.forEach((ele, index) => {
            if (index) { d += `L${ele.x},${ele.y}` }
          })
          return d
        case 'cx':
          return drawPanel.start.x + (drawPanel.end.x - drawPanel.start.x) / 2
        case 'cy':
          return drawPanel.start.y + (drawPanel.end.y - drawPanel.start.y) / 2
        case 'rx':
          return (drawPanel.end.x - drawPanel.start.x) / 2
        case 'ry':
          return (drawPanel.end.y - drawPanel.start.y) / 2

      }
    },
    pathShape(node, type) {
      let d = ''
      let absX = node.resize.type.includes('w') ? -1 : 1
      let absY = node.resize.type.includes('n') ? -1 : 1
      node.points.forEach((ele, index) => {
        let scaleX = 0, scaleY = 0
        if (node.resize.on && ele.x - node.resize.sp.x != 0) { scaleX = node.resize.count.x * absX / node.box.width * (ele.x - node.resize.sp.x) }
        if (node.resize.on && ele.y - node.resize.sp.y != 0) { scaleY = node.resize.count.y * absY / node.box.height * (ele.y - node.resize.sp.y) }
        let scaleX1 = 0, scaleY1 = 0, scaleX2 = 0, scaleY2 = 0
        switch (ele.type) {
          case 'M': case 'L':
            d += `${ele.type}${ele.x + scaleX},${ele.y + scaleY}`
            break;
          case 'C':
            if (node.resize.on && ele.params.x1 - node.resize.sp.x != 0) { scaleX1 = node.resize.count.x * absX / node.box.width * (ele.params.x1 - node.resize.sp.x) }
            if (node.resize.on && ele.params.y1 - node.resize.sp.y != 0) { scaleY1 = node.resize.count.y * absY / node.box.height * (ele.params.y1 - node.resize.sp.y) }
            if (node.resize.on && ele.params.x2 - node.resize.sp.x != 0) { scaleX2 = node.resize.count.x * absX / node.box.width * (ele.params.x2 - node.resize.sp.x) }
            if (node.resize.on && ele.params.y2 - node.resize.sp.y != 0) { scaleY2 = node.resize.count.y * absY / node.box.height * (ele.params.y2 - node.resize.sp.y) }
            d += `${ele.type}${ele.params.x1 + scaleX1},${ele.params.y1 + scaleY1},${ele.params.x2 + scaleX2},${ele.params.y2 + scaleY2},${ele.x + scaleX},${ele.y + scaleY}`
            break
          case 'Q':
            if (node.resize.on && ele.params.x1 - node.resize.sp.x != 0) { scaleX1 = node.resize.count.x * absX / node.box.width * (ele.params.x1 - node.resize.sp.x) }
            if (node.resize.on && ele.params.y1 - node.resize.sp.y != 0) { scaleY1 = node.resize.count.y * absY / node.box.height * (ele.params.y1 - node.resize.sp.y) }
            d += `${ele.type}${ele.params.x1 + scaleX1},${ele.params.y1 + scaleY1},${ele.x + scaleX},${ele.y + scaleY}`
            break
          case 'A':
            let scaleRX = 0, scaleRY = 0
            if (node.resize.on) { scaleRX = node.resize.count.x * absX / node.box.width * ele.params.rx }
            if (node.resize.on) { scaleRY = node.resize.count.y * absY / node.box.height * ele.params.ry }
            d += `${ele.type}${ele.params.rx + scaleRX},${ele.params.ry + scaleRY},${ele.params.angle},${ele.params.arc},${ele.params.sweep},${ele.x + scaleX},${ele.y + scaleY}`
            break
          default:
            break;
        }
      })
      if (node.closePath == '1') {
        d += 'Z'
      }
      return d
    },
    transformFilter(svgData) {
      let str = `translate(${svgData.offset.x},${svgData.offset.y})`
      let x = 0, y = 0
      x = svgData.currentNode.points[0].x
      y = svgData.currentNode.points[0].y
      if (svgData.currentNode.rotate) {
        str += ` rotate(${svgData.currentNode.rotate} ${x},${y})`
      }
      return str
    },
    styleFilter(style) {
      let css = JSON.parse(JSON.stringify(style))
      for (const key in style) {
        switch (key) {
          case 'fill':
            css[key] = tool.colors2rgba(style[key])
            break;
        }
      }
      return css
    },
    boxPath(box, node, type, xy) {
      let width = node.style['stroke'] == 'none' ? 3 : 3 + node.style['stroke-width'] / 2
      switch (type) {
        case 'nw': return { x: box.x - width - 3, y: box.y - width - 3 }[xy]
        case 'ne': return { x: box.x + box.width + width - 3, y: box.y - width - 3 }[xy]
        case 'se': return { x: box.x + box.width + width - 3, y: box.y + box.height + width - 3 }[xy]
        case 'sw': return { x: box.x - width - 3, y: box.y + box.height + width - 3 }[xy]
        case 'n': return { x: box.width / 2 + box.x - 3, y: box.y - width - 3 }[xy]
        case 's': return { x: box.width / 2 + box.x - 3, y: box.y + box.height + width - 3 }[xy]
        case 'w': return { x: box.x - width - 3, y: box.height / 2 + box.y - 3 }[xy]
        case 'e': return { x: box.x + box.width + width - 3, y: box.height / 2 + box.y - 3 }[xy]
        default: return `M${box.x - width},${box.y - width} h${box.width + width * 2} v${box.height + width * 2} h-${box.width + width * 2} Z`
      }
    },
  },
  data() {
    this.tool = tool
    return {
      position: { x: 0, y: 0 },
      shiftKey: false,
      svgEditor: { shape: [], },
      currentNode: {
        type: '',
      },
      box: null,
      drawPanel: {
        show: false,
        shape: '',
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        points: []
      },
      editPanel: {
        on: false
      },
    }
  },
  created() {
    this.shiftKey = false
    window.addEventListener('mouseup', this.cancelDraw)
    document.addEventListener('keydown', this.keyDownWatch)
    document.addEventListener('keyup', this.keyUpWatch)
  },
  destroyed() {
    window.removeEventListener('mouseup', this.cancelDraw)
    document.removeEventListener('keydown', this.keyDownWatch)
    document.removeEventListener('keyup', this.keyUpWatch)
  },
  watch: {
    box(val) {
      this.svgData.box = val
    },
  },
  methods: {   
    controlPositionX(data) {
      this.modifyPosition({ x: data * 1 - this.box.x, y: 0 })
    },
    controlPositionY(data) {
      this.modifyPosition({ x: 0, y: data * 1 - this.box.y })
    },
    controlWidth(data) {
      switch (this.svgData.currentNode.type) {
        case 'path': case 'polygon': case 'line': case 'polyline': case 'polyline':
          this.svgData.currentNode.resize.sp.x = this.svgData.box.x
          this.svgData.currentNode.resize.type = 'e'
          this.svgData.currentNode.resize.count.x = data * 1 - this.svgData.box.width
          this.resizePath2()
          break;
        case 'ellipse':
          this.svgData.currentNode.params.rx = data / 2
          break
        case 'circle':
          this.svgData.currentNode.params.r = data / 2
          break
      }
      this.$nextTick(() => {
        this.box = document.getElementById('svgTarget').getBBox()
      })
    },
    controlHeight(data) {
      switch (this.svgData.currentNode.type) {
        case 'path': case 'polygon': case 'line': case 'polyline': case 'polyline':
          this.svgData.currentNode.resize.sp.y = this.svgData.box.y
          this.svgData.currentNode.resize.type = 's'
          this.svgData.currentNode.resize.count.y = data * 1 - this.svgData.box.height
          this.resizePath2()
          break
        case 'ellipse':
          this.svgData.currentNode.params.ry = data / 2
          break
        case 'circle':
          this.svgData.currentNode.params.r = data / 2
          break
      }
      this.$nextTick(() => {
        this.box = document.getElementById('svgTarget').getBBox()
      })
    },
    selectPoint(index) {
      this.svgData.addNewPoint = ''
      this.svgData.currentLine = this.svgData.currentNode.points[index]
      this.svgData.currentLineIndex = index
      if (this.process[this.process.length - 1] != 'Point') { this.process.push('Point') }
      if (index > 0) {
        this.svgData.preLine = this.svgData.currentNode.points[index - 1]
      } else {
        this.svgData.preLine = null
      }
    },
    movePoint($event, item, args) {
      this.svgData.addNewPoint = ''
      document.onmousemove = (e) => {
        let point = document.getElementById('svgEditor-panel').createSVGPoint()
        point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
        let rotatedPointA = point.matrixTransform(document.getElementById('svgLine').getCTM().inverse())
        item[args.x] = rotatedPointA.x
        item[args.y] = rotatedPointA.y
      }
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    createNewPoint(type) {
      let pre
      let aft
      let index = this.svgData.currentLineIndex
      switch (type) {
        case 'pre':
          if (!this.svgData.currentLineIndex) { return }
          pre = this.svgData.currentNode.points[this.svgData.currentLineIndex - 1]
          aft = this.svgData.currentNode.points[this.svgData.currentLineIndex]
          break;
        case 'next':
          index++
          pre = this.svgData.currentNode.points[this.svgData.currentLineIndex]
          if (this.svgData.currentNode.points[this.svgData.currentLineIndex + 1]) {
            aft = this.svgData.currentNode.points[this.svgData.currentLineIndex + 1]
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
      this.svgData.currentNode.points.splice(index, 0, point)
      if (type == 'pre') {
        this.svgData.preLine = point
        this.svgData.currentLineIndex += 1
      }
      this.$forceUpdate()
    },
    deletePoint() {
      if (!this.svgData.currentLineIndex) { return }
      this.svgData.currentNode.points.splice(this.svgData.currentLineIndex, 1)
      this.lineListen()
    },
    addNewPoint(type) {
      if (!this.process.includes('Draw')) { this.process.push('Draw') }
      this.svgData.addNewPoint = type
      this.$forceUpdate()
    },
    listenPanel(e) {
      if (this.svgData.addNewPoint) {
        switch (this.svgData.addNewPoint) {
          case 'L': case 'M':
            let point = document.getElementById('svgEditor-panel').createSVGPoint()
            point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
            let rotatedPoint = point.matrixTransform(document.getElementById('svgLine').getCTM().inverse())
            this.svgData.currentNode.points.push({
              type: this.svgData.addNewPoint,
              x: rotatedPoint.x,
              y: rotatedPoint.y,
              params: {
                x1: rotatedPoint.x - (rotatedPoint.x - this.svgData.currentNode.points[this.svgData.currentNode.points.length - 1].x) / 4 * 3,
                y1: rotatedPoint.y - (rotatedPoint.y - this.svgData.currentNode.points[this.svgData.currentNode.points.length - 1].y) / 4 * 3,
                x2: rotatedPoint.x - (rotatedPoint.x - this.svgData.currentNode.points[this.svgData.currentNode.points.length - 1].x) / 4 * 1,
                y2: rotatedPoint.y - (rotatedPoint.y - this.svgData.currentNode.points[this.svgData.currentNode.points.length - 1].y) / 4 * 1,
              }
            })
            if (this.svgData.addNewPoint == 'M') { this.svgData.addNewPoint = '' }
            break;
          default:
            break;
        }
      }

    },
    modifyPosition(move) {
      this.svgData.currentNode.points.forEach(ele => {
        ele.x += move.x
        ele.y += move.y
        if (ele.params) {
          ele.params.x1 += move.x * 1
          ele.params.y1 += move.y * 1
          ele.params.x2 += move.x * 1
          ele.params.y2 += move.y * 1
        }
      })
      switch (this.svgData.currentNode.type) {
        case 'rect':
          this.svgData.currentNode.params.x += move.x
          this.svgData.currentNode.params.y += move.y
          break;
        case 'line':
          this.svgData.currentNode.params.x1 += move.x
          this.svgData.currentNode.params.y1 += move.y
          this.svgData.currentNode.params.x2 += move.x
          this.svgData.currentNode.params.y2 += move.y
          break
        case 'ellipse': case 'circle':
          this.svgData.currentNode.params.cx += move.x
          this.svgData.currentNode.params.cy += move.y
          break
        default:
          break;
      }
      this.$nextTick(() => {
        this.$emit('paramChange', ['svgData', 'currentNode', 'box'], document.getElementById('svgTarget').getBBox())
        this.box = document.getElementById('svgTarget').getBBox()
      })
    },
    moveDom(e) {
      this.$emit('paramChange', ['svgData', 'status', 'move'], true)
      this.$emit('paramChange', ['svgData', 'move',], { x: 0, y: 0 })
      document.onmousemove = (e) => {
        this.svgData.move.x += e.movementX / this.zoom
        this.svgData.move.y += e.movementY / this.zoom
        this.$nextTick(() => {
          this.box = document.getElementById('svgTarget').getBBox()
        })
      };
      document.onmouseup = (e) => {
        this.modifyPosition(this.svgData.move)
        this.$emit('paramChange', ['svgData', 'status', 'move'], false)
        this.$emit('paramChange', ['svgData', 'move',], { x: 0, y: 0 })
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    resizeDom(event, type) {
      switch (this.svgData.currentNode.type) {
        case 'rect':
          this.resizeRect(event, type)
          break;
        case 'path': case 'polygon': case 'line':
          this.resizePath(event, type)
          break;
        case 'ellipse':
          this.resizeEllipse(event, type)
          break
      }
    },
    drawRect(e) {
      this.process.push('Draw(Rect)')
      this.drawPanel.shape = 'rect'
      this.drawPanel.show = true
      let point = document.getElementById('svgEditor').createSVGPoint()
      point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
      let rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())
      this.drawPanel.start.x = rotatedPoint.x
      this.drawPanel.start.y = rotatedPoint.y
      this.drawPanel.end.x = rotatedPoint.x
      this.drawPanel.end.y = rotatedPoint.y
      document.onmousemove = (e) => {
        point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
        rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())
        this.drawPanel.end.x = rotatedPoint.x
        this.drawPanel.end.y = rotatedPoint.y
      }
      document.onmouseup = (e) => {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        let x = Math.min(this.drawPanel.start.x, this.drawPanel.end.x)
        let y = Math.min(this.drawPanel.start.y, this.drawPanel.end.y)
        let width = Math.abs(this.drawPanel.start.x - this.drawPanel.end.x)
        let height = Math.abs(this.drawPanel.start.y - this.drawPanel.end.y)
        rect.setAttribute('x', x)
        rect.setAttribute('y', y)
        rect.setAttribute('width', width)
        rect.setAttribute('height', height)

        let style = ''
        for (const key in this.svgData.defaultStyle) {
          switch (key) {
            case 'fill': case 'stroke':
              style += `${key}:${tool.colors2rgba(this.svgData.defaultStyle[key])};`
              break;
            default:
              style += `${key}:${this.svgData.defaultStyle[key]}`
              break;
          }
        }
        rect.setAttribute('style', style)

        document.getElementById('svgEditor-body').appendChild(rect)
        this.drawPanel.show = false
        this.svgData.shape = ''
        document.onmousemove = null;
        document.onmouseup = null;
        this.process.pop()
        this.$forceUpdate()
      }
    },

    resizeRect(event, type) {
      let point = document.getElementById('svgEditor-panel').createSVGPoint()
      let matrix = document.getElementById('svgTarget').getCTM().inverse()
      let inverseX = type.includes('w') ? 1 : -1
      let inverseY = type.includes('n') ? 1 : -1
      document.onmousemove = (e) => {
        let x = e.movementX / this.zoom, y = e.movementY / this.zoom
        if (this.svgData.currentNode.rotate) {
          point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
          let rotatedPointA = point.matrixTransform(matrix)
          point.x = (e.offsetX + e.movementX) / this.zoom, point.y = (e.offsetY + e.movementY) / this.zoom
          let rotatedPointB = point.matrixTransform(matrix)
          x = ((rotatedPointA.x - rotatedPointB.x) * inverseX).toFixed(0) * 1
          y = ((rotatedPointA.y - rotatedPointB.y) * inverseY).toFixed(0) * 1
          switch (type) {
            case 'nw':
              this.svgData.currentNode.params.x += - x
              this.svgData.currentNode.params.y += - y
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += y
              break;
            case 'ne':
              this.svgData.currentNode.params.y += -y
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += y
              break
            case 'se':
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += y
              break
            case 'sw':
              this.svgData.currentNode.params.x += -x
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += y
              break
            case 's':
              this.svgData.currentNode.params.height += y
              break;
            case 'n':
              this.svgData.currentNode.params.y += -y
              this.svgData.currentNode.params.height += y
              break
            case 'e':
              this.svgData.currentNode.params.width += x
              break
            case 'w':
              this.svgData.currentNode.params.x += -x
              this.svgData.currentNode.params.width += x
              break
          }
        } else {
          switch (type) {
            case 'nw':
              this.svgData.currentNode.params.x += x
              this.svgData.currentNode.params.y += y
              this.svgData.currentNode.params.width += - x
              this.svgData.currentNode.params.height += -y
              break;
            case 'ne':
              this.svgData.currentNode.params.y += y
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += -y
              break
            case 'se':
              this.svgData.currentNode.params.width += x
              this.svgData.currentNode.params.height += y
              break
            case 'sw':
              this.svgData.currentNode.params.x += x
              this.svgData.currentNode.params.width += -x
              this.svgData.currentNode.params.height += y
              break
            case 's':
              this.svgData.currentNode.params.height += y
              break;
            case 'n':
              this.svgData.currentNode.params.y += y
              this.svgData.currentNode.params.height += -y
              break
            case 'e':
              this.svgData.currentNode.params.width += x
              break
            case 'w':
              this.svgData.currentNode.params.x += x
              this.svgData.currentNode.params.width += -x
              break
          }
        }
        this.$nextTick(() => {
          this.box = document.getElementById('svgTarget').getBBox()
        })
      }
      document.onmouseup = (e) => {
        this.$nextTick(() => {
          this.$emit('paramChange', ['svgData', 'currentNode', 'box'], document.getElementById('svgTarget').getBBox())
          this.box = document.getElementById('svgTarget').getBBox()
        })
        document.onmousemove = null;
        document.onmouseup = null;
      }
    },
    drawPath(e) {
      let svg = e.path.find(ele => ele.id == 'drawPanel')
      if (svg) {
        let point = document.getElementById('drawPanel').createSVGPoint()
        point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
        let rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())
        this.drawPanel.points.push({
          x: rotatedPoint.x,
          y: rotatedPoint.y
        })
      } else {
        this.lineListen()
      }
    },
    cancelDrawPath(e) {
      let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      let d = `M${this.drawPanel.points[0].x},${this.drawPanel.points[0].y}`
      this.drawPanel.points.forEach((ele, index) => {
        if (index) { d += `L${ele.x},${ele.y}` }
      })
      path.setAttribute('d', d)
      let style = ''
      for (const key in this.svgData.defaultStyle) {
        switch (key) {
          case 'fill': case 'stroke':
            style += `${key}:${tool.colors2rgba(this.svgData.defaultStyle[key])};`
            break;
          default:
            style += `${key}:${this.svgData.defaultStyle[key]}`
            break;
        }
      }
      path.setAttribute('style', style)
      document.getElementById('svgEditor-body').appendChild(path)
      this.drawPanel.show = false
      this.drawPanel.points = []
      this.svgData.shape = ''
      document.removeEventListener('mouseup', this.drawPath)
      this.$forceUpdate()
    },
    reeditPath() {
      this.svgData.status.edit = true
      this.process.push('Reedit')
    },
    resizePath(event, type) {
      this.svgData.currentNode.resize.on = true
      this.svgData.currentNode.resize.type = type
      let x, y
      switch (type) {
        case 'nw':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          x = this.svgData.currentNode.box.x
          y = this.svgData.currentNode.box.y
          break;
        case 'ne':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          y = this.svgData.currentNode.box.y
          break
        case 'sw':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y
          x = this.svgData.currentNode.box.x
          y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          break
        case 'se':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y
          x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          break
        case 's':
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y
          y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          break;
        case 'n':
          this.svgData.currentNode.resize.sp.y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
          y = this.svgData.currentNode.box.y
          break;
        case 'w':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          x = this.svgData.currentNode.box.x
          break
        case 'e':
          this.svgData.currentNode.resize.sp.x = this.svgData.currentNode.box.x
          x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
          break
      }
      let point = document.getElementById('svgEditor-panel').createSVGPoint()
      let matrix = document.getElementById('svgTarget').getCTM().inverse()
      document.onmousemove = (e) => {
        point.x = e.offsetX / this.zoom
        point.y = e.offsetY / this.zoom
        let rotatedPoint = point.matrixTransform(matrix)
        rotatedPoint.x = rotatedPoint.x.toFixed(0) * 1
        rotatedPoint.y = rotatedPoint.y.toFixed(0) * 1
        switch (type) {
          case 's': case 'n':
            this.svgData.currentNode.resize.count.y = rotatedPoint.y - y - 3
            break;
          case 'w': case 'e':
            this.svgData.currentNode.resize.count.x = rotatedPoint.x - x - 3
            break;
          default:
            this.svgData.currentNode.resize.count.x = rotatedPoint.x - x - 3
            this.svgData.currentNode.resize.count.y = rotatedPoint.y - y - 3
            break;
        }
        this.$nextTick(() => {
          this.box = document.getElementById('svgTarget').getBBox()
        })
      };
      document.onmouseup = (e) => {
        this.resizePath2()
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    resizePath2() {
      let absX = this.svgData.currentNode.resize.type.includes('w') ? -1 : 1
      let absY = this.svgData.currentNode.resize.type.includes('n') ? -1 : 1
      this.svgData.currentNode.points.forEach((ele, index) => {
        let scaleX = 0, scaleY = 0
        let scaleX1 = 0, scaleY1 = 0, scaleX2 = 0, scaleY2 = 0
        if (ele.x - this.svgData.currentNode.resize.sp.x != 0) {
          scaleX = absX * this.svgData.currentNode.resize.count.x / (this.svgData.currentNode.box.width) * (ele.x - this.svgData.currentNode.resize.sp.x)
        }
        if (ele.y - this.svgData.currentNode.resize.sp.y != 0) {
          scaleY = absY * this.svgData.currentNode.resize.count.y / (this.svgData.currentNode.box.height) * (ele.y - this.svgData.currentNode.resize.sp.y)
        }
        ele.x += scaleX.toFixed(0) * 1
        ele.y += scaleY.toFixed(0) * 1
        switch (ele.type) {
          case 'C':
            if (ele.params.x1 - this.svgData.currentNode.resize.sp.x != 0) { scaleX1 = this.svgData.currentNode.resize.count.x * absX / this.svgData.currentNode.box.width * (ele.params.x1 - this.svgData.currentNode.resize.sp.x) }
            if (ele.params.y1 - this.svgData.currentNode.resize.sp.y != 0) { scaleY1 = this.svgData.currentNode.resize.count.y * absY / this.svgData.currentNode.box.height * (ele.params.y1 - this.svgData.currentNode.resize.sp.y) }
            if (ele.params.x2 - this.svgData.currentNode.resize.sp.x != 0) { scaleX2 = this.svgData.currentNode.resize.count.x * absX / this.svgData.currentNode.box.width * (ele.params.x2 - this.svgData.currentNode.resize.sp.x) }
            if (ele.params.y2 - this.svgData.currentNode.resize.sp.y != 0) { scaleY2 = this.svgData.currentNode.resize.count.y * absY / this.svgData.currentNode.box.height * (ele.params.y2 - this.svgData.currentNode.resize.sp.y) }
            ele.params.x1 += scaleX1.toFixed(0) * 1
            ele.params.y1 += scaleY1.toFixed(0) * 1
            ele.params.x2 += scaleX2.toFixed(0) * 1
            ele.params.y2 += scaleY2.toFixed(0) * 1
            break;
          case 'Q':
            if (ele.params.x1 - this.svgData.currentNode.resize.sp.x != 0) { scaleX1 = this.svgData.currentNode.resize.count.x * absX / this.svgData.currentNode.box.width * (ele.params.x1 - this.svgData.currentNode.resize.sp.x) }
            if (ele.params.y1 - this.svgData.currentNode.resize.sp.y != 0) { scaleY1 = this.svgData.currentNode.resize.count.y * absY / this.svgData.currentNode.box.height * (ele.params.y1 - this.svgData.currentNode.resize.sp.y) }
            ele.params.x1 += scaleX1.toFixed(0) * 1
            ele.params.y1 += scaleY1.toFixed(0) * 1
            break;
          case 'A':
            let scaleRX = this.svgData.currentNode.resize.count.x * absX / this.svgData.currentNode.box.width * ele.params.rx
            let scaleRY = this.svgData.currentNode.resize.count.y * absY / this.svgData.currentNode.box.height * ele.params.ry
            ele.params.rx += scaleRX.toFixed(0) * 1
            ele.params.ry += scaleRY.toFixed(0) * 1
            break
        }
      })
      this.svgData.currentNode.resize.on = false
      this.svgData.currentNode.resize.count.x = 0
      this.svgData.currentNode.resize.count.y = 0
      this.svgData.currentNode.resize.sp = { x: 0, y: 0 }
      this.$nextTick(() => {
        this.$emit('paramChange', ['svgData', 'currentNode', 'box'], document.getElementById('svgTarget').getBBox())
        this.box = document.getElementById('svgTarget').getBBox()
      })
    },
    drawEllipse(e) {
      this.process.push('Draw(Ellipse)')
      this.drawPanel.shape = 'ellipse'
      this.drawPanel.show = true
      let point = document.getElementById('svgEditor').createSVGPoint()
      point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
      let rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())

      this.drawPanel.start.x = rotatedPoint.x
      this.drawPanel.start.y = rotatedPoint.y
      this.drawPanel.end.x = rotatedPoint.x
      this.drawPanel.end.y = rotatedPoint.y
      document.onmousemove = (e) => {
        point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
        rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())
        this.drawPanel.end.x = rotatedPoint.x
        this.drawPanel.end.y = rotatedPoint.y
      }
      document.onmouseup = (e) => {
        let ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')

        let x = Math.min(this.drawPanel.start.x, this.drawPanel.end.x)
        let y = Math.min(this.drawPanel.start.y, this.drawPanel.end.y)
        let width = Math.abs(this.drawPanel.start.x - this.drawPanel.end.x)
        let height = Math.abs(this.drawPanel.start.y - this.drawPanel.end.y)
        ellipse.setAttribute('cx', x + width / 2,)
        ellipse.setAttribute('cy', y + height / 2,)
        ellipse.setAttribute('rx', width / 2,)
        ellipse.setAttribute('ry', height / 2)

        let style = ''
        for (const key in this.svgData.defaultStyle) {
          switch (key) {
            case 'fill': case 'stroke':
              style += `${key}:${tool.colors2rgba(this.svgData.defaultStyle[key])};`
              break;
            default:
              style += `${key}:${this.svgData.defaultStyle[key]}`
              break;
          }
        }
        ellipse.setAttribute('style', style)

        document.getElementById('svgEditor-body').appendChild(ellipse)
        this.drawPanel.show = false
        this.svgData.shape = ''
        document.onmousemove = null;
        document.onmouseup = null;
        this.process.pop()
        this.$forceUpdate()
      }
    },

    resizeEllipse(event, type) {
      let point = document.getElementById('svgEditor-panel').createSVGPoint()
      document.onmousemove = (e) => {
        point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
        let rotatedPoint = point.matrixTransform(document.getElementById('svgTarget').getCTM().inverse())
        let x, y
        switch (type) {
          case 'nw':
            x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
            y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.rx = (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.ry = (y - rotatedPoint.y) / 2
            break;
          case 'ne':
            x = this.svgData.currentNode.box.x
            y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.rx = -(x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.ry = (y - rotatedPoint.y) / 2
            break
          case 'sw':
            x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
            y = this.svgData.currentNode.box.y
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.rx = (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.ry = -(y - rotatedPoint.y) / 2
            break
          case 'se':
            x = this.svgData.currentNode.box.x
            y = this.svgData.currentNode.box.y
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.rx = -(x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.ry = -(y - rotatedPoint.y) / 2
            break
          case 's':
            y = this.svgData.currentNode.box.y
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.ry = -(y - rotatedPoint.y) / 2
            break;
          case 'n':
            y = this.svgData.currentNode.box.y + this.svgData.currentNode.box.height
            this.svgData.currentNode.params.cy = rotatedPoint.y + (y - rotatedPoint.y) / 2
            this.svgData.currentNode.params.ry = (y - rotatedPoint.y) / 2
            break;
          case 'w':
            x = this.svgData.currentNode.box.x + this.svgData.currentNode.box.width
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.rx = (x - rotatedPoint.x) / 2
            break
          case 'e':
            x = this.svgData.currentNode.box.x
            this.svgData.currentNode.params.cx = rotatedPoint.x + (x - rotatedPoint.x) / 2
            this.svgData.currentNode.params.rx = -(x - rotatedPoint.x) / 2
            break
        }
        this.svgData.currentNode.params.cx = this.svgData.currentNode.params.cx.toFixed(0) * 1
        this.svgData.currentNode.params.cy = this.svgData.currentNode.params.cy.toFixed(0) * 1
        this.svgData.currentNode.params.rx = this.svgData.currentNode.params.rx.toFixed(0) * 1
        this.svgData.currentNode.params.ry = this.svgData.currentNode.params.ry.toFixed(0) * 1
        this.$nextTick(() => {
          this.box = document.getElementById('svgTarget').getBBox()
        })
      }
      document.onmouseup = (e) => {
        this.$nextTick(() => {
          this.$emit('paramChange', ['svgData', 'currentNode', 'box'], document.getElementById('svgTarget').getBBox())
          this.box = document.getElementById('svgTarget').getBBox()
        })
        document.onmousemove = null;
        document.onmouseup = null;
      }
    },
    getShape(element) {
      let node = Object.assign({ type: element.nodeName, body: element, }, JSON.parse(JSON.stringify(defaultStyle[element.nodeName])))
      element.setAttribute('display', 'none')
      let urlRegExp = new RegExp(/url\(/)
      for (let index = 0; index < element.attributes.length; index++) {
        let item = element.attributes[index]
        switch (item.nodeName) {
          case 'cx': case 'cy': case 'rx': case 'ry': case 'x': case 'y': case 'width': case 'height': case 'r': case 'x1': case 'y1': case 'x2': case 'y2':
            node.params[item.nodeName] = item.value * 1
            break;
          case 'd':
            node.points = tool.getPointFromPath(item.value)
            node.closePath = item.value.includes('Z') ? '1' : '0'
            node.params[item.nodeName] = item.value
            break;
          case 'points':
            node.points = tool.getPointFromPoints(item.value)
            node.closePath = element.nodeName == 'polygon' ? '1' : '0'
            node.params[item.nodeName] = item.value
            break
          case 'fill-rule':
            node.params[item.nodeName] = item.value
            break
          case 'transform':
            node['rotate'] = item.value.includes('rotate(') ? item.value.match(/rotate\(\d+\.?\d*/)[0].match(/\d+\.?\d*/)[0] * 1 : 0
            break
          case 'stroke-width': case 'stroke-dasharray':
            node.style[item.nodeName] = item.value
            break
          case 'fill': case 'stroke':
            if (urlRegExp.test(item.value)) {
              node.style[item.nodeName] = item.value
            } else {
              node.style[item.nodeName] = tool.format2colors(item.value)
            }
            break
          case 'style':
            let style = tool.css2json(item.value)
            for (const key in style) {
              switch (key) {
                case 'transform':
                  node['rotate'] = style[key].includes('rotate(') ? style[key].match(/rotate\(\d+\.?\d*/)[0].match(/\d+\.?\d*/)[0] * 1 : 0
                  break
                case 'fill': case 'stroke':
                  if (urlRegExp.test(style[key])) {
                    node.style[key] = style[key]
                  } else {
                    node.style[key] = tool.format2colors(style[key])
                  }
                  break
                default:
                  node.style[key] = style[key]
                  break;
              }
            }
            break
        }
      }
      switch (element.nodeName) {
        case 'rect':
          node.points = [{ type: 'M', x: node.params.x, y: node.params.y }]
          break;
        case 'ellipse': case 'circle':
          node.points = [{ type: 'M', x: node.params.cx, y: node.params.cy },]
          break
        case 'line':
          node.points = [{ type: 'M', x: node.params.x1, y: node.params.y1 }, { type: 'L', x: node.params.x2, y: node.params.y2 },]
          break
      }
      this.$emit('paramChange', ['svgData', 'currentNode'], node)
      this.process.push(element.nodeName)
      this.$nextTick(() => {
        this.$emit('paramChange', ['svgData', 'currentNode', 'box'], document.getElementById('svgTarget').getBBox())
        this.box = document.getElementById('svgTarget').getBBox()
      })
    },
    cancelShape() {
      if (this.svgData.currentNode.rotate) {
        this.svgData.currentNode.body.setAttribute('transform', `rotate(${this.svgData.currentNode.rotate} ${this.svgData.currentNode.points[0].x},${this.svgData.currentNode.points[0].y})`)
      } else {
        this.svgData.currentNode.body.removeAttribute('transform')
      }
      for (const key in this.svgData.currentNode.params) {
        switch (key) {
          case 'x': case 'y': case 'cx': case 'cy': case 'rx': case 'ry': case 'r':
            this.svgData.currentNode.body.setAttribute(key, this.svgData.currentNode.params[key])
            break;
          case 'x1': case 'y1': case 'x2': case 'y2':
            let ind = key.split('')
            this.svgData.currentNode.body.setAttribute(key, this.svgData.currentNode.points[ind[1] * 1 - 1][ind[0]])
            break
          case 'd':
            let d = tool.getDfromPoint(this.svgData.currentNode.points)
            if (this.svgData.currentNode.closePath == '1') {
              d += 'Z'
            }
            this.svgData.currentNode.body.setAttribute('d', d)
            break
          case 'points':
            let po = tool.transToPoint(this.svgData.currentNode.points)
            this.svgData.currentNode.body.setAttribute('points', po)
            break
          case 'width': case 'height':
            if (this.svgData.currentNode.params[key] * 1 != 0) {
              this.svgData.currentNode.body.setAttribute(key, this.svgData.currentNode.params[key])
            }
          case 'fill-rule':
            if (this.svgData.currentNode.params[key] == 'evenodd') {
              this.svgData.currentNode.body.setAttribute('fill-rule', this.svgData.currentNode.params[key])
            } else {
              this.svgData.currentNode.body.removeAttribute('fill-rule')
            }
            break;
          default:
            break;
        }
      }
      for (const key in this.svgData.currentNode.style) {
        switch (key) {
          case 'fill': case 'stroke':
            if (this.svgData.currentNode.style[key].rgba) {
              this.svgData.currentNode.body.style[key] = tool.colors2rgba(this.svgData.currentNode.style[key])
            } else {
              this.svgData.currentNode.body.style[key] = this.svgData.currentNode.style[key]
            }
            break
          case 'stroke-dasharray':
            if (this.svgData.currentNode.style[key] == 'none') {
              this.svgData.currentNode.body.style[tool.toCamelCase(key)] = null
            } else {
              this.svgData.currentNode.body.style[tool.toCamelCase(key)] = this.svgData.currentNode.style[key]
            }
            break
          case 'stroke-width': case 'stroke-opacity':
            if (this.svgData.currentNode.style[key] * 1 == 0) {
              ['stroke', 'stroke-dasharray', 'stroke-width', 'stroke-opacity'].forEach(ele => {
                this.svgData.currentNode.body.style[tool.toCamelCase(ele)] = null
              })
            } else {
              this.svgData.currentNode.body.style[tool.toCamelCase(key)] = this.svgData.currentNode.style[key]
            }
            break
          default:
            break;
        }
      }
      this.svgData.currentNode.body.removeAttribute('display')

    },
    mousedownWatch(e) {
      if (this.svgData.shape) {
        switch (this.svgData.shape) {
          case 'rect':
            this.drawRect(e)
            break;
          case 'ellipse':
            this.drawEllipse(e)
            break
          default:
            break;
        }
      }
    },
    clickWatch(e) {
      if (this.svgData.shape) {
        switch (this.svgData.shape) {
          case 'path':
            this.drawPanel.shape = 'path'
            this.drawPanel.show = true
            let point = document.getElementById('svgEditor').createSVGPoint()
            point.x = e.offsetX / this.zoom, point.y = e.offsetY / this.zoom
            let rotatedPoint = point.matrixTransform(document.getElementById('svgEditor-body').getCTM().inverse())
            this.drawPanel.points.push({
              x: rotatedPoint.x,
              y: rotatedPoint.y,
            })
            this.process.push('Draw(Path)')
            document.addEventListener('mouseup', this.drawPath)
            break;
          default:
            break;
        }
      } else {
        switch (e.target.nodeName) {
          case 'rect': case 'path': case 'ellipse': case 'circle': case 'polygon': case 'line': case 'polyline':
            this.getShape(e.target)
          default:
            break;
        }
      }
    },
    keyDownWatch(e) {
      switch (e.keyCode) {
        case 46: case 8:
          if (this.svgData.currentNode) {
            document.getElementById('svgEditor-body').removeChild(this.svgData.currentNode.body)
            this.$emit('paramChange', ['svgData', 'currentNode'], null)
            this.process.pop()
          }
          break;
        case 16:
          if (this.shiftKey != e.shiftKey) { this.shiftKey = e.shiftKey }
          break
      }
    },
    keyUpWatch(e) {
      if (this.shiftKey != e.shiftKey) { this.shiftKey = e.shiftKey }
    },
    cancelDraw(e) {
      let params = e.path.find(ele => ele.dataset && ele.dataset.type == 'params')
      let paramView = e.path.find(ele => ele.id == 'workspace-param')
      let view = e.path.find(ele => ele.id == 'svgEditorView')
      if (!(paramView || view || params)) {
        let res = this.lineListen(e)
        for (let index = 0; index < res; index++) {
          this.lineListen(e)
        }
      }
    },
    lineListen(e) {
      let process = this.process.pop()
      switch (process) {
        case 'Draw':
          this.svgData.addNewPoint = ''
          break;
        case 'Draw(Path)':
          this.cancelDrawPath()
          break
        case 'Point':
          this.$emit('paramChange', ['svgData', 'currentLine'], null)
          this.$emit('paramChange', ['svgData', 'preLine'], null)
          this.$emit('paramChange', ['svgData', 'currentLineIndex'], null)
          break
        case 'Reedit':
          this.svgData.status.edit = false

          break
        case 'rect': case 'path': case 'ellipse': case 'circle': case 'polygon': case 'line': case 'polyline':
          this.cancelShape();
          this.$emit('paramChange', ['svgData', 'currentNode'], null)
          break
        case 'SVG - Editor':
          this.$emit('addSVGItem')
          break
        default:
          break;
      }
      return this.process.length
    },
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    },
  }
}
</script>

<style lang="less">
#svgEditorView {
  position: absolute;
  z-index: 999;
  user-select: none;
  box-sizing: border-box;
  box-shadow: 0 0 0 5px #4f80ff;
  .svg-point {
    cursor: move;
  }
  .svg-line {
    cursor: pointer;
  }
}
#svgEditor-panel {
  position: absolute;
  top: 0;
  left: 0;
}
</style>