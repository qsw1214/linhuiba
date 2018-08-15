<template lang="html">
  <div>
      <tabbar>
          <tabbar-item :selected="oneselected || false" link="/home">
              <div slot="icon" class="home"></div>
              <div slot="icon-active" class="home-active"></div>
              <span slot="label">首页</span>
          </tabbar-item>
          <tabbar-item :selected="twoselected || false" link="/fields">
              <div slot="icon" class="market"></div>
              <div slot="icon-active" class="market-active"></div>
              <span slot="label">找场地</span>
          </tabbar-item>
          <tabbar-item :selected="threeselected || false" link="/cart">
              <div slot="icon" class="car"></div>
              <div slot="icon-active" class="car-active"></div>
              <span slot="label">购物车</span>
          </tabbar-item>
          <tabbar-item :selected="fourselected || false" link="/admin/profile">
              <div slot="icon" class="myself"></div>
              <div slot="icon-active" class="myself-active"></div>
              <span slot="label">我的</span>
          </tabbar-item>
      </tabbar>

  </div>
</template>

<script>
    import { Tabbar , TabbarItem } from 'vux';
    import { getCartCount } from 'src/service/getData' ;
export default {

  data () {
    return {
      carCount : '0'
    }
  },
  props : [ 'oneselected','twoselected' , 'threeselected' , 'fourselected' ],
  components : { Tabbar , TabbarItem },
  mounted(){
    getCartCount().then(res => {
      if( res.result.count > 99 ){
        this.carCount = '99+';
      }else {
        this.carCount = res.result.count + '' ;
      }
    }).catch(err => {

    })
  }
}

</script>

<style lang="scss">
    @import "../style/mixin";

    /* 底部导航样式重置 */
    .weui-tabbar {
      position: fixed !important;
      background-color: #fff !important;
    }
    .weui-tabbar__item{
        /*height: 1rem;*/
        padding: 0.14rem 0 0.1rem 0 !important;
        .weui-tabbar__icon {
            width:0.44rem!important ;
            height:0.44rem !important ;
        }
        .weui-tabbar__label{
            margin-top: 0.11rem;
            line-height: 1!important;
            font-size: 0.2rem!important;
        }
        .weui-tabbar__icon > sup{
            top: -0.08rem!important;
        }
        .vux-badge{
          position: absolute;
          top: 0;
          right: -0.1rem;
          height: 0.3rem;
          min-width: 0.3rem;
          max-width: 0.58rem;
          line-height: 0.3rem;
          padding: 0 0.04rem;
          text-align: center;
          color: #fff;
          font-size: 0.18rem;
          border-radius: 0.3rem;
          background-color: $red;
        }
        .vux-reddot:after, .vux-reddot-border:after, .vux-reddot-s:after{
            content: '';
            width: 0.08rem!important;
            height: 0.08rem!important;
            border-radius: 50%!important;
            position: absolute;
            right: -0.03rem!important;
            top: -0.03rem  !important;
        }
    }
    .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
        color: $mainColor !important;
    }
</style>
<style lang="scss" scoped>
   @import "../style/mixin";
   .home {
     height: 0.48rem;
    @include bg-image('../images/ic_shouye_nor_three_two');
   }
   .home-active{
       height: 0.48rem;
       @include bg-image('../images/ic_shouye_chosed_three_two');
   }
   .market {
       height: 0.48rem;
       @include bg-image('../images/ic_dingchangdi_nor_three_two');
   }
   .market-active{
       height: 0.48rem;
       @include bg-image('../images/ic_dingchangdi_chosed_three_two');
   }
   .car {
     height: 0.48rem;
     @include bg-image('../images/ic_gouwuche_nor_three_two');
   }
   .car-active{
       height: 0.48rem;
      @include bg-image('../images/ic_gouwuche_chosed_three_two');
   }
   .myself {
       height: 0.48rem;
       @include bg-image('../images/ic_wode_nor_three_two');
   }
   .myself-active{
       height: 0.48rem;
       @include bg-image('../images/ic_wode_chosed_three_two');
   }
</style>
