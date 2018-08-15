<template lang="html">
  <div class="info-wraper">
    <div class="info" v-if="type==1">
      <span>为您筛选地铁站点附近5公里的场地</span>，<span>共{{ total || 0 }}条结果</span>
    </div>
    <div class="info" v-else>
       共{{ total || 0 }}条结果
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props : ['type', 'total']
}
</script>
<style lang="scss" scoped>
  .info-wraper{

    width: 100%;
    height: 0.56rem;
    line-height: 0.56rem;
    background-color: #fff;
    .info{
      height: 100%;
      font-size: 0.22rem;
      color: #999;
      text-align: center;
      background-color: #eee;
    }
  }
</style>
