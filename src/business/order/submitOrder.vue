<template lang="html">
  <div class="wraper">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">提交订单</div>
    </v-head>
    <div class="contract" v-if="contact&&mobile">
      <router-link to="/address?Clinks=1">
        <span>联系人：</span><span class="contract-people">{{ contact }}</span>联系方式：<span>{{ mobile }}</span>
        <span class="right"></span>
      </router-link>
    </div>
    <div class="contract" v-else>
      <router-link to="/address/addAddress">
        <span>请选择联系人</span>
        <span class="right"></span>
      </router-link>
    </div>

    <!--<tips><marquee slot="text" class="marquee">若需开发票，订单审核通过后请在【我的票据】中申请，税点：6%，税费和邮费需另行支付。</marquee></tips>-->
    <div class="other-demand">
      <div class="common-desc">
        <p><span class="title"></span>其他需求<span class="desc">（需额外付费，下单后邻汇吧将为您提供全面服务）</span></p>
      </div>
      <div class="server">
        <span>需要布置</span>
        <x-switch title="" v-model="need_decoration"></x-switch>
      </div>
      <div class="server">
        <span>需要运输</span>
        <x-switch title="" v-model="need_transportation"></x-switch>
      </div>
      <div class="server">
        <span>需要兼职</span>
        <x-switch title="" v-model="delegated"></x-switch>
      </div>
    </div>
    <div class="integral">
      <div>
        <span class="integral-tit">积分可抵扣 <span class="integral-price">¥{{ integralInfo }}</span>元</span>
      </div>
      <x-switch title="" v-model="integral" :disabled="is_integral"></x-switch>
    </div>
    <div class="integral-rules">
      <router-link to="/article/65?page=help">不清楚积分规则？</router-link>
    </div>

    <div class="want-invoice" @click.stop="makeInvoice">
      <div class="info">
        <div class="tit">
          <check-icon :value.sync="has_ticket" @click.stop="backFalse">我要开发票</check-icon>

        </div>
        <p class="txt">如需开多张发票，请到“我的票据”中申请。</p>
      </div>
      <div class="invoice-type">

        <!--<span class="txt" v-if="invoiceData&&invoiceData.ticket_type==1">收据</span>-->
        <!--<span class="txt" v-else-if="invoiceData&&invoiceData.ticket_type==2">普通发票</span>-->
        <!--<span class="txt" v-else-if="invoiceData&&invoiceData.ticket_type==3">专用发票</span>-->
        <!--<span class="txt" v-else>发票类型</span>-->
        <span class="icon"></span>
      </div>
      <!--<x-switch title="" v-model="integral" :disabled="is_integral"></x-switch>-->
    </div>

    <div class="submit-pannel">
      <div class="pannel-item">
        <span>场地金额：</span><span>¥{{ total_price/100 }}</span>
      </div>
      <div class="pannel-item" v-if="deposit">
        <span>押金：</span><span>¥{{ deposit }}</span>
      </div>
      <div class="pannel-item" v-if="integral&&integralPriceView">
        <span>使用积分抵扣：</span><span>-¥{{ integralPriceView }}</span>
      </div>
      <div class="last-item pannel-item" v-if="viewList.length&&viewList[0].service_fee">
        <span class="pay-text">服务费：</span>
        <span class="red"><i class="price-pre">¥</i><i class="price-num">{{ viewList[0].service_fee }}</i></span>
      </div>
      <div class="pannel-item" v-if="total_tax">
        <span>税费：</span><span>+¥{{ total_tax/100 | twoPoint }}</span>
      </div>
      <div class="pannel-item" v-if="invoiceData&&invoiceData.delivery_fee">
        <span>邮费：</span><span>+¥{{ invoiceData.delivery_fee }}</span>
      </div>
    </div>
    <div class="list">
      <div class="order-item" v-for="(item ,index) in viewList" :key="index">
        <div class="order-content">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt=" ">
            <v-label :labelText="item.field_type"></v-label>
          </div>
          <div class="norms">
            <div class="name ellipsis">{{ item.name }}</div>
            <div class="time">时间：<span>{{ item.date }}</span><span v-if="item.end">-{{ item.end }}</span></div>
            <div class="norm">规格：<span>{{ item.size }}{{( item.lease_term_type_name )}}</span></div>
            <div class="custom">{{ item.custom_dimension }}</div>
            <div class="price" v-if="item.discount_rate>0">
              <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 | twoPointPre }}.</span><span class="price-next">{{ item.price/100 | twoPointNext }}</span>
              <del>¥{{ item.price/100/(1-item.discount_rate/100) }}</del>
            </div>
            <div class="price" v-else-if="item.discount_price>0">
              <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 | twoPointPre }}.</span><span class="price-next">{{ item.price/100 | twoPointNext }}</span>
              <del>¥{{ (item.price + item.discount_price)/100 }}</del>
            </div>
            <div class="price" v-else>
              <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 | twoPointPre }}.</span><span class="price-next">{{ item.price/100 | twoPointNext }}</span>
            </div>
          </div>
        </div>
        <div class="leave-words">
          <span class="leave-tit">留言：</span>
          <textarea class="words" placeholder="选填，给物业留言(最大32字)" v-model="item.leaveWorld" maxlength="32"></textarea>
        </div>
      </div>
    </div>

    <div class="submit-order" >
      <div class="submit-text"><span class="txt">应付：</span><span class="price-pre">¥</span><span class="price-num">{{ realPaidPrice/100 | twoPoint}}</span></div>
      <x-button type="default" class="submit-btn" @click.native="submitOrder" :show-loading="showsubloading" :disabled="showsubloading">提交订单</x-button>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showInfo" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: 'auto', 'background-color': 'transparent'}">
        <div class="model">
          <p>您还未填写场地意向</p>
          <p>请完善场地意向以便物业审核您的订单!</p>
          <router-link class="btn" to="/company">去完善</router-link>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import vLabel from 'src/components/vLabel';
  import tips from 'src/components/tips' ;
  import { XSwitch,XDialog ,TransferDomDirective as TransferDom , XButton , CheckIcon } from 'vux'
  import { half  , large , twoPoint , twoPointPre , twoPointNext } from 'src/filters';
  import { getDefaultAddress , getUserStatus , buildOrder , removeCartList } from 'src/service/getData';
  import { getSession , removeSession , setSession  } from 'src/config/tools';
  import { mapMutations } from 'vuex' ;
