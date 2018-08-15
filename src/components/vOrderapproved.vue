<template lang="html">
<!--进行中-->
  <div class="approved-wraper" v-if="orderitem">
    <div class="small-order" v-if="small">
      <router-link :to="{name:'smallOrderDetail',params : {id: orderitem.field_order_item_id } }" class="order-link">
        <div class="head">
           <div class="name ellipsis">{{ orderitem.field_name }} </div>
          <div class="status">{{  orderitem.status_name  }}</div>
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
        <div class="cancle-icon" v-if="orderitem.status_name=='已拒绝'" ></div>
      </router-link>

       <div class="pay-price">
         <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.real_pay/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.real_pay/100 | twoPointNext }}</span></span>
         <span v-if="orderitem.order_deposit>0||orderitem.service_fee>0||orderitem.delivery_fee>0" class="deposit">
          (<span v-if="orderitem.order_deposit>0">含押金¥{{ orderitem.order_deposit }}</span>
          <span v-if="orderitem.service_fee"> 服务费¥{{ orderitem.service_fee/100 | twoPoint }}</span>
          <span> 邮费¥{{ orderitem.delivery_fee }}</span>)
        </span>
      </div>
      <div class="pay-btns">
        <span @click.stop="link( orderitem.service_phone.split(',')[0] , orderitem.field_order_item_id )" class="cancle-order">联系物业</span>
        <router-link :to="{ name:'dealVoucher', params : { id : orderitem.field_order_item_id } }" class="pay-now">查看交易凭证</router-link>
      </div>
       <a :href="tel" ref="A" class="visibilityA"></a>
    </div>

    <div class="big-order" v-else>
      <router-link :to="{ name : 'bigOrderDetail' , params : { id : orderitem.order_id }  }" class="title">订单号：<span>{{ orderitem.order_num }}</span></router-link>
      <router-link :to="{ name:'smallOrderDetail',params : {id: subitem.field_order_item_id } }" class="order-link" v-for="( subitem , index ) in orderitem.resources" :key="index">
        <div class="head">
          <div class="name ellipsis">{{ subitem.field_name }} </div>
          <div class="status">{{ subitem.status_name }}</div>
        </div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="subitem.pic_url" :data-srcset="subitem.pic_url | half" alt="a">
          </div>
          <div class="norms">
              <p class="time">时间：<span>{{ subitem.start }}</span></p>
              <p class="norm">规格：<span>{{ subitem.size }}（{{ subitem.lease_term_type }}）</span></p>
              <span class="customs" v-if="subitem.custom_dimension">{{ subitem.custom_dimension }}</span>
            </div>
            <div class="price-box" v-if="subitem.subsidy_fee > 0">
              <p class="discount-price">¥<span>{{ (subitem.price - subitem.subsidy_fee)/100 }}</span></p>
              <del class="original-price">¥<span>{{ subitem.price/100 }}</span></del>
            </div>
            <div class="price-box" v-else>
              <p class="discount-price">¥<span>{{ subitem.price/100 }}</span></p>
            </div>
        </div>
        <div class="cancle-icon" v-if="subitem.status_name=='已拒绝'" ></div>
      </router-link>

       <div class="pay-price">
         <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.actual_fee/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.actual_fee/100 | twoPointNext }}</span></span>
          <span v-if="orderitem.order_deposit>0||orderitem.service_fee>0" class="deposit">(<span v-if="orderitem.order_deposit>0">含押金¥{{ orderitem.order_deposit }}</span><span v-if="orderitem.service_fee"> 服务费¥{{ orderitem.service_fee/100 | twoPoint }}</span>)</span>
      </div>


    </div>

  </div>
</template>

<script>
  import { half , twoPoint , twoPointPre , twoPointNext, toWeeks } from 'src/filters';
  import { deleteOrder } from 'src/service/getData';
  import { Confirm, TransferDomDirective as TransferDom } from 'vux';
  import { getInventedNum } from 'src/service/getData';
export default {
  data () {
    return {
      tel : 'tel:4001028028'
    }
  },
  components:{ Confirm },
  props : {
    orderitem : {
      required: true,
      default : null
    },
    small : {
      default : false
    }
  },
  filters : {
    half ,
    twoPoint,
    twoPointPre  ,
    twoPointNext,
    toWeeks
  },
  methods :{
    link( num , id ){
      this.$vux.loading.show({ text : 'loading' });
      let p = {
        field_order_item_id : id + ''
      };
      let A = this.$refs.A;
      getInventedNum( p ).then(res => {
        this.$vux.loading.hide();
        let tel = 'tel:'+ res.result ;
        this.tel = tel ;
        setTimeout( () => {
          A.click()
        } , 20)
      }).catch(err => {
        this.$vux.loading.hide();
        let tel = 'tel:'+ num ;
        this.tel = tel ;
        setTimeout( () => {
          A.click()
        } , 20)
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../style/mixin';
  .approved-wraper{
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
          width: 5.34rem;
          color: $fontColor;
          font-family: PingFangSC-Medium;
          font-weight: bold;
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
    .pay-btns{
      padding: 0.34rem 0.24rem 0.3rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      text-align: right;
      font-size: 0;
      .cancle-order{
        display: inline-block;
        padding: 0 0.2rem;
        border: 0.01rem solid #666;
        margin-right: 0.3rem;
        border-radius: 0.08rem;
        color: #666;
        line-height: 0.52rem;
        text-align: center;
        font-size: 0.28rem;
      }
      .pay-now{
        display: inline-block;
        padding: 0 0.2rem;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        color: $mainColor;
        line-height: 0.52rem;
        text-align: center;
        font-size: 0.28rem;
      }
    }
    .big-order{
      .title{
        display: block;
        padding: 0 0.24rem;
        line-height: 0.9rem;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        font-size: 0.28rem;
      }
    }
  }

</style>

