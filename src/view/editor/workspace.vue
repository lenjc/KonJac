<template>
  <div id="main_app">
    <div id="layout-header">
      <div style="width:200px;font-size:25px;color:#3993a4;font-weight:bold;letter-spacing:3px;text-align:center">
        <embed src="img/KonJac.svg" width="24" height="24" type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/" />&nbsp;<span style="color:#cba67e">K</span>on<span
          style="color:#1cbedb">J</span>ac
      </div>
      <div class="konjac_menu">
        导出
        <ul>
          <li @click="downloadSource">素材</li>
          <li @click="downloadManga">成品</li>
        </ul>
      </div>
      <div class="konjac_menu" @click="$refs.baseinfo.showModal()">
        基本信息
      </div>
      <div class="konjac_menu" @click="saveBody">
        保存
        <a-icon type="loading" v-show="saved" />
      </div>
    </div>
    <div id="layout-workspace">
      <div class="workspace-sider-left  scrollbar2">
        <input type="file" ref='file' style="display:none" @change="loadFile" />
        <div v-for="(thumbnailPage,pageindex) in totalSourceLength" :key="'thumbnailPage-'+pageindex">
          <div class="thumbnail-sider-left">
            <a class="thumbnail-page-index" @click="scrollInto(pageindex)">
              {{thumbnailPage}}
            </a>
            <div style="text-align:left;padding:0 0 0 3px;width:100%">
              <div style='height:20px;line-height:20px'>
                <svg t="1640526374851" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2067" width="200" height="200">
                  <path
                    d="M918.457 862.043H105.543c-20.435 0-37-16.565-37-37V198.957c0-20.435 16.565-37 37-37h812.913c20.435 0 37 16.565 37 37v626.087c0.001 20.434-16.565 36.999-36.999 36.999z m-775.914-74h738.913V235.957H142.543v552.086z"
                    p-id="2068"></path>
                  <path
                    d="M155.696 826.143l-55.391-49.069L316.609 532.9c12.337-13.926 33.096-16.526 48.486-6.072l95.808 65.08 182.756-233.7a36.996 36.996 0 0 1 27.779-14.182 37.005 37.005 0 0 1 28.751 12.093L945.84 626.466l-54.768 49.765-216.147-237.879L497.88 664.749c-11.996 15.339-33.828 18.756-49.937 7.814l-97.517-66.241-194.73 219.821z"
                    p-id="2069"></path>
                  <path d="M331.174 373m-55 0a55 55 0 1 0 110 0 55 55 0 1 0-110 0Z" p-id="2070"></path>
                </svg>
                {{imageSource[pageindex]?imageSource[pageindex].status?imageSource[pageindex].status==1?`${imageSource[pageindex].height}×${imageSource[pageindex].width}`:'Error':'loading':'NO-IMAGE'}}
              </div>
              <div style='height:20px;line-height:20px' v-show="
              imageSource[pageindex] && data.body[pageindex] && 

              (imageSource[pageindex].height!=data.body[pageindex].height
              ||  imageSource[pageindex].width!=data.body[pageindex].width)
              ">
                <svg t="1640526418881" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3616" width="200" height="200">
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                    p-id="3617"></path>
                  <path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="3618"></path>
                  <path d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
                    p-id="3619"></path>
                </svg> {{data.body[pageindex]?`${data.body[pageindex].height}×${data.body[pageindex].width}`:'Error'}}
              </div>
            </div>
            <div class="dropdown-left">
              <a-dropdown placement="bottomRight" overlayClassName="dropdown-item">
                <a-icon type="down" style="cursor: pointer;" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="1">
                    <a @click="$refs.editITem.showModal(data.body[pageindex])">编辑长宽</a>
                  </a-menu-item>
                  <a-menu-item key="0">
                    <a @click="filePage=pageindex;$refs.file.click();">导入SVG</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
          <vuedraggable class="wrapper" v-model="data.body[pageindex].item">
            <transition-group>
              <div v-for="(item,itemIndex) in data.body[pageindex].item" :key="'item--'+itemIndex"
                class="thumbnail-item" :class="{'thumbnail-item-selected':(selectedItem==item)}">
                <div>
                  <a-icon type="font-size" v-if="item.type=='text'" />
                  <a-icon type="picture" v-if="item.type=='clip'" />
                  <a-icon type="picture" v-if="item.type=='svg'" />
                </div>
                <div @click="scrollInto(pageindex);selectItem(item,{page:pageindex,index:itemIndex})">
                  <span v-if="item.type=='text'">{{item | bodyFilter}}</span>
                  <span v-if="item.type=='clip'">Clip-{{item.uid}}</span>
                  <span v-if="item.type=='svg'"> SVG-{{item.uid}}</span>
                </div>
                <div>
                  <a-icon type="eye" v-show="item.show" @click="item.show=!item.show" />
                  <a-icon type="eye-invisible" v-show="!item.show" @click="item.show=!item.show" />
                  <!-- <a-dropdown placement="bottomRight" overlayClassName="dropdown-item">
                    <a-icon type="down" style="cursor: pointer;" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item key="0">
                        <a @click="deleteItem(pageindex,itemIndex)">删除</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown> -->
                </div>
              </div>
            </transition-group>
          </vuedraggable>
        </div>
      </div>
      <div id="workspace-content">
        <div id="msg"></div>
        <div id="workspace" class="scrollbar">
          <richTextEditorMenu :textEditorMenuPositon="textEditorMenuPositon" />
          <customClipView v-if="customClip.status.show" :customClip="customClip" @paramChange="setData"
            @addClipItem="addClipItem" :zoom="zoom" :style="{zoom:zoom}" :process="process" />
          <svgEditorView ref="svgEditorView" v-if="svgData.status.show" :svgData="svgData" @paramChange="setData"
            @addSVGItem="addSVGItem" :zoom="zoom" :style="{zoom:zoom}" :process="process" />
          <div v-for="(page,pageIndex) in totalSourceLength" :key="'page-'+pageIndex" class="workspace-item"
            :data-index="pageIndex" data-type="page" :id="`page-${pageIndex}`" :style="{zoom:zoom}"
            @click="pageClickWatch($event,pageIndex)" @mousedown="pageMouseDownWatch($event,pageIndex)">
            <div class="workspace-page" data-type="container">
              <img v-if="!imageSource[pageIndex]" class="workspace-img" :id="`image-${pageIndex}`"
                :style="`width:${data.body[pageIndex].width}px;height:${data.body[pageIndex].height}px;`"
                draggable="false" />
              <img v-if="imageSource[pageIndex]" class="workspace-img" :src="imageSource[pageIndex].src"
                :id="`image-${pageIndex}`"
                :style="`width:${imageSource[pageIndex].width}px;height:${imageSource[pageIndex].height}px;`"
                draggable="false" @error="imageOnError(pageIndex)" @load="imageOnload(pageIndex)">
              <div>
                <div v-for="(item,index) in data.body[pageIndex].item" :key="'item-'+index" data-type="item"
                  :data-index="index" :id="'item-'+item.uid" :style="`left:${item.left}px;top:${item.top}px`"
                  class="body-item" v-show="item.show">
                  <div v-if="item.type=='text'">
                    <div class="konjac_item_container_resize"
                      v-for="(xy,xyindex) in [[-1,-1,'nw-resize'],[0,-1,'n-resize'],[-1,1,'sw-resize'],[-1,0,'w-resize'],[1,0,'e-resize'],[1,-1,'ne-resize'],[0,1,'s-resize'],[1,1,'se-resize']]"
                      :key="'konjac_item_container_resize-'+xyindex" :style="xy | resizePoint" data-type="params"
                      :class="{'konjac_item_selected':(selectedItem==item)}" @mousedown.stop="resizeTextDom(item,xy)">
                    </div>
                    <div class="konjac_item_line" v-for="(tb,tbindex) in ['width:100%;height:1px;top:-4px;left:0px', 'width: 100%;height: 1px;bottom:-4px;left:0px'
                  , 'width: 1px;height: 100%;top:0;left:-4px' , 'width: 1px;height: 100%;top:0;right:-4px' ]"
                      :style="tb" :key="'konjac_item_line-'+tbindex"
                      :class="{'konjac_item_selected':(selectedItem==item)}"></div>
                    <div class="konjac_item_container default_konjac_css_container"
                      :style="Object.assign({},item.container,tool.jsonParse(item.customContainer))"
                      :class="{'konjac_item_move':(basetool=='move')}" @mousedown="moveDom($event,item)">
                      <div
                        :style="Object.assign({'position': 'absolute','top':'0','left':'0'},item.style,item.background,tool.jsonParse(item.customBackground))"
                        v-html="item.body" class="default_konjac_css_style default_konjac_css_background">
                      </div>
                      <div
                        :style="Object.assign({'position': 'absolute','user-select':'text','top':'0','left':'0'},item.style,tool.jsonParse(item.customStyle)) "
                        :id="'textEditor-'+item.uid" v-html="item.body" contenteditable="false" data-type="editor"
                        class="default_konjac_css_style item_editor" @blur.stop="saveTextItem($event,item)"
                        @dblclick.stop="editTextItem(item,{page:pageIndex,index:index})"
                        @click="selectItem(item,{page:pageIndex,index:index})">
                      </div>
                    </div>
                  </div>
                  <div v-if="item.type=='clip'">
                    <div class="konjac_item_line" v-for="(tb,tbindex) in ['width:100%;height:1px;top:0;left:0px', 'width: 100%;height: 1px;bottom:0;left:0px'
                  , 'width: 1px;height: 100%;top:0;left:0px' , 'width: 1px;height: 100%;top:0;right:0px' ]" :style="tb"
                      :key="'konjac_item_line-'+tbindex" :class="{'konjac_item_selected':(selectedItem==item)}"></div>
                    <img :src="item.src" draggable="false" @click="selectItem(item,{page:pageIndex,index:index})"
                      @dblclick.stop="reeditClipShape($event,item)" @mousedown="moveDom($event,item)" />
                  </div>
                  <div v-if="item.type=='svg'">
                    <div class="konjac_item_line" v-for="(tb,tbindex) in ['width:100%;height:1px;top:0;left:0px', 'width: 100%;height: 1px;bottom:0;left:0px'
                  , 'width: 1px;height: 100%;top:0;left:0px' , 'width: 1px;height: 100%;top:0;right:0px' ]" :style="tb"
                      :key="'konjac_item_line-'+tbindex" :class="{'konjac_item_selected':(selectedItem==item)}"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" :style="Object.assign({},item.style)"
                      :viewBox="item.attributes?item.attributes.viewBox:''">
                      <g v-html="item.body" :transform="`translate(${-item.translate.x},${-item.translate.y})`"
                        @dblclick="reeditSVG($event,item)" @click="selectItem(item,{page:pageIndex,index:index})"
                        @mousedown="moveDom($event,item)">
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="workspace-footer" style="color:#fff">
          <div>
            位置: Index <span v-for="(i,index) in process" :key="'ipro-'+index"> > {{i}}</span>
          </div>
          <div style="margin-right:20px">
            显示比例: <select style="border:none;color:#444" v-model="zoom">
              <option v-for="i in 8" :key="i" :value="i/4">{{i*25}}%</option>
            </select>
          </div>
        </div>
      </div>
      <div id="workspace-sider-right" class="scrollbar2">
        <div id="workspace-basetool">
          <div class="basetool-item" @click="selectedItem=null; basetool='text'" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='text')}">
            <a-icon type="font-size" />
          </div>
          <div class="basetool-item" @click="selectedItem=null;basetool='clip-rect'" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='clip-rect')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiancai" />
            </svg>
          </div>
          <div class="basetool-item" @click="selectedItem=null;basetool='clip-path'" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='clip-path')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiancai1" />
            </svg>
          </div>
          <div class="basetool-item" @click="selectedItem=null;basetool='svg'" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='svg')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pen" />
            </svg>
          </div>
        </div>
        <div id="workspace-param">
          <tabsText v-if="basetool=='text' || (selectedItem && selectedItem.type=='text')" :cssParams="cssParams"
            :selectedItem="selectedItem" :selectedTextStyle="selectedTextStyle" @paramChange="setData"
            :dataSource="data.body" :presetStyle="presetStyle" @setPresetStyle="setPresetStyle"
            @triggetMethod="triggetMethod" />
          <drawClipShapeMenu v-if="customClip.status.show" @paramChange="setData" :customClip="customClip"
            @addClipItem="addClipItem" :process="process" />
          <clipItemMenu v-if="selectedItem && selectedItem.type=='clip'" :selectedItem="selectedItem"
            @paramChange="setData" @reeditClipShape="reeditClipShape" />
          <svgDrawMenu v-if="svgData.status.show" :svgData="svgData" @paramChange="setData"
            @triggetMethod="triggetMethod" />
          <svgItemMenu v-if="selectedItem && selectedItem.type=='svg'" :selectedItem="selectedItem"
            @paramChange="setData" />
          <tips v-if="basetool" :basetool="basetool" />
          <baseinfo ref="baseinfo" :data="data" @paramChange="setData" />
        </div>
      </div>
    </div>
    <a-modal :visible="visible.presetStyleTitle" title="样式名称" width="300px" okText="确定" cancelText="取消"
      @cancel="visible.presetStyleTitle=false" @ok="createPresetStyle">
      <a-input v-model="title.presetStyleTitle" placeholder="请输入"></a-input>
    </a-modal>
    <editITem ref='editITem' @paramChange="setData" />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import tool from '../../module/tool'
