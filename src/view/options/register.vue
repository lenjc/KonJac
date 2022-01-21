<template>
  <div id="register" style="background-image:url(img/KonJac.svg);">
    <a-form :form="form" layout="horizontal" id="register-form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }"
      @submit="handleSubmit">
      <a-form-item :wrapper-col="{ offset:5, span: 16 }">
      <div style="width:100%;letter-spacing:12px;font-size:46px;font-weight:bold;user-select: none;color:#3993a4">
        <embed src="img/KonJac.svg" width="36" height="36" type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/" style="margin-right:5px" /><span
          style="color:#cba67e">K</span>on<span style="color:#1cbedb">J</span>ac
      </div>
      </a-form-item>
      <a-form-item label="账号" :validateStatus="validateStatus.username" :help="help.username" required>
        <a-input placeholder="可由汉字、字母、数字、下划线组成" @blur="checkUsername" @change="validateStatus.username=help.username=''"
          v-decorator="['username']" />
      </a-form-item>
      <a-form-item label="Email" :validateStatus="validateStatus.email" :help="help.email" required>
        <a-input placeholder="邮箱" @blur="checkEmail" @change="validateStatus.email=help.email=''"
          v-decorator="['email']" />
      </a-form-item>
      <a-form-item label="验证码">
        <div style="display:flex;justify-content: space-between;">
          <a-input placeholder="验证码"
            v-decorator="['captcha',{ rules: [{ required: true,len:6, message: '请输入6位验证码' }] } ]" style="width:50%" />
          <a-button type="primary" :loading="status.loading" style="width:45%" @click="getCaptcha"
            :disabled="status.emaildisabled">{{status.text}}</a-button>
        </div>
      </a-form-item>
      <a-form-item label="密码">
        <a-input-password
          v-decorator="['password',{ rules: [{ required: true,min:6,max:24, message: '请输入6位以上密码' },{validator: validateToNextPassword,},] }]" />
      </a-form-item>
      <a-form-item label="确认密码">
        <a-input-password v-decorator="['psw',{ rules: [{validator: compareToFirstPassword,},] }, ]"
          @blur="passwordConfirm" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 16,offset:5 }">
        <div style="width:100%;height:35px;display: flex;justify-content:space-between">
          <a-button type="default" style="width:45%" @click="$router.back()">返回</a-button>
          <a-button type='primary' style="width:45%" html-type="submit">注册</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

import md5 from 'md5'
import api from '../../module/api.js'

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },
  data() {
    return {
      validateStatus: {
        username: '',
        email: ''
      },
      help: {
        username: '',
        email: ''
      },
      status: {
        email: true,
        emaildisabled: false,
        loading: false,
        text: '获取',
        time: 30,
        confirmPsw: true
      },
      confirmDirty: false,
      data: {
        email: '',
        captcha: '',
        password: '',
        confirmPsw: '',
      }
    }
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      let username = await this.checkUsername()
      let email = await this.checkEmail()
      if (!username || !email) { return }
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) { return }
        let data = {
          username: values.username,
          email: values.email,
          captcha: values.captcha,
          password: md5(values.password)
        }
        api.register(data)
          .then(res => {
            this.$message.success('注册成功')
            this.$router.back()
          })
          .catch((error) => {
            switch (error.response.data.code * 1) {
              case 3: this.$message.error('该账号已存在'); break;
              case 4: this.$message.error('验证码错误'); break;
              default: this.$message.error('注册失败'); break;
            }
          })
      });
    },
    async checkEmail() {
      const form = this.form;
      let value = form.getFieldValue('email')
      if (!value) {
        this.validateStatus.email = 'error'
        return Promise.resolve(false)
      }
      let email = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
      if (!email.test(value)) {
        this.validateStatus.email = 'error'
        this.help.email = '请输入正确格式的邮箱'
        return Promise.resolve(false)
      }
      return Promise.resolve(true)
    },
    GetCharLength(str) {
      var iLength = 0;
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          iLength += 2;
        } else {
          iLength += 1;
        }
      }
      return iLength;
    },
    async checkUsername() {
      const form = this.form;
      let value = form.getFieldValue('username')
      if (!value) {
        this.validateStatus.username = 'error'
        return Promise.resolve(false)
      }
      let len = this.GetCharLength(value)
      if (len < 6 || len > 24) {
        this.validateStatus.username = 'error'
        this.help.username = '请限制在6-24字节内'
        return Promise.resolve(false)
      }
      let reg = new RegExp(/^[\u4e00-\u9fa5\w]+$/gm)
      if (!reg.test(value)) {
        this.validateStatus.username = 'error'
        this.help.username = '只能由汉字、字母、数字、下划线组成'
        return Promise.resolve(false)
      }
      let { data: { result } } = await api.checkUsername({ username: value })
      if (result) {
        this.validateStatus.username = 'error'
        this.help.username = '该账号名已被注册'
        return Promise.resolve(false)
      }
      return Promise.resolve(true)
    },
    passwordConfirm(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('请输入相同的密码!');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['psw'], { force: true });
      }
      callback();
    },
    async getCaptcha() {
      const form = this.form;
      let check = await this.checkEmail()
      if (!check) { return }
      this.status.loading = true
      try {
        this.status.text = '发送中'
        await api.sendRegisterCaptcha({ email: form.getFieldValue('email') })
        this.status.loading = false
        this.status.text = `已发送(${this.status.time})`
        this.status.emaildisabled = true
        const interval = window.setInterval(() => {
          this.status.time--
          this.status.text = `已发送(${this.status.time})`
          if (this.status.time <= 0) {
            this.status.time = 30
            this.status.emaildisabled = false
            this.status.text = '获取'
            window.clearInterval(interval)
          }
        }, 1000)
      } catch (error) {
        switch (error.response.data.code) {
          case 1:
            this.validateStatus.email = 'error'
            this.help.email = '该账号已存在'
            break;
          default:
            this.$message.warning('发送失败')
            break;
        }
        this.status.loading = false
        this.status.text = '获取'
      }
    }
  }
}
</script>

<style lang="less">
#register {
  width: 100%;
  height: 100%;
  padding: 5px;
  position: absolute;
  background-size: contain;
  background-position: center;
}

#register-form {
  position: absolute;
  width: 400px;
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
  margin: auto auto;
  .ant-row {
    margin-bottom: 10px;
  }
}
</style>