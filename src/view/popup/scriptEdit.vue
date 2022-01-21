<template>
  <div id="scriptEdit">
    <a-form style="margin-bottom:45px;padding:5px">
      <a-form-item label="标题">
        <a-input v-model="data.title"></a-input>
      </a-form-item>
      <a-form-item label="适用站点">
        <a-select mode="tags" v-model="data.host" />
      </a-form-item>
      <a-form-item label="URL校验(正则)">
        <a-input v-model="data.match"></a-input>
      </a-form-item>
      <a-form-item label="版本">
        <a-input v-model="data.version"></a-input>
      </a-form-item>
      <a-form-item label="Code">
        <textarea v-model="code" placeholder="async function getData(){return Promise.resolve({title:'TITLE',pages:[{index:0,src:'...'}]})};
        async function ready(){if(ok){return Promise.resolve()}else{return Promise.reject()}}" style="height:250px" class="ant-input scrollbar"></textarea>
      </a-form-item>
    </a-form>
    <div id="script-submit">
      <a-button type="default" style="width:45%" @click="$router.back()">返回</a-button>
      <a-button type="primary" style="width:45%" @click="saveItem">保存</a-button>
    </div>
  </div>
</template>

<script>

import chromeApi from '../../module/chrome'
import { v4 as uuidv4 } from 'uuid';

export default {
  created() {
    if (Object.keys(this.$route.params).length) {
      Object.assign(this.data, this.$route.params)
      this.type = 'edit'
      this.getCode(this.$route.params)
    }
  },
  mounted() {
  },
  data() {
    return {
      type: 'create',
      data: {
        id: '',
        title: '',
        host: [],
        match: '',
        version: '',
        createTime: '',
        source: ''
      },
      code: '',
    }
  },
  methods: {
    async saveItem() {
      let list = await chromeApi.getlocal('srcipt_list')
      list = JSON.parse(list)
      switch (this.type) {
        case 'create':
          this.data.id = uuidv4()
          list.push(this.data)
          break;
        case 'edit':
          let item = list.find(ele => ele.id === this.data.id)
          Object.assign(item, this.data)
          break
        default:
          break;
      }
      await chromeApi.savelocal({ 'srcipt_list': JSON.stringify(list) })
      let code = {}
      code[`script-${this.data.id}`] = this.code
      await chromeApi.savelocal(code)
      this.$router.back()
    },
    async getCode(item) {
      try {
        let code = await chromeApi.getlocal(`script-${item.id}`)
        if (code) {
          this.code = code
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less">
#scriptEdit {
  padding: 0px;
  max-height: 280px;
}
#script-submit {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 45px;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 0 10px 0 10px;
  justify-content: space-around;
  align-items: center;
}
</style>