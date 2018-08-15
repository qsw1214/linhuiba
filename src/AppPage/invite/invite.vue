<template lang="html">
  <div class="invite-wraper">

    <div class="img-box">
       <div class="img"></div>
    </div>
    <div class="invite-code ct">
        <span class="invite">您的激活码：</span>
        <span class="code">{{ code }}</span>
    </div>
    <p class="invite-title ct">邀请好友 赚取邻汇基金</p>
    <div class="desc ct">
      <p>好友使用该邀请码注册</p>
      <p>成功下单或发布场地，可返现￥100，您亦可返￥100</p>
    </div>
    <div class="rule ct">
      <router-link to="/appArticle/46">
        <span>详细规则</span><span class="right-arrow"></span>
      </router-link>
    </div>
    <div class="invite-friend ct" @click="inviteBtn">邀请好友</div>
    <div class="my-invite">
      <div class="title">
          <divider>我的邀请</divider>
      </div>

      <table class="table" border="0" cellspacing="0" cellpadding="0">
         <thead class="thead">
            <tr>
                <th>被邀请人</th>
                <th>注册时间</th>
                <th>是否下单</th>
            </tr>
         </thead>
         <tbody class="tbody">
            <tr v-for="( item , index ) in inviteList" :key="index">
                <td>{{ item.invite_mobile }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.is_ordered ? '是' : '否' }}</td>
            </tr>
         </tbody>
      </table>
    </div>
    <split-content></split-content>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import splitContent from 'src/components/splitContent';
  import { Divider } from 'vux';
  import { getInvite , userInfo } from 'src/service/getData';
export default {
  data () {
    return {
      code : '' , // 激活码
      inviteList : [] , // 邀请列表
    }
  },
  created(){
    this.code = this.$route.query.invite_code ;
  },
  components : { Divider ,splitContent },
  mounted(){
    userInfo().then(res => {
      this.code = res.result.invite_code;
    });
    let params = {
      page : 1,
      pageSize : 10,
      status : 0,  // 0 未发放 1 已发放
    };
    getInvite(params).then( res => {
      this.inviteList = res.result ;
    });

  },
  methods : {
    inviteBtn(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('shareToWechat', "微信分享" , function (data) {}) ;
      });
    }

  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .invite-wraper{
    overflow: hidden;
    background-color: #fff;
    .img-box{
       margin-top: 0.78rem;
      .img{
        margin: 0 auto;
        @include wh( 4.52rem , 3.58rem );
        @include bg-image('../../images/ic_invitation_code_three');
      }
    }
    .invite-code{
        margin-top: 0.5rem;
        font-size: 0.28rem;
        .invite{
            color: #666;
        }
        .code{
            color: $mainColor;
        }
    }
    .invite-title{
        margin-top: 0.5rem;
        font-size: 0.36rem;
        color: #000;
    }
    .desc{
        line-height: 0.38rem;
        margin-top: 0.3rem;
        font-size: 0.24rem;
        color: #666;
    }
    .rule{
        margin-top: 0.4rem;
        font-size: 0.28rem;
        color: #666;
        .right-arrow{
          display: inline-block;
          vertical-align: top;
          margin:0.03rem 0 0 0.2rem;
          @include wh( 0.13rem , 0.26rem );
          @include bg-image( '../../images/ic_next_two_four_one' );
        }
    }
    .invite-friend{
        @include wh( 7rem , 0.88rem );
        line-height: 0.88rem;
        margin: 0.6rem auto 0;
        background-color: $mainColor;
        font-size: 0.3rem;
        color: #fff;
        border-radius: 0.04rem;
    }
    .my-invite{
        margin-top: 0.62rem;
        .title{
            height: 1.4rem;

            background: $bgc;
            font-size: 0.28rem;
            .vux-divider{
                padding: 0 0.28rem;
                line-height: 1.4rem;
                color: #000;
            }
        }
    }
    .table{
      border-collapse:collapse;
      width: 100%;
      .thead{
        > tr {
          height: 0.8rem;
          font-size: 0.26rem;
          >th{
            font-weight: normal;
          }
        }
      }
      .tbody{
        >tr{
          border: 1px solid #ddd;
          padding: 0 0.28rem  ;
          height: 0.8rem;
          font-size: 0.24rem;
          color: #666;
          > td{
            text-align: center;
          }
        }
      }
    }
  }
</style>
