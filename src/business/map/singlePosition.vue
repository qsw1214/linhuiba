<template lang="html">
  <div>
     <header>
      <div class="icon" @click.stop="$router.go(-1)">
        <span class="back-icon"></span>
      </div>
      <div class="title ellipsis">{{ tit }}</div>
     </header>
     <baidu-map
        ak='yc3n5fiQQVezzrpESqpE6BCM'
        class="bm-view"
        :scroll-wheel-zoom="true"
        :center="center"
        :zoom="16"
        @ready = "handler">
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
        <bm-marker :position="center" :dragging="false" :icon="{url: 'data:image/png;base64,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', size: {width: 33, height: 35}}" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
    </baidu-map>
  </div>
</template>

<script>

export default {
  data () {
    return {
      tit : '定位中...',
      center : { lng: 116.404, lat: 39.915 }
    }
  },
  components : {
  },
  mounted(){

  },
  methods:{
    // 对照表
    // 20米，50米，100米，200米，500米，1公里，2公里，5公里，10公里
    // 19级，18级，17级， 16级， 15级， 14级， 13级， 12级， 11级
    // 地图操作的入口
    handler ( { BMap , map } ) {

      let myCity = new BMap.LocalCity();
      myCity.get( res => {
        let cityName = res.name;
        this.tit = decodeURIComponent(this.$route.query.fieldName )|| cityName;
        this.center = { lng : this.$route.query.lng , lat : this.$route.query.lat } || cityName;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  header{
    display: flex;
    align-items: center;
    padding: 0 0.24rem;
    height: 0.9rem;
    line-height: 0.9rem;
    background-color: #fff;
    border-bottom: 0.01rem solid #e8e8e8;
    .icon{
      display: inline-block;
      @include wh(0.48rem,0.48rem);
      @include bg-image('../../images/ic_back_black');
    }
    .title{
      width: 6.54rem;
      padding-left:0.4rem;
      font-size: 0.34rem;
    }
  }
  .bm-view {
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>
