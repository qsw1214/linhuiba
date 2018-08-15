<template lang="html">
  <div class="field-wraper">
   <div class="fixed-wraper">
    <header>
      <div class="back">
        <router-link to="/home" class="back-link">
          <span class="back-icon"></span>
        </router-link>
      </div>
      <div class="search vt">
        <router-link to="/search">
          <span class="searchIcon"></span>
          <!--<input type="search" placeholder="请输入小区/楼宇关键字" v-model="searchValue">-->
          <div class="link-search">{{ keyword }}</div>
        </router-link>
      </div>
      <!--<div class="map">-->
        <!--<router-link to="/map">-->
          <!--<span class="map-icon"></span>-->
        <!--</router-link>-->
      <!--</div>-->
    </header>
    <section class="filter">
       <flexbox :gutter="0">
           <flexbox-item :span="1/4" class="ct">
              <div class="filter-rule" :class="{
                  on : showDropdown ,
                 active : filterData.order_by == 'default_sort'|| filterData.order_by == 'created_at'|| filterData.order_by == 'number_of_people'|| filterData.order_by =='cost_performance'|| filterData.order_by =='number_of_order' }"
                 @click.stop="listSelected">
                <span>{{ pickVal }}</span><span class="cert"></span>
              </div>
          </flexbox-item>
          <flexbox-item :span="1/4" class="ct">
              <div class="filter-rule" :class="{
                 on : showDstDropdown ,
                 active : filterData.trading_area_id.length || filterData.district_id.length }"
                 @click.stop="dstListSelected">
                 <div><span class="txt ellipsis">{{ district }}</span><span class="cert"></span></div>

              </div>
          </flexbox-item>

          <flexbox-item :span="1/4" class="ct">
              <div class="filter-rule"
              :class="{
              on : showPriceDropdown ,
              active : filterData.order_by == 'min_price' || filterData.lowPrice || filterData.highPrice ,
              }"
              @click.stop="priceClick">
              <!--asc : filterData.order_by == 'min_price'&& filterData.order == 'asc' ,
              desc : filterData.order_by == 'min_price'&& filterData.order == 'desc'-->
                <span>价格</span><span class="cert"></span>
              </div>
          </flexbox-item>

          <flexbox-item :span="1/4" class="ct">
              <div class="filter-btn" :class="{ active : filterSelect }" @click.stop="filterSelected">
                <div class="btn">
                  <span>筛选</span><span class="select-icon"></span>
                </div>
              </div>
          </flexbox-item>
       </flexbox>
       <div class="dropdown" v-show="showDstDropdown">
          <div class="sx-wraper" @touchmove="touchmove" @touchstart="touchmove" @touchend="touchend">
            <div class="sx">
              <div class="area-left">
                <ul class="left-ul">
                  <li class="left-item" v-if="districts.length" :class="{ on : tab==1 , active : hasArea }" @click.stop="TabareaClick(1)">
                    <span>行政区</span><span class="red-icon"></span>
                  </li>

                  <!--<li class="left-item" v-if="busArr.length" :class="{  on : tab==2 ,active : hasStation }" @click.stop="TabareaClick(2)">-->
                    <!--<span>地铁站</span><span class="red-icon"></span>-->
                  <!--</li>-->
                  <li class="left-item" v-if="trading_area.length" :class="{  on : tab==3 ,active : hasTrading }" @click.stop="TabareaClick(3)">
                    <span>商　圈</span><span class="red-icon"></span>
                  </li>
                </ul>
              </div>
              <div class="area-right">
                <div class="right-dis" v-if="tab==1">
                  <div class="dis">
                    <div class="down-ul-item" v-for="( item , index ) in districts" :class="{ active : item.is_select }" :key="index" @click.stop="areaClick(item)">
                      <span>{{ item.name }}</span>
                      <span class="icon"></span>
                    </div>
                  </div>
                </div>
                <!--<div class="right-bus" v-else-if="tab==2">-->
                  <!--<div class="bus-line">-->
                    <!--<ul class="line-ul">-->
                      <!--<li class="com-font" :class="{ active : item.is_select || subwayLineId == item.id }" v-for="(item , index) in busArr" :key="index" @click.stop="busLineClick(item)">-->
                        <!--<span class="subline-name ellipsis">{{ item.name }}</span>-->

                        <!--<div class="bus-station" v-if="item.stations.length&&item.stations[0].subway_line_id == subwayLineId">-->
                          <!--<div class="com-font ellipsis" :class="{ active : child.is_select }" v-for="(child,index) in item.stations" :key="index" @click.stop="busStationClick(child)">-->
                            <!--<span class="station-name ellipsis">{{ child.station_name }}</span>-->
                            <!--<span class="icon"></span>-->
                            <!--</div>-->

                        <!--</div>-->
                      <!--</li>-->
                    <!--</ul>-->
                  <!--</div>-->

                <!--</div>-->
                <div class="right-buy" v-else>
                  <div class="down-ul-item" v-for="( item , index ) in trading_area" :class="{ active : item.is_select }" :key="index" @click.stop="tradingClick(item)">
                    <span>{{ item.name }}</span>
                    <span class="icon"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="area-btns">
              <div class="clear" @click.stop="resetCondition">重置</div>
              <div class="confirm" @click.stop="confrimCondition">确认</div>
            </div>
          </div>
       </div>
       <div class="dropdown" v-show="showDropdown" @touchmove="prevent" @click.stop="showDropdown = false">
          <ul class="down-ul">
            <li class="down-ul-item" v-for="( item , index ) in fieldSort" :class="{ active : filterData.order_by == item.order_by && filterData.order == item.order }" @click="pickPx( item , index )" :key="index">
              <span>{{ item.display_name }}</span><!-- <span class="icon"></span> -->
            </li>
          </ul>
       </div>

       <div class="dropdown" v-show="showPriceDropdown" @touchmove="prevent">
          <ul class="down-ul price">
            <li class="down-ul-item" v-for="( item , index ) in priceSort" :class="{ active : filterData.order_by == item.order_by && filterData.order == item.order }" @click="pricePx( item )" :key="index">
              <span>{{ item.txt }}</span><!-- <span class="icon"></span> -->
            </li>
            <li class="price-distance">
              <div class="txt-info">价格区间（元 / 天）</div>
              <div class="box">
                <div class="ipt">
                  <input type="text" placeholder="最低价"  v-model="lowPrice" autocomplete="off"><span class="line">-</span><input type="text" autocomplete="off" placeholder="最高价" v-model="highPrice">
                </div>
                <div class="btns">
                  <span class="reset-btn" @click.stop="priceDistanceReset">重置</span>
                  <span class="confirm-btn" @click.stop="priceDistanceConfirm">确认</span>
                </div>
              </div>
            </li>
          </ul>
       </div>
    </section>
    <section class="filter-label">
        <flexbox :gutter="0">
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isOneSelect || this.filterData.resource_type == 3 }" @click="labelSelected(1)">主题场地</span>
           </flexbox-item>
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isTwoSelect || this.filterData.hot }" @click="labelSelected(2)">热卖</span>
           </flexbox-item>
           <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isThreeSelect || this.filterData.order_by == 'created_at' }" @click="labelSelected(3)">上新</span>
           </flexbox-item>
            <flexbox-item :span="1/4" class="ct">
             <span class="label-item" :class="{ active : isFourSelect || this.filterData.subsidy }" @click="labelSelected(4)">优惠</span>
           </flexbox-item>
        </flexbox>
    </section>
   </div>
    <section class="list mb" v-load-more="loadingMore" type="1" v-if="total>0">
        <v-info :type="tipsType" :total="total" v-if="tipsShow"></v-info>
        <v-fieldlist :field="item" v-for="( item , index ) in fields" :key="index"></v-fieldlist>
        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </section>
    <section class="noresult-box" ref="noresult" v-else>
        <div class="noresult"><span class="noresult-img"></span></div>
        <p class="noresult-info">暂无搜索结果</p>
        <p class="noresult-info">去发布需求，让邻汇吧帮我找场地</p>
        <div>
          <router-link to="demand" class="demand-btn">发布需求</router-link>
        </div>
    </section>
    <!--:url_str&type_id=:type_id&city_id=:city_id-->

    <app-down v-show="appdownShow" :params="{ url_str : url_str ,city_id : filterData.city_id , type_id : filterData.resource_type }" link="https://aj4j3o.mlinks.cc/Ado8"></app-down>

    <transition name="router-slide" mode="out-in">
      <router-view @toFather="marge"></router-view>
    </transition>

    <v-footer :twoselected="true"></v-footer>
  </div>

