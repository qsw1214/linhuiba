<template lang="html">
  <div>
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">申请开票</div>
    </v-head>
    <div class="invoice-type">
      <div class="title">发票类型</div>
      <div class="type-box">
          <div class="invoice-item" :class="{ active : ticket_type==item.id }" @click.stop="ticketClick(item)" v-for="(item , index) in invoiceType" :key="index">{{ item.text }}</div>
      </div>
      <p class="invoice-tips">
        注：开票金额需满足10元才可开普通和专用发票
      </p>
    </div>
    <div class="material"  v-if="ticket_type==2">
      <div class="title">发票性质</div>
      <div class="material-type">
        <div class="material-item" :class="{ active : item.id==is_paper }" @click.stop="materialClick(item)" v-for="(item,index) in material" :key="index">{{ item.text }}</div>
      </div>
    </div>
    <div class="invoice-head">
      <div class="title">发票抬头</div>
      <div class="content">
        <div class="item">
          <div class="cnt-lt"><span>公司名称</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="公司名称，必填" v-model="title">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>识别号</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="纳税人识别号，必填" v-model="tax_number">
        </div>
      </div>
    </div>
    <div class="invoice-head" v-if="ticket_type==3">
      <div class="title">补充信息</div>
      <div class="content">
        <div class="item company-addressk">
          <x-address :title="'公司地址<i>*</i>'" v-model="company_region" :list="addressData" :placeholder="default_company_region ? default_company_region : '请选择区域，必填'"></x-address>
        </div>
        <div class="item">
          <div class="cnt-lt"><span>详细地址</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="详细地址，必填" v-model="company_address">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>公司电话</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="公司电话，必填" v-model="company_mobile">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>开户行</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="银行开户行，必填" v-model="bank">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>开户账号</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="银行开户账号，必填" v-model="account">
        </div>
      </div>
    </div>
    <div class="certify" v-if="ticket_type==3">
      <div class="title">一般纳税人资格证明</div>
      <div class="certify-box">

         <vUploadImg ref="vUpload" imgwidth="2.54rem" imgheight="2.02rem" name="img3" :picArr="pic_url" max=1 region='z0' fileType="cert"></vUploadImg>
      </div>
    </div>
    <div class="invoice-content">
      <div class="title">发票内容</div>
      <div class="item-pannel" :class="{ viewall : isViewAll }" v-if="invoiceContents.length">

        <label class="item" v-for="(item , index) in invoiceContents" :key="index">
          <span class="common-lt">
            <span>{{ item.name }}</span><span class="rate">（税点{{ item.tax_point/100 }}%）</span>
          </span>
          <span class="common-rt">
            <input type="radio" name="serverproject" v-model="invoice_content_id" :value="item.id">
          </span>
        </label>
      </div>
      <div class="gutter" @click.stop="viewAll">
        <span class="view-all"><span class="view-text">查看所有信息</span><span class="cert-icon" :class="{ 'transform' : isViewAll }"></span></span>
      </div>
    </div>

    <div class="remarks">
      <span class="tit">备注：</span>
      <textarea class="ticket-remarks" maxlength="250" v-model="ticket_remarks" placeholder="请输入备注内容"></textarea>
    </div>
    <div class="important-info">
      <div class="title">收票人信息</div>

      <div class="msg" v-if="is_paper==2">
        <div class="msg-left">电子邮箱：</div>
        <input type="text" placeholder="用于接受电子发票信息" class="rt" v-model="email">
      </div>
      <router-link to="/address?Clinks=1" class="important" v-else>
        <div class="im-lt" v-if="contact&&address&&mobile">
          <div class="name">
            <span class="people">{{ contact }}</span>
            <span>{{ mobile }}</span></div>
          <div class="address">
            <span class="mo-icon" v-if="is_default">默认</span>
            <span>{{ address }}</span>
          </div>
        </div>
        <div class="add" v-else>添加联系人</div>
        <div class="arrow-rt"><span class="rt-icon"></span></div>
      </router-link>
    </div>

    <div class="fee-detail">
      <div class="title">费用明细</div>
      <!--  发票类型不为收据并且没有付过税费 -->
      <div class="item" v-if="ticket_type!=1">
        <div class="item-lf">税费</div>
        <div>
          <span class="price-pre">¥</span><span class="price-num">{{ ( total_tax/100) | twoPointPre }}.</span><span class="price-next">{{ ( total_tax/100 ) | twoPointNext }}</span>
        </div>
      </div>
      <div class="item" v-if="is_paper!=2">
        <div class="item-lf">
          <span v-show ="express != 0.00"><span class="info-icon" @click.stop="showWindow=true"></span>快递费：</span>
          <label class="express-ipt">
           <input type="radio" name="express" value="1" v-model="freight_collect"><span>到付</span>
          </label>
          <label class="express-ipt">
            <input type="radio" name="express" value="0" v-model="freight_collect"><span>线上支付</span>
          </label>

        </div>
        <div>¥{{ express }}</div>
      </div>
      <div class="fee-tips" v-if="ticket_type!=1">（注：开票金额：<span>¥{{ ( total_tax/100 + total_fee/100)  | twoPoint }}</span>，税点：{{ rate/100 }}%）</div>
      <!-- <div class="fee-tips">（注：开票金额：<span>¥{{ ( total_tax/100 + total_fee/100)  | twoPoint }}</span>，税点：{{ rate/100 }}%）</div> -->
    </div>

    <div class="fill"></div>


    <!-- 提交场地订单流程 -->
    <div class="paid-info">
      <div class="price">
        <span class="txt">应付：</span><span class="price-pre">¥</span><span class="price-num">{{ paidPrice | twoPoint }}</span>
      </div>
      <div class="pay-btn" @click.stop="backBuildOrder">确认</div>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showInvoiceInfo" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <div class="model">
          <p>开票金额不足10元，无法开票哦！</p>
          <p>请选择开收据</p>
          <div class="btn" @click.stop="showInvoiceInfo=false">知道了</div>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showWindow" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <div class="model">
          <p>邮费说明</p>
          <p>江浙沪地区邮费8元，其他地区邮费统一12元。</p>
          <div class="btn" @click.stop="showWindow=false">确定</div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import vUploadImg from 'src/components/vUploadImg';
  import { ButtonTab, ButtonTabItem ,XDialog ,Group, XAddress ,ChinaAddressV3Data , Value2nameFilter as value2name ,TransferDomDirective as TransferDom } from 'vux';
  import { twoPoint , twoPointNext ,twoPointPre } from 'src/filters/index';
  import { getDefaultAddress , postApplyInvoice ,bulidInvoiceOrder , getInvoiceInfo , getInvoiceTitle , getInvoiceRate, getCityLists } from 'src/service/getData';
  import { WORLD_HTML_REG , TEL_REG ,MOBILE_REG ,EMAIL_REG , NUM_LET_REG , POSITIVE_INT_REG } from 'src/config/data';
  import { mapState , mapActions , mapMutations } from 'vuex' ;
  import { getStorage , setSession , getSession , removeSession } from 'src/config/tools';
