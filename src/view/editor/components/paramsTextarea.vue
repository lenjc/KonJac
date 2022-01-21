<template>
  <div class="param-item  param-item-full param-textarea" data-type="params" rows="3" cols="20">
    <div style="margin-bottom:5px">
      <div style="width:30%">{{title}}</div>
      <div style="width:50%;display: flex;justify-content:flex-start">
        <select size="small" class="param-select" v-model="selected" @change="changeSelected" style="width:100%">
          <option value="">无</option>
          <option v-for="(item,index) in options" :key="`${args.join('-')}-${index}`" :value="item.id">
            {{item.label}}</option>
        </select>
      </div>
      <div style="width:20%">
        <div class="ul-action">
          <a-icon type="more" style="color:#fff" />
          <ul style="right:00px">
            <li @click="validate('update')">保存</li>
            <li @click="validate('create')">新建</li>
            <li @click="deleteOption">删除</li>
          </ul>
        </div>
      </div>
    </div>
    <textarea style="z-index:50" v-model="data" @change="paramChange(args)" @input="paramChange(args)" />
    <a-modal :visible="visible" title="样式名称" width="300px" okText="确定" cancelText="取消" @cancel="visible=false"
      @ok="createOption">
      <a-input v-model="styleTitle" placeholder="请输入"></a-input>
    </a-modal>
  </div>
</template>


<script>

import chromeApi from '../../../module/chrome'
import { v4 as uuidv4 } from 'uuid';

export default {
  props: {
    text: String,
    args: Array,
    title: String,
    rows: { type: String, default: '3' },
    cols: { type: String, default: '20' },
    styleType: String,
  },
  data() {
    return {
      visible: false,
      data: this.text,
      selected: '',
      show: false,
      styleTitle: '',
      options: [],
    }
  },
  watch: {
    text(val, old) {
      this.data = val
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeSelected(e) {
      if (this.selected) {
        let item = this.options.find(ele => ele.id == this.selected)
        this.data = item.value
      } else {
        this.data = ""
      }
      this.paramChange()
    },
    paramChange() {
      this.$emit('paramChange', this.args, this.data)
    },
    async getList() {
      if (!this.styleType) { return }
      let option = await chromeApi.getlocal(`CustomStyle-${this.styleType}`)
      this.options = option ? JSON.parse(option) : []
    },
    async validate(action) {
      try {
        let data = JSON.parse('{' + this.data + '}')
        switch (action) {
          case 'create':
            this.visible = true
            break;
          case 'update':
            this.updateOption()
            break
        }
      } catch (error) {
        this.$message.error('格式错误')
      }
    },
    async createOption() {
      let option = {
        id: uuidv4(),
        value: this.data,
        label: this.styleTitle
      }
      this.options.push(option)
      await chromeApi.savelocal({ [`CustomStyle-${this.styleType}`]: JSON.stringify(this.options) })
      this.visible = false
    },
    async updateOption() {
      if (!this.selected) { return }
      let item = this.options.find(ele => ele.id == this.selected)
      if (!item) { return }
      this.$confirm({
        width: 300,
        content: `覆盖保存为 [${item.label}]`,
        onOk: async () => {
          item.value = this.data
          await chromeApi.savelocal({ [`CustomStyle-${this.styleType}`]: JSON.stringify(this.options) })
        },
        okText: '确定',
        cancelText: '取消',
      })
    },
    async deleteOption() {
      if (!this.selected) { return }

      let index = this.options.findIndex(ele => ele.id == this.selected)
      console.log(this.selected, index)
      if (index < 0) { return }
      this.$confirm({
        width: 300,
        content: `删除 [${this.options[index].label}] 自定义样式`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.options.splice(index, 1)
          this.selected = ''
          this.data =''
          this.paramChange()
          await chromeApi.savelocal({ [`CustomStyle-${this.styleType}`]: JSON.stringify(this.options) })
        },
      })
    }
  }
}
</script>

<style lang="less" >
.param-textarea.param-item {
  height: auto;
  > div:nth-child(1) {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 5px;
    > div {
      user-select: none;
      line-height: 30px;
      text-align: center;
      vertical-align: middle;
      height: 30px;
    }
  }
  .param-select {
    width: auto;
  }
  textarea {
    margin: 0 auto;
    background-color: transparent;
    border: none;
    color: #4f80ff;
    outline: none;
    padding: 0 5px 0 5px;
    text-align: left;
    height: 200px;
  }
}

.ul-action {
  width: 100%;
  cursor: pointer;
  text-align: center;
  ul {
    border-radius: 3px;
    overflow: hidden;
    // text-align: left;
    top: 25px;
    z-index: 999;
    position: absolute;
    right: 20px;
    width: 40px;
    display: none;
    list-style-type: none;
    padding: 0;
    background-color: #fff;
    li {
      padding: 0px 3px 0 3px;
    }
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
.ul-action:hover {
  color: #444;
  ul {
    display: block;
  }
}
</style>