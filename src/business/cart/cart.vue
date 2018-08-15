<template lang="html">
  <div class="cart-wraper">
    <v-head go-back="true" isFixed="true" ref="head">
      <div slot="center-part">购物车({{cartList.length}})</div>
      <div slot="right-part" class="rt" v-if="selectedNum">
        <span class="clear-cart" @click.stop="queryModel=true"></span>
      </div>
    </v-head>

    <div class="submit-table" v-if="cartList.length">
      <tips><div slot="text">提示：广告类订单请在APP上查看</div></tips>
      <div class="invalid-field" v-if="invalid_count" @click.stop="goToNotValid">
        <span>{{ invalid_count }}个场地已失效，去查看</span>
        <span class="icon"></span>
      </div>

      <div class="field-resource">
        <label class="field-tit"><input class="checkbox all" type="checkbox" v-model="allchecked" @click.stop="allcheck"><span>场地资源预订</span></label>
        <div class="cart-item" v-for="(item,index) in cartList" :key="index" v-if="item.valid">
          <div class="checked">
            <input class="checkbox" type="checkbox" v-model="item.is_selected" @click.stop="cartItemClick(item)">
          </div>

          <router-link :to="{ name : 'fieldsDetail' , params : {id : item.resource_id} , query : { res_type_id : item.res_type_id } }" class="cart-link" >
            <div class="img-box">
              <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">

              <v-label :labelText="item.res_type_id==1? item.field_type : item.res_type_id==3 ? item.activity_type : ''"></v-label>

            </div>
            <div class="norms">
              <div class="tit ellipsis">{{ item.name }}</div>
              <div class="time"><span>时间：</span><span>{{ item.date }}</span></div>
              <div class="size"><span>规格：</span><span>{{ item.size }}</span> <span>{{ item.lease_term_type }}</span></div>
              <div class="box" v-if="item.days_in_advance||item.minimum_order_quantity||item.deposit">
                <span class="item" v-if="item.days_in_advance">提前{{item.days_in_advance}}天预订</span>
                <span class="item" v-if="item.minimum_order_quantity">| 至少{{item.minimum_order_quantity}}天起订</span>
                <span class="item" v-if="item.deposit>0">| 押金{{ item.deposit }}元</span>
              </div>
              <div class="custom" v-if="item.custom_dimension">{{ item.custom_dimension }}</div>
              <div class="real-paid" v-if="item.subsidy_fee>0">
                <span class="price-pre">¥</span><span class="price-num">{{ (item.price - item.subsidy_fee)/100 }}</span>
                <del class="origin-price"><span>¥</span><span>{{ item.price/100 }}</span></del>
              </div>
              <div class="real-paid" v-else>
                <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 }}</span>
              </div>
            </div>
          </router-link>

        </div>
      </div>
      <div class="not-valid" ref="notValid">
        <div class="cart-item" v-for="(item,index) in cartList" :key="index" v-if="!item.valid">
          <div class="checked">
            <span class="valid-btn">失效</span>
          </div>
          <router-link :to="{ name : 'fieldsDetail' , params : {id : item.resource_id} , query : { res_type_id : item.res_type_id } }" class="cart-link valid">
            <div class="img-box">
              <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="a">

              <v-label :labelText="item.res_type_id==1? item.field_type : item.res_type_id==3 ? item.activity_type : ''"></v-label>

            </div>
            <div class="norms">
              <div class="tit ellipsis">{{ item.name }}</div>
              <div class="time"><span>时间：</span><span>{{ item.date }}</span></div>
              <div class="size"><span>规格：</span><span>{{ item.size }}</span> <span>{{ item.lease_term_type }}</span></div>
              <div class="box" v-if="item.days_in_advance||item.minimum_order_quantity||item.deposit">
                <span class="item" v-if="item.days_in_advance">提前{{item.days_in_advance}}天预订</span>
                <span class="item" v-if="item.minimum_order_quantity">| 至少{{item.minimum_order_quantity}}天起订</span>
                <span class="item" v-if="item.deposit>0">| 押金{{ item.deposit }}元</span>
              </div>
              <div class="custom" v-if="item.custom_dimension">{{ item.custom_dimension }}</div>
              <div class="real-paid" v-if="item.subsidy_fee>0">
                <span class="price-pre">¥</span><span class="price-num">{{ (item.price - item.subsidy_fee)/100 }}</span>
                <del class="origin-price"><span>¥</span><span>{{ item.price/100 }}</span></del>
              </div>
              <div class="real-paid" v-else>
                <span class="price-pre">¥</span><span class="price-num">{{ item.price/100 }}</span>
              </div>
            </div>
          </router-link>
        </div>

      </div>
      <div class="remove-disabled" v-if="hasUnValid" @click.stop="removeDisabled">清空失效场地</div>
    </div>
    <div class="no-data" v-else>
       <img src="../../images/icon-fail.png" alt="a" class="info-icon">
       <p class="tit">购物车里空空如也</p>
       <router-link to="/home" class="go-home">快去首页逛逛吧</router-link>
    </div>

    <div class="bottom-fence">
      <div class="price">
        <div>
          <input class="checkbox all" type="checkbox" v-model="allchecked" @click.stop="allcheck"><span>全选</span>
        </div>
        <div class="price-box">
          <span class="hj">合计：</span><span class="price-pre">¥</span><span class="price-num">{{ totalPrice/100 | twoPointPre }}.</span><span class="price-next">{{ totalPrice/100 | twoPointNext }}</span>
        </div>

      </div>
      <div class="submit-btn" @click.stop="submit">结算({{selectedNum}})</div>
    </div>
    <div v-transfer-dom>
      <confirm
      v-model="queryModel"
      :close-on-confirm="false"
      title="确定移除所选商品吗？"
      @on-confirm="onConfirm">
      </confirm>
    </div>
    <v-footer :threeselected="true"></v-footer>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead'
  import vLabel from 'src/components/vLabel'
  import tips from 'src/components/tips'
  import vFooter from 'src/components/vFooter'
  import { half , twoPointPre , twoPointNext , large } from 'src/filters'
  import { Confirm, TransferDomDirective as TransferDom } from 'vux'
  // import { mapState, mapActions } from 'vuex' ;
  import { getCartList , removeCartList, addCartList } from 'src/service/getData'
  import { getStorage , setStorage , getStyle , getSession , setSession } from 'src/config/tools'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      hasSelected : true,
      allchecked : false , // 全选按钮
      cartList : [] , // 购物车列表
      totalPrice : 0 , // 总额
      selectedNum : 0 , // 选择的商品数量
      queryModel : false,
      hasUnValid : false ,
      invalid_count : 0 , // 失效的数量
    }
  },
  components : {
    vHead,
    vFooter,
    Confirm,tips , vLabel
  },
  // computed: {
  //   ...mapState([
  //     'addToCartProduct'
  //   ])
  // },
  async mounted(){
    await getCartList().then( res => {
      // console.log( res )
      this.invalid_count = res.result.invalid_count ;
      let temp = res.result.data ;
      let noAd = [] ;
      for(let item of temp){
        // 过滤掉广告
        if(item.res_type_id != 2){
          Object.assign(item , { is_selected : false });
          if(!item.valid){
            this.hasUnValid = true ;
          }
          noAd.push(item);
        }
      }
      this.cartList =  noAd ;
    })

    // if (this.addToCartProduct[0]) {
    //   let arr = this.addToCartProduct
    //   let params = {
    //     resources : JSON.stringify(arr)
    //   }
    //   addCartList(params).then(res => {
    //     this.$store.dispatch('setProductDetailsToCar', [])
    //     location.reload()
    //   }).catch(err => {
    //     this.$vux.toast.show({
    //       text : '加入购物车失败',
    //       type : 'warn',
    //       width : '25%'
    //     })
    //   })
    // }
  },
  filters : {
    half , twoPointPre , twoPointNext , large
  },
  methods : {
    // ...mapActions([
    //   'setProductDetailsToCar'
    // ]),
    onConfirm(){
      let arr = [] ;
      for(let item of this.cartList) {
        if (item.valid && item.is_selected) {
          arr.push( item.shopping_cart_item_id );
        }
      }
      let params = {
        cart_item_ids : JSON.stringify(arr)
      };
      this.queryModel = false ; // 隐藏弹窗
      removeCartList(params).then(res => {
        this.$vux.toast.show({
          text : '成功移除',
          type : 'success',
          width : '25%'
        });
        window.location.reload();
      }).catch( err => {
        this.$vux.toast.show({
          text : '移除失败',
          type : 'warn',
          width : '25%'
        })
      })
    },
    submit(){
      let ids = [] ;
      let arr = [] ;
      for(let item of this.cartList){
        if(item.valid && item.is_selected){
          let obj = {
            id : item.resource_id ,
            size : item.size ,
            lease_term_type_id : item.lease_term_type_id,
            count : item.count,
            count_of_time_unit : item.count_of_time_unit,
            custom_dimension : item.custom_dimension,
            date : item.date,
            lease_term_type_name : item.lease_term_type,
            name : item.name,
            pic_url : item.pic_url,
            discount_rate : item.discount_rate, // 补贴率
            discount_price : 0 , // 补贴钱
            field_type : item.res_type_id == 1 ? item.field_type : item.res_type_id == 3 ? item.activity_type : '' ,
            price : item.price - item.subsidy_fee, // 真实价格
            deposit : item.deposit,
            leaveWorld : '', // 留言
          };
          arr.push(obj);
          ids.push( item.shopping_cart_item_id );
        }
      }
      if( !arr.length || !ids.length ){
        this.$vux.toast.text('请选择你要结算的商品' , 'middle');
        return false ;
      }

      setSession('orderResource',{ resource : arr , cart_item_ids : ids });
      this.$router.push('/submitOrder');
    },
    countPrice(){
      let sum = 0 ;
      let selected = 0 ;
      for(let item of this.cartList) {
        if (item.valid && item.is_selected) {
          sum += (item.price - item.subsidy_fee) ;
          selected++
        }
      }
      this.totalPrice = sum ;
      this.selectedNum = selected ;
    },
    allcheck(){
      if(this.allchecked){
        for(let item of this.cartList){
          if(item.valid){
            item.is_selected = true ;
          }
        }
      }else{
        for(let item of this.cartList){
          if(item.valid){
            item.is_selected = false ;
          }
        }
      }
      this.countPrice();
    },
    cartItemClick(item){
      if(item.is_selected){
        let flag = true ;
        for(let t of this.cartList){
          if(!t.is_selected){
            flag = false ;
          }
        }
        if(flag){
          this.allchecked = true ;
        }
      }else{
        this.allchecked = false ;
      }
      this.countPrice();
    },
    removeDisabled(){
      let arr = [] ;
      for(let item of this.cartList) {
        if ( !item.valid ) {
          arr.push( item.shopping_cart_item_id );
        }
      }
      if(arr.length){
        let params = {
          cart_item_ids : JSON.stringify(arr)
        };
        removeCartList(params).then( res => {
          this.$vux.toast.show({
            text : '成功移除',
            type : 'success',
            width : '25%'
          });
          window.location.reload();
        }).catch( err => {
          this.$vux.toast.show({
            text : '移除失败',
            type : 'warn',
            width : '25%'
          })
        })
      }
    },
    goToNotValid(){
      let notValid = this.$refs.notValid.offsetTop - 50 ;
      window.scrollTo( 0,notValid )
    }
  }
}

