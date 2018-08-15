<template>
  <div>

    <div class="header border-1px" :class="{ fixed : isFixed , blue : blue, noIos: isIos && shortenHead }">
      <div class="app-fill" v-show="!(isIos && shortenHead)"></div>
      <flexbox :gutter="0">
        <flexbox-item :span="3">
          <!--返回上一页-->
          <div class="backIcon" v-if="goBack" @click="goBackOne"></div>
          <div class="back" v-else>

              <div class="backIcon" @click="goBackTwo"></div>

          </div>
        </flexbox-item>
        <flexbox-item :span="6">
          <div class="ct">
            <slot name="center-part"></slot>
          </div>
        </flexbox-item>
        <flexbox-item :span="3">
          <slot name="right-part"></slot>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="fill" :class="{noIos: isIos && shortenHead}" v-if="isFixed"></div>
  </div>
</template>

<script>

  import { Flexbox , FlexboxItem } from 'vux'
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import { isMobile } from 'src/config/isMobile';
  
  export default {
    data () {
      return {
        isIos : false,
        n : 0
      }
    },
    props : [ 'isFixed' , 'path' , 'blue' , 'goBack', 'birghtBack', 'brigeProp',  'shortenHead'] ,
    components : {
      Flexbox,
      FlexboxItem
    },
    mounted () {
      this.isIos = isMobile() > 0 ? true : false;
      console.log(this.isIos && this.shortenHead)
    },
    methods:{
      goBackOne(){
        this.$router.go(-1);
        return false ;
      },
      goBackTwo () {
        if (this.birghtBack) {
          let brightName = this.birghtBack
          let brigeProp = this.brigeProp
          this.appBrightGoBack(brightName, brigeProp)
        }
      },
      appBrightGoBack (brightName, brigeProp) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler(brightName, brigeProp, function (data) {}) ;
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/mixin' ;

  .header {
    position: relative;
    @include wh( 100% , 1.34rem );
    padding: 0 0.28rem;
    line-height: 0.9rem;
    background-color: $white;
    border-bottom: 1px solid #e8e8e8;
    &.blue{
      background-color: $mainColor;
      border-bottom: 0 none;
      .backIcon{
        @include wh( 0.48rem , 0.48rem );
        @include bg-image("../images/nav_ic_back_white");
      }
      .ct{
        line-height: 0.9rem;
        color: #fff;
      }
    }
    &.fixed {
      position: fixed;
      top:0;
      left: 0;
      z-index: 10;
    }
    .app-fill{
      width: 100%;
      height: 0.44rem;
    }
    .backIcon {
      @include wh( 0.48rem , 0.48rem );
      @include bg-image("../images/ic_back_black");
    }
    .back {
      a {
        display: inline-block;
        vertical-align: middle;
        width: 1rem;
      }
    }
    .ct {
      line-height: 0.9rem;
      font-size: 0.36rem;
    }
  }
  .fill {
    @include wh( 100% , 1.34rem );
    background-color: transparent;
  }
  .noIos {
    height: .9rem !important;
  }
</style>
