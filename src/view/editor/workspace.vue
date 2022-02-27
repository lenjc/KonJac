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
          <li @click="downloadLabelPlus">LabelPlus</li>
        </ul>
      </div>
      <div class="konjac_menu">
        导入
        <ul>
          <li @click="$refs.fileText.click()">LabelPlus</li>
        </ul>
      </div>
      <div class="konjac_menu" @click="$refs.baseinfo.showModal()">
        基本信息
      </div>
      <div class="konjac_menu" @click="saveBody">
        保存
        <a-icon type="loading" v-show="saved" />
      </div>
      <div class="konjac_menu" @click="$refs.setting.showModal()">
        设置
      </div>
      <input type="file" accept=".txt" id="fileText" ref='fileText' style="display:none" @input="labelPlus" />
    </div>
    <div id="layout-workspace">
      <div class="workspace-sider-left  scrollbar2">
        <input type="file" ref='file' style="display:none" @change="loadFile" />
        <div v-for="(thumbnailPage,pageindex) in totalSourceLength" :key="'thumbnailPage-'+pageindex">
          <div class="thumbnail-sider-left ">
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
              <div style='height:20px;line-height:20px' v-show="imageSource[pageindex] && data.body[pageindex] && 
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
              <div v-for="(item,itemIndex) in data.body[pageindex].item" :key="'item--'+itemIndex" data-type='item'
                class="thumbnail-item rightmouse" :data-page="pageindex" :data-index="itemIndex"
                :class="{'thumbnail-item-selected':(selectedItem==item),'thumbnail-item-selected2':selectedList.includes(item)}">
                <div style="cursor: pointer;position: relative;" title="显示">
                  <a-icon type="font-size" v-if="item.type=='text'" />
                  <a-icon type="picture" v-if="item.type=='clip'" />
                  <a-icon type="picture" v-if="item.type=='svg'" />
                </div>
                <div
                  @click="scrollInto(pageindex);if(basetool){lostBasetool()};selectItem(item,{page:pageindex,index:itemIndex},$event)">
                  <span v-if="item.type=='text'">{{item | bodyFilter}}</span>
                  <span v-if="item.type=='clip'">Clip-{{item.id}}</span>
                  <span v-if="item.type=='svg'"> SVG-{{item.id}}</span>
                </div>
                <div style="position: relative;">
                  <a-icon type="copy" v-show="copyItem == item" />
                  <a-icon type="eye" v-show="item.show" @click="item.show=!item.show" />
                  <a-icon type="eye-invisible" v-show="!item.show" @click="item.show=!item.show" />
                  <a-icon type="lock" v-show="item.lock" @click="item.lock=false" />
                </div>
              </div>
            </transition-group>
          </vuedraggable>
        </div>
      </div>
      <div id="workspace-content">
        <div id="msg"></div>
        <richTextEditorMenu :textEditorMenuPositon="textEditorMenuPositon" />
        <div id="workspace" class="scrollbar" :style="{zoom:zoom}">
          <customClipView v-if="customClip.status.show" :customClip="customClip" @paramChange="setData"
            @addClipItem="addClipItem" :zoom="zoom" :process="process" />
          <svgEditorView ref="svgEditorView" v-if="svgData.status.show" :svgData="svgData" @paramChange="setData"
            @addSVGItem="addSVGItem" :zoom="zoom" :process="process" />
          <div style="margin:auto"
            :class="{'pageMode':setting.viewMode=='page','scrollMode':setting.viewMode=='scroll'}">
            <div v-for="(page,pageIndex) in totalSourceLength" :key="'page-'+pageIndex" class="workspace-item"
              :style="{'cursor':cursor?cursor:'auto'}" :data-page="pageIndex" :data-index="pageIndex" data-type="page"
              :id="`page-${pageIndex}`" @click="pageClickWatch($event,pageIndex)"
              @mouseenter="mousePositon.page=pageIndex,mousePositon.on=true" @mouseleave="mousePositon.on=false"
              @mousemove="mousePositon.event=$event" @mousedown="pageMouseDownWatch($event,pageIndex)"
              v-show="showPage[pageIndex]">
              <div class="workspace-page" data-type="container">
                <img v-if="!imageSource[pageIndex]" class="workspace-img" :id="`image-${pageIndex}`"
                  :style="`width:${data.body[pageIndex].width}px;height:${data.body[pageIndex].height}px;z-index:0`"
                  draggable="false" />
                <img v-if="imageSource[pageIndex]" class="workspace-img" :src="imageSource[pageIndex].src"
                  :id="`image-${pageIndex}`"
                  :style="`width:${imageSource[pageIndex].width}px;height:${imageSource[pageIndex].height}px;z-index:0`"
                  draggable="false" @error="imageOnError(pageIndex)" @load="imageOnload(pageIndex)">
                <div>
                  <div v-for="(item,index) in data.body[pageIndex].item" :key="'item-'+index" data-type='item'
                    :data-page="pageIndex" :data-index="index" :id="'item-'+item.id"
                    :style="`left:${item.left}px;top:${item.top}px;z-index:${index+1}`" class="body-item rightmouse"
                    :class="{'item-unlock':!item.lock,'zindexMax':selectedItem==item}" v-show="item.show">

                    <div v-if="item.type=='text'">
                      <div class="konjac_item_container_resize"
                        v-for="(xy,xyindex) in [[-1,-1,'nw-resize'],[0,-1,'n-resize'],[-1,1,'sw-resize'],[-1,0,'w-resize'],[1,0,'e-resize'],[1,-1,'ne-resize'],[0,1,'s-resize'],[1,1,'se-resize']]"
                        :key="'konjac_item_container_resize-'+xyindex" :style="xy | resizePoint" data-type="params"
                        :class="{'konjac_item_selected':(selectedItem==item)}"
                        @mousedown.self="resizeTextDom($event,item,xy)">
                      </div>
                      <div class="konjac_item_line"
                        v-for="(tb,tbindex) in ['width:calc(100% + 8px);height:1px;top:-4px;left:-4px', 'width: calc(100% + 8px);height: 1px;bottom:-4px;left:-4px'
                  , 'width: 1px;height: calc(100% + 8px);top:-4px;left:-4px' , 'width: 1px;height: calc(100% + 8px);top:-4px;right:-4px' ]"
                        :style="tb" :key="'konjac_item_line-'+tbindex"
                        :class="{'konjac_item_selected':(selectedItem==item || selectedList.includes(item))}"></div>

                      <div class="konjac_item_container default_konjac_css_container"
                        :style="Object.assign({},item.container,tool.jsonParse(item.customContainer),{'user-select': 'none'})"
                        :class="{'konjac_item_move':(basetool=='move')}"
                        @mousedown.capture="moveDom($event,item,{page:pageIndex,index:index})">
                        <div :id="`textItem-${item.id}`" v-show="focusItem!=item.id"
                          :style="Object.assign({'position': 'absolute','top':'0','left':'0','user-select': 'none'},item.style,item.background,tool.jsonParse(item.customBackground))"
                          v-html="item.body" class="default_konjac_css_style default_konjac_css_background">
                        </div>
                        <div
                          :style="Object.assign({'position': 'absolute','user-select':'text','top':'0','left':'0','user-select': 'none'},item.style,tool.jsonParse(item.customStyle)) "
                          :id="'textEditor-'+item.id" v-html="item.body" contenteditable="false" data-type="editor"
                          draggable="false" class="default_konjac_css_style item_editor" @focus="focusItem=item.id"
                          @blur.stop="saveTextItem($event,item)"
                          @dblclick.capture="editTextItem(item,{page:pageIndex,index:index},$event)">
                        </div>
                      </div>
                    </div>

                    <div v-if="item.type=='clip'">
                      <div class="konjac_item_line" v-for="(tb,tbindex) in ['width:100%;height:1px;top:0;left:0px', 'width: 100%;height: 1px;bottom:0;left:0px'
                  , 'width: 1px;height: 100%;top:0;left:0px' , 'width: 1px;height: 100%;top:0;right:0px' ]" :style="tb"
                        :key="'konjac_item_line-'+tbindex" :class="{'konjac_item_selected':(selectedItem==item)}"></div>
                      <img :src="item.src" draggable="false" @dblclick.stop="reeditClipShape($event,item)"
                        @mousedown="moveDom($event,item,{page:pageIndex,index:index})" />
                    </div>

                    <div v-if="item.type=='svg'">
                      <div class="konjac_item_line" v-for="(tb,tbindex) in ['width:100%;height:1px;top:0;left:0px', 'width: 100%;height: 1px;bottom:0;left:0px'
                  , 'width: 1px;height: 100%;top:0;left:0px' , 'width: 1px;height: 100%;top:0;right:0px' ]" :style="tb"
                        :key="'konjac_item_line-'+tbindex" :class="{'konjac_item_selected':(selectedItem==item)}"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" :style="Object.assign({},item.style)"
                        :viewBox="item.attributes?item.attributes.viewBox:''">
                        <g v-html="item.body" :transform="`translate(${-item.translate.x},${-item.translate.y})`"
                          @dblclick="reeditSVG($event,item)"
                          @mousedown="moveDom($event,item,{page:pageIndex,index:index})">
                        </g>
                      </svg>
                    </div>

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
          <div v-show="setting.viewMode=='page'" class="pagination">
            <div style="cursor: pointer;margin-right:5px"
              @click="pagination( currentPage + 1  - 1 * setting.viewPage )">
              <a-icon type="arrow-left" />
            </div>
            <a-input-number size="small"
              style="width:60px;text-align:center;background:transparent;color:#fff;border:none !important;outline:none !important;box-shadow:none "
              v-model="currentPage" :formatter="value => value*1+1" :parser="value => value*1-1" :min="0"
              :max="totalSourceLength-1" :step="setting.viewPage" @change="pagination($event+1)">
            </a-input-number>
            <span style="font-size:16px">/ {{totalSourceLength}}</span>

            <div style="cursor: pointer;margin-left:5px" @click="pagination( currentPage + 1  + 1 * setting.viewPage )">
              <a-icon type="arrow-right" />
            </div>

          </div>
          <div style="margin-right:20px;display:flex;flex-direction:row">
            显示比例: <a-input-number
              style="width:80px;text-align:center;background:transparent;color:#fff;border:none !important;outline:none !important;box-shadow:none "
              size="small" v-model="zoom" :formatter="value => value*100 +'%'" :precision="2"
              :parser="value => (parseInt(value)/100).toFixed(2)" :min="0.1" :max="10" :step="0.05"
              @change="$forceUpdate()">
            </a-input-number>
            <div title="适应高度" style="margin:0 10px;cursor: pointer;" @click="fitHeight">
              <a-icon type="column-height" />
            </div>
            <div title="原始比例" style="cursor: pointer;" @click="zoom=1">
              <a-icon type="fullscreen" />
            </div>
          </div>
        </div>
      </div>
      <div id="workspace-sider-right" class="scrollbar2">
        <div id="workspace-basetool">
          <div class="basetool-item" @click="selectTool('text')" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='text')}">
            <a-icon type="font-size" />
          </div>
          <div class="basetool-item" @click="selectTool('clip-rect')" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='clip-rect')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiancai" />
            </svg>
          </div>
          <div class="basetool-item" @click="selectTool('clip-path')" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='clip-path')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiancai1" />
            </svg>
          </div>
          <div class="basetool-item" @click="selectTool('svg')" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='svg')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pen" />
            </svg>
          </div>

          <div class="basetool-item" @click="selectTool('snippets')" data-type="basetool"
            :class="{'basetool-item-seleted':(basetool=='snippets')}">
            <a-icon type="snippets" />
          </div>

        </div>
        <div id="workspace-param">
          <tabsText v-if="basetool=='text' || (selectedItem && selectedItem.type=='text')" :cssParams="cssParams"
            :selectedItem="selectedItem" :selectedTextStyle="selectedTextStyle" @paramChange="setData"
            :dataSource="data.body" :presetStyle="presetStyle" @setPresetStyle="setPresetStyle"
            :currentStyle="currentPresetStyle" @triggetMethod="triggetMethod" />
          <drawClipShapeMenu v-if="customClip.status.show" @paramChange="setData" :customClip="customClip"
            @addClipItem="addClipItem" :process="process" />
          <clipItemMenu v-if="selectedItem && selectedItem.type=='clip'" :selectedItem="selectedItem"
            @paramChange="setData" @reeditClipShape="reeditClipShape" />
          <svgDrawMenu v-if="svgData.status.show" :svgData="svgData" @paramChange="setData"
            @triggetMethod="triggetMethod" />
          <svgItemMenu v-if="selectedItem && selectedItem.type=='svg'" :selectedItem="selectedItem"
            @paramChange="setData" />
          <tips v-if="basetool" :basetool="basetool" />
          <snippets v-if="basetool=='snippets'" :snippets="snippets" :seleted="snippetsSeleted"
            @paramChange="setData" />
          <baseinfo ref="baseinfo" :data="data" @paramChange="setData" />
        </div>
      </div>
    </div>

    <a-modal :visible="visible.presetStyleTitle" title="样式名称" width="300px" okText="确定" cancelText="取消"
      @cancel="visible.presetStyleTitle=false" @ok="createPresetStyle">
      <a-input v-model="title.presetStyleTitle" placeholder="请输入"></a-input>
    </a-modal>

    <a-modal :visible="visible.snippets" title="预设文本名称" width="300px" okText="确定" cancelText="取消" data-type='params'
      @cancel="visible.snippets=false" @ok="savesnippets">
      <a-input v-model="title.snippets" placeholder="请输入"></a-input>
    </a-modal>

    <editITem ref='editITem' @paramChange="setData" />
    <setting ref='setting' :setting="setting" @triggetMethod="triggetMethod" />
    <div id="contextmenu" :style="menuPosition">
      <ul>
        <li @click="setItemIndex('top')" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="vertical-align-top" />置于顶层
        </li>
        <li @click="setItemIndex('up')" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="up" />提升层级
        </li>
        <li @click="setItemIndex('down')" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="down" />降低层级
        </li>
        <li @click="setItemIndex('bottom')" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="vertical-align-bottom" />置于底层
        </li>
        <li @click="copyItem = selectedItem" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="copy" />复制元素
        </li>
        <li @click="lockElement(selectIndex.page,selectIndex.index)"
          v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="lock" v-show="selectedItem && !selectedItem.lock" />
          <a-icon type="unlock" v-show="selectedItem && selectedItem.lock" />
          {{selectedItem?selectedItem.lock?'解锁元素':'锁定元素':''}}
        </li>
        <li @click="showHidden(selectIndex.page,selectIndex.index)" v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="eye" v-show="selectedItem && !selectedItem.show" />
          <a-icon type="eye-invisible" v-show="selectedItem && selectedItem.show" />
          {{selectedItem?selectedItem.show?'隐藏元素':'显示元素':''}}
        </li>
        <li @click="deleteItem(selectIndex.page,selectIndex.index)" style="color:#ff0000"
          v-show="selectedItem && menuPosition.type =='item'">
          <a-icon type="delete" />删除元素
        </li>
        <li style="color:#ff0000" @click="deletesnippets" v-show="menuPosition.type =='snippets'">
          <a-icon type="delete" />删除文本
        </li>
      </ul>
    </div>
    <labelPlus ref='labelPlus' :default_konjac_css="default_konjac_css" :imageSource="imageSource"
      :totalSourceLength="totalSourceLength" @loadLabelPlus="loadLabelPlus" />
    <div id="cleanArea" style="display:none"></div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import tool from '../../module/tool'
