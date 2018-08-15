<template lang="html">
  <div>
    <div class="fly-nav-wraper" ref="flynav">
      <router-link to="home" class="fly-nav-link"></router-link>
    </div>
  </div>
</template>

<script>
  import { animate , getStyle } from 'src/config/tools';
export default {
  data () {
    return {
    }
  },
  mounted(){
    let fly = this.$refs.flynav ;
    let w = getStyle(fly ,'width');
    window.addEventListener('touchmove' , (e) => {
      animate( fly , { right : `-${w+10}px` } , 500 , 'ease-out' );
      e.stopPropagation();
    } , { passive : true } );
    window.addEventListener('touchend' , (e) => {
      let interval = setTimeout( flyFunc , 2000 );
      function flyFunc(){
        animate( fly , { right : '10px' } , 500 , 'ease-out' , () => {
          clearTimeout(interval);
        } );
      }
      e.stopPropagation();
    });
  }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .fly-nav-wraper{
    position: fixed;
    top: 50%;
    right: 0.2rem;
    z-index: 50;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    box-shadow: 0 0 0.08rem #ddd;
    background-color: #fff;
    .fly-nav-link{
      display: block;
      height: 100%;
      background: url('../images/ic_homepage_normal_three@3x.png') center no-repeat;
      background-size: 0.45rem 0.45rem;
    }
  }
</style>
