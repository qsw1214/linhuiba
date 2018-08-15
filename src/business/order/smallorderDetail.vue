<template lang="html">
  <div v-if="detail">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">订单场地详情</div>
    </v-head>
    <div class="contract">联系人：<span class="contract-people">{{ contact.contact }}</span>联系方式：<span>{{ contact.mobile }}</span></div>
    <div class="list">
      <div class="item">
        <div @click.stop="itemClick(detail)">
          <div class="head">
            <div class="title ellipsis">{{ detail.title }}</div>
            <div class="status">{{ detail.status_name }}</div>

          </div>
          <div class="content">
            <div class="img-box">
              <img v-lazy="detail.pic_url" :data-srcset="detail.pic_url | small" alt="a">
            </div>
            <div class="norms">
              <p class="time">时间：<span>{{ detail.start }}</span></p>
              <p class="norm">规格：<span>{{ detail.size }}（{{ detail.lease_term_type }}）</span></p>
              <!--<span class="customs">金融类</span>-->
            </div>
            <div class="price-box" v-if="detail.subsidy>0">
              <p class="discount-price">¥<span>{{ (detail.price-detail.subsidy)/100 | twoPoint }}</span></p>
              <del class="original-price">¥<span>{{ detail.price/100 | twoPoint }}</span></del>
            </div>
            <div class="price-box" v-else>
              <p class="discount-price">¥<span>{{ detail.price/100 | twoPoint }}</span></p>
            </div>
          </div>
          <div class="other-info">
            <div class="box">
              <p><span class="info-left">其他需求：</span><span class="info-right">
                <span v-if="detail.delegated">需要布置</span>
                <span v-if="detail.need_transportation">需要运输</span>
                <span v-if="detail.need_decoration">需要兼职</span>
              </span></p>
              <p class="second-info"><span class="info-left worlds">留&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;言：</span><span class="info-right">{{ detail.leave_words }}</span></p>
            </div>
          </div>
          <div class="canceled-icon" v-if="detail.status_name=='已拒绝'"></div>
        </div>

        <div class="map-address">

          <div class="address-text">
            <p class="ellipsis name">{{ detail.district.name }}{{ detail.detail_address }}</p>
            <p class="ellipsis jt-address">
              <span class="indoor" v-if="detail.indoor==1">室内</span>
              <span class="indoor" v-else-if="detail.indoor==0">室外</span>
              <span class="detail-addr"><span>具体位置：</span><span>{{ detail.doLocation }}</span></span>
            </p>
          </div>
          <div class="adress-icon">
            <span @click.stop="goMap(detail.lng ,detail.lat , detail.title)" class="icon"></span>
          </div>

        </div>

        <div class="btn-box" v-if="detail.status_name=='待审核'">
          <div class="btn" @click.stop="showServer">催审核</div>
        </div>
        <div class="btn-box" v-else-if="detail.status_name=='进行中'">
          <span @click.stop="link(detail.service_phone.split(',')[0] ,detail.id )" class="contract-us">联系物业</span>
          <router-link :to="{ name : 'dealVoucher' , params:{ id : detail.id } }" class="deal">交易凭证</router-link>
        </div>
        <div class="canceled-info" v-else-if="detail.status_name=='已拒绝'">
          <p class="bold">拒绝原因：<span>{{ detail.objection }}</span></p>
        </div>
        <div class="btn-box" v-else-if="detail.status_name=='待评价'">
          <router-link :to="{name:'dealVoucher', params : {id:detail.id} }" class="deal-voucher">交易凭证</router-link>

          <router-link :to="{name:'comment',params:{id:detail.id} }" class="comment">评价赚积分</router-link>
        </div>
        <div class="btn-box" v-else></div>
        <a :href="tel" ref="A"></a>
      </div>
    </div>
    
    <!-- 删除费用展示板块 -->
    <!-- <div class="submit-pannel">
      <div class="pannel-item">
        <span>场地金额：</span><span>¥{{ (detail.price-detail.subsidy)/100 | twoPoint }}</span>
      </div>
      <div class="pannel-item" v-if="detail.service_fee">
        <span>服务费：</span><span>¥{{ detail.service_fee/100 | twoPoint }}</span>
      </div>
      <div class="pannel-item" v-if="detail.deposit>0">
        <span>押金：</span><span>¥{{ detail.deposit | twoPoint}}</span>
      </div>
      <div class="pannel-item" v-if="detail.deducted>0">
        <span>使用积分抵扣：</span><span>-¥{{ detail.deducted/100 | twoPoint}}</span>
      </div>
       <div class="pannel-item" v-if="detail.tax>0">
        <span>税费：</span><span>+¥{{ detail.tax/100 | twoPoint}}</span>
      </div>

      <div class="last-item">
        <div class="flex">
          <span>实付金额：</span><span class="red"><i class="price-pre">¥</i><i class="price-num">{{ detail.real_pay/100 | twoPointPre }}.</i><i class="price-next">{{ detail.real_pay/100 | twoPointNext }}</i></span>
        </div>
        <p class="deposit" v-if="detail.deposit>0&&detail.refunded_deposit>0">(押金：已退回{{ detail.refunded_deposit }}元)</p>
        <p class="deposit" v-else-if="detail.deposit>0&&detail.refunded_deposit<=0">(押金：已支付，待退回)</p>
      </div>
    </div> -->

    <section v-if="detail.status=='approved'||detail.status=='finished'||detail.status=='reviewed'">

      <div class="invoice" v-if="detail.invoice_status">
        <!--0:电子 1:纸质-->
        <p>发票类型：
          <span v-if="detail.ticket_type == 1">收据</span>
          <span v-else-if="detail.ticket_type == 2&& detail.material==1">纸质发票</span>
          <span v-else-if="detail.ticket_type == 2&& detail.material==0">电子发票</span>
          <span v-else-if="detail.ticket_type == 3">专用发票</span>
        </p>
        <p>发票内容：<span>{{ detail.invoice_content }}</span></p>
        <p>发票抬头：<span>{{ detail.invoice_title }}</span></p>
        <p v-if="detail.ticket_type == 2&& detail.material==1">寄送地址：<span>{{ detail.invoice_address }}</span></p>
        <p v-if="detail.ticket_type == 2&& detail.material==0">邮箱地址：<span>{{ detail.email }}</span></p>
      </div>

      <router-link class="ticket" to="/myInvoice" v-if="!detail.invoice_status&&detail.issue_invoice">
        <div>
        <span class="icon"></span>
          <span>当前还未开票，前往开发票!</span>
        </div>

        <span class="small-btn">立即前往</span>
      </router-link>
    </section>

    <div class="pay-info">
      <!-- <p>支付方式：
        <span>{{ detail.pay_mode | payModel }}</span>
      </p>
      <p>支付状态：
        <span>{{ detail.payment_status }}</span>
      </p>
      <p>支付时间：
        <span>{{ detail.paid_at }}</span>
      </p> -->
      <p>订单编号：
        <span>{{ detail.order_num }}</span>
      </p>
      <!--<router-link v-if="detail.status_name=='待支付'" :to="{ name : 'submittedOrderDetail', params : { id : detail.field_order_id } }" class="view-order">查看订单详情</router-link>-->
      <router-link :to="{ name : 'bigOrderDetail', params : { id : detail.field_order_id } }" class="view-order">查看订单详情</router-link>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { getOrderItemDetail } from 'src/service/getData';
  import { twoPoint , small , twoPointPre , twoPointNext , payModel} from 'src/filters/index';
  import { getInventedNum } from 'src/service/getData';
