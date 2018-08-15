<template lang="html">
  <div class="map-wraper">
    <v-head go-back="true">
      <div slot="center-part">地图搜索</div>
      <div slot="right-part" class="rt"><span class="map-icon"></span></div>
    </v-head>
    <div class="tab border-1px">
      <div class="nav">
        <flexbox :gutter="0">
          <flexbox-item :span="1/3" v-for="(item , index) in navArr" :key="index" class="ct" :class="{ 'center-item' : index==1 , 'on' : item.is_selected }">
            <div @click.stop="navPick(item , index)"><span>{{ item.name }}</span><span class="cert"></span></div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="container" v-if="navArr[0].is_selected||navArr[1].is_selected||navArr[2].is_selected">
        <ul class="trading" v-if="navArr[0].is_selected">
          <li class="border-1px">不限</li>
          <li class="border-1px" v-for="(item , index) in trading_area" :key="index" @click.stop="tradingPick(item)">{{ item.name }}</li>
        </ul>
        <ul class="fieldType" v-else-if="navArr[1].is_selected">
          <li class="border-1px">不限</li>
          <li class="border-1px" v-for="(item , index) in fieldtypes" :key="index" @click.stop="fieldTypePick(item)">{{ item.display_name }}</li>
        </ul>
        <ul class="px" v-else="navArr[2].is_selected">

          <li class="border-1px" v-for="(item , index) in fieldSort" :key="index" @click.stop="fieldTypePick(item)">{{ item.display_name }}</li>
        </ul>
      </div>
    </div>
    <baidu-map
        class="bm-view"
        :scroll-wheel-zoom="true"
        :center="center"
        :zoom="zoom"
        @ready = "handler"
        @moving=""
        @moveend=""
        @zoomend="" >
      <!--<bml-marker-clusterer :averageCenter="true">-->
        <!--<bm-marker v-for="(marker,index) in markers" :position="{lng: marker.lng, lat: marker.lat}" :key="index"></bm-marker>-->
      <!--</bml-marker-clusterer>-->
    </baidu-map>
  </div>
</template>

<script>
  import { BmlMarkerClusterer } from 'vue-baidu-map';
  import vHead from 'src/components/vHead' ;
  import { Flexbox , FlexboxItem } from 'vux' ;
  import { getStorage } from 'src/config/tools' ;

export default {
  data () {

    return {
      center : '杭州市',
      city_id : '', // 城市id
      zoom : 12,
      markers : [] ,
      navArr : [{ name : '商圈', is_selected : false },{ name : '场地类型' , is_selected : false },{ name : '排序' , is_selected : false }], // 导航数据
      trading_area: [] , // 商圈
      fieldtypes : [] , // 场地类型
      fieldSort : [] , // 排序

    }
  },
  created(){

    // 根据用户选择的城市初始化地图
    this.center = this.$store.state.cityName || getStorage( 'cityName' ) ;
    this.city_id = this.$store.state.city_id || getStorage( 'cityId' ) ;
  },
  components : {
    vHead ,
    Flexbox ,
    FlexboxItem ,
    BmlMarkerClusterer
  },
  mounted(){
    let config = this.$store.state.config || getStorage( 'config' );
    let citys = config.citylist ;
    for( let item of citys ){
      if( item.city_id === this.city_id ){
        this.trading_area = this.changeSelectData( item.trading_areas ) ;
      }
    }
    this.fieldtypes    = this.changeSelectData( config.fieldtype ) ;
    this.fieldSort =  config.field_sort ;
    console.log( this.trading_area )
    console.log( this.fieldtypes )
    console.log( this.fieldSort )
  },
  methods : {
    // 地图操作的入口
    handler ( { BMap , map } ) {
      let myCity = new BMap.LocalCity();
      myCity.get( res => {
        let cityName = res.name;
        console.log( cityName );
      });
    },
    changeSelectData(obj){
      for (let item of obj) {
        Object.assign(item , { "is_select": false });
      }
      return obj;
    },
    navPick(item, index){
      this.navArr.forEach( (v,i) => {
        if( i != index ){
          v.is_selected = false ;
        }
      });
      item.is_selected = !item.is_selected ;
    },
    tradingPick(item){

    },
    fieldTypePick(item){

    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .map-wraper{

    .map-icon{
      display: inline-block;
      vertical-align: middle;
      @include wh( 0.34rem , 0.36rem );
      @include bg-image('../../images/ic_search_one_two_four_one');
    }
    .tab {
      @include bb-1px(#eee);
      background-color: #fff;
      .nav{
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.26rem;
        color: #666;
        .center-item{
          position: relative;
          top: 0;
          left: 0;
          &:after{
            content: '';
            position: absolute;
            right: 0;
            top: 0.08rem;
            @include wh( 0.01rem , 0.64rem );
            background-color: #e8e8e8;
          }
          &:before{
            content: '';
            position: absolute;
            left: 0;
            top: 0.08rem;
            @include wh( 0.01rem , 0.64rem );
            background-color: #e8e8e8;
          }
        }
        .ct{
          .cert{
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.12rem;
            @include wh( 0.12rem , 0.08rem );
            transform: rotate(180deg);
            @include bg-image('../../images/ic_drop_down_unselect_two_six');
          }
          &.on{
            color: $mainColor;
            .cert{
              @include bg-image('../../images/ic_drop_down_one_two_six');
            }
          }
        }
      }
      .container{
        position: fixed;
        top: 1.7rem;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        width: 100%;
        overflow-y: scroll;
        background-color: #fff;
        >ul{
          padding: 0 0.24rem;
          li{
            line-height: 0.8rem;
            font-size: 0.24rem;
            @include bb-1px(#e8e8e8);
          }
        }
      }
    }
    .bm-view {
      position: fixed;
      top: 1.7rem;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: 1.7rem;
      height: 100%;
    }
  }


</style>
