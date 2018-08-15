<template lang="html">
  <div v-if="details">

    <div class="contract">联系人：<span class="contract-people">{{ details.contact }}</span>联系方式：<span>{{ details.mobile }}</span></div>
    <div class="list">
      <div class="item" v-for="(item , index) in details.resources" :key="index">
        <div @click.stop="itemClick(item)">
        <div class="head">
          <div class="title ellipsis bold">{{ item.field_name }}</div>
          <div class="status" v-if="item.group_purchase_id">
             <div class="status" v-if="item.order_status=='paid' || (item.order_status=='approved'&& item.group_status==0)">拼团中</div>
              <div class="status success" v-if="item.order_status=='finished'||item.order_status=='reviewed' || (item.order_status=='approved'&& item.group_status==1) ">参团成功</div>
              <div class="status" v-if="item.order_status=='approved'&& item.group_status==2">参团失败</div>
              <div class="status" v-if="item.order_status=='canceled'">参团失败</div>
          </div>
          <div class="status" v-else>{{ item.status }}</div>

        </div>
        <div class="content">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | small" alt="a">
          </div>
          <div class="norms">
            <p class="time">时间：<span>{{ item.start }}</span></p>
            <p class="norm">规格：<span>{{ item.size }}（{{ item.lease_term_type }}）</span></p>
            <span class="customs" v-if="item.custom_dimension">{{ item.custom_dimension }}</span>
          </div>

          <div class="price-box" v-if="item.subsidy_fee > 0">
            <p class="discount-price">¥<span>{{ (item.price - item.subsidy_fee)/100 | twoPoint }}</span></p>
            <del class="original-price">¥<span>{{ item.price/100 | twoPoint }}</span></del>
          </div>
          <div class="price-box" v-else>
            <p class="discount-price">¥<span>{{ item.price/100 | twoPoint }}</span></p>
          </div>
        </div>
        <div class="other-info">
          <div class="box">
            <p><span class="info-left">其他需求：</span><span class="info-right">
              <span v-if="details.need_decoration">需要布置</span>
              <span v-if="details.need_transportation">需要运输</span>
              <span v-if="details.delegated">需要兼职</span>
            </span></p>
            <p class="second-info"><span class="info-left worlds">留&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;言：</span><span class="info-right">{{ item.leave_words }}</span></p>
          </div>
        </div>

        <div class="canceled-icon" v-if="item.status=='已拒绝'"></div>

        </div>
        <div class="btn-box" v-if="item.status=='待审核'">
          <div class="btn" @click="showServer">催审核</div>
        </div>
        <div class="btn-box" v-else-if="item.status=='进行中'&&item.group_status!=2">
          <span class="contract-us" @click="telUs( item.service_phone.split(',')[0] , item.field_order_item_id )">联系物业</span>
          <router-link :to="{ name : 'appDealVoucher' , params : {id: item.field_order_item_id} }" class="deal">交易凭证</router-link>
        </div>
        <div class="canceled-info" v-else-if="item.status=='已拒绝'||item.status=='已取消'">
          <p class="bold">拒绝原因：<span>{{ item.objection }}</span></p>
        </div>
        <div class="btn-box" v-else-if="item.status=='待评价'">
          <router-link :to="{ name : 'appDealVoucher' , params : {id: item.field_order_item_id} }" class="deal-voucher">交易凭证</router-link>
          <span @click="goComment(item.field_order_item_id)" class="comment">评价赚积分</span>
        </div>
        <div class="btn-box" v-else></div>
         <div class="order-cost">
          <p v-if="item.price">场地金额<span class="right">￥{{ item.price / 100 }}</span></p>
          <p v-if="item.service_fee">服务费<span class="right">￥{{ item.service_fee / 100 }}</span></p>
          <p v-if="item.deducted">积分抵扣<span class="right">-￥{{ item.deducted / 100 }}</span></p>
          <p v-if="item.tax">税费<span class="right">￥{{ item.tax / 100 }}</span></p>
          <p v-if="details.delivery_fee">快递费<span class="right">￥{{ details.delivery_fee }}</span></p>
          <p v-if="item.deposit">押金<span class="right">￥{{ item.deposit }}</span></p>
        </div>
        <div class="order-real">
          <p v-if="details.actual_fee">支付金额<span class="right re">￥{{ details.actual_fee / 100 }}</span></p>
        </div>
      </div>
    </div>
    <!-- <div class="submit-pannel">
      <div class="pannel-item">
        <span>场地金额：</span><span>¥{{ (details.price)/100 | twoPoint }}</span>
      </div>

      <div class="pannel-item" v-if="details.service_fee">
        <span>服务费：</span><span>¥{{ details.service_fee / 100}}</span>
      </div>
      <div class="pannel-item" v-if="details.deposit>0">
        <span>押金：</span><span>¥{{ details.deposit / 100 | twoPoint}}</span>
      </div>
      <div class="pannel-item" v-if="details.deducted>0">
        <span>使用积分抵扣：</span><span>-¥{{ details.deducted/100 | twoPoint}}</span>
      </div>
       <div class="pannel-item" v-if="details.tax>0">
        <span>税费：</span><span>+¥{{ details.tax/100 | twoPoint}}</span>
      </div>
      <div class="last-item">
        <div class="flex">
          <span>实付金额：</span><span class="red"><i class="price-pre">¥</i><i class="price-num">{{ details.real_pay/100 | twoPointPre }}.</i><i class="price-next">{{ details.real_pay/100 | twoPointNext }}</i></span>
        </div>
        <p class="deposit" v-if="details.deposit>0&&details.refunded_deposit>0">(押金：已退回{{ detail.refunded_deposit }}元)</p>
        <p class="deposit" v-else-if="details.deposit>0&&details.refunded_deposit<=0">(押金：已支付，待退回)</p>
      </div>
    </div> -->
    <div class="pay-info">
      <p>支付方式：
        <span>{{ details.pay_mode | payModel }}</span>
      </p>
      <p>支付状态：
        <span>{{ details.payment_status }}</span>
      </p>
      <p>支付时间：
        <span>{{ details.paid_at }}</span>
      </p>
      <!--<router-link v-if="detail.status_name=='待支付'" :to="{ name : 'submittedOrderDetail', params : { id : detail.field_order_id } }" class="view-order">查看订单详情</router-link>-->
      <!-- <router-link :to="{ name : 'bigOrderDetail', params : { id : detail.field_order_id } }" class="view-order">查看订单详情</router-link> -->
    </div>
    <div class="order-info">
      <p>订单编号：<span>{{ details.order_num }}</span></p>
      <p>创建时间：<span>{{ details.created_at }}</span></p>
    </div>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import { getOrdersDetail } from 'src/service/getData';
  import { twoPoint , small , twoPointPre , twoPointNext , payModel} from 'src/filters/index';
