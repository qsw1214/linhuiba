<template lang="html">
  <div>
    <div class="mask" v-if="$route.query.is_back" @click="backMsg"></div>
    <router-link to="/appMyDemand" class="mask" v-else></router-link>
    <app-head isFixed="true" path="/appDemand">
        <div slot="center-part">需求详情</div>
    </app-head>
    <div class="wraper" v-if="details">

       <div class="result" v-if="details.status==2" @click.stop="demandGoOrder( details.filed_order )">
        <div class="tit">
          <span>已处理</span>
        </div>
        <div class="success-text">{{ details.result }}</div>
      </div>
      <div class="result fail" v-if="details.status==0">
        <div class="tit">
          <span>正在处理</span>
        </div>
        <div class="success-text">{{ details.result }}</div>
      </div>

      <div class="pannel">
        <div class="tit">联系方式</div>
        <div class="content">
          <div class="com-item">
            <span class="item-lt">联系人：</span>
            <span class="item-rt">{{ details.name }}</span>
          </div>

          <div class="com-item">
            <span class="item-lt">手机号：</span>
            <span class="item-rt">{{ details.mobile }}</span>

          </div>

          <div class="com-item">

            <span class="item-lt">公司名称：</span>
            <span class="item-rt">{{ details.company }}</span>

          </div>

          <div class="com-item">
            <span class="item-lt">产品名称：</span>
            <span class="item-rt">{{ details.product }}</span>
          </div>

        </div>

      </div>

      <div class="pannel">
        <div class="tit">需求信息</div>
        <div class="content">
         <div class="com-item">
          <span class="item-lt">所需城市：</span>
          <span class="item-rt">

            <span class="single" v-for="(item,index) in details.appeal_cities" :key="index"><span v-if="index>0">、</span>{{ item.city.city_name }}</span>

          </span>

          </div>
          <div class="com-item">
            <p class="item-lt">场地类型：</p>
            <p class="item-rt">
              <span class="single" v-for="(item,index) in details.appeal_field_type" :key="index"><span v-if="index>0">、</span>{{ item.field_type.display_name }}</span>
            </p>
          </div>

          <div class="com-item">
            <span class="item-lt">单场预算：</span>
            <span class="item-rt">{{ details.single_field_budget | twoPoint }}</span>
          </div>
          <div class="com-item">
            <p class="item-lt">所需场地：</p>
            <p class="item-rt">{{ details.number_of_fields }}</p>
          </div>

          <div class="com-item">
            <span class="item-lt">推广形式：</span>
            <span class="item-rt" v-if="details.spread_way">{{ details.spread_way.spread_way_name }}</span>
          </div>
           <div class="com-item">
            <span class="item-lt">开始时间：</span>
            <span class="item-rt">{{ details.start }}</span>
          </div>
        </div>

      </div>

      <div class="pannel">
        <div class="tit">补充信息</div>
        <div class="content">
          <div class="com-item">
            <span class="item-lt">需求面积：</span>
            <span class="item-rt">{{ details.minimum_area | twoPoint }}-{{ details.maximum_area | twoPoint }}</span>
          </div>
          <div class="com-item">
            <span class="item-lt">周期偏好：</span>
            <span class="item-rt" v-if="details.price_prefer">包{{ details.price_prefer.price_prefer_name }}</span>
          </div>
          <div class="com-item">
            <span class="item-lt">服务需求：</span>
            <span class="item-rt">
              <span v-if="details.power">需用电</span>
              <span v-if="details.stay_overnight">物料过夜</span>
              <span v-if="details.establish">设计搭建</span>
              <span v-if="details.part_time_job">需要兼职</span>
            </span>
          </div>
           <div class="com-item">
            <span class="item-lt">携带物料：</span>
            <span class="item-rt">
              <span v-if="details.desk">桌子{{ details.desk_size }}</span>
              <span v-if="details.tent">帐篷{{ details.tent_size }}</span>
              <span v-if="details.backdrop">背景板{{ details.desk_size }}</span>
              <span v-if="details.leaflet">传单</span>
              <span v-if="details.gift">礼品</span>
              <span v-if="details.roll_up_banner">易拉宝</span>
            </span>
          </div>
          <div class="com-item ">
            <span class="item-lt-lg">目标用户消费水平：</span>
            <span class="item-rt">
              <span v-for="(item,index) in details.consumption_level" :key="index"><span v-if="index>0">、</span>{{ item.consumption_level_display_name.display_name }}</span>
            </span>
          </div>
          <div class="com-item ">
            <span class="item-lt-lg">目标用户年龄层：</span>
            <span class="item-rt">
              <span v-for="(item,index) in details.age_level" :key="index"><span v-if="index>0">、</span>{{ item.age_level_display_name.display_name_for_user }}</span>
            </span>
          </div>

           <div class="com-item imgs">
            <span class="item-lt">效果图：</span>
            <div class="img-box">
              <img v-lazy="item.pic_url" alt="a" v-for="(item,index) in details.appeal_imgs" :key="index">
            </div>

          </div>
        </div>
      </div>
      <div class="other" v-if="details.ex_description">
        <div class="tit">备注：</div>
        <div class="desc">{{ details.ex_description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import appHead from 'src/components/appHead.vue';
  import { getDemandDetail } from 'src/service/getData';
  import { twoPoint } from 'src/filters/index' ;
export default {
  data () {
    return {
      details : null ,
    }
  },
  components: { appHead },
  filters : { twoPoint },
  mounted(){
    let id = this.$route.params.id ;
    getDemandDetail(id).then(res => {
      this.details = res.result ;
    })
  },
  methods : {
    demandGoOrder( order ){
      if( !order ) return ;
      order = JSON.stringify(order);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('demandGoOrder', order , function (data) {}) ;
      });
    },
    backMsg(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', '回退' , function (data) {}) ;
      });
    }
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
  .wraper{
    background-color: $bgc;

    .result {
      @include wh(100%, 1.66rem);
      padding: 0 0.24rem;
      color: #fff;
      @include bg-image('../../images/bg_Alreadyprocessed_three');
      overflow: hidden;
      .tit{
        margin-top: 0.4rem;
        font-size: 0.32rem;
      }
      .success-text{
        margin-top: 0.1rem;
        width: 5rem;
        font-size: 0.2rem;
        line-height: 0.4rem;
      }
      &.fail{
        @include bg-image('../../images/bg_beingprocessed_three');
      }
    }
    .pannel{
      margin-top: 0.2rem;
      background-color: #fff;
      .tit{
        padding: 0 0.24rem;
        line-height: 0.9rem;
        height: 0.9rem;
        border-bottom: 1px solid #e8e8e8;
        @include sc(0.3rem,$fontColor);
        font-family: PingFangSC-Regular;
      }
      .content{
        padding: 0.15rem 0;
        .com-item{
          display: flex;
          width: 7rem;
          line-height: 0.6rem;
          margin: 0 auto;
          @include sc(0.28rem,#666);
          .item-lt{
            width: 1.5rem;
            margin-right: 0.2rem;
          }
          .img-box{
            display: flex;
            flex-wrap: wrap;
            width: 3.9rem;
            >img{
              @include wh(1.2rem,1.2rem);
              margin:0.1rem 0.1rem 0 0;
            }
          }
        }
        .com-item-box{
          margin: 0 0.24rem;
          line-height: 0.72rem;
          border-bottom: 1px solid #e8e8e8;
          .item-lt{
            margin-right: 0.2rem;
            @include sc(0.28rem,#333);
          }
          .item-rt{
            @include sc(0.28rem,#666);
          }
        }
        .box{
          display: flex;
          align-items: center;
          padding: 0 0.24rem;
          height: 0.9rem;
          .item{
            padding:0 0.4rem;
            border-right: 1px solid #e8e8e8;
            &:last-child{
              border-right: 0 none;
            }
          }
        }
      }

    }
    .other{
      display: flex;
      background-color: #fff;
      padding: 0.15rem 0.24rem 0.2rem;

      .tit{
        width: 1.6rem;
        @include sc(0.28rem,#666);
      }
      .desc{
        @include sc(0.28rem,#666);
      }
    }
  }

</style>