</script>
<style lang="scss">
  @import "../../style/mixin";
  .weui-icon-success{
    font-size: 0.42rem !important;
  }
  .weui_icon_circle{
    font-size: 0.42rem !important;
  }
  .vux-check-icon > span{
    margin-left: 0.15rem;
    color: #666 !important;
    font-size: 0.3rem;
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";
  .clear-cart{
    display: inline-block;
    vertical-align: middle;
    @include wh( 0.36rem , 0.4rem );
    @include bg-image( '../../images/ic_delete' );
  }
  .checkbox{
    display: inline-block;
    @include wh(0.42rem,0.42rem);
    @include bg-image('../../images/ic_chose1_nor_three');
    &.all{
      @include wh(0.46rem,0.46rem);
      margin-right: 0.2rem;
      vertical-align: middle;
    }
    &:checked{
      @include bg-image('../../images/ic_chose1_press_three');
    }
  }
  .cart-wraper{
    background-color: $bgc;
  }
  .submit-table{
    padding-bottom: 2rem;
    .invalid-field{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.96rem;
      padding: 0 0.24rem;
      @include sc(0.3rem,$red);
      border-bottom: 1px solid #eee;
      background-color: #fff;
      .icon{
        @include wh(0.44rem,0.44rem);
        @include bg-image('../../images/ic_next');
      }
    }
    .field-resource{
      .field-tit{
        display: flex;
        align-items: center;
        height: 1.1rem;
        padding: 0 0.24rem;
        @include sc(0.3rem,$fontColor);
        border-bottom: 1px solid #eee;
        background-color: #fff;
      }
    }
    .cart-item{
      display: flex;
      padding: 0.24rem 0;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      .checked {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 0.42rem;
          margin: 0 0.33rem;
          .valid-btn {
            display: inline-block;
            text-align: center;
            height: 0.28rem;
            line-height: 0.28rem;
            font-size: 0.18rem;
            border-radius: 0.04rem;
            color: #fff;
            background-color: #bbb;
          }
        }
      .cart-link {
        display: flex;
        .img-box {
          @include wh(2rem, 2rem);
          margin-right: 0.2rem;
          position: relative;
          > img {
            @include wh(100%, 2rem);
          }
        }
        .norms {
          position: relative;
          width: 4.22rem;
          padding-right: 0.24rem;
          .tit {
            margin-top: 0.1rem;
            font-size: 0.28rem;
            color: $fontColor;
          }
          .time {
            margin-top: 0.15rem;
            font-size: 0.22rem;
            color: #999;
          }
          .size {
            margin-top: 0.15rem;
            font-size: 0.22rem;
            color: #999;
          }
          .box{
            margin-top: 0.15rem;
            @include sc(0.22rem,#7B99BB);
          }
          .custom {
            height: 0.24rem;
            margin-top: 0.1rem;
            font-size: 0.22rem;
            color: $mainColor;
          }
          .real-paid {
            margin-top: 0.15rem;
            .price-pre {
              font-size: 0.22rem;
              color: $red;
            }
            .price-num {
              font-size: 0.28rem;
              color: $red;
            }
            .origin-price {
              font-size: 0.22rem;
              color: #999;
            }
          }
        }
        &.valid {
          .norms {
            .tit {
              color: #999;
            }
            .custom {
              color: #999;
            }
            .box{
              @include sc(0.22rem,#999);
            }
            .real-paid {
              .price-pre {
                color: #999;
              }
              .price-num {
                color: #999;
              }
            }
          }

        }
      }
      &:last-child{
        border-bottom: 0 none;
      }
    }

  }
  .no-data{
    padding-top: 0.9rem;
    text-align: center;
    padding-bottom: 2rem;
    .info-icon{
      @include wh(1.36rem,1.36rem);
      margin: 0 auto;
    }
    .tit{
      margin-top: 0.3rem;
      font-size: 0.32rem;
      color: $fontColor;
    }
    .go-home{
      display: block;
      margin-top: 0.3rem;
      @include sc(0.24rem,#999);
    }
  }
  .bottom-fence{
    position: fixed;
    bottom: 1rem;
    left: 0;
    display: flex;
    justify-content: space-between;
    @include wh( 100% , 1rem );
    line-height: 1rem;
    .price{
      display: flex;
      justify-content: space-between;
      width: 5.1rem;
      padding:0 0.2rem 0 0.3rem;
      background-color: #fff;
      .price-box{
        .hj{
          font-size: 0.24rem;
          color: $fontColor;
        }
        .price-pre{
          @include sc( 0.22rem , $red );
        }
        .price-num{
          @include sc( 0.3rem , $red );
        }
        .price-next{
          @include sc( 0.24rem , $red );
        }
      }
    }
    .submit-btn{
      width: 2.4rem;
      font-size: 0.34rem;
      color: #fff;
      text-align: center;
      background-color: $orange;
    }
  }
  .remove-disabled{
    @include wh(3.4rem ,0.86rem);
    margin: 0.3rem auto 0.5rem;
    line-height: 0.86rem;
    color: $mainColor;
    font-size: 0.3rem;
    text-align: center;
    background-color: #fff;
    border-radius: 0.43rem;
  }
  .not-valid{
    margin-top: 0.2rem;
  }
</style>
