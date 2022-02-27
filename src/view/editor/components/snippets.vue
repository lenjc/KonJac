<template>
  <div class="basetool-tab">
    <div id="snippets">
      <div>
        <div>预设文本:{{snippetstitle}}</div>     
      </div>
      <div id="snippetsContainer">
        <div v-for="(item,index) in snippets" :key="'snippets-'+index" class="snippetsItem rightmouse" data-type='snippets'
        :data-id="item.id"
          :class="{'snippetsItemSeleted':seleted==item.id}" @click="paramChange(item.id)">
          <div>{{item.title}}</div>
          <div>{{item.value.body | bodyFilter}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    snippets: Array,
    seleted: String
  },
  data() {
    return {

    }
  },
  filters: {
    bodyFilter(body) {
      let div = document.createElement('div')
      div.innerHTML = body
      return div.innerText
    }
  },
  computed: {
    snippetstitle: function () {
      let s = this.snippets.find(ele => ele.id == this.seleted)
      return s ? s.title : ''
    }
  },
  methods: {
    paramChange(id) {
      this.$emit('paramChange', ['snippetsSeleted'], id)
    }
  }

}
</script>

<style lang="less">
#snippets {
  width: 100%;
  padding: 5px 5px;
  > div {
    width: 100%;
    display: flex;
    flex-direction: row;   
  }
  > div:nth-child(1) {
    margin-bottom: 5px;
    color: #ccc;
    justify-content: space-between;
  }
  #snippetsContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px 5px;
    flex-wrap: wrap;
  }
}
.snippetsItem {
  width: 48%;
  color: #ccc;
  background-color: #444;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  > div {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  > div:nth-child(2) {
    border-top: 1px dashed #ccc;
    padding-top: 5px;
    font-size: 16px;
  }
}

.snippetsItemSeleted {
  color: #fff;
  background-color: #4f80ff;
}
</style>