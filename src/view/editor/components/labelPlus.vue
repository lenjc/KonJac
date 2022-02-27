<template>
  <a-modal id="labelplusModal" okText="确定" cancelText="取消" @ok="confirmLabelPlus" :visible="visible" title="导入LabelPlus"
    :width="800" @cancel="visible=false">
    <div id="labelplus">
      <div>
        <div>
          <div>
            起始位置: <a-input-number v-model="start" step="1"></a-input-number>
          </div>
        </div>
        <div id="thumbnail-images" class="scrollbar3">
          <ul v-for="(item,index) in data" :key="'labelplusText-'+index" class="labelplusText">
            <!-- <li> -->
            <div class="labelplusTextPage">
              <div
                style="width:35px;height:35px;color:#ccc;border-radius:3px;font-size:18px; line-height:35px;font-weight:900;background-color:#444;text-align:center">
                {{index+1}}
              </div>
              <div>
                <svg t="1644506655307" style="font-size:26px;" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2044" width="200" height="200">
                  <path
                    d="M729.6 448H128v85.333333h601.6L597.333333 665.6l59.733334 59.733333 234.666666-234.666666L661.333333 256l-59.733333 59.733333 128 132.266667z"
                    fill="#444444" p-id="2045"></path>
                </svg>
                <a-input-number v-model="item.index" :formatter="formatter" :parser="inputParser" />
              </div>
            </div>
            <ul>
              <li v-for="(text,indext) in item.item" :key="'textItem-'+indext" class="labelplusTextItem">
                {{indext+1}} : {{text.text}}
              </li>
            </ul>
            <!-- </li> -->
            <!-- <div
              style="background-color: #444; width:80px;height:100%;line-height:100px;font-size:46px;text-align:center;font-weight:900">
              {{index+1}}
            </div>
            <div>
              页面位置: <a-input-number v-model="item.index" :formatter="formatter" :parser="inputParser">
              </a-input-number>
              <div v-for="(text,indext) in item.item" :key="'textItem-'+indext">
                {{indext+1}} : {{text.text}}
              </div>
            </div> -->

          </ul>
        </div>
      </div>
      <div>
        <div>
          <div>
            <div class="labelPlusTitle" style="margin-bottom:5px"> 应用样式: {{selectedStyle?selectedStyle.title:''}} </div>
          </div>
          <div id="presetstyleContainerLabel" class="scrollbar3">
            <div class="presetstyleitem" v-for="(item,index) in presetStyles" data-type='presetstyle'
              :data-index="item.id" :class="{'presetstyleitemSelected':selectedStyle && selectedStyle.id==item.id}"
              @click="changePresetStyle(item)" :key="'style-'+index">
              {{item.title}}
            </div>            
          </div>
        </div>
        <div class="labelPlusTitle">
          样式 :
        </div>
        <div id='LabelStyleOptions'>
          <div>
            <paramsInputNum title="尺寸" :value="presetStyle.style['font-size']*1"
              :args="['presetStyle','style','font-size']" step="1" min="12" @paramChange="paramChange" />
            <paramsColor title="颜色" :colors="presetStyle.style.color" :args="['presetStyle','style','color']"
              @paramChange="paramChange" />
            <paramsSelect title="字体" :selected="presetStyle.style['font-family']"
              :args="['presetStyle','style','font-family']" :full="true" :options="options['font-family']"
              @paramChange="paramChange" />
            <paramsSelect title="书写方向" :selected="presetStyle.style['writing-mode']"
              :args="['presetStyle','style','writing-mode']" :full="true" :options="options['writing-mode']"
              @paramChange="paramChange" />
            <paramsSelect title="对齐" :selected="presetStyle.style['text-align']"
              :args="['presetStyle','style','text-align']" :options="options['text-align']"
              @paramChange="paramChange" />
            <paramsSelect title="字重" :selected="presetStyle.style['font-weight']"
              :args="['presetStyle','style','font-weight']" :options="options['font-weight']"
              @paramChange="paramChange" />
            <paramsSelect title="斜体" :selected="presetStyle.style['font-style']"
              :args="['presetStyle','style','font-style']" :options="options['font-style']"
              @paramChange="paramChange" />
            <paramsSelect title="自动换行" :selected="presetStyle.style['white-space']"
              :args="['presetStyle','style','white-space']" :options="options['white-space']"
              @paramChange="paramChange" />

          </div>
          <div>
            <paramsSelect title="换行断点" :selected="presetStyle.style['word-break']"
              :args="['presetStyle','style','word-break']" :options="options['word-break']"
              @paramChange="paramChange" />
            <paramsInputAuto title="字间距" :value="presetStyle.style['letter-spacing']"
              :args="['presetStyle','style','letter-spacing']" @paramChange="paramChange"
              :options="['normal','10px']" />
            <paramsInputAuto title="行距" :value="presetStyle.style['line-height']"
              :args="['presetStyle','style','line-height']" @paramChange="paramChange" :options="['1.5' ,'2']" />
            <paramsColor title="背景颜色" :colors="presetStyle.container['background-color']"
              :args="['presetStyle','container','background-color']" @paramChange="paramChange" />
            <paramsInputNum title="描边宽度" :value="presetStyle.background['-webkit-text-stroke-width']"
              :args="['presetStyle','background','-webkit-text-stroke-width']" step="1" min="0"
              @paramChange="paramChange" />
            <paramsColor title="描边颜色" :colors="presetStyle.background['-webkit-text-stroke-color']"
              :args="['presetStyle','background','-webkit-text-stroke-color']" @paramChange="paramChange" />

            <paramsInputAuto title="阴影" :full="true" :value="presetStyle.background['text-shadow']"
              :args="['presetStyle','background','text-shadow']" @paramChange="paramChange"
              :options="['none','-10px -10px 0px #000000']" />

          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import paramsInputNum from './paramsInputNum.vue'