export default {
  data () {
    return {
      status : 'finished' , // 订单状态
      details : null , // 大订单详情
    }
  },
  filters : { twoPoint , small , twoPointPre , twoPointNext , payModel},

  created(){
     this.status = this.$route.query.status || 'finished' ;
  },
  mounted(){
    let id = this.$route.params.id ;
    getOrdersDetail(id).then(res => {
      this.details = res.result ;
      console.log(this.details)
    }).catch(err => {
      this.$vux.toast.text(err.msg);
    });
    _MEIQIA('init');
  },
  methods:{
    goComment(id){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('commentsOrder', id , function (data) {}) ;
      });
    },
    showServer(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('contactLinHuiServer', "邻汇客服" , function (data) {}) ;
      });
    },
    telUs( number , id ){
      let obj = {
        id : +id ,
        telphonenumber : number
      };
      obj = JSON.stringify( obj );
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('telUs', obj , function (data) {}) ;
      });
    },
    itemClick(item){
      let obj = {
        group_purchase_id : item.group_purchase_id ,
        field_order_item_id : item.field_order_item_id
      };
      obj = JSON.stringify(obj);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('gotoDetail', obj , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .contract{
    padding: 0 0.24rem;
    line-height: 1.04rem;
    color: #1e1e1e;
    background-color: #fff;
    .contract-people{
      margin-right: 0.6rem;
    }
  }
  .item{
    position: relative;
    margin-top: 0.2rem;
    background-color: #fff;
    >a{
      display: block;
    }
    .head{
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem;
      line-height: 0.9rem;
      font-size: 0.24rem;
      .title{
        width: 5.34rem;
      }
      .status{
        color: $red;
        &.finished{
          color: $green;
        }
        &.success{
          color: $green;
        }
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
    .other-info{
      padding: 0 0.24rem 0.15rem;
      background-color: #F1F2F7;
      .box{
        padding-top: 0.15rem;
        border-top: 1px solid rgba(0,0,0,0.1);
        .second-info{
          margin-top: 0.12rem;
        }
        .info-left{
          font-size: 0.22rem;
          color: #999;
        }
        .info-right{
          font-size: 0.22rem;
          color: #000;
        }
      }

    }
    .btn-box{
      padding: 0.5rem 0.24rem 0.46rem;
      display: flex;
      justify-content: space-between;
      .btn{
        width: 100%;
        line-height: 0.68rem;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        color: $mainColor;
        font-size: 0.3rem;
        text-align: center;
      }
      .contract-us{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid #d8d8d8;
        line-height: 0.68rem;
        text-align: center;
        color: #666;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .deal{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid $mainColor;
        line-height: 0.68rem;
        text-align: center;
        color: $mainColor;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .deal-voucher{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid #d8d8d8;
        line-height: 0.68rem;
        text-align: center;
        color: #666;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
      .comment{
        @include wh( 3.29rem , 0.68rem );
        border: 1px solid $orange;
        line-height: 0.68rem;
        text-align: center;
        color: $orange;
        font-size: 0.28rem;
        border-radius: 0.08rem;
      }
    }
    .canceled-info{
      padding: 0.3rem 0.24rem;
      font-size: 0.24rem;
    }
    .canceled-icon{
      position: absolute;
      top: 1.6rem;
      right: 0.72rem;
      @include wh( 1.6rem , 1.6rem );
      @include bg-image('../../images/ic_rejected');
    }
  }
  .order-info{
    margin-top: 0.2rem;
    padding: 0.3rem 0.24rem;
    background-color: #fff;
    font-size: 0.24rem;
    color: #999;
    >p:nth-of-type(2){
      margin-top: 0.15rem;
    }
  }
  .order-cost {
    padding: .3rem .24rem 0 .24rem;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    border-top: .3rem solid #f0f0f0;
    > p {
      padding-bottom: .2rem
    }
  }
  .order-real {
    padding: .3rem .24rem;
    background-color: #fff;
  }
  .re {
    color: red
  }
  .pay-info{
    margin-top: 0.2rem;
    padding: 0.35rem 0.24rem;
    background-color: #fff;
    position: relative;
    >p{
      margin-top: 0.18rem;
      font-size: 0.24rem;
      color: #999;
      &:first-child{
        margin-top: 0;
      }
    }
  }
</style>
