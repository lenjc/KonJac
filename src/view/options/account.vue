<template>
  <div>
    <a-form :label-col="{ span: 1}" :wrapper-col="{ span: 23 }">
      <a-form-item label="ID">
        <span style="cursor: pointer;" @click="openAccountPage(account.id)">{{account.id}}</span>
      </a-form-item>
      <a-form-item label="用户名">
        {{account.username}}
      </a-form-item>
      <a-form-item label="邮箱">
        {{account.email}}
      </a-form-item>
      <a-form-item label="密码">
        ***
        <a-icon @click="visible.password=true" type='edit' class="edittip" />
        <a-modal :width="300" title="更改密码" :visible="visible.password" okText="确定" cancelText="取消"
          @cancel="visible.password=false" @ok="resetPassword">
          <a-form layout="horizontal" :labelCol="{ span:6 }" :wrapperCol="{span: 6 }">
            <a-form-item label="验证码:" :validateStatus="validateStatus.captcha" :help="help.captcha">
              <a-row>
                <a-col :span="10">
                  <a-input style="width:100%" v-model="resetPsw.captcha" @blur="validateCaptcha" />
                </a-col>
                <a-col :span="8">
                  <a-button type="primary" style="margin-left:8px" :disabled="disabled" @click="sendResetPswCaptcha">
                    {{disabledTime?`${disabledTime}s `:'获取'}}</a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="新密码:" :validateStatus="validateStatus.psw" :help="help.psw">
              <a-input-password v-model="resetPsw.psw" style="width:70%" @blur="validatePsw"></a-input-password>
            </a-form-item>
            <a-form-item label="重复密码:" :validateStatus="validateStatus.pswb" :help="help.pswb">
              <a-input-password v-model="resetPsw.pswb" style="width:70%" @blur="validatePswb"></a-input-password>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-form-item>
      <a-form-item label="我的作品">
        <a-radio-group v-model="account.workVisiable" button-style="solid" @change="setWorkVisiable">         
          <a-radio-button :value="0">
            全部隐藏
          </a-radio-button>
           <a-radio-button :value="1">
            全部展示
          </a-radio-button>
          <a-radio-button :value="2">
            展示最近10个
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

import chromeAPI from '../../module/chrome'
import api from '../../module/api'
import md5 from 'md5'

export default {
  data() {
    return {
      disabled: false,
      disabledTime: 0,
      resetPsw: {
        captcha: '',
        psw: '',
        pswb: '',

      },
      captcha: '',
      validateStatus: {
        captcha: '',
        psw: '',
        pswb: ''
      },
      help: {
        captcha: '',
        psw: '',
        pswb: ''
      },
      visible: {
        password: false,
        username: false,
      },
      data: {
        username: '',
        email: '',
        workVisiable: 1,
      },
      account: {
        username: '',
        email: '',
        workVisiable: 1,
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async openAccountPage(id) {
      let baseUrl = await chromeAPI.getlocal('netconfig')
      if (!baseUrl) { baseUrl = 'http://api.konjac.fun' }
      chrome.tabs.create({ url: `${baseUrl}/public/user/${id}` })
    },
    async getUserInfo() {
      try {
        let res = await api.getUserinfo()
        this.account.id = res.data.result._id
        this.account.username = this.data.username = res.data.result.username
        this.account.email = this.data.email = res.data.result.email
        this.account.workVisiable = res.data.result.workVisiable
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async sendResetPswCaptcha() {
      this.disabled = true
      await api.passwordCaptcha({ email: this.account.email })
      this.disabledTime = 60
      let click = setInterval(() => {
        this.disabledTime--
      }, 1 * 1000);
      setTimeout(() => {
        this.disabled = false
        window.clearInterval(click)
      }, 60 * 1000);
    },
    validateCaptcha() {
      if (this.resetPsw.captcha.trim().length == 6) {
        this.validateStatus.captcha = ''
        this.help.captcha = ''
        return true
      } else {
        this.validateStatus.captcha = 'warning'
        this.help.captcha = '请输入6位验证码'
        return false
      }
    },
    validatePsw() {
      if (this.resetPsw.psw.trim().length > 5 && this.resetPsw.psw.trim().length < 25) {
        this.validateStatus.psw = ''
        this.help.psw = ''
        return true
      } else {
        this.validateStatus.psw = 'warning'
        this.help.psw = '请输入6-24位密码'
        return false
      }
    },
    validatePswb() {
      if (this.resetPsw.psw != this.resetPsw.pswb) {
        this.validateStatus.pswb = 'warning'
        this.help.pswb = '请输入一致密码'
        return false
      } else {
        this.validateStatus.pswb = ''
        this.help.pswb = ''
        return true
      }
    },
    async setWorkVisiable(e) {
      await api.setUserinfo({ workVisiable: e.target.value * 1 })
    },
    async resetPassword() {
      try {
        if (!(this.validateCaptcha() && this.validatePsw() && this.validatePswb())) { return }
        await api.resetPassword({
          email: this.account.email,
          captcha: this.resetPsw.captcha,
          password: md5(this.resetPsw.psw)
        })
        this.visible.password = false
        await chromeAPI.removelocal('konjac_user')
        this.$router.push('/login')
      } catch (error) {
        switch (error.response.data.code) {
          case 4:
            this.validateStatus.captcha = 'error'
            this.help.captcha = '验证码错误'
            break;
          default:
            this.validateStatus.psw = 'error'
            this.help.psw = '更改错误'
            break;
        }
      }
    }
  }
}
</script>

<style lang="less">
.edittip {
  cursor: pointer;
  :hover {
    color: #4f80ff;
  }
}
</style>