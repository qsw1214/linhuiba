<template lang="html">
  <div class="down-wraper">
    <img src="../../images/bg_download_three_one.png" alt=" " class="img">
    <div class="btns">
        <a href="https://www.linhuiba.com/b" class="ios">
          <img src="../../images/button_ios_three_one@2x.png" alt="a">
        </a>
        <a href="https://www.linhuiba.com/b" class="andriod">
          <img src="../../images/button_android_three_one@2x.png" alt="a">
        </a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .down-wraper{
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    overflow-y: scroll;
    .btns{
      display: flex;
      justify-content: space-between;
        padding: 0.8rem 0.24rem 0;
        .ios{
          width: 3.02rem;
        }
        .andriod{
          width: 3.02rem;
        }
    }
  }
</style>
