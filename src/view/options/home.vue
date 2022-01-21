<template>
  <a-layout id="home">
    <a-layout-sider >
      <div class="logo" style="color:#3993a4">
        <embed src="img/KonJac.svg" width="24" height="24" type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/" style="margin-right:5px" /><span style="color:#cba67e">K</span>on<span style="color:#1cbedb">J</span>ac
      </div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :selectedKeys="[selectedKeys]">
        <a-menu-item key="local" @click="routerPush('local')">
          <a-icon type="desktop" />
          <span>本地工作区</span>
        </a-menu-item>
        <a-menu-item key="online" @click="routerPush('online')">
          <a-icon type="cloud-server" />
          <span>在线项目</span>
        </a-menu-item>
        <a-menu-item key="account" @click="routerPush('account')">
          <a-icon type="user" />
          <span>账号管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <div v-if="userinfo.username">
          <a-dropdown placement="bottomRight">
            <a-avatar shape="circle" size="default" @click="routerPush('account')"
              style="backgroundColor:rgb(0, 102, 204);verticalAlign:middle;cursor: pointer;">
              {{userinfo.username?userinfo.username.charAt(0):''}}
            </a-avatar>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="logout">退出</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff',height:'100%', minHeight: '908px' }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>

import chromeAPI from '../../module/chrome'
import api from '../../module/api'

export default {
  data() {
    return {
      collapsed: 'menu-fold',
      selectedKeys: 'local',
      userinfo: {
      },
    }
  },
  created() {
    this.selectedKeys = this.$route.name
    this.getUserInfo()
  },
  methods: {
    routerPush(path) {
      if (this.selectedKeys == path) { return }
      this.selectedKeys = path
      this.$router.push({ path: `/${path}` })
    },
    async logout() {
      await chromeAPI.removelocal('konjac_user')
      await chromeAPI.removelocal('konjac_userinfo')
      this.userinfo = {}
    },
    async getUserInfo() {
      let token = await chromeAPI.getlocal('konjac_user')
      if (!token) { return }
      let userinfo = await chromeAPI.getlocal('konjac_userinfo')
      if (!userinfo) {
        let res = await api.getUserinfo()
        this.userinfo = res.data.result
        await chromeAPI.savelocal({ 'konjac_userinfo': this.userinfo })
      } else {
        this.userinfo =typeof userinfo =='string'? JSON.parse(userinfo):userinfo
      }
    }
  }
}
</script>

<style lang="less">
#home {
  // height: -webkit-fill-available;
  // height: 100%;
  // width: 100%;
  // position: absolute;
  .logo {
    height: 32px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    margin: 16px;
    font-size: 28px;
    line-height: 32px;
    font-weight: bold;
    user-select: none;
    color: #666699;
    letter-spacing: 5px;
  }
  .trigger:hover {
    color: #1890ff;
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .layout-header {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    background: #fff;
  }
}
</style>