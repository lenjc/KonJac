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
        <button class="param-button"  @click="resetPosition">复位</button>
      </div>
      <div class="param-container">
        <div>位置</div>
        <div>
          <paramsInput title="X" :value="selectedItem.left" :args="['selectedItem','left']" step="1" min="0"
            @paramChange="paramChange" />
          <paramsInput title="Y" :value="selectedItem.top" :args="['selectedItem','top']" step="1" min="0"
            @paramChange="paramChange" />
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
      currentTab: 'base'
    }
  },
  methods: {
    resetPosition() {
      this.$emit('paramChange', ['selectedItem', 'top'], this.selectedItem.position.y)
      this.$emit('paramChange', ['selectedItem', 'left'], this.selectedItem.position.x)
    },
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    }
  }
}
</script>