import richTextEditorMenu from './components/richTextEditorMenu.vue'
import tabsText from './components/tabsText.vue'
import bytes from 'utf8-bytes'

import customClipView from './clip/customClipView.vue'
import drawClipShapeMenu from './clip/drawClipShapeMenu.vue'
import clipItemMenu from './clip/clipItemMenu.vue'

import svgEditorView from './svg/svgEditorView.vue'
import svgDrawMenu from './svg/svgDrawMenu.vue'
import svgItemMenu from './svg/svgItemMenu.vue'
import tips from './components/basetoolTip.vue'
import baseinfo from './components/baseinfo.vue'
import editITem from './components/editITem.vue'

import vuedraggable from 'vuedraggable';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

import chromeApi from '../../module/chrome'

const default_konjac_css = {
  'style': {
    'font-size': 18,
    'color': { rgba: { r: 0, g: 0, b: 0, a: 1, } },
    'writing-mode': 'horizontal-tb',
    'text-align': 'left',
    'line-height': '1.5',
    'transform': {
      'rotate': 0,
      'rotate3d': { x: 0, y: 0, z: 0, a: 0 }
    },
    'padding': '5px',
    'padding-top': '5px',
    'padding-bottom': '5px',
    'padding-left': '5px',
    'padding-right': '5px',
    'font-weight': "normal",
    'font-family': "Microsoft YaHei, 微软雅黑, sans-serif",
    'letter-spacing': 'normal',
    'white-space': 'normal',
    'word-break': 'break-all',    
  },

  'background': {
    '-webkit-text-stroke-color': { rgba: { r: 255, g: 255, b: 255, a: 1, } },
    '-webkit-text-stroke-width': 4,
    'text-shadow': 'none'
  },
  'container': {
    'height': 100,
    'width': 60,
    'overflow': 'visible',
    'transform': {
      'rotate': 0,
      'rotate3d': { x: 0, y: 0, z: 0, a: 0 }
    },
    'background-color': { rgba: { r: 255, g: 255, b: 255, a: 0 } },
    'background-image': { value: 'none', url: '', uid: '', type: '' },
    'background-size': 'auto',
    'background-position': '0% 0%',
    'background-repeat': 'repeat',
    'border': { width: 0, type: 'solid', color: { rgba: { r: 255, g: 255, b: 255, a: 0 } } },
    'border-top': { width: 0, type: 'solid', color: { rgba: { r: 255, g: 255, b: 255, a: 0 } } },
    'border-bottom': { width: 0, type: 'solid', color: { rgba: { r: 255, g: 255, b: 255, a: 0 } } },
    'border-left': { width: 0, type: 'solid', color: { rgba: { r: 255, g: 255, b: 255, a: 0 } } },
    'border-right': { width: 0, type: 'solid', color: { rgba: { r: 255, g: 255, b: 255, a: 0 } } },
    'border-radius': '0',
    'border-top-left-radius': '0',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0',
    'border-bottom-left-radius': '0',
  },
  'customStyle': '',
  'customBackground': '',
  'customContainer': ''
}

async function callbackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (response) {
      resolve(response)
    });
  })
}

const default_data = {
  customClip: {
    uid: '',
    page: 0,
    shape: 'path',
    style: {
      left: "0px",
      top: '0px',
      width: '0px',
      height: '0px'
    },
    points: [],
    lines: [],
    status: {
      onDraw: true,
      show: false
    },
    preLine: null,
    currentLine: null,
    currentLineIndex: null,
  },
  svgData: {
    uid: '',
    page: 0,
    style: {
      left: "0px",
      top: '0px',
      width: '0px',
      height: '0px'
    },
    body: "",
    offset: {
      x: 0,
      y: 0,
    },
    defaultStyle: {
      fill: { rgba: { r: 0, g: 255, b: 255, a: 1 } },
      'stroke': { rgba: { r: 255, g: 255, b: 255, a: 1 } },
      'stroke-width': 4,
    },
    newNode: null,
    currentNode: null,
    preLine: null,
    currentLine: null,
    currentLineIndex: null,
    shape: '',
    move: { x: 0, y: 0 },
    status: {
      show: false,
      edit: false,
      onDraw: false,
      move: false,
    },
    box: null,
  },
}

