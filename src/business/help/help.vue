<template lang="html">
  <div class="help">
      <v-head path="/admin/profile" isFixed="true">
        <div slot="center-part">帮助中心</div>
      </v-head>
      <section>
        <div class="help-list" v-for="( item , index ) in helpList" :key="index">
          <div class="help-item help-type">{{item.type}}</div>
          <router-link :to="{ name: 'article' , params : { id : itemarr.id } ,query:{page:'help'}}" v-for="( itemarr , dot ) in item.item_list" :key="dot">
            <div  class="help-item help-tit">{{ itemarr.name }}</div>
          </router-link>
        </div>
      </section>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { getHelp } from 'src/service/getData';
import { getStorage } from 'src/config/tools';
export default {
  data() {
    return {
      helpList: [], // 文章列表
    }
  },
  components: { vHead},
  async mounted() {
    let res = await getHelp() ;
    let arr = this.changeData( res.result );
    this.helpList = arr ;
  },
  methods: {
    changeData( data ){
      let arr = data || []; // 防止出错
      let newArr = [];
      for( let tempa of arr ){
        let flag = true ;
        for( let tempb of newArr ){
          if( tempb.type === tempa.type ){
            tempb.item_list.push( { id : tempa.id , name : tempa.name } ) ;
            flag = false ;
          }
        }
        if( flag ){
          let o = {
            type : tempa.type ,
            item_list : [
              {
                id : tempa.id ,
                name : tempa.name
              }
            ]
          };
          newArr.push( o )
        }
      }
      return newArr ;
    }
  }

}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.help {
  background: $bgc;
  .help-list {

    .help-item {
      height: 0.9rem;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 0.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.help-type {
        margin-top: 0.2rem;
        font-weight: 900;
        background: #fafafa;
      }
      &.help-tit {

      }
    }
    &:nth-child(1) {
      .help-item:first-child {
        margin-top: 0;
      }
    }

    &:last-child{
      // margin-bottom: 0.2rem
    }
  }
}
</style>
