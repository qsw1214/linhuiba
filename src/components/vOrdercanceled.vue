<template lang="html">
<!--已拒绝-->
  <div class="canceled-wraper" v-if="orderitem">
    <div class="small-order"  v-if="small">
      <router-link :to="{name:'smallOrderDetail',params : {id: orderitem.field_order_item_id } }" class="order-link">
        <div class="head">
          <div class="name ellipsis">{{ orderitem.field_name }}</div>
          <div class="status">{{ orderitem.status_name }}</div>
        </div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="orderitem.pic_url" :data-srcset="orderitem.pic_url | half" alt="a">
          </div>
          <div class="norms">
            <p class="time">时间：<span>{{ orderitem.start }}（{{ orderitem.lease_term_type | toWeeks }}）</span></p>
            <p class="norm">规格：<span>{{ orderitem.size }}</span></p>
            <span class="customs" v-if="orderitem.custom_dimension">{{ orderitem.custom_dimension }}</span>
          </div>
          <div class="price-box" v-if="orderitem.subsidy_fee > 0">
            <p class="discount-price">¥<span>{{ (orderitem.price - orderitem.subsidy_fee)/100 }}</span></p>
            <del class="original-price">¥<span>{{ orderitem.price/100 }}</span></del>
          </div>
          <div class="price-box" v-else>
            <p class="discount-price">¥<span>{{ orderitem.price/100 }}</span></p>
          </div>
        </div>
        <div class="cancle-icon"></div>
      </router-link>

       <div class="pay-price">
        <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.real_pay/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.real_pay/100 | twoPointNext }}</span></span>
        <span class="deposit">已退款</span>
      </div>
      <div class="cancle-box">
        <span>拒绝原因：</span><span>{{ orderitem.objection }}</span>
      </div>
    </div>
    <div class="big-order" v-else>
      <router-link :to="{name : 'bigOrderDetail' , params : {id : orderitem.order_id} }" class="title">订单号：<span>{{ orderitem.order_num }}</span></router-link>
      <router-link :to="{name:'smallOrderDetail',params : {id: subitem.field_order_item_id } }" class="order-link" v-for="( subitem , index ) in orderitem.resources" :key="index">
        <div class="head">
          <div class="name ellipsis">{{ subitem.field_name }}</div>
          <div class="status">{{ subitem.status_name }}</div>
        </div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="subitem.pic_url" :data-srcset="subitem.pic_url | half" alt="a">
          </div>
          <div class="norms">
            <p class="time">时间：<span>{{ subitem.start }} 55</span></p>
            <p class="norm">规格：<span>{{ subitem.size }}（{{ subitem.lease_term_type }}）</span></p>
            <span class="customs" v-if="orderitem.custom_dimension">{{ subitem.custom_dimension }}</span>
          </div>
          <div class="price-box" v-if="subitem.subsidy_fee > 0">
            <p class="discount-price">¥<span>{{ (subitem.price - subitem.subsidy_fee)/100 }}</span></p>
            <del class="original-price">¥<span>{{ subitem.price/100 }}</span></del>
          </div>
          <div class="price-box" v-else>
            <p class="discount-price">¥<span>{{ subitem.price/100 }}</span></p>
          </div>
        </div>
        <div class="cancle-icon"></div>
      </router-link>

       <div class="pay-price">
        <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.actual_fee/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.actual_fee/100 | twoPointNext }}</span></span>
        <span class="deposit">已退款</span>
      </div>

    </div>

  </div>
</template>

<script>
  import { half , twoPointPre , twoPointNext, toWeeks } from 'src/filters';

  export default {
    data () {
      return {

      }
    },
    props : {
      orderitem : {
        required: true,
        default : null
      },
      small : {
        default : false
      }
    },
    filters : { half , twoPointPre , twoPointNext, toWeeks },
  }

</script>

<style lang="scss" scoped>
  @import '../style/mixin';
  .canceled-wraper{
    margin-top: 0.2rem;
    background-color: #fff;
    .order-link{
      display: block;
      position: relative;
      .head{
        display: flex;
        justify-content: space-between;
        margin: 0 0.24rem;
        line-height: 0.94rem;
        border-top: 1px solid rgba(0,0,0,0.1);
        font-size: 0.24rem;
        .name{
          font-family: PingFangSC-Medium;
          font-weight: bold;
          width: 5.34rem;
          color: $fontColor;
        }
        .status{
          color: $red;
        }
        &:first-child{
          border: 0 none;
        }
      }
      .content{
        display: flex;
        padding: 0.2rem 0.24rem;
        background-color:  #F1F2F7;
        .img-box{
          margin-right: 0.2rem;
          >img{
            @include wh( 1.36rem , 1.36rem );
          }
        }
        .norms{
          width: 3.76rem;
          margin-right: 0.2rem;
          .time{
            margin-top: 0.1rem;
            font-size: 0.24rem;
            color: $fontColor;
          }
          .norm{
            margin-top: 0.18rem;
            font-size: 0.22rem;
            color: #999;
          }
          .customs{
            display: inline-block;
            margin-top: 0.18rem;
            padding: 0 0.06rem;
            line-height: 0.3rem;
            border: 1px solid #666;
            border-radius: 0.04rem;
            font-size: 0.2rem;
            color: $fontColor;
          }
        }
        .price-box{
          width: 1.46rem;
          text-align: right;
          font-size: 0.24rem;
          .discount-price{
            margin-top: 0.1rem;
            color: $fontColor;
          }
          .original-price{
            display: block;
            margin-top: 0.18rem;
            color: #999;
          }
        }
      }
      .cancle-icon{
        position: absolute;
        top: 1.4rem;
        right: 0.52rem;
        @include wh( 1.6rem, 1.6rem );
        @include bg-image('../images/ic_rejected');
      }
    }
    .pay-price{
      padding:0.3rem 0.24rem 0.3rem 0.24rem;
      text-align: right;
      .real-price{
        font-size: 0.28rem;
        .price-pre{
          margin-right: 0.1rem;
          font-size: 0.22rem;
          color: #000;
        }
        .price-num{
          font-size: 0.28rem;
          color: #000;
        }
        .price-next{
          font-size: 0.22rem;
          color: #000;
        }
      }
      .deposit{
        font-size: 0.22rem;
        color: #999;
      }
    }
    .cancle-box{
      padding: 0.3rem 0.24rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      font-size: 0.24rem;
    }
  }

</style>


