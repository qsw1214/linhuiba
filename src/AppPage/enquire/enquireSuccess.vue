<template lang="html">
  <div class="enquire-wraper">
    <div class="mask" @click="backStep"></div>
    <app-head>
      <div slot="center-part">提交成功</div>
    </app-head>
    <div class="content">
      <div class="bg-img"></div>
      <div class="bold">询价单提交成功</div>
      <div class="info">工作人员正在为您处理，请留意短信通知</div>
    </div>
    <div class="btns">
      <div class="back-home" @click.stop="back">返回首页</div>
      <div class="view-enquire" @click.stop="viewEnquireOrder">查看询价单</div>
    </div>
  </div>
</template>

<script>
  import appHead from 'src/components/appHead';
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
export default {
  data () {
    return {
      id : this.$route.query.id
    }
  },
  components: { appHead },
  methods:{
    backStep(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('backOneStep', "返回上一页" , function (data) {}) ;
      });
    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    },
    viewEnquireOrder(){
      let id = this.id ;
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('goEnquireDetail', id , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .enquire-wraper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .mask{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }
  .content{
    padding: 0.44rem 0 0.5rem;
    .bg-img{
      @include wh(2.02rem,2.02rem);
      margin: 0 auto;
      @include bg-image('../../images/ic_Submit_successfully');
    }
    .bold{
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.36rem;
    }
    .info{
      margin-top: 0.3rem;
      text-align: center;
      @include sc(0.26rem,#a9a9a9);
    }
  }
  .btns{
    display: flex;
    justify-content: space-between;
    padding: 0 1.2rem;
    .back-home{
      @include wh(2.36rem,0.64rem);
      line-height: 0.64rem;
      text-align: center;
      border: 1px solid #999;
      border-radius: 0.08rem;
    }
    .view-enquire{
      @include wh(2.36rem,0.64rem);
      line-height: 0.64rem;
      text-align: center;
      border-radius: 0.08rem;
      color: #fff;
      background-color: $mainColor;
    }
  }
</style>