export default {
  data () {
    return {
      status : 'finished' , // 订单状态
      detail : null , // 详详情信息
      contact : null , // 联系人信息
      tel : 'tel:4001028028'
    }
  },
  filters : { twoPoint , small , twoPointPre , twoPointNext , payModel},
  components : {
    vHead
  },
  created(){
    this.$vux.loading.show({
      text : 'loading'
    });
  },
  mounted(){
    let id = this.$route.params.id ;
    getOrderItemDetail(id).then(res => {
      this.detail = res.result;
      this.status = this.detail.status ;
      this.contact = this.detail.business ;
      this.$vux.loading.hide();
    }).catch(err => {
      this.$vux.loading.hide();
      this.$vux.toast.text(err.msg);
      if(err.msg == '你的账户信息已过期，请重新登录'){
        this.$router.push('/login');
      }
    });
    _MEIQIA('init');
  },
  methods:{
    showServer(){
      _MEIQIA('showPanel');
    },
    link(num ,id){
      this.$vux.loading.show({
        text : 'loading'
      });
      let p = {
        field_order_item_id : id + ''
      };
      let A = this.$refs.A ;
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
    },
    itemClick(detail){
      let res_type_id = detail.res_type_id ;
      let selling_resource_id = detail.selling_resource_id ;

      if(res_type_id == 1){
        // 跳场地
        this.$router.push({ name : 'fieldsDetail' , params : { id : selling_resource_id } ,query : { res_type_id : 1 } });
      }else if(res_type_id == 2){
        // 广告
        this.$vux.alert.show({
          title: '抱歉',
          content: '暂不提供查看广告类订单的资源详情，请使用APP'
        })
      }else if(res_type_id == 3){
        // 活动
        this.$router.push({ name : 'fieldsDetail' , params : { id : selling_resource_id } ,query : { res_type_id : 3 }  });
      }else{
        return false ;
      }

    },

    goMap( lng , lat , name ){
      // 去地图锚点
      this.$router.push({path : '/singlePosition' , query : { lng : lng , lat : lat , fieldName : encodeURIComponent(name) } })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .contract{
    padding: 0 0.24rem;
    line-height: 1.04rem;
    background-color: #fff;
    .contract-people{
      margin-right: 0.6rem;
    }
  }
  .map-address{
    display: flex;
    padding: 0.3rem 0.24rem;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;
    .address-text{
      width: 6.4rem;
      line-height: 1.25;
      border-right: 1px solid rgba(0,0,0,0.06);
      .name{
        font-family: PingFangSC-Regular;
        font-size: 0.24rem;
      }
      .jt-address{
        margin-top: 0.15rem;
        font-size: 0;
        .indoor{
          display: inline-block;
          vertical-align: top;
          height: 0.3rem;
          line-height: 0.28rem;
          padding: 0 0.1rem;
          margin-right: 0.1rem;
          border: 1px solid $mainColor;
          border-radius: 0.04rem;
          font-size: 0.2rem;
          color: $mainColor;
        }
        .detail-addr{
          width: 6.38rem;
          font-size: 0.22rem;
          color: #666;
          overflow: hidden;
        }
      }
    }
    .adress-icon{
      width: 0.6rem;
      text-align: right;
      .icon{
        display: inline-block;
        vertical-align: top;
        margin-top: 0.16rem;
        @include wh( 0.44rem , 0.44rem );
        @include bg-image('../../images/ic_location');
      }
    }
  }


  .item{
    position: relative;
    margin-top: 0.2rem;
    background-color: #fff;
    .head{
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem;
      line-height: 0.9rem;
      font-size: 0.24rem;
      .title{
        width: 5.34rem;
        font-weight: bold;
      }
      .status{
        color: $red;
        &.finished{
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
  .submit-pannel{
    margin-top: 0.2rem;
    padding: 0 0.24rem;
    background-color: #fff;
    .pannel-item{
      display: flex;
      justify-content: space-between;
      line-height: 1rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0.28rem;

    }
    .last-item{
      overflow: hidden;
      .flex{
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0 0.15rem;
        .red{
          font-size: 0.3rem;
          color: $red;
          .price-pre{
            margin-right: 0.1rem;
            font-size: 0.22rem;
          }
          .price-num{
            font-size: 0.3rem;
          }
          .price-next{
            font-size: 0.22rem;
          }
        }
      }
      .deposit{
        margin-bottom: 0.3rem;
        font-size: 0.22rem;
        color: #999;
      }
    }
  }
  .invoice{
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
    .view-order{
      position: absolute;
      bottom: 0.23rem;
      right: 0.24rem;
      font-size: 0.22rem;
      color: #666;
      padding: 0 0.2rem;
      line-height: 0.44rem;
      border: 1px solid #d8d8d8;
      border-radius: 0.08rem;
    }
  }
  .ticket{
    display: flex;
    padding: 0 0.24rem;
    margin: 0.2rem 0;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    @include sc(0.28rem,$mainColor);
    background-color: #E5F1FF;
    .icon{
      display: inline-block;
      vertical-align: middle;
      @include wh(0.28rem,0.28rem);
      @include bg-image('../../images/ic_tips_blue');
    }
    .small-btn{
      display: inline-block;
      vertical-align: middle;
      @include wh(1.76rem,0.52rem);
      border-radius: 0.04rem;
      line-height: 0.5rem;
      text-align: center;
      border: 1px solid $mainColor;
    }
  }
</style>
