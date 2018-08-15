<template lang="html">
    <div class="city-wraper">
      <!-- <v-head go-back="true" isFixed="true">
        <div slot="center-part">选择城市</div>
      </v-head>
      <div class="current-city">当前城市:<span class="city">{{ cityName }}</span></div>
      <div class="city-list">
        <p class="agree-city">已开通城市</p>
        <Flexbox :gutter="0" wrap="wrap">
          <c :span="1/4" v-for="item in cityArr" :key="item.id">
            <span class="item" @click="selectCity( item.id , item.name )">{{ item.name }}</span>
          </FlexboxItem>
        </Flexbox>
      </div> -->
      <header>
        <div class="back">
          <router-link to="/home" class="back-link">
            <span class="back-icon"></span>
          </router-link>
        </div>
        <div class="search vt">
          <router-link to="/citySearchresult">
            <span class="searchIcon"></span>
            <div class="link-search">{{ keyword }}</div>
          </router-link>
        </div>
      </header>


      <div class="chinese-select">
        <div class="select-charaset">
          <a class="city-charaset-lists" v-for="(item, i) in firstCityCharacter" href="javascript:void(0)" @click="jump(item)" @touchstart.stop.prevent="jump(item)" >{{ item.toLocaleUpperCase() }}</a>
        </div>
      </div>
      <div class="current-city">
        <p>当前城市：<span>{{ cityName }}</span></p>
      </div>
      <div class="position-hot">
        <p class="position">定位</p>
        <p class="close-position" v-if="cityName&&cityName.length == 0">定位服务未开启，马上去<span>开启定位</span></p>
        <span class="now-city" v-else><span></span>{{ nowCity }}</span>
        <p class="position hot-city">热门城市</p>
        <div class="hot-list">
          <Flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/3" v-for="(item, i) in hotCity" :key="i"><div class="hot-city-lists" @click="selectCity( item.id , item.name )">{{ item.name }}</div></flexbox-item>
          </Flexbox>
        </div>
      </div>
      <div class="lists">
        <!-- <div class="city" @click="selectCity( 0, '全国' )">
          <p>全国</p>
        </div> -->
        <div v-for="(item, index) in citylists" class="_jump" :id="item.lettler">
          <div class="chartes">
            <p>{{ item.lettler.toLocaleUpperCase() }}</p>
          </div>
          <div class="city" v-for="item1 in item.items" @click="selectCity( item1.id , item1.name )">
              <p>{{ item1.name }} </p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { getCitys, getCurrentCity } from 'src/service/getData';
  import { mapState , mapMutations } from 'vuex' ;
  import { getStorage } from 'src/config/tools' ;
  import vHead from 'src/components/vHead' ;
  import { Flexbox , FlexboxItem } from 'vux' ;
export default {
  data () {
    return {
      keyword: '请输入城市名（如杭州，hangzhou)',
      cityArr : [] ,
      firstCityCharacter: [],      
      cityName : '',
      hotCity: [],
      citylists: [],
      nowCity: ''
    }
  },
  computed : {
    ...mapState([
      'citys'
    ])
  },
  created () {
    this.cityName = getStorage( 'cityName');
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next()
  },
  components : {
    vHead,
    Flexbox,
    FlexboxItem
  },
  async mounted (){
    // var myCity = new BMap.LocalCity();
    // function myFun(result){
    //   var cityName = result.name;
    //   alert("当前定位城市:"+cityName);
	  // }
    // myCity.get(myFun);

    getCurrentCity().then(res => {
      this.nowCity = res.result.city
    }).catch(e => {
      this.$vux.toast.text('获取失败','middle');
    })
    if( !this.citys.cities ){
      await getCitys().then( res => {
        this.cityArr = res.result.cities;
        this.hotCity = res.result.hot_cities
        this.ALL_CITYS( res.result.cities );
      }).catch( err => {
        this.$vux.toast.text('获取已开通城市列表失败','middle');
      })
    }else{
      this.cityArr = this.citys.cities 
      this.hotCity = this.citys.hot_cities
      // console.log(this.citys)
    }
    // console.log(this.cityArr)
    this.addFirstChinese(this.cityArr)
    this.getCityList()
  },
  methods : {
    ...mapMutations([
      'ALL_CITYS',
      'SAVE_HomeBanner',
      'SAVE_HomeAct'
    ]) ,
    selectCity( id , name ) {
      // 清空首页的banber和活动
      this.SAVE_HomeBanner( undefined );
      this.SAVE_HomeAct( undefined );
      this.$store.commit( 'RECORD_CITY' , id );
      this.$store.commit( 'RECORD_CITYNAME' , name );
      this.$router.push('/home');
    },
    addFirstChinese (arr) {
      let single = []
      let newSet = new Set()
      arr.forEach((v, i) => {
        newSet.add(v.domain_name[0])
      });
      single = Array.from(newSet).sort()
      single.unshift(...['当', '热'])
      this.firstCityCharacter  = single
      console.log(this.firstCityCharacter)
    },
    getCityList () {
      let cityArr = []
      for (var i in this.firstCityCharacter) {
        cityArr.push({lettler: this.firstCityCharacter[i], items: []})
      }

      // 垃圾代码
      let len = cityArr.length;
      let len1 = this.cityArr.length
      for (var j = 2; j < len; j++) {
        for (var e = 0; e < len1; e++) {
          if (cityArr[j].lettler == this.cityArr[e].domain_name[0]) {
            cityArr[j].items.push({name: this.cityArr[e].name,id:  this.cityArr[e].id})
          }
        }
      }
      // end
      this.citylists = cityArr.splice(2, len)
      // console.log(this.citylists)
    },
    jump (item) {
      this.$vux.toast.text(item.toLocaleUpperCase() , 'middle')
      if (item === '当' || item === '热') {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        window.pageYOffset = 0
        return 
      }
      let jump = document.getElementById(`${item}`)
      let total = jump.offsetTop

      document.body.scrollTop = total
      document.documentElement.scrollTop = total
      window.pageYOffset = total
    }
  }
}

