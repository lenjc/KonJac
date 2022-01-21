<template>
  <div class="basetool-tab">
    <div class="param-tab-options">
      <div v-for="(item,index) in options.tabs" :key="'paramTab-'+index" @click="currentTab=item.value"
        data-type="params" :class="{'param-tab-option-selected':(currentTab==item.value)}">
        {{item.label}}
      </div>
    </div>
    <div class="param-tab" v-show="currentTab=='text'">
      <div style="text-align:left;padding:10px 10px 0 10px;display: flex;flex-direction:row;align-items:center">
        <div style="color: #fff;width:35%">
          预设样式:
        </div>
        <div style="width:50%;">
          <select style="border:none;width: 100%;" class="param-select" @change="changePresetStyle" v-model="selected">
            <option v-for="(item,index) in presetStyles" :key="'style-'+index" :value="item.id">{{item.title}}</option>
          </select>
        </div>
        <div style="width:15%">
          <div class="more-action">
            <a-icon type="more" style="color:#fff" />
            <ul>
              <li @click="triggetMethod(['updatePresetStyle'],selected)">保存样式</li>
              <li @click="paramChange(['visible','presetStyleTitle'],true)">另存为样式</li>
              <li @click="triggetMethod(['deletePresetStyle'],selected)">删除样式</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="param-container">
        <div>文本</div>
        <div>
          <paramsInputNum title="尺寸" :value="selectedTextStyle.style['font-size']"
            :args="['selectedTextStyle','style','font-size']" step="1" min="12" @paramChange="paramChange" />
          <paramsColor title="颜色" :colors="selectedTextStyle.style.color" :args="['selectedTextStyle','style','color']"
            @paramChange="paramChange" />
          <paramsSelect title="字体" :selected="selectedTextStyle.style['font-family']"
            :args="['selectedTextStyle','style','font-family']" :full="true" :options="options['font-family']"
            @paramChange="paramChange" />
          <paramsSelect title="书写方向" :selected="selectedTextStyle.style['writing-mode']"
            :args="['selectedTextStyle','style','writing-mode']" :full="true" :options="options['writing-mode']"
            @paramChange="paramChange" />
          <paramsSelect title="对齐" :selected="selectedTextStyle.style['text-align']"
            :args="['selectedTextStyle','style','text-align']" :options="options['text-align']"
            @paramChange="paramChange" />
          <paramsSelect title="字重" :selected="selectedTextStyle.style['font-weight']"
            :args="['selectedTextStyle','style','font-weight']" :options="options['font-weight']"
            @paramChange="paramChange" />
          <paramsSelect title="自动换行" :selected="selectedTextStyle.style['white-space']"
            :args="['selectedTextStyle','style','white-space']" :options="options['white-space']"
            @paramChange="paramChange" />
          <paramsSelect title="换行断点" :selected="selectedTextStyle.style['word-break']"
            :args="['selectedTextStyle','style','word-break']" :options="options['word-break']"
            @paramChange="paramChange" />
               <paramsInputAuto title="字间距"  :value="selectedTextStyle.style['letter-spacing']"
            :args="['selectedTextStyle','style','letter-spacing']" @paramChange="paramChange"
            :options="['normal','10px']" />
          <paramsInputAuto title="行高" :value="selectedTextStyle.style['line-height']"
            :args="['selectedTextStyle','style','line-height']" @paramChange="paramChange" :options="['1.5' ,'2']" />
          <paramsInputAuto title="阴影" :full="true" :value="selectedTextStyle.background['text-shadow']"
            :args="['selectedTextStyle','background','text-shadow']" @paramChange="paramChange"
            :options="['none','-10px -10px 0px #000000']" />
        </div>
      </div>
      <div class="param-container">
        <div>描边</div>
        <div>
          <paramsInputNum title="宽度" :value="selectedTextStyle.background['-webkit-text-stroke-width']"
            :args="['selectedTextStyle','background','-webkit-text-stroke-width']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsColor title="颜色" :colors="selectedTextStyle.background['-webkit-text-stroke-color']"
            :args="['selectedTextStyle','background','-webkit-text-stroke-color']" @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>旋转</div>
        <div>
          <paramsSelect title="类型" :selected="cssParams.transformStyle" :args="['cssParams','transformStyle']"
            :options="options['transformStyle']" @paramChange="paramChange" />

          <paramsInputNum title="角度" v-show="cssParams.transformStyle=='rotate'"
            :value="selectedTextStyle.style['transform']['rotate']"
            :args="['selectedTextStyle','style','transform','rotate']" step="1" min="0" @paramChange="paramChange" />

          <paramsInputNum title="X" v-show="cssParams.transformStyle=='rotate3d'"
            :value="selectedTextStyle.style['transform']['rotate3d']['x']"
            :args="['selectedTextStyle','style','transform','rotate3d','x']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="Y" v-show="cssParams.transformStyle=='rotate3d'"
            :value="selectedTextStyle.style['transform']['rotate3d']['y']"
            :args="['selectedTextStyle','style','transform','rotate3d','y']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="Z" v-show="cssParams.transformStyle=='rotate3d'"
            :value="selectedTextStyle.style['transform']['rotate3d']['z']"
            :args="['selectedTextStyle','style','transform','rotate3d','z']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="角度" v-show="cssParams.transformStyle=='rotate3d'"
            :value="selectedTextStyle.style['transform']['rotate3d']['a']"
            :args="['selectedTextStyle','style','transform','rotate3d','a']" step="1" min="0"
            @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div></div>
        <paramsTextarea title="自定义" :text="selectedTextStyle.customStyle" :args="['selectedTextStyle','customStyle']"
          @paramChange="paramChange"  styleType="style"/>
      </div>
    </div>

    <div class="param-tab" v-show="currentTab=='container'">
      <div class="param-container">
        <div>背景</div>
        <div>
          <paramsColor title="颜色" :colors="selectedTextStyle.container['background-color']"
            :args="['selectedTextStyle','container','background-color']" @paramChange="paramChange" />

          <backgroundImage :dataSource="dataSource" :value="selectedTextStyle.container['background-image'].value"
            @paramChange="paramChange" />

          <paramsInputAuto v-if="selectedTextStyle.container['background-image'].value!='none'" title="size"
            :value="selectedTextStyle.container['background-size']"
            :args="['selectedTextStyle','container','background-size']" @paramChange="paramChange"
            :options="options['background-size-options']" />
          <paramsInputAuto v-if="selectedTextStyle.container['background-image'].value!='none'" title="position"
            :value="selectedTextStyle.container['background-position']"
            :args="['selectedTextStyle','container','background-position']" @paramChange="paramChange"
            :options="options['background-position-options']" />
          <paramsSelect v-if="selectedTextStyle.container['background-image'].value!='none'" title="平铺"
            :selected="selectedTextStyle.container['background-repeat']"
            :args="['selectedTextStyle','container','background-repeat',]"
            :options="options['background-repeat-options']" @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>
          <paramsSelect title="溢出处理" :selected="selectedTextStyle.container['overflow']"
            :args="['selectedTextStyle','container','overflow',]" :options="options['overflow']"
            @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container" v-if="selectedItem">
        <div>位置</div>
        <div>
          <paramsInputNum title="X" :value="selectedItem.left" :args="['selectedItem','left']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="Y" :value="selectedItem.top" :args="['selectedItem','top']" step="1" min="0"
            @paramChange="paramChange" />
        </div>
      </div>

      <div class="param-container">
        <div>大小</div>
        <div>
          <paramsInputNum title="宽度" :value="selectedTextStyle.container['width']"
            :args="['selectedTextStyle','container','width']" step="1" min="0" @paramChange="paramChange" />
          <paramsInputNum title="高度" :value="selectedTextStyle.container['height']"
            :args="['selectedTextStyle','container','height']" step="1" min="0" @paramChange="paramChange" />
        </div>
      </div>

      <div class="param-container" v-if="selectedItem">
        <div>内边距</div>
        <div>

          <paramsInputAuto :full="true" title="全部" :options="[ '0', '5px' ,'5px 10px 5px 10px']"
            :value="selectedTextStyle['style']['padding']" :args="['selectedTextStyle','style','padding']"
            @paramChange="paramChange" />
          <!-- 
          <paramsSelect title="类型" :selected="cssParams.padding" :args="['cssParams','padding']"
            :options="options['padding-options']" @paramChange="paramChange" />

          <paramsInputNum title="高度" :value="selectedTextStyle.style[cssParams.padding]"
            :args="['selectedTextStyle','style',cssParams.padding]" step="1" min="0" @paramChange="paramChange" /> -->

        </div>
      </div>

      <div class="param-container">
        <div>边框</div>
        <div>
          <paramsSelect title="类型" :selected="cssParams.border" :args="['cssParams','border']"
            :options="options['border-options']" @paramChange="paramChange" />

          <paramsInputNum title="宽度" :value="selectedTextStyle['container'][cssParams.border]['width']"
            :args="['selectedTextStyle','container',cssParams.border,'width']" step="1" min="0"
            @paramChange="paramChange" />

          <paramsSelect title="线段" :selected="selectedTextStyle['container'][cssParams.border]['type']"
            :args="['selectedTextStyle','container',cssParams.border,'type']" :options="options['border-type-options']"
            @paramChange="paramChange" />

          <paramsColor title="颜色" :colors="selectedTextStyle.container[cssParams.border]['color']"
            :args="['selectedTextStyle','container',cssParams.border,'color']" @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>圆角</div>
        <div>
          <!-- <paramsInputAuto :full="true" title="全部" :options="[ '0', '5px' ,'10%','5px 10px 5px 10px']"
            :value="selectedTextStyle['container']['border-radius']"
            :args="['selectedTextStyle','container','border-radius']" @paramChange="paramChange" /> -->

          <paramsInputAuto title="左上" :options="[ '0', '5px' ,'10%' ,]"
            :value="selectedTextStyle['container']['border-top-left-radius']"
            :args="['selectedTextStyle','container','border-top-left-radius']" @paramChange="paramChange" />
          <paramsInputAuto title="右上" :options="[ '0', '5px' ,'10%']"
            :value="selectedTextStyle['container']['border-top-right-radius']"
            :args="['selectedTextStyle','container','border-top-right-radius']" @paramChange="paramChange" />
          <paramsInputAuto title="左下" :options="[ '0', '5px' ,'10%']"
            :value="selectedTextStyle['container']['border-bottom-left-radius']"
            :args="['selectedTextStyle','container','border-bottom-left-radius']" @paramChange="paramChange" />
          <paramsInputAuto title="右下" :options="[ '0', '5px' ,'10%']"
            :value="selectedTextStyle['container']['border-bottom-right-radius']"
            :args="['selectedTextStyle','container','border-bottom-right-radius']" @paramChange="paramChange" />
        </div>
      </div>

      <div class="param-container">
        <div>旋转</div>
        <div>

          <paramsSelect title="类型" :selected="cssParams.transformContainer" :args="['cssParams','transformContainer']"
            :options="options['transformStyle']" @paramChange="paramChange" />

          <paramsInputNum title="角度" v-show="cssParams.transformContainer=='rotate'"
            :value="selectedTextStyle['container']['transform']['rotate']"
            :args="['selectedTextStyle','container','transform','rotate']" step="1" min="0"
            @paramChange="paramChange" />

          <paramsInputNum title="X" v-show="cssParams.transformContainer=='rotate3d'"
            :value="selectedTextStyle['container']['transform']['rotate3d']['x']"
            :args="['selectedTextStyle','container','transform','rotate3d','x']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="Y" v-show="cssParams.transformContainer=='rotate3d'"
            :value="selectedTextStyle['container']['transform']['rotate3d']['y']"
            :args="['selectedTextStyle','container','transform','rotate3d','y']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="Z" v-show="cssParams.transformContainer=='rotate3d'"
            :value="selectedTextStyle['container']['transform']['rotate3d']['z']"
            :args="['selectedTextStyle','container','transform','rotate3d','z']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInputNum title="角度" v-show="cssParams.transformContainer=='rotate3d'"
            :value="selectedTextStyle['container']['transform']['rotate3d']['a']"
            :args="['selectedTextStyle','container','transform','rotate3d','a']" step="1" min="0"
            @paramChange="paramChange" />

        </div>
      </div>
      <div class="param-container">
        <div></div>
        <paramsTextarea title="自定义" :text="selectedTextStyle.customStyle" :args="['selectedTextStyle','customStyle']"
          @paramChange="paramChange" styleType="container"  />
      </div>
    </div>

  </div>
