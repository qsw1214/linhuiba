<template lang="html">
  <div class="about-wraper">
    <div class="logo-wraper">
      <div class="logo"></div>
    </div>
    <p class="content">
      【邻汇吧】，线下流量交易市场，
      专注于为线下品牌推广或零售活动提供人流聚集的闲置场地在线预订，
      提高社区、园区、写字楼、商场、地铁、高铁、机场、景区、游乐场等场景流量的获取效率。
      目前覆盖杭州、北京、上海、深圳四个城市。
      截止2017年6月，平台场地5000余，可租赁商业面积15万方，场地上单日人流量880万。
    </p>
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="tit">{{ item.name }}</div>
        <div class="item-cell">
          <span class="cell-left">{{ item.type }}：</span><a class="tel" :href="item.num | tel" >{{ item.num }}</a>
        </div>
        <div class="item-cell">
          <span class="cell-left">{{ item.reserved_type }}：</span><a class="tel" :href="item.reserved_num | tel">{{ item.reserved_num }}</a>
        </div>
        <div class="item-cell">
          <span class="cell-left">地　　　址：</span><span class="address">{{ item.address }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getContactsList } from 'src/service/getData';
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
export default {
  data () {
    return {
      list : [] ,
    }
  },
  filters:{
    tel: (num) => {
      return 'tel:' + num.replace(/-/gi , '')
    }
  },
  mounted(){
    getContactsList().then(res => {
      this.list = res.result ;
    }).catch(err => {})
  }
}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.about-wraper{
  .logo-wraper{
    overflow: hidden;
    background-color: #fff;
    .logo{
      @include wh(1.76rem,1.76rem);
      margin: 0.4rem auto;
      @include bg-image('../../images/ic_blue_logo_three');
    }
  }
  .content{
    padding: 0.2rem 0.24rem;
    line-height: 0.4rem;
    background-color: #fff;
  }
  .list{
    .item{
      margin-top: 0.2rem;
      padding: 0.2rem 0.24rem;
      background-color: #fff;
      .tit{
        font-size: 0.3rem;
        font-weight: bold;
      }
      .item-cell{
        display: flex;
        margin-top: 0.1rem;
        .cell-left{
          width: 2rem;
        }
        .tel{
          color: $mainColor;
        }
        .address{
          flex: 1;
        }
      }
    }
  }
}
</style>
