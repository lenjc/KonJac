<template>
  <div class="basetool-tab">
    <!-- <div class="param-tab-options">
      <div v-for="(item,index) in [{value:'base',label:'基础'}]" :key="'paramTab-'+index" @click="currentTab=item.value"
        data-type="params" :class="{'param-tab-option-selected':(currentTab==item.value)}">
        {{item.label}}
      </div>
    </div> -->
    <div class="param-tab">
      <div class="param-container">
        <div>位置</div>
        <div>
          <paramsInput title="X" :value="selectedItem.left*1" :args="['selectedItem','left']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInput title="Y" :value="selectedItem.top*1" :args="['selectedItem','top']" step="1" min="0"
            @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>范围</div>
        <div>
          <paramsInput title="width" :value="selectedItem.style.width.match(/\d+/)[0]*1"
            :args="['selectedItem','style','width']" step="1" min="0" :format="(val)=>{return `${val}px`}"
            @paramChange="paramChange" />
          <paramsInput title="height" :value="selectedItem.style.height.match(/\d+/)[0]*1"
            :args="['selectedItem','style','height']" step="1" min="0" :format="(val)=>{return `${val}px`}"
            @paramChange="paramChange" />
        </div>
      </div>
      <div class="param-container">
        <div>位移</div>
        <div>
          <paramsInput title="x" :value="selectedItem.translate.x* 1" :args="['selectedItem','translate','x']"
            step="1" min="0" @paramChange="paramChange" />
          <paramsInput title="y" :value="selectedItem.translate.y*1" :args="['selectedItem','translate','y']"
            step="1" min="0" @paramChange="paramChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paramsInput from '../components/paramsInputNum.vue'

export default {
  props: {
    selectedItem: Object,
  },
  components: {
    paramsInput: paramsInput,
  },
  data() {
    return {
      currentTab: 'base',
    }
  },
  methods: {
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    }
  }
}
</script>