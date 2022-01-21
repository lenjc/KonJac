<template>
  <a-modal :visible="visible" title="基本信息" @cancel="showModal" @ok="showModal" :bodyStyle="{'padding-top':0}"
    okText="确定" cancelText="取消">
    <a-form :label-col="{span:4}" :wrapper-col="{span:20}">
      <a-form-item label="语言" class="baseinfo-params">
        <span>{{data.language}}</span>
      </a-form-item>
      <a-form-item label="标题" class="baseinfo-params" :help="help.title">
        <a-input v-model="data.title" placeholder="" @change="lengthLimit(64,'title')"></a-input>
      </a-form-item>
      <a-form-item label="关键词" class="baseinfo-params">
        <a-select mode="tags" :defaultOpen="false" v-model="data.keywords"></a-select>
      </a-form-item>
      <a-form-item label="马甲" class="baseinfo-params" :help="help.avatar">
        <a-input v-model="data.avatar" @change="lengthLimit(36,'avatar')"></a-input>
      </a-form-item>
      <a-form-item label="源地址" class="baseinfo-params">
        <span>{{data.url}}</span>
      </a-form-item>
      <a-form-item label="留言" class="baseinfo-params" :help="help.message">
        <a-textarea v-model="data.message" @change="lengthLimit(240,'message')"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

import bytes from 'utf8-bytes'

export default {
  props: {
    data: Object,
  },
  data() {
    return {
      visible: false,
      help: {
        title: '',
        avatar: '',
        message: '',
      }
    }
  },
  methods: {
    showModal() {
      this.visible = !this.visible
    },
    lengthLimit(len = 24, type) {
      let length = bytes(this.data[type]).length
      if (length > len) {
        this.help[type] = `请限制在${len}字节内`
        let str = String(this.data[type])
        for (let index = 0; index < length; index++) {
          str = str.replace(/.$/, '')
          if (!(bytes(str).length > len)) { break }
        }
        this.$emit('paramChange', ['data', type], str)
      } else {
        this.help[type] = ''
      }
    }
  }
}
</script>

<style lang="less">
.baseinfo-params {
  margin-top: 10px;
}
</style>