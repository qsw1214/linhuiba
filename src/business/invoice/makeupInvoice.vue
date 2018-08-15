<template lang="html">
  <div>
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">补开发票</div>
    </v-head>
    <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem'>
      <tab-item selected @on-item-click="navClick">普通发票</tab-item>
      <tab-item @on-item-click="navClick">专用发票</tab-item>
    </tab>
    <section v-load-more="loadingMore" type="1">
      <div class="apply-invoice" v-if="applyList.length">
        <div class="invoice-item" :class="{ expired : !item.issue_invoice }" v-for="(item,index) in applyList" :key="index">
          <div class="checked"  :class="{ active : item.is_checked }">
            <span @click.stop="checkedItem(item)"><icon type="success-no-circle" class="ic-right"></icon></span>
          </div>
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">
            <div class="position">{{ item.selling_resource.physical_resource.field_type.display_name }}</div>
          </div>
          <div class="norms">
            <div class="tit ellipsis">{{ item.title }}</div>
            <div class="time"><span>时间：</span><span>{{ item.start }}</span></div>
            <div class="size"><span>规格：</span><span>{{ item.size }}</span> <span>({{ item.lease_term_type }})</span></div>
            <div class="real-paid">
              <span class="pay-text">实付款：</span><span class="price-pre">¥</span><span class="price-num">{{ item.actual_fee/100 | twoPoint }}</span>
            </div>
            <div class="expired" v-if="!item.issue_invoice"></div>
          </div>
        </div>

      </div>
      <div class="no-data" v-else>暂无数据</div>

       <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </section>

    <div class="fill"></div>
    <div class="paid-btn">
      <div class="ct">
        <span>共计{{ totalNumber }}个资源，合计：</span><span class="price-pre">¥</span><span class="price-num">{{ totalPrice/100 | twoPointPre }}.</span><span class="price-next">{{ totalPrice/100 | twoPointNext }}</span>
      </div>
      <div class="apply-btn" @click.stop="applyBtn">补开发票</div>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import { Tab , TabItem ,LoadMore ,Icon } from 'vux';
  import { getInvoicesList } from 'src/service/getData';
  import { twoPoint , half , twoPointPre , twoPointNext } from 'src/filters/index';
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      index  : 0 ,
      applyList : [],
      ticket_type : 2 , // 普通发票
      page : 1,
      pageSize : 10 ,
      totalNumber : 0 ,
      totalPrice : 0 ,
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  filters:{twoPoint,half , twoPointPre , twoPointNext},
  components : {
    vHead,
    Tab ,
    TabItem,
    LoadMore,
    Icon
  },
  mixins : [ loadMore ] ,
  created(){
    this.$vux.loading.show({text : 'loading'});
  },
  methods:{
    init(){
      let params = {
        page : this.page ,
        pageSize : this.pageSize ,
        tax_type : this.ticket_type
      };
      getInvoicesList(params).then(res => {
        let temp = res.result.data;
        this.applyList = this.changeSelectData(temp) ;
        this.$vux.loading.hide();
      })
    },
    loadingMore () {
      if (this.end) {
        return ;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;
      let params = {
        page : this.page ,
        pageSize : this.pageSize ,
        tax_type : this.ticket_type
      };

      getInvoicesList( params ).then( res => {
        let temp = res.result.data;
        let newData = this.changeSelectData(temp) ;

        this.applyList = [ ...this.applyList , ...newData ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.data.length < 10 ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
    totalInfo(){
      let totalPrice = 0 ;
      let num = 0 ;
      for(let item of this.applyList){
        if(item.is_checked){
          totalPrice += item.actual_fee ;
          num ++ ;
        }
      }
      this.totalNumber = num ;
      this.totalPrice = totalPrice ;
    },
    checkedItem(item){
      if(!item.issue_invoice){
        return ;
      }
      item.is_checked = !item.is_checked ;
      this.totalInfo()
    },
    changeSelectData(obj) {
      for (let item of obj) {
        Object.assign(item, { "is_checked": false });
      }
      return obj;
    },
    navClick(index){
      this.page = 1 ;
      this.showLoading = false;
      this.loadingTip = '正在加载...';
      this.end = false ; // 到底了
      this.preventRepeatReuqest = false ;// 阻止重复请求
      this.is_show = false;
      if(index==0){
        this.$vux.loading.show({text : 'loading'});
        this.ticket_type = 2 ;
      }else{
        this.$vux.loading.show({text : 'loading'});
        this.ticket_type = 3 ;
      }
      this.init();
    },
    applyBtn(){
      if( this.totalPrice&&this.totalPrice < 1000 ){
        this.$vux.toast.text('您所选订单行总金额小于10元，不能开票！','middle');
        return false;
      }
      let ids = [] ;
      for(let item of this.applyList){
        if(item.is_checked){
          ids.push(item.field_order_item_id);
        }
      }
      if(ids.length){
        this.$router.push({ name : 'applyInvoice' , params : {id : this.ticket_type} ,query :{ order_items : ids }  });
      }else{
        this.$vux.toast.text('请选择要补开发票的订单行','middle');
        return false;
      }

    }
  },
  mounted(){
    this.init();
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  /*tab栏重置样式*/
  .vux-tab{
    position: fixed;
    top: 0.9rem;
    left: 0;
    z-index: 5;
    @include wh(100%,0.84rem);
  }
  .vux-tab .vux-tab-item{
    line-height: 0.84rem;
    font-size: 0.28rem;
    color: #666;
  }
  .vux-tab .vux-tab-item.vux-tab-selected{
    color: $mainColor;
  }
  .order-link{
    display: block;
    text-align: right;
    font-size: 0.28rem;
    color: $mainColor;
  }
  .apply-invoice{
    margin-top:0.85rem;
    background-color: #fff;
    .invoice-item{
      display: flex;
      padding: 0.24rem 0.34rem;
      overflow: hidden;

      &.expired{
        opacity: 0.5;
        background-color: #D2D2D2;
        .checked{
          .ic-right{
            color: #D2D2D2;
          }
        }

      }
      .checked{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 0.4rem;
        margin-right: 0.34rem;
        .ic-right {
          @include sc(0.28rem, #fff);
          @include wh(0.4rem, 0.4rem);
          background: rgba(216,216,216,0);
          border: 1px solid #979797;
          border-radius: 0.08rem;
          &:before {
            margin: 0.06rem;
          }
        }
        &.active {
          .ic-right {
            background: $mainColor;
          }
        }
      }
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
          bottom: -0.24rem;
          right: -0.24rem;
          @include wh( 4.02rem ,1px );
          background-color: #e8e8e8;
        }
        .expired{
          position: absolute;
          top: 0;
          right: 0;
          opacity: 1;
          @include wh( 2rem,2rem );
          @include bg-image('../../images/ic_expired_');
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
  .paid-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
    @include wh( 100% , 1rem );
    line-height: 0.99rem;
    display: flex;
    border-top:1px solid #e8e8e8;
    .ct{
      width: 5.1rem;
      background-color: #fff;
      font-size: 0.24rem;
      color: $fontColor;
      .price-pre{
        margin-left: 0.1rem;
        font-size: 0.22rem;
        color: $red;
      }
      .price-num{
        font-size: 0.3rem;
        color: $red;
      }
      .price-next{
        font-size: 0.22rem;
        color: $red;
      }
    }
    .apply-btn{
      width: 2.4rem;
      background-color: $mainColor;
      text-align: center;
      font-size: 0.34rem;
      color: #fff;
    }
  }
  .no-data{
    margin: 2rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
  .fill{
    width: 100%;
    height: 1rem;
  }
</style>