</template>

<script>
const options = {
  'tabs': [
    { value: 'text', label: '文本' },
    { value: 'container', label: '容器' }
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
    { value: "horizontal-tb", label: '横排,自上而下' },
    { value: "vertical-rl", label: '竖排,自右而左' },
    { value: "vertical-lr", label: '竖排,自左而右' }
  ],
  'text-align': [
    { value: "left", label: '靠左' },
    { value: "center", label: '居中' },
    { value: "right", label: '靠右' },
  ],
  'font-weight': [
    { value: "normal", label: '普通' },
    { value: "lighter", label: '更细' },
    { value: "bold", label: '加粗' },
    { value: "bolder", label: '更粗' },
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
  ]
}


import paramsInputNum from './paramsInputNum.vue'
import paramsColor from './paramsColor.vue'
import paramsSelect from './paramsSelect.vue'
import paramsTextarea from './paramsTextarea.vue'
import backgroundImage from './backgroundImage.vue'
import paramsInputAuto from './paramsInputAuto.vue'

export default {
  components: {
    paramsInputNum: paramsInputNum,
    paramsColor: paramsColor,
    paramsSelect: paramsSelect,
    paramsTextarea: paramsTextarea,
    backgroundImage: backgroundImage,
    paramsInputAuto: paramsInputAuto
  },
  props: {
    selectedTextStyle: Object,
    cssParams: Object,
    selectedItem: Object,
    dataSource: Array,
    presetStyle: Array,
  },
  data() {
    this.options = options
    return {
      currentTab: 'text',
      customStyle: [{ value: '', label: '无' },],
      customBackground: [{ value: '', label: '无' },],
      customContainer: [{ value: '', label: '无' },],
      presetStyles: this.presetStyle,
      selected: ''
    }
  },
  created() {
    this.getCustomStyleStroge()
  },
  methods: {
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    },
    changePresetStyle(e) {
      this.$emit('setPresetStyle', e.target.selectedOptions[0]._value)
    },
    getCustomStyleStroge() {
      chrome.storage.local.get(['customStyle'], (result) => {
        if (result && result.customStyle) {
          this.customStyle = [{ value: '', label: '无' }].concat(result.customStyle.filter(ele => ele.fit.includes('style')))
          this.customBackground = [{ value: '', label: '无' }].concat(result.customStyle.filter(ele => ele.fit.includes('background')))
          this.customContainer = [{ value: '', label: '无' }].concat(result.customStyle.filter(ele => ele.fit.includes('container')))
        }
      });
    },
    triggetMethod(args, data) {
      this.$emit('triggetMethod', args, data)
    }
  }
}
</script>


<style lang="less">
.more-action {
  width: 100%;
  cursor: pointer;
  text-align: center;
  ul {
    border-radius: 3px;
    overflow: hidden;
    text-align: left;
    z-index: 999;
    position: absolute;
    right: 20px;
    width: 80px;
    display: none;
    list-style-type: none;
    padding: 0;
    background-color: #fff;
    li {
      padding: 5px;
    }
    // border-radius: 0 0 10px 10px;
  }
  li:hover {
    background-color: rgba(24, 144, 255, 0.1);
    color: rgba(0, 0, 0, 1);
  }
  ul:hover {
    color: #444;
    display: block;
  }
}
.more-action:hover {
  // background-color: #fff;
  color: #444;
  ul {
    display: block;
  }
}
</style>