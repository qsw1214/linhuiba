<template lang="html">
  <div class="info-wraper">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">所有信息</div>
    </v-head>
    <section class="res-detail" ref="resDetail">
      <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem' v-model="tab">
        <tab-item>场地信息</tab-item>
        <tab-item>社区信息</tab-item>
      </tab>

      <swiper v-model="tab" :height="height" :show-dots="false">
        <swiper-item>
          <div class="com-info" v-if="physicalResource">
            <div class='info-item'>
              <span class='tit'>摆摊时间：</span>
              <span class='txt'>{{physicalResource.do_begin+"-"+physicalResource.do_finish}}</span>
            </div>
            <div class='info-item'>
              <span class='tit'>场地面积：</span>
              <span class='txt'>{{physicalResource.total_area}}㎡</span>
            </div>
            <div v-if="physicalResource.requirement||physicalResource.property_requirement" class='info-item'>
              <span class='tit'>物业要求：</span>
              <span class="txt">
                <span v-if="physicalResource.requirements.length" v-for="(requirement , index) in physicalResource.requirements" :key="index">{{ requirement ? requirement.display_name : '' }}</span>
                <span>{{ physicalResource.property_requirement }}</span>
              </span>
            </div>
            <div v-if="physicalResource.contraband.length||physicalResource.other_contraband" class='info-item'>
              <span class='tit'>禁摆品类：</span>
              <span class="txt">
                <span v-if="physicalResource.contraband.length" v-for="(band , index) in physicalResource.contraband" :key="index">{{ band ? band.display_name : ''}}</span>
                <span>{{ physicalResource.other_contraband }}</span>
              </span>
            </div>
            <div v-if="physicalResource.peak_time" class='info-item'>
              <span class='tit'>流量高峰：</span>
              <span class='txt'>{{physicalResource.peak_time.display_name}}</span>
            </div>
            <div v-if="physicalResource.male_proportion" class='info-item'>
              <span class='tit'>男女比例：</span>
              <span class='txt'>男性{{physicalResource.male_proportion}}%/女性{{100-physicalResource.male_proportion}}%</span>
            </div>
            <div v-if="physicalResource.doLocation" class='info-item'>
              <span class='tit'>摆摊位置：</span>
              <span class='txt'>{{physicalResource.doLocation+(physicalResource.indoor==1?'(室内)':physicalResource.indoor==0?'(室外)':'')}}</span>
            </div>
            <div v-if="physicalResource.number_of_people" class='info-item'>
              <span class='tit'>人流　量：</span>
              <span class='txt'>{{physicalResource.number_of_people}}</span>
            </div>
            <div v-if="physicalResource.facade" class='info-item'>
              <span class='tit'>展示方向：</span>
              <span class='txt'>{{physicalResource.facade+'面'}}</span>
            </div>
            <div v-if="physicalResource.description||physicalResource.ac_description" class='info-item'>
              <span class='tit'>场地描述：</span>
              <span class='txt'>{{physicalResource.description||physicalResource.ac_description}}</span>
            </div>
            <div v-if="physicalResource.charging_standard" class='info-item'>
              <span class='tit'>车位信息：</span>
              <span class='txt'>{{community.charging_standard}}</span>
            </div>
            <div class='info-item' v-if="physicalResource.information">
              <span class='tit'>历史单量：</span>
              <span class="txt">{{ physicalResource.information }}</span>
              <!--<span class='txt'>{{physicalResource.number_of_registered_users?'用户平均注册'+physicalResource.number_of_registered_users+'个;':''}}{{physicalResource.sale?'售卖类平均销售额'+physicalResource.sale/100+'元;':''}}{{physicalResource.number_of_download?'APP下载量'+physicalResource.number_of_download+'个;':''}}{{physicalResource.number_of_follower?'公众号关注类获取'+physicalResource.number_of_follower+'个;':''}}{{physicalResource.sales_volume}}</span>-->
            </div>
            <div v-if="physicalResource.facilities" class='info-item'>
              <span class='tit'>配套设施：</span>
              <span class='txt'>{{community.facilities}}</span>
            </div>

            <div v-if="physicalResource.participation_level" class='info-item'>
              <span class='tit'>用户参与度：</span>
              <span class='txt'>{{physicalResource.participation_level.display_name}}</span>
            </div>
            <div v-if="physicalResource.age_level" class='info-item'>
              <span class='tit'>年龄　层：</span>
              <span class='txt'>{{physicalResource.age_level.display_name}}</span>
            </div>
            <div v-if="physicalResource.consumption_level" class='info-item'>
              <span class='tit'>消费能力：</span>
              <span class='txt'>{{physicalResource.consumption_level.display_name}}</span>
            </div>
            <div v-if="physicalResource.res_type_id==1&&physicalResource.company_comment" class='info-item'>
              <span class='tit'>邻汇评测：</span>
              <span class='txt'>{{ physicalResource.company_comment }}</span>
            </div>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="com-info" v-if="community">
            <div class='info-item'>
              <span class='tit'>社区名称：</span>
              <span class='txt'>{{community.name}}</span>
            </div>
            <div class='info-item'>
              <span class='tit'>社区类型：</span>
              <span class='txt'>{{community.community_type.display_name}}</span>
            </div>
            <div v-if="community.build_year" class='info-item'>
              <span class='tit'>建成年份：</span>
              <span class='txt'>{{community.build_year}}年</span>
            </div>
            <div class='info-item info-item-two'>
              <div v-if="community.number_of_households" class="item-two">
                <span class='tit'>户　　数：</span>
                <span class='txt'>{{community.number_of_households}}</span>
              </div>
              <div v-if="community.occupancy_rate" class="item-two">
                <span class='tit'>入住率：</span>
                <span class='txt'>{{community.occupancy_rate||"-"}}</span>
              </div>
            </div>
            <div class='info-item info-item-two'>
                <span class='tit'>房　　价：</span>
                <span class='txt'>{{community.house_price}}元/㎡</span>
            </div>
            <div v-if="community.property_costs" class='info-item'>
              <span class='tit'>物业　费：</span>
              <span class='txt'>{{(community.property_costs/100+'元/㎡·月')}}</span>
            </div>
            <div v-if="community.detailed_address" class='info-item'>
              <span class='tit'>详细地址：</span>
              <span class='txt'>{{community.detailed_address}}</span>
            </div>
            <div v-if="community.community_type" class='info-item'>
              <span class='tit'>社区类型：</span>
              <span class='txt'>{{community.community_type.display_name}}</span>
            </div>
            <div v-if="community.construction_class" class='info-item'>
              <span class='tit'>园区等级：</span>
              <span class='txt'>{{community.construction_class.display_name}}</span>
            </div>
            <div v-if="community.tradingarea" class='info-item'>
              <span class='tit'>所在商圈：</span>
              <span class='txt'>{{community.tradingarea.name}}</span>
            </div>
            <div v-if="community.building_area" class='info-item'>
              <span class='tit'>占地面积：</span>
              <span class='txt'>{{community.building_area+'㎡'}}</span>
            </div>
            <div v-if="community.property_costs" class='info-item'>
              <span class='tit'>物业　费：</span>
              <span class='txt'>{{(community.property_costs/100+'元/㎡·月')}}</span>
            </div>
            <div v-if="community.rent" class='info-item'>
              <span class='tit'>租　　金：</span>
              <span class='txt'>{{(community.rent?community.rent/100:'-')+'元/㎡'}}</span>
            </div>
            <div v-if="community.total_number_of_people" class='info-item'>
              <span class='tit'>总人　数：</span>
              <span class='txt'>{{community.total_number_of_people}}</span>
            </div>
            <div v-if="community.number_of_enterprises" class='info-item'>
              <span class='tit'>企业　数：</span>
              <span class='txt'>{{community.number_of_enterprises}}</span>
            </div>
            <div v-if="community.enterprise_type" class='info-item'>
              <span class='tit'>企业类型：</span>
              <span class='txt'>{{community.enterprise_type.display_name}}</span>
            </div>
            <div v-if="community.supermarket_type" class='info-item'>
              <span class='tit'>超市定位：</span>
              <span class='txt'>{{community.supermarket_type.display_name}}</span>
            </div>
            <div v-if="community.shopping_mall_type" class='info-item'>
              <span class='tit'>商场定位：</span>
              <span class='txt'>{{community.shopping_mall_type.display_name}}</span>
            </div>
            <div v-if="community.house_attribute" class='info-item'>
              <span class='tit'>住宅属性：</span>
              <span class='txt'>{{community.house_attribute.display_name}}</span>
            </div>
            <div v-if="community.average_fare" class='info-item'>
              <span class='tit'>平均票价：</span>
              <span class='txt'>{{community.average_fare+'元'}}</span>
            </div>
          </div>
        </swiper-item>
      </swiper>

    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { Tab , TabItem , Swiper , SwiperItem } from 'vux';

