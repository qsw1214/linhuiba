<template lang="html">
<!--已完成-->
  <div class="finished-wraper" v-if="orderitem">

    <div class="small-order" v-if="small">
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
            <p class="time">时间：<span>{{ orderitem.start }}</span></p>
            <p class="norm">规格：<span>{{ orderitem.size }}（{{ orderitem.lease_term_type }}）</span></p>
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
      </router-link>
      <div class="pay-price">
         <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.real_pay/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.real_pay/100 | twoPointNext }}</span></span>
         <span v-if="orderitem.order_deposit>0||orderitem.service_fee>0||orderitem.delivery_fee>0" class="deposit">
          (<span v-if="orderitem.order_deposit>0">含押金¥{{ orderitem.order_deposit }}</span>
          <span v-if="orderitem.service_fee"> 服务费¥{{ orderitem.service_fee/100 | twoPoint }}</span>
          <span v-if="orderitem.delivery_fee>0"> 邮费¥{{ orderitem.delivery_fee }}</span>)
        </span>
      </div>
      <div class="pay-btns" v-if="orderitem.order_status=='finished'">
        <router-link :to="{name:'dealVoucher', params : {id:orderitem.field_order_item_id} }" class="cancle-order">查看交易凭证</router-link>

        <router-link :to="{name:'comment',params:{id:orderitem.field_order_item_id} }" class="pay-now">评价赚积分</router-link>
      </div>
      <div class="pay-btns" v-else>
        <span class="cancle-order" @click.stop="deleteOrder(orderitem.field_order_item_id)">删除订单</span>
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
              <p class="time">时间：<span>{{ subitem.start }}</span></p>
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
          <div class="cancle-icon" v-if="subitem.status_name=='已拒绝'" ></div>
      </router-link>

       <div class="pay-price">
         <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.actual_fee/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.actual_fee/100 | twoPointNext }}</span></span>
        <span v-if="orderitem.order_deposit>0||orderitem.service_fee>0" class="deposit">(<span v-if="orderitem.order_deposit>0">含押金¥{{ orderitem.order_deposit }}</span><span v-if="orderitem.service_fee"> 服务费¥{{ orderitem.service_fee/100 | twoPoint }}</span>)</span>
      </div>


    </div>



    <div v-transfer-dom>
      <confirm
        v-model="queryModel"
        :close-on-confirm="false"
        title="是否删除订单?"
        @on-confirm="onConfirm">
      </confirm>
    </div>
  </div>
</template>

<script>
  import { half ,twoPoint, twoPointPre , twoPointNexttoWeeks } from 'src/filters';
  import { deleteOrder } from 'src/service/getData';
  import { Confirm, TransferDomDirective as TransferDom } from 'vux';
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        queryModel : false ,
        deleteOrderId : '' ,// 要删除的订单id
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
    filters : { half , twoPointPre , twoPointNext ,twoPoint },
    methods:{
      onConfirm(){
        let id = this.deleteOrderId ;
        this.queryModel = false ;
        deleteOrder(id).then(res => {
          this.$vux.toast.text('删除成功');
          window.location.reload();
        }).catch(err => {
          this.$vux.toast.text(err.msg)
        })
      },
      deleteOrder(id){
        this.queryModel = true ;
        this.deleteOrderId = id ;
      },
    }
  }

</script>
<style lang="scss" scoped>
  @import '../style/mixin';
  .finished-wraper{
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
          color: $green;
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
            margin-top: 0.54rem;
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
        border: 1px solid #666;
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
        border: 1px solid $orange;
        border-radius: 0.08rem;
        color: $orange;
        line-height: 0.52rem;
        text-align: center;
        font-size: 0.28rem;
      }
    }
  }

</style>

