<template>
  <div id="app">
      <div>
        <div>ID：{{data.id}} </div>
        <div class="username"> {{data.username}} <a-tag @click="copyText(data.username)">复制</a-tag>
        </div>
      </div>
      <div style="margin-top:10px">
        作品列表：
        <div v-for="(item,index) in data.works" :key="'work-'+index" class="work-item">
          <div>ID:{{item._id}}</div>
          <div style="font-size:16px;">[{{item.language}}]{{item.title}}</div>
          <div>{{item.keywords.join(',')}}</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;">
            <div> [译]：{{item.avatar}}</div>
            <div>{{item.releaseTime | timeFormat}}</div>
          </div>
        </div>
      </div> 
  </div>
</template>

<script>
import api from '../module/api'
import moment from 'moment'

export default {
  data() {
    return {
      data: {
        id: '',
        username: '',
        works: []
      }
    }
  },
  filters: {
    timeFormat(time) {
      return moment(time).format('YYYY-MM-DD HH:mm')
    }
  },
  created() {
    this.getBaseUrl(location.href.replace(/.*user.html#\//, ''))
  },
  methods: {
    async getBaseUrl(id) {
      if (id.length != 24) { return }
      let res = await api.getUserList(id)
      res.data.result.works.sort((a, b) => b.createTime * 1 - a.createTime * 1)
      this.data = res.data.result
      document.title = 'KonJac - '+this.data.username
    },
    copyText(text) {
      navigator.clipboard.writeText(text)
        .then(() => { this.$message.success('复制成功') })
        .catch(() => { this.$message.error('复制失败') })
    }
  }
}
</script>

<style lang="less">
#app {
  position: absolute;
  width: 500px;
  // height: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  cursor: default;
  font-size: 14px;
  color: #37474f;
  background-color: rgba(255, 255, 255, 0.95);
}
.work-item {
  margin-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 5px 10px;
  > div {
    margin-bottom: 3px;
  }
}

.username {
  font-size: 26px;
}
</style>