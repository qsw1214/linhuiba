<template lang="html">
  <div>

     <header class="header" v-if="caseDetail">
      <router-link :to="{ name : 'appFacilitatorDetail', params : { id :caseDetail.service_provider_id } }" class="mask"></router-link>
      <app-Scrollhead isFixed="true" :path="'/appFacilitatorDetail/' +  caseDetail.service_provider_id ">
        <div slot="center-part">案例详情</div>
        <span slot="right-part" class="icon" @click="share">

        </span>
      </app-Scrollhead>
      <div class="img-box">

        <img v-lazy="caseDetail.cover_pic_url" alt="服务商主题图片">
      </div>
      <h2>{{ caseDetail.title }}</h2>
      <div class="company">
        <router-link :to="{ name : 'appFacilitatorDetail', params : { id :caseDetail.service_provider_id } }" class="company-link">
          <span class="company-icon"></span><span class="company-name">{{ caseDetail.service_provide.company }}</span><span class="arrow-rt right"></span>
        </router-link>
      </div>
    </header>
    <div class="case-detail" v-if="caseDetail">
      <div class="title">案例详情</div>
      <div class="details" v-html="caseDetail.detail">

      </div>
    </div>
    <div class="other-server" v-if="facilitatorList.length">
      <div class="title">其他服务商推荐</div>
      <div class="list-wraper">

          <ul class="list" :style="{ width : facilitatorList.length*4.48 + 'rem'}">
            <li class="res-item" v-for="(item,index) in facilitatorList" :key="index">
              <router-link :to="{ name : 'appFacilitatorDetail', params : { id :item.id } }">
                <div class="img-box">
                  <img v-lazy="item.pic_url" alt="服务商主题图片">
                </div>
                <div class="text-info">
                  <p class="tit ellipsis">{{ item.company }}</p>
                  <p class="contract">联系电话:<span class="tel">{{ item.mobile }}</span></p>
                  <div class="server-box ellipsis">
                    <span class="server-item" v-if="item.design_and_build">设计搭建</span>
                    <span class="server-item" v-if="item.part_time_service">兼职服务</span>
                    <span class="server-item" v-if="item.material_transportation">物料运输</span>
                    <span class="server-item" v-if="item.push_execution">地推执行</span>
                  </div>
                </div>
              </router-link>
            </li>

          </ul>

      </div>
    </div>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import appScrollhead from 'src/components/appScrollhead.vue';
  import { getFacilitatorList , getFacilitatorCaseDetail  } from 'src/service/getData';
  import { half } from 'src/filters/index';
export default {
  data () {
    return {
      facilitatorList: [], // 服务商列表数组
      caseDetail : null ,
    }
  },
  filters : { half },
  components : {
    appScrollhead
  },
  created(){
    this.city_id =  this.$route.query.city_id || 90 ;
  },
  mounted(){
    let id = +this.$route.params.id ;
    getFacilitatorCaseDetail(id).then(res => {
      this.caseDetail = res.result ;
    });

    let params = {
      page : 1,
      pageSize : 10,
      city_id : this.city_id
    };
    getFacilitatorList(params).then( res => {
      this.facilitatorList = res.result.data ;
    });

  },
  methods:{
    share(){
      let obj = {
        case_id : this.$route.params.id ,
        service_provider_id : this.caseDetail.service_provider_id ,
        title : this.caseDetail.title ,
        pic_url : this.caseDetail.cover_pic_url,
        desc : "（"+this.caseDetail.service_provide.company + "）为您呈现精彩案例 》"
      };
      obj = JSON.stringify(obj);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('shareCaseDetail', obj , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .header{
    background-color: #fff;
    .mask{
      position: fixed;
      top: 0.44rem;
      left: 0.15rem;
      width: 0.8rem;
      height: 0.9rem;
      z-index: 150;
    }
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
    .company{
      padding: 0.1rem 0.24rem 0.1rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      line-height: 0.44rem;
      .company-link{
        display: block;
        font-size: 0.24rem;
        color: #666;
        .company-icon{
          display: inline-block;
          vertical-align: top;
          margin:0.03rem 0.18rem 0 0;
          @include wh( 0.36rem ,0.36rem );
          @include bg-image('../../images/ic_store');
        }
        .arrow-rt{
          display: inline-block;
          vertical-align: top;
          @include wh( 0.44rem , 0.44rem );
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
  }
  .case-detail{
    margin-top: 0.2rem;
    padding: 0.3rem 0.24rem 0.22rem;
    background-color: #fff;
    overflow: hidden;
    .title{
      padding-bottom: 0.3rem;
    }
    .details{
        width: 100%;
        overflow-x: scroll;
    }

  }
  .other-server{
    margin-top: 0.2rem;
    background-color: #fff;
    .title{
      font-size: 0.34rem;
      color: #1E1E1E;
      padding: 0.3rem 0.24rem;
    }
    .list-wraper{
      padding-left: 0.24rem;
      overflow-x: scroll;
      .list{
        display: flex;
        .res-item{
          width: 4.28rem;
          margin-right: 0.2rem;
          .img-box{
            >img{
              @include wh( 100% ,3rem );
            }
          }
          .text-info{
            padding: 0.2rem 0;
            .tit{
              font-size: 0.3rem;
              color: #1e1e1e;
            }
            .contract{
              margin-top: 0.14rem;
              font-size: 0.22rem;
              color: #999;
              .tel{
                margin-left: 0.1rem;
              }
            }
            .server-box{
              margin-top: 0.14rem;
              .server-item{
                margin-right: 0.2rem;
                font-size: 0.22rem;
                color: $mainColor;
              }
            }
          }
        }
      }
    }
  }
</style>