import paramsColor from './paramsColor.vue'
import paramsSelect from './paramsSelect.vue'
import paramsInputAuto from './paramsInputAuto.vue'
import chromeApi from '../../../module/chrome'

const options = {
  'tabs': [
    { value: 'text', label: '文本' },
    { value: 'container', label: '容器' },
  ],
  'target': [
    { value: '0', label: '当前对象' },
    { value: '1', label: '全部选中对象' },
    { value: '2', label: '全部文档' },
  ],
  'font-family': [
    { value: "Microsoft YaHei, 微软雅黑, sans-serif", label: "微软雅黑" },
    { value: "NSimSun, serif", label: "新宋体" },
    { value: "STHeiti Light, sans-serif", label: "华文细黑" },
    { value: "YouYuan, sans-serif", label: "幼圆" },
    { value: "KaiTi, serif", label: "楷体" },
    { value: "SimHei, serif", label: "黑体" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Book Antiqua, serif", label: "Book Antiqua" },
    { value: "Century Gothic, sans-serif", label: "Century Gothic" },
    { value: "Courier New, serif", label: "Courier New" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Impact, fantasy", label: "Impact" },
    { value: "PmingLiu, sans-serif", label: "PmingLiu" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Tahoma, sans-serif", label: "Tahoma" }
  ],
  'writing-mode': [
    { value: "horizontal-tb", label: '水平,自上而下' },
    { value: "vertical-rl", label: '垂直,自右而左' },
    { value: "vertical-lr", label: '垂直,自左而右' }
  ],
  'text-align': [
    { value: "left", label: '靠左' },
    { value: "center", label: '居中' },
    { value: "right", label: '靠右' },
  ],
  'font-weight': [
    { value: "400", label: '普通' },
    { value: "100", label: '更细' },
    { value: "700", label: '加粗' },
    { value: "900", label: '更粗' },
  ],
  'white-space': [
    { value: "normal", label: '是' },
    { value: "nowrap", label: '否' },
  ],
  'word-break': [
    { value: "normal", label: '默认' },
    { value: "break-all", label: '任意' },
    { value: "keep-all", label: '半角空格或连字符处' },
  ],
  'overflow': [
    { value: "visible", label: '显示' },
    { value: "hidden", label: '隐藏' },
  ],

  'font-style': [
    { value: "normal", label: '否' },
    { value: "Italic", label: '是' },
  ],
  'font-stretch': [
    { value: "ultra-condensed", label: '50%' },
    { value: "extra-condensed", label: '62.5%' },
    { value: "condensed", label: '75%' },
    { value: "semi-condensed", label: '87.5%' },
    { value: "normal", label: '100%' },
    { value: "semi-expanded", label: '112.5%' },
    { value: "expanded", label: '125%' },
    { value: "extra-expanded", label: '150%' },
    { value: "ultra-expanded", label: '200%' },
  ],
  'line-height-unit': [
    { value: '', label: '倍数' },
    { value: 'px', label: '像素' }
  ],
  'transformStyle': [
    { value: 'rotate', label: '2D' },
    { value: 'rotate3d', label: '3D' }
  ],
  'padding-options': [
    { value: "padding", label: '全部' },
    { value: "padding-top", label: '上' },
    { value: "padding-bottom", label: '下' },
    { value: "padding-left", label: '左' },
    { value: "padding-right", label: '右' },
  ],
  'border-options': [
    { value: "border", label: '全部' },
    { value: "border-top", label: '上边框' },
    { value: "border-bottom", label: '下边框' },
    { value: "border-left", label: '左边框' },
    { value: "border-right", label: '右边框' },
  ],
  'border-type-options': [
    { value: "solid", label: '实线' },
    { value: "dotted", label: '点状线' },
    { value: "dashed", label: '虚线' },
    { value: "double", label: '双实线' },
  ],
  'border-radius-options': [
    { value: "border-radius", label: '全部' },
    { value: "border-top-left-radius", label: '左上角' },
    { value: "border-bottom-left-radius", label: '左下角' },
    { value: "border-top-right-radius", label: '右上角' },
    { value: "border-bottom-right-radius", label: '右下角' },
  ],
  'border-radius-unit': [
    { value: '%', label: '百分比' },
    { value: 'px', label: '像素' }
  ],
  'background-size-options': ['auto', 'cover', 'contain'],
  'background-position-options': ['0% 0%', 'top left', 'top center', 'top right', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right',],
  'background-repeat-options': [
    { value: 'repeat', label: '重复' },
    { value: 'repeat-x	', label: '水平重复' },
    { value: 'repeat-y	', label: '垂直重复' },
    { value: 'no-repeat', label: '不重复' },
  ],

}

export default {
  components: {
    paramsInputNum,
    paramsColor,
    paramsSelect,
    paramsInputAuto,
  },
  props: {
    default_konjac_css: Object,
    imageSource: Array,
    totalSourceLength: Number
  },
  data() {
    this.options = options
    return {
      visible: false,
      data: [],
      start: 0,
      selectedStyle: null,
      presetStyles: [],
      presetStyle: {
        style: {},
        container: {},
        background: {},
      }
    }
  },
  created() {
    this.getPresetStyle()
  },
  methods: {
    confirmLabelPlus() {
      let data = JSON.parse(JSON.stringify(this.data))
      data.forEach(element => { element.index += this.start });
      console.log(data)
      this.$emit('loadLabelPlus', data, this.presetStyle)
      this.visible = false
    },
    paramChange(args = [], value) {
      let that = this
      for (let index = 0; index < args.length - 1; index++) { that = that[args[index]]; }
      this.$set(that, args[args.length - 1], value)
    },
    async getPresetStyle() {
      let list = await chromeApi.getlocal('presetStyle')
      this.presetStyles = list ? JSON.parse(list) : [
        {
          id: '0',
          title: '默认',
          style: JSON.parse(JSON.stringify(this.default_konjac_css))
        }
      ]
      this.changePresetStyle(this.presetStyles[0])
    },
    changePresetStyle(style) {
      this.selectedStyle = style
      this.$set(this.presetStyle, 'style', style.style.style)
      this.$set(this.presetStyle, 'container', style.style.container)
      this.$set(this.presetStyle, 'background', style.style.background)
    },
    formatter(value) {
      return value * 1 + this.start + 1
    },
    inputParser(value) {
      return value * 1 - this.start + 1
    },
    showModal(data = []) {
      this.visible = true
      this.data = data
      let len = this.totalSourceLength - data.length
      for (let index = 0; index < len.length; index++) {
        this.data.push({ type: 'filler' })
      }
    }
  }
}
</script>

<style lang="less">
#labelplus {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > div:nth-child(1) {
    width: calc(40% - 10px);
  }
  > div:nth-child(2) {
    width: calc(60% - 10px);
  }

  .labelPlusTitle {
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    user-select: none;
    // color: #ccc;
  }
}
.labelplusText {
  position: relative;
  padding:10px 5px;
  border-bottom: 1px  dashed  #444;
  margin: 0;
  .labelplusTextPage {
    display: flex;
    flex-direction: row;
    align-items: center;
    > div:nth-child(2) {
      display: flex;
      align-items: center;
    }
  }
}

#thumbnail-images {
  user-select: none;
  width: 100%;
  max-height: 50vh;
  padding-right: 10px;
  overflow: auto;
}
#presetStyleLabel {
  width: 100%;
}
#presetstyleContainerLabel {
  width: 100%;
  max-height: 75px;
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .presetstyleitem {
    width: 30%;
    margin-right: calc(10% / 3);
    height: 35px;
    color: #ccc;
    line-height: 35px;
    background-color: #444;
    padding: 0px 5px;
    margin-bottom: 5px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    // border: 1px solid #000;
    overflow: hidden;
    vertical-align: middle;
  }
  .presetstyleitemSelected {
    color: #fff;
    background-color: #4f80ff;
  }
}

#LabelStyleOptions {
  padding-bottom: 10px;
  > div {
    float: left;
    width: calc(50% - 10px);
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.labelplusText > li:first-child:before {
  border-style: none none solid none;
}

.labelplusText li:before {
  position: absolute;
  content: "";
  top: 0px;
  left: -17px;
  width: 17px;
  height: 0.75em;
  border-style: none none solid none;
  border-width: 1px;
  border-color: #aaa;
}

.labelplusText li:not(:last-child)::after {
  position: absolute;
  content: "";
  top: 0;
  left: -17px;
  height: 100%;
  bottom: 0;
  border-style: none none none solid;
  border-width: 1px;
  border-color: #aaa;
}

.labelplusText li:last-child::after {
  position: absolute;
  content: "";
  top: 0;
  left: -17px;
  height: 0.7em;
  bottom: 0;
  border-style: none none none solid;
  border-width: 1px;
  border-color: #aaa;
}

ul.labelplusText ul {
  margin: 0;
  padding: 0 0 0 35px;
}

ul.labelplusText li {
  list-style: none;
  position: relative;
}
.labelplusTextItem{
  padding-left:5px ;
}
.labelplusClass {
  background-color: #444;
}
</style>