import richTextEditorMenu from './components/richTextEditorMenu.vue'
import tabsText from './components/tabsText.vue'
import bytes from 'utf8-bytes'
import labelPlus from './components/labelPlus.vue'

import customClipView from './clip/customClipView.vue'
import drawClipShapeMenu from './clip/drawClipShapeMenu.vue'
import clipItemMenu from './clip/clipItemMenu.vue'

import svgEditorView from './svg/svgEditorView.vue'
import svgDrawMenu from './svg/svgDrawMenu.vue'
import svgItemMenu from './svg/svgItemMenu.vue'
import tips from './components/basetoolTip.vue'
import baseinfo from './components/baseinfo.vue'
import editITem from './components/editITem.vue'
import setting from './components/setting.vue'
import snippets from './components/snippets.vue'
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
    'font-style': 'normal',
    'transform': {
      'rotate': 0,
      'rotate3d': { x: 0, y: 0, z: 0, a: 0 }
    },
    'font-stretch': 'normal',
    'padding': '5px',
    'padding-top': '5px',
    'padding-bottom': '5px',
    'padding-left': '5px',
    'padding-right': '5px',
    'font-weight': '400',
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
    'background-image': { value: 'none', url: '', id: '', type: '' },
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



const default_data = {
  customClip: {
    id: '',
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
    id: '',
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
      fill: { rgba: { r: 255, g: 255, b: 255, a: 1 } },
      'stroke': { rgba: { r: 255, g: 255, b: 255, a: 1 } },
      'stroke-width': 0,
    },
    newNode: null,
    currentNode: null,
    preLine: null,
    currentLine: null,
    currentLineIndex: null,
    addNewPoint:'',
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
    richTextEditorMenu,
    tabsText,
    customClipView,
    drawClipShapeMenu,
    clipItemMenu,
    svgEditorView,
    svgDrawMenu,
    svgItemMenu,
    vuedraggable,
    tips,
    baseinfo,
    editITem,
    setting,
    snippets,
    labelPlus,

  },
  data() {
    this.tool = tool
    this.default_konjac_css = default_konjac_css
    return {
      snippets: [],
      snippetsSeleted: '',
      cursor: '',
      focusItem: '',
      mousePositon: {

      },
      setting: { autoSave: true, viewMode: 'page', viewPage: 1, viewIndex: 1 },
      saved: false,
      visible: {
        presetStyleTitle: false,
        snippets: false,
      },
      title: {
        presetStyleTitle: '',
        snippets: '',
      },
      menuPosition: {
        display: 'none',
        left: '0px',
        top: '0px'
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
      selectedPresetStyle: '',
      currentPresetStyle: '',
      imageSource: [],
      totalSourceLength: 0,
      showPage: {},
      basetool: '',
      zoom: 1,
      filePage: 0,
      currentPage: 0,
      customClip: {},
      presetStyle: [],
      autosave: null,
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
      selectedList: []
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
    document.oncontextmenu = (e) => { this.cleanSelection(e); return false; }
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
    this.getSetting()
    this.getSnippets()
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
      if (val != old && old && old.type == 'text') {
        this.saveItem(old)
      }
      if (val && val.type == 'text' && old && old.type == 'text') {
        this.currentPresetStyle = ''
      }
      if (old && !val) {
        this.selectedList = []
      }
    },
    data: {
      handler(val, old) { document.title = 'KonJac - ' + val.title },
      deep: true,
    },
    setting: {
      handler(val, old) {
        chromeApi.savelocal({ 'editor-config': val })
      },
      deep: true,
    },
  },
  methods: {
    async getSnippets() {
      let res = await chromeApi.getlocal('snippets')
      this.snippets = res ? JSON.parse(res) : []
    },
    savesnippets() {
      if (!this.title.snippets) { this.$message.info('请输入预设文本名称'); return }
      let item = this.data.body[this.selectIndex.page].item[this.selectIndex.index]
      this.saveItem(this.selectedItem)
      let snippet = {
        id: uuidv4(),
        title: this.title.snippets,
        value: JSON.parse(JSON.stringify(item))
      }
      this.snippets.push(snippet)
      chromeApi.savelocal({ 'snippets': JSON.stringify(this.snippets) })
      this.visible.snippets = false
      this.title.snippets = ''
    },
    deletesnippets() {
      let index = this.snippets.findIndex(ele => ele.id == this.snippetsSeleted)
      if (index < 0) { return }
      this.$confirm({
        width: 300,
        content: `删除 [${this.snippets[index].title}] 预设文本?`,
        onOk: async () => {
          this.snippets.splice(index, 1)
          chromeApi.savelocal({ 'snippets': JSON.stringify(this.snippets) })
        },
        okText: '确定',
        cancelText: '取消',
      })
    },
    fitHeight() {
      let img = document.getElementById(`image-${this.currentPage}`)
      this.zoom = Math.floor((window.innerHeight - 75) / img.height * 100) / 100
      this.$forceUpdate()
    },
    viewModeInit() {
      for (let index = 0; index < this.totalSourceLength; index++) {
        this.showPage[index] = this.setting.viewMode == 'scroll'
      }
      if (this.currentPage > this.totalSourceLength - 1) {
        this.currentPage = 0
      }
      if (this.setting.viewMode == 'page') {
        if (this.setting.viewPage == 1) {
          if (this.showPage.hasOwnProperty(this.currentPage)) { this.showPage[this.currentPage] = true }
        } else {
          if (this.setting.viewIndex == 2) {
            if (this.currentPage % 2 == 1) { this.currentPage-- }
            if (this.showPage.hasOwnProperty(this.currentPage)) { this.showPage[this.currentPage] = true }
            if (this.showPage.hasOwnProperty(this.currentPage + 1)) { this.showPage[this.currentPage + 1] = true }
          } else {
            if (this.currentPage == 0) {
              if (this.showPage.hasOwnProperty(this.currentPage)) { this.showPage[this.currentPage] = true }
            } else {
              if (this.currentPage % 2 == 0) { this.currentPage-- }
              if (this.showPage.hasOwnProperty(this.currentPage)) { this.showPage[this.currentPage] = true }
              if (this.showPage.hasOwnProperty(this.currentPage + 1)) { this.showPage[this.currentPage + 1] = true }
            }
          }
        }
      }
      this.$forceUpdate()
    },
    pagination(target) {
      if (this.setting.viewMode == 'scroll') { return }
      if (target < 1) { target = 1 }
      if (target > this.totalSourceLength) { target = this.totalSourceLength }
      target--
      if (this.setting.viewPage == 1) {
        for (const key in this.showPage) {
          this.showPage[key] = target * 1 == key * 1
        }
        this.currentPage = target
        this.$forceUpdate()
        return
      }

      if (this.setting.viewIndex == 2) {
        if (target % 2 == 1) { target-- }
        for (const key in this.showPage) {
          this.showPage[key] = (target == key * 1) || (target + 1 == key * 1)
        }
        this.currentPage = target
        this.$forceUpdate()
        return
      }

      if (target == 0) {
        for (const key in this.showPage) {
          this.showPage[key] = target == key * 1
        }
        this.currentPage = target
        this.$forceUpdate()
        return
      }

      if (target % 2 == 0) { target-- }
      for (const key in this.showPage) {
        this.showPage[key] = (target == key * 1) || (target + 1 == key * 1)
      }
      this.currentPage = target
      this.$forceUpdate()
    },
    async getSetting() {
      let config = await chromeApi.getlocal('editor-config')
      this.setting = config ? config : { autoSave: true, viewMode: 'page', viewPage: 1, viewIndex: 1 }
      this.autoSave(this.setting.autoSave)
    },
    autoSave(open = true) {
      if (open) {
        clearInterval(this.autosave)
        this.autosave = setInterval(() => {
          console.log('autoSave   ', new Date)
          this.saveBody(true)
        }, 10 * 60 * 1000)
      } else {
        clearInterval(this.autosave)
      }
    },
    getTranslation(data = {}) {
      let filterBody = data.body.filter((ele, index) => {
        ele.index = index
        return ele.item.length
      })
      if (!filterBody.length) {
        return false
      }
      data.defaultRule = {
        skip: filterBody[0].index
      }
      let { body, saveTime, createTime, ...item } = data
      item.body = filterBody
      return item
    },
    async saveBody(nomessage = false) {
      let item = this.getTranslation(this.data)
      if (!item) { if (!nomessage) { this.$message.warning('译文无内容') }; return }
      if (!this.validateInfo()) { if (!nomessage) { this.$message.warning('译文标题必须在6字节以上') }; return }
      let ts = await chromeApi.getlocal(`translation-${this.data.local_id}`)
      let { createTime, saveTime, ...res } = ts ? JSON.parse(ts) : {}
      if (JSON.stringify(item) == JSON.stringify(res)) { if (!nomessage) { this.$message.info('文档未修改') }; return }
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
      console.log('save   ', new Date)
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
        this.viewModeInit()
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
      this.selectedPresetStyle = val
      this.currentPresetStyle = val
      let item = this.presetStyle.find(ele => ele.id == val)
      if (!item) { return }
      item = JSON.parse(JSON.stringify(item))
      console.log(val, item.title)
      console.log(item.style)
      this.$set(this.selectedTextStyle, 'style', item.style.style)
      this.$set(this.selectedTextStyle, 'container', item.style.container)
      this.$set(this.selectedTextStyle, 'background', item.style.background)
      if (this.selectedItem) {
        this.selectedItem.container = this.getTextStyle('container')
        this.selectedItem.style = this.getTextStyle('style')
        this.selectedItem.background = this.getTextStyle('background')
        this.batchUpdateList(['style'], this.getTextStyle('style'))
        this.batchUpdateList(['container'], this.getTextStyle('container'))
        this.batchUpdateList(['background'], this.getTextStyle('background'))
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
    selectTool(tool) {
      this.basetool = tool
      switch (tool) {
        case 'text':
          this.cursor = 'crosshair'
          this.selectedItem = null
          let item = this.presetStyle.find(ele => ele.id == this.selectedPresetStyle)
          if (item) {
            this.$set(this, 'defaultStyle', JSON.parse(JSON.stringify(item.style)))
            this.selectedPresetStyle = this.currentPresetStyle = item.id
          } else {
            this.$set(this, 'defaultStyle', JSON.parse(JSON.stringify(this.presetStyle[0].style)))
            this.selectedPresetStyle = this.currentPresetStyle = this.presetStyle[0].id
          }
          this.selectedTextStyle = this.defaultStyle
          break
        default:
          this.cursor = 'crosshair'
          this.selectedItem = null
          break;
      }
    },
    keyDown(e) {
      switch (e.keyCode) {
        case 65:
          if (e.ctrlKey && this.selectedItem && !this.process.length) {
            this.data.body[this.selectIndex.page].item.forEach(ele => {
              if (ele != this.selectedItem && !this.selectedList.includes(ele) && !ele.lock) {
                this.selectedList.push(ele)
              }
            })
          }
          break
        case 67:
          if (e.ctrlKey && this.selectedItem && !this.process.length) { this.copyItem = this.selectedItem }
          break
        case 86:
          if (e.ctrlKey && this.copyItem && this.mousePositon.on && !this.process.length) {
            let res = this.getOffsetToPage(this.mousePositon.event.target)
            let item = JSON.parse(JSON.stringify(this.copyItem))
            item.id = uuidv4()
            item.left = (res.offset.left + this.mousePositon.event.offsetX) / this.zoom
            item.top = (res.offset.top + this.mousePositon.event.offsetY) / this.zoom
            this.data.body[this.mousePositon.page].item.push(item)
            this.selectItem(item, { page: this.mousePositon.page, index: this.data.body[this.mousePositon.page].item.length - 1 })
            this.copyItem = null
          }
          break
      }
    },
    labelPlus() {
      let file = this.$refs.fileText.files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => {
        let items = e.currentTarget.result.split(/>+\[.*\]<+/)
        let data = []
        let hasItems = false
        for (let index = 1; index < items.length; index++) {
          const element = items[index];
          let texts = element.split(/-+\[\d+\]-+/g)
          let bodys = {
            index: index - 1,
            item: []
          }
          if (texts) {
            for (let index2 = 0; index2 < texts.length; index2++) {
              const text = texts[index2];
              text = text.replace(/\r\n*$/, '')
              let position = text.match(/^\[[0-9,.]+\]/)
              if (position) {
                let po = position[0].match(/[0-9.]+/g)
                bodys.item.push({
                  width: po[0] * 1,
                  height: po[1] * 1,
                  text: text.replace(/^\[[0-9,.]+\]/, '').trim()
                })
                hasItems = true
              }
            }
            data.push(bodys)
          }
        }
        if (hasItems) { this.$refs.labelPlus.showModal(data) }
        this.$refs.fileText.value = ''
      }
    },
    loadLabelPlus(data, style = {}) {
      let itemstyle = this.getTextStyle('style', style),
        itemContainer = this.getTextStyle('container', style),
        itemBackground = this.getTextStyle('background', style)
      data.forEach((ele => {
        let width, height
        if (this.data.body[ele.index] && this.data.body[ele.index].width && this.data.body[ele.index].height) {
          width = this.data.body[ele.index].width
          height = this.data.body[ele.index].height
        } else if (this.imageSource[ele.index] && this.imageSource[ele.index].width && this.imageSource[ele.index].height) {
          width = this.imageSource[ele.index].width
          height = this.imageSource[ele.index].height
        }
        if (width && height) {
          ele.item.forEach(element => {
            let item = {
              id: uuidv4(),
              type: 'text',
              show: true,
              left: width * element.width * this.zoom,
              top: height * element.height * this.zoom,
              container: JSON.parse(JSON.stringify(itemContainer)),
              body: element.text,
              style: JSON.parse(JSON.stringify(itemstyle)),
              background: JSON.parse(JSON.stringify(itemBackground)),
              customStyle: '',
              customBackground: '',
              customContainer: '',
              quote: []
            }
            this.data.body[ele.index].item.push(item)
          })
        }
      }))
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
          id: uuidv4(),
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
        this.$refs.file.value = ''
      }
    },
    async downloadLabelPlus() {
      let text = `1,0\r\n-\r\n框内\r\n框外\r\n-\r\n${this.data.message}\r\n`
      let div = document.createElement('div')
      for (let index = 0; index < this.data.body.length; index++) {
        let element = this.data.body[index];
        text += `\r\n>>>>>>>>[${index + 1}.png]<<<<<<<<\r\n`
        for (let i = 0; i < element.item.length; i++) {
          let item = element.item[i];
          if (item.type == 'text') {
            div.innerHTML = item.body
            text += `----------------[${i + 1}]----------------[${(item.left / element.width).toFixed(3)},${(item.top / element.height).toFixed(3)},1]\r\n${div.innerText.trim()}\r\n\r\n`
          }
        }
      }
      let filename = `${this.data.title}.txt`
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', filename);
      pom.click();
    },
    async downloadManga() {
      try {
        for (const key in this.showPage) { this.showPage[key] = true }
        this.$forceUpdate()
        this.selectedItem = null
        let items = document.getElementsByClassName('workspace-page')
        const zip = new JSZip();
        this.$message.loading({ content: `处理中 0/${items.length}`, key: 'loading', duration: 0 });
        this.setMargin()
        for (let index = 0; index < items.length; index++) {
          let node = items[index]
          let dataUrl = await domtoimage.toPng(node)
          zip.file(`${index + 1}.png`, dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
          this.$message.loading({ content: `处理中 ${index + 1}/${items.length}`, key: 'loading', duration: 0 });
        }
        this.viewModeInit()
        this.$message.loading({ content: `下载中···}`, key: 'loading', duration: 0 });
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(content, `${this.data.title}.zip`);
          this.$message.success({ content: `下载完成`, key: 'loading', duration: 0 });
        });
        this.setMargin(false)
      } catch (error) {
        this.$message.error({ content: '处理失败', key: 'loading', duration: 3, })
        this.viewModeInit()
      }
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
      for (const key in this.showPage) { this.showPage[key] = true }
      try {
        this.$forceUpdate()
        this.selectedItem = null
        let items = document.getElementsByClassName('workspace-img')
        const zip = new JSZip();
        this.$message.loading({ content: `处理中 0/${items.length}`, key: 'loading', duration: 0 });
        for (let index = 0; index < items.length; index++) {
          let node = items[index]
          let dataUrl = await domtoimage.toPng(node)
          zip.file(`${index + 1}.png`, dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
          this.$message.loading({ content: `处理中 ${index + 1}/${items.length}`, key: 'loading', duration: 0 });
        }
        this.viewModeInit()
        this.$message.loading({ content: `下载中···}`, key: 'loading', duration: 0 });
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(content, `${this.data.title}.zip`);
          this.$message.success({ content: `下载完成`, key: 'loading', duration: 0 });
        });
      } catch (error) {
        this.$message.error({ content: '处理失败', key: 'loading', duration: 3, })
        this.viewModeInit()
      }
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
    lostBasetool() {
      this.basetool = ''
      this.cursor = ''
      this.currentPresetStyle = ''
    },
    pageClickWatch(e, pageIndex) {
      switch (this.basetool) {
        case 'text':
          this.basetool = ''
          this.selectedItem = null
          this.cursor = ''
          this.currentPresetStyle = ''
          this.createNewText(e, pageIndex); break;
        case 'clip-path':
          this.basetool = ''
          this.cursor = ''
          this.selectedItem = null
          this.createNewClipPath(e, pageIndex); break;
        case 'svg':
          this.basetool = ''
          this.cursor = ''
          this.selectedItem = null
          this.createNewSvg(e, pageIndex)
          break
        case 'snippets':
          if (!e.shiftKey) { this.basetool = '' }
          if (this.snippetsSeleted) { this.createNewsNippets(e, pageIndex) }
          break
      }
    },
    createNewsNippets(event, pageIndex) {
      let snippets = this.snippets.find(ele => ele.id == this.snippetsSeleted)
      if (snippets) {
        let res = this.getOffsetToPage(event.target)
        let item = JSON.parse(JSON.stringify(snippets.value))
        item.id = uuidv4()
        item.left = (res.offset.left + event.offsetX) / this.zoom,
          item.top = (res.offset.top + event.offsetY) / this.zoom,
          this.data.body[pageIndex * 1].item.push(item)
      }
    },
    pageMouseDownWatch(e, pageIndex) {
      switch (this.basetool) {
        case 'clip-rect':
          this.basetool = ''
          this.cursor = ''
          this.selectedItem = null
          this.createNewClipRect(e, pageIndex)
          break;
        default:
          break;
      }
    },
    cleanSelection(e) {
      let rightmouse = e.path.find(ele => ele._prevClass && ele._prevClass.includes('rightmouse'))
      if (rightmouse) {
        this.menuPosition.type = rightmouse.dataset.type
        switch (rightmouse.dataset.type) {
          case 'item':
            if (this.basetool) { this.basetool = ''; this.cursor = '' }
            let item = this.data.body[rightmouse.dataset.page * 1].item[rightmouse.dataset.index * 1]
            if (this.selectedItem != item) {
              this.selectItem(item, { page: rightmouse.dataset.page * 1, index: rightmouse.dataset.index * 1 })
              this.scrollInto(rightmouse.dataset.page * 1)
            }
            break;
          case 'snippets':
            this.snippetsSeleted = rightmouse.dataset.id
            break
          default:
            break;
        }
        this.menuPosition.display = 'block'
        this.menuPosition.left = e.pageX + 'px'
        this.menuPosition.top = e.pageY + 'px'

        this.$nextTick(() => {
          let contextmenu = document.getElementById('contextmenu').getBoundingClientRect()
          if ((e.pageX + contextmenu.width) > window.innerWidth) { this.menuPosition.left = window.innerWidth - contextmenu.width - 5 + 'px' }
          if ((e.pageY + contextmenu.height) > window.innerHeight) { this.menuPosition.top = window.innerHeight - contextmenu.height - 5 + 'px' }
        })
        document.addEventListener('mousedown', this.hiddenMenu)
      } else {
        this.menuPosition.display = 'none'
        if (this.basetool) { this.basetool = '', this.cursor = '' }
        if (this.selectedItem) { this.selectedItem = null }
      }
    },
    hiddenMenu(e) {
      let mune = e.path.find(ele => ele.id == 'contextmenu')
      if (!mune) {
        document.removeEventListener('mousedown', this.hiddenMenu)
        this.menuPosition.display = 'none'
      }
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
      if (item.lock) { return }
      let textEle = document.getElementById('textEditor-' + item.id)
      textEle.contentEditable = 'true'
      textEle.style['userSelect'] = 'auto'
      textEle.focus()
      this.selectItem(item, index)
      let ele = textEle.getBoundingClientRect()

      this.textEditorMenuPositon = { display: 'block', }
      if (ele.right + 450 + 280 > window.innerWidth) {
        this.textEditorMenuPositon.left = (window.innerWidth - 450 - 280) * this.zoom + 'px'
      } else {
        this.textEditorMenuPositon.left = ele.left * this.zoom + 'px'
      }
      if (ele.top < 50) {
        this.textEditorMenuPositon.top = (ele.bottom + 70) * this.zoom + 'px'
      } else { this.textEditorMenuPositon.top = ele.top * this.zoom + 'px' }

      if (!this.process.includes('Edit')) { this.process.push('Edit') }
    },
    saveTextItem(event, item) {
      this.focusItem = ''
      document.removeEventListener('click', this.listenClickOutside)
      document.addEventListener('click', this.listenClickOutside)
    },
    listenClickOutside(e) {
      let richTextEditorMenu = e.path.find(ele => ele.id == 'richTextEditorMenu')
      let editMenu = e.path.find(ele => ele.id == 'workspace-param')
      let params = e.path.find(ele => ele.dataset && ele.dataset.type == 'params')
      let selfEditor = e.path.find(ele => ele.id && ele.id == `textEditor-${this.selectedItem.id}`)
      if (!(richTextEditorMenu || editMenu || params || selfEditor)) {
        this.selectedItem = null
        document.removeEventListener('click', this.listenClickOutside)
      }
    },
    saveItem(item) {
      let textEle = document.getElementById('textEditor-' + item.id)
      if (!textEle) { return }
      console.log('before', textEle.innerHTML, textEle.innerHTML.length)
      item.body = this.cleanHTMLSPAN(textEle.innerHTML, item.style)
      console.log('after', item.body, item.body.length)
      console.log('saveItem')
      textEle.contentEditable = 'false'
      textEle.style['userSelect'] = 'none'
      this.$forceUpdate()
      if (this.selectedItem == item) { this.selectedItem = null }
      this.textEditorMenuPositon.display = 'none'
      if (this.process.includes('Edit')) { this.process.pop() }
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
        this.viewModeInit()
      }
    },
    addSVGItem() {
      let svgEditor = document.getElementById('svgEditor-body')
      if (!svgEditor.innerHTML) {
        this.process = []
        this.svgData.status.show = false
        return
      }
      let box = svgEditor.getBBox()
      for (const key in box) {
        box[key] = box[key].toFixed(0) * 1
      }
      if (this.svgData.id) {
        let item = this.data.body[this.svgData.page].item.find(ele => ele.id == this.svgData.id)
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
          id: uuidv4(),
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
      if (item.lock) { return }
      let res = this.getOffsetToPage(event.target)
      this.dataReset('svgData')
      Object.assign(this.svgData.style, {
        left: res.page.offsetLeft + 'px',
        top: res.page.offsetTop + 'px',
        width: res.page.scrollWidth + 'px',
        height: res.page.scrollHeight + 'px',
      })
      this.svgData.page = res.page.dataset.index * 1
      this.svgData.id = item.id
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
        if (this.customClip.id) {
          let clip = this.data.body[this.customClip.page].item.find(ele => ele.id == this.customClip.id)
          Object.assign(clip, res)
          this.customClip.id = ''
        } else {
          res.id = uuidv4()
          res.show = true
          res.lock = false
          this.data.body[this.customClip.page].item.push(res)
        }
        this.process = []
      } catch (error) {
        console.error(error)
        this.$message.error(error)
      }
    },
    reeditClipShape(e, item) {
      if (item.lock) { return }
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
        this.customClip.id = item.id
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
    setItemIndex(type) {
      switch (type) {
        case 'up':
          if (this.selectIndex.index + 1 != this.data.body[this.selectIndex.page].item.length) {
            this.data.body[this.selectIndex.page].item[this.selectIndex.index] = this.data.body[this.selectIndex.page].item.splice(this.selectIndex.index + 1, 1, this.data.body[this.selectIndex.page].item[this.selectIndex.index])[0];
            this.selectIndex.index++
          }
          break;
        case 'down':
          if (this.selectIndex.index != 0) {
            this.data.body[this.selectIndex.page].item[this.selectIndex.index] = this.data.body[this.selectIndex.page].item.splice(this.selectIndex.index - 1, 1, this.data.body[this.selectIndex.page].item[this.selectIndex.index])[0];
            this.selectIndex.index--
          }
          break
        case 'top':
          if (this.selectIndex.index + 1 != this.data.body[this.selectIndex.page].item.length) {
            this.data.body[this.selectIndex.page].item.push(
              this.data.body[this.selectIndex.page].item.splice(this.selectIndex.index, 1)[0]
            )
            this.selectIndex.index = this.data.body[this.selectIndex.page].item.length - 1
          }
          break
        case 'bottom':
          if (this.selectIndex.index != 0) {
            this.data.body[this.selectIndex.page].item.unshift(
              this.data.body[this.selectIndex.page].item.splice(this.selectIndex.index, 1)[0]
            )
            this.selectIndex.index = 0
          }
          break
        default:
          break;
      }
    },

    async replaceText(replace) {
      if (!replace.search) { return }
      let count = 0
      switch (replace.target) {
        case '0':
          if (this.selectedItem) {
            let res = this.replaceItem(this.selectedItem, replace)
            count += res
          }
          break;
        case '1':
          if (this.selectedItem) {
            let res = this.replaceItem(this.selectedItem, replace)
            count += res
          }
          for (let index = 0; index < this.selectedList.length; index++) {
            let r = this.replaceItem(this.selectedList[index], replace)
            count += r
          }
          break
        case '2':
          for (let index = 0; index < this.data.body.length; index++) {
            let body = this.data.body[index]
            for (let index2 = 0; index2 < body.item.length; index2++) {
              const item = body.item[index2];
              let r = this.replaceItem(item, replace)
              count += r
            }
          }
          break
        default:
          break;
      }
      if (replace.replace) {
        this.$message.success(`成功替换文本 ${count} 处`)
      } else {
        this.$message.info(`找到符合条件文本 ${count} 处`)
      }
    },



    replaceItem(item, replace) {
      if (item.type != 'text') { return 0 }
      let div = document.createElement('div')
      div.innerHTML = item.body
      if (div.innerText.indexOf(replace.search) < 0) { return 0 }

      let indexList = []
      let startPosition = 0
      for (let i = 0; i < div.innerText.length; i++) {
        let index = div.innerText.indexOf(replace.search, startPosition)
        if (index < 0) { break }
        indexList.push({ start: index, end: index + replace.search.length, nodes: [] })
        startPosition += (index + replace.search.length)
      }
      let textNodes = this.getAllChildNodes(div)
      let currentPosition = 0
      for (let index = 0; index < textNodes.length; index++) {
        const element = textNodes[index];
        let start = currentPosition
        let end = currentPosition + element.nodeValue.length
        indexList.forEach(ele => {
          if ((ele.start <= start && start < ele.end) ||
            (ele.start < end && end <= ele.end) ||
            (start <= ele.start && ele.end <= end) ||
            (start >= ele.start && end <= ele.end)
          ) {
            ele.nodes.push({ start: start, end: end, node: element })
          }
        })
        currentPosition += element.nodeValue.length
      }

      indexList = indexList.filter(ele => {
        if (ele.nodes.length > 1) {
          let i1div = this.getParentNodeToDIV(ele.nodes[0].node)
          for (let index = 1; index < ele.nodes.length; index++) {
            const divf = this.getParentNodeToDIV(ele.nodes[index].node)
            if (i1div != divf) { return false }
          }
          return true
        } else {
          return true
        }
      })

      if (!replace.replace && indexList.length) {
        this.createSelectRange(item, replace.search)
      }

      if (!replace.replace || !indexList.length) { return indexList.length }
      for (let i1 = 0; i1 < indexList.length; i1++) {
        const element = indexList[indexList.length - 1 - i1];
        for (let i2 = 0; i2 < element.nodes.length; i2++) {
          const textNode = element.nodes[element.nodes.length - 1 - i2];
          let start = textNode.start > element.start ? textNode.start : element.start,
            end = textNode.end > element.end ? element.end : textNode.end,
            preText = textNode.node.nodeValue.slice(0, start - textNode.start),
            nextText = textNode.node.nodeValue.slice(end - textNode.start)

          textNode.node.nodeValue = preText

          if (nextText) { textNode.node.after(document.createTextNode(nextText)) }

          if (i2 == element.nodes.length - 1 && replace.value) {
            if (Object.keys(replace.style).length) {
              let span = document.createElement('span')
              for (const key in replace.style) { span.style[key] = replace.style[key] }
              span.innerText = replace.value
              textNode.node.after(span)
            } else {
              textNode.node.nodeValue += replace.value
            }
          }
        }
      }

      item.body = this.cleanHTMLSPAN(div.innerHTML, item.style)
      console.log(div.innerHTML.length, item.body.length)
      return indexList.length
    },
    createSelectRange(item, value) {
      let div = document.getElementById(`textEditor-${item.id}`)
      if (!div) { return }
      div.style['userSelect'] = 'auto'
      let indexList = []
      let startPosition = 0
      for (let i = 0; i < div.innerText.length; i++) {
        let index = div.innerText.indexOf(value, startPosition)
        if (index < 0) { break }
        indexList.push({ start: index, end: index + value.length, nodes: [] })
        startPosition += (index + value.length)
      }
      let textNodes = this.getAllChildNodes(div)
      let currentPosition = 0
      for (let index = 0; index < textNodes.length; index++) {
        const element = textNodes[index];
        let start = currentPosition
        let end = currentPosition + element.nodeValue.length
        indexList.forEach(ele => {
          if ((ele.start <= start && start < ele.end) ||
            (ele.start < end && end <= ele.end) ||
            (start <= ele.start && ele.end <= end) ||
            (start >= ele.start && end <= ele.end)
          ) {
            ele.nodes.push({ start: start, end: end, node: element })
          }
        })
        currentPosition += element.nodeValue.length
      }

      indexList = indexList.filter(ele => {
        if (ele.nodes.length > 1) {
          let i1div = this.getParentNodeToDIV(ele.nodes[0].node)
          for (let index = 1; index < ele.nodes.length; index++) {
            const divf = this.getParentNodeToDIV(ele.nodes[index].node)
            if (i1div != divf) { return false }
          }
          return true
        } else {
          return true
        }
      })


      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }



      // for (let i1 = 0; i1 < indexList.length; i1++) {
      const element = indexList[0];

      let startNode = element.nodes[0]
      let endNode = element.nodes[element.nodes.length - 1]

      let start = (startNode.start > element.start ? startNode.start : element.start) - startNode.start,
        end = (endNode.end > element.end ? element.end : endNode.end) - endNode.start
      selection.setBaseAndExtent(startNode.node, start, endNode.node, end)

      // }

    },
    getParentNodeToDIV(node) {
      if (!node.parentElement) {
        return node
      }
      if (node.parentElement.nodeName == 'DIV') {
        return node.parentElement
      } else {
        return this.getParentNodeToDIV(node.parentElement)
      }
    },

    cleanHTMLSPAN(html = '', style = {}) {
      let div = document.createElement('div')
      div.className = 'default_konjac_css_style'
      document.getElementById('cleanArea').appendChild(div)
      for (const key in style) { div.style[key] = style[key] }
      html = html.replace(/\u200b/g, '')
      div.innerHTML = html
      let span = this.getAllChildNodes(div, 'SPAN')
      span = span.filter(ele => {
        if (!ele.innerText) { ele.remove() }
        return ele.innerText
      })
      for (let index = 0; index < span.length; index++) {
        const element = span[span.length - 1 - index];
        if (element.parentElement.nodeName == 'SPAN' && element.parentElement.innerText == element.innerText) {
          for (let index = 0; index < element.style.length; index++) {
            element.parentElement.style[element.style[index]] = element.style[element.style[index]]
          }
          element.parentElement.appendChild(document.createTextNode(element.innerText))
          element.remove()
        } else if (element.parentElement) {
          let deleteStyle = []
          let parentElementStyle = window.getComputedStyle(element.parentElement, null)
          for (let index = 0; index < element.style.length; index++) {
            if (parentElementStyle[tool.toCamelCase(element.style[index])] == element.style[element.style[index]]) { deleteStyle.push(element.style[index]) }
          }
          deleteStyle.forEach(ele => { element.style[ele] = null })
          if (!element.style.length) {
            element.after(document.createTextNode(element.innerText))
            element.remove()
          }
        }
      }
      div.remove()
      return div.innerHTML
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
        id: uuidv4(),
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
        title: `确认删除元素${this.selectedList.length ? ` × ${this.selectedList.length + 1}` : ''}?`,
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
          for (let index = 0; index < this.selectedList.length; index++) {
            let i = this.data.body[pageIndex * 1].item.findIndex(ele => ele == this.selectedList[index])
            if (!(i < 0)) { this.data.body[pageIndex * 1].item.splice(i, 1) }
          }
          this.menuPosition.display = 'none'
        },
        onCancel() { },
      });
    },

    setselectedItem(type, key) {
      if (!this.selectedItem) { return }
      let value
      try {
        switch (type) {
          case 'style': case 'background':
            switch (key) {
              case 'font-size': case '-webkit-text-stroke-width':
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key] + 'px')
                this.batchUpdateList([type, key], this.selectedTextStyle[type][key] + 'px')
                break
              case 'letter-spacing':
                if (this.selectedTextStyle[type][key] != 'normal') {
                  this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key])
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key], 'delete')
                }
              case 'padding': case 'padding-right': case 'padding-top': case 'padding-left': case 'padding-bottom':
                if (this.selectedTextStyle[type][key] != '0') {
                  this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key])
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key], 'delete')
                }
                break;
              case 'transform':
                if (this.cssParams.transformStyle == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformStyle] * 1 != 0) {
                  this.$set(this.selectedItem[type], key, `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
                  this.batchUpdateList([type, key], `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
                } else if (
                  this.cssParams.transformStyle == 'rotate3d' && (this.selectedTextStyle[type][key]['rotate3d'].x * 1 || this.selectedTextStyle[type][key]['rotate3d'].y * 1 || this.selectedTextStyle[type][key]['rotate3d'].z * 1)) {
                  this.$set(this.selectedItem[type], key,
                    `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `
                  )
                  this.batchUpdateList([type, key], `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `
                  )
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key], 'delete')
                }
                break;
              case 'color': case '-webkit-text-stroke-color':
                if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  value = tool.colors2rgba(this.selectedTextStyle[type][key])
                  this.$set(this.selectedItem[type], key, value)
                  this.batchUpdateList([type, key], value)
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], '', 'delete')
                }
                break;
              case 'writing-mode': case 'text-align': case 'white-space': case 'word-break':
              case 'font-family': case 'font-weight': case 'line-height': case 'text-shadow': case 'font-style':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key])
                } else { this.$delete(this.selectedItem[type], key); this.batchUpdateList([type, key], '', 'delete') }
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
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key])
                } else { this.$delete(this.selectedItem[type], key); this.batchUpdateList([type, key], '', 'delete') }
                break;
              case 'background-color':
                if (tool.colors2rgba(this.selectedTextStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  value = tool.colors2rgba(this.selectedTextStyle[type][key])
                  this.$set(this.selectedItem[type], key, value)
                  this.batchUpdateList([type, key], value)
                } else { this.$delete(this.selectedItem[type], key); this.batchUpdateList([type, key], '', 'delete') }
                break;
              case 'background-image':
                if (this.selectedTextStyle[type][key].value == 'none') {
                  this.setBackgroundImage(this.selectedItem, 'delete')
                  for (let i = 0; i < this.selectedList.length; i++) {
                    this.setBackgroundImage(this.selectedList[i], 'delete')
                  }
                } else if (this.selectedTextStyle[type][key].value == 'quote') {
                  this.setBackgroundImage(this.selectedItem)
                  for (let i = 0; i < this.selectedList.length; i++) {
                    this.setBackgroundImage(this.selectedList[i])
                  }
                } else if (this.selectedTextStyle[type][key].value == 'url') {
                  this.$set(this.selectedItem[type], key, `url(${this.selectedTextStyle[type][key].src})`)
                  let indexQ = this.selectedItem.quote.findIndex(ele => ele.key.join(',') == 'background,background-image')
                  if (!(indexQ < 0)) { this.$delete(this.selectedItem.quote, indexQ) }
                }
                break;
              case 'border': case 'border-right': case 'border-top': case 'border-left': case 'border-bottom':
                if (this.selectedTextStyle[type][key].width) {
                  value = tool.getCss_border(this.selectedTextStyle[type][key])
                  this.$set(this.selectedItem[type], key, value)
                  this.batchUpdateList([type, key], value)
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], '', 'delete')
                }
                break;
              case 'transform':
                if (this.cssParams.transformContainer == 'rotate' && this.selectedTextStyle[type][key][this.cssParams.transformContainer] * 1 != 0) {
                  this.$set(this.selectedItem[type], key, `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
                  this.batchUpdateList([type, key], `rotate(${this.selectedTextStyle[type][key].rotate}deg) `)
                } else if (
                  this.cssParams.transformContainer == 'rotate3d' && (this.selectedTextStyle[type][key]['rotate3d'].x * 1 || this.selectedTextStyle[type][key]['rotate3d'].y * 1 || this.selectedTextStyle[type][key]['rotate3d'].z * 1)) {
                  this.$set(this.selectedItem[type], key, `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `)
                  this.batchUpdateList([type, key], `rotate3d(${this.selectedTextStyle[type][key].rotate3d.x},${this.selectedTextStyle[type][key].rotate3d.y},${this.selectedTextStyle[type][key].rotate3d.z},${this.selectedTextStyle[type][key].rotate3d.a}deg) `)
                } else {
                  this.$delete(this.selectedItem[type], key)
                  this.batchUpdateList([type, key], '', 'delete')
                }
                break;
              case 'border-radius': case 'border-top-left-radius': case 'border-top-right-radius': case 'border-bottom-right-radius': case 'border-bottom-left-radius':
                if (this.selectedTextStyle[type][key] != '0') {
                  this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key],)
                } else { this.$delete(this.selectedItem[type], key); this.batchUpdateList([type, key], '', 'delete') }
                break;
              case 'height': case 'width':
                this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key] + 'px')
                break;
              case 'overflow':
                if (this.selectedTextStyle[type][key] != default_konjac_css[type][key]) {
                  this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
                  this.batchUpdateList([type, key], this.selectedTextStyle[type][key],)
                } else { this.$delete(this.selectedItem[type], key); this.batchUpdateList([type, key], '', 'delete') }
                break;
              default:
                break;
            }
            break;
          case 'customStyle': case 'customBackground': case 'customContainer':
            this.$set(this.selectedItem, type, this.selectedTextStyle[type])
            this.$set(this.selectedItem[type], key, this.selectedTextStyle[type][key])
            this.batchUpdateList([type], this.selectedTextStyle[type],)
            this.batchUpdateList([type, key], this.selectedTextStyle[type][key],)
            break;
        }
      } catch (error) {
        this.$delete(this.selectedItem[type], key)
      }
    },
    setBackgroundImage(item, type = 'set') {
      switch (type) {
        case 'set':
          this.$set(item.container, 'background-image', `url(${this.selectedTextStyle['container']['background-image'].src})`)
          if (item.quote && Array.isArray(item.quote)) {
            let qi = item.quote.findIndex(ele => ele.key.join(',') == 'container,background-image')
            if (!(qi < 0)) {
              this.$set(item.quote, qi, {
                type: this.selectedTextStyle.container['background-image'].type,
                id: this.selectedTextStyle.container['background-image'].id,
                key: ['container', 'background-image']
              })
            } else {
              let quote = this.getQuoteItem()
              this.$set(item, 'quote', quote)
            }
          } else {
            this.$set(item, 'quote', this.getQuoteItem())
          }
          break;
        case 'delete':
          this.$delete(item.container, 'background-image')
          if (item.quote) {
            let indexQ = item.quote.findIndex(ele => ele.key.join(',') == 'container,background-image')
            if (!(indexQ < 0)) { this.$delete(item.quote, indexQ) }
          }
          this.$delete(item.container, 'background-size')
          this.$delete(item.container, 'background-position')
          this.$delete(item.container, 'background-repeat')
          break
        default:
          break;
      }
    },

    batchUpdateList(args = [], data, type = 'set') {
      for (let index = 0; index < this.selectedList.length; index++) {
        if (this.selectedList[index].type != 'text') { continue }
        let item = this.selectedList[index]
        for (let i = 0; i < args.length - 1; i++) { item = item[args[i]] }
        switch (type) {
          case 'set':
            this.$set(item, args[args.length - 1], data)
            break;
          case 'delete':
            this.$delete(item, args[args.length - 1])
            break
        }
      }
    },
    async selectItem(item, index, e) {
      if (this.basetool || this.selectedItem == item) { return }
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
                try {
                  let urlReg = new RegExp(/url\(.*\)/)
                  if (item[type][key] && urlReg.test(item[type][key])) {
                    let url = item[type][key].replace(/(^url\()|(\)$)/g, '')
                    let blobReg = new RegExp(/^blob:/)
                    if (blobReg.test(url) && item.quote) {
                      let el = item.quote.find(ele => ele.key.join(',') == 'background,background-image')
                      if (el) {
                        style[type][key] = { value: 'quote', src: url, id: el.id, type: el.type }
                      } else {
                        style[type][key] = { value: 'quote', src: url, id: '', type: '' }
                      }
                    } else {
                      style[type][key] = { value: 'url', src: url, id: '', type: '' }
                    }
                  } else {
                    style[type][key] = { value: 'none', src: '', id: '', type: '' }
                  }
                } catch (error) {
                  style[type][key] = { value: 'none', url: '', id: '', type: '' }
                  this.$delete(item[type], key)
                }
                break;
              case 'color': case '-webkit-text-stroke-color': case 'background-color':
                if (item[type][key] && !tool.colorCheck(item[type][key], tool.colors2rgba(default_konjac_css[type][key]))) {
                  style[type][key] = tool.format2colors(item[type][key])
                } else { style[type][key] = JSON.parse(JSON.stringify(default_konjac_css[type][key])); delete item[type][key] }
                break;

              case 'writing-mode': case 'text-align': case 'white-space': case 'word-break': case 'overflow': case 'font-family': case 'font-weight':
              case 'background-position': case 'background-size': case 'background-repeat': case 'text-shadow': case 'line-height': case 'font-style':
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
      if (e && e.shiftKey && this.selectedItem) {
        if (this.selectIndex.page == index.page) {
          if (!this.selectedList.includes(this.data.body[this.selectIndex.page].item[this.selectIndex.index])) {
            this.selectedList.push(this.data.body[this.selectIndex.page].item[this.selectIndex.index])
          }
          if (this.selectedList.includes(item)) { this.selectedList.splice(this.selectedList.findIndex(ele => ele == item), 1) }
        } else {
          this.selectedList = []
        }
      } else {
        this.selectedList = []
      }
      this.$set(this, 'selectedItem', item)
      this.$set(this, 'selectIndex', index)
    },
    getTextStyle(type, textStyle) {
      let style = {}
      if (!textStyle) { textStyle = this.selectedTextStyle }
      switch (type) {
        case 'style': case 'background':
          for (const key in textStyle[type]) {
            switch (key) {
              case 'font-size': case '-webkit-text-stroke-width':
                if (textStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = textStyle[type][key] + 'px'
                }
                break
              case 'letter-spacing':
              case 'padding': case 'padding-right': case 'padding-top': case 'padding-left': case 'padding-bottom':
                if (textStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = textStyle[type][key]
                }
                break;
              case 'color': case '-webkit-text-stroke-color':
                if (tool.colors2rgba(textStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  style[key] = tool.colors2rgba(textStyle[type][key])
                }
                break;

              case 'writing-mode': case 'text-align': case 'white-space': case 'word-break': case 'font-family': case 'font-weight':
              case 'text-shadow': case 'line-height': case 'font-style':
                if (textStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = textStyle[type][key]
                }
                break;
              case 'transform':
                if (this.cssParams.transformStyle == 'rotate' && textStyle[type][key][this.cssParams.transformStyle]) {
                  style[key] = `rotate(${textStyle[type][key]}deg) `
                } else if (this.cssParams.transformStyle == 'rotate3d' &&
                  this.cssParams.transformStyle == 'rotate3d' && textStyle[type][key]['rotate3d'].x && textStyle[type][key]['rotate3d'].y && textStyle[type][key]['rotate3d'].z
                ) {
                  style[key] = `rotate3d(${textStyle[type][key].x},${textStyle[type][key].y},${textStyle[type][key].z},${textStyle[type][key].a}deg) `
                }
                break;
              default:
                break;
            }
          }
          break;
        case 'container':
          for (const key in textStyle[type]) {
            switch (key) {
              case 'background-position': case 'background-size': case 'background-repeat':
                if (textStyle[type][key] != default_konjac_css[type][key]) {
                  style[key] = textStyle[type][key]
                }
                break;
              case 'height': case 'width':
                style[key] = textStyle[type][key] + 'px'
                break;
              case 'border': case 'border-right': case 'border-top': case 'border-left': case 'border-bottom':
                if (textStyle[type][key].width) {
                  style[key] = tool.getCss_border(textStyle[type][key])
                }
                break;
              case 'background-image':
                if (textStyle[type][key].value != 'none') {
                  style[key] = `url(${textStyle[type][key].src})`
                }
                break
              case 'background-color':
                if (tool.colors2rgba(textStyle[type][key]) != tool.colors2rgba(default_konjac_css[type][key])) {
                  style[key] = tool.colors2rgba(textStyle[type][key])
                }
                break;
              case 'transform':
                if (this.cssParams.transformContainer == 'rotate' && textStyle[type][key][this.cssParams.transformContainer]) {
                  style[key] = `rotate(${textStyle[type][key]}deg) `
                } else if (this.cssParams.transformContainer == 'rotate3d' &&
                  this.cssParams.transformContainer == 'rotate3d' && textStyle[type][key]['rotate3d'].x && textStyle[type][key]['rotate3d'].y && textStyle[type][key]['rotate3d'].z
                ) {
                  style[key] = `rotate3d(${textStyle[type][key].x},${textStyle[type][key].y},${textStyle[type][key].z},${textStyle[type][key].a}deg) `
                }
                break;
              case 'border-radius':
              case 'border-top-left-radius':
              case 'border-top-right-radius':
              case 'border-bottom-right-radius':
              case 'border-bottom-left-radius':
                if (textStyle[type][key] != '0') { style[key] = textStyle[type][key] }
                break;
              case 'overflow':
                if (textStyle[type][key] != 'visible') {
                  style[key] = textStyle[type][key]
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
    showHidden(page, index) {
      let value = !this.data.body[page].item[index].show
      this.data.body[page].item[index].show = value
      for (let index = 0; index < this.selectedList.length; index++) {
        this.selectedList[index].show = value
      }
    },
    lockElement(page, index) {
      if (this.data.body[page].item[index].lock) {
        this.$delete(this.data.body[page].item[index], 'lock')
        for (let index = 0; index < this.selectedList.length; index++) {
          const element = this.selectedList[index];
          this.$delete(element, 'lock')
        }
      } else {
        this.$set(this.data.body[page].item[index], 'lock', true)
        for (let index = 0; index < this.selectedList.length; index++) {
          const element = this.selectedList[index];
          this.$set(element, 'lock', true)
        }
      }
    },
    getQuoteItem() {
      let quote = []
      if (this.selectedTextStyle.container['background-image'].value == 'quote') {
        quote.push({
          type: this.selectedTextStyle.container['background-image'].type,
          id: this.selectedTextStyle.container['background-image'].id,
          key: ['container', 'background-image']
        })
      }
      return quote
    },
    //缩放元素
    resizeTextDom(event, item, xy) {
      if (this.basetool || item.lock) { return }
      this.cursor = xy[3]
      let ele = document.getElementById(`item-${item.id}`).getBoundingClientRect()
      if (item.type == 'text') { document.getElementById(`textEditor-${item.id}`).style['userSelect'] = 'none' }
      let x = 0, y = 0, ol = item.left, ot = item.top, ow = ele.width, oh = ele.height
      document.onmousemove = (e) => {
        x = x + e.movementX, y = y + e.movementY
        if (xy[0] == -1) { item.left = ol + x / this.zoom }
        if (xy[1] == -1) { item.top = ot + y / this.zoom }
        item.container.width = `${Math.abs(ow + x / this.zoom * xy[0])}px`;
        item.container.height = `${Math.abs(oh + y / this.zoom * xy[1])}px`;
        this.selectedTextStyle.container.width = Math.abs(ow + x / this.zoom * xy[0])
        this.selectedTextStyle.container.height = Math.abs(oh + y / this.zoom * xy[1])
      };
      document.onmouseup = (e) => { this.cursor = ''; document.onmousemove = null; document.onmouseup = null; };
    },
    //移动元素
    moveDom(e, item, index) {
      if (item.lock || this.basetool) { return }
      if (this.process.length) { this.process = [] }
      this.selectItem(item, index, e)
      if (item.type == 'text' && document.getElementById(`textEditor-${item.id}`).contentEditable == 'true') { return }
      if (item.type == 'text') { document.getElementById(`textEditor-${item.id}`).style['userSelect'] = 'none' }
      let x, y
      document.onmousemove = (e) => {
        this.cursor = 'move'
        x = (e.movementY / this.zoom).toFixed(0) * 1, y = (e.movementX / this.zoom).toFixed(0) * 1;
        item.top += x, item.left += y
        for (let index = 0; index < this.selectedList.length; index++) {
          this.selectedList[index].top += x, this.selectedList[index].left += y
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.cursor = ''
      };
    },
    scrollInto(pageindex) {
      if (this.setting.viewMode == 'scroll') {
        document.getElementById(`page-${pageindex}`).scrollIntoView({ behavior: 'smooth' })
      } else {
        this.pagination(pageindex + 1)
      }
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
              if (quote.id == clip.id && quote.type == 'clip') {
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
  user-select: none;
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
      position: relative;
      ul {
        width: calc(100% + 2px);
        display: none;
        position: absolute;
        list-style-type: none;
        padding: 0;
        left: -1px;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        border-left: 1px solid #444;
        border-right: 1px solid #444;
        border-bottom: 1px solid #444;
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
      .thumbnail-item-selected2 {
        background-color: #4f81ff83;
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
        align-items: center;
        line-height: 30px;
        .pagination {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        > div {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .ant-input-number-focused {
          border: none;
        }
      }
    }
    #workspace-sider-right {
      min-width: 265px;
      max-width: 265px;
      background-color: #2f2f2f;
      display: flex;
      flex-direction: row;
      height: auto;
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
          justify-content: space-between;
        }
      }
    }
  }
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

.pageMode {
  display: flex;
  flex-direction: row;
}

.scrollMode {
  display: flex;
  flex-direction: column;
  > .workspace-item {
    margin-bottom: 10px;
  }
}

.workspace-item {
  position: relative;
  display: inline-block;
  user-select: none;
  margin: auto auto;
}

#workspace {
  width: 100%;
  margin-bottom: 30px;
  padding: 10px;
  overflow: auto;
  // overflow: visible;
  position: relative;
  display: flex;

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
  .zindexMax {
    z-index: 9999 !important;
  }
  .item-unlock:hover {
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
.scrollbar3::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background-color: #f5f5f5;
  margin-left: 3px;
}
.scrollbar3::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}
.scrollbar3::-webkit-scrollbar-track {
  border-left: 1px solid #444;
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
  font-weight: 400;
  line-height: 1.5;
  font-stretch: normal;
  letter-spacing: normal;
  white-space: normal;
  word-break: break-all;
  font-style: normal;
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
  border-radius: 3px;
}
.param-button:hover {
  background-color: #444;
}

.cursormove {
  cursor: move;
}

.cursorcrosshair {
  cursor: crosshair;
}

.cursorw-resize {
  cursor: w-resize;
}
.cursors-resize {
  cursor: s-resize;
}
.cursorn-resize {
  cursor: n-resize;
}
.cursore-resize {
  cursor: e-resize;
}

.cursorne-resize {
  cursor: ne-resize;
}
.cursorsw-resize {
  cursor: sw-resize;
}
.cursorse-resize {
  cursor: se-resize;
}
.cursornw-resize {
  cursor: nw-resize;
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

#contextmenu {
  position: fixed;
  padding: 0px;
  background-color: #fff;
  border: 1px solid rgba(24, 144, 255, 0.1);
  border-radius: 5px;
  width: 120px;
  z-index: 999;
  user-select: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li {
    cursor: pointer;
    height: 35px;
    padding: 0 20px;
    line-height: 35px;
    .anticon {
      margin-right: 3px;
    }
  }
  li:hover {
    background-color: rgba(24, 144, 255, 0.1);
  }
}
</style>
