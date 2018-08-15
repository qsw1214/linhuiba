<template lang="html">
  <div class="list-wraper">
    <v-head goBack="true" isFixed="true">
      <div slot="center-part">热门分类</div>
    </v-head>
    <div class="list">
      <div class="type-item" v-for="( item , index ) in fieldTypes" :key="index" @click.stop="goFields(item.field_type)">
        <img v-lazy="item.list_page_pic_url" :data-srcset="item.list_page_pic_url" :alt="item.name"  class="bg-img">

      </div>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import { getCategory } from 'src/service/getData'
export default {
  data () {
    return {
      fieldTypes: [], // 列表数组
    }
  },
  components : {
    vHead
  },
  mounted(){
    getCategory().then( res => {
      this.fieldTypes = res.result;
    });
  },
  methods : {
    goFields(arr){
      let ids = [];
      if(arr.length){
        for(let item of arr){
          ids.push( item.id )
        }
      }
      this.$router.push({path : '/fields' , query : { field_type_id : ids } });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .list-wraper{
    background-color: #fff;
  }
  .list{
    padding: 0 0.24rem 0.4rem;
    background-color: #fff;
    .type-item{
      display: block;
      margin-top: 0.2rem;
      height: 3.6rem;
      position: relative;
      .bg-img{
        @include wh(100%,3.6rem);
      }
      .img-mask{
        @include allcover;
        background-color: rgba(0,0,0,0.48);
      }
    }
  }
</style>
