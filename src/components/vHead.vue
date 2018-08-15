<template>
  <div>
    <div class="header border-1px" :class="{ fixed : isFixed , blue : blue }">
      <flexbox :gutter="0">
        <flexbox-item :span="3">
          <!--返回上一页-->
          <div class="backIcon" v-if="goBack&&hide" @click="go_back"></div>
          <div class="back" v-if="!goBack">
            <router-link :to="path">
              <div class="backIcon"></div>
            </router-link>
          </div>
        </flexbox-item>
        <flexbox-item :span="6">
          <div class="ct">
            <slot name="center-part"></slot>
          </div>
        </flexbox-item>
        <flexbox-item :span="3">
            <slot name="right-part"></slot>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="fill" v-if="isFixed"></div>
  </div>
</template>

<script>
import { Flexbox , FlexboxItem } from 'vux'
export default {
  data () {
    return {
      hide : this.$route.query.BackKey ? false : true ,
    }
  },
  props : [ 'goBack', 'isFixed' , 'path' , 'blue' ] ,
  components : {
    Flexbox,
    FlexboxItem
  },
  methods : {
    go_back(){
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/mixin' ;
  .header {
    position: relative;
    @include wh( 100% , 0.9rem );
    padding: 0 0.28rem;
    line-height: 0.9rem;
    background-color: $white;
    border-bottom: 1px solid #e8e8e8;
    &.blue{
      background-color: $mainColor;
      border-bottom: 0 none;
      .backIcon{
        @include wh( 0.48rem , 0.48rem );
        @include bg-image("../images/nav_ic_back_white");
      }
      .ct{
        color: #fff;
      }
    }
    &.fixed {
      position: fixed;
      top:0;
      left: 0;
      z-index: 10;
    }
    .backIcon {
      @include wh( 0.48rem , 0.48rem );
      @include bg-image("../images/ic_back_black");
    }
    .back {
      a {
        display: inline-block;
        vertical-align: middle;
        width: 1rem;
      }
    }
    .ct {
      font-size: 0.36rem;
    }
  }
  .fill {
    @include wh( 100% , 0.9rem );
    background-color: transparent;
  }
</style>
