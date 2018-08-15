<template>
  <div class="APP">
    <transition name="router-slid" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </transition>
  </div>
</template>

<script type='text/javascript'>

  // 解决动态路由切换路由不跳转的问题
  export default {
    computed : {
      key() {
        return this.$route.name !== undefined?  this.$route.name + +new Date() :  this.$route + +new Date()
      }
    }
  }
</script>
<style lang="scss">
  	@import './style/common';
   /*透明度切换模式  不使用显得更快*/
    /*.router-fade-enter-active, .router-fade-leave-active {*/
      /*transition: opacity .1s;*/
    /*}*/
    /*.router-fade-enter, .router-fade-leave-active {*/
      /*opacity: 0;*/
    /*}*/
    /*滑动切换模式*/
    .router-slid-enter-active, .router-slid-leave-active {
      transition: all .2s;
    }
    .router-slid-enter {
      transform: translateX( 100% );
    }
    .router-slid-leave-active{
      opacity: 0;
    }
</style>
