<template lang="html">
  <div>
    <div class="transparent-head" ref="thead">
       <div class="transparent-head-left">
          <div class="backIcon" v-if="goBack"></div>
          <div class="back" v-else>

              <div class="backIcon"></div>

          </div>
       </div>
       <div class="transparent-head-center ct" ref="center">
          <slot name="center-part"></slot>
       </div>
       <div class="transparent-head-right rt" ref="right">
          <span class="share-icon">
            <slot name="right-part"></slot>
          </span>
       </div>
    </div>
    <div class="fill"></div>
    <div class="fill-page"></div>
  </div>

</template>

<script>

  import { getStyle } from 'src/config/tools';
export default {
  name : 'scroolhead' ,
  data () {
    return {
    }
  },
  props : {
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
  }

}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .fill{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: 0.44rem;
    background-color: #fff;
  }
  .fill-page{
    width: 100%;
    height: 0.44rem;
  }
  .transparent-head{
    position: fixed;
    top: 0.44rem;
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
      .share-icon{
        display: inline-block;
        vertical-align: top;
        margin-top: 0.22rem;
        @include wh( 0.44rem , 0.44rem);
        @include bg-image("../images/ic_share_normal_white_three_three");
      }
    }
    &.active{
      .transparent-head-left{
        .backIcon{
          @include bg-image("../images/ic_back_black");
        }
      }
      .transparent-head-right{

        .share-icon{
          @include wh( 0.44rem , 0.44rem);
          @include bg-image("../images/ic_share_two_normal_gray_three");
        }
      }
    }
  }
</style>