export default {
  data () {
    return {
      tab : 0 ,
      physicalResource : null ,
      community : null,
      height : '15rem'
    }
  },
  props : [ 'fieldsdetails' ],
  components:{
    vHead,
    Tab ,
    TabItem , Swiper , SwiperItem
  },
  mounted(){
  },
  watch :{
    'fieldsdetails' : function (newVal ,oldVal) {
      this.physicalResource = this.fieldsdetails;
      this.community = this.fieldsdetails.community ;
    },
  }
}

</script>
<style lang="scss">
  .vux-slider > .vux-swiper{
    overflow-y: scroll !important;
  }
</style>
<style lang="scss" scoped>
  @import "../../../style/mixin";

  .info-wraper{
    position: fixed;
    top: 0 ;
    left: 0 ;
    bottom: 0;
    right: 0;
    overflow: auto;
    z-index: 100;
    background-color: $white;
  }
  .res-detail{
    padding:0.9rem 0 0.3rem;
    background-color: #fff;
    .com-info{
      padding: 0.15rem 0.24rem;
      .info-item{
        display: flex;
        margin-top: 0.2rem;
        .tit{
          width: 1.6rem;
          font-size: 0.3rem;
          color: #999;
        }
        .txt{
          width: 5.5rem;
          line-height: 1.1;
          font-size: 0.3rem;
          color: $fontColor;
        }
      }
    }
    /*tab栏重置样式*/
    .vux-tab{
      position: fixed;
      top: 0.9rem;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 0.94rem;
      background-color: #fff;
    }
    .vux-tab .vux-tab-item{
      line-height: 0.94rem;
      font-size: 0.28rem;
      color: #999;
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      font-size: 0.34rem;
      color: #282A2A!important;
    }
  }
</style>