</script>
<style lang="scss">
    @import "../../style/mixin";
    .bm-view {
  width: 100%;
  height: 300px;
}
    html, body {
        background-color: $bgc;
    }
      .city-wraper {
    header{
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1;
      display: flex;
      padding: .18rem 0.23rem;
      background-color: #fff;
      .back{
        flex : 0 0 0.7rem;
        height: 0.64rem;
        .back-link{
          display: block;
          .back-icon{
            display: inline-block;
            vertical-align: top;
            @include wh( .54rem, .54rem );
            @include bg-image('../../images/ic_closed_blue_three_four');
            margin-top: .06rem;
          }
        }
      }
      .search {
        flex: 0 0 6.24rem;
        position: relative;
        top: .04rem;
        height: .6rem;
        .searchIcon {
          position: absolute;
          left: 0.2rem;
          top: .21rem;
          @include wh( .18rem , .18rem );
          @include bg-image( "../../images/ic_search_normal_three_two" );
        }
        .link-search {
          background-color: rgba( 255,255,255,1 );
          @include wh( 100% , 100% );
          line-height: 0.64rem;
          padding-left: 0.51rem;
          border-radius: 0.32rem;
          font-size: 0.26rem;
          color: #9D9FA1;
          background: #F1F2F6;
        }
      }
    }
    .chinese-select {
      width: .58rem;
      height: 100%;
      background-color: white;
      position: fixed;
      right: 0;
      .select-charaset {
        margin-top: 1.84rem;
        .city-charaset-lists {
          display: block;
          text-align: center;
          padding-bottom: .14rem;
          color: $mainColor;
          font-weight: bold;
        }
      }
    }
    .position-hot {
      padding: .3rem .84rem .2rem .26rem;
      .position {
        font-size: .24rem;
        color: #999999;
        letter-spacing: 0;
        line-height: .24rem;
      }
      .close-position {
        padding-top: .3rem;
        font-size: .28rem;
        color: #D2D2D2;
        letter-spacing: 0;
        line-height: .28rem;
        > span {
          color: $mainColor
        }
      }
      .now-city {
        background-color: white;
        text-align: center;
        width: 2.01rem;
        height: .8rem;
        line-height: .8rem;
        color: $mainColor;
        display: block;
        margin: .3rem 0;
        border: 0 solid #EEEEEE;

        border-radius: 4px;
        > span {
          position: relative;
          top: .06rem;
          margin-right: .08rem;
          display: inline-block;
          @include wh( .34rem , .34rem );
          @include bg-image( "../../images/ic_dingwei_three_four" );
        }
      }
      .hot-city {
        padding-bottom: .1rem
      }
      .hot-city-lists {
        width: 2rem;
        height: .8rem;
        background-color: white;
        margin-top: .2rem;
        border: 0 solid #EEEEEE;
        border-radius: 4px;
        text-align: center;
        line-height: .8rem;
        font-size: .28rem;
        color: #404042;
        letter-spacing: 0;
      }
    }
    .lists {
      .city {
        background-color: white;
        font-size: .32rem;
        color: #404042;
        letter-spacing: 0;
        line-height: .32rem;
        padding: 0 .84rem 0 .26rem;
        > p{
          padding: .36rem 0;
        }
      }
      .chartes {
        font-size: .32rem;
        color: #404042;
        letter-spacing: 0;
        line-height: .32rem;
        padding: 0 .84rem 0 .26rem;
        > p{
          padding: .36rem 0;
          font-size: .28rem;
          color: #999999;
          letter-spacing: 0;
          line-height: .28rem;
        }
      }
    }
  }
  .current-city {
    padding: .4rem .26rem;
    margin-top: 1.01rem;
    background-color: white;
  }
</style>
<style lang="scss" scoped>
  // .current-city {
  //   margin-top: 0.2rem;
  //   padding: 0 0.28rem;
  //   height: 0.9rem;
  //   line-height: 0.9rem;
  //   font-size: 0.28rem;
  //   color: #888;
  //   background-color: $white;
  //   .city {
  //     margin-left: 0.3rem;
  //     font-size: 0.34rem;
  //     color: #333;
  //   }
  // }
  // .city-list {
  //   padding: 0 0.28rem;
  //   .agree-city {
  //     margin-top: 0.3rem;
  //     font-size: 0.28rem;
  //     color: #888;
  //   }

  //   .item {
  //     display: block;
  //     width: 1.5rem;
  //     height: 0.6rem;
  //     margin-top: 0.2rem;
  //     line-height: 0.6rem;
  //     text-align: center;
  //     border-radius: 0.06rem;
  //     font-size: 0.28rem;
  //     color: #333;
  //     background-color: $white;
  //   }
  // }
</style>
