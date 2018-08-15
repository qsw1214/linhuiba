<template>

    <div class="bgc"></div>

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
@import '../style/mixin' ;

.bgc {
  background-color: #f0f0f0;
  @include wh( 100% , 0.2rem );
}


</style>