export default {
  components: {
    richTextEditorMenu: richTextEditorMenu,
    tabsText: tabsText,

    customClipView: customClipView,
    drawClipShapeMenu: drawClipShapeMenu,
    clipItemMenu: clipItemMenu,

    svgEditorView: svgEditorView,
    svgDrawMenu: svgDrawMenu,
    svgItemMenu: svgItemMenu,
    vuedraggable: vuedraggable,
    tips: tips,
    baseinfo: baseinfo,
    editITem,
  },
  data() {
    this.tool = tool
    return {
      saved: false,
      visible: {
        presetStyleTitle: false,
      },
      title: {
        presetStyleTitle: ''
      },
      process: [],
      data: {
        _id: '',
        local_id: '',
        avatar: '',
        title: '',
        keywords: [],
        language: '',
        url: '',
        message: '',
        body: [],
        defaultRule: {},
        createTime: '',
        syncStatus: 1,
        syncTime: '',
        saveTime: '',
      },
      imageSource: [],
      totalSourceLength: 0,
      basetool: '',
      zoom: 1,
      filePage: 0,
      customClip: {},
      presetStyle: [],
      copyItem: null,
      defaultStyle: {},
      selectedTextStyle: null,
      selectedItem: null,
      selectIndex: null,
      cssParams: {
        'padding': "padding",
        'border': "border",
        'transformStyle': "rotate",
        'transformContainer': 'rotate'
      },
      textEditorMenuPositon: {
        display: 'none',
        left: '0px',
        top: '0px'
      },
      svgData: {},

    }
  },
  filters: {
    resizePoint(xy) {
      switch (xy[2]) {
        case 'nw-resize':
          return `left: -8px;top:-8px;cursor:${xy[2]}`
        case 'n-resize':
          return `left: calc(50% - 4px);top:-8px;cursor:${xy[2]}`
        case 'ne-resize':
          return `right: -8px;top:-8px;cursor:${xy[2]}`
        case 'e-resize':
          return `right: -8px;top:calc(50% - 4px);cursor:${xy[2]}`
        case 'se-resize':
          return `right: -8px;bottom:-8px;cursor:${xy[2]}`
        case 'sw-resize':
          return `left: -8px;bottom:-8px;cursor:${xy[2]}`
        case 'w-resize':
          return `left: -8px;top:calc(50% - 4px);cursor:${xy[2]}`
        case 's-resize':
          return `left: calc(50% - 4px);bottom:-8px;cursor:${xy[2]}`
      }
    },
    bodyFilter(item) {
      switch (item.type) {
        case 'text':
          let div = document.createElement("div");
          div.innerHTML = item.body
          return div.innerText
      }
    },
  },
  // beforeCreate(){

  // },
  created() {
    document.oncontextmenu = () => { this.cleanSelection(); return false; }
    document.onkeydown = this.keyDown
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      if (sender.url) { return }
      sendResponse({ code: 0, sender: 'editor.html' });
      switch (request.type) {
        case 'editor-data':
          this.loadImageSource(request);
          break;
        case 'editor-translation':
          this.loadTranslation(request);
          break;
      }
    }
    );
    document.title = 'KonJac'
    this.init()
    this.dataReset('customClip')
    this.dataReset('svgData')
    // this.loadImageSource({
    //   pages: [{
    //     src: "https://img0.baidu.com/it/u=4177142990,590745591&fm=26&fmt=auto",
    //     // width: 820,
    //     // height: 1200
    //   }]
    // })
  },
  watch: {
    basetool(val) {
      switch (val) {
        case 'text':
          this.selectedTextStyle = this.defaultStyle
          break;
        default:
          break;
      }
    },
    selectedItem(val, old) {
      if (old && old.type == 'text') {
        this.saveItem(old)
      }
    },
    data: {
      handler(val, old) { document.title = 'KonJac - ' + val.title },
      deep: true,
    }
  },
  methods: {
    getTranslation(data = {}) {
      let filterBody = data.body.filter((ele, index) => {
        ele.index = index
        return ele.item.length
      })
      if(!filterBody.length){
        return false
      }
      data.defaultRule = {
        skip: filterBody[0].index
      }
      let { body, saveTime, createTime, ...item } = data
      item.body = filterBody
      return item
    },
    async saveBody() {
      if (!this.validateInfo()) { this.$message.warning('译文标题必须在6字节以上'); return }
      let item = this.getTranslation(this.data)
      if(!item){this.$message.warning('译文无内容'); return      }
      let ts = await chromeApi.getlocal(`translation-${this.data.local_id}`)
      let { createTime, saveTime, ...res } = ts ? JSON.parse(ts) : {}
      if (JSON.stringify(item) == JSON.stringify(res)) { this.$message.info('文档未修改'); return }
      this.saved = true
      if (!item.createTime) {
        item.createTime = Date.parse(new Date)
      }
      item.syncStatus = 1
      item.saveTime = Date.parse(new Date)
      let translation = await chromeApi.getlocal('translation')
      let translationList = translation ? JSON.parse(translation) : []
      let existed = translationList.find(ele => ele.local_id == item.local_id)
      let { body, ...newItem } = item
      if (existed) {
        Object.assign(existed, newItem)
      } else {
        translationList.push(newItem)
      }
      await chromeApi.savelocal({ 'translation': JSON.stringify(translationList) })
      await chromeApi.savelocal({ [`translation-${item.local_id}`]: JSON.stringify(item) })
      this.saved = false
      this.$message.success('保存成功')
    },
    async loadTranslation(request) {
      let translation = await chromeApi.getlocal(`translation-${request.local_id}`)
      let { body, ...data } = translation ? JSON.parse(translation) : {}
      Object.assign(this.data, data)
      body = typeof body == 'string' ? JSON.parse(body) : body
      let index = body[body.length - 1].index
      if (this.data.body.length < (index + 1)) {
        let len = index + 1 - this.data.body.length
        for (let index = 0; index < len; index++) {
          this.data.body.push({
            width: null,
            height: null,
            item: [],
          })
        }
      }
      body.forEach(ele => {
        this.data.body.splice(ele.index, 1, ele)
      })
      if (this.data.body.length > this.totalSourceLength) {
        this.totalSourceLength = this.data.body.length
      }
    },
    async getPresetStyle() {
      let list = await chromeApi.getlocal('presetStyle')
      this.presetStyle = list ? JSON.parse(list) : [
        {
          id: '0',
          title: '默认',
          style: JSON.parse(JSON.stringify(default_konjac_css))
        }
      ]
    },
    async createPresetStyle() {
      this.visible.presetStyleTitle = false
      this.presetStyle.push({
        id: uuidv4(),
        title: this.title.presetStyleTitle,
        style: JSON.parse(JSON.stringify(this.selectedTextStyle))
      })
      await chromeApi.savelocal({ 'presetStyle': JSON.stringify(this.presetStyle) })
      this.title.presetStyleTitle = ''
    },
    async updatePresetStyle(val) {
      let item = this.presetStyle.find(ele => ele.id == val)
      if (!item) { return }
      this.$confirm({
        width: 300,
        content: `覆盖保存为 [${item.title}]`,
        onOk: async () => {
          item.style.style = JSON.parse(JSON.stringify(this.selectedTextStyle.style))
          item.style.container = JSON.parse(JSON.stringify(this.selectedTextStyle.container))
          item.style.background = JSON.parse(JSON.stringify(this.selectedTextStyle.background))
          await chromeApi.savelocal({ 'presetStyle': JSON.stringify(this.presetStyle) })
        },
        okText: '确定',
        cancelText: '取消',
      })
    },
    async deletePresetStyle(val) {
      let index = this.presetStyle.findIndex(ele => ele.id == val)
      if (index < 0) { return }
      this.$confirm({
        width: 300,
        content: `删除 [${this.presetStyle[index].title}] 预设样式`,
        onOk: async () => {
          this.presetStyle.splice(index, 1)
          await chromeApi.savelocal({ 'presetStyle': JSON.stringify(this.presetStyle) })
        },
        okText: '确定',
        cancelText: '取消',
      })
    },
    setPresetStyle(val) {
      let item = this.presetStyle.find(ele => ele.id == val)
      if (!item) { return }
      this.$set(this.selectedTextStyle, 'style', item.style.style)
      this.$set(this.selectedTextStyle, 'container', item.style.container)
      this.$set(this.selectedTextStyle, 'background', item.style.background)
      if (this.selectedItem) {
        this.selectedItem.container = this.getTextStyle('container')
        this.selectedItem.style = this.getTextStyle('style')
        this.selectedItem.background = this.getTextStyle('background')
      }
      this.$forceUpdate()
    },
    async init() {
      await this.getPresetStyle()
      this.$set(this, 'defaultStyle', JSON.parse(JSON.stringify(this.presetStyle[0].style)))
    },
    dataReset(key) {
      this.$set(this, key, JSON.parse(JSON.stringify(default_data[key])))
    },

    keyDown(e) {
      if (this.selectedItem) {
        switch (e.keyCode) {
          case 46:
            this.$confirm({
              title: '确认删除?',
              okText: '确定',
              cancelText: '取消',
              centered: true,
              width: 350,
              okType: 'danger',
              onOk: () => {
                this.data.body[this.selectIndex.page].item.splice(this.selectIndex.index, 1)
              },
              onCancel() { },
            });
            break;
          case 67:
            if (e.ctrlKey) { this.copyItem = JSON.stringify(this.selectedItem) }
            break
          case 86:
            if (e.ctrlKey && this.copyItem) {
              let item = JSON.parse(this.copyItem)
              item.uid = uuidv4()
              item.top = this.selectedItem.top + 50
              item.left = this.selectedItem.left + 50
              this.data.body[this.selectIndex.page].item.push(item)
            }
            break
        }
      }
    },
    loadFile(e) {
      let file = this.$refs.file.files[0]
      if (file.type != 'image/svg+xml') {
        this.$message.warning('请上传SVG类型文件')
        return
      }
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => {
        let div = document.createElement('div')
        div.innerHTML = e.target.result
        let svg
        div.childNodes.forEach(ele => {
          if (ele.nodeName == 'svg') {
            svg = ele
          }
        })
        if (!svg) {
          this.$message.warning('请上传SVG类型文件')
          return
        }
        let item = {
          uid: uuidv4(),
          type: 'svg',
          show: true,
          body: svg.innerHTML,
          left: 0,
          top: 0,
          translate: {
            x: 0,
            y: 0,
          },
          style: {
            width: 300 + 'px',
            height: 150 + 'px'
          },
          attributes: {

          },
        }
        for (let index = 0; index < svg.attributes.length; index++) {
          let attribute = svg.attributes[index]
          switch (attribute.nodeName) {
            case 'height': case 'width':
              item.style[attribute.nodeName] = attribute.value + 'px'
              break
            case 'viewBox':
              item.attributes[attribute.nodeName] = attribute.value
              break
          }
        }
        this.data.body[this.filePage].item.push(item)
      }
    },
    async downloadManga() {
      this.selectedItem = null
      let items = document.getElementsByClassName('workspace-page')
      const zip = new JSZip();
      this.$message.loading({ content: `下载中 0/${items.length}`, key: 'loading' });
      this.setMargin()
      for (let index = 0; index < items.length; index++) {
        let node = items[index]
        let dataUrl = await domtoimage.toPng(node)
        zip.file(`${index + 1}.png`, dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
        this.$message.loading({ content: `下载中 ${index + 1}/${items.length}`, key: 'loading' });
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${this.data.title}.zip`);
        this.$message.success({ content: `下载完成`, key: 'loading' });
      });
      this.setMargin(false)

    },
    setMargin(reset = true) {
      let elements = document.getElementsByClassName('default_konjac_css_style')
      for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        let style = window.getComputedStyle(element)
        if (style.writingMode.includes('rl')) {
          if (reset) {
            element.style.marginLeft = ((parseInt(style.paddingLeft) + parseInt(style.paddingRight)) * -1) + 'px'
          } else { element.style.marginLeft = '0' }
        }
      }
    },
    async downloadSource() {
      this.selectedItem = null
      let items = document.getElementsByClassName('workspace-img')
      const zip = new JSZip();
      this.$message.loading({ content: `下载中 0/${items.length}`, key: 'loading' });
      for (let index = 0; index < items.length; index++) {
        let node = items[index]
        let dataUrl = await domtoimage.toPng(node)
        zip.file(`${index + 1}.png`, dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
        this.$message.loading({ content: `下载中 ${index + 1}/${items.length}`, key: 'loading' });
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${this.data.title}.zip`);
        this.$message.success({ content: `下载完成`, key: 'loading' });
      });
    },

    setData(args = [], value) {
      let that = this
      for (let index = 0; index < args.length - 1; index++) { that = that[args[index]]; }
      this.$set(that, args[args.length - 1], value)
      switch (args[0]) {
        case 'selectedTextStyle':
          this.setselectedItem(args[1], args[2])
          break;
      }
    },
    triggetMethod(args = [], data) {
      let that = this
      for (let index = 0; index < args.length; index++) { that = that[args[index]]; }
      that(data)
    },
    pageClickWatch(e, pageIndex) {
      switch (this.basetool) {
        case 'text':
          this.basetool = ''
          this.selectedItem = null
          this.createNewText(e, pageIndex); break;
        case 'clip-path':
          this.basetool = ''
          this.selectedItem = null
          this.createNewClipPath(e, pageIndex); break;
        case 'svg':
          this.basetool = ''
          this.selectedItem = null
          this.createNewSvg(e, pageIndex)
          break
      }
    },
    pageMouseDownWatch(e, pageIndex) {
      switch (this.basetool) {
        case 'clip-rect':
          this.basetool = ''
          this.selectedItem = null
          this.createNewClipRect(e, pageIndex)
          break;
        default:
          break;
      }
    },
    cleanSelection() {
      if (this.basetool) { this.basetool = '' }
      if (this.selectedItem) { this.selectedItem = null }
    },
    getOffsetToPage(element, offset = { left: 0, top: 0 }) {
      if (element.dataset && element.dataset.type == 'page') {
        return { offset: offset, page: element }
      } else {
        offset.left += element.offsetLeft ? element.offsetLeft * this.zoom : 0
        offset.top += element.offsetTop ? element.offsetTop * this.zoom : 0
        let parentElement = element.parentElement
        return this.getOffsetToPage(parentElement, offset)
      }
    },
    editTextItem(item, index) {
      let textEle = document.getElementById('textEditor-' + item.uid)
      textEle.contentEditable = 'true'
      textEle.style['userSelect'] = 'text'
      textEle.focus()
      this.selectItem(item, index)
      let res = this.getOffsetToPage(textEle)
      this.textEditorMenuPositon = {
        display: 'block',
        left: res.offset.left + res.page.offsetLeft * this.zoom + 'px',
        top: res.offset.top + res.page.offsetTop * this.zoom + 'px',
      }
      this.process.push('Edit')
    },
    saveTextItem(event, item) {
      let body = event.target
      let saveIt = (e) => {
        if (e.target == body) {
          document.removeEventListener('click', saveIt)
          return
        }
        let richTextEditorMenu = e.path.find(ele => ele.id == 'richTextEditorMenu')
        let editMenu = e.path.find(ele => ele.id == 'workspace-param')
        let params = e.path.find(ele => ele.dataset && ele.dataset.type == 'params')
        if (!(richTextEditorMenu || editMenu || params)) {
          this.saveItem(item)
          document.removeEventListener('click', saveIt)
        }
      }
      document.addEventListener('click', saveIt)
    },
    saveItem(item) {
      let textEle = document.getElementById('textEditor-' + item.uid)
      if (!textEle) { return }
      item.body = textEle.innerHTML
      textEle.contentEditable = 'false'
      textEle.style['userSelect'] = 'none'
      if (this.selectedItem == item) { this.selectedItem = null }
      this.textEditorMenuPositon.display = 'none'
      this.process.pop()
    },
    loadImageSource(msg) {
      for (const key in msg.info) {
        switch (key) {
          case 'title':
          case 'url':
            if (!this.data[key]) {
              this.data[key] = msg.info[key]
            }
            break;
          case 'language':
            this.data[key] = msg.info[key]
            break
          default:
            break;
        }
      }
      if (!this.data.avatar) {
        chromeApi.getlocal('konjac_userinfo').then(res => {
          if (res) { this.data.avatar = res.username }
        })
      }
      if (!this.data.local_id) {
        this.data.local_id = uuidv4()
      }
      this.imageSource = this.imageSource.concat(msg.pages)
      let len = this.imageSource.length - this.data.body.length
      for (let index = 0; index < len; index++) {
        this.data.body.push({
          width: null,
          height: null,
          item: [],
        })
      }
      if (this.imageSource.length > this.totalSourceLength) {
        this.totalSourceLength = this.imageSource.length
      }
    },
    addSVGItem() {
      let svgEditor = document.getElementById('svgEditor-body')
      let box = svgEditor.getBBox()
      for (const key in box) {
        box[key] = box[key].toFixed(0) * 1
      }
      if (this.svgData.uid) {
        let item = this.data.body[this.svgData.page].item.find(ele => ele.uid == this.svgData.uid)
        item.body = svgEditor.innerHTML
        item.left = box.x + this.svgData.offset.x
        item.top = box.y + this.svgData.offset.y
        item.translate.x = box.x
        item.translate.y = box.y
        item.style.width = box.width + 'px'
        item.style.height = box.height + 'px'
        item.show = true
      } else {
        let item = {
          uid: uuidv4(),
          type: 'svg',
          show: true,
          body: svgEditor.innerHTML,
          left: box.x,
          top: box.y,
          translate: {
            x: box.x,
            y: box.y,
          },
          style: {
            width: box.width + 'px',
            height: box.height + 'px'
          }
        }
        this.data.body[this.svgData.page].item.push(item)
      }
      this.process = []
      this.svgData.status.show = false
    },
    reeditSVG(event, item) {
      let res = this.getOffsetToPage(event.target)
      this.dataReset('svgData')
      Object.assign(this.svgData.style, {
        left: res.page.offsetLeft + 'px',
        top: res.page.offsetTop + 'px',
        width: res.page.scrollWidth + 'px',
        height: res.page.scrollHeight + 'px',
      })
      this.svgData.page = res.page.dataset.index * 1
      this.svgData.uid = item.uid
      this.svgData.body = item.body
      this.svgData.offset = {
        x: item.left - item.translate.x,
        y: item.top - item.translate.y
      }
      item.show = false
      this.svgData.status.show = true
      this.selectedItem = null
      this.process.push('SVG - Editor')
    },
    createNewSvg(event, pageIndex) {
      let res = this.getOffsetToPage(event.target)
      this.dataReset('svgData')
      Object.assign(this.svgData.style, {
        left: res.page.offsetLeft + 'px',
        top: res.page.offsetTop + 'px',
        width: res.page.scrollWidth + 'px',
        height: res.page.scrollHeight + 'px',
      })
      this.svgData.page = pageIndex * 1
      this.svgData.status.show = true
      this.process.push('SVG - Editor')
    },

    async addClipItem() {
      try {
        let res
        if (this.customClip.shape == 'path') {
          res = await this.getImageByShapePath()
        } else {
          res = await this.getImageByShapeRect()
        }
        this.customClip.status.show = false
        if (this.customClip.uid) {
          let clip = this.data.body[this.customClip.page].item.find(ele => ele.uid == this.customClip.uid)
          Object.assign(clip, res)
          this.customClip.uid = ''
        } else {
          res.uid = uuidv4()
          res.show = true
          this.data.body[this.customClip.page].item.push(res)
        }
        this.process = []
      } catch (error) {
        console.error(error)
        this.$message.error(error)
      }
    },
    reeditClipShape(e, item) {
      let page = e.path.find(ele => ele.dataset && ele.dataset.type && ele.dataset.type == 'page')
      if (page) {
        this.dataReset('customClip')
        Object.assign(this.customClip.style, {
          left: page.offsetLeft + 'px',
          top: page.offsetTop + 'px',
          width: page.scrollWidth + 'px',
          height: page.scrollHeight + 'px',
        })
        item.top = item.position.y
        item.left = item.position.x
        this.customClip.uid = item.uid
        this.customClip.page = page.dataset.index * 1
        this.customClip.shape = item.shape
        switch (item.shape) {
          case 'path':
            this.customClip.status.onDraw = false
            this.customClip.points = tool.getPointFromPath(item.body)
            break;
          case 'rect':
            this.customClip.status.onDraw = false
            this.customClip.points.push({ x: item.position.x, y: item.position.y })
            this.customClip.points.push({ x: item.position.x + item.body.width, y: item.position.y + item.body.height })
            break
        }
        this.customClip.status.show = true
        this.selectedItem = null
        this.process.push('Clip')
      }
    },
    async getImageByShapeRect() {
      if (this.customClip.points.length != 2) { ; return Promise.reject('无法计算矩阵') }
      let imageObj = document.getElementById(`image-${this.customClip.page}`)
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d')
      let box = document.getElementById('customClipView-preview').getBBox()
      canvas.width = box.width
      canvas.height = box.height
      if (!canvas.width || !canvas.height) { ; return Promise.reject('长或宽不能为0') }
      ctx.translate(-box.x, -box.y)
      ctx.rect(box.x, box.y, box.width, box.height)
      ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
      ctx.restore();
      this.customClip.points = []
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          let src = URL.createObjectURL(blob);
          resolve({
            type: 'clip',
            shape: 'rect',
            src: src,
            top: box.y,
            left: box.x,
            position: { x: box.x, y: box.y, width: box.width, height: box.height },
            body: { width: box.width, height: box.height },
          })
        })
      })
    },
    async getImageByShapePath() {
      if (this.customClip.points.length < 3) { ; return Promise.reject('至少3点以上') }
      let box = document.getElementById('customClipView-preview').getBBox()
      let imageObj = document.getElementById(`image-${this.customClip.page}`)
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d')
      canvas.width = box.width
      canvas.height = box.height
      let path = ''
      ctx.translate(-box.x, -box.y)
      ctx.beginPath()
      this.customClip.points.forEach(ele => {
        switch (ele.type) {
          case 'M':
            path += `M${ele.x},${ele.y}`
            ctx.moveTo(ele.x, ele.y)
            break
          case 'L':
            path += `L${ele.x},${ele.y}`
            ctx.lineTo(ele.x, ele.y)
            break;
          case 'Q':
            path += `Q${ele.params.x1},${ele.params.y1},${ele.x},${ele.y}`
            ctx.quadraticCurveTo(ele.params.x1, ele.params.y1, ele.x, ele.y)
            break;
          case 'C':
            path += `C${ele.params.x1},${ele.params.y1},${ele.params.x2},${ele.params.y2},${ele.x},${ele.y}`
            ctx.bezierCurveTo(ele.params.x1, ele.params.y1, ele.params.x2, ele.params.y2, ele.x, ele.y)
            break;
        }
      })
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
      ctx.restore();
      this.customClip.points = []
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          let src = URL.createObjectURL(blob);
          resolve({
            type: 'clip',
            shape: 'path',
            src: src,
            top: box.y,
            left: box.x,
            position: { x: box.x, y: box.y, width: box.width, height: box.height },
            body: path,
          })
        })
      })
    },

    createNewClipRect(event, pageIndex) {
      let res = this.getOffsetToPage(event.target)
      this.dataReset('customClip')
      Object.assign(this.customClip.style, {
        left: res.page.offsetLeft + 'px',
        top: res.page.offsetTop + 'px',
        width: res.page.scrollWidth + 'px',
        height: res.page.scrollHeight + 'px',
      })
      this.process.push('Clip')
      this.customClip.shape = "rect"
      this.customClip.page = pageIndex * 1
      this.customClip.points.push({ x: res.offset.left + event.offsetX / this.zoom, y: res.offset.top + event.offsetY / this.zoom })
      this.customClip.status.onDraw = true
      this.customClip.status.show = true
      let mouseUp = (e) => {
        this.customClip.status.onDraw = false
        this.customClip.points.push({ x: e.offsetX / this.zoom, y: e.offsetY / this.zoom })
        window.removeEventListener('mouseup', mouseUp)
      }
      window.addEventListener('mouseup', mouseUp)
    },
    createNewClipPath(event, pageIndex) {
      let res = this.getOffsetToPage(event.target)
      this.dataReset('customClip')
      this.process.push('Clip')
      Object.assign(this.customClip.style, {
        left: res.page.offsetLeft + 'px',
        top: res.page.offsetTop + 'px',
        width: res.page.scrollWidth + 'px',
        height: res.page.scrollHeight + 'px',
      })
      this.customClip.shape = "path"
      this.customClip.page = pageIndex * 1
      this.customClip.status.onDraw = true
      this.process.push('Draw')
      this.customClip.points.push({ type: 'M', x: (res.offset.left + event.offsetX) / this.zoom, y: (res.offset.top + event.offsetY) / this.zoom })
      this.customClip.status.show = true
    },

    createNewText(event, pageIndex) {
      let res = this.getOffsetToPage(event.target)
      let item = {
        uid: uuidv4(),
        type: 'text',
        show: true,
        left: (res.offset.left + event.offsetX) / this.zoom,
        top: (res.offset.top + event.offsetY) / this.zoom,
        container: this.getTextStyle('container'),
        body: '',
        style: this.getTextStyle('style'),
        background: this.getTextStyle('background'),
        customStyle: this.selectedTextStyle.customStyle,
        customBackground: this.selectedTextStyle.customBackground,
        customContainer: this.selectedTextStyle.customContainer,
        quote: this.getQuoteItem()
      }
      this.data.body[pageIndex].item.push(item)
      this.$nextTick(() => {
        this.editTextItem(item, { page: pageIndex, index: this.data.body[pageIndex].item.length - 1 })
      })
    },
    deleteItem(pageIndex, itemIndex) {
      this.$confirm({
        title: '确认删除该项?',
        okText: '确定',
        cancelText: '取消',
        centered: true,
        width: 350,
        okType: 'danger',
        onOk: () => {
          if (this.data.body[pageIndex * 1].item[itemIndex] == this.selectedItem) {
            this.selectedItem = null
          }
          this.data.body[pageIndex * 1].item.splice(itemIndex, 1)
        },
        onCancel() { },
      });
    },

    //param


    setselectedItem(type, key) {
      if (!this.selectedItem) { return }
      switch (type) {
        case 'style': case 'background':
          switch (key) {
            case 'font-size': case '-webkit-text-stroke-width':
              this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key] + 'px')
              break
            case 'letter-spacing':
            case 'padding': case 'padding-right': case 'padding-top': case 'padding-left': case 'padding-bottom':
              if (this.selectedTextStyle[type][key] != '0') {
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'transform':
              if (this.cssParams.transformStyle == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformStyle] * 1 != 0) {
                this.$set(this.selectedItem[type], key, `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
              } else if (
                this.cssParams.transformStyle == 'rotate3d' && (this.selectedTextStyle[type][key]['rotate3d'].x * 1 || this.selectedTextStyle[type][key]['rotate3d'].y * 1 || this.selectedTextStyle[type][key]['rotate3d'].z * 1)) {
                this.$set(this.selectedItem[type], key,
                  `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `
                )
              } else {
                this.$delete(this.selectedItem[type], key)
              }
              break;

            case 'color': case '-webkit-text-stroke-color':
              if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                this.$set(this.selectedItem[type], key, tool.colors2rgba(this.selectedTextStyle[type][key]))
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'writing-mode': case 'text-align': case 'white-space': case 'word-break':
            case 'font-family': case 'font-weight': case 'line-height': case 'text-shadow':
              if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            default:
              break;
          }
          break;

        case 'container':
          switch (key) {
            case 'background-size': case 'background-position': case 'background-repeat':
              if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'background-color':
              if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                this.$set(this.selectedItem[type], key, tool.colors2rgba(this.selectedTextStyle[type][key]))
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'background-image':
              if (this.selectedTextStyle[type][key].value == 'none') {
                this.$delete(this.selectedItem[type], key)
                let indexQ = this.selectedItem.quote.findIndex(ele => ele.key.join(',') == 'background,background-image')
                if (!(indexQ < 0)) { this.$delete(this.selectedItem.quote, indexQ) }
                this.setData(['selectedTextStyle', 'background', 'background-size'], 'auto')
                this.setData(['selectedTextStyle', 'background', 'background-position'], '0% 0%')
                this.setData(['selectedTextStyle', 'background', 'background-repeat'], 'repeat')
              } else if (this.selectedTextStyle[type][key].value == 'quote') {
                this.$set(this.selectedItem[type], key, `url(${this.selectedTextStyle[type][key].src})`)
                // console.log('set after', this.selectedItem[type][key])
                let indexQ = this.selectedItem.quote.findIndex(ele => ele.key.join(',') == 'background,background-image')
                if (!(indexQ < 0)) {
                  this.$set(this.selectedItem.quote, indexQ, {
                    type: this.selectedTextStyle.background['background-image'].type,
                    uid: this.selectedTextStyle.background['background-image'].uid,
                    key: ['background', 'background-image']
                  })
                } else {
                  let quote = this.selectedItem.quote.concat(this.getQuoteItem())
                  this.$set(this.selectedItem, 'quote', quote)
                }
              } else if (this.selectedTextStyle[type][key].value == 'url') {
                this.$set(this.selectedItem[type], key, `url(${this.selectedTextStyle[type][key].src})`)
                let indexQ = this.selectedItem.quote.findIndex(ele => ele.key.join(',') == 'background,background-image')
                if (!(indexQ < 0)) { this.$delete(this.selectedItem.quote, indexQ) }
              }
              break;

            case 'border': case 'border-right': case 'border-top': case 'border-left': case 'border-bottom':
              if (this.selectedTextStyle[type][key].width) {
                this.$set(this.selectedItem[type], key, tool.getCss_border(this.selectedTextStyle[type][key]))
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'transform':
              if (this.cssParams.transformContainer == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformContainer] * 1 != 0) {
                this.$set(this.selectedItem[type], key, `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
              } else if (
                this.cssParams.transformContainer == 'rotate3d' && (this.selectedTextStyle[type][key]['rotate3d'].x * 1 || this.selectedTextStyle[type][key]['rotate3d'].y * 1 || this.selectedTextStyle[type][key]['rotate3d'].z * 1)) {
                this.$set(this.selectedItem[type], key, `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `)
              } else {
                this.$delete(this.selectedItem[type], key)
              }
              break;
            case 'border-radius': case 'border-top-left-radius': case 'border-top-right-radius': case 'border-bottom-right-radius': case 'border-bottom-left-radius':
              if (this.selectedTextStyle[type][key] != '0') {
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            case 'height': case 'width':
              this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key] + 'px')
              break;

            case 'overflow':
              if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
              } else { this.$delete(this.selectedItem[type], key) }
              break;
            default:
              break;
          }
          break;
        case 'customStyle': case 'customBackground': case 'customContainer':
          this.$set(this.selectedItem, type, this.selectedTextStyle[type])
          break;
      }
    },

    selectItem(item, index) {
      if (item.type == 'text') {
        let style = {
          'style': {},
          'container': {},
          'background': {},
          'customStyle': item.customStyle,
          'customBackground': item.customBackground,
          'customContainer': item.customContainer,
        }
        let array = ['style', 'container', 'background']
        array.forEach(type => {
          for (const key in default_konjac_css[type]) {
            switch (key) {
              case 'font-size': case '-webkit-text-stroke-width':
                if (item[type][key]) {
                  style[type][key] = parseInt(item[type][key])
                } else {
                  style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key]));
                }
                break;
              case 'letter-spacing': case 'padding': case 'padding-right': case 'padding-top': case 'padding-left': case 'padding-bottom':
                if (item[type][key]) {
                  style[type][key] = item[type][key]
                } else {
                  style[type][key] = default_konjac_css[type][key];
                }
                break
              case 'transform':
                style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key]));
                if (item[type][key]) {
                  let res = tool.getTransform(item[type][key])
                  switch (type) {
                    case 'style':
                      this.cssParams['transformStyle'] = res.type
                      break;
                    case 'container':
                      this.cssParams['transformContainer'] = res.type
                      break;
                    default:
                      break;
                  }
                  style[type][key][res.type] = res.value
                }
                break;
              case 'width': case 'height':
                style[type][key] = parseInt(item[type][key])
                break;
              case 'background-image':
                let urlReg = new RegExp(/url\(.*\)/)
                if (item[type][key] && urlReg.test(item[type][key])) {
                  let url = item[type][key].replace(/(^url\()|(\)$)/g, '')
                  let blobReg = new RegExp(/^blob:/)
                  if (blobReg.test(url)) {
                    let el = item.quote.find(ele => ele.key.join(',') == 'background,background-image')
                    if (el) {
                      style[type][key] = { value: 'quote', src: url, uid: el.uid, type: el.type }
                    } else {
                      style[type][key] = { value: 'quote', src: url, uid: '', type: '' }
                    }
                  } else {
                    style[type][key] = { value: 'url', src: url, uid: '', type: '' }
                  }
                } else {
                  style[type][key] = { value: 'none', src: '', uid: '', type: '' }
                }
                break;
              case 'color': case '-webkit-text-stroke-color': case 'background-color':
                if (item[type][key] && !tool.colorCheck(item[type][key], tool.colors2rgba(default_konjac_css[type][key]))) {
                  style[type][key] = tool.format2colors(item[type][key])
                } else { style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key])); delete item[type][key] }
                break;

              case 'writing-mode': case 'text-align': case 'white-space': case 'word-break': case 'overflow': case 'font-family': case 'font-weight':
              case 'background-position': case 'background-size': case 'background-repeat': case 'text-shadow': case 'line-height':
                if (item[type][key] && item[type][key] != default_konjac_css[type][key]) {
                  style[type][key] = item[type][key]
                } else { style[type][key] = default_konjac_css[type][key]; delete item[type][key] }
                break;

              case 'border': case 'border-right': case 'border-top': case 'border-left': case 'border-bottom':
                if (item[type][key]) {
                  style[type][key] = tool.getObj_border(item[type][key])
                } else {
                  style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key]));
                }
                break;
              case 'border-radius': case 'border-top-left-radius': case 'border-top-right-radius': case 'border-bottom-right-radius': case 'border-bottom-left-radius':
                if (item[type][key]) {
                  style[type][key] = item[type][key]
                } else {
                  style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key]));
                }
                break;
              default:
                break;
            }
          }
        })
        this.$set(this, 'selectedTextStyle', style)
      }
      this.$set(this, 'selectedItem', item)
      this.$set(this, 'selectIndex', index)
    },
    getTextStyle(type) {
      let style = {}
      switch (type) {
        case 'style': case 'background':
          for (const key in this.selectedTextStyle[type]) {
            switch (key) {
              case 'font-size': case '-webkit-text-stroke-width':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = this.selectedTextStyle[type][key] + 'px'
                }
                break
              case 'letter-spacing':
              case 'padding': case 'padding-right': case 'padding-top': case 'padding-left': case 'padding-bottom':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = this.selectedTextStyle[type][key]
                }
                break;
              case 'color': case '-webkit-text-stroke-color':
                if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  style[key] = tool.colors2rgba(this.selectedTextStyle[type][key])
                }
                break;

              case 'writing-mode': case 'text-align': case 'white-space': case 'word-break': case 'font-family': case 'font-weight':
              case 'text-shadow': case 'line-height':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = this.selectedTextStyle[type][key]
                }
                break;
              case 'transform':
                if (this.cssParams.transformStyle == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformStyle]) {
                  style[key] = `rotate(${this.selectedTextStyle[type][key]}deg) `
                } else if (this.cssParams.transformStyle == 'rotate3d' &&
                  this.cssParams.transformStyle == 'rotate3d' && this.selectedTextStyle[type][key]['rotate3d'].x && this.selectedTextStyle[type][key]['rotate3d'].y && this.selectedTextStyle[type][key]['rotate3d'].z
                ) {
                  style[key] = `rotate3d(${this.selectedTextStyle[type][key].x},${this.selectedTextStyle[type][key].y},${this.selectedTextStyle[type][key].z},${this.selectedTextStyle[type][key].a}deg) `
                }
                break;
              default:
                break;
            }
          }
          break;
        case 'container':
          for (const key in this.selectedTextStyle[type]) {
            switch (key) {
              case 'background-position': case 'background-size': case 'background-repeat':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = this.selectedTextStyle[type][key]
                }
                break;
              case 'height': case 'width':
                style[key] = this.selectedTextStyle[type][key] + 'px'
                break;
              case 'border': case 'border-right': case 'border-top': case 'border-left': case 'border-bottom':
                if (this.selectedTextStyle[type][key].width) {
                  style[key] = tool.getCss_border(this.selectedTextStyle[type][key])
                }
                break;
              case 'background-image':
                if (this.selectedTextStyle[type][key].value != 'none') {
                  style[key] = `url(${this.selectedTextStyle[type][key].src})`
                }
                break
              case 'background-color':
                if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  style[key] = tool.colors2rgba(this.selectedTextStyle[type][key])
                }
                break;
              case 'transform':
                if (this.cssParams.transformContainer == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformContainer]) {
                  style[key] = `rotate(${this.selectedTextStyle[type][key]}deg) `
                } else if (this.cssParams.transformContainer == 'rotate3d' &&
                  this.cssParams.transformContainer == 'rotate3d' && this.selectedTextStyle[type][key]['rotate3d'].x && this.selectedTextStyle[type][key]['rotate3d'].y && this.selectedTextStyle[type][key]['rotate3d'].z
                ) {
                  style[key] = `rotate3d(${this.selectedTextStyle[type][key].x},${this.selectedTextStyle[type][key].y},${this.selectedTextStyle[type][key].z},${this.selectedTextStyle[type][key].a}deg) `
                }
                break;
              case 'border-radius':
              case 'border-top-left-radius':
              case 'border-top-right-radius':
              case 'border-bottom-right-radius':
              case 'border-bottom-left-radius':
                if (this.selectedTextStyle[type][key] != '0') { style[key] = this.selectedTextStyle[type][key] }
                break;
              case 'overflow':
                if (this.selectedTextStyle[type][key] != 'visible') {
                  style[key] = this.selectedTextStyle[type][key]
                }
                break;
              default:
                break;
            }
          }
          break
      }
      return style
    },
    getQuoteItem() {
      let quote = []
      if (this.selectedTextStyle.container['background-image'].value == 'quote') {
        quote.push({
          type: this.selectedTextStyle.container['background-image'].type,
          uid: this.selectedTextStyle.container['background-image'].uid,
          key: ['container', 'background-image']
        })
      }
      return quote
    },
    //缩放元素
    resizeTextDom(item, xy) {
      if (this.basetool) { return }
      document.onmousemove = (e) => {
        if (xy[0] == -1) { item.left += e.movementX / this.zoom }
        if (xy[1] == -1) { item.top += e.movementY / this.zoom }
        item.container.width = `${Math.abs(parseInt(item.container.width) + e.movementX / this.zoom * xy[0])}px`;
        item.container.height = `${Math.abs(parseInt(item.container.height) + e.movementY / this.zoom * xy[1])}px`;
        this.selectedTextStyle.container.width = parseInt(item.container.width)
        this.selectedTextStyle.container.height = parseInt(item.container.height)
      };
      document.onmouseup = (e) => { document.onmousemove = null; document.onmouseup = null; };
    },
    //移动元素
    moveDom(e, item) {
      if (this.basetool) { return }
      if (item.type == 'text' && document.getElementById(`textEditor-${item.uid}`).contentEditable == 'true') { return }
      document.onmousemove = (e) => {
        item.top += (e.movementY / this.zoom).toFixed(0) * 1;
        item.left += (e.movementX / this.zoom).toFixed(0) * 1;
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    scrollInto(pageindex) {
      document.getElementById(`page-${pageindex}`).scrollIntoView({ behavior: 'smooth' });
    },
    async imageOnload(pageindex) {
      let image = document.getElementById(`image-${pageindex}`)
      this.imageSource[pageindex].width = image.width
      this.imageSource[pageindex].height = image.height
      if (!this.data.body[pageindex].width || !this.data.body[pageindex].height) {
        this.data.body[pageindex].width = image.width
        this.data.body[pageindex].height = image.height
      }
      this.imageSource[pageindex].status = 1
      this.$forceUpdate()
      let clip = this.data.body[pageindex].item.filter(ele => ele.type == 'clip')
      for (let index = 0; index < clip.length; index++) {
        this.clipRefresh(image, clip[index])
      }
    },
    async clipRefresh(image, clip) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d')
      canvas.width = clip.position.width
      canvas.height = clip.position.height
      ctx.translate(-clip.position.x, -clip.position.y)
      switch (clip.shape) {
        case 'rect':
          ctx.rect(clip.position.x, clip.position.y, clip.body.width, clip.body.height)
          break;
        case 'path':
          let path = tool.getPointFromPath(clip.body)
          ctx.beginPath()
          path.forEach(ele => {
            switch (ele.type) {
              case 'M':
                path += `M${ele.x},${ele.y}`
                ctx.moveTo(ele.x, ele.y)
                break
              case 'L':
                path += `L${ele.x},${ele.y}`
                ctx.lineTo(ele.x, ele.y)
                break;
              case 'Q':
                path += `Q${ele.params.x1},${ele.params.y1},${ele.x},${ele.y}`
                ctx.quadraticCurveTo(ele.params.x1, ele.params.y1, ele.x, ele.y)
                break;
              case 'C':
                path += `C${ele.params.x1},${ele.params.y1},${ele.params.x2},${ele.params.y2},${ele.x},${ele.y}`
                ctx.bezierCurveTo(ele.params.x1, ele.params.y1, ele.params.x2, ele.params.y2, ele.x, ele.y)
                break;
            }
          })
          ctx.closePath()
          ctx.clip()
          break
      }
      ctx.drawImage(image, 0, 0, image.width, image.height);
      ctx.restore();
      canvas.toBlob((blob) => {
        let src = window.URL.createObjectURL(blob);
        clip.src = src
        this.quoteRefresh(clip)
      })
    },
    validateInfo() {
      let ok = true
      let arr = [{ key: 'title', min: 6, max: 64 }, { key: 'avatar', max: 36 }, { key: 'message', max: 240 }]
      arr.forEach(ele => {
        let len = bytes(this.data[ele.key]).length
        if (len > ele.max) {
          let str = String(this.data[ele.key])
          for (let index = 0; index < len; index++) {
            str = str.replace(/.$/, '')
            if (!(bytes(str).length > ele.max)) { break }
          }
          this.data[ele.key] = str
        }
        if (ele.min && len < ele.min) {
          ok = false
        } 
      })
      return ok
    },
    quoteRefresh(clip) {
      this.data.body.forEach(ele => {
        ele.item.forEach(item => {
          if (item.quote && item.quote.length) {
            item.quote.forEach(quote => {
              if (quote.uid == clip.uid && quote.type == 'clip') {
                item["container"]["background-image"] = `url(${clip.src})`
              }
            })
          }
        })
      })
    },
    imageOnError(pageindex) {
      this.imageSource[pageindex].status = 2
      this.$forceUpdate()
    }
  }
}

