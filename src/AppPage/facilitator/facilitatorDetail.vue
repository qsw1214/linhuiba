<template lang="html">
  <div v-if="details">
    <header class="header">
      <!-- <router-link to="/appFacilitatorlist" class="mask"></router-link> -->
      <span class="mask" @click="redirectUrl"></span>
      <app-scrollhead path="/appFacilitatorlist" isFixed="true">
          <div slot="center-part">服务商详情</div>
          <span slot="right-part" class="icon" @click="share">

          </span>
      </app-scrollhead>
      <div class="img-box">

        <img v-lazy="details.pic_url" alt="服务商主题图片">
      </div>
      <h2>{{ details.company }}</h2>
      <div class="contact">
         <div class="address ellipsis">
           <span class="map-icon"></span><span>{{ details.office_location }}</span>
         </div>
         <div class="consult">
           <span @click="telUs(details.mobile)">
             <i class="consult-icon"></i><span>咨询</span>
           </span>
         </div>
      </div>
      <div class="server-project">
         <span class="pro-item"  v-if="details.design_and_build">设计搭建</span>
          <span class="pro-item" v-if="details.part_time_service">兼职服务</span>
          <span class="pro-item" v-if="details.material_transportation">物料运输</span>
          <span class="pro-item" v-if="details.push_execution">地推执行</span>
      </div>
    </header>
    <div class="enterprise-info">
      <div class="title">企业简介</div>
      <div class="desc">
        {{ details.company_profile }}
      </div>
    </div>
    <div class="success-case gutter" v-if="caseList.length">
      <div class="title">成功案例</div>

      <div class="case-item" v-for="(item,index) in caseList" :key="index">
        <router-link :to="{ name : 'appCaseDetail' , params : { id : item.id } , query : { city_id : $route.query.city_id } }" class="case-link">
          <img v-lazy="item.cover_pic_url" :data-srcset="item.cover_pic_url | large " alt="案例图片">
          <div class="case-tit ellipsis">{{ item.title }}</div>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import appScrollhead from 'src/components/appScrollhead.vue';
  import { getFacilitatorDetail } from 'src/service/getData';
  import { large } from 'src/filters/index';
export default {
  data () {
    return {
      details : null ,
      caseList : [] , // 服务商案例列表
      isLogin: this.$route.query.is_login,
      redirect: this.$route.query.redirect_url,
    }
  },
  components:{appScrollhead},
  filters : { large },
  mounted(){
    let id = this.$route.params.id ;
    getFacilitatorDetail(id).then(res => {
      this.details = res.result ;
      this.caseList = res.result.cases ;
    })
  },
  methods:{
    telUs(tel){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('telUs', tel , function (data) {}) ;
      });
    },
    share(){
      let obj = {
        id : this.$route.params.id ,
        title : this.details.company ,
        pic_url : this.details.pic_url,
        desc : this.details.company_profile
      };
      obj = JSON.stringify(obj);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('shareFacilitator', obj , function (data) {}) ;
      });
    },
    redirectUrl () {
      if (this.redirect != 'home') {
        this.$router.go(-1)
      } else {
        this.back()
      }
    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    },
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .mask{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }
  .header{
    background-color: #fff;

      .icon{
        display: inline-block;
        vertical-align: top;
        @include wh(0.44rem,0.44rem);
      }

    .img-box{
      position: relative;
      top: 0;
      left: 0;
      >img{
        @include wh( 100% , auto );
      }
      .back-icon{
        position: absolute;
        top: 0.22rem;
        left: 0.24rem;
        @include wh( 0.48rem , 0.48rem );
        @include bg-image('../../images/nav_ic_back_white');
      }
    }
    h2{
      padding: 0.3rem 0.24rem;
      font-size: 0.36rem;
      color: #1e1e1e;
    }
    .contact{
      display: flex;
      padding: 0.16rem 0;
      margin: 0 0.24rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      border-bottom: 0.02rem solid rgba(0,0,0,0.1);
      .address{
        width: 5.8rem;
        border-right: 1px solid rgba(0,0,0,0.1);
        font-size: 0.24rem;
        color: #999;
        line-height: 0.44rem;
        .map-icon{
          display: inline-block;
          vertical-align: top;
          margin-right: 0.12rem;
          @include wh( 0.44rem , 0.44rem );
          @include bg-image('../../images/ic_location');
        }
      }
      .consult{
        width: 1.16rem;
        padding-top: 0.04rem;
        text-align: right;
        font-size: 0.24rem;
        >span{
          display: block;
          color: $mainColor;
          .consult-icon{
            display: inline-block;
            vertical-align: middle;
            margin-right: 0.02rem;
            @include wh( 0.36rem, 0.36rem );
            @include bg-image('../../images/ic_call');
          }
        }
      }
    }
    .server-project{
      padding: 0 0.24rem 0.2rem;
      font-size: 0;
      .pro-item{
        display: inline-block;
        vertical-align: top;
        padding: 0 0.16rem;
        height: 0.4rem;
        margin: 0.2rem 0.2rem 0 0;
        line-height: 0.4rem;
        font-size: 0.22rem;
        color: $mainColor;
        background-color:rgba(0,119,255,0.1);
      }
    }
  }
  .enterprise-info{
    margin-top: 0.2rem;
    padding: 0.3rem 0.24rem 0.24rem;
    background-color: #fff;
    .title{
      padding-bottom: 0.24rem;
      font-size: 0.3rem;
    }
    .desc{
      line-height: 0.36rem;
      font-size: 0.24rem;
      color: #666;
    }
  }
  .success-case{
    margin-top: 0.2rem;
    background-color: #fff;
    .title{
      padding: 0.3rem 0;
      font-size: 0.3rem;
    }
    .case-item{
      overflow: hidden;
      .case-link{
        display: block;
        >img{
          @include wh( 100% , auto );
        }
        .case-tit{
          padding: 0.2rem 0;
          margin-bottom: 0.2rem;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          font-size: 0.28rem;
        }
      }
      &:last-child{
        .case-tit{
          border-bottom: 0 none;
        }
      }
    }
  }
</style>
