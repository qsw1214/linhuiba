<template lang="html">
<!--待支付-->
  <div class="submitted-wraper" v-if="orderitem">
    <router-link :to="{name : 'submittedOrderDetail' , params : {id : orderitem.order_id} }" class="title">订单号：<span>{{ orderitem.order_num }}</span></router-link>
    <div class="sub-list">
      <router-link :to="{ name : 'submittedOrderDetail' , params : {id : orderitem.order_id } }" class="order-link" v-for="( subitem , index ) in orderitem.resources" :key="index">
        <div class="sub-item">
          <div class="head">
            <div class="name ellipsis">{{ subitem.field_name }}</div>

            <div class="status" v-if="orderitem.offline_pay && !orderitem.voucher_image_url">待上传凭证</div>
            <div class="status" v-else-if="orderitem.offline_pay && orderitem.voucher_image_url">对账中</div>
            <div class="status" v-else>待支付</div>

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
        </div>
      </router-link>
    </div>
    <div class="pay-price">
      <span class="real-price">实付金额：<span class="price-pre">¥</span><span class="price-num">{{ orderitem.actual_fee/100 | twoPointPre }}.</span><span class="price-next">{{ orderitem.actual_fee/100 | twoPointNext }}</span></span>
      <span v-if="orderitem.order_deposit>0||orderitem.service_fee>0||orderitem.delivery_fee>0" class="deposit">
        (<span v-if="orderitem.order_deposit>0">含押金¥{{ orderitem.order_deposit }}</span>
        <span v-if="orderitem.service_fee"> 服务费¥{{ orderitem.service_fee/100 | twoPoint }}</span>
        <span v-if="orderitem.delivery_fee>0"> 邮费¥{{ orderitem.delivery_fee }}</span>)
      </span>
    </div>
    <div class="pay-btns">

      <span class="cancle-order" @click.stop="deleteOrder(orderitem.order_id)">取消订单</span>

      <router-link :to="{ name : 'offline' , params:{id :orderitem.order_id },query : { source : 'order' } }" class="pay-now" v-if="orderitem.offline_pay && !orderitem.voucher_image_url">上传凭证</router-link>
      <router-link :to="{ name : 'offline' , params:{id :orderitem.order_id },query : { source : 'order' } }" class="pay-now" v-else-if="orderitem.offline_pay && orderitem.voucher_image_url">查看凭证</router-link>

      <span class="pay-now" @click.stop="goPaid(orderitem)" v-else>立即付款</span>

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
  import { half , twoPointPre ,twoPoint, twoPointNext } from 'src/filters';
  import { deleteOrder , getGroupStatus} from 'src/service/getData';
  import { Confirm, TransferDomDirective as TransferDom } from 'vux';
  import { setSession } from 'src/config/tools';
  import { mapMutations } from 'vuex' ;
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
    }
  },
  filters : { half , twoPointPre , twoPointNext ,twoPoint },
  methods:{
    ...mapMutations([
      'RECORD_PAYMENTMODEL'
    ]),
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
    goPaid(detail){
      let id = detail.resources[0].group_purchase_id ;

      if(id||id===0){
        getGroupStatus(id).then(res => {
          if( res.result.flag != 2 ){
            let obj = {
              price : detail.actual_fee /100 ,
              type : 'order' ,
              order_id : detail.order_id,
              group : true
            };
            this.RECORD_PAYMENTMODEL(obj);
            setSession('paymentModel' ,obj );
            this.$router.replace('/payment');
          }else{
            this.$vux.toast.text(res.result.message , 'middle');
            return false ;
          }
        });
      }else{
        // 跳转到选择支付方式页面
        let obj = {
          price : detail.actual_fee /100 ,
          type : 'order' ,
          order_id : detail.order_id
        };
        this.RECORD_PAYMENTMODEL(obj);
        setSession('paymentModel' ,obj );
        this.$router.replace('/payment');
      }
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
  .submitted-wraper{
    margin-top: 0.2rem;
    background-color: #fff;
    >.title{
      display: block;
      padding: 0 0.24rem;
      line-height: 0.9rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      font-size: 0.28rem;
    }
    .order-link {
      display: block;
      .sub-item{
        padding-bottom: 0.3rem;
        position: relative;
        .head{
          display: flex;
          justify-content: space-between;
          margin: 0 0.24rem;
          line-height: 0.84rem;
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
        &:first-child{
          .head{
            border-top: 0 none;
          }
        }
      }
    }
    .pay-price{
      padding:0 0.24rem 0.3rem 0.24rem;
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
        border: 1px solid $red;
        border-radius: 0.08rem;
        color: $red;
        line-height: 0.52rem;
        text-align: center;
        font-size: 0.28rem;
      }
    }
  }
</style>
