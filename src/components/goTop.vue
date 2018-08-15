<template lang="html">
  <div>
    <aside class="go-top-btn" @click.stop="goTop" v-if="showBackStatus"></aside>
  </div>
</template>

<script>
  import { showBack , getStyle , animate } from 'src/config/tools';
export default {
  data () {
    return {
      showBackStatus : false
    }
  },
  mounted(){
    showBack( status => {
      this.showBackStatus = status;
    });
  },
  methods : {
    goTop(){
      animate( document.body , { scrollTop : 0 } , 500 , 'ease-out' );
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .go-top-btn{
    position: fixed;
    right: 0.24rem;
    bottom: 2rem;
    width: 0.8rem;
    height: 0.8rem;
    @include bg-image('../images/ic_up_normal_three');
  }

</style>