export default {
  data () {
    return {
      total_price : 0 , // 总价（分）,
      total_tax : 0 , // 总的税费
      need_decoration : false, // 是否需要布置(0:否 1:是)
      need_transportation : false , // 是否需要运输(0:否 1:是)
      delegated : false , // 是否托管执行
      integral : false , // 积分
      mobile : '' , // 手机号
      contact : '' , // 联系人
      address : '' , // 地址
      defaultContract : null , // 默认联系人信息
      orderList : [] , // 订单行
      viewList : [] , // 展示订单行
      showInfo: false , // 公司信息完善弹窗
      infoFlag : true ,  // 公司信息的完善度 true 表示完善
      cart_item_ids : undefined , // 购物车id数组
      deposit : 0 , // 押金
      jifen : 0 , // 用户积分
      is_integral : false , // 不禁用积分
      integralInfo : '使用条件不足，无法使用。' ,
      point : 0 , // 使用的积分数
      integralPrice : 0 , // 积分抵扣的钱
      integralPriceView : 0 , // 积分抵扣的钱
      group : false , // 是否拼团订单
      hasLinks : false , // 默认无联系人
      showsubloading : false , // 提交订单logo
      total_service_price : 0 , // 总的服务费

      invoiceData : getSession('invoiceTosubmittedOrderData') || null , // 开发票带过来的数据
      rate :  0 ,
      has_ticket : false , // 未选择开票
      realPaidPrice : 0 , // 实付
    }
  },
  filters : {
    half ,twoPoint , twoPointPre , twoPointNext
  },
  components : {
    vHead,XSwitch,XDialog,tips , XButton, vLabel , CheckIcon
  },
  directives: {
    TransferDom
  },
  created(){
    // 获取到保存的 特殊服务 信息
    let submittedOrderInfo = getSession('invoiceFieldPrice') ;

    if( submittedOrderInfo ){
      this.need_decoration = Boolean( submittedOrderInfo.need_decoration ); // 是否需要布置(0:否 1:是)
      this.need_transportation = Boolean (submittedOrderInfo.need_transportation) ; // 是否需要运输(0:否 1:是)
      this.delegated = Boolean(submittedOrderInfo.delegated ); // 是否托管执行
      this.integral = Boolean(submittedOrderInfo.integral) ; // 积分
    }
    // 拿到税费
    if( this.invoiceData ){
      this.total_tax = this.invoiceData.total_tax ;
      // 拿到税点
      this.rate = this.invoiceData.rate ;
      this.has_ticket = true ; // 表示选择了开票信息
    }else{
      this.has_ticket = false ;
    }
    this.$vux.loading.show({
      text : 'loading...'
    });
  },
  mounted(){

    // 获取下单的数据
    let data = getSession('orderResource') || null ;
    console.log(data)
    // if(!data){
    //   this.$router.push('/home');
    //   this.$vux.loading.hide();
    //   return false;
    // }
    this.cart_item_ids = data.cart_item_ids;
    this.viewList = data.resource ;
    this.group = data.group ;

    // 获取更改后的联系人
    let links = getSession('links');
    if(links){
      this.hasLinks = true ;
      this.mobile = links.mobile ;
      this.contact = links.contact ;
      this.address = links.address ;
      if(!this.mobile||!this.contact){
        this.hasLinks = false ;
      }
    }else{
      // 获取默认联系人信息
      getDefaultAddress().then( res => {
        this.hasLinks = true ;
        this.defaultContract = res.result ;
        this.mobile = this.defaultContract.mobile ;
        this.contact = this.defaultContract.name ;
        this.address = this.defaultContract.province + this.defaultContract.city + this.defaultContract.district + this.defaultContract.address ;
        if(!this.mobile||!this.contact){
          this.hasLinks = false ;
        }
      }).catch(err => {
        this.hasLinks = false ;
        // 无联系人，先添加联系人
      });
    }
    // 获取用户的积分
    let userInfo = getSession('userInfo');
    this.jifen = userInfo.consumption_point ;
    // 计算总金额
    this.amountTotalPrice(this.viewList)  ;
    // 计算总的押金
    this.amountTotalDeposit(this.viewList);
    // 计算总的服务费
    this.amountTotalServicePrice( this.viewList );
    // 判断积分规则
    this.integralRule(this.total_price/100);

    // 判断公司信息的完善度
    this.rullerCompanyInfo();
    // 计算总的实付款
    this.amountRealPaidPrice();
  },
  methods : {
    ...mapMutations([
      'RECORD_PAYMENTMODEL'
    ]),
    amountTotalPrice(data){
      for(let item of data){
        this.total_price += item.price*1 ;
      }
//      console.log( this.total_price , 'this.total_price')
    },
    amountTotalServicePrice(data){
      for(let item of data){
        if( item.service_fee&&item.service_fee > 0 ){
          this.total_service_price += item.service_fee*1 ;
        }
      }
//      console.log( this.total_service_price , 'total_service_price');
    },
    amountTotalDeposit(data){
      let obj = {};
      let arr = [];
      for(let item of data){
        obj[item.id] ? '' : obj[item.id] = true && arr.push(item) ;
      }
      for(let v of arr){
        this.deposit +=  v.deposit*1 ;
      }
//      console.log( this.deposit, 'deposit');
    },
    integralRule( totalprice ){
      if(totalprice < 100){// 订单金额小于100元不能使用积分
        this.is_integral = true ;
        this.integralPrice = 0 ;
        this.point = 0 ;
        this.integralInfo = "0" ;
      }else{
        if(this.jifen < 1000){
          this.is_integral = true ;
          this.point = 0 ;
          this.integralPrice = 0 ;
          this.integralInfo = "0" ;
          return false;
        }else if(this.jifen >= 1000 && this.jifen<=10000) {
          this.point = Math.floor(this.jifen / 1000) * 1000;
          this.integralPrice = Math.floor(this.jifen / 1000) * 5;
          this.integralInfo = this.integralPrice + "";
          return false;
        }else if(this.jifen > 10000) {
          this.point = 10000 ;
          this.integralPrice = 50 ;
          this.integralInfo = "50";
          return false;
        }
      }
    },
    rullerCompanyInfo(){
      this.$vux.loading.hide();
      // if (this.has_ticket) {
      //   // 场地意向的完成度
      //   getUserStatus().then( res => {
      //     this.$vux.loading.hide();
      //     let status = res.result.complete_status ;
      //     if( !status ){
      //       this.showInfo = true ;
      //       this.infoFlag = false ;
      //       return false ;
      //     }else{
      //       this.infoFlag = true ;
      //     }
      //   }).catch(err => {  this.$vux.loading.hide();  })
      // } else { this.$vux.loading.hide(); }
    },
    submitOrder(){
      this.showsubloading = true ;
      if( !this.hasLinks ){
        this.$router.push({ path : '/address/addAddress' });
        return false ;
      }
      if(this.infoFlag){
        for(let item of this.viewList){
          let obj = {};
          obj.id = +item.id ;
          obj.size = item.size ;
          obj.lease_term_type_id = item.lease_term_type_id ;
          obj.count = item.count ;
          obj.count_of_time_unit = item.count_of_time_unit ;
          obj.custom_dimension = item.custom_dimension ;
          obj.date = item.date ;
          obj.leave_words = item.leaveWorld ;
          if(item.enquiry_id){
            obj.enquiry_id = +item.enquiry_id ;
          }
          this.orderList.push(obj);
        }

        let params = {
          delegated : +this.delegated ,
          need_decoration : +this.need_decoration ,
          need_transportation : +this.need_transportation ,
          contact : this.contact ,
          mobile : this.mobile ,
          address : this.address ,
          point : this.point ,
          ticket_type : 0 , // 默认不给类型
          resources : JSON.stringify(this.orderList)
        };
        if( this.invoiceData ){
          Object.assign( params , this.invoiceData );
        }
        // 删除税率字段
        delete params.rate ;
        // 删除总税费字段
        delete params.total_tax ;
        // 删除邮费
        delete params.delivery_fee ;

        params.total_actual_price = this.realPaidPrice ;

        if(!this.integral){
          params.point = 0 ;
        }
        console.log(params, '订单参数');
        buildOrder(params).then( res => {
          // 清除session中保存的订单信息
          removeSession('orderResource');
          removeSession('invoiceTosubmittedOrderData') ;
          removeSession('invoiceFieldPrice') ;
          if( this.cart_item_ids&&this.cart_item_ids.length ){
            let params = {
              cart_item_ids : JSON.stringify( this.cart_item_ids )
            };
            removeCartList( params ).then(res => { console.log(res ) }).catch(err => {}) ;
          }
          // 跳转到选择支付方式页面
          let obj = {
            price : this.realPaidPrice/100 ,
            type : 'order' ,
            order_id : res.result.order_id
          };
          if( this.group ){
            obj.group = true ;
          }
          this.RECORD_PAYMENTMODEL(obj);
          setSession('paymentModel' ,obj );
          removeSession('links');
          this.$router.replace('/payment');

        }).catch(err => {
          this.$vux.toast.text(err.message|| err.msg , 'middle');
        });
      }else{
        this.showInfo = true ;
      }
    },
    makeInvoice(){
      if( !this.invoiceData ){
        let obj = {
          arr : this.viewList , // 场地数组
          need_decoration : +this.need_decoration , // 是否需要布置(0:否 1:是)
          need_transportation : +this.need_transportation , // 是否需要运输(0:否 1:是)
          delegated : +this.delegated , // 是否托管执行
          integral : +this.integral  // 积分
        };
        if( this.integral ){
          obj.totalPoint = this.point ;
        }
        // 存入需要开票的总金额
        setSession('invoiceFieldPrice' , obj ) ;
        this.$router.push('/orderApplyInvoice/1')
      }else{
        this.has_ticket = false ;
        this.invoiceData = null ;
        removeSession('invoiceTosubmittedOrderData') ;
        this.total_tax = 0 ;
        // 重新计算实付款
        this.amountRealPaidPrice();
      }
    },
    // 根据是否使用积分和发票重新计算 税费
    amoutRateFee(){
      // 只计算税费  选择了开票和 开票类型不为普通发票
      if( this.has_ticket&&+this.invoiceData.ticket_type !==1 ){
        let total_point = this.integral ? this.point : 0 ; // 总的积分
        console.log( total_point )
        if( this.viewList[0].enquiry_id || this.viewList[0].enquiry_id === 0 ){
          let item = this.viewList[0] ;
          // 1000 积分 5元  最小单位为1000
          let total_point_price = Math.floor( total_point / 1000 )*5 ; // 总的积分抵扣的钱 单位分
          let enquiry_rate_fee = Math.round( ( item.price/100 - total_point_price + item.service_fee*1 )*this.rate/100 );
          this.total_tax = enquiry_rate_fee; // 单位为分
        }else{
          // 非询价单的处理
          let notLastTax = 0 ;
          let notLastPoint = 0 ;
          // 先处理 不包括最后一个的场地
          for( let i = 0 ; i < this.viewList.length - 1 ; i++ ){
            let item = this.viewList[i] ;
            let temp_point = Math.floor( (item.price/this.total_price) * total_point/10 ) * 10 ;  // 积分为十的倍数 借助后台的算法
            // price 为场地的实际售价
            let averate_point_price = temp_point / 1000 * 5 ; // 1000积分抵扣5元
            let temp = Math.round( ( item.price/100*item.count - averate_point_price )*this.rate/100 );
            notLastTax += temp ;
            notLastPoint += temp_point ;
          }
          // 单独计算最后一个的税费
          let last_field = this.viewList[this.viewList.length - 1] ;
          let last_point_price = ( total_point - notLastPoint ) / 1000 * 5 ;
          let last_fee = Math.round( ( last_field.price/100*last_field.count - last_point_price )*this.rate/100 );
          console.log(last_fee , 'last_fee') ;
          this.total_tax = notLastTax + last_fee  ; // 单位为分
          console.log( this.total_tax , 'this.total_tax' )
        }
      }
    },
    amountRealPaidPrice(){

      if( this.has_ticket && !this.integral ){
        // 选择了开票
        this.amoutRateFee();
        console.log('选择了开票')
        this.realPaidPrice = this.total_price + this.deposit*100 + this.total_tax + this.total_service_price*100 + ( this.invoiceData.delivery_fee ? this.invoiceData.delivery_fee*100 : 0 ) ;
      }else if( this.integral && !this.has_ticket ){
        // 选择了积分抵扣
        console.log('选择了积分抵扣')
        this.realPaidPrice = this.total_price + this.deposit*100 + this.total_service_price*100 - this.integralPriceView*100  ;
      }else if( this.has_ticket && this.integral ){
        // 选择了开票 和  积分抵扣
        this.amoutRateFee();
        console.log('选择了开票 和  积分抵扣')
        this.realPaidPrice = this.total_price + this.deposit*100 + this.total_service_price*100 + this.total_tax - this.integralPriceView*100 + ( this.invoiceData.delivery_fee ? this.invoiceData.delivery_fee*100 : 0 );
      }else if( !this.has_ticket && !this.integral ){
        console.log('都没有选择')
        this.realPaidPrice = this.total_price + this.deposit*100 + this.total_service_price*100  ;
      }
    },
    backFalse(){
      return false ;
    }
  },
  watch : {
    integral : function (newVal , oldVal){
      if(newVal){
        this.integralPriceView = this.integralPrice ;
      }
       this.amountRealPaidPrice();
    },
    'viewList' : {
      handler : function (newVal , oldVal) {
        this.viewList = newVal ;
      },
      deep : true
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .wraper{
    background-color: $bgc;
  }

  .common-desc{
    height: 0.9rem;
    line-height: 0.9rem;
    padding: 0 0.24rem;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
    .title{
      font-size: 0.3rem;
      font-weight: bold;
    }
    .desc{
      margin-top: 0.2rem;
      font-size: 0.22rem;
      color: #999;
    }
  }
  .contract{
    padding: 0 0.24rem;
    line-height: 1rem;
    color: #fff;
    background-color: $mainColor;
    >a{
      display: block;
      color: #fff;
    }
    .contract-people{
      margin-right: 0.6rem;
    }
    .right{
      @include wh( 0.44rem , 0.44rem );
      margin-top: 0.28rem;
      @include bg-image('../../images/ic_into_white_three_one');
    }
  }
  .other-demand{
    background-color: #fff;
    .server{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.9rem;
      margin: 0 0.24rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0.26rem;
      &:last-child{
        border-bottom:0 none;
      }
    }
  }
  .integral{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.9rem;
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    background-color: #fff;
    .integral-tit{
      margin-right: 0.2rem;
      font-size: 0.28rem;
      .integral-price{
        @include sc(0.28rem,$red);
      }
    }
  }
  .integral-rules{
    padding-right: 0.24rem;
    text-align: right;
    line-height: 0.84rem;
    background-color: #f8f8f8;
    >a{
      @include sc(0.24rem,#7B99BB);
    }
  }
  .want-invoice{
    display: flex;
    justify-content: space-between;
    padding: 0.36rem 0.24rem;
    background-color: #fff;
    .info{
      .tit{
        @include sc(0.28rem,$fontColor);
      }
      .txt{
        margin-top: 0.15rem;
        @include sc(0.24rem,$mainColor);
      }
    }
    .invoice-type{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .txt{
        @include sc(0.24rem,$fontColor);
      }
      .icon{
        @include wh(0.44rem,0.44rem);
        @include bg-image('../../images/ic_next')
      }
    }
  }
  .list{
    padding: 0 0.24rem 1rem;
    margin-top: 0.2rem;
    background-color: #fff;
    .order-item{
      padding: 0.2rem 0;
      border-bottom: 1px solid #E8E8E8;
      .order-content{
        display: flex;
        padding: 0.2rem 0;
        .img-box{
          position: relative;
          margin-right: 0.2rem;
          >img{
            @include wh( 2rem , 2rem );
          }
          .position{
            position: absolute;
            top: 0;
            left: 0.16rem;
            width: 0.42rem;
            max-height: 1.8rem ;
            overflow: hidden;
            padding: 0.06rem 0.1rem 0.1rem;
            background-color: $mainColor;
            border-radius: 0 0 0.21rem 0.21rem;
            font-size: 0.22rem;
            color: #fff;
          }
        }
        .norms{
          overflow: hidden;
          .name{
            margin-top: 0.1rem;
            font-size: 0.28rem;
            color: $fontColor;
          }
          .time{
            margin-top: 0.15rem;
            font-size: 0.22rem;
            color: #999;
          }
          .norm{
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: #999;
          }
          .custom{
            height: 0.24rem;
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: $mainColor;
          }
          .price{
            margin-top: 0.1rem;
            font-size: 0;
            .price-pre{
              font-size: 0.22rem;
              color: $red;
            }
            .price-num{
              font-size: 0.28rem;
              color: $red;
            }
            .price-next{
              margin-right: 0.15rem;
              font-size: 0.22rem;
              color: $red;
            }
            del{
              font-size: 0.22rem;
              color: #999;
            }
          }
        }
      }
      .leave-words{
        display: flex;
        padding: 0.1rem 0 0;
        .leave-tit{
          font-size: 0.24rem;
          color: $fontColor;
        }
        .words{
          width: 6.2rem;
          font-size: 0.24rem;
          color:  #3F3F3F;
        }
      }
      &:last-child{
        border-bottom: 0 none;
      }
    }
  }
  .submit-pannel{
    margin-top: 0.2rem;
    padding: 0 0.24rem;
    background-color: #fff;
    .pannel-item{
      display: flex;
      justify-content: space-between;
      line-height: 0.9rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0.28rem;
      &:last-child{
        border-bottom: 0 none;
      }
    }
  }
  .submit-order{
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    @include wh( 100% , 1rem );
    border-top: 1px solid #eee;
    background-color: #fff;
    .submit-text{
      flex: 1;
      padding-right: 0.2rem;
      text-align: right;
      .text{
        @include sc(0.24rem,$fontColor);
      }
      .price-pre{
        @include sc(0.24rem,$red);
      }
      .price-num{
        @include sc(0.34rem,$red);
      }
    }
    .submit-btn{
      @include wh(2.4rem,100%);
      font-size: 0.34rem;
      color: #fff;
      border-radius: 0 !important;
      background-color: $orange;

      &:active{
        color: #fff !important;
        background-color: $orange !important;
      }
      &:disabled{
        color: #fff !important;
        background-color: $orange !important;
      }
    }

  }
  .model{
    width: 5.6rem;
    margin: 0 auto;
    padding: 0.58rem 0.35rem 0.4rem;
    border-radius: 0.24rem;
    background-color: #fff;
    p{
      @include sc(0.28rem,#1e1e1e);
      line-height: 0.44rem;
    }
    .btn{
      display: block;
      @include wh(2.18rem,0.64rem);
      line-height: 0.64rem;
      margin: 0.4rem auto 0;
      text-align: center;
      @include sc(0.28rem,#fff);
      border-radius: 0.08rem;
      background-color: $mainColor;
    }
  }
</style>