</template>

<script>

  import vHead from 'src/components/vHead';
  import AppDown from 'src/components/AppDown.vue';
  import vFieldlist from 'src/components/vFieldlist';
  import vFooter from 'src/components/vFooter';
  import vInfo from 'src/components/vInfo';
  import { Flexbox , FlexboxItem , LoadMore , ViewBox } from 'vux' ;
  import { mapMutations } from 'vuex' ;
  import { getResources , getConfig } from 'src/service/getData';
  import { initDataConfig } from 'src/config/data' ;
  import { getStorage , setStorage , getSession , setSession } from 'src/config/tools';
  import { loadMore } from 'src/components/mixin';
  import { wxshare } from 'src/config/wechatShare';
  import { FLOAT_REG , POSITIVE_INT_REG , INT_Four_REG } from 'src/config/data';
  let childData = null ; // 记录筛选框里筛选条件
export default {
  data(){
    return {
      fields : [], // 场地列表
      fieldSort : [] , // 排序下拉列表
      districts : [],
      showDropdown : false , // 排序的下拉框
      showDstDropdown : false , // 区域下拉框
      showPriceDropdown : false , // 价格下拉框
      pickVal : '默认',
      district : '区域' ,
      tab : 1 , // 区域筛选默认选中行政区
      filterSelect : false , // 筛选
      queryFilterData : null , // 链接参数
      keyword : '请输入小区 / 楼宇关键字',

      showLoading : true,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : true,

      isOneSelect : false , // 标签选择
      isTwoSelect : false , // 标签选择
      isThreeSelect : false , // 标签选择
      isFourSelect : false ,
      filterData : {
        city_id : null,
        resource_type : 1,
        page : 1 ,
        pageSize : 10,
        order : 'desc',
        order_by: 'default_sort',
        district_id : [],
        trading_area_id : [],
        subway_station_id : []
      } , // 筛选条件
      total : 1, // 资源总数
      tipsType : 0 , // 默认为显示 共xx个结果
      tipsShow : false ,
      trading_area : [] , // 商圈

      subwayLineId : null  , // 默认的地铁线
      busArr :   [] , // 地铁数据
      busStation : [] , // 某一条线的站点
      url_str : window.location.href , // 链接参数的字符串

      hasStation : false , // 有站点选中
      hasArea : false , // 有区域选中
      hasTrading : false , // 商圈有选中的
      appdownShow : false ,
      priceSort : [
        {
          txt : '价格从低到高', order : 'asc' , order_by : 'min_price'
        },
        {
          txt : '价格从高到低' , order : 'desc' , order_by : 'min_price'
        }
      ],
      lowPrice : '' ,
      highPrice : '' ,
    }
  },
  components: { Flexbox , FlexboxItem , vFieldlist , LoadMore  , ViewBox , AppDown , vInfo , vFooter },
  mixins : [ loadMore ] ,
  created(){
    this.filterData.city_id =  +this.$route.query.city_id || +this.$store.state.filterData.city_id || +getStorage('cityId')|| +this.$store.state.cityId || 90;
// 处理从搜索页或者app传过来的筛选条件
    this.queryFilterData = this.$route.query ;

    if( JSON.stringify(this.queryFilterData ) == "{}" ){
    }else{
      // 注意  主要处理app传参不能直接解析的问题
      function changeAppData( app ) {
        if(app){
          let arr = app.split(',');
          let newArr = [] ;
          for( let item of arr ){
            item = parseInt( item );
            newArr.push( item );
          }
          return newArr ;
        }
      }
      if(this.$route.query.is_app ){
        delete this.$route.query.is_app ;
        // 对象引用
        let appData = this.$route.query ;

        if( appData.facilities ){
          appData.facilities = appData.facilities + "" ;
          let arr = appData.facilities.split(',');
          appData.facilities = arr ;
          this.filterSelect = true ;
        }
        if( appData.label_id ){
          appData.label_id = changeAppData( appData.label_id + "" );
          this.filterSelect = true ;
        }
        if( appData.trading_area_id ){
          appData.trading_area_id = changeAppData( appData.trading_area_id + "" );
        }
        if( appData.community_type_id ){
          appData.community_type_id = changeAppData( appData.community_type_id + "");
          this.filterSelect = true ;
        }
        if( appData.district_id ){
          appData.district_id = changeAppData( appData.district_id + "");
        }

        if( appData.subway_station_id ){
           appData.subway_station_id = changeAppData( appData.subway_station_id + "");
        }

        if( appData.field_type_id ){
          appData.field_type_id = changeAppData( appData.field_type_id + "");
          this.filterSelect = true ;
        }
        if( appData.indoor ){
          appData.indoor = changeAppData( appData.indoor + "");
          this.filterSelect = true ;
        }

        if(appData.city_id){
          appData.city_id =  appData.city_id*1 ;
          setStorage('cityId' , appData.city_id );
        }

        if(appData.lowPrice){  appData.lowPrice =  appData.lowPrice*1 ; this.filterSelect = true ; }
        if(appData.highPrice){  appData.highPrice =  appData.highPrice*1 ; this.filterSelect = true ;}
        if(appData.minimum_peoples){  appData.minimum_peoples =  appData.minimum_peoples*1 ; this.filterSelect = true ;}
        if(appData.maximum_peoples){  appData.maximum_peoples =  appData.maximum_peoples*1 ; this.filterSelect = true ;}
        if(appData.minimum_build_year){  appData.minimum_build_year =  appData.minimum_build_year*1 ; this.filterSelect = true ;}
        if(appData.minimum_households){  appData.minimum_households =  appData.minimum_households*1 ; this.filterSelect = true ;}
        if(appData.maximum_households){  appData.maximum_households =  appData.maximum_households*1 ; this.filterSelect = true ;}
        if(appData.maximum_build_year){  appData.maximum_build_year =  appData.maximum_build_year*1 ; this.filterSelect = true ;}
        if(appData.minimum_property_costs){  appData.minimum_property_costs =  appData.minimum_property_costs*1 ; this.filterSelect = true ;}
        if(appData.maximum_property_costs){  appData.maximum_property_costs =  appData.maximum_property_costs*1 ; this.filterSelect = true ;}
        if(appData.minimum_house_price){  appData.minimum_house_price =  appData.minimum_house_price*1 ; this.filterSelect = true ;}
        if(appData.maximum_house_price){  appData.maximum_house_price =  appData.maximum_house_price*1 ; this.filterSelect = true ;}
        if(appData.minimum_area){  appData.minimum_area =  appData.minimum_area*1; this.filterSelect = true ; }

        if(appData.hot||appData.hot==0){  appData.hot =  +appData.hot ;  }
        if(appData.subsidy|| appData.subsidy==0){  appData.subsidy =  +appData.subsidy }
        if(appData.page){  appData.page =  appData.page*1 }
        if(appData.latitude){  appData.latitude =  appData.latitude*1 }
        if(appData.longitude){  appData.longitude =  appData.longitude*1 }
        if(appData.latitude_delta){  appData.latitude_delta =  appData.latitude_delta*1 }
        if(appData.longitude_delta){  appData.longitude_delta =  appData.longitude_delta*1 }
        if(appData.nearby){  appData.nearby =  appData.nearby*1 }
        if(appData.page){  appData.page =  appData.page*1 }

        if(appData.pageSize){  appData.pageSize =  appData.pageSize*1 }
        if(appData.self_support||appData.self_support==0){  appData.self_support =  +appData.self_support }

        this.queryFilterData = appData ;
      }

      this.filterData = { ...this.filterData , ...this.queryFilterData } ;

      if( this.queryFilterData.keywords ){
        this.keyword = decodeURIComponent( this.queryFilterData.keywords );
      }else{
        this.keyword = '请输入小区 / 楼宇关键字' ;
      }
      this.RECORD_FILTERDATA( this.filterData ); // 记录链接里的参数，在筛选页展示
    }
  },
  async mounted(){

    if( JSON.stringify( childData ) === "{}"|| JSON.stringify( childData ) === "null" ){
      // 空值，不高亮
      if( this.filterData.facilities
        ||this.filterData.label_id
        ||this.filterData.community_type_id
        ||this.filterData.field_type_id
        ||this.filterData.indoor
        ||this.filterData.minimum_area
        ||this.filterData.lowPrice
        ||this.filterData.highPrice
        ||this.filterData.minimum_peoples
        ||this.filterData.maximum_peoples
        ||this.filterData.minimum_build_year
        ||this.filterData.maximum_build_year
        ||this.filterData.minimum_households
        ||this.filterData.maximum_households
        ||this.filterData.minimum_property_costs
        ||this.filterData.maximum_property_costs
        ||this.filterData.minimum_house_price
        ||this.filterData.maximum_house_price
      ){
        this.filterSelect = true ;
      }else{
        this.filterSelect = false ;
      }
    }else{
      this.fields = [] ;
      this.filterSelect = true ;
      this.filterData = { ...this.filterData , ...childData } ;
    }
    // console.log(this.filterData)
    // 初始化数据
     this.defaultInit();
    // 获得区域数组和排序列表数组
    let config = getSession('config') ;
    if( !config ){
      let configsync = await getConfig(0) ;
      this.fieldSort = configsync.result.resource_sort ;
      for( let item of configsync.result.citylist ){
        if( item.city_id === this.filterData.city_id ){
          this.districts = this.changeSelectData( item.districts ) ;
          this.trading_area = this.changeSelectData( item.trading_areas ) ;
          this.busArr = this.busChangeSelectData( item.subway_stations );
          if( this.busArr.length ){
            this.subwayLineId = this.busArr[0].id ;
          }
        }
      }
      setSession('config', configsync.result);
    }else{
      // 本地有本地拿
      this.fieldSort =  config.resource_sort ;
      for( let item of config.citylist ){
        if( item.city_id === this.filterData.city_id ){
          this.districts = this.changeSelectData( item.districts ) ;
          this.trading_area = this.changeSelectData( item.trading_areas ) ;
          this.busArr = this.busChangeSelectData( item.subway_stations );
          if( this.busArr.length ){
            this.subwayLineId = this.busArr[0].id ;
          }
        }
      }
    }
    // 处理高亮效果
    this.showData();
  },
  methods:{
    ...mapMutations(['RECORD_FILTERDATA']),
    showData(){
      // 渲染综合排序的数据
      if( this.filterData.order_by ){
        let order = this.filterData.order || 'desc';
        let order_by = this.filterData.order_by ;
        for( let item of this.fieldSort ){
          if( item.order_by == order_by && item.order == order ){
            this.pickVal = item.display_short_name ;
          }
        }
      }
      // 渲染区域选择的数据
      this.lowPrice = this.filterData.lowPrice ? this.filterData.lowPrice : '';
      this.highPrice = this.filterData.highPrice ? this.filterData.highPrice : '';
      // this.keyword = this.filterData.keywords ? this.filterData.keywords : '';

      if( this.filterData.district_id&&this.filterData.district_id.length ){
        this.district = '';
        for( let item of this.filterData.district_id ){
          for( let i of this.districts ){
            if( i.district_id == item ){
              i.is_select = true ;
              this.tab = 1 ;
              this.hasArea = true ;
              this.district += (','+i.name) ;
            }
          }
        }
        this.district = this.district.substr(1) ;
      }
      // 商圈
      if( this.filterData.trading_area_id&&this.filterData.trading_area_id.length ){
        this.district = '';
        for( let item of this.filterData.trading_area_id ){
          for( let i of this.trading_area ){
            if( i.id == item ){
              i.is_select = true ;
              this.tab = 3 ;
              this.hasTrading = true ;
              this.district += (','+i.name) ;
            }
          }
        }
        this.district = this.district.substr(1) ;
      }
      // 地铁
//      if( this.filterData.subway_station_id&&this.filterData.subway_station_id.length ){
//        this.district = '';
//        for( let item of this.filterData.subway_station_id ){
//          for( let father of this.busArr ){
//            for( let i of father.stations ){
//              if( item == i.id ){
//                i.is_select = true ;
//                this.district += (','+i.station_name) ;
//                this.tab = 2 ;
//                if( father.id == i.subway_line_id ){
//                  father.is_select = true ;
//                  this.subwayLineId = father.id ;
//                  this.hasStation = true ;
//                }
//              }
//            }
//          }
//        }
//        this.district = this.district.substr(1) ;
//      }

    },
    defaultInit(){
      this.filterData.page = 1 ;
      let params = initDataConfig(this.filterData) ;
      getResources( params ).then( res => {
        // 隐藏小的loading
        this.is_show = false ;
        this.showLoading = false ;
        this.fields = res.result ;
        if( this.filterData.subway_station_id.length ){
          this.tipsType = 1 ;
        }else{
          this.tipsType = 0 ;
        }
        this.total = res.total ;
        this.tipsShow = true ;
        let inter = setTimeout( () => {
          this.tipsShow = false ;
          clearTimeout(inter);
        } , 3000 );
        this.$vux.loading.hide();
        this.appdownShow = true ;
        wxshare({
          title : '我在邻汇吧发现一批不错的地推场地',
          desc : '共找到'+ this.total + '个资源，推荐你也去看看' ,
          imgUrl : 'https://comment.linhuiba.com/FgKZMHwcsI-0sAC0mbk6BgzGNLCy',
          link : window.location.origin + '?from=singlemessage'+ window.location.hash
        });
      }).catch(err => {
        // 隐藏小的loading
        this.is_show = false ;
        this.showLoading = false ;
        this.$vux.toast.text('数据请求错误','middle');
      });
    },
    init(){
      window.scrollTo(0,0);
      this.resetLoadMore();
      this.filterData.page = 1 ;
      let params = initDataConfig(this.filterData) ;
      getResources( params ).then( res => {
        this.fields = res.result ;
        if( this.filterData.subway_station_id.length ){
          this.tipsType = 1 ;
        }else{
          this.tipsType = 0 ;
        }
        this.total = res.total ;
        this.tipsShow = true ;
        let inter = setTimeout( () => {
          this.tipsShow = false ;
          clearTimeout(inter);
        } , 3000 );
        this.appdownShow = true ;
      }).catch(err => {
        this.$vux.toast.text('数据请求错误','middle');
      });
    },
    changeSelectData(obj){
      obj = JSON.parse( JSON.stringify(obj) );
      for (let item of obj) {
        Object.assign(item , { "is_select": false });
      }
      return obj;
    },
    busChangeSelectData(obj){
      obj = JSON.parse( JSON.stringify(obj) );
      for (let item of obj) {
        Object.assign(item , { "is_select": false });
        for(let k of item.stations){
          Object.assign(k , { "is_select": false });
        }
      }
      return obj;
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
      this.filterData.page ++ ;
      let params = initDataConfig(this.filterData);
      getResources( params ).then( res => {
        this.fields = [ ...this.fields , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.filterData.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
    labelSelected(m){
      if( m == 1 ){
        // 主题场地
        this.isTwoSelect = this.isThreeSelect = this.isFourSelect = false; // 排他
        this.isOneSelect = !this.isOneSelect ;
        this.filterData.resource_type = 3 ;

      }else if( m == 2 ){
        // 热门
        this.isOneSelect = this.isThreeSelect = this.isFourSelect = false;
        this.isTwoSelect = !this.isTwoSelect ;
        Object.assign( this.filterData , { hot : 1 } );

      }else if( m == 3 ){
        // 上新
        this.isOneSelect = this.isTwoSelect = this.isFourSelect = false ;
        this.isThreeSelect = !this.isThreeSelect ;
        this.filterData.order = 'desc' ;
        this.filterData.order_by = 'created_at' ;
        this.pickVal = '最新' ;
      }else{
        // 倒贴
        this.isOneSelect = this.isTwoSelect = this.isThreeSelect =  false;
        this.isFourSelect = !this.isFourSelect ;

        Object.assign( this.filterData , { subsidy : 1 } );
      }
      if( !this.isOneSelect ){
        this.filterData.resource_type = 1;
      }
      if( !this.isTwoSelect ){
        delete this.filterData.hot;
      }
      if( !this.isThreeSelect ){
        this.filterData.order = 'desc' ;
        this.filterData.order_by = 'default_sort' ;
        this.pickVal = '默认' ;
      }
      if( !this.isFourSelect ){
        delete this.filterData.subsidy;
      }
      this.init();
    },
    dstListSelected(){
      this.showDstDropdown = !this.showDstDropdown ;
      this.showDropdown = false ;
      this.showPriceDropdown = false ;
    },
    listSelected(){
      this.showDropdown = !this.showDropdown ;
      this.showDstDropdown = false ;
      this.showPriceDropdown = false ;
    },
    priceClick(){
      this.showPriceDropdown = !this.showPriceDropdown ;
      this.showDropdown = false ;
      this.showDstDropdown = false ;
    },
    pickPx( item ){
      this.pickVal = item.display_short_name ;
      this.filterData.order = item.order ;
      this.filterData.order_by = item.order_by ;
      this.showDropdown = false ;
      this.init();
    },
    orderSelected(){
      this.showDropdown = false ;
      this.filterData.order = 'desc' ;
      this.filterData.order_by = 'number_of_order' ;
      this.init();
    },
    pricePx( item ){
      this.filterData.order = item.order ;
      this.filterData.order_by = item.order_by ;
      this.showPriceDropdown = false ;
      this.init();
    },
    //  最小价和最大价的处理
    priceDistanceReset(){
      // 清空价格数字
      this.lowPrice = this.highPrice =  '' ;
      delete this.filterData.lowPrice;
      delete this.filterData.highPrice;
      this.init();
    },
    priceDistanceConfirm(){
      // 最大价 不能小于 最小价
      if( this.lowPrice && this.highPrice && this.highPrice < this.lowPrice ){
        this.highPrice = '';
        this.$vux.toast.text( '你输入的最高价不能低于最低价' ); return ;
      }
      if( this.lowPrice ){
        if( !FLOAT_REG.test( this.lowPrice ) ){
          this.lowPrice = '';
          this.$vux.toast.text( '你输入的最低价只能为数字或者两位小数' ); return ;
        }else{
          this.filterData.lowPrice = +this.lowPrice;
        }
      }
      if( this.highPrice ){
        if( !FLOAT_REG.test( this.highPrice ) ){
          this.highPrice = '';
          this.$vux.toast.text( '你输入的最高价只能为数字或者两位小数' ); return ;
        }else{
          this.filterData.highPrice = +this.highPrice;
        }
      }
      this.init();
      this.showPriceDropdown = false ;
    },
//  价格筛选
//    priceSelected(){
//      this.showDropdown = false ;
//      this.time ++ ;
//      if( this.time % 2 == 0 ){
//        this.filterData.order = 'asc';
//      }else{
//        this.filterData.order = 'desc';
//      }
//      this.filterData.order_by = 'min_price';
//      this.init();
//    },
    filterSelected(){
      this.showDropdown = false ;
      this.RECORD_FILTERDATA( this.filterData );
      if( this.keyword != '请输入小区 / 楼宇关键字' ){
        this.$router.push( `/fields/filter?keywords=${ this.keyword }` );
      }else{
        this.$router.push( '/fields/filter' );
      }
    },
    marge( data ){
      // 处理从筛选子页面传递的筛选条件
      this.filterSelect = true ; // 筛选高亮
      if( childData ){
        // 有值 删除上一次的筛选条件
        for(let item in childData ){
          delete this.filterData[item] ;
        }
      }
      childData = Object.assign( {} , data ) ;
    },
    resetLoadMore(){
      this.showLoading = false ;
      this.loadingTip = '正在加载...';
      this.end = false ; // 到底了
      this.preventRepeatReuqest = false ; // 阻止重复请求
      this.is_show = false ;
    },
    prevent(e){
      e.preventDefault() ;
    },
    touchmove(){
      document.body.className = 'noscroll';
    },
    touchend(){
      document.body.className = '';
    },


    areaClick(item){
      item.is_select = !item.is_select;
      // 地铁站的数据清零
      // this.clearBus();
      // 商圈的数据清零
      this.clearTrading();
      for(let item of this.districts){
         if(item.is_select){
           this.hasArea = true ;
           break ;
         }else{
           this.hasArea = false ;
         }
      }
    },
    tradingClick(item){
      item.is_select = !item.is_select;
      this.clearArea();
      // this.clearBus();
      for(let item of this.trading_area){
        if(item.is_select){
          this.hasTrading = true ;
          break ;
        }else{
          this.hasTrading = false ;
        }
      }
    },
//    busLineClick(item){
//      // 点击了地铁线
//      for(let it of this.busArr){
//        it.is_select = false ;
//      }
//      item.is_select = !item.is_select;
//      this.subwayLineId = item.id ;
//      this.busStation =  item.stations ;
//    },
//    busStationClick(item){
//
//      this.clearArea();
//      this.clearTrading();
//      // 重置站点数据
//      for(let p of this.busArr){
//        if( p.id != item.subway_line_id ){
//          for(let c of p.stations){
//            c.is_select = false ;
//          }
//        }
//      }
//      // 渲染当前数据
//      item.is_select = !item.is_select;
//      // 渲染tab导航栏的高亮
//      for(let item of this.busArr){
//        if( item.id ==  this.subwayLineId ){
//          for( let a of item.stations){
//            if(a.is_select){
//              this.hasStation = true ;
//              break ;
//            }else{
//              this.hasStation = false ;
//            }
//          }
//        }
//      }
//    },
    clearArea(){
      for(let item of this.districts){
        item.is_select = false ;
      }
      this.hasArea = false ;
    },
//    clearBus(){
//      for(let line of this.busArr){
//        line.is_select = false ;
//        for(let sta of line.stations){
//          sta.is_select = false ;
//        }
//      }
//      this.hasStation = false ;
//    },
    clearTrading(){
      for(let item of this.trading_area){
        item.is_select = false ;
      }
      this.hasTrading = false ;
    },
    TabareaClick(n){
      this.tab = n ;

    },
    resetCondition(){
      this.clearTrading();
      // this.clearBus();
      this.clearArea();
      this.district = '区域';
      this.subwayLineId = this.busArr[0].id ;
      this.filterData.district_id = [] ;
      this.filterData.subway_station_id = [] ;
      this.filterData.trading_area_id = [] ;
      this.init();
    },
    confrimCondition(){
      this.showDstDropdown = false ;
      this.district = '' ;
      this.filterData.district_id = [] ;
      this.filterData.subway_station_id = [] ;
      this.filterData.trading_area_id = [] ;
      if(this.tab == 1){
        this.hasStation = false ;
        this.hasTrading = false ;
        for(let item of this.districts){
          if( item.is_select ){
            this.filterData.district_id.push( item.district_id );
            this.district += (','+ item.name)
          }
        }
        this.district = this.district.substr(1) ;
        this.filterData.subway_station_id = [] ;
        this.filterData.trading_area_id = [] ;
      }else if (this.tab == 2){
        this.hasTrading = false ;
        this.hasArea = false ;
        for(let item of this.busArr){
          for(let a of item.stations){
            if( a.is_select ){
              this.filterData.subway_station_id.push( a.id );
              this.district += (','+a.station_name)
            }
          }
        }
        this.district = this.district.substr(1) ;
        this.filterData.district_id = [] ;
        this.filterData.trading_area_id = [] ;
      }else if ( this.tab == 3 ){
        this.hasStation = false ;
        this.hasArea = false ;
        for(let item of this.trading_area){
          if( item.is_select ){
            this.filterData.trading_area_id.push( item.id );
            this.district += (','+ item.name)
          }
        }
        this.district = this.district.substr(1) ;
        this.filterData.subway_station_id = [] ;
        this.filterData.district_id = [] ;
      }

      if( this.filterData.district_id.length ){
        // 数组去重
        this.filterData.district_id     = [...new Set( this.filterData.district_id )] ;
      }
      if( this.filterData.trading_area_id.length ){
        this.filterData.trading_area_id = [...new Set( this.filterData.trading_area_id )] ;
      }
      if( this.filterData.subway_station_id.length ){
        this.filterData.subway_station_id = [...new Set( this.filterData.subway_station_id )] ;
      }
      if( !this.filterData.subway_station_id.length&& !this.filterData.trading_area_id.length && !this.filterData.district_id.length ){
        this.district = '区域';
      }
      this.init();
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all 0.4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }
  /*-------------------*/

  .com-font{
    line-height: 0.88rem;
    @include sc( 0.3rem,#666 );
    border-bottom: 1px solid #eee;
    &.active{
      color: $mainColor;
    }
  }
  .field-wraper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-wraper{
      position: fixed;
      top: 0;
      left:0;
      width: 100%;
      z-index: 1;
      header{
        display: flex;
        padding: 0.12rem 0.24rem;
        background-color: #fff;
        .back{
          flex : 0 0 0.7rem;
          height: 0.64rem;
          .back-link{
            display: block;
            .back-icon{
              display: inline-block;
              vertical-align: top;
              @include wh( 0.2rem ,0.36rem );
              margin: 0.14rem 0.5rem 0 0;
              @include bg-image('../../images/ic_returnbutton_normal_three');
            }
          }
        }
        .search {
          flex: 0 0 5.6rem;
          position: relative;
          height: 0.64rem;
          .searchIcon {
            position: absolute;
            left: 0.2rem;
            top: 0.14rem;
            @include wh( 0.36rem , 0.34rem );
            @include bg-image( "../../images/ic_search_gray_normal_three" );
          }
          .link-search {
            background-color: rgba( 255,255,255,1 );
            @include wh( 100% , 100% );
            line-height: 0.64rem;
            padding-left: 0.71rem;
            border-radius: 0.32rem;
            font-size: 0.28rem;
            color: #b4b4b4;
            background-color: #f0f0f0;
          }
        }
        /*.map{
          flex: 0 0 0.7rem;
          text-align: right;
          .map-icon{
            display: inline-block;
            @include wh( 0.4rem , 0.4rem );
            margin-top: 0.1rem;
            @include bg-image('../../images/ic_map_black_default_three');
          }
        }*/
      }
      .filter{
        line-height: 0.68rem;
        font-size: 0.26rem;
        color: #282a2a;
        background-color: #fff;
        position: relative;
        .dropdown{
          position: fixed;
          top: 1.58rem;
          left:0;
          bottom: 0;
          right: 0;
          z-index: 2;
          overflow-y: hidden;
          background-color: rgba( 0, 0, 0 ,0.6 );
          font-size: 0.3rem;
          color:#666;
          &:before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            @include wh(100%,0.16rem);
            opacity: 0.4;
            background-image: linear-gradient(-180deg, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.00) 100%);
          }
          .down-ul{
            /*height: 6.28rem;*/
            padding: 0.2rem 0.24rem;
            overflow-y: scroll;
            background-color: #fff;
            &.price{
              height: 3.7rem;
              overflow: hidden;
            }
            .down-ul-item{
              display: flex;
              justify-content: space-between;
              line-height: 0.9rem;
              font-size: 0.3rem;
              color: #666;
              border-bottom:1px solid #eee;
              &:last-child{
                border:0 none;
              }
              &.active{
                color: $mainColor;
              }
            }
            .price-distance{
              .txt-info{
                line-height: 0.7rem;
                @include sc(0.24rem,#666);
              }
              .box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .ipt{
                  .line{
                    width: 0.2rem;
                    margin: 0 0.2rem;
                    color: #D2D2D2;
                  }
                  >input{
                    @include wh(1.6rem,0.66rem);
                    font-size: 0.22rem;
                    text-align: center;
                    background-color: #F1F2F6;
                    border-radius: 0.08rem;
                  }

                }
                .btns{
                  width: 2.6rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  .reset-btn{
                    @include wh(1.2rem,0.66rem);
                    text-align: center;
                    @include sc(0.26rem,$mainColor);
                    border-radius: 0.08rem;
                    background-color: rgba(0,119,255,0.1);
                  }
                  .confirm-btn{
                    @include wh(1.2rem,0.66rem);
                    text-align: center;
                    @include sc(0.26rem,#fff);
                    border-radius: 0.08rem;
                    background-color: rgb(0,119,255);
                  }
                }
              }
            }
          }
        }
        .filter-rule{
          .txt{
            display: inline-block;
            vertical-align: middle;
            max-width: 1.55rem;
            padding-left: 0.15rem;
            height: 0.68rem;
          }
          .cert{
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.08rem;
            @include wh( 0.22rem , 0.22rem );
            transition: all 0.3s;
            @include bg-image('../../images/icon_open_gray_nor_three_one');
          }
          &.on{
            .cert{
              transform: rotate(180deg);
            }
          }
          &.active{
            color: $mainColor;
            .cert{
              @include bg-image('../../images/icon_open_blue_selected_three_one');
            }
            &.on{
              .cert{
                transform: rotate(180deg);
              }
            }
          }
        }
        .order{
          &.active{
            color: $mainColor;
          }
        }
        .order-price{
          .arrow{
            display: inline-block;
            vertical-align: middle;
            margin-left:0.08rem;
            @include wh( 0.22rem , 0.22rem );
            @include bg-image('../../images/icon_sort_gray_nor_three_one');
          }
          &.active {
            color: $mainColor;
          }
          &.asc{
            .arrow {
              @include bg-image('../../images/icon_sort_upblue_selected_three_one');
            }
          }
          &.desc{
            .arrow{
              @include bg-image('../../images/icon_sort_downblue_selected_three_one');
            }
          }
        }
        .filter-btn{

          .btn{
            display: block;
            .select-icon{
              display: inline-block;
              vertical-align: middle;
              @include wh( 0.22rem , 0.22rem );
              margin-left:0.08rem;
              @include bg-image('../../images/ic_screen_gary_nor_three_one');
            }
          }
          &.active{
            .btn{
              color: $mainColor;
              .select-icon{
                @include bg-image('../../images/ic_screen_blue_selected_three_one');
              }
            }
          }
        }

      }
      .filter-label{
        line-height: 0.64rem;
        background-color: #fff;
        font-size: 0.24rem;
        color: $fontColor;
        position: relative;
        .label-item{
          display: inline-block;
          height: 0.4rem;
          padding: 0 0.2rem;
          line-height: 0.4rem;
          text-align: center;
          border-radius: 0.2rem;
          background-color:  #F1F2F6;
          &.active{
            color: $mainColor;
            background: #E4F0FE;
          }
        }
        &:before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          @include wh(100%,0.16rem);
          opacity: 0.4;
          background-image: linear-gradient(-180deg, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.00) 100%);
        }
      }
    }
    .list{
      position: relative;
      padding-top:2.2rem;
      &.mb{
        padding-bottom:1rem;
      }
    }
    .noresult-box{
      margin-top: 2rem;
      background-color: #f0f0f0;
      .noresult{
        text-align: center;
        .noresult-img{
          display: inline-block;
          margin-top: 1.5rem;
          @include wh( 1.78rem , 2.64rem );
          @include bg-image('../../images/ic_search_two_six');
        }
      }
      .noresult-info{
        text-align: center;
        font-size: 0.28rem;
        color: #999;
        &:nth-of-type(1){
          margin-top: 0.8rem;
        }
        &:nth-of-type(2){
          margin-top: 0.19rem;
        }
      }
      .demand-btn{
        display: block;
        @include wh( 2.4rem , 0.9rem );
        margin: 0.4rem auto 0;
        line-height: 0.9rem;
        text-align: center;
        border: 1px solid #e8e8e8;
        font-size: 0.32rem;
      }
    }
    .sx-wraper{
      height: 6.84rem;
      overflow: hidden;
      background-color: #fff;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%,0.16rem);
        opacity: 0.4;
        background-image: linear-gradient(-180deg, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.00) 100%);
      }
      .sx{
        display: flex;
        height: 5.86rem;
        overflow: hidden;
        .area-left{
          width: 2.5rem;
          background-color: #fafafa;
          .left-ul{
            padding-left: 0.24rem;
            .left-item{
              @extend .com-font ;
              &.active{
                .red-icon{
                  display: inline-block;
                  vertical-align: middle;
                  @include wh(0.12rem,0.12rem);
                  margin-left: 0.16rem;
                  transform: translateY(-0.03rem);
                  background-color: $orange;
                  border-radius: 50%;
                }
              }
              &.on{
                color: $mainColor;
              }
            }
          }
        }
        .area-right{
          flex: 1;
          background-color: #fff;
          .right-dis{
            padding-left: 0.24rem ;
            height: 100%;
            .dis{
              height: 100%;
              overflow-y: scroll;
              .down-ul-item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                @extend .com-font ;
                .icon{
                    @include wh( 0.44rem , 0.44rem );
                    margin-right: 0.25rem;
                    @include bg-image('../../images/ic_chose_gary_nor_three_one');
                  }
                &.active{
                  color: $mainColor;
                  .icon{
                    @include bg-image('../../images/ic_chose_blue_selected_three_one');
                  }
                }
              }
            }
          }
          .right-bus{
            position: relative;
            height: 100%;
            .bus-line{
              width: 50%;
              height: 100%;
              padding-left: 0.24rem;
              .line-ul{
                max-height: 100%;
                overflow-y: scroll;
                border-right:1px solid #eee;
                .subline-name{
                  display: block;
                }
              }
            }
            .bus-station {
              position: absolute;
              top: 0;
              right: 0;
              width: 50%;
              height: 5.86rem;
              padding-left: 0.24rem;
              overflow-y: scroll;

              .com-font {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .station-name{
                  display: inline-block;
                  max-width: 1.5rem;
                }
                .icon{
                    @include wh( 0.44rem , 0.44rem );
                    margin-right: 0.25rem;
                    @include bg-image('../../images/ic_chose_gary_nor_three_one');
                  }
                &.active{
                  color: $mainColor;
                  .icon{
                    @include bg-image('../../images/ic_chose_blue_selected_three_one');
                  }
                }
              }

            }
          }
          .right-buy{
            padding-left: 0.24rem ;
            height: 100%;
            overflow-y: scroll;
            .down-ul-item{
              display: flex;
              justify-content: space-between;
              align-items: center;
              @extend .com-font ;
              .icon{
                    @include wh( 0.44rem , 0.44rem );
                    margin-right: 0.25rem;
                    @include bg-image('../../images/ic_chose_gary_nor_three_one');
                  }
              &.active{
                color: $mainColor;
                .icon{
                  @include bg-image('../../images/ic_chose_blue_selected_three_one');
                }
              }
            }
          }
        }
      }
      .area-btns{
        display: flex;
        justify-content: space-between;
        height: 0.98rem;
        line-height: 0.98rem;
        .clear{
          flex: 1;
          border-top: 1px solid #eee;
          text-align: center;
          @include sc(0.34rem,$mainColor);
          background-color: #fff;
        }
        .confirm{
          flex: 1;
          text-align: center;
          @include sc(0.34rem,#fff);
          background-color: $mainColor;
        }
      }
    }
  }
</style>
