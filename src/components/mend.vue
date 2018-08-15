<template lang="html">
  <div class="error-wraper">
    <div class="masks" @click.stop="cancle"></div>
    <div class="box">
      <div class="logo"><img src="../images/ic_blue_logo_three@2x.png" alt="a" ></div>
      <div class="title">纠错奖励</div>
      <div class="tit-desc">提交正确的场地信息，经邻汇吧审核后，将奖励300-500积分</div>
      <div class="res-name">
        <span class="tit">资源名称：</span><span class="name">{{ res_name }}</span>
      </div>
      <div class="error-content">
        <span class="tit">纠错内容：</span>
        <textarea maxlength="128" v-model="msg" placeholder="请填写资源信息与实际不符的内容(128字以内)"></textarea>
      </div>
      <div class="btn-box">
        <span class="cancle" @click.stop="cancle">取消</span>
        <span class="submit" @click.stop="submit">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { WORLD_HTML_REG } from 'src/config/data' ;
  import { postFeedBack } from 'src/service/getData' ;
export default {
  data () {
    return {
      msg : '',
      errorShow : false
    }
  },
  props : {
    'resource_id' : {
      default : ''
    },
    'res_name' : {
      default : ''
    }
  },
  methods:{
    submit(){
      if(this.msg){
        if( WORLD_HTML_REG.test(this.msg) ){
          this.$vux.toast.text('您输入的内容包含非法信息,请重新输入');
          this.msg = '' ;
          return ;
        }
      }else{
        this.$vux.toast.text('请输入反馈内容');
        return ;
      }

      let p = {
        resource_id : this.resource_id ,
        content : this.msg
      };
      postFeedBack( p ).then(res => {
        this.$vux.toast.text(res.msg);
        this.errorShow = false ;
      }).catch(err => {
        this.$vux.toast.text(err.msg );
      })
    },
    cancle(){
      this.$emit('close')
    }

  }
}

</script>

<style lang="scss" scoped>
  @import "../style/mixin";
  .error-wraper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    .masks{
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
    }
    .box{
      position: absolute;
      top: 50%;
      left: 0.35rem;
      transform: translateY(-50%);
      width: 6.8rem;
      height: auto;
      padding: 0 0.38rem;
      border-radius: 0.2rem;
      background-color: #fff;
      .logo{
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50% ;
        overflow: hidden;
        margin: -0.8rem auto 0.2rem;
        >img{
          width: 100%;
          height: 100%;
        }
      }
      .title{
        text-align: center;
        @include sc(0.32rem,$fontColor);
      }
      .tit-desc{
        margin-top: 0.2rem;
        @include sc(0.3rem,#666);
        padding-bottom: 0.2rem;
        border-bottom: 1px solid #e8e8e8;
      }
      .res-name{
        margin-top: 0.2rem;
        .tit{
          @include sc(0.3rem,$fontColor);
        }
        .name{
          @include sc(0.3rem,#666);
        }
      }
      .error-content{
        margin-top: 0.1rem;
        @include sc(0.3rem,$fontColor);
        .tit{

        }
        >textarea{
          display: block;
          margin: 0.1rem 0 0.2rem;
          padding: 0.2rem;
          width: 100%;
          height: 2rem;
          background-color: #fafafa;
          font-size: 0.28rem;
        }
      }
      .btn-box{
        display: flex;
        align-items: center;
        width: 100%;
        height: 1rem;
        line-height: 0.8rem;
        border-top: 1px solid #e8e8e8;
        font-size: 0.3rem;
        .cancle{
          flex: 1;
          height: 0.8rem;
          text-align: center;
          border-right: 1px solid #ddd;
        }
        .submit{
          flex: 1;
          height: 0.8rem;
          text-align: center;
          color: $mainColor;
        }
      }
    }
  }
</style>