</script>

<style lang='less'>
#main_app {
  color: #2c3e50;
  background-color: #444;
  // margin-top: -20px;
  height: 100%;
  #layout-header {
    height: 45px;
    background-color: #2f2f2f;
    //  background-color: rgb(0, 21, 41) ;
    color: #ccc;
    display: flex;
    justify-content: flex-start;
    line-height: 45px;
    user-select: none;
    .konjac_menu {
      width: 100px;
      cursor: pointer;
      z-index: 9999;
      ul {
        width: auto;
        display: none;
        list-style-type: none;
        padding: 0;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
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
    .konjac_menu:hover {
      background-color: #fff;
      color: #444;
      ul {
        display: block;
      }
    }
  }
  #layout-workspace {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 45px);
    .workspace-sider-left {
      min-width: 200px;
      max-width: 200px;
      height: 100%;
      background-color: #2f2f2f;
      border-top: 1px solid #444;
      overflow: auto;
      .thumbnail-sider-left {
        height: 40px;
        width: 100%;
        color: #ccc;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #444;
        user-select: none;
        .thumbnail-page-index {
          min-height: 40px;
          max-height: 40px;
          min-width: 40px;
          max-width: 40px;
          border-right: 1px solid #444;
          font-size: 24px;
          line-height: 40px;
        }
        > div {
          padding: 3px;
        }
        .dropdown-left {
          width: 30px;
          line-height: 40px;
        }
      }
      .thumbnail-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding-left: 10px;
        height: 30px;
        color: #ccc;
        > div {
          user-select: none;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          border-bottom: 1px solid #444;
        }
        > div:nth-child(1) {
          width: 30px;
          font-size: 15px;
          border-left: 1px solid #444;
          border-right: 1px solid #444;
        }
        > div:nth-child(2) {
          padding-left: 10px;
          padding-right: 10px;
          width: 130px;
          text-align: left;
          cursor: pointer;
        }
        > div:nth-child(3) {
          width: 30px;
        }
      }
      .thumbnail-item:last-child {
        border-bottom: 1px solid #444;
        > div {
          border-bottom: none;
        }
      }
      .thumbnail-item-selected {
        background-color: #4f80ff;
      }
    }
    #workspace-content {
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
      width: 100%;
      max-width: calc(100% - 470px);
      #workspace-footer {
        user-select: none;
        width: 100%;
        position: absolute;
        bottom: 0px;
        height: 30px;
        background-color: #2f2f2f;
        display: flex;
        justify-content: space-between;
        line-height: 30px;
      }
    }
    #workspace-sider-right {
      min-width: 265px;
      max-width: 265px;
      background-color: #2f2f2f;
      display: flex;
      flex-direction: row;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #444;
      #workspace-basetool {
        min-width: 50px;
        max-width: 50px;
        border-right: 1px solid #444;
        .basetool-item {
          line-height: 50px;
          width: 50px;
          height: 50px;
          font-size: 25px;
          color: #ddd;
          cursor: pointer;
          border-bottom: 1px solid #444;
        }
        .basetool-item-seleted {
          color: #0cf;
        }
      }
      .param-container {
        padding: 10px;
        color: #fff;
        text-align: left;
        > div {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
      }
    }
  }
}
.param-item {
  background-color: #444;
  margin-right: 10px;
  margin-top: 10px;
  height: auto;
  width: 85px;
  border-radius: 3px;
  // overflow: hidden;
  position: relative;
  > div:nth-child(1) {
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    padding-left: 5px;
    color: #ccc;
  }
  button {
    background-color: #444;
    color: #ccc;
    border: 1px solid #ccc;
    margin-left: 5px;
    width: calc((100% - 10px) / 3);
    cursor: pointer;
  }
}
.param-item-full {
  width: 180px;
}
.param-select {
  cursor: pointer;
}

