<template lang="html">
  <div class="label-wraper" v-if="labelText">
    {{ labelText }}
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props : ['labelText']
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .label-wraper{
    position: absolute;
    bottom: 0.1rem;
    left: 0.1rem;
    height: 0.28rem;
    line-height: 0.3rem;
    padding: 0 0.06rem;
    font-size: 0.2rem;
    color: #fff;
    background-color: rgba(0,0,0,0.3);
  }
</style>
