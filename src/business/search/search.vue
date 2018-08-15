<template lang="html">
  <div>
      <div class="head">

        <div class="back" @click.stop="goBack">
          <span class="back-icon"></span>
        </div>
        <div class="ipt">
          <div class="search-icon" @click="wordSearch"></div>
          <input type="search" autocomplete="off"
                 :placeholder="placeholder"
                 v-model="search"
                 @keyup.13="wordSearch"
                 class="search-ipt">
        </div>
        <div class="cancle" @click="wordSearch">搜索</div>
      </div>
      <div class="hot-search">
        <div class="title">热门搜索</div>
        <div class="word-box">
          <span class="word-item border-1px" @click="goHotword(item)" v-for="(item , index) in hotWords" :key="index">{{ item }}</span>
        </div>
      </div>
      <div class="recent-search gutter" v-if="recentSearch.length">
        <div class="title clear">
          <span class="left">最近搜索</span>
          <span class="right" @click="clearRecentSearch"></span>
        </div>
        <div class="list">
          <router-link :to="item.link" class="item" v-for="(item , index) in recentSearch" :key="index">
             {{ item.word }}
          </router-link>
        </div>
      </div>

      <div class="search-list" v-if="showSearchPanel">
        <div class="time-item ellipsis" v-for="(item,index) in list" :key="index" @click.stop="goTimeSearch( item )">{{ item }}</div>
      </div>
  </div>
</template>

<script>
  import { hotWord , fastSearch } from 'src/service/getData' ;
  import { getStorage , setStorage } from 'src/config/tools' ;
  import { COMPANY_REG } from 'src/config/data';

export default {
  data () {
    return {
      placeholder : '搜索商场 / 地铁站点 / 小区等名称...' ,
      search : '' , // 搜索词,
      hotWords : [] , // 热门搜索
      recentSearch : [] , // 最近搜索
      showSearchPanel : false , // 显示搜索面板
      list : [] , // 实时搜索
      city_id : getStorage('cityId') || this.$store.state.cityId
    }
  },
  created(){
    let recentsearch = getStorage( 'recentSearch' ) ;
    if( recentsearch && recentsearch.length ){
      this.recentSearch = recentsearch ;
    }

  },
  mounted (){
    this.init();
  },
  methods : {
    init(){
      let cityId = getStorage('cityId') || this.$store.state.cityId ;
      let params = {
        city_id : cityId ,
      };
      hotWord( params ).then( res => {
        this.hotWords = res.result ;
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goTimeSearch( item ){
      this.search = item ;
      this.wordSearch();
    },
    wordSearch(){
      if( this.search ) {
        if (!COMPANY_REG.test(this.search)) {
          this.$vux.toast.text('你的输入包含特殊字符，请重新输入', 'middle');
          this.search = '';
          return false;
        } else {
          let recentsearch = getStorage( 'recentSearch' ) || [] ;
          if( recentsearch&&recentsearch.length ){
            if( recentsearch.length >= 10 ){
              recentsearch.pop();
            }
            let flag = false ;
            for( let item of recentsearch ){
              if( item.word == this.search ){
                flag = true ; break;
              }
            }
            if( !flag ){
              recentsearch.unshift( { word : this.search , link : `/fields?keywords=${encodeURIComponent(this.search)}&city_id=${ this.city_id }` } );
            }
          }else{
            recentsearch.unshift( { word : this.search , link : `/fields?keywords=${encodeURIComponent(this.search)}&city_id=${ this.city_id }` } );
          }
          setStorage( 'recentSearch',recentsearch );
          this.$router.push({path: '/fields' , query: { keywords : encodeURIComponent(this.search) , city_id : this.city_id } })
        }
      }else{
        this.$router.push('/fields')
      }
    },
    clearRecentSearch(){
      setStorage( 'recentSearch', [] );
      this.recentSearch = [] ;
    },
    goHotword( item ){
      this.$router.push({path: '/fields' , query: { keywords: encodeURIComponent(item ) , city_id : this.city_id } })
    }
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next();
  },
  watch : {
    search : function (newVal , oldVal ) {
      if( newVal ){
        let p = {
          city_id : this.city_id ,
          res_type_id : 1 ,
          keyword : newVal
        }
        fastSearch( p ).then( res => {
          this.list = res.result ;
          if( this.list.length ){
            this.showSearchPanel = true ;
          }else{
            this.showSearchPanel = false ;
          }
        }).catch(err => {
          console.log( err )
          this.$vux.toast.text(err.msg , 'middle')
        })
      }else{
        this.showSearchPanel = false ;
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin" ;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding : 0.18rem 0.24rem;
    font-size: 0;
    background-color: #fff;
    position: relative;
    &:after{
      content: '';
      position: absolute;
      bottom: -0.16rem;
      left: 0;
      @include wh(100%,0.16rem);
      opacity: 0.4;
      background-image: linear-gradient(-180deg, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.00) 100%);
    }
    .dropdown {
      position : relative ;
      .type {
        margin-right: 0.1rem;
        font-size: 0.26rem;
        color: #333;
      }
      .drop-icon {
        display: inline-block;
        @include wh( 0.2rem , 0.1rem );
        margin-bottom: 0.05rem;
        @include bg-image( '../../images/ic_open_gary_button_normal_three' );
      }
      .drop-down {
          position: absolute;
          z-index: 1;
          top : 0.64rem;
          left : 0;
          @include wh( 1.34rem , 2rem );
          padding: 0.08rem 0.1rem 0;
          background-color: #fff;
          box-shadow: 0 2px 20px 0 rgba(0,0,0,0.10);
          >li {
           @include wh( 100% , 1rem );
            @include bb-1px( #ddd );
            line-height: 1rem;
            text-align: center;
            font-size: 0.26rem;
            color: $fontColor ;
            &:last-child{
                @include bd-none;
             }
          }
        &:before{
          content: '';
          position: absolute;
          top: -0.16rem;
          left: 0.3rem;
          width: 0;
          height: 0;
          border-top: 0.08rem solid transparent;
          border-right: 0.08rem solid transparent;
          border-left: 0.08rem solid transparent;
          border-bottom: 0.08rem solid #fff;
        }
      }
    }
    .back{
      .back-icon{
        display: inline-block;
        @include wh( 0.48rem , 0.48rem );
        @include bg-image('../../images/ic_back_black');
      }
    }
    .ipt {
      position: relative;
      .search-ipt {
        @include wh( 4.96rem , 0.64rem );
        padding:0 0.1rem 0 0.7rem;
        border-radius: 0.32rem ;
        font-size: 0.24rem;
        background-color: #eee;
        &::-webkit-input-placeholder {
          font-size: 0.24rem;
          color: #ccc;
        }
      }
      .search-icon{
          position: absolute;
          top: 0.15rem;
          left : 0.3rem;
          @include wh( .36rem , 0.34rem );
          @include bg-image( '../../images/ic_search_gray_normal_three' );
      }
    }
    .cancle {
      font-size: 0.24rem;
      color: #999;
    }
  }
  .hot-search {
    padding: 0.3rem 0.28rem 0.4rem 0.28rem;
    background-color: #fff;
    .title {
      font-size: 0.24rem;
      color: #999;
    }
    .word-box {
      font-size: 0;
      .word-item {
        display: inline-block;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.4rem;
        margin : 0.2rem 0.2rem 0 0 ;
        border-radius: 0.3rem ;
        font-size: 0.26rem;
        color: $fontColor;
        background-color:  #F1F2F6;
      }
    }
  }
  .recent-search {
    margin-top: 0.2rem;
    overflow: hidden;
    background-color: #fff;
    .title {
      margin-top: 0.3rem;
      font-size: 0.24rem;
      color: #999;
      > span {
        color: #999;
        &:nth-of-type(2) {
          display: inline-block;
          @include wh( 0.26rem , 0.32rem );
          @include bg-image( '../../images/ic_delete' );
          background-size: 0.26rem 0.32rem;
          background-repeat: no-repeat;
        }
      }
    }
    .list {
      display: flex;
      padding-bottom: 0.2rem;
      flex-wrap: wrap;
      .item {
        display: block;
        padding: 0 0.4rem;
        height: 0.6rem;
        line-height: 0.6rem;
        margin: 0.2rem 0.2rem 0 0;
        font-size: 0.26rem;
        color: $fontColor ;
        background: #F1F2F6;
        border-radius: 0.3rem;
      }
    }
  }
  .search-list{
    position: absolute;
    top: 0.88rem;
    left: 0;
    width: 100%;
    height: auto;
    padding: 0.2rem 0;
    .time-item{
      display: block;
      padding: 0 0.24rem;
      line-height: 0.8rem;
      background-color: #fff;
    }
  }
</style>