export default {
  data () {
    return {
      invoiceType : [
        { id : 2 , text : '普通发票' , disabled : false },
        { id : 3 , text : '专用发票', disabled : false },
        { id : 1 , text : '收据', disabled : false }
      ], // 开票类型
      material : [
        { id : 2 , text : '电子发票' },
        { id : 1 , text : '纸质发票' }
      ],
      addressData: ChinaAddressV3Data,
      showInvoiceInfo : false ,
      showWindow : false ,
      showInfo : true ,
      order_items : [] ,
      oringTicket_type : 1 , // 传值过来的开票类型
      ticket_type : 1 , // 默认为收据
      is_paper : 1 , // 发票材质
      defaultContract : null , // 默认联系人信息
      title : '',
      tax_number : '',
      invoice_content_id : 0 ,
      company_address : '',
      company_mobile : '',
      company_region : [], // 公司地址
      bank : '',
      account : '',
      email: '',
      default_company_region : '',
      invoiceContents : [], // 开票信息
      total_arr :   [] , // 场地数组
      total_fee : 0 , // 总的场地费 分
      total_tax : 0 , // 开票的金额 分
      totalPoint : 0 , // 积分
      mobile : '' , // 手机号
      contact : '' , // 联系人
      address : '' , // 地址
      is_default : '', // 是否默认
      currentCity: '', // 当前用户城市
      pic_url : [] ,// 资格证明
      express : 0 , // 快递费
      paidPrice : 0 ,// 最终需支付的钱
      hasPaidRateFee : false , // 已经支付了税费的订单
      isViewAll : false , // 查看全部
      rate : 0 , // 税率
      freight_collect : 0 ,
      ticket_remarks : '', // 开票备注
      consignee_addresses_id : undefined , // 地址的id

    }
  },
  directives: {
    TransferDom
  },
  created(){
    if(getSession('invoiceFieldPrice')){
      this.total_arr = getSession('invoiceFieldPrice').arr ;
      this.totalPoint = getSession('invoiceFieldPrice').totalPoint || 0;
    }
  },
  components : {
    vHead,XDialog,XAddress,Group ,vUploadImg
  },
  filters : { twoPoint , twoPointPre , twoPointNext },

  methods : {
    ...mapMutations(['RECORD_PAYMENTMODEL']),

    getName (value) {
      return value2name(value, ChinaAddressV3Data)
    },
    amountTotalInvoice(){
      // 计算总的开票金额
      let total = 0 ;
      for( let item of this.total_arr ){
        if( item.service_fee > 0 ){
          total += ( item.price + item.service_fee*100 ) ;
        }else{
          total += item.price  ;
        }
      }
      // 开票金额 小于10 不让开票 只能收据
      if( total < 1000 ){
         this.showInvoiceInfo = true ;
        for(let item of this.invoiceType){
          if(item.id != 1){
            item.disabled = true ;
          }
        }
      }
    },
    getTichetType(){
      this.ticket_type = this.$route.params.id ? this.$route.params.id : 1 ;
      if( +this.ticket_type === 1||+this.ticket_type === 3){
        this.is_paper = 1 ;
      }else{
        this.is_paper = 2 ;
      }
    },
    ticketClick(item){
      if(!item.disabled){
        this.$router.replace( { name : 'orderApplyInvoice' , params : { id : item.id } , query : this.$route.query } );
      }else{
        this.$vux.toast.text('无法选择其他发票类型' ,'middle');
      }
    },
    materialClick(item){
      this.is_paper = item.id ;
      this.amontTotalFee() ; // 税费
      this.amountPaidPrice() ;
    },
    amountExpress(){
      if( this.freight_collect == 0 ){ 
        getCityLists().then(res => {
          let cities = res.result.cities
          let len = cities.length
          for (let i = 0; i < len; i++) {
            if (cities[i].id == this.currentCity) this.express = cities[i].delivery_fee; 
          }
        })
      } else { this.express = 0 }
      // if( this.freight_collect == 0 ){
      //   // 给快递费
      //   let reg = /浙江|江苏|上海/g ;
      //   if( this.address ){
      //     if( reg.test(this.address)){
      //       // 江浙沪用户 快递费8元
      //       this.express = 8 ;
      //     }else{
      //       // 非江浙沪  12元
      //       this.express = 12 ;
      //     }
      //   }else{
      //     this.express = 0 ;
      //   }
      // }else{
      //   // 到付 没有快递费
      //   this.express = 0 ;
      // }

    },
    amountPaidPrice(){
      // 没有付过税费的处理
      let price =  +this.ticket_type !== 1 ? this.total_tax/100 + (+this.express) : this.express ;
      if(+this.is_paper === 2){
        price = price - (+this.express) ;
      }
      this.paidPrice = price ;
    },
    backBuildOrder(){
      // 回到提交订单页
      if(this.title){
        if(WORLD_HTML_REG.test(this.title)){
          this.$vux.toast.text('您输入的公司名称包含非法信息，请重新输入','middle');
          this.title = '' ;
          return false;
        }
      }else{
        this.$vux.toast.text('请填写公司名称','middle');
        return false;
      }
      if(this.tax_number){
        if(!NUM_LET_REG.test(this.tax_number)){
          this.$vux.toast.text('识别号只能为数字和字母，请重新输入','middle');
          this.tax_number = '' ;
          return false;
        }
      }else{
        this.$vux.toast.text('请填写识别号','middle');
        return false;
      }
      if(this.ticket_type==3){
        if(!this.getName(this.company_region) && !this.default_company_region){
          this.$vux.toast.text('请选择公司地址','middle');
          return false;
        }
        if(this.company_address){
          if(WORLD_HTML_REG.test(this.company_address)){
            this.$vux.toast.text('您输入的详细地址包含非法信息，请重新输入','middle');
            this.company_address = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写详细地址','middle');
          return false;
        }
        if(this.company_mobile){
          if(!TEL_REG.test(this.company_mobile)){
            this.$vux.toast.text('您输入的公司电话是无效号码，请重新输入','middle');
            this.company_mobile = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写公司电话','middle');
          return false;
        }
        if(this.bank){
          if(WORLD_HTML_REG.test(this.bank)){
            this.$vux.toast.text('您输入的开户行包含非法信息，请重新输入','middle');
            this.bank = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写开户行信息','middle');
          return false;
        }

        if(this.account){
          if( !POSITIVE_INT_REG.test(this.account)){
            this.$vux.toast.text('开户账号必须为数字，请重新输入','middle');
            this.account = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写开户账号','middle');
          return false;
        }

        if( !this.pic_url.length ){
          this.$vux.toast.text('请上传一般纳税人资格证明','middle');
          return false;
        }

      }
      if(this.is_paper==2){
        if(this.email){
          if(!EMAIL_REG.test(this.email)){
            this.$vux.toast.text('您输入的邮箱不符合要求，请重新输入','middle');
            this.email = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写邮箱号码','middle');
          return false;
        }
      }
      if(!this.invoice_content_id){
        this.$vux.toast.text('请选择发票内容','middle');
        return false;
      }

      if(this.ticket_remarks){
        if(WORLD_HTML_REG.test(this.ticket_remarks)){
          this.$vux.toast.text('您输入的开票备注含非法信息，请重新输入','middle');
          this.ticket_remarks = '' ;
          return false;
        }
      }

      let params = {
        title : this.title ,
        invoice_content_id : this.invoice_content_id ,
        tax_number : this.tax_number,
        ticket_type : this.ticket_type,
        rate : this.rate // 税率传到提交订单页
      };

      // 创建发票订单
      if (+this.is_paper === 2) {
        // 电子发票
        params.material = 0;
        params.email = this.email;
      } else {
        // 纸质发票
        if (!this.consignee_addresses_id ) {
          this.$vux.toast.text('您的联系人信息未完善，请到联系人页面填写', 'middle');
          return false;
        }
        params.material = 1;
        params.consignee_addresses_id = this.consignee_addresses_id ;

        if( +this.freight_collect === 0 ){
          params.delivery_fee = this.express;
        }
        params.freight_collect = +this.freight_collect ; // 是否为到付
      }

      if (+this.ticket_type === 3) {
        params.company_region = this.getName(this.company_region) || this.default_company_region ;
        params.company_address = this.company_address;
        params.company_mobile = this.company_mobile;
        params.bank = this.bank;
        params.account = this.account;
        params.general_taxpayer_qualification = this.pic_url[0];
      }
      if( this.ticket_remarks ){
        params.ticket_remarks = this.ticket_remarks ; // 开票备注
      }

      // 税费  普通发票和专票有
      if( +this.ticket_type !== 1 ){
        params.total_tax = this.total_tax ;
      }else{
        params.total_tax = 0 ;
      }
      console.log( params , '开票信息')
      setSession('invoiceTosubmittedOrderData' , params );
      removeSession('links');
      this.$router.push('/submitOrder');
    },
    viewAll(){
      this.isViewAll = !this.isViewAll ;
    },
    amontTotalFieldPrice(){
      // 计算总的场地金额
      let total = 0 ;
      for( let item of this.total_arr ){
        total += item.price ;
      }
      this.total_fee = total ;
    },
    amontTotalFee(){
      if( this.ticket_type != 1 ){
        let total_point = this.totalPoint ; // 总的积分

        if( this.total_arr[0].enquiry_id || this.total_arr[0].enquiry_id === 0 ){
          let item = this.total_arr[0] ;
          // 1000 积分 5元  最小单位为1000
          let total_point_price = Math.floor( total_point / 1000 )*5 ; // 总的积分抵扣的钱 单位分
          let enquiry_rate_fee = Math.round( ( item.price/100 - total_point_price + item.service_fee*1 )*this.rate/100 );
          this.total_tax = enquiry_rate_fee; // 单位为分
        }else{
          // 非询价单的处理
          let notLastTax = 0 ;
          let notLastPoint = 0 ;
          // 先处理 不包括最后一个的场地
          for( let i = 0 ; i < this.total_arr.length - 1 ; i++ ){
            let item = this.total_arr[i] ;
            let temp_point = Math.floor( (item.price/this.total_fee) * total_point/10 ) * 10 ;  // 积分为十的倍数 借助后台的算法
            // price 为场地的实际售价
            let averate_point_price = temp_point / 1000 * 5 ; // 1000积分抵扣5元
            let temp = Math.round( ( item.price/100*item.count - averate_point_price )*this.rate/100 );
            notLastTax += temp ;
            notLastPoint += temp_point ;
          }
          // 单独计算最后一个的税费
          let last_field = this.total_arr[this.total_arr.length - 1] ;
          let last_point_price = ( total_point - notLastPoint ) / 1000 * 5 ;
          let last_fee = Math.round( ( last_field.price/100*last_field.count - last_point_price )*this.rate/100 );
          console.log(last_fee , 'last_fee') ;
          this.total_tax = notLastTax + last_fee  ; // 单位为分
          console.log( this.total_tax , 'this.total_tax' )
        }
      }
    }
  },
  async mounted(){
    // 获取更改后的联系人
    let links = getSession('links');
    // console.log(links)
    if(links){
      this.mobile = links.mobile ;
      this.contact = links.contact ;
      this.address = links.address ;
      this.is_default = links.is_default ;
      this.consignee_addresses_id = links.id ;
      this.amountExpress() ;  // 计算快递费
    }else{
      // 获取默认联系人信息
      try{
        let res = await getDefaultAddress();
        console.log( res )
        this.defaultContract = res.result ;
        this.mobile = this.defaultContract.mobile ;
        this.contact = this.defaultContract.name ;
        this.currentCity = this.defaultContract.city_id
        this.address = this.defaultContract.province + this.defaultContract.city + this.defaultContract.district + this.defaultContract.address ;
        this.is_default = true ;
        this.consignee_addresses_id = res.result.id ;
        this.amountExpress() ;  // 计算快递费
      }catch (err){}
    }
    // 获取 上一次的发票信息
    getInvoiceTitle().then(res => {
      console.log(res.result, '发票抬头');
      this.title = res.result.title ;
      this.tax_number = res.result.tax_number ;
      this.default_company_region = res.result.company_region ;
      this.invoice_content_id = res.result.invoice_content_id ;
      this.company_address = res.result.company_address ;
      this.company_mobile = res.result.company_mobile ;
      this.bank = res.result.bank ;
      this.email = res.result.email ;
      this.account = res.result.account ;
      if( res.result.general_taxpayer_qualification ){
        let arr = [ res.result.general_taxpayer_qualification ] ;
        this.pic_url = arr ;
      }
    }).catch(err => {});


    // 计算总的场地费
    this.amontTotalFieldPrice() ;
    // 判断开票金额是否 <10
    this.amountTotalInvoice() ;
    // 获取发票类型
    this.getTichetType() ;

    getInvoiceRate().then(res => {
      this.invoiceContents = res.result.data ;
      for( let item of this.invoiceContents ){
        if( this.invoice_content_id === item.id ){
          // 拿到税率
          this.rate = item.tax_point ;
          // 拿到税率  计算总的税费
          this.amontTotalFee();
          // 计算总的实付金额
          this.amountPaidPrice();
          break ;
        }
      }
    }).catch(err => {});
  },
  watch : {
    ticket_type : function (newVal , oldVal) {
      this.amontTotalFee() ;
      this.amountPaidPrice() ;
    },
    invoice_content_id : function (newVal,oldVal) {
      for( let item of this.invoiceContents ) {
        if (this.invoice_content_id === item.id) {
          // 拿到税率
          this.rate = item.tax_point;
          // 计算税费
          this.amontTotalFee();
          // 重新计算总的实付款
          this.amountPaidPrice() ;
          break ;
        }
      }
    },
    freight_collect : function (newVal , oldVal) {
      // 变化了就从新计算 快递费
      this.amountExpress();
      // 重新计算总的实付款
      this.amountPaidPrice() ;
    }
  }
}
</script>
<style lang="scss">
  @import '../../style/mixin';
  .weui-cell{
    display: flex;
    width: 6.55rem;
    padding: 0 !important;
  }
  .weui-label > i {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.1rem;
    color: $red;
  }
  .vux-popup-picker-placeholder{
    font-size: 0.24rem !important;
  }
</style>
<style lang="scss" scoped>
  @import '../../style/mixin';
  .title{
    padding: 0 0.24rem;
    line-height: 0.9rem;
    border-bottom: 1px solid #e8e8e8;
    font-size: 0.3rem;
    color: #666;
  }
  .invoice-type{
    background-color: #fff;
    .type-box{
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0.46rem 0.2rem;
      .invoice-item{
        @include wh(2.06rem,0.68rem);
        line-height: 0.66rem;
        text-align: center;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        font-size: 0.28rem;
        color: $mainColor;
        &.active{
          border: 0 none;
          color: #fff;
          background-color: $mainColor;
        }
      }
    }
    .invoice-tips{
      padding: 0 0.46rem 0.3rem 0.46rem;
      font-size: 0.22rem;
      color: #999;
    }
  }
  .material {
    margin-top: 0.2rem;
    background-color: #fff;
    .material-type{
      display: flex;
      padding: 0.3rem 0.46rem;
      .material-item{
        @include wh(2.06rem,0.68rem);
        margin-right: 0.2rem;
        line-height: 0.66rem;
        text-align: center;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        font-size: 0.28rem;
        color: $mainColor;
        &.active{
          border: 0 none;
          color: #fff;
          background-color: $mainColor;
        }
      }
    }
  }
  .invoice-head{
    margin-top: 0.2rem;
    background-color: #fff;
    .content{
      padding: 0 0.46rem;
      line-height: 0.9rem;
      .cnt-lt{
        @include sc(0.28rem,#1e1e1e);
        .require-icon{
          display: inline-block;
          vertical-align: middle;
          margin-left: 0.05rem;
          color: $red;
        }
      }
      input{
        @include wh(5rem,0.88rem);
        text-align: right;
        line-height: normal;
        font-size: 0.24rem;
        color: $fontColor;
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.9rem;
        border-bottom: 1px solid #e8e8e8;
        &:last-child{
          border-bottom:0 none;
        }
      }
    }
  }
  .invoice-content{
    margin-top: 0.2rem;
    padding-bottom: 0.4rem;
    background-color: #fff;
    .item-pannel{
      padding:0.2rem 0.46rem;
      height: 1rem;
      overflow: hidden;
      &.viewall{
        height: auto;
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 0.7rem ;
        .common-lt{
          font-size: 0.28rem;
          color: #1e1e1e;
          .rate{
            @include sc(0.24rem,#999);
          }
        }
        .common-rt{
          display: flex;
          align-items: center;
        }
        input{
          position: relative;
          display: inline-block;
          @include wh(0.34rem,0.34rem);
          border-radius: 50%;
          border: 1px solid $mainColor;
          &:checked{
            &:before{
              content: '';
              position: absolute;
              top: 0.07rem;
              left: 0.07rem;
              @include wh(0.16rem,0.16rem);
              border-radius: 50%;
              background-color: $mainColor;
            }
          }
        }
      }
    }
    .gutter{
      .view-all{
        display: block;
        height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.24rem;
        text-align: center;
        color: $mainColor;
        background-color: #f8f8f8;
        .view-text{
          margin-right: 0.06rem;
        }
        .cert-icon{
          display: inline-block;
          vertical-align: middle;
          @include wh( 0.24rem , 0.24rem );
          @include bg-image('../../images/ic_open_blue');
          transition: all 0.3s;
          &.transform{
            transform: rotate(-180deg);
          }
        }
      }
    }
  }
  .important-info{
    margin-top: 0.2rem;
    background-color: #fff;
    .msg{
      height: 0.9rem;
      line-height: 0.9rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.46rem;
      .msg-left{
        width: 1.7rem;
        @include sc(0.3rem,#1e1e1e);
      }
      .rt{
        width: 5rem;
        @include sc(0.26rem,$fontColor);
      }
    }
    .important{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0.46rem;
      .im-lt{
        .name{
          @include sc(0.3rem,#1e1e1e);
        }
        .address{
          margin-top: 0.2rem;
          @include sc(0.24rem,#999);
          .mo-icon{
            height: 0.3rem;
            line-height: 0.3rem;
            padding: 0 0.06rem;
            margin-right: 0.2rem;
            border: 1px solid $red;
            border-radius: 0.04rem;
            @include sc(0.2rem,$red);
          }
        }
      }
      .arrow-rt{
        width: 0.44rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .rt-icon{
          display: inline-block;
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
  }
  .certify{
    margin-top: 0.2rem;
    background-color: #fff;
    .certify-box{
      padding: 0.3rem 0.46rem;
      .select-img{
        position: relative;
        display: flex;
        justify-content: center;
        @include wh(2.54rem,2.02rem);
        background-color: #f1f2f6;
        .add{
          @include ct;
          @include wh(0.72rem,0.72rem);
          @include bg-image('../../images/ic_add_three_one');
        }
      }
    }
  }
  .paid-info{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    @include wh(100%,1rem);
    line-height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    .price{
      width: 5.1rem;
      height: 100%;
      padding-right: 0.2rem;
      text-align: right;
      background-color: #fff;
      .tex{
        @include sc(0.24rem,$fontColor);
      }
      .price-pre{
        color: $red;
      }
      .price-num{
        @include sc(0.34rem,$red);
      }
    }
    .pay-btn{
      width: 2.4rem;
      @include sc(0.34rem,#fff);
      text-align: center;
      background-color: $mainColor;
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
      @include wh(2.18rem,0.64rem);
      line-height: 0.64rem;
      margin: 0.4rem auto 0;
      text-align: center;
      @include sc(0.28rem,#fff);
      border-radius: 0.08rem;
      background-color: $mainColor;
    }
  }
  .apply-info{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    @include wh(100%,1rem);
    border-top: 1px solid #e8e8e8;
    display: flex;
    line-height: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .price{
      width: 5.1rem;
      padding-right: 0.3rem;
      text-align: right;
      @include sc(0.24rem,$fontColor);
      .price-pre{
        @include sc(0.22rem,$red);
      }
      .price-num{
        @include sc(0.3rem,$red);
      }
      .price-next{
        @include sc(0.24rem,$red);
      }
    }
    .apply-btn{
      width: 2.4rem;
      @include sc(0.34rem,#fff);
      text-align: center;
      background-color: $mainColor;
    }

  }
  .fill{
    width: 100%;
    height: 1rem;
  }
  .fee-detail{
    margin-top: 0.2rem;
    background-color: #fff;
    .item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0.46rem;
      height: 0.9rem;
      border-bottom: 1px solid #eee;
      @include sc(0.28rem,$fontColor);
      .info-icon{
        display: inline-block;
        vertical-align: top;
        margin-right: 0.1rem;
        @include wh( 0.3rem ,0.3rem );
        @include bg-image('../../images/ic_prompt_one_two_four_one');
      }
      &:nth-child(3){
        border-bottom: 0 none;
      }
    }
    .fee-tips{
      padding: 0 0.46rem;
      line-height: 0.6rem;
      @include sc(0.22rem,#999);
      background-color: #f0f0f0;
    }
  }
  .remarks{
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    padding: 0 0.24rem;
    height: 1.08rem;
    background-color: #fff;
    .tit{
      @include sc(0.28rem,$fontColor)
    }
    .ticket-remarks{
      flex: 1;
      text-align: right;
      height: 0.6rem;
      line-height: 0.6rem;
    }
  }
  .express-ipt {
    margin-left: 0.2rem;
    input{
      position: relative;
      display: inline-block;
      vertical-align: bottom;
      @include wh(0.34rem,0.34rem);
      margin-right: 0.1rem;
      border-radius: 50%;
      border: 1px solid $mainColor;
      &:checked{
        &:before{
          content: '';
          position: absolute;
          top: 0.07rem;
          left: 0.07rem;
          @include wh(0.16rem,0.16rem);
          border-radius: 50%;
          background-color: $mainColor;
        }
      }
    }
  }
</style>
