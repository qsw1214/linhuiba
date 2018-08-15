<template lang="html">
  <div class="tips-wraper" v-if="show" :style="{ backgroundColor: bgc }">
     <div class="tips-icon"></div>
     <div class="tips-close-icon" @click.stop="close" v-if="tipsXshow"></div>
     <div class="btn" v-show="tipsBtn"><slot name="link"></slot></div>
     <div class="tips-center ellipsis">
        <div class="relative">
          <slot name="text"></slot>
        </div>
     </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      show : true ,
    }
  },
  props: {
    bgc: {
      default : '#E5F1FF'
    },
    tipsXshow : { default : true },
    tipsBtn : { default : false }
  },
  methods:{
    close(){
      this.show = false ;
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .tips-wraper{
    padding: 0 0.24rem;
    line-height: 0.6rem;
    height: 0.6rem;
    font-size: 0.24rem;
    color: $mainColor;
    position: relative;
    .tips-center{
      padding: 0 .2rem 0 0.4rem;
      font-size: 0.24rem;
      .relative{
        height: 0.6rem;
        overflow: hidden;
      }
    }
    .tips-icon{
      position: absolute;
      top: 0.16rem;
      left: 0.24rem;
      @include wh(0.28rem,0.28rem);
      @include bg-image('../images/ic_tips_blue');
    }
    .tips-close-icon{
      position: absolute;
      top: 0.1rem;
      right: 0.2rem;
      @include wh(0.4rem,0.4rem);
      @include bg-image('../images/ic_close_blue');
    }
    .btn{
      position: absolute;
      top: 0.12rem;
      right: 0.7rem;
      @include wh(0.8rem,0.36rem);
      line-height: 0.36rem;
      text-align: center;
      font-size: 0.24rem;
    }
  }
</style>
