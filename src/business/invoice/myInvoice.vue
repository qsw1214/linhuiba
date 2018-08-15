<template lang="html">
  <div>
    <v-head isFixed="true" path="/admin/profile">
      <div slot="center-part">我的发票</div>
      <div slot="right-part">
        <!--<router-link to="/makeupInvoice" class="order-link">-->
          <!--已付税的订单-->
        <!--</router-link>-->
      </div>
    </v-head>
    <div class="fixed-head">
      <div class="tip">
        <tips :tipsXshow="false">
          <div slot="text">付款后30天内可申请开票，多张发票请分开申请</div>
        </tips>
      </div>
      <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem'>
        <tab-item selected @on-item-click="navClick">申请开票</tab-item>
        <tab-item @on-item-click="navClick">开票记录</tab-item>
      </tab>
    </div>

    <div v-load-more="loadingMore" type="1" class="list">

      <div v-if="apply==1">
        <div class="apply-invoice" v-if="applyList.length">
          <div class="invoice-item" :class="{ expired : !item.issue_invoice }" v-for="(item,index) in applyList" :key="index">
            <div class="checked"  :class="{ active : item.is_checked }">
              <span @click.stop="checkedItem(item)"><icon type="success-no-circle" class="ic-right"></icon></span>
            </div>
            <div class="img-box">
              <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">
              <div class="position" v-if="item.selling_resource.physical_resource.field_type">{{ item.selling_resource.physical_resource.field_type.display_name  }}</div>
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
      </div>
      <div v-else="apply==2">
        <div class="applyed" v-if="recordList.length">

          <div class="applyed-item" v-for="( item , index ) in recordList" :key="index">

            <router-link :to="{ name:'invoiceDetail' , params : {id:item.id} }">
              <div class="item-top">
                <div class="title">
                  <span class="ellipsis">{{ item.title }}</span>
                </div>
                <div class="status">{{ item.status }}</div>

              </div>
              <div class="item-cnt">
                <div><span>票据类型：</span><span>{{ item.ticket_type }}</span></div>
                 <div class="price"><span>开票金额：</span><span class="price-pre">¥</span><span>{{ item.sum/100 | twoPoint }}</span></div>
              </div>
              <div class="item-btm" v-if="item.deliver||item.delivery_num ">
                <div class="trans">{{ item.deliver }}</div>
                <div><span>单号：</span><span>{{ item.delivery_num }}</span></div>
              </div>
            </router-link>

          </div>

        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
       <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </div>
    <div class="fill" v-if="apply==1"></div>
    <div class="paid-btn" v-if="apply==1">
      <div class="ct">
        <span>共计{{ totalNumber }}个资源，合计：</span><span class="price-pre">¥</span><span class="price-num">{{ totalPrice/100 | twoPointPre }}.</span><span class="price-next">{{ totalPrice/100 | twoPointNext }}</span>
      </div>
      <div class="apply-btn" @click.stop="applyBtn">申请开票</div>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import { Tab , TabItem ,LoadMore ,Icon } from 'vux';
  import { getInvoicesList , getApplyInvoiceList } from 'src/service/getData';
  import { half , twoPointPre , twoPointNext , large , twoPoint } from 'src/filters';
  import { mapState , mapActions } from 'vuex' ;
  import { getStorage } from 'src/config/tools';
  import { loadMore } from 'src/components/mixin';
  import tips from 'src/components/tips' ;
export default {
  data () {
    return {
      index  : 0 ,
      applyList : [],
      apply : 1 ,
      page : 1 ,
      pageSize : 10,
      totalNumber : 0 , // 选择的资源个数
      totalPrice : 0 , // 总金额
      recordList : [] ,// 已开票的数组
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  components : {
    vHead,
    Tab ,
    TabItem,
    LoadMore,
    Icon,tips
  },
  mixins : [ loadMore ] ,
  filters : { twoPointPre,twoPointNext , half  ,twoPoint },
  created(){
    this.$store.dispatch('refreshConfig') ;
  },
  mounted(){
    let params = {
      page : this.page ,
      pageSize : this.pageSize
    };
    getInvoicesList(params).then(res => {
      this.applyList = this.changeSelectData( res.result.data );
    }).catch( err => {
      console.log( err )
    });
    getApplyInvoiceList(params).then(res => {
      this.recordList = res.result ;

    }).catch( err => {});
  },

  computed : {
    ...mapState(['config'])
  },
  methods:{
    ...mapActions(['refreshConfig']),
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

      if(this.apply == 1){
        let params = {
          page : this.page ,
          pageSize : this.pageSize,
          tax_type : 1
        };
        getInvoicesList(params).then(res => {
          let temp = this.changeSelectData( res.result.data );
          this.applyList = [ ...this.applyList , ...temp ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.data.length < 10 ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        });
      }else{
        let params = {
          page : this.page ,
          pageSize : this.pageSize
        };
        getApplyInvoiceList(params).then(res => {

          this.recordList = [ ...this.recordList , ...res.result ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.length < 10 ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        });
      }
    },
    checkedItem(item){
      if(!item.issue_invoice){
        return ;
      }
      item.is_checked = !item.is_checked ;
      this.totalInfo();
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
      if(index == 0){
        this.apply = 1 ;
      }else{
        this.apply = 2 ;
      }
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
    applyBtn(){
      let ids = [] ;
      for(let item of this.applyList){
        if(item.is_checked){
          ids.push(item.field_order_item_id)
        }
      }
      if(ids.length){
        this.$router.push({name : 'applyInvoice' ,params : {id : 1} , query :{ order_items : ids , sum : this.totalPrice }  });
      }else{
        this.$vux.toast.text('请选择要申请开票的订单行','middle');
        return false;
      }

    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .fixed-head{
    position: fixed;
    top: 0.9rem;
    left: 0;
    width: 100%;
    z-index: 1;
    background-color: #fff;
  }
  .list{
    padding-top: 1.44rem;
  }
  /*tab栏重置样式*/
  .vux-tab{

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
  .tip{
    width: 100%;
  }
  .order-link{
    display: block;
    text-align: right;
    font-size: 0.28rem;
    color: $mainColor;
  }
  .no-data{
    margin: 2rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
  .apply-invoice{
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
    z-index: 2;
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
  .applyed{

    .applyed-item{
      padding: 0 0.24rem;
      margin-bottom: 0.2rem;
      overflow: hidden;
      background-color: #fff;
      >a{
        display: block;
      }
      .item-top{
        display: flex;
        justify-content: space-between;
        margin-top: 0.4rem;
        .title{
          width: 5.1rem;
          @include sc(0.28rem,$fontColor);
          .ellipsis{
            display: inline-block;
            vertical-align: middle;
            width: 5rem;
          }
        }
        .status{
          color: $red;
        }
      }
      .item-cnt{
        margin: 0.25rem 0;
        display: flex;
        justify-content: space-between;
        @include sc(0.26rem,#666);

      }
      .item-btm{
        display: flex;
        justify-content: space-between;
        height: 1rem;
        line-height: 1rem;
        @include sc(0.26rem,#999);
        background-color: #fafafa;
      }
    }
  }
  .fill{
    width: 100%;
    height: 1rem;
  }
</style>
