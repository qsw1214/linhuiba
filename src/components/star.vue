<template>
  <div class="star" :class="starType">
    <span v-for="( item , index ) in itemClasses" :class="item" class="star-item" :key="index"></span>
  </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {

  props :{
    size : {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed : {
    starType () {
      return 'star-' + this.size ;
    },
    itemClasses () {
      let result = [];
      let score = Math.floor(this.score * 2) / 2;
      let hasDecimal = score % 1 !== 0; // 记录半星
      let integer = Math.floor(score);
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON);
      }
      if (hasDecimal) {
        result.push(CLS_HALF);
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF);
      }
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin" ;
.star{
  font-size: 0 ;
  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }

  &.star-36{
    .star-item{
      @include wh( 0.36rem, 0.36rem );
      margin-right: 0.08rem;
      &:last-child{
        margin-right: 0;
      }
      &.on {
        @include bg-image('../images/ic_selectstar_two_six')
      }
      &.half{
        @include bg-image('../images/ic_selectstar_two_six')
      }
      &.off{
        @include bg-image('../images/ic_unselectstar_two_six')
      }
    }
  }
  &.star-24{
    .star-item{
      @include wh( 0.24rem , 0.24rem );
      margin-right: 0.05rem;
      &:last-child{
        margin-right: 0 ;
      }
      &.on{
        @include bg-image('../images/ic_stars_two_four_one');
      }
      &.half{
        @include bg-image('../images/ic_stars_two_four_one');
      }
      &.off{
        @include bg-image('../images/ic_star_two_four_one');
      }
    }
  }
}
</style>
