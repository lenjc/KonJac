<template>
  <div id="app">
    <workspace />
  </div>
</template>

<script>
import workspace from './editor/workspace.vue'
export default {
  components: {
    workspace
  },
}
</script>

<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  margin-top: -16px;
}
#app{
   font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
</style>