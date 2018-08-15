<template lang="html">
  <div class="transparent-head" ref="thead">
     <div class="transparent-head-left">
        <div class="backIcon" v-if="goBack&&hide" @click="go_back"></div>
        <div class="back" v-if="!goBack">
          <router-link :to="path">
            <div class="backIcon"></div>
          </router-link>
        </div>
     </div>
     <div class="transparent-head-center ct" ref="center">
        <slot name="center-part"></slot>
     </div>
     <div class="transparent-head-right">
        <slot name="right-part"></slot>
     </div>
  </div>
</template>

<script>
  import { getStyle } from 'src/config/tools';
export default {
  name : 'scroolhead' ,
  data () {
    return {
      hide : this.$route.query.BackKey ? false : true ,
    }
  },
  props : {
    'path': {
      default : '/home'
    },
    'goBack' : {
      default : false
    },
    'height' : {
      default : 150
    }
  },
  mounted(){
    window.addEventListener( 'touchmove' , () => {
      let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
      let h = this.height ;
      let head =  this.$refs.thead ;
      let t = h - getStyle(head , 'height' );
      let n = top / t ;
      try{
        head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
        head.style.borderBottom = `1px solid rgba( 232,232,232 , ${ n*1 })`;
        this.$refs.center.style.opacity = `${ n*1 }`;
        head.className = 'transparent-head active';
      }catch(err){}
      if( top <= 10 ) {
        try {
          head.style.background = `rgba( 0,133,227,0)`;
          this.$refs.center.style.opacity = 0 ;
          head.className = 'transparent-head' ;
        } catch (err) {}
      }
    } , false );
    window.addEventListener( 'scroll' , () => {
      let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
      let h = this.height ;
      let head =  this.$refs.thead ;
      let t = h - getStyle(head , 'height' );
      let n = top / t ;
      try{
        head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
        head.style.borderBottom = `1px solid rgba( 232,232,232 , ${ n*1 })`;
        this.$refs.center.style.opacity = `${ n*1 }`;
        head.className = 'transparent-head active';
      }catch(err){}
      if( top <= 10 ) {
        try {
          head.style.background = `rgba( 0,133,227,0)`;
          this.$refs.center.style.opacity = 0 ;
          head.className = 'transparent-head' ;
        } catch (err) {}
      }
    } , false )
  },
  methods : {
    go_back(){
      this.$router.go(-1);
      // Internet Explorer和Opera从0开始，而Firefox、Chrome和Safari从1开始
//      let len = window.history.length ;
//      if(len <= 2){
//        this.$router.push('/home');
//      }else{
//        this.$router.go(-1);
//      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .transparent-head{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0 0.24rem;
    height: 0.9rem;
    line-height: 0.9rem;
    background-color: transparent;
    .transparent-head-left{
      flex: 1;
      .back{
        a{
          display: block;
        }
      }
      .backIcon {
        @include wh( 0.48rem , 0.48rem );
        @include bg-image("../images/nav_ic_back_white");
      }

    }
    .transparent-head-center{
      flex: 2;
      font-size: 0.36rem;
      opacity: 0;
    }
    .transparent-head-right{
      flex: 1;
    }
    &.active{
      .transparent-head-left{
        .backIcon{
          @include bg-image("../images/ic_back_black");
        }
      }
    }
  }
</style>
