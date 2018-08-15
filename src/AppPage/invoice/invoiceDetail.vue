<template lang="html">
  <div>

    <div class="invoice-box">
      <div class="circle-out">
        <div class="inner-circle"></div>
      </div>
      <div class="main-info" v-if="detail">
        <div class="gradient"></div>
         <div class="title" v-if="!detail.email">
          <div class="common-item">
            <div class="common-left">收票人：</div>
            <div class="common-right"><span class="name">{{ detail.name }}</span><span>{{ detail.mobile }}</span></div>
          </div>
          <div class="common-item">
            <div class="common-left">地   址：</div>
            <div class="common-right">{{ detail.address }}</div>
          </div>
        </div>
        <div class="title" v-else>
          <div class="common-item">
           <div class="common-left">邮箱地址：</div>
           <div class="common-right">{{ detail.email }}</div>
          </div>
        </div>
        <div class="split"></div>
        <div class="info">
          <div class="common-item">
            <div class="common-left">开票金额：</div>
            <div class="common-right">
              <span class="price-pre">¥</span>
              <span class="price-num">{{ detail.sum/100 }}</span>
            </div>
          </div>
          <div class="common-item" v-if="detail.tax>0">
            <div class="common-left">税费：</div>
            <div class="common-right">
              <span class="price-pre">¥</span>
              <span class="price-num">{{ detail.tax/100 }}</span>
            </div>
          </div>
          <div class="common-item" v-if="detail.delivery_fee>0&&detail.is_paper*1 === 1">
            <div class="common-left">快递费：</div>
            <div class="common-right">
              <span class="price-pre">¥</span>
              <span class="price-num">{{ detail.delivery_fee }}</span>
            </div>
          </div>
          <div class="common-item">
            <div class="common-left">发票类型：</div>
            <div class="common-right ellipsis">
              <span v-if="detail.ticket_type==1">收据</span>
              <span v-if="detail.ticket_type==2&&detail.is_paper==1">纸质发票</span>
              <span v-if="detail.ticket_type==2&&detail.is_paper==0">电子发票</span>
              <span v-if="detail.ticket_type==3">专用发票</span>
            </div>
          </div>
          <div class="common-item">
            <div class="common-left">公司名称：</div>
            <div class="common-right ellipsis">{{ detail.title }}</div>
          </div>
          <div class="common-item">
            <div class="common-left">识别号：</div>
            <div class="common-right ellipsis">{{ detail.tax_number }}</div>
          </div>
          <div class="common-item">
            <div class="common-left">发票内容：</div>
            <div class="common-right ellipsis">{{ detail.invoice_content }}</div>
          </div>
        </div>
        <div class="res-detail">
          <div class="title">场地详情</div>
          <div class="list-wraper">
            <div class="invoice-item" v-for="(item , index) in fields" :key="index">

              <div class="img-box">
                <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">
                <div class="position">{{ item.res_type_id==1?'场地': item.res_type_id==2?'广告': item.res_type_id==3? '活动' : '拼团' }}</div>
              </div>
              <div class="norms">
                <div class="tit ellipsis">{{ item.title }}</div>
                <div class="time"><span>时间：</span><span>{{ item.date }}</span></div>
                <div class="size"><span>规格：</span><span>1*2</span> <span>({{ item.lease_term_type }})</span></div>
                <div class="real-paid">
                  <span class="pay-text">实付款：</span><span class="price-pre">¥</span><span class="price-num">{{ item.real_pay/100 | twoPoint }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="side-box">
            <div class="circle-item" v-for="index in 26">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { getInvoiceDetail } from 'src/service/getData';
  import { half , twoPoint } from 'src/filters/index';
export default {
  data () {
    return {
      detail : null ,// 数据对象
      fields : [] ,// 场地详情
    }
  },
  filters : {half,twoPoint},
  methods:{
    init(){
      let id = +this.$route.params.id ;
      getInvoiceDetail(id).then(res => {
        this.detail = res.result;
        this.fields = this.detail.field_order_items ;
      }).catch(err => {
        this.$vux.toast.text(err.msg , 'middle');
      })
    }
  },
  mounted(){
    this.init();
  },
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .common-item{
    display: flex;
    line-height: 0.68rem;
    padding: 0 0.24rem;
    font-size: 0.28rem;
    .common-left{
      width: 1.4rem;
      margin-right: 0.2rem;
      color: #999;
    }
    .common-right{
      width: 4.3rem;
      color: #1e1e1e;
      .name{
        margin-right: 0.2rem;
      }
      .price-num{
        color: $red;
      }
      .price-pre{
        color: $red;
      }
    }
  }
  .invoice-box{
    padding: 0.22rem 0.36rem;
    background-color: $mainColor;
    .circle-out{
      height: 0.32rem;
      border-radius: 0.16rem;
      overflow: hidden;
      background-color:  #2F90FF;
      .inner-circle{
        width: 6.62rem;
        height: 0.16rem;
        margin: 0.08rem;
        border-radius: 0.08rem;
        background-color: #0067DD;
      }
    }
    .main-info{
      width: 6.5rem;
      position: relative;
      top: -0.22rem;
      left: 0.14rem;
      background-color: #fff;
      .gradient{
        height: 0.3rem;
        background-image: linear-gradient(-180deg, rgba(0,119,255,0.50) 0%, rgba(255,255,255,0.00) 100%);
      }
      .title{
        overflow: hidden;
      }
      .split{
        position: relative;
        width: 6.18rem;
        height: 0.02rem;
        margin: 0.2rem 0 0.2rem 0.16rem;
        border-top: 1px dashed rgba(0,0,0,0.1);
        background-color: #fff;
        &:before{
          content: '';
          position: absolute;
          top: -0.16rem;
          left: -0.16rem;
          @include wh(0.16rem ,0.32rem);
          border-radius: 0 0.16rem 0.16rem 0;
          background-color: $mainColor;
        }
        &:after{
          content: '';
          position: absolute;
          top: -0.16rem;
          right: -0.16rem;
          @include wh(0.16rem ,0.32rem);
          border-radius: 0.16rem 0 0 0.16rem;
          background-color: $mainColor;
        }
      }
      .info{
        padding-bottom: 0.2rem;
      }
    }
  }
  .res-detail{
    position: relative;
    padding: 0 0.2rem 0.5rem;
    .title{
      padding: 0.35rem 0 0.2rem 0;
      border-top: 1px dashed rgba(0,0,0,0.1);
      font-size: 0.3rem;
      color: #1e1e1e;
    }
    .list-wraper{
      .invoice-item{
        display: flex;
        padding: 0.2rem 0;
        overflow: hidden;
        .img-box{
          @include wh( 2rem , 2rem );
          margin-right: 0.2rem;
          position: relative;
          >img{
            @include wh( 100% , 2rem );
          }
          .position{
            position: absolute;
            top: 0;
            left:0.16rem;
            width: 0.42rem;
            padding: 0.06rem 0.1rem 0.1rem;
            background-color: $mainColor;
            border-radius: 0 0 0.21rem 0.21rem;
            font-size: 0.22rem;
            color: #fff;
          }
        }
        .norms{
          width: 3.88rem;
          position: relative;
          &:after{
            content: '';
            position: absolute;
            bottom: -0.2rem;
            right: -0.2rem;
            z-index: 2;
            @include wh( 4.02rem ,1px );
            background-color: #e8e8e8;
          }
          .tit{
            margin-top: 0.08rem;
            font-size: 0.28rem;
            color: $fontColor;
          }
          .time{
            margin-top: 0.18rem;
            font-size: 0.22rem;
            color: #999;
          }
          .size{
            margin-top: 0.08rem;
            font-size: 0.22rem;
            color: #999;
          }
          .real-paid{
            margin-top: 0.5rem;
            .pay-text{
              font-size: 0.24rem;
              color: #666;
            }
            .price-pre{
              font-size: 0.22rem;
              color: $red;
            }
            .price-num{
              font-size: 0.28rem;
              color: $red;
            }
          }
        }
        &:last-child{
          .norms{
            &:after{
              height: 0;
            }
          }
        }
      }
    }

    .side-box{
      position: absolute;
      bottom: -0.08rem;
      left: 0;
      display: flex;
      @include wh(6.5rem , 0.16rem);
      .circle-item{
        margin: 0 0.05rem;
        @include wh(0.16rem,0.16rem);
        border-radius: 50%;
        background-color: $mainColor;
      }
    }
  }

</style>
