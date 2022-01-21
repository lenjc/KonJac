<template>
  <div id="lang-option">
    <div>
      <div v-for="(item,index) in lang" :key="'lang-'+index" class='lang-option' :class="{'lang-option-selected':language==item}" @click="language=item">{{item.label}}
      </div>
    </div>
    <div id="lang-submit">
      <span>请选择语言:{{language?language.label:''}}</span>
      <div>
        <a-button type="default" @click="$router.push('/')">取消</a-button>
        <a-button type="primary" :disabled="!language" @click="cerateNew()">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import lang from '../../module/lang'
const bg = chrome.extension.getBackgroundPage()
import chromeApi from '../../module/chrome'

export default {
  data() {
    this.lang = lang
    return {
      language: null
    }
  },
  methods: {
    async cerateNew() {
      let code = await chromeApi.getlocal(`script-${this.$route.params.codeId}`)
      console.log(this.$route.params.codeId)
      bg.toConnectSrcipt({ type: 'cookingMode', code: code, tabId: 'new', info: { language: this.language.value } })
      this.$router.push('/')
    }
  }

}
</script>

<style lang='less'>
#lang-option {
  position: relative;
  padding-bottom: 70px;
}
.lang-option {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  cursor: pointer;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.lang-option-selected{
    background-color:  #e8ecf1;
}
.lang-option:hover {
  background-color: #e8ecf1;
}
#lang-submit {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  > div {
    display: flex;
    padding: 0 10px 0 10px;
    justify-content: space-around;
  }
  > span {
    height: 30px;
    line-height: 30px;
    text-align: left;
  }
}
</style>