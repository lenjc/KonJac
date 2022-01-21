<template>
  <div class="param-item" data-type="params">
    <div>图片</div>
    <select style="border:none" class="param-select" v-model="data" @change="valueChange">
      <option v-for="(item,index) in options" :key="`background-options-${index}`" :value="item.value">
        {{item.label}}</option>
    </select>
    <a-modal size="small" :visible="quoteVisible" @cancel="quoteVisible=false" :closable="false"
      :bodyStyle="{padding:0}">
      <!-- <input type="text" > -->
      <a-table :columns="columns" rowKey="uid" :data-source="sourceList" :pagination="false">
        <span slot="uid" slot-scope="text,record,index">{{index+1}}</span>
        <span slot="type" slot-scope="text,record">{{text}}-{{record.shape}}</span>
        <div slot='src' slot-scope="text">
          <img style="max-height:150px;max-width:150px" :src="text" />
        </div>
        <div slot='action' slot-scope="text,record,index">
          <a @click="quote(record)">使用</a>
        </div>
      </a-table>
    </a-modal>        
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: "uid",
    key: "uid",
    title: "序号",
    scopedSlots: { customRender: 'uid' },
  },
  {
    dataIndex: 'type',
    title: '类型',
    scopedSlots: { customRender: 'type' },
  },
  {
    dataIndex: 'src',
    title: '预览',
    scopedSlots: { customRender: 'src' },
  },
  {
    width: 120,
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
export default {

  props: {
    dataSource: Array,
    value: String,
  },
  data() {
    this.columns = columns
    return {
      // url:'',
      data: this.value,
      quoteVisible: false,
      sourceList: [],
      options: [
        { value: 'none', label: '无' },
        // { value: 'url', label: '外链' },
        { value: 'quote', label: '引用' }
      ]
    }
  },
  watch: {
    value(val, old) {
      this.data = val
    }
  },
  methods: {
    showModal() {
      this.quoteVisible = true
      this.sourceList = []
      this.dataSource.forEach(page => {
        page.item.forEach(ele => {
          if (ele.type == 'clip') {
            this.sourceList.push(ele)
          }
        })
      });
    },
    valueChange() {
      switch (this.data) {
        case 'quote':
          this.showModal()
          break;
        case 'none':
          this.$emit('paramChange', ['selectedTextStyle', 'container', 'background-image'], { 'value': 'none', 'src': '', 'uid': '', 'type': '' })
          break;
      }
    },
    quote(item) {
      this.$emit('paramChange', ['selectedTextStyle', 'container', 'background-image'], { 'value': 'quote', 'src': item.src, 'uid': item.uid, 'type': item.type })
      this.quoteVisible = false
    }
  },


}
</script>

<style lang="less" scoped>
.sourceList-img {
  max-height: 200px;
}
</style>