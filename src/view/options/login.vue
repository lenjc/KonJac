<template>
  <div id="login" style="background-image:url(img/KonJac.svg);background-size: contain;">
    <a-form layout="horizontal" id="login-form" :wrapper-col="{ span: 24 }">
      <div style="width:100%;letter-spacing:12px;font-size:46px;font-weight:bold;user-select: none;color:#3993a4">
        <embed src="img/KonJac.svg" width="36" height="36" type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/" style="margin-right:5px" /><span
          style="color:#cba67e">K</span>on<span style="color:#1cbedb">J</span>ac
      </div>
      <a-form-item :validateStatus="validateStatus.email" :help="help.email">
        <a-input placeholder="账号或邮箱" size="large" type="text" v-model="data.email">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item :validateStatus="validateStatus.psw" :help="help.psw">
        <a-input-password placeholder="密码" size="large" type="text" v-model="data.psw">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button type='primary' style="width:100%;height:40px" @click="login">
          登录
        </a-button>
      </a-form-item>
      <a-form-item>
        <div style="width:100%;height:35px;display: flex;justify-content:space-between">
          <a-button style="width:45%;height:35px" type="default" @click="$router.back()">返回</a-button>
          <a-button style="width:45%;height:35px" @click="$router.push('/register')">注册</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import api from '../../module/api.js'

export default {
  data() {
    return {
      validateStatus: {
        email: '',
        psw: ''
      },
      help: {
        email: '',
        psw: '',
      },
      data: {
        email: '',
        psw: ''
      }

    }
  },
  methods: {
    async login() {
      try {
        let body = { password: md5(this.data.psw) }
        let email = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
        if (email.test(this.data.email)) {
          body.email = this.data.email
        } else {
          body.username = this.data.email
        }
        console.log(body)
        let res = await api.login(body)
        chrome.storage.local.set({ 'konjac_user': res.data.result }, () => {
          this.$message.success('登录成功')
          this.$router.back()
        });
      } catch (error) {
        this.validateStatus.psw = 'error'
        this.help.psw = '账号或密码错误'
      }
    }
  }
}
</script>

<style lang="less">
#login {
  padding: 5px;
  width: 100%;
  height: 100%;
  position: absolute;
  
  background-position: center;
}
#login-form {
  position: absolute;
  width: 300px;
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
  margin: auto auto;
  .ant-row {
    margin-bottom: 10px;
  }
}
.ant-form-item-label {
  padding-bottom: 0px;
}
.ant-form-item {
  margin-bottom: 0px;
}
</style>