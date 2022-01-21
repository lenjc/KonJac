<template>
  <div id="konjac_tip">
    <div v-if="basetool=='svg'">
      点击图片创建SVG
    </div>
    <div v-if="basetool=='clip-rect'">
      点击图片并拖动剪裁
    </div>
    <div v-if="basetool=='clip-path'">
      点击图片创建区域剪裁
    </div>
  </div>
</template>

<script>
export default {
  props: {
    basetool: String,
  }
}
</script>

<style lang="less">
#konjac_tip {
  padding: 10px;
  color: #ccc;
}
</style>