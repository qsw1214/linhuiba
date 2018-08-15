<template lang="html">
  <div>
    <div class="field-order">
      <div class="title"><span class="icon"></span><span class="txt">{{ detail.title }}</span></div>
      <div class="norm">
        <div class="img-box">
          <img v-lazy="detail.pic_url" :data-srcset="detail.pic_url | small" alt=" ">
          <v-label :labelText="detail.field_type">
          </v-label>
        </div>
        <div class="info">
          <div class="tit ellipsis">{{ detail.title }}</div>
          <div class="time"><span>地推时间：</span><span>{{ detail.start }}</span></div>
          <div class="cus"><span>规格：</span><span>{{ detail.size }}</span><span> | </span><span>{{ detail.lease_term_type }}</span></div>
          <div class="price"><span class="txt">价格：</span>¥<span class="price-txt">{{ detail.price/100 }}</span></div>
        </div>
      </div>
      <div class="other"><span class="com-left-tit">其他需求：</span>
        <span v-if="detail.delegated">需要兼职</span>
        <span v-if="detail.need_decoration">需要布置</span>
        <span v-if="detail.need_transportation">需要运输</span>
      </div>
      <div class="leave-word"><span class="com-left-tit">商家留言：</span>
        <span>{{ detail.leave_words }}</span>
      </div>
    </div>

    <div class="bus-info" :class="{ active : active }" @click.stop="active=!active">
      <div class="title"><span>商家信息</span><span class="icon"></span></div>
      <div class="cont" v-if="detail.business">
        <div class="com-item">
          <div>
            <span  class="com-left-tit">公司名称：</span><span>{{ detail.business.company }}</span>
          </div>
        </div>
        <div class="com-item">
          <div>
            <span class="com-left-tit">联系人：</span><span>{{ detail.business.contact }}</span>
          </div>
          <div>
            <!--<span class="tel-icon"></span>-->
            <!--<span>15527585543</span>-->
          </div>
        </div>
        <div class="com-item">
          <div>
            <span class="com-left-tit">所在行业：</span><span>{{ detail.business.industry }}</span>
          </div>
        </div>
        <div class="com-item">
          <div>
            <span class="com-left-tit">产品名称：</span><span>{{ detail.business.product }}</span>
          </div>
        </div>
        <div class="com-item">
          <div>
            <span class="com-left-tit">推广形式：</span><span>{{ detail.business.spread_way }}</span>
          </div>
        </div>
        <div class="com-item">
          <div>
            <span class="com-left-tit">需求面积：</span><span>{{  detail.business.demand_area }} m<sup>2</sup></span>
          </div>
        </div>
        <div class="com-imgbox">
          <div class="img-tit">地推照片</div>
          <div class="img-box">
            <img :src="img" v-for="( img , index ) in detail.business.images" alt=" " :key="index">

          </div>
        </div>

         <div class="com-imgbox">
          <div class="img-tit">营业执照</div>
          <div class="img-box">
            <img :src="detail.business.cert_url" alt=" ">
          </div>
        </div>

         <div class="com-imgbox">
          <div class="img-tit">食品安全许可证</div>
          <div class="img-box">
            <img :src="item" v-for="( item,index ) in detail.business.food_safety_license" alt=" " :key="index">
          </div>
        </div>
      </div>
    </div>

    <div class="price-table">
      <div class="box">
        <div class="paid-price">
          <span>售价</span>
          <span>¥{{ detail.price/100 }}</span>
        </div>
        <div class="paid-price">
          <span>邻汇吧分成</span>
          <span>¥{{ detail.share/100 }}</span>
        </div>
      </div>

      <div class="btn-box">
        <div class="voucher">
          <div class="btn" v-if="detail.status=='进行中'||detail.status=='待评价'||detail.status=='已评价'" @click.stop="viewVoucher">查看交易凭证</div>
        </div>

        <div class="real-price">
          <span>实收款：</span>
          <span class="red">¥{{ (detail.price - detail.share)/100 }}</span>
        </div>
      </div>
    </div>

    <div class="order-panel">
      <div class="item">
        <span>订单编号：</span><span>{{ detail.order_num }}</span>
      </div>
      <div class="item">
        <span>创建时间：</span><span>{{ detail.created_at }}</span>
      </div>
       <div class="item">
        <span>付款时间：</span><span>{{ detail.paid_at }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import vLabel from 'src/components/vLabel.vue';
  import { getOrderItemDetail } from 'src/service/getData';
  import { small } from 'src/filters/index';
export default {
  data () {
    return {
      id : this.$route.params.id ,
      active : false , // 商家信息下拉闸
      detail : {} , // 订单详情
    }
  },
  filters : { small },
  components : {
    vLabel
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      let id = this.id ;
      getOrderItemDetail( id ).then( res => {
        this.detail = res.result ;
      }).catch( err => {
        this.$vux.toast.text(err.msg , 'middle')
      })
    },
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .com-left-tit{
    @include sc(0.28rem,#333);
  }
  .field-order{
    background-color: #fff;
    .title{
      display: flex;
      align-items: center;
      height: 0.8rem;
      padding: 0 0.24rem;
      .icon{
        @include wh(0.36rem,0.36rem);
        margin-right: 0.1rem;
        @include bg-image('../../images/ic_space_one_two_four')
      }
      .txt{
        @include sc(0.3rem,#000);
      }
    }
    .norm{
      display: flex;
      padding: 0.2rem 0.24rem;
      .img-box {
        position: relative;
        @include wh(1.6rem,1.6rem);
        margin-right: 0.2rem;
        >img{
          @include wh(100%,100%);
        }
      }
      .info{
        @include sc(0.28rem,#666);
        .tit{
          color: $fontColor;
        }
        .time{
          margin-top: 0.12rem;
        }
        .cus{
          margin-top: 0.12rem;
        }
        .price{
          margin-top: 0.12rem;
          .price-txt{
            font-size: 0.3rem;
          }
        }
      }
    }
    .other{
      line-height: 0.8rem;
      margin: 0 0.24rem;
      border-bottom: 1px solid #eee;
      @include sc(0.28rem,#666);
    }
    .leave-word{
      display: flex;
      @include sc(0.28rem,#666);
      padding: 0.3rem 0.24rem 0.2rem;
      .com-left-tit{
        width: 3rem;
      }
    }
  }
  .bus-info{
    margin-top: 0.2rem;
    padding: 0 0.24rem;
    background-color: #fff;
    overflow: hidden;
    &.active{
      .icon{
        transform : rotate(180deg)
      }
      .cont{
        height: auto;
      }
    }
    .title{
      display: flex;
      justify-content: space-between;
      height: 0.9rem;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      @include sc(0.3rem,#000);
      .icon{
        @include wh(0.26rem,0.12rem);
        @include bg-image('../../images/ic_open_button_normal_three');
        transition: all 0.3s;
      }
    }
    .cont{
      height: 0;
      .com-item{
        display: flex;
        justify-content: space-between;
        line-height: 0.9rem;
        border-bottom: 1px solid #eee;
        @include sc(0.28rem,#666);
        .tel-icon{
          display: inline-block;
          vertical-align: middle;
          @include wh(0.36rem,0.36rem);
          @include bg-image('../../images/ic_call');
        }
      }
      .com-imgbox{
        border-bottom: 1px solid #eee;
        &:last-child{
          border-bottom: 0 none;
        }
        .img-tit{
          line-height: 0.9rem;
          @include sc(0.32rem,#333);
        }
        .img-box{
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 0.1rem;
          img{
            @include wh(1.2rem,1.2rem);
            margin:0 0.2rem 0.2rem 0;
          }
        }
      }
    }
  }
  .price-table{
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    background-color: #fff;
    .box{
      padding: 0.2rem;
      .paid-price{
        display: flex;
        justify-content: space-between;
        margin-top: 0.1rem;
        @include sc(0.28rem,#999);
      }
    }

    .btn-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.2rem 0;
      border-top: 1px solid #eeeeee;
      .btn{
        @include wh(2rem,0.6rem);
        line-height: 0.58rem;
        text-align: center;
        @include sc(0.26rem,$mainColor);
        border: 1px solid $mainColor;
        border-radius: 0.04rem;
      }
      .real-price{
        @include sc(0.3rem,$fontColor);
        .red{
          color: $red;
        }
      }
    }
  }
  .order-panel{
    margin-top: 0.2rem;
    padding: 0.2rem 0.35rem;
    background-color: #fff;
    .item{
      line-height: 0.5rem;
      @include sc(0.26rem,#999);
    }
  }
</style>
