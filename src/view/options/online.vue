<template>
  <div id="online-table">
    <div style="margin-bottom:20px">
      <a-form layout="inline" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="标题">
              <a-input style="width:100%" v-model.trim="queryParam.title" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="语言">
              <a-input v-model.trim="queryParam.language" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="马甲">
              <a-input v-model.trim="queryParam.avatar" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="源地址">
              <a-input v-model.trim="queryParam.url" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select mode="default" v-model="queryParam.releaseStatus">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">发布</a-select-option>
                <a-select-option value="1">下架</a-select-option>
                <a-select-option value="2">其它</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item :wrapper-col="{offset:4, span:20}">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="getWorks()">查询</a-button>
                <a-button style="margin-left: 8px" @click="refreshQuery();">重置</a-button>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table :loading="loading" @change="getWorks" ref="table" size="default" rowKey="_id" :pagination="pagination"
      :columns="columns" :dataSource="data">
      <span slot="local_id" slot-scope="text,record,index">{{ index + 1 }}</span>
      <span slot="createTime" slot-scope="text">{{text | timeFilter}}</span>
      <span slot="syncTime" slot-scope="text">{{text | timeFilter}}</span>
      <div slot="url" slot-scope="text,record ">
        <a-tag style="cursor: pointer;" @click="copyLink(record)">复制</a-tag>
        <a target="_blank" :href="text">{{text.slice(0,36)}}{{text.length>36?'...':''}} </a>
      </div>
      <span slot="releaseStatus" slot-scope="text,record">
        <a-badge :status="text | statusFilter" :text="text | textFilter" /> &nbsp;
        <a-tooltip v-if="record.approvalStatus==2">
          <template slot="title">
            <span>审核失败:{{record.approvalMsg}}</span>
          </template>
          <a-icon type="frown" fill='#87d068' />
        </a-tooltip>
        <a-tooltip v-if="record.approvalStatus==1">
          <template slot="title">
            <span>审核中</span>
          </template>
          <a-icon type="clock-circle" />
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="downloadWork(record)">拉取 </a>
          <a-divider type="vertical" v-if="[0,1].includes (record.releaseStatus)" />
          <a v-if="[0,1].includes (record.releaseStatus)"
            @click="updateStatus(record)">{{record.releaseStatus | actionFilter}}</a>
          <a-divider type="vertical" />
          <a @click="editTranslation(record)">编辑</a>
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
  { title: '状态', dataIndex: 'releaseStatus', width: '100px', scopedSlots: { customRender: 'releaseStatus' } },
  { title: '创建时间', dataIndex: 'createTime', width: '120px', scopedSlots: { customRender: 'createTime' } },
  { title: '最近同步', dataIndex: 'syncTime', width: '120px', scopedSlots: { customRender: 'syncTime' } },
  { title: '操作', dataIndex: 'action', width: '190px', scopedSlots: { customRender: 'action' } },
]

export default {
  data() {
    this.columns = columns
    return {
      pagination: {
        pageSize: 40,
        current: 1,
        total: 1,
        showTotal: total => `共 ${total} 项`
      },
      loading: false,
      queryParam: {
        title: '',
        url: '',
        language: '',
        avatar: '',
        releaseStatus: '',
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
    statusFilter(code) {
      switch (code) {
        case 0: return 'success'
        case 1: return 'default'
        default: break;
      }
    },
    textFilter(code) {
      switch (code) {
        case 0: return '发布'
        case 1: return '下架'
        default: break;
      }
    },
    actionFilter(code) {
      switch (code) {
        case 0: return '下架'
        case 1: return '发布'
        default: break;
      }
    },
  },
  created() {
    this.getWorks()
  },
  methods: {
    async copyLink(record) {
      let url = record.url.includes('?') ? `${record.url}&KonJac${record._id}Z` : `${record.url}?KonJac${record._id}Z`
      navigator.clipboard.writeText(url)
        .then(() => { this.$message.success('复制成功') })
        .catch(() => { this.$message.error('复制失败') })
    },
    refreshQuery() {
      let re = false
      for (const key in this.queryParam) {
        if (this.queryParam[key]) {
          this.queryParam[key] = ''
          re = true
        }
      }
      if (re) { this.getWorks() }
    },
    async updateStatus(record) {
      try {
        await api.updateWork(record._id, { releaseStatus: record.releaseStatus ? 0 : 1 })
        this.$message.success('更新成功')
        record.releaseStatus = record.releaseStatus ? 0 : 1
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getWorks(e) {
      this.loading = true
      let params = this.queryParam
      params.pageNo = e ? e.current ? e.current : 1 : 1
      let { data, ...body } = await api.getWorkList(params)
      this.data = data.result.data
      this.pagination.current = data.result.pageNo
      this.pagination.pageSize = data.result.pageSize
      this.pagination.total = data.result.totalCount
      this.loading = false
    },
    async downloadWork(record) {
      let res = await api.getWork(record._id)
      let existed = await chromeAPI.getlocal(`translation-${record.local_id}`)
      if (existed) {
        this.$confirm({
          okText: '是',
          cancelText: '否',
          title: '覆盖本地项目?',
          onOk: async () => {
            let list = await chromeAPI.getlocal('translation')
            list = list ? JSON.parse(list) : []
            let listItem = list.find(ele => ele.local_id == record.local_id)
            res.data.result.syncStatus = 0
            res.data.result.syncTime = Date.parse(new Date)
            let { body, ...item } = res.data.result
            if (listItem) { Object.assign(listItem, item) } else { list.push(item) }
            await chromeAPI.savelocal({ 'translation': JSON.stringify(list) })
            await chromeAPI.savelocal({ [`translation-${record.local_id}`]: JSON.stringify(res.data.result) })
            this.$message.success('下载完成')
          },
          onCancel() { },
        });
      } else {
        let list = await chromeAPI.getlocal('translation')
        list = list ? JSON.parse(list) : []
        let { body, ...item } = res.data.result
        list.push(item)
        await chromeAPI.savelocal({ 'translation': JSON.stringify(list) })
        await chromeAPI.savelocal({ [`translation-${record.local_id}`]: JSON.stringify(res.data.result) })
        this.$message.success('下载完成')
      }
    },
    async editTranslation(record) {
      let existed = await chromeAPI.getlocal(`translation-${record.local_id}`)
      if (!existed) {
        let res = await api.getWork(record._id)
        let list = await chromeAPI.getlocal('translation')
        list = list ? JSON.parse(list) : []
        let { body, ...item } = res.data.result
        list.push(item)
        await chromeAPI.savelocal({ 'translation': JSON.stringify(list) })
        await chromeAPI.savelocal({ [`translation-${record.local_id}`]: JSON.stringify(res.data.result) })
      }
      chrome.runtime.sendMessage({ type: 'editor-translation', local_id: record.local_id, tabId: 'new' }, function (response) { console.log(response) });
    }
  }
}
</script>


<style lang="less">
#online-table {
  height: 100%;
  .ant-form-item {
    width: 100%;
  }
}
</style>