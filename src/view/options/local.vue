<template>
  <div id="local">
    <div class="table-page-search-wrapper" style="margin-bottom:20px">
      <a-form layout="inline" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="标题">
              <a-input v-model.trim="queryParam.title" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="源地址">
              <a-input v-model.trim="queryParam.url" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="状态">
              <a-select mode="default" v-model="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">未提交</a-select-option>
                <a-select-option value="1">已提交</a-select-option>
                <a-select-option value="2">待更新</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getLocal">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParam={title: '',url: '',status: ''};getLocal()">重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table :loading="loading" @change="getLocal" ref="table" size="default" rowKey="local_id" :pagination="false"
      :columns="columns" :dataSource="data">
      <span slot="local_id" slot-scope="text,record,index">{{ index + 1 }}</span>
      <span slot="createTime" slot-scope="text">{{text | timeFilter}}</span>
      <span slot="saveTime" slot-scope="text">{{text | timeFilter}}</span>
      <div slot="url" slot-scope="text">
        <a target="_blank" :href="text">{{text.slice(0,36)}}{{text.length>36?'...':''}} </a>
      </div>
      <span slot="syncStatus" slot-scope="text,record">
        <a-badge :status="record._id?record.syncStatus?'warning':'success':'default'"
          :text="record._id?record.syncStatus?'待更新':'已提交':'未提交'" />
      </span>
      <span slot="action" slot-scope="text,record,index">
        <template>
          <a-dropdown v-if="!record._id">
            <a class="ant-dropdown-link">
              提交
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a @click="createWork(record,true)">提交并发布</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="createWork(record,false)">仅提交</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-divider type="vertical" v-if="!record._id" />
          <a v-if="record._id && record.syncStatus" @click="updateWork(record)">更新</a>
          <a-divider type="vertical" v-if="record._id && record.syncStatus" />
          <a @click="editTranslation(record.local_id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteTranslation(index)">删除</a>
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
import chromeAPI from '../../module/chrome'
import api from '../../module/api'
import moment from 'moment'

const columns = [
  { title: '序号', dataIndex: 'local_id', width: '80px', scopedSlots: { customRender: 'local_id' } },
  { title: '标题', dataIndex: 'title', width: '180px', },
  { title: '语言', dataIndex: 'language', },
  { title: '马甲', dataIndex: 'avatar', width: '180px', },
  { title: '源地址', dataIndex: 'url', scopedSlots: { customRender: 'url' } },
  { title: '状态', dataIndex: 'syncStatus', width: '100px', scopedSlots: { customRender: 'syncStatus' } },
  { title: '创建时间', dataIndex: 'createTime', width: '120px', scopedSlots: { customRender: 'createTime' } },
  { title: '最近更新', dataIndex: 'saveTime', width: '120px', scopedSlots: { customRender: 'saveTime' } },
  { title: '操作', dataIndex: 'action', width: '180px', scopedSlots: { customRender: 'action' } },
]

export default {
  data() {
    this.columns = columns
    return {
      loading: false,
      queryParam: {
        title: '',
        url: '',
        status: '',
      },
      data: [],
    }
  },
  filters: {
    timeFilter(time) {
      if (time) {
        if (!window.isNaN(time * 1)) {
          return moment.unix(time / 1000).format('YYYY/MM/DD HH:mm:ss')
        } else {
          return moment(new Date(time)).format('YYYY/MM/DD HH:mm:ss')
        }
      } else { return '' }
    },
  },
  created() {
    this.getLocal()
  },
  methods: {
    async createWork(record, releaseStatus) {
      if (record._id) { return }
      let konjac_user = await chromeAPI.getlocal(`konjac_user`)
      if (!konjac_user) { this.$message.info('请登录账号后提交'); this.$router.push('/login'); return }
      let item = await chromeAPI.getlocal(`translation-${record.local_id}`)
      if (!item) { return }
      let data = item ? JSON.parse(item) : null
      try {
        let { _id, body, ...translation } = data
        translation.body = JSON.stringify(data.body)
        translation.releaseStatus = releaseStatus ? 0 : 1
        let res = await api.createWork(translation)
        translation.syncTime = res.data.result.syncTime
        translation.saveTime = translation.syncTime
        translation.syncStatus = 0
        translation._id = res.data.result._id
        let existed = this.data.find(ele => ele.local_id == record.local_id)
        Object.assign(existed, translation)
        Object.assign(data, translation)
        await chromeAPI.savelocal({ 'translation': JSON.stringify(this.data) })
        await chromeAPI.savelocal({ [`translation-${record.local_id}`]: JSON.stringify(data) })
        this.$message.success('上传成功')
        this.$forceUpdate()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async updateWork(record) {
      let konjac_user = await chromeAPI.getlocal(`konjac_user`)
      if (!konjac_user) { this.$message.info('请登录账号后提交'); this.$router.push('/login'); return }
      try {
        let item = await chromeAPI.getlocal(`translation-${record.local_id}`)
        if (!item) { return }
        let data = item ? JSON.parse(item) : null
        if (!data) { return }
        let update = {
          title: data.title,
          keywords: data.keywords,
          message: data.message,
          avatar: data.avatar,
          language: data.language,
          defaultRule: data.defaultRule,
          body: typeof data.body == 'string' ? data.body : JSON.stringify(data.body),
        }
        let res = await api.updateWork(record._id, update)
        record.syncStatus = data.syncStatus = 0
        record.syncTime = data.syncTime = Date.parse(new Date)
        await chromeAPI.savelocal({ 'translation': JSON.stringify(this.data) })
        await chromeAPI.savelocal({ [`translation-${record.local_id}`]: JSON.stringify(data) })
        this.$message.success('更新成功')
        this.$forceUpdate()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async getLocal() {
      this.loading = true
      let data = await chromeAPI.getlocal('translation')
      let list = data ? JSON.parse(data) : []
      this.data = list.filter(ele => {
        return ele.title.includes(this.queryParam.title)
          && ele.url.includes(this.queryParam.url)
          && (this.queryParam.status ? (this.queryParam.status * 1 ? (this.queryParam.status == '2' ? (ele.syncStatus && ele._id) : ele._id) : !ele._id) : true)
      })
      this.loading = false
      this.$forceUpdate()
    },
    async deleteTranslation(index) {
      this.$confirm({
        okType: 'danger',
        width: 300,
        content: `删除该项目`,
        onOk: async () => {
          let item = this.data.splice(index, 1)
          await chromeAPI.removelocal(`translation-${item.local_id}`)
          await chromeAPI.savelocal({ 'translation': JSON.stringify(this.data) })
        },
        okText: '确定',
        cancelText: '取消',
      })

    },
    async editTranslation(id) {
      let message = {
        type: 'editor-translation',
        local_id: id,
        tabId: 'new'
      }
      chrome.runtime.sendMessage(message, function (response) {
      });
    }
  }
}
</script>

<style lang="less">
#local {
  .ant-form-item {
    width: 100%;
  }
}
</style>