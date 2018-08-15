<template lang="html">
  <div>
     <v-head path="/home" isFixed="true">
        <div slot="center-part">资源匹配列表</div>
     </v-head>
     <div v-load-more="loadingMore" type="1">
        <div v-for="( item , index ) in list" :key="index">


          <div class="ads" v-if="type==3">暂不支持广告类资源</div>
          <div v-else>
            <v-fieldlist :field="item" :showCity="true"></v-fieldlist>
          </div>
        </div>

        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
     </div>
  </div>

</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import vFieldlist from 'src/components/vFieldlist.vue';
  import vActivitylist from 'src/components/vActivitylist.vue';
  import { getBackStageList } from 'src/service/getData';
  import { loadMore } from 'src/components/mixin';
  import { LoadMore } from 'vux' ;
export default {
  data () {
    return {
      list : [] ,
      page: 1 ,
      pageSize: 10 ,
      ids : this.$route.query.selling_resource_ids ,
      type : this.$route.query.res_type_id ,
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  components:{ vHead ,vFieldlist ,vActivitylist ,LoadMore },
  mixins : [ loadMore ] ,
  created(){
    this.changeData( this.ids );
  },
  mounted(){
    this.init();
  },
  methods : {
    init(){

      let p = {
        ids: this.ids ,
        page : this.page,
        pageSize : this.pageSize
      };

      getBackStageList( p ).then(res => {
        this.list = res.result ;
      }).catch(err => { console.log(err) });
    },
    changeData(ids){
      if(!ids) return ;
      let idArr = ids.split(',');
      this.ids = idArr.map( (item,index) => {
        return item*1
      });
    },
    loadingMore () {
      if (this.end) {
        return ;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;
      let params = {
        page : this.page ,
        pageSize : this.pageSize ,
        ids : this.ids
      };
      getBackStageList( params ).then( res => {
        this.list = [ ...this.list , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
  }
}

</script>

<style lang="scss" scoped>
  .ads{
    margin-top: 0.5rem;
    font-size: 0.28rem;
    color: #999;
    text-align: center;
  }
  .no-data{
    margin-top: 0.5rem;
    font-size: 0.28rem;
    color: #999;
    text-align: center;
  }
</style>
