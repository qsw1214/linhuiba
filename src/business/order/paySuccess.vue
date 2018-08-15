<template lang="html">
  <div>
    <v-head path="/myorder?status=paid" isFixed="true">
      <div slot="center-part">支付成功</div>
      <div slot="right-part" class="nav-right">
        <router-link to="/home" class="nav-link">返回首页</router-link>
      </div>
    </v-head>
    <section class="success">
      <div class="pay-success"></div>
      <p class="success-text">支付成功</p>
      <p class="pay-info">您的订单已付款，正在为您排期，请留意短信通知。</p>
      <div class="invite-btn">
        <router-link to="/facilitatorlist" class="invite-link">场地搭建、物料运输，找优秀服务商</router-link>
      </div>
    </section>
    <section class="comment-img"></section>
    <section class="comment-box">
      <div class="title">
        <divider>待评价订单</divider>
      </div>
      <div class="comment-list">
        <div class="item" v-for="(item , index) in list" :key="index">
          <div class="title">
            <span class="field-icon" v-if="item.order_type==1"></span>
            <span class="ads-icon" v-else-if="item.order_type==2"></span>
            <span class="act-icon" v-else="item.order_type==3"></span><span>{{ item.community }}</span>
          </div>
          <div class="content">
            <div class="img-box">
              <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="资源图片">
              <span class="type-position">{{ item.field_type }}</span>
            </div>
            <div class="info">
              <p class="resource-name ellipsis">{{ item.field_name }}</p>
              <p class="resource-time ellipsis"><span>时间：</span><span>{{ item.start | timeFormat }}</span></p>
              <div class="resource-norm ellipsis">
                <span>规格：</span><span>{{ item.size | normFormat }}</span><span class="center-line"></span><span>{{ item.lease_term_type }}</span>
              </div>
              <div class="cus">
                <span class="item" v-if="item.custom_dimension">{{ item.custom_dimension }}</span>
              </div>
            </div>
            <div class="price">
              <span class="price-pre">￥</span><span class="number">{{ item.price / 100 | twoPoint }}</span>
            </div>
          </div>
          <div class="footer">
            <router-link :to="{ name : 'comment' , params : { id : item.order_item_id } }" class="comment-btn">评价</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { Divider } from 'vux';
  import { getSmallOrderList } from 'src/service/getData';
  import { timeFormat , twoPoint , normFormat , half } from 'src/filters/index';
export default {
  data () {
    return {
      list : [] , // 待评价订单
    }
  },
  components : {
    vHead,
    Divider
  },
  filters : { timeFormat , twoPoint , normFormat , half },
  mounted(){
    let params = {
      page : 1,
      pageSize : 10,
      status : 'finished'
    };
    getSmallOrderList(params).then( res => {
      this.list = res.result ;
    }).catch(err => {})
  },
  methods : {
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .nav-right{
    .nav-link{
      display: block;
      text-align: right;
      font-size: 0.28rem;
    }
  }
  .success{
    padding: 0 0.6rem;
    overflow: hidden;
    background-color: #fff;
    .pay-success{
      @include wh( 1.32rem , 1.32rem );
      margin: 0.54rem auto;
      @include bg-image('../../images/ic_success');
    }
    .success-text{
      text-align: center;
      font-size: 0.36rem;
    }
    .pay-info{
      margin-top: 0.2rem;
      font-size: 0.26rem;
      color: #A9A9A9;
      text-align: center;
    }
    .invite-btn{
      @include wh( 6rem , 0.88rem );
      margin: 0.4rem auto 0.4rem;
      line-height: 0.88rem;
      border-radius: 0.08rem;
      text-align: center;
      background-color: $mainColor;
      .invite-link{
        display: block;
        font-size: 0.34rem;
        color: #fff;
      }
    }
  }
  .comment-img{
    margin-top: 0.2rem;
    height: 1.8rem;
    @include bg-image('../../images/ic_banner_two_six');
  }
  .comment-box{
    >.title{
      padding: 0 0.24rem;
      .vux-divider{
        padding: 0.6rem 0 0.4rem ;
        font-size: 0.28rem;
        color: $fontColor;
      }
    }
    >.comment-list{
      >.item{
        padding: 0 0.24rem;
        font-size: 0.26rem;
        margin-bottom: 0.2rem;
        background-color: #fff;
        overflow: hidden;
        .title{
          margin-top: 0.29rem;
          .com{
            display: inline-block;
            vertical-align: middle;
            margin-right: 0.2rem;
            @include wh( 0.3rem , 0.3rem );
          }
          .field-icon{
            @extend .com ;
            @include bg-image('../../images/ic_space_one_two_four');
          }
          .act-icon{
            @extend .com ;
            @include bg-image('../../images/ic_activity_one_two_four');
          }
          .ads-icon{
            @extend .com ;
            @include bg-image('../../images/ic_ad_one_two_four');
          }
        }
        .content{
          margin-top: 0.5rem;
          display: flex;
          .img-box{
            position: relative;
            top: 0;
            left : 0;
            >img{
              @include wh( 1.6rem , 1.6rem );
              margin-right: 0.16rem;
            }
            .type-position{
              position: absolute;
              top:0;
              left:0.02rem;
              width: 0.28rem;
              padding: 0.05rem 0 0.08rem;
              border-radius: 0 0 0.14rem 0.14rem;
              text-align: center;
              color: #fff;
              font-size: 0.2rem;
              background-color: $mainColor;
            }
          }
          .info{
            width: 3.6rem;
            overflow: hidden;
            .resource-time{
              margin-top: 0.2rem;
              color: #666;

            }
            .resource-norm{
              margin-top: 0.2rem;
              color: #666;
              .center-line{
                display: inline-block;
                vertical-align: top;
                width: 1px;
                height: 0.26rem;
                margin: 0 0.2rem;
                background-color: #ccc;
              }
            }
            .cus{
              margin-top: 0.18rem;
              >.item{
                display: inline-block;
                vertical-align: top;
                height: 0.36rem;
                line-height: 0.36rem;
                padding: 0 0.2rem;
                color: $skyblue;
                background-color: #C6E8E8;
              }
            }
          }
          .price{
            width: 1.6rem;
            text-align: right;
          }
        }
        .footer{
          margin: 0.26rem 0 0.12rem;
          text-align: right;
          .comment-btn{
            display: inline-block;
            @include wh( 1.6rem , 0.64rem );
            line-height: 0.64rem;
            border: 1px solid $mainColor;
            border-radius: 0.04rem;
            text-align: center;
            color: $mainColor;
          }
        }
      }
    }
  }
</style>