#workspace-param {
  width: 100%;
  .param-tab-options {
    width: 100%;
    color: #ccc;
    font-size: 14px;
    height: 36px;
    user-select: none;
    display: flex;
    flex-direction: row;
    padding: 0px 10px 0px 10px;
    justify-content: space-between;
    border-bottom: 1px solid #444;
    > div {
      cursor: pointer;
      width: 100%;
      line-height: 36px;
    }
    .param-tab-option-selected {
      border-bottom: 2px solid #4f80ff;
    }
  }
}

#workspace {
  width: 100%;
  margin-bottom: 30px;
  padding: 10px;
  overflow: auto;
  // overflow: visible;
  position: relative;
  display: flex;
  flex-direction: column;
  .workspace-item {
    position: relative;
    display: inline-block;
    // display: block;
    user-select: none;
    width: auto;
    height: auto;
    margin: 10px auto;
  }
  div.workspace-page {
    position: relative;
    display: inline-block;
    user-select: none;
    width: auto;
    height: auto;
    > div {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 600;
      width: 100%;
      height: 100%;
    }
    img.workspace-img {
      z-index: 500;
      background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.0980392) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.0980392) 75%,
          rgba(0, 0, 0, 0.0980392) 0
        ),
        linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.0980392) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.0980392) 75%,
          rgba(0, 0, 0, 0.0980392) 0
        ),
        white;
      background-repeat: repeat, repeat;
      background-position: 0px 0, 20px 20px;
      background-size: 40px 40px, 40px 40px;
    }
  }
  .body-item {
    position: absolute;
    width: auto;
    height: auto;
    color: #000;
    > div {
      position: relative;
    }
  }
  .konjac_item_container {
    position: relative;
    background-color: transparent;
    > div {
      width: 100%;
      height: 100%;
    }
  }
  .konjac_item_container_resize {
    position: absolute;
    padding: 4px;
    width: 8px;
    height: 8px;
    z-index: 999;
    background-color: #4f80ff;
    opacity: 0;
  }
  .konjac_item_line {
    z-index: 998;
    opacity: 0;
    position: absolute;
    background-color: #4f80ff;
  }
  .body-item:hover {
    .konjac_item_container_resize {
      opacity: 1;
    }
    .konjac_item_line {
      opacity: 1;
    }
  }

  .konjac_item_selected {
    opacity: 1;
  }
  .konjac_item_move {
    cursor: move;
  }
}

.scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}
.scrollbar::-webkit-scrollbar-track {
  border-left: 1px solid #444;
  background-color: #444;
}
.scrollbar2::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}
.scrollbar2::-webkit-scrollbar-thumb {
  background-color: #2f2f2f;
  border-radius: 10px;
  border: 1px solid #444;
}
.scrollbar2::-webkit-scrollbar-track {
  border-left: 1px solid #444;
  // border-right: 1px solid #2f2f2f;
  background-color: #444;
}
.tooltip-color-picker {
  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
  .ant-tooltip-inner {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    color: #000;
  }
}
.transparent-square {
  z-index: 0;
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #fff;
  background-image: linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%
    ),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
  background-repeat: repeat;
}
.dropdown-item {
  background-color: #444;
}
.item_editor {
  outline: none;
}
.default_konjac_css_style {
  font-size: 18px;
  padding: 5px;
  color: rgba(0, 0, 0, 1);
  writing-mode: horizontal-tb;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  text-align: left;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: normal;
  white-space: normal;
  word-break: break-all;
  // transform: rotate(90deg) rotate3d(45, 45, 45, "deg");
}

.default_konjac_css_container {
  overflow: visible;
}
.default_konjac_css_background {
  -webkit-text-stroke-color: rgba(255, 255, 255, 1);
  -webkit-text-stroke-width: 4px;
  background-color: rgba(255, 255, 255, 0);
}

#customClipView {
  position: absolute;
  z-index: 999;
  user-select: none;
  .svg-point {
    cursor: move;
  }
  .svg-line {
    cursor: pointer;
  }
}
.param-button {
  width: 100%;
  background-color: #2f2f2f;
  cursor: pointer;
  outline: none;
  border: 1px solid #444;
  height: 35px;
  margin-bottom: 10px;
}
.param-button:hover {
  background-color: #444;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
