<template>
  <div :class="`param-item ${full?'param-item-full':''}`" data-type="params">
    <div>{{title}}</div>
    <input v-model="data" @input="paramChange(args,data)" @focus.stop="show=true" @blur.stop="show=false" />
    <transition name="slide-fade">
      <ul class="auto-complete" v-show="show">
        <li v-for="(item,index) in options" :key="`${args.join('-')}-options-${index}`"
          @click.stop="data=item;paramChange(args,item);">{{item}}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    full: false,
    title: String,
    value: String,
    args: Array,
    options: Array
  },
  data() {
    return {
      show: false,
      data: this.value
    }
  },
  watch: {
    value(val, old) {
      this.data = val
    }
  },
  methods: {
    paramChange(args, data) {
      this.$emit('paramChange', args, data)
    }
  }
}
</script>

<style lang="less" scoped>
.auto-complete {
  position: absolute;
  top: calc(100% + 5px);
  z-index: 999;
  list-style-type: "";
  padding: 0;
  width: 100%;
  background-color: #fff;
  li {
    width: 100%;
    height: 24px;
    line-height: 24px;
    padding-left: 10px;
    color: #4f80ff;
    cursor: pointer;
  }
  li:hover {
    background-color: rgba(0, 0, 0, 0.2);
    color: #000;
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10%);
  opacity: 0;
}
</style>