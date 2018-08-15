<template lang="html">
  <div class="wraper">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">邻汇吧交易凭证</div>
    </v-head>
    <div class="voucher-wraper">
      <span class="tl cert"></span>
      <span class="tr cert"></span>
      <span class="bl cert"></span>
      <span class="br cert"></span>
      <div class="voucher-box" v-if="voucher">
        <div class="content">
          <div class="logo"></div>
          <div class="hello">
            尊敬的会员　{{ voucher.user.user_name }}：您好，您于{{ voucher.field_order.paid_at }}在邻汇吧的预定已成功付款。
          </div>
          <div class="title">订单信息</div>
          <div class="info">
            <div class="item">
              <div class="common-left">订单号:</div>
              <div class="common-right ellipsis">{{ voucher.field_order.order_num }}</div>
            </div>
            <div class="item">
              <div class="common-left">预定场地:</div>
              <div class="common-right ellipsis">{{ voucher.selling_resource.physical_resource.physical_resource_name }}</div>
            </div>
            <div class="item">
              <div class="common-left">售价:</div>
              <div class="common-right ellipsis"><span class="price-pre">¥</span><span class="price-num">{{ voucher.origin_fee/100 | twoPoint }}</span></div>
            </div>
            <div class="item">
              <div class="common-left">规格:</div>
              <div class="common-right ellipsis">
                <span class="size">规格：{{ voucher.size }}</span>
                <span class="norm">{{ voucher.lease_term_type }}</span>
                <span class="custom" v-if="voucher.custom_dimension">{{ voucher.custom_dimension }}</span>
              </div>
            </div>
            <div class="item">
              <div class="common-left">执行日期:</div>
              <div class="common-right ellipsis">{{ voucher.start }}-{{ voucher.end }}</div>
            </div>
          </div>
          <div class="info paid">
            <div class="title">付款信息</div>
            <div class="item">
              <div class="common-left">支付方式:</div>
              <div class="common-right ellipsis">{{ voucher.field_order.pay_type | payModel }}</div>
            </div>
            <div class="item">
              <div class="common-left">付款状态:</div>
              <div class="common-right ellipsis">已付款</div>
            </div>
            <div class="item">
              <div class="common-left">付款日期:</div>
              <div class="common-right ellipsis">{{ voucher.field_order.paid_at }}</div>
            </div>
            <!--<div class="item">-->
              <!--<div class="common-left">付款证明:</div>-->
              <!--<div class="common-right" v-if="voucher.debit&&voucher.is_visible">-->
                <!--<img v-lazy="voucher.debit.transfer_certificate" alt="a">-->
              <!--</div>-->
            <!--</div>-->
            <span class="paid-icon"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="btn" @click.stop="showServer">
        <i class="contract-icon"></i><span>联系客服</span>
      </div>
    </div>
  </div>

</template>

<script>
  import vHead from 'src/components/vHead';
  import { getTransactionVoucher } from 'src/service/getData' ;
  import { twoPoint , payModel } from 'src/filters/index';
export default {
  data () {
    return {
      voucher : null ,
    }
  },
  components : {
    vHead
  },
  filters : { twoPoint , payModel },
  mounted(){
    this.$vux.loading.show({ text : 'loading...' });
    let id = this.$route.params.id ;
    getTransactionVoucher(id).then(res => {
      this.voucher = res.result;
      this.$vux.loading.hide();
    }).catch(err => {
      this.$vux.loading.hide();
      this.$vux.toast.text(err.msg);
    });
    _MEIQIA('init');
  },
  methods:{
    showServer(){
      _MEIQIA('showPanel');
    },
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .voucher-wraper{
    position: relative;
    top: 0;
    left: 0;
    padding: 0.2rem 0.24rem;
    background-color: #fff;
    .cert{
      position: absolute;
      @include wh( 0.72rem , 0.72rem );
      &.tl{
        top: 0.18rem;
        left: 0.22rem;
        background: url('../../images/tl.png') center no-repeat;
        background-size: 0.72rem 0.72rem;
      }
      &.tr{
        top: 0.18rem;
        right: 0.22rem;
        background: url('../../images/tr.png') center no-repeat;
        background-size: 0.72rem 0.72rem;
      }
      &.bl{
        bottom: 0.18rem;
        left: 0.22rem;
        background: url('../../images/bl.png') center no-repeat;
        background-size: 0.72rem 0.72rem;
      }
      &.br{
        bottom: 0.18rem;
        right: 0.22rem;
        background: url('../../images/br.png') center no-repeat;
        background-size: 0.72rem 0.72rem;
      }
    }
    .voucher-box{
      min-height: 1.6rem ;
      border: 1px solid #D6CDA5;
      padding: 0.08rem 0.07rem;
      box-shadow: 0 0 0.02rem #ddd;
      background-image: url('../../images/voucher_bg.png');
      .content{
        padding: 0 0.35rem 0.8rem;
        min-height: 1.36rem;
        border: 1px solid #D6CDA5;
        .title{
          position: relative;
          margin: 0.4rem 0;
          font-size: 0.3rem;
          font-weight: 700;
          text-align: center;
          &:before{
            content: '';
            position: absolute;
            left: 1.37rem;
            top: 0.15rem;
            width: 0.8rem;
            height: 1px;
            background-color: #999;
          }
          &:after{
            content: '';
            position: absolute;
            right: 1.37rem;
            top: 0.15rem;
            width: 0.8rem;
            height: 1px;
            background-color: #999;
          }
        }
        .logo{
          margin: 0.5rem auto 0.4rem;
          @include wh(1.2rem,1.2rem);
          @include bg-image('../../images/ic_blue_logo_three');
        }
        .hello{
          padding-bottom: 0.2rem;
          line-height: 0.34rem;
          font-size: 0.26rem;
          color: #7e6732;
        }
        .info{
          padding-bottom: 0.36rem;
          border-bottom: 1px dashed #ddd;
          &.paid{
            border-bottom: 0 none;
            padding-bottom: 0;
            position: relative;
            .paid-icon{
              position: absolute;
              top: 1rem;
              right: 2.6rem;
              @include wh( 1.46rem,1.46rem );
              @include bg-image('../../images/ic_seal_two_six');
            }
          }
          .item{
            display: flex;
            margin-top: 0.36rem;
            line-height: 0.3rem;
            .common-left{
              width: 1.4rem;
              font-size: 0.28rem;
              color: #333;
            }
            .common-right{
              width: 4.7rem;
              font-size: 0.26rem;
              color: #666;
              >img{
                @include wh(4rem ,3.2rem);
              }
              .price-pre{
                font-size: 0.22rem;
              }
              .price-num{
                font-size: 0.32rem;
              }
              .size{
                padding-right: 0.18rem;
              }
              .norm{
                padding:0 0.18rem;
                border-left: 1px solid #ddd;
              }
              .custom{
                padding-left: 0.18rem;
                border-left: 1px solid #ddd;
              }
            }
          }

        }
      }
    }

  }
  .bottom-btn{
    padding: 0.6rem 0.9rem;
    background-color: #fff;
    .btn{
      height: 0.64rem;
      line-height: 0.62rem;
      border: 0.01rem solid #ccc;
      text-align: center;
      border-radius: 0.08rem;
      color: #999;
      font-size: 0.26rem;
      .contract-icon{
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.2rem;
        @include wh(0.44rem ,0.4rem);
        @include bg-image('../../images/ic_service_selecte_two_five');
      }
    }
  }
</style>
