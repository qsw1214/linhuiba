<template lang="html">

 <div> 正在开发中...</div>

</template>

<script>
export default {
  data () {
    return {
      opts: {
        start: 0,
        dir: 'v',
        loop: true,
        duration: 500,
        stopPageScroll: true,
        beforeChange: function (prev, next) {
        },
        afterChange: function (prev, next) {
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .page-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

</style>
