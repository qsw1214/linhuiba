<template lang="html">
  <div class="group-wraper">
    <v-head path="/home" isFixed="true">
      <div slot="center-part" v-if="tab==1">{{ cityName.slice(0,-1) }}拼团列表</div>
      <div slot="center-part" v-else="tab==2">我的拼团</div>
    </v-head>
    <div class="group-list" v-if="tab==1">
    <!--拼团首页-->
      <div v-if="list.length">
        <section class="img-ad">

        </section>
        <section class="flow">
          <div class="title">
            <div class="title-lt">拼团流程</div>
            <div class="title-rt"><router-link to="/group/groupDesc"><span>查看详情</span><span class="cert"></span></router-link></div>
          </div>
          <div class="step">
            <div class="step-bgimg"></div>
          </div>
          <p class="desc">组团失败就退款哦~</p>
        </section>
        <section class="list" v-load-more="loadingMore" type="1" v-if="list.length">

           <div class="item" v-for="(item , index) in list" :key="index">
             <router-link :to="{ name : 'groupDetail' , params : { id : item.id} }">
              <div class="img-box">
                <img :src="
                item.selling_resource.physical_resource.physical_resource_first_img&&item.selling_resource.physical_resource.physical_resource_first_img.pic_url?
                item.selling_resource.physical_resource.physical_resource_first_img.pic_url + '-linhuiba_watermark?v=1' :
                 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3'" alt=" ">
                <div class="time">
                  <div class="time-lt"><span>活动时间：</span><span>{{ item.activity_start | timeFormat }}</span><span>-</span><span>{{ item.activity_end | timeFormat }}</span></div>
                  <div class="number-people"><span>人流量：</span><span>{{ item.selling_resource.physical_resource.number_of_people }}</span></div>
                </div>
                <div class="position" v-if="item.selling_resource.physical_resource.field_type&&item.selling_resource.physical_resource.field_type.display_name">{{ item.selling_resource.physical_resource.field_type.display_name }}</div>
              </div>
              <div class="info">
                <h5 class="ellipsis title">{{ item.selling_resource.physical_resource.name }}</h5>
                <div class="content">
                  <div class="price ellipsis">
                    <span class="price-pre">¥</span><span class="number">{{ item.selling_resource.first_selling_resource_price.price/100 }}</span>
                    <del class="oring-price" v-if="item.origin_price>0"><span class="price-pre">¥</span><span class="number">{{ item.origin_price }}</span></del>
                  </div>
                  <div class="group" v-if="item.number_of_group_purchase_now < item.max && item.time_left > 0">
                    <span class="people-info"><span>已有</span><span class="people">{{ item.number_of_group_purchase_now }}</span><span>人参团</span></span>
                    <span class="tips"><span>仅剩</span><span class="people">{{ item.time_left | ssTohh }}</span></span>
                    <span class="group-btn">参团</span>
                  </div>
                  <div class="group" v-else-if="item.number_of_group_purchase_now >= item.max && item.time_left > 0">
                    <span class="people-info"><span>已参满</span><span class="people">{{ item.number_of_group_purchase_now }}</span><span>人</span></span>
                    <span class="tips">已满员</span>
                    <span class="group-btn">已满员</span>
                  </div>
                  <!-- 时间 < 0 -->
                  <div class="group" v-else="item.time_left < 0">
                    <span class="people-info"><span>已有</span><span class="people">{{ item.number_of_group_purchase_now }}</span><span>人成团</span></span>
                    <span class="tips">已结束</span>
                    <span class="group-btn end">已结束</span>
                  </div>
                </div>
              </div>
             </router-link>
           </div>

        </section>
      </div>
       <div class="not-find" v-if="noGroup">

        <div class="bg-img"></div>
        <div class="ct">
         <p>很抱歉 ≥-≤</p>
         <p>暂时还没有开团哦！</p>
        </div>
        <router-link class="btn" to="/home">返回首页</router-link>
      </div>
    </div>

    <div class="my-group-page" v-else="tab==2">
    <!--我的拼团-->
      <div class="my-group-nav">
        <tab :line-width=2 active-color='#0085E3' custom-bar-width='0.86rem'>
          <tab-item :class="{ double : index > 2 }" :selected="item.status==status" v-for="(item, index) in navlist" :key="index" @on-item-click="navSelected(item.status)">{{item.text}}</tab-item>
        </tab>
      </div>
      <div class="my-group-list" v-load-more="loadingMore" type="1" v-if="orderList.length">
          <!--拼团订单单个模板-->
        <div class="group-item" v-for="(item , index) in orderList" :key="index">
          <router-link :to="item.order_status=='submitted'? { name: 'submittedOrderDetail' , params:{ id : item.field_order_id}, query : { group : true } } :{ name: 'bigOrderDetail' , params:{ id : item.field_order_id} } ">
            <div class="head">
              <div class="title ellipsis bold">{{ item.selling_resource.physical_resource.physical_resource_name }}</div>

              <div class="status" v-if="item.order_status=='submitted'">拼团订单</div>
              <div class="status" v-if="item.order_status=='paid' || (item.order_status=='approved'&& item.selling_resource.group_purchase.group_status==0)">拼团中</div>
              <div class="status success" v-if="item.order_status=='finished'||item.order_status=='reviewed' || (item.order_status=='approved'&& item.selling_resource.group_purchase.group_status==1) ">参团成功</div>
              <div class="status" v-if="item.order_status=='approved'&& item.selling_resource.group_purchase.group_status==2">参团失败</div>
              <div class="status" v-if="item.order_status=='canceled'">参团失败</div>

            </div>
            <div class="content">
              <div class="img-box">
                <img v-lazy="item.selling_resource.physical_resource.physical_resource_first_img.pic_url" :data-srcset="item.selling_resource.physical_resource.physical_resource_first_img.pic_url | small" alt="a">
              </div>
              <div class="norms">
                <div class="time">
                  <span>时间：</span><span>{{ item.selling_resource.group_purchase.activity_start }}-{{ item.selling_resource.group_purchase.activity_end }}</span>
                </div>
                <div class="norm">
                  <span>规格：</span>
                  <span>{{ item.selling_resource.first_selling_resource_price.size }}</span>
                </div>
                <!--<div class="custom">-->
                  <!--<span class="custom-item">{{ item.selling_resource.group_purchase.activity_allow }}</span> {{ item.selling_resource.group_purchase.group_status }}-->
                <!--</div>-->
              </div>
              <div class="price">
                <span>¥{{ item.selling_resource.first_selling_resource_price.price/100 }}</span>
              </div>
            </div>
          </router-link>
          <div class="paid-money">
            <span>实付金额：</span><span class="price-pre">¥</span><span class="price-num">{{ item.real_cost/100 | twoPointPre }}.</span><span class="price-next">{{ item.real_cost/100 | twoPointNext }}</span>
          </div>
          <div class="btns" v-if="item.order_status=='submitted'">
            <span class="silver-btn" @click.stop="deleteOrder(item.field_order_id)">取消订单</span>
            <span class="orange-btn" @click.stop="goPaid(item)">立即支付</span>
          </div>
          <div class="btns" v-else-if="item.order_status=='paid'">
            <span class="blue-btn" @click.stop="showServer">催审核</span>
          </div>
          <div class="btns" v-else-if="item.order_status=='finished'|| item.order_status=='reviewed'|| item.order_status=='approved'&&item.selling_resource.group_purchase.group_status!=2">
            <span class="silver-btn" @click.stop="link(item.service_phone.split(',')[0] , item.id)">联系物业</span>
            <router-link :to="{ name : 'dealVoucher' , params : {id: item.field_order_id} }" class="blue-btn">查看交易凭证</router-link>
          </div>

           <div class="btns" v-else-if="item.order_status=='finished'|| item.order_status=='reviewed'|| item.order_status=='approved'&&item.selling_resource.group_purchase.group_status!=2">
            <router-link :to="{ name : 'dealVoucher' , params : {id: item.field_order_id} }" class="blue-btn">查看交易凭证</router-link>
            <router-link :to="{name:'comment',params:{id:item.field_order_id} }" class="blue-btn">评价赚积分</router-link>
          </div>

          <div class="btns fail bold" v-else-if="item.order_status=='canceled'">
            <span class="text">拒接原因：</span><span class="ellipsis">{{ item.objection }}</span>
          </div>
          <div class="btns" v-else></div>
        </div>
      </div>
      <div class="no-data" v-else>暂无数据</div>
    </div>
    <div class="nav-bottom">
      <div class="tabbar border-1px">
        <div class="tab-item lf" :class="{ active : tab == 1 }" @click.stop="changTab(1)">
           <div class="group-home"></div>
           <span class="label">拼团首页</span>
        </div>
        <div class="tab-item" :class="{ active : tab == 2 }" @click.stop="changTab(2)">
           <div class="my-group"></div>
           <span class="label">我的拼团</span>
        </div>
      </div>
    </div>

     <div v-transfer-dom>
      <confirm
        v-model="queryModel"
        :close-on-confirm="true"
        title="是否删除订单?"
        @on-confirm="onConfirm">
      </confirm>
    </div>
     <div v-transfer-dom>
      <confirm
        v-model="groupModel"
        :close-on-confirm="true"
        title="拼团已结束,无法支付,下次早点来哦"
        content = "是否取消订单?"
        confirm-text = '暂不取消'
        cancel-text = '取消订单'
        @on-cancel="onGroup">
      </confirm>
    </div>

    <a :href="tel" ref="A"></a>
    <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>

    <app-down v-show="appdownShow" :params="{ city_id : city_id  }" link="https://aj4j3o.mlinks.cc/Ad7v"></app-down>

  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import AppDown from 'src/components/AppDown.vue';
  import { Tab , TabItem , LoadMore ,Confirm, TransferDomDirective as TransferDom } from 'vux' ;
  import { loadMore } from 'src/components/mixin';
  import { getGroupList ,getGroupOrderList , deleteOrder , getGroupStatus , getCitys ,getInventedNum } from 'src/service/getData' ;
  import { getStorage , setSession , setStorage } from 'src/config/tools' ;
  import { large ,small , ssTohh , timeFormat , twoPointPre , twoPointNext } from 'src/filters/index';
  import { wxshare } from 'src/config/wechatShare';
  import { mapMutations } from 'vuex';
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      tab : 1 ,
      page : 1,
      pageSize : 10,
      city_id : this.$route.query.city_id ||this.$store.state.city_id || getStorage( 'cityId' ) || this.$route.query.city_id  ||90 ,
      cityName : this.$store.state.cityName || getStorage( 'cityName' )  ,

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,

      list : [] , // 拼团列表
      status : 'all' , // 订单状态
      navlist : [
        { status : 'all',       text : '全部'  },
        { status : 'submitted', text : '待支付'},
        { status : 'grouping',  text : '拼团中'},
        { status : 'success',   text : '参团成功'},
        { status : 'fail',      text : '参团失败'}
      ],
      orderList : [] , // 拼团订单列表
      orderPage : 1 ,
      orderPageSize : 10 ,
      queryModel : false ,
      deleteOrderId : '' ,// 要删除的订单id
      groupModel : false ,
      noGroup : false ,
      appdownShow : false ,
      tel : 'tel:4001028028',
      a : 0 ,
    }
  },
  mixins : [ loadMore ] ,
  filters : { large ,small , ssTohh ,timeFormat, twoPointPre , twoPointNext },
  components : {
    vHead,
    Tab,
    TabItem,
    LoadMore,
    Confirm , AppDown
  },
  created(){
    this.$vux.loading.show({text : 'loading...'});
    this.tab = this.$route.query.type || 1 ;

    getCitys().then(res => {
      let arr = res.result ;
      for(let item of arr){
        if( item.id == this.city_id ){
          this.cityName = item.name ;
          setStorage( 'cityName' , item.name );
        }
      }
    }).catch(err => {})

  },
  mounted(){
    if(this.tab == 1){
      this.init();
    }
    if(this.tab == 2){
      this.orderInit();
    }
    wxshare({
      title: '【邻汇吧'+ this.cityName +'拼团活动】找到一批超低价场地',
      desc: '最低一折起' ,
      link: window.location.origin + '?from=singlemessage'+ window.location.hash + '?city_id=' + this.city_id,
      imgUrl: 'https://comment.linhuiba.com/FgQ_j8rDBF1NGvebxxHjMKjKBIyw'
    });
    _MEIQIA('init');
  },
  methods : {
    ...mapMutations([
      'RECORD_PAYMENTMODEL'
    ]),
    init(){
      let params = {
        page : this.page ,
        pageSize : this.pageSize,
        city_id : this.city_id
      };
      getGroupList( params ).then( res => {
        this.$vux.loading.hide();
        this.appdownShow = true ;
        this.list = res.result.data ;
        if(!res.result.data.length){
          this.noGroup = true ;
        }else{
          this.noGroup = false ;
        }
        if( res.result.total < this.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
      }).catch(err => {
        this.$vux.loading.hide();
        this.$vux.toast.text(err.msg);
      })
    },
    orderInit(){
      let params = {
        status : this.status ,
        page : this.orderPage ,
        pageSize : this.orderPageSize
      };
      getGroupOrderList( params ).then(res => {
        this.orderList = res.result.data ;
        this.$vux.loading.hide();
      }).catch(err => {
        this.$vux.loading.hide();
        if( err.code == -99 ){
          this.$router.push({path:'/login' , query:{ redirect : this.$route.fullPath }})
        }
      })
    },
    loadingMore () {

      if (this.end ) {
        return ;
      }
      //防止重复请求
      if ( this.preventRepeatReuqest ) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;
      if(this.tab == 1){
        let params = {
          page : this.page ,
          pageSize : this.pageSize,
          city_id : this.city_id
        };
        getGroupList( params ).then( res => {
          this.list = [ ...this.list , ...res.result.data ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.data.length < this.pageSize ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        }).catch(err => { this.$vux.toast.text(err.msg) })
      }else{
        let params = {
          status : this.status ,
          page : this.page ,
          pageSize : this.pageSize
        };
        getGroupOrderList( params ).then(res => {
          this.$vux.loading.hide();
          this.orderList = [ ...this.orderList , ...res.result.data ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.data.length < this.pageSize ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;

        }).catch(err => { this.$vux.toast.text(err.msg) })
      }

    },
    changTab(n){
      this.tab = n ;
      this.page = 1 ;

      this.showLoading = false ;
      this.loadingTip = '正在加载...';
      this.end = false ;
      this.preventRepeatReuqest = false ;
      this.is_show = false ;
      if(this.tab == 1){
        this.init();
      }else{
        this.orderInit();
      }
    },
    navSelected(status){
      this.status = status ;
      this.orderPage = 1 ;
      this.showLoading = false ;
      this.loadingTip = '正在加载...';
      this.end = false ;
      this.preventRepeatReuqest = false ;
      this.is_show = false ;
      this.orderInit();
    },
    showServer(){
      _MEIQIA('showPanel');
    },
    deleteOrder(id){
      this.queryModel = true ;
      this.deleteOrderId = id ;
    },
    onConfirm(){
      let id = this.deleteOrderId ;
      deleteOrder(id).then(res => {
        this.$vux.toast.text('删除成功');
        this.$router.go(0);
      }).catch(err => {
        this.$vux.toast.text(err.msg)
      })
    },
    onGroup(){
      let id = this.deleteOrderId ;
      deleteOrder(id).then(res => {
        this.$vux.toast.text('删除成功');
        this.$router.go(0);
      }).catch(err => {
        this.$vux.toast.text(err.msg)
      })
    },
    goPaid(item){
      // 是否超过拼团时间
      let id = item.selling_resource.group_purchase_id ;
      getGroupStatus(id).then(res => {
        if( res.result.flag == 2 ){
          this.deleteOrderId = item.field_order_id ;
          this.groupModel = true ;
        }else{
          // 跳转到选择支付方式页面
          let obj = {
            price : item.real_cost/100 ,
            type : 'order' ,
            group : true ,
            order_id : item.field_order_id
          };
          this.RECORD_PAYMENTMODEL(obj);
          setSession('paymentModel' ,obj );
          this.$router.replace('/payment');
        }
      });
    },
    link(num ,id){
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
          A.click();
        } , 20)
      }).catch(err => {
        this.$vux.loading.hide();
        let tel = 'tel:'+ num ;
        this.tel = tel ;
        setTimeout( () => {
          A.click();
        } , 20)
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .vux-tab{
    height: 0.92rem !important;
    .vux-tab-item{
      flex: 0 0 20% !important;
      line-height: 0.92rem  !important;
      font-size: 0.26rem !important;
      &.double{
        line-height: 1.1!important;
        padding:0.17rem 0.4rem 0!important;
      }
    }
  }
  .group-wraper{
    padding-bottom: 1.2rem ;
  }
  .not-find{
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 1rem;
    width: 100%;
    background-color: #fff;
    .bg-img{
      @include wh(2.8rem,2.8rem);
      margin: 1rem auto 0.1rem;
      @include bg-image('../../images/emptystates_grouppurchase_three');
    }
    .ct{
      line-height: 0.54rem;
      @include sc(0.3rem,#999)
    }
    .btn{
      display: block;
      @include wh(2.42rem,0.72rem);
      margin: 0.4rem auto;
      text-align: center;
      line-height: 0.7rem;
      border: 1px solid $mainColor;
      border-radius: 0.36rem;
      color: $mainColor;
    }
  }
  .group-list{

    .img-ad{
      @include wh( 100% , 2.4rem );
      @include bg-image('../../images/ic_banner_two_three');
    }
    .flow{
      padding: 0.32rem 0.24rem;
      background-color: #fff;
      .title{
        display: flex;
        justify-content: space-between;
        .title-lt{
          font-size: 0.28rem;
        }
        .title-rt{
          >a{
            display: block;
            font-size: 0.24rem;
            color: #999;
            .cert{
              display: inline-block;
              vertical-align: top;
              @include wh( 0.1rem , 0.18rem );
              margin:0.03rem 0 0 0.15rem;
              @include bg-image('../../images/ic_next_two_four_one');
            }
          }
        }
      }
      .step{
        .step-bgimg{
          @include wh( 6.34rem , 0.88rem );
          margin: 0.24rem auto 0.32rem;
          @include bg-image('../../images/ic_steps_three');
        }
      }
      .desc{
        text-align: center;
        font-size: 0.26rem;
        color: #999;
      }
    }
    .list{
      margin-top: 0.2rem;
      .item{
        background-color: #fff;
        margin-bottom: 0.2rem;
        >a{
          display: block;
          .img-box  {
          position: relative;
          top: 0;
          left: 0;
          >img{
            @include wh( 100% , 5rem );
          }
          .time{
            position: absolute;
            bottom: 0;
            left: 0;
            padding: 0 0.24rem;
            display: flex;
            justify-content: space-between;
            @include wh( 100% , 0.6rem );
            line-height: 0.6rem;
            font-size: 0.24rem;
            color: #fff;
            background-image: linear-gradient( to bottom , rgba(0,0,0,0) , rgba(0,0,0,1) );
          }
          .position{
            position: absolute;
            top: 0 ;
            left : 0.24rem;
            width: 0.32rem;
            padding: 0.08rem 0 0.18rem;
            border-radius: 0 0 0.16rem 0.16rem;
            text-align: center;
            font-size: 0.2rem;
            color: #fff;
            background-color: $mainColor;
          }
        }
          .info{
          padding: 0.24rem;
          .title{
            font-weight: normal;
            font-size: 0.36rem;
          }
          .content{
            margin-top: 0.24rem;
            display: flex;
            justify-content: space-between;
            height: 0.56rem;
            line-height: 0.56rem;
            .price{
              width: 2.52rem;
              >.price-pre{
                font-size: 0.36rem;
                color: $red;
              }
              >.number{
                letter-spacing: -0.02rem;
                font-size: 0.4rem;
                font-weight: bold;
                color: $red;
              }
              .oring-price{
                font-size: 0.26rem;
                color: #999;
                >.number{
                  letter-spacing: -0.02rem;
                }
              }
            }
            .group{
              width: 4.46rem;
              text-align: right;
              font-size: 0;
              color: #999;
              .people-info{
                margin-right: 0.08rem;
                font-size: 0.28rem;
                letter-spacing: -0.02rem;
              }
              .tips{
                margin-right: 0.1rem;
                letter-spacing: -0.02rem;
                font-size: 0.28rem;
                color: $red;
              }
              .group-btn{
                display: inline-block;
                vertical-align: top;
                @include wh( 1.16rem , 0.56rem );
                text-align: center;
                border-radius: 0.04rem;
                font-size: 0.28rem;
                color: #fff;
                background-color: $red;
                &.end{
                  color: #bbb;
                  background-color: #ddd;
                }
              }
            }
          }
        }
        }
      }
    }
    .no-data{
      padding: 0.5rem 0;
      text-align: center;
      font-size: 0.26rem;
      color: #999;
    }
  }
  .my-group-page{

    .my-group-nav{
      position: fixed;
      top: 0.9rem;
      left: 0;
      width: 100%;
    }
    .my-group-list{
      overflow: hidden;
      margin-top: 0.92rem;
      .group-item{
        margin-top: 0.2rem;
        background-color: #fff;
        >a{
          display: block;
        }
        .head{
          display: flex;
          padding: 0 0.24rem ;
          font-size: 0.24rem;
          line-height: 0.86rem;
          .title{
            width: 5.34rem;
          }
          .status{
            width: 1.68rem;
            text-align: right;
            color: $red;
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
            width: 3.94rem;
            overflow: hidden;
            .time{
              margin-top: 0.15rem;
              font-size: 0.24rem;
              color: $fontColor;
            }
            .norm{
              margin-top: 0.15rem;
              font-size: 0.22rem;
              color: #999;
            }
            .custom{
              margin-top: 0.15rem;
              font-size: 0.2rem;
              color:  $fontColor;
              .custom-item{
                padding: 0 0.06rem;
                border: 1px solid #666;
                border-radius: 0.04rem;
              }
            }
          }
          .price{
            padding-top: 0.54rem;
            font-size: 0.24rem;
          }
        }
        .paid-money{
          padding: 0 0.24rem;
          line-height: 0.88rem;
          text-align: right;
          font-size: 0.28rem;
          color: $fontColor;
          .price-pre{
            margin: 0 0.1rem;
            font-size: 0.22rem;
            color: #000;
          }
          .price-num{
            color: #000;
          }
          .price-next{
            font-size: 0.22rem;
            color: #000;
          }
        }
        .btns{
          display: flex;
          justify-content: flex-end;
          padding: 0.3rem 0.24rem;
          border-top: 1px solid #e8e8e8;
          font-size: 0;
          .silver-btn{
            display: inline-block;
            margin-right: 0.3rem;
            padding: 0 0.2rem;
            line-height: 0.52rem;
            font-size: 0.28rem;
            color: #666;
            border: 1px solid #666;
            border-radius: 0.04rem;
          }
          .blue-btn{
            display: inline-block;
            padding: 0 0.2rem;
            line-height: 0.52rem;
            font-size: 0.28rem;
            color: $mainColor;
            border: 1px solid $mainColor;
            border-radius: 0.04rem;
          }
          .orange-btn{
            display: inline-block;
            padding: 0 0.2rem;
            line-height: 0.52rem;
            font-size: 0.28rem;
            color: $orange;
            border: 1px solid $orange;
            border-radius: 0.04rem;
          }
        }
        .fail{
          justify-content: space-between;
          padding: 0 0.24rem;
          line-height: 0.84rem;
          border-top: 1px solid #e8e8e8;
          font-size: 0.24rem;
          .text{
            width: 1.3rem;
          }
          .ellipsis{
            width: 5.6rem;
          }
        }
      }
    }
    .no-data{
      margin-top: 0.92rem;
      padding: 0.5rem 0;
      text-align: center;
      @include sc(0.26rem,#666);
    }
  }
  .nav-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index:1 ;
    background-color: #fff;
    .tabbar{
      display: flex;
      @include bt-1px(#DDD);
      .tab-item{
        flex: 1;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.32rem;
        color: $fontColor;
        .group-home{
          display: inline-block;
          vertical-align: top;
          margin:0.24rem 0.16rem 0 0;
          @include wh( 0.52rem , 0.52rem );
          @include bg-image('../../images/ic_homepage_normal_one_three');
        }
        .my-group{
          display: inline-block;
          vertical-align: top;
          @include wh( 0.52rem , 0.52rem );
          margin:0.24rem 0.16rem 0 0;
          @include bg-image('../../images/ic_group_three');
        }
        &.lf{
          position: relative;
          top: 0 ;
          left: 0;
          &:after{
            content: '';
            position: absolute;
            top: 0.2rem;
            right: 0.005rem;
            @include wh( 0.01rem , 0.6rem );
            background-color: #e8e8e8;
          }
        }
        &.active{
          color: $red;
          .group-home{
            @include bg-image('../../images/ic_homepage_pressed_two_three');
          }
          .my-group{
            @include bg-image('../../images/ic_group_pressed_three');
          }
        }
      }
    }

  }
</style>
