<template>
  <div>
    <div class="second-nav" v-show="secondNav" ref="snav">
      <tab :line-width=0 active-color='#0077FF' v-model="secondIndex">
        <tab-item @on-item-click="secondNavClick(1)">
          <span class="position-icon"></span>详情
        </tab-item>
        <tab-item @on-item-click="secondNavClick(2)"><span class="position-icon"></span>规格</tab-item>
        <tab-item @on-item-click="secondNavClick(3)"><span class="position-icon"></span>信息</tab-item>
        <tab-item @on-item-click="secondNavClick(4)"><span class="position-icon"></span>评价</tab-item>
      </tab>
    </div>
    <header class="transparent-header" ref="nav" id="head">
      <flexbox :gutter="0">
        <flexbox-item :span="1/3" class="transparent-left">
          <i class="back-icon" @click="$router.go(-1)" v-if="!$route.query.BackKey"></i>
        </flexbox-item>
        <flexbox-item :span="1/3" class="ct">
          活动详情
        </flexbox-item>
        <flexbox-item :span="1/3">
          <div class="transparent-right right">
            <router-link to="/cart" class="car-icon">
              <span class="cart-sum">{{ cartNumber | hundred }}</span>
            </router-link>
            <span class="sys-icon" @click.stop="showDrophandler"></span>
            <div class="dropdown" v-show="showDrop">
              <ul>
                <li class="drop-item" @click.stop="collect()"><i class="heart-icon border-1px" :class="{ 'on' : collected }"></i><span class="collect">收藏</span></li>
                <li class="drop-item" @click.stop="showServer"><i class="server-icon"></i><span>客服</span></li>
              </ul>
            </div>
          </div>
        </flexbox-item>
      </flexbox>
    </header>

    <div class="wrapBox" ref="swiper">
      <swiper loop dots-position="center" dots-class="custom-bottom" :aspect-ratio="560/750">
        <swiper-item v-for="( item , index ) in fieldImgs" :key="index">
          <div class="imgbox">
            <img v-lazy="item.pic_url" :data-srcset=" item.pic_url | large" alt=" " @click.stop="show(index)" class="previewer-demo-img">
          </div>
        </swiper-item>
      </swiper>
      <div class="typeposition" v-if="fieldsdetails&&fieldsdetails.current_resource.activity_type">{{ fieldsdetails.current_resource.activity_type ? fieldsdetails.current_resource.activity_type.display_name : '' }}</div>
    </div>
    <div class="act-time" v-if="fieldsdetails">
      <span class="act-icon"></span><span>活动时间：</span><span>{{ fieldsdetails.current_resource.activity_start_date | timeFormat }}-{{ fieldsdetails.current_resource.deadline | timeFormat }}</span>
    </div>
    <section class="resource" v-if="fieldsdetails">
      <h3 class="resource-name ellipsis">{{ fieldsdetails.name }}</h3>
      <p class="resource-people">
        <span>人流量：</span><span class="mg">{{ fieldsdetails.number_of_people }}</span><span>历史单量：</span><span>{{ fieldsdetails.number_of_order }}</span>
      </p>
      <div class="tag-box">
        <span class="tag-item" v-if="fieldsdetails.age_level&&fieldsdetails.age_level.display_name!='未填写'">{{ fieldsdetails.age_level.display_name }}</span>
        <span class="tag-item" v-if="fieldsdetails.consumption_level&&fieldsdetails.consumption_level.display_name!='未填写'">消费能力{{ fieldsdetails.consumption_level.display_name }}</span>

      </div>
      <div class="address">
        <div class="address-text">
          <p class="ellipsis name">{{ fieldsdetails.community.district.name }}{{ fieldsdetails.community.detailed_address }}</p>
          <p class="ellipsis jt-address">
            <span class="indoor" v-if="fieldsdetails.indoor==1">室内</span>
            <span class="indoor" v-else-if="fieldsdetails.indoor==0">室外</span>
            <span class="detail-addr"><span>具体位置：</span><span>{{ fieldsdetails.doLocation }}</span></span>
          </p>
        </div>
        <div class="adress-icon">
          <span @click.stop="goMap(fieldsdetails.community.lng ,fieldsdetails.community.lat , fieldsdetails.name)" class="icon"></span>
        </div>
      </div>
      <div class="gutter">
        <div class="btn-box">
          <flexbox :gutter="0">
            <flexbox-item :span="1/2" class="ct">
              <div class="jifen" @click="showJifen=true"><i class="btn-icon integral"></i><span>积分奖励</span></div>

            </flexbox-item>
            <!--<flexbox-item :span="1/3" class="ct promise-item">-->
            <!--<i class="btn-icon promise"></i><span>承诺退差价</span>-->
            <!--</flexbox-item>-->
            <flexbox-item :span="1/2" class="ct">
              <div @click="showErrorModel"><i class="btn-icon error"></i><span>纠错奖励</span></div>

            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </section>

    <section class="norms" ref="norm">
      <div class="title gutter">
        <span class="norms-icon"></span><span>选择场地规格</span>
      </div>
      <div class="norm-drop-content" v-if="defaultConditions&&norms.length">
        <div class="norm-lables">
          <div class="lable-item" @click.stop="btnItemClick( defaultDeposits[0] )" :class="{ active: defaultDeposits[0].is_select }">{{ defaultDeposits[0].text }}</div>
          <div class="lable-item" @click.stop="btnItemClick( defaultConditions.lease_term_type_names[0] )" v-if="defaultConditions.lease_term_type_names[0]"  :class="{ active: defaultConditions.lease_term_type_names[0].is_select }">按“{{ defaultConditions.lease_term_type_names[0].text }}”计价</div>
          <div class="lable-item" @click.stop="btnItemClick( defaultConditions.sizes[0] )" v-if="defaultConditions.sizes[0]" :class="{ active: defaultConditions.sizes[0].is_select }">{{ defaultConditions.sizes[0].text }}</div>
          <div class="lable-item lable-search" :class="{ active : filterBtnLight }" @click.stop="filterClick">
            <span>筛选</span>
            <span class="cert-icon"></span>
          </div>
        </div>
      </div>
      <div class="norm-list">

        <div v-if="norms.length">
          <div class="parent-item" v-for="(item , index) in norms" :key="index">
            <!-- 单个经营 -->
            <div class="norm-item" v-if="item.resource.length == 1">
              <div class="box">
                <div class="top">
                  <div class="norm-detail">
                    <p class="norm-size">
                      <span>规格：</span><span>{{ item.dimension.size }}</span>
                      <span v-if="item.resource[0].cooperation_type_id==12">（自营）</span>
                      <span v-else-if="item.resource[0].cooperation_type_id==13">（代理）</span>
                      <span v-else-if="item.resource[0].cooperation_type_id==14">（物业）</span>
                    </p>
                    <p class="norm-cus">
                      <span class="sliver-text">计价单位：</span><span class="sliver-text">{{  item.dimension.lease_term_type }}</span>
                    </p>
                    <p class="norm-tag" v-if="item.dimension.custom_dimension">
                      <span class="sliver-text">仅限：</span><span class="tag">{{ item.dimension.custom_dimension }}</span>
                    </p>
                  </div>
                  <div class="place-order">
                    <div class="price-box">
                      <span class="price-label" v-if="item.resource[0].subsidy_rate>0"></span><span class="price-pre">¥</span><span class="price">
                    {{ item.resource[0].min_after_subsidy/100 | twoPointPre }}.</span><span class="price-next">
                    {{ item.resource[0].min_after_subsidy/100 | twoPointNext }}
                    </span><span v-if="item.dimension.lease_term_type=='天'">起</span>
                      <p class="rt com-font" v-if="item.resource[0].subsidy_rate>0">
                        <span>原价：</span><del class="oringe-price">¥{{ item.resource[0].price/100 }}</del><span v-if="item.dimension.lease_term_type=='天'">起</span>
                      </p>
                    </div>

                    <div v-if="item.resource[0].identification" class="order-btn2" :class="{ disabled : item.resource[0].expired }" @click.stop="order(item.dimension ,item.resource[0])"></div>
                    <div v-else class="order-btn" :class="{ disabled : item.resource[0].expired }" @click.stop="order(item.dimension ,item.resource[0])">预订</div>

                  </div>
                </div>
              </div>
              <div class="btm">
                <div class="has-server"
                     v-if="item.resource[0].has_power||
                         item.resource[0].has_chair||
                         item.resource[0].has_tent ||
                         item.resource[0].leaflet  ||
                         item.resource[0].overnight_material">
                  <flexbox :gutter="0">
                    <flexbox-item :span="1/6" class="item" v-if="item.resource[0].has_power">
                      <span class="server-tag tag_1"></span>
                    </flexbox-item>
                    <flexbox-item :span="1/6" class="item" v-if="item.resource[0].has_chair">
                      <span class="server-tag tag_2"></span>
                    </flexbox-item>
                    <flexbox-item :span="1/6" class="item" v-if="item.resource[0].has_tent">
                      <span class="server-tag tag_3"></span>
                    </flexbox-item>
                    <flexbox-item :span="1/6" class="item" v-if="item.resource[0].leaflet">
                      <span class="server-tag tag_4"></span>
                    </flexbox-item>
                    <flexbox-item :span="1/6" class="item" v-if="item.resource[0].overnight_material">
                      <span class="server-tag tag_6"></span>
                    </flexbox-item>
                  </flexbox>
                </div>
                <div class="no-server" v-else>该物业暂不提供任何服务！</div>
              </div>
            </div>
            <!-- 多个物业的情况 -->
            <div class="double-norm-item" v-else>
              <div class="parent" :class="{ translate : item.dimension.childShow }" @click.stop="drop(item.dimension)">
                <div class="norm-detail">
                  <p class="norm-size">
                    <span>规格：</span><span>{{item.dimension.size}}</span>
                  </p>
                  <p class="norm-cus">
                    <span class="sliver-text">计价单位：</span><span class="sliver-text">{{  item.dimension.lease_term_type }}</span>
                  </p>
                  <p class="norm-tag" v-if="item.dimension.custom_dimension">
                    <span class="sliver-text">仅限：</span><span class="tag">{{ item.dimension.custom_dimension }}</span>
                  </p>
                </div>
                <div class="price">
                  <span class="price-pre">¥</span><span class="price-num">{{ item.dimension.min_price/100 }}</span><span>起</span><span class="cert-icon"></span>
                </div>
              </div>
              <div class="child-box" :class="{ translate : !item.dimension.childShow }">
                <div class="child" v-for="( child , index ) in item.resource" :key="index">
                  <div class="top">
                    <div>
                      <div class="self" v-if="child.cooperation_type_id==12"></div>
                      <div class="agent" v-else-if="child.cooperation_type_id==13"></div>
                      <div class="property" v-else-if="child.cooperation_type_id==14"></div>
                    </div>
                    <div class="place-order">
                      <div class="price-box">
                        <span class="price-label" v-if="child.subsidy_rate>0"></span><span class="price-pre">¥</span><span class="price">
                    {{ child.min_after_subsidy/100 | twoPointPre }}.</span><span class="price-next">
                    {{ child.min_after_subsidy/100 | twoPointNext }}
                    </span><span v-if="item.dimension.lease_term_type=='天'">起</span>
                        <p class="rt com-font" v-if="child.subsidy_rate>0">
                          <span>原价：</span><del class="oringe-price">¥{{ child.price/100 }}</del><span v-if="item.dimension.lease_term_type=='天'">起</span>
                        </p>
                      </div>
                      <div v-if="child.identification" class="order-btn2"  :class="{ disabled : child.expired  }" @click.stop="order(item.dimension , child)"></div>
                      <div v-else class="order-btn" :class="{ disabled : child.expired  }" @click.stop="order(item.dimension , child)">预订</div>

                    </div>
                  </div>
                  <div class="btm">
                    <div class="has-server"
                         v-if="child.has_power||
                             child.has_chair||
                             child.has_tent ||
                             child.leaflet  ||
                             child.overnight_material">
                      <flexbox :gutter="0">
                        <flexbox-item :span="1/6" class="item" v-if="child.has_power">
                          <span class="server-tag tag_1"></span>
                        </flexbox-item>
                        <flexbox-item :span="1/6" class="item" v-if="child.has_chair">
                          <span class="server-tag tag_2"></span>
                        </flexbox-item>
                        <flexbox-item :span="1/6" class="item" v-if="child.has_tent">
                          <span class="server-tag tag_3"></span>
                        </flexbox-item>
                        <flexbox-item :span="1/6" class="item" v-if="child.leaflet">
                          <span class="server-tag tag_4"></span>
                        </flexbox-item>
                        <!--<flexbox-item :span="1/6" class="item" v-if="child.invoice">-->
                        <!--<span class="server-tag tag_5"></span>-->
                        <!--</flexbox-item>-->
                        <flexbox-item :span="1/6" class="item" v-if="child.overnight_material">
                          <span class="server-tag tag_6"></span>
                        </flexbox-item>
                      </flexbox>
                    </div>
                    <div class="no-server" v-else>该物业暂不提供任何服务！</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="no-filter" v-else>
          <div class="tit" v-if="filterBtnLight">没有找到符合条件的场地，请修改筛选条件试试吧！</div>
          <div class="cont" v-if="defaultConditions&&filterBtnLight">
            <div class="item"
                 v-for="(item, index) in defaultDeposits"
                 :key="index"
                 :class="{ active : item.is_select }"
                 @click.stop="btnItemClick(item)"
                 v-if="item.is_select"
            >{{ item.text }} <span class="icon"></span> </div>
            <div class="item"
                 v-for="( item , index ) in defaultConditions.lease_term_type_names"
                 :key="index"
                 v-if="item.is_select"
                 :class="{ active : item.is_select }"
                 @click.stop="btnItemClick(item)"
            >按“{{ item.text }}”计价 <span class="icon"></span></div>
            <div class="item"
                 v-for="( item , index ) in defaultConditions.sizes"
                 :key="index"
                 v-if="item.is_select"
                 :class="{ active : item.is_select }"
                 @click.stop="btnItemClick(item)" >{{ item.text }} <span class="icon"></span> </div>
            <div class="item"
                 v-for="( item , index ) in defaultConditions.custom_dimensions"
                 :key="index"
                 v-if="item.is_select"
                 :class="{ active : item.is_select }"
                 @click.stop="btnItemClick(item)"
            >{{ item.text }} <span class="icon"></span> </div>
          </div>
        </div>
      </div>
    </section >

    <section class="res-detail" ref="resDetail">
      <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem' v-model="index">
        <tab-item>场地信息</tab-item>
        <tab-item>社区信息</tab-item>
      </tab>
      <swiper v-model="index" :aspect-ratio="39/75" :show-dots="false" v-if="fieldsdetails">
        <swiper-item>
          <div class="com-info">
            <div class="com-info-item">
              <span class="com-info-tit">摆摊时间：</span><span class="com-info-cnt">{{ fieldsdetails.do_begin }}-{{fieldsdetails.do_finish }}</span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">场地面积：</span><span class="com-info-cnt">{{ fieldsdetails.total_area }}m<sup>2</sup></span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">物业要求：</span>
              <span class="com-info-cnt">
                <span v-if="fieldsdetails.requirements.length" v-for="(requirement , index) in fieldsdetails.requirements" :key="index">{{ requirement ? requirement.display_name : '' }}</span>
                <span>{{ fieldsdetails.property_requirement }}</span>
              </span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">禁摆品类：</span>
              <span class="com-info-cnt">
                <span v-if="fieldsdetails.contraband.length" v-for="(band , index) in fieldsdetails.contraband" :key="index">{{ band ? band.display_name : ''}}</span>
                <span>{{ fieldsdetails.other_contraband }}</span>
              </span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">流量高峰：</span><span class="com-info-cnt">{{ fieldsdetails.peak_time ? fieldsdetails.peak_time.display_name : '' }}</span>
            </div>
            <div class="com-info-item" >
              <span class="com-info-tit">男女比例：</span><span class="com-info-cnt">男性{{ fieldsdetails.male_proportion ? fieldsdetails.male_proportion : '' }}%/女性{{ fieldsdetails.male_proportion ? 100-fieldsdetails.male_proportion : '' }}%</span>
            </div>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="com-info">
            <div class="com-info-item">
              <span class="com-info-tit">社区名称：</span><span class="com-info-cnt">{{ fieldsdetails.community.name }}</span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">社区类型：</span><span class="com-info-cnt">{{ fieldsdetails.community.community_type.display_name ? fieldsdetails.community.community_type.display_name : '' }}</span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">建成年份：</span><span class="com-info-cnt">{{ fieldsdetails.community.build_year ? fieldsdetails.community.build_year : '' }}年</span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">户　　数：</span><span class="com-info-cnt">{{  fieldsdetails.community.number_of_households }}</span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">房　　价：</span><span class="com-info-cnt">{{ fieldsdetails.community.house_price ? fieldsdetails.community.house_price/100 : '' }}元/m<sup>2</sup></span>
            </div>
            <div class="com-info-item">
              <span class="com-info-tit">物业　费：</span><span class="com-info-cnt">{{ fieldsdetails.community.property_costs ? fieldsdetails.community.property_costs/100 : '' }}元/m*月</span>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <div class="gutter">
        <router-link :to="{ name : 'actinfo' }" class="view-all"><span class="view-text">查看所有信息</span><span class="cert-icon"></span></router-link>
      </div>
    </section>
    <section class="other-res" v-if="otherResource.length">
      <div class="res-tit">同社区其他资源</div>
      <div class="list-wraper">

          <ul class="list" :style="{ width : otherResource.length*4.48 + 'rem' }">
            <li class="res-item" v-for="(item,index) in otherResource" :key="index">
              <router-link :to="{ name : 'activitiesDetail' , params : { id : item.id } }">
                <div class="img-box">
                  <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt="资源图片">
                  <div class="date">{{ item.time }}</div>
                </div>
                <div class="text-info">
                  <p class="tit ellipsis">{{ item.name }}</p>
                  <p class="price-box"><span class="price-pre">¥</span><span class="price-num">{{ item.price/100 }}</span><span class="silver">起</span></p>
                </div>
              </router-link>
            </li>
          </ul>

      </div>
    </section>
    <section class="comments" ref="comment" v-if="fieldsdetails">
      <div class="comment-tit" @click.stop="toComments(fieldsdetails.count_of_reviews)">
        <span>评价({{ fieldsdetails.count_of_reviews }})</span>
        <span class="cert-icon"></span>
      </div>
      <ul class="comment-list" v-if="comments.length">
        <li class="comment-item" v-for="(item ,index) in comments" :key="index" v-if="index<3">
          <div class="comment-name">
            <div class="name">{{ item.name }}</div>
            <div class="star">
              <star :score="item.score" :size="24"></star>
            </div>
          </div>
          <p class="comment-date">
            <span>{{ item.reviewed_at }}</span><span>现场人流量：<span class="number-people">{{ item.people_flow }}</span></span>
          </p>
          <p class="comment-desc" v-if="item.content">{{ item.content }}</p>
          <div class="img-box" v-if="item.images.length">
            <img v-lazy="img" alt="评论图片" v-for="( img , index) in item.images" :key="index">
          </div>
        </li>
      </ul>
    </section>

    <div class="date-model" v-if="showModel">
      <div class="mask" @click.stop="closeDateModel"></div>
      <div class="date-box">
        <div class="select-norms">
          <div class="date-close" @click.stop="showModel=false"></div>
          <div class="norms-details">
            <div class="com-box">
              <div class="com-left">
                <p>摊位大小：<span>{{ cancleData.size }}</span><span>m</span><sup>2</sup></p>
              </div>
              <div class="com-right">
                <p><span>计价单位：</span><span>{{ cancleData.lease_term_type_name }}</span></p>
              </div>
            </div>
            <div class="com-box">
              <div class="com-left">
                <p><span>押金金额：</span><span>{{ cancleData.deposit > 0 ? '¥' +cancleData.deposit : '免押金' }}</span></p>
              </div>
              <div class="com-right">
                <p class="ellipsis"><span>特殊规格：</span><span>{{ cancleData.custom_dimension }}</span></p>
              </div>
            </div>
            <div class="com-box">
              <div class="com-left">
                <p class="ellipsis"><span>起订天数：</span><span>{{ cancleData.minimum_booking_days }}天起订</span></p>
              </div>
              <div class="com-right">
                <p class="ellipsis">提前{{ cancleData.days_in_advance }}天起订</p>
              </div>
            </div>
          </div>
        </div>
        <date-pick
          :resourceNorms="cancleData.priceArr"
          :rate="cancleData.subsidy_rate"
          :advanceDay="cancleData.days_in_advance"
          :normsDays="cancleData.period"
          :calendars="cancleData.calendars"
          :weather="weather"
          :activityStart="cancleData.activityStart"
          :activityEnd ="cancleData.activityEnd"
          @pipeData = "selectedDate"></date-pick>
        <div class="select-btns">
          <!--多天起订不可加入购物车-->
          <div class="join-car" v-if="cancleData.minimum_booking_days==1" @click="addCart">加入购物车</div>
          <div class="buy-now" @click.stop="buyNow(cancleData.minimum_booking_days)">立即下单</div>
        </div>
      </div>
    </div>

    <div v-transfer-dom>
      <div class="norm-drop-wraper" @touchmove="touchmove" @touchend="touchend" v-if="showFilter">
        <div class="mask"></div>
        <div class="norm-drop" v-if="defaultConditions">
          <div class="norm-lables">
            <div class="lable-item" @click.stop="itemClick( defaultDeposits[0] )" :class="{ active: defaultDeposits[0].is_select }">{{ defaultDeposits[0].text }}</div>
            <div class="lable-item" @click.stop="itemClick( defaultConditions.lease_term_type_names[0] )" v-if="defaultConditions.lease_term_type_names[0]"  :class="{ active: defaultConditions.lease_term_type_names[0].is_select }">按“{{ defaultConditions.lease_term_type_names[0].text }}”计价</div>
            <div class="lable-item" @click.stop="itemClick( defaultConditions.sizes[0] )" v-if="defaultConditions.sizes[0]" :class="{ active: defaultConditions.sizes[0].is_select }">{{ defaultConditions.sizes[0].text }}</div>
            <div class="lable-item filter-lable-search" :class="{ active : filterBtnLight }" @click.stop="filterHide">
              <span>筛选</span>
              <span class="cert-icon"></span>
            </div>
          </div>
          <div class="filter-wraper">

            <div class="norm-filter">

              <div class="filter-item">
                <div class="tit">押金</div>
                <div class="cont">
                  <div class="deposit-item"
                       v-for="(item, index) in defaultDeposits"
                       :key="index"
                       :class="{ active : item.is_select }"
                       @click.stop="itemClick(item)"
                  >{{ item.text }}</div>
                </div>
              </div>
              <div class="filter-item">
                <div class="tit">计价单位</div>
                <div class="cont">
                  <div class="valuation-item"
                       v-for="( item , index ) in defaultConditions.lease_term_type_names"
                       :key="index"
                       :class="{ active : item.is_select }"
                       @click.stop="itemClick(item)"
                  >按“{{ item.text }}”计价</div>
                </div>
              </div>

              <div class="filter-item">
                <div class="tit">摆摊大小（单位：m）</div>
                <div class="cont">
                  <div class="valuation-item"
                       v-for="( item , index ) in defaultConditions.sizes"
                       :key="index"
                       :class="{ active : item.is_select }"
                       @click.stop="itemClick(item)"
                  >{{ item.text }}</div>
                </div>
              </div>

              <div class="filter-item" v-if="defaultConditions.custom_dimensions.length">
                <div class="tit">仅限规格</div>
                <div class="cont">
                  <div class="cus-item"
                       v-for="( item , index ) in defaultConditions.custom_dimensions"
                       :key="index"
                       v-if="item.text"
                       :class="{ active : item.is_select }"
                       @click.stop="itemClick(item)"
                  >{{ item.text }}</div>
                </div>
              </div>

            </div>
            <div class="btn-box">
              <div class="reset" @click.stop="resetFilterData">重置</div>
              <div class="confirm" @click.stop="filterConfirm">确定</div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <div v-transfer-dom>
      <confirm
        v-model="queryModel"
        :close-on-confirm="false"
        title="登录后可以查看更多，是否登录?"
        @on-confirm="onConfirm">
      </confirm>
    </div>
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showJifen">
        <div class="jifen-wraper">
          <div class="img-box">
            <img src="../../images/ic_blue_logo_three@2x.png" alt="a" class="img">
          </div>
          <h3 class="title">积分奖励</h3>
          <div class="text-info lt">
            预定该场地，即可获得与下单支付金额同等数值的积分！
          </div>
          <div class="close" @click="showJifen=false"></div>
        </div>
      </x-dialog>
    </div>
    <mend v-if="error" :res_name="fieldsdetails.name" @close="close" :resource_id="id"></mend>

    <app-down v-show="fieldsdetails" :params="{ resource_id : $route.params.id , type_id : 3 }" link="https://aj4j3o.mlinks.cc/Adoh"></app-down>
    <!--子路由-->
    <transition name="router-slide" mode="out-in">
      <router-view :fieldsdetails="fieldsdetails"></router-view>
    </transition>
  </div>
</template>
<script>
  import star from 'src/components/star';
  import datePick from 'src/components/datePick';
  import AppDown from 'src/components/AppDown.vue';
  import mend from 'src/components/mend';
  import { loadMore } from 'src/components/mixin';
  import { Badge, XDialog , Swiper , SwiperItem , Flexbox , FlexboxItem , Tab , TabItem ,LoadMore ,Confirm,Previewer, TransferDomDirective as TransferDom} from 'vux';
  import { getResourcesDetail , getOtherResources , getResourcesComments  , removeFavorite , addFavorite , addCartList , getCartCount } from 'src/service/getData';
  import { getStorage , setStorage , getStyle , getSession , setSession } from 'src/config/tools';
  import { wxshare } from 'src/config/wechatShare';
  import { half , twoPointPre , twoPointNext , large , timeFormat , hundred } from 'src/filters';
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        id : '' ,
        fieldsdetails : null , // 场地详情
        norms : [] , // 场地规格
        weather : [] ,// 天气数据
        fieldImgs : [] ,
        showDrop : false , // 右侧下拉框
        collected : false , // 是否收藏
        secondIndex : 0, // 次级导航选中
        index : 0,  // 场地信息tab栏
        secondNav : false , // 二级导航出现
        dateArr : [], // 日期数组
        showModel : false , // 是否显示时间框

        cancleData : {} , // 日历需要的数据
        showLoading : false ,
        loadingTip : '正在加载...',
        end : false , // 到底了
        preventRepeatReuqest : false , // 阻止重复请求
        is_show : false ,

        comments : [] , // 评价列表
        otherResource : [] , // 同社区其他资源
        page : 1 ,  // 推荐资源页码
        pageSize : 10 , // 推荐资源页展示数

        community_id : null , // 社区id
        imgList : [] ,// 查看大图
        queryModel : false,
        childShow : false ,// 规格drop

        error : false , // 纠错弹窗
        showJifen : false ,

        cartNumber : 0 ,

        deposits : [
          { text : '无押金', is_select : false },
          { text : '需押金', is_select : false }
        ] , // 有无押金数据渲染
        defaultDeposits : [
          { text : '无押金', is_select : false },
          { text : '需押金', is_select : false }
        ] , // 有无押金数据渲染
        conditions : null , // 筛选标签
        defaultConditions : null , // 筛选标签
        defaultNorms : [] , // 默认场地规格
        hasDeposit : 0 , // 押金 0 两种情况都没有 ， 1 代表 有押金  2 代表  无押金
        showFilter : false , // 筛选显示隐藏
        filterBtnLight : false , // 筛选按钮高亮
      }
    },
    mixins : [ loadMore ] ,
    components : {
      Swiper,
      SwiperItem,
      star,
      Flexbox,
      FlexboxItem,
      Tab ,
      TabItem,
      LoadMore,
      datePick,
      Confirm,
      Previewer,mend,XDialog,Badge , AppDown
    },
    created(){

      this.$vux.loading.show({
        text : 'loading'
      })
    },
    mounted() {

      _MEIQIA('init');
      let params = {
        resource_type_id : 3
      } ;
      let id = this.$route.params.id ;

      getResourcesDetail( id , params ).then( res => {

        this.$vux.loading.hide();
        this.fieldsdetails = res.result.physical_resource ;

        this.conditions = this.changeNorms( res.result.conditions ) ;
        this.defaultConditions = this.changeNorms( JSON.parse( JSON.stringify(res.result.conditions) ) ) ;

        this.id = this.fieldsdetails.current_resource.id ;
        this.community_id = this.fieldsdetails.community_id ;
        this.collected = this.fieldsdetails.current_resource.favorite_status ;
        this.weather = res.result.weather ;
        for(let item of res.result.size){
          Object.assign(item.dimension , { childShow : false });
        }
        this.norms  = res.result.size ;
        this.defaultNorms = res.result.size ;
        this.fieldImgs = this.fieldsdetails.physical_resource_imgs ;
        let community_id = this.community_id ;
        let other = { res_type_id : 3 , current_resource_id : id , page : 1} ; // 场地资源
        getOtherResources( community_id , other ).then( res => {
          this.otherResource = res.result ;
        }).catch(err => {}) ;
        let arr = [];
        for(let item of this.fieldImgs){
          let obj = {} ;
          obj.src = large( item.pic_url ) ;
          arr.push(obj);
        }
        this.imgList = arr ;

        wxshare({
          title : '【'+this.fieldsdetails.name + '】-'+ this.fieldsdetails.community.city.name + '地推平台,摆摊场地,广告媒介,巡展场地,社区推广,在线预订地推场地',
          desc : this.fieldsdetails.community.district.name + '' +this.fieldsdetails.community.detailed_address ,
          link : window.location.origin + '?from=singlemessage'+ window.location.hash ,
          imgUrl : this.imgList[0].src
        });
      }).catch(err => {}) ;

      let obj = {
        page : 1,
        pageSize : 10
      } ;
      getResourcesComments( id , obj ).then(res => {
        this.comments =  res.result;
      }).catch(err => {});

      getCartCount().then(res => {
        this.cartNumber = res.result.count ;
      }).catch(err => {}) ;

      // 操作顶部导航栏的背景色
      window.addEventListener( 'touchmove' , () => {
        try{
          let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
          let swiper = this.$refs.swiper ;
          let head = this.$refs.nav ;
          let nav = this.$refs.snav ;
          let h = getStyle( swiper , 'height' ) - getStyle( head , 'height');
          let n = top / h ;
          try{
            head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
            head.className = 'transparent-header scroll' ;
          }catch (err){}
          if( top >= h ){
            // 二级导航出现
            this.secondNav = true ;
            // 处理二级导航滑动高亮效果
            let two  = this.$refs.norm.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            let thr  = this.$refs.resDetail.offsetTop  - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            let four = this.$refs.comment.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            if( top >= two ){
              // 规格高亮
              this.secondIndex = 1;
            }
            if( top >= thr ){
              this.secondIndex = 2;
            }
            if( top >= four ){
              this.secondIndex = 3;
            }
          }else{
            this.secondNav = false ;
          }
          if( top <= 10 ){
            try{
              head.style.background = 'rgba( 255,255,255 , 0)';
              head.className = 'transparent-header' ;
            }catch(err){}
          }
        } catch(err){}

      } , false );
      window.addEventListener( 'scroll' , () => {
        try{
          let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
          let swiper = this.$refs.swiper ;
          let head = this.$refs.nav ;
          let nav = this.$refs.snav ;
          let h = getStyle( swiper , 'height' ) - getStyle( head , 'height');
          let n = top / h ;
          try{
            head.style.background = `rgba( 255,255,255 , ${ n*1 })`;
            head.className = 'transparent-header scroll' ;
          }catch (err){}
          if( top >= h ){
            // 二级导航出现
            this.secondNav = true ;
            // 处理二级导航滑动高亮效果
            let two  = this.$refs.norm.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            let thr  = this.$refs.resDetail.offsetTop  - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            let four = this.$refs.comment.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
            if( top >= two ){
              // 规格高亮
              this.secondIndex = 1;
            }
            if( top >= thr ){
              this.secondIndex = 2;
            }
            if( top >= four ){
              this.secondIndex = 3;
            }
          }else{
            this.secondNav = false ;
          }
          if( top <= 10 ){
            try{
              head.style.background = 'rgba( 255,255,255 , 0)';
              head.className = 'transparent-header' ;
            }catch(err){}
          }
        } catch(err){}

      } , false );
    },
    filters :{
      large,half,twoPointPre,twoPointNext,timeFormat , hundred
    },
    methods : {
      showErrorModel (){
        this.error = true ;
      },
      close(){
        this.error = false ;
      },
      drop(des){
        des.childShow = !des.childShow  ;
      },
      showServer(){
        _MEIQIA('showPanel');
      },
      collect(){
        let login = this.$store.state.login || getSession('login');
        if(!login){
          this.$router.push( { path: '/login' , query : { redirect : this.$route.fullPath } } );
          return false ;
        }
        //心亮起来
        let id = this.$route.params.id ;
        if(this.collected){
          removeFavorite(id).then( res => {

            this.$vux.toast.show({
              text: '移除收藏成功'
            });
            this.collected = !this.collected ;
          });
        }else{
          addFavorite(id).then( res => {
            this.$vux.toast.show({
              text: '收藏成功'
            });
            this.collected = !this.collected ;
          })
        }
      },
      toComments(n){
        if(n<=3){
          return ;
        }
        let login = getSession('login') ;
        if( !login ){
          this.queryModel = true ;
        }else{
          let id = this.$route.params.id ;
          this.$router.push({name : 'commentDetail' , params : { id : id }});
        }
      },
      onConfirm(){
        this.$router.push({path: '/login' , query : { redirect: this.$route.fullPath } });
        return false ;
      },
      showDrophandler(){
        this.showDrop = !this.showDrop ;
      },
      goMap(lng , lat , name ){
        // 去地图锚点
        this.$router.push({path : '/singlePosition' , query : { lng : lng , lat : lat , fieldName : encodeURIComponent(name) } })
      },

      secondNavClick( n ){
        let head = this.$refs.nav ;
        let nav = this.$refs.snav ;
        if( n==1 ){
          window.scrollTo(0,0);
        }else if( n==2 ){
          let two  = this.$refs.norm.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
          window.scrollTo(0,two);
        }else if( n==3 ){
          let thr  = this.$refs.resDetail.offsetTop  - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
          window.scrollTo(0,thr);
        }else{
          let four  = this.$refs.comment.offsetTop - getStyle( head , 'height' ) - getStyle( nav , 'height' ) ;
          window.scrollTo(0,four);
        }
      } ,
      selectedDate(obj){
        if( obj.length ){
          this.dateArr = obj ;
        }
      },
      order(dimension , resource){

        if( resource.expired ){
          return ;
        }
        this.cancleData.size                 = dimension.size ; // 规格大小
        this.cancleData.lease_term_type_name = dimension.lease_term_type ; // 规格名
        this.cancleData.period               = dimension.period ; // 规格对应的天数
        this.cancleData.custom_dimension     = dimension.custom_dimension ; // 特殊规格
        this.cancleData.deposit              = resource.deposit ; // 押金
        this.cancleData.minimum_booking_days = resource.minimum_booking_days ; // 起订天数
        this.cancleData.days_in_advance      = resource.days_in_advance ; // 提前预定天数
        this.cancleData.priceArr             = resource.selling_resource_price;
        this.cancleData.subsidy_rate         = resource.subsidy_rate ; // 折扣率  50 =》 50%
        this.cancleData.custom_name          = resource.custom_name ; // 场地名
        this.cancleData.calendars            = resource.calendars ; // 不可预定的日期数组

        this.cancleData.activityStart          = resource.activity_start_date ; // 不可预定的日期数组
        this.cancleData.activityEnd            = resource.deadline ; // 不可预定的日期数组
        this.showModel = true ;

      },
      addCart(){
        let login = this.$store.state.login || getSession('login');
        if(!login){
          this.$router.push( { name :'login' , query : { redirect : this.$route.fullPath } } );
          return false ;
        }
        if( !this.dateArr.length ){
          this.$vux.toast.text('请先选择日期' ,'middle');
          return ;
        }
        let arr = [] ;
        if( this.cancleData.lease_term_type_name === '天' ){  // 周期为天的处理
          for(let item of this.dateArr){
            let obj = {
              id : +this.$route.params.id ,
              size : this.cancleData.size ,
              lease_term_type_id: item.lease_term_type_id ,
              count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
              count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
              custom_dimension : this.cancleData.custom_dimension ,
              date : item.date, // 选择的日期数组
            };
            arr.push(obj);
          }
        }else{
          let obj = {
            id : +this.$route.params.id ,
            size : this.cancleData.size ,
            lease_term_type_id: this.dateArr[0].lease_term_type_id ,
            count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
            count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
            custom_dimension : this.cancleData.custom_dimension ,
            date : this.dateArr[0].date // 选择的日期数组
          };
          arr.push(obj);
        }

        let params = {
          resources : JSON.stringify(arr)
        };
        addCartList(params).then( res => {
          this.$vux.toast.show({
            text : '成功加入购物车',
            width : '25%',
            type : 'success'
          })
        }).catch( err => {
          this.$vux.toast.show({
            text : '成功加入购物车',
            type : 'warn',
            width : '25%'
          })
        })
      },
      buyNow(num){
        let login = this.$store.state.login || getSession('login');
        if(!login){
          this.$router.push( { name :'login' , query : { redirect : this.$route.fullPath } } );
          return false ;
        }
        if( !this.dateArr.length ){
          this.$vux.toast.text('请先选择日期' ,'middle');
          return ;
        }
        if( this.dateArr.length < num ){
          this.$vux.toast.text('您选择的天数小于起订天数，不能下单！' ,'middle');
          return ;
        }
        let arr = [] ;
        if( this.cancleData.lease_term_type_name === '天' ){
          for(let item of this.dateArr){
            let obj = {
              id : this.$route.params.id ,
              size : this.cancleData.size ,
              lease_term_type_id: item.lease_term_type_id ,
              count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
              count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
              custom_dimension : this.cancleData.custom_dimension ,
              date : item.date, // 选择的日期数组
              lease_term_type_name: this.cancleData.lease_term_type_name ,
              name : this.cancleData.custom_name , // 场地名
              field_type : this.fieldsdetails.current_resource.activity_type&&this.fieldsdetails.current_resource.activity_type.display_name || '' ,
              pic_url : this.fieldImgs[0].pic_url ,  // 图片
              leaveWorld : '', // 留言
              deposit : this.cancleData.deposit , // 押金
              discount_rate : this.cancleData.subsidy_rate , // 补贴率
              discount_price : 0 , // 补贴钱
              price : item.price*100 // 金额
            };
            arr.push(obj);
          }
        }else{
          let obj = {
            id : this.$route.params.id ,
            size : this.cancleData.size ,
            lease_term_type_id: this.dateArr[0].lease_term_type_id ,
            count : 1, // 资源数量(场地资源直接传入1即可，拼团也传1)
            count_of_time_unit : 1, // 时间单位数量(e.g. 3周, 3个季度, 场地资源直接传入1即可，拼团也传1)
            custom_dimension : this.cancleData.custom_dimension ,
            date : this.dateArr[0].date, // 选择的日期数组第一天
            lease_term_type_name: this.cancleData.lease_term_type_name ,
            name : this.cancleData.custom_name , // 场地名
            field_type : this.fieldsdetails.res_type_id == 1&&this.fieldsdetails.field_type ? this.fieldsdetails.field_type.display_name : this.fieldsdetails.res_type_id == 3&&this.fieldsdetails.ad_type ? this.fieldsdetails.ad_type.display_name : '' ,
            pic_url : this.fieldImgs[0].pic_url ,  // 图片
            leaveWorld : '', // 留言
            deposit : this.cancleData.deposit, // 押金
            discount_rate : this.cancleData.subsidy_rate, // 折扣率
            discount_price : 0 , // 补贴钱
            price : this.dateArr[0].price*100 // 金额
          };
          arr.push(obj);
        }
        // 下单的resource存入session
        setSession('orderResource' ,{ resource : arr , cart_item_ids : null });
        this.$router.push('/submitOrder');
      },
      show(index){
        this.$refs.previewer.show(index) ;
      },

      changeNorms(data){
        let condition = JSON.parse( JSON.stringify( data ) );
        for(let k in condition ){
          let temp =  condition[k] ;
          temp = temp.map( (item,index) => {
            item = {
              is_select : false,
              text : item
            };
            return item ;
          });
          condition[k] = temp ;
        }
        return condition ;
      },

      itemClick(item){
        // 筛选框里的筛选
        item.is_select = !item.is_select ;
        this.filterLight();
      },
      btnItemClick(item){
        // 快捷按钮的筛选
        item.is_select = !item.is_select ;
        this.filterConfirm();
      },
      resetFilterData(){
        this.filterBtnLight = false ;
        this.deposits = this.$options.data().deposits ;
        this.defaultDeposits = this.$options.data().defaultDeposits ;
        this.norms = this.defaultNorms ;
//        this.showFilter = false ;
        for(let k in this.conditions ){
          let arr = this.conditions[k] ;
          for(let i = 0 ,len = arr.length ; i < len ; i++){
            let temp = arr[i];
            temp.is_select = false ;
          }
        }
        for(let k in this.defaultConditions ){
          let arr = this.defaultConditions[k] ;
          for(let i = 0 ,len = arr.length ; i < len ; i++){
            let temp = arr[i];
            temp.is_select = false ;
          }
        }
      },
      filterLight(){
        // 拿到押金选中的条件
        let arr = [] ;
        for( let des of this.defaultDeposits ){
          if( des.is_select ) {
            arr.push(des)
          }
        }
        if( !arr.length ) {
          this.hasDeposit = 0 ;
        }else if(arr.length === 1){
          if(arr[0].text === '无押金'){
            this.hasDeposit = 2 ;
          }else{
            this.hasDeposit = 1 ;
          }
        }else{
          this.hasDeposit = 3 ;
        }
        // 拿到周期选中的条件
        let arr2 = [];
        for( let norm of this.defaultConditions.lease_term_type_names ){
          if( norm.is_select ){
            arr2.push( norm.text );
          }
        }
        // 拿到大小选中的条件
        let arr3 = [];
        for( let size of this.defaultConditions.sizes ){
          if( size.is_select ){
            arr3.push( size.text );
          }
        }
        // 拿到特殊规格选中的条件
        let arr4 = [];
        for( let cus of this.defaultConditions.custom_dimensions ){
          if( cus.is_select ){
            arr4.push( cus.text );
          }
        }
        // 筛选高亮
        if( this.hasDeposit || arr2.length || arr3.length || arr4.length ){
          this.filterBtnLight = true ;
        }else{
          this.filterBtnLight = false ;
        }
      },

      filterConfirm(){
        this.showFilter = false ;
        this.deposits = JSON.parse( JSON.stringify(this.defaultDeposits) ) ;
        this.conditions =  JSON.parse( JSON.stringify(this.defaultConditions) ) ;
        // 拿到选中的条件
        // 拿到押金选中的条件
        let arr = [] ;
        for( let des of this.deposits ){
          if( des.is_select ) {
            arr.push(des)
          }
        }
        if( !arr.length ) {
          this.hasDeposit = 0 ;
        }else if(arr.length === 1){
          if(arr[0].text === '无押金'){
            this.hasDeposit = 2 ;
          }else{
            this.hasDeposit = 1 ;
          }
        }else{
          this.hasDeposit = 3 ;
        }
        // 拿到周期选中的条件
        let arr2 = [];
        for( let norm of this.conditions.lease_term_type_names ){
          if( norm.is_select ){
            arr2.push( norm.text );
          }
        }
        // 拿到大小选中的条件
        let arr3 = [];
        for( let size of this.conditions.sizes ){
          if( size.is_select ){
            arr3.push( size.text );
          }
        }
        // 拿到特殊规格选中的条件
        let arr4 = [];
        for( let cus of this.conditions.custom_dimensions ){
          if( cus.is_select ){
            arr4.push( cus.text );
          }
        }
        // 筛选高亮
        if( this.hasDeposit || arr2.length || arr3.length || arr4.length ){
          this.filterBtnLight = true ;
        }else{
          this.filterBtnLight = false ;
        }
        // 得到押金筛选后的结果
        let temp = [] ; // 存储数据的变量
        let norms = JSON.parse( JSON.stringify( this.defaultNorms ) ) ;
        if( this.hasDeposit ){
          for( let p of norms ){
            let res = p.resource ;
            let cArr = [];
            for( let c of res ){
              if( this.hasDeposit == 1 ){
                if( c.deposit > 0 ){
                  cArr.push(c);
                }
              }else if(this.hasDeposit == 2){
                if( c.deposit <= 0 ){
                  cArr.push(c);
                }
              }else{
                cArr.push(c);
              }
            }
            if( cArr.length ){
              temp.push({
                dimension : p.dimension ,
                resource : cArr
              })
            }
          }
        }else{
          temp = norms ;
        }
        // 周期的筛选
        let temp2 = [];
        if( temp.length ){
          for( let t of temp ){
            let type = t.dimension.lease_term_type ;
            if( arr2.length ){
              if( arr2.includes( type ) ){
                temp2.push( t );
              }
            }else{
              temp2 = temp ;
              break ;
            }
          }
        }else{
          this.norms = [] ;
          return false ;
        }
        // size的筛选
        let temp3 = [];
        if( temp2.length ){
          for( let t of temp2 ){
            let size = t.dimension.size ;
            if( arr3.length ){
              if( arr3.includes( size ) ){
                temp3.push( t );
              }
            }else{
              temp3 = temp2 ;
              break ;
            }
          }
        }else{
          this.norms = [] ;
          return false ;
        }
        // 规格的筛选
        let temp4 = [];
        if( temp3.length ){
          for( let t of temp3 ){
            let custom_dimension = t.dimension.custom_dimension ;
            if( arr4.length ){
              if( arr4.includes( custom_dimension ) ){
                temp4.push( t );
              }
            }else{
              temp4 = temp3;
              break ;
            }
          }
        }else{
          this.norms = [] ;
          return false ;
        }
        this.norms = temp4 ;
      },
      filterHide(){
        // 需将筛选条件重置为之前的状态
        this.deposits = this.$options.data().deposits ;
        this.defaultConditions = JSON.parse( JSON.stringify(this.conditions)) ;
        this.defaultDeposits = JSON.parse( JSON.stringify(this.deposits)) ;
        this.showFilter = false ;
      },
      touchmove(){
        document.body.className = 'noscroll';
      },
      touchend(){
        document.body.className = '';
      },
      filterClick(){
        let swiper = this.$refs.swiper ;
        let h = getStyle( swiper , 'height' );
        this.showFilter = true ;
        window.scrollTo(0 , h);
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all 0.4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }
  /*-------*/
  .jifen-wraper{
    padding: 0 0.35rem 0.25rem;
    .img-box{
      height: 1.6rem;
      .img{
        width: 1.6rem;
        height: 1.6rem;
        margin: -0.8rem auto 0.2rem ;
      }
    }
    .title{
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.34rem;
      color: #333;
      font-weight: normal;
    }
    .text-info{
      margin-top: 0.35rem;
      line-height: 0.5rem;
      font-size: 0.3rem;
      color: #999;
    }
    .close{
      position: fixed;
      left: 50%;
      bottom: -1.5rem;
      width: 0.86rem;
      height: 0.86rem;
      transform: translateX(-50%);
      @include bg-image('../../images/ic_closee_white');
    }
  }
  .transparent-header{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 0.88rem;
    padding: 0 0.24rem;
    background-color: transparent;
    .transparent-left{
      @include wh( 0.48rem , 0.48rem );
      margin-top: 0.2rem;
      .back-icon{
        display: inline-block;
        vertical-align: top;
        @include wh( 0.48rem , 0.48rem );
        @include bg-image('../../images/nav_ic_back_white');
      }
    }
    .ct{
      font-size: 0;
    }
    .transparent-right{
      position: relative;
      @include wh( 1.38rem , 0.48rem );
      text-align: right;
      font-size: 0;
      .car-icon{
        position: relative;
        display: inline-block;
        vertical-align: top;
        @include wh( 0.48rem , 0.48rem );
        margin-right: 0.44rem;
        @include bg-image('../../images/nav_ic_shopping _white');
        .cart-sum{
          position: absolute;
          top: -0.04rem;
          left: 0.34rem;
          height: 0.3rem;
          min-width: 0.3rem;
          max-width: 0.58rem;
          line-height: 0.3rem;
          padding: 0 0.04rem;
          text-align: center;
          color: #fff;
          font-size: 0.18rem;
          border-radius: 0.3rem;
          background-color: $red;
        }
      }
      .sys-icon{
        display: inline-block;
        @include wh( 0.46rem , 0.46rem );
        @include bg-image('../../images/nav_ic_more_white');
      }
    }
    .dropdown{
      position: absolute;
      top: 0.68rem;
      right: 0;
      z-index: 20;
      @include wh( 2.1rem , 2.09rem );
      padding-top: 0.08rem;
      @include bg-image('../../images/ic_bg_select_popup_three');
      ul {
        padding: 0 0.3rem;
        .drop-item {
          height: 1rem ;
          line-height: 1rem;
          font-size: 0.26rem;
          >span{
            display: inline-block;
            @include wh( 1.06rem , 100% );
            text-align: center;
          }
          .heart-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.44rem , 0.44rem );
            @include bg-image('../../images/popup_ic_collection');
            &.on{
              @include bg-image('../../images/ic_collection_red');
            }
          }
          .server-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.44rem , 0.44rem );
            @include bg-image('../../images/popup_ic_service');
          }
          .collect{
            @include bb-1px(#e8e8e8);
          }
        }
      }

    }
    &.scroll{
      .ct{
        font-size: 0.34rem;
      }
      .back-icon{
        @include bg-image('../../images/ic_back_black');
      }
      .car-icon{
        @include bg-image('../../images/nav_ic_shopping _black');
      }
      .sys-icon{
        display: inline-block;
        @include wh( 0.46rem , 0.46rem );
        @include bg-image('../../images/ic_more_black');
      }
    }
  }
  .second-nav{
    position: fixed;
    top: 0.88rem;
    left: 0;
    z-index: 1;
    width: 100%;
    background-color: #fff;
    /*tab栏重置样式*/
    .vux-tab{
      height: 0.84rem;
    }
    .vux-tab .vux-tab-item{
      line-height: 0.84rem;
      font-size: 0.28rem;
      color: #999;
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      color: $mainColor;
      .position-icon{
        display: inline-block;
        vertical-align: middle;
        @include wh( 0.36rem , 0.36rem );
        @include bg-image('../../images/icon_position');
      }
    }
  }
  .wrapBox {
    position: relative;
    top: 0;
    left:0;
    background-color: #fff;
    .imgbox {
      img {
        width: 100%;
        height: 5.6rem;
      }
    }
    .typeposition {
      position: absolute;
      bottom: 0.26rem;
      left: 0.26rem;
      @include wh ( 1rem , 0.42rem );
      line-height: 0.42rem;
      border-radius: 0.04rem;
      border: 1px solid #fff;
      font-size: 0.22rem;
      text-align: center;
      color: $white;
      background-color: transparent;
    }
  }
  .act-time{
    line-height: 0.6rem;
    padding: 0 0.24rem;
    @include sc(0.24rem ,#fff);
    background-color: $orange;
    .act-icon{
      display: inline-block;
      vertical-align: top;
      margin: 0.08rem 0.16rem 0 0;
      @include wh(0.44rem,0.44rem);
      @include bg-image('../../images/ic_horn_three');
    }
  }
  .resource{
    background-color: #fff;
    overflow: hidden;
    .resource-name{
      padding: 0 0.24rem;
      font-family: PingFangSC-Medium;
      margin-top: 0.28rem;
      font-size: 0.4rem;
      color: #1E1E1E;
    }
    .resource-people{
      padding: 0 0.24rem;
      margin-top: 0.2rem;
      font-size: 0.22rem;
      color: #666;
      .mg{
        margin-right: 0.3rem;
      }
    }
    .tag-box{
      padding: 0 0.24rem;
      font-size: 0;
      .tag-item{
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0 0.2rem;
        margin: 0.27rem 0.2rem 0.3rem 0;
        font-size: 0.22rem;
        color: $orange ;
        background-color: rgba(255,102,0 , 0.1);
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .address{
      display: flex;
      padding: 0.3rem 0.24rem;
      background-color: #fafafa;
      .address-text{
        width: 6.4rem;
        line-height: 1.25;
        border-right: 1px solid rgba(0,0,0,0.06);
        .name{
          font-family: PingFangSC-Regular;
          font-size: 0.28rem;
        }
        .jt-address{
          margin-top: 0.15rem;
          font-size: 0;
          .indoor{
            display: inline-block;
            vertical-align: top;
            height: 0.3rem;
            line-height: 0.28rem;
            padding: 0 0.1rem;
            margin-right: 0.1rem;
            border: 1px solid $mainColor;
            border-radius: 0.04rem;
            font-size: 0.2rem;
            color: $mainColor;
          }
          .detail-addr{
            width: 6.38rem;
            font-size: 0.24rem;
            color: #666;
            overflow: hidden;
          }
        }
      }
      .adress-icon{
        width: 0.6rem;
        text-align: right;
        .icon{
          display: inline-block;
          vertical-align: top;
          margin-top: 0.16rem;
          @include wh( 0.44rem , 0.44rem );
          @include bg-image('../../images/ic_location');
        }
      }
    }
    .gutter{
      background-color: #fafafa;
      .btn-box{
        padding: 0.22rem 0;
        border-top: 1px solid rgba(0,0,0,0.06);
        font-size: 0.22rem;
        color: #666;
        .ct{
          height: 0.4rem;
          line-height: 0.4rem;
          &.promise-item{
            border-left: 1px solid rgba(0,0,0,0.06);
            border-right: 1px solid rgba(0,0,0,0.06);
          }
          .btn-icon{
            display: inline-block;
            vertical-align: middle;
            @include wh( 0.34rem , 0.34rem );
            margin-right: 0.06rem;
            &.integral{
              //@include bg-image('../../images/ic_gold');
            }
            &.promise{
              //@include bg-image('../../images/ic_refund');
            }
            &.error{
              //@include bg-image('../../images/ic_money');
            }
          }
        }
        .jifen{
          border-right: 1px solid #ddd;
        }
      }
    }

  }
  .norms{
    margin-top: 0.2rem;
    .title{
      height: 0.92rem;
      line-height: 0.92rem;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      font-family: PingFangSC-Regular;
      font-size: 0.34rem;
      background-color: #fff;
      .norms-icon{
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.18rem;
        @include wh( 0.36rem , 0.36rem );
        @include bg-image('../../images/ic_ruler')
      }
    }
    .norm-drop-content {
      position: relative;
      .norm-lables {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.24rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        .lable-item {
          height: 0.56rem;
          line-height: 0.56rem;
          padding: 0 0.3rem;
          border-radius: 0.28rem;
          font-size: 0.24rem;
          background-color: #f1f2f6;
          &.active {
            color: $mainColor;
            background-color: #e5f1ff;
          }
        }
        .lable-search {
          position: relative;
          .cert-icon {
            display: inline-block;
            @include wh(0.22rem, 0.22rem);
            @include bg-image('../../images/icon_open_gray_nor_three_one');
          }
          &.active{
            .cert-icon{
              @include bg-image('../../images/icon_open_blue_selected_three_one');
            }
          }
        }
      }
    }
    .norm-list{
      .parent-item{
        border-bottom:1px solid #eee;
      }
      .com-font{
        font-size: 0.22rem;
        color: #999;
      }
      .btm{
        padding: 0.1rem 0 0.18rem;
        background-color: #fff;
        .has-server{
          .item{
            position: relative;
            top: 0;
            left: 0;
            height: 1.08rem;
            .server-tag{
              position: absolute;
              top: 50%;
              left: 50%;
              height: 0.68rem;
              transform: translate(-50% , -50%);
              &.tag_1{
                width: 0.4rem;
                @include bg-image('../../images/ic_electric');
              }
              &.tag_2{
                width: 0.4rem;
                @include bg-image('../../images/icon_chair');
              }
              &.tag_3{
                width: 0.4rem;
                @include bg-image('../../images/ic_tent');
              }
              &.tag_4{
                width: 0.78rem;
                @include bg-image('../../images/ic_leaflets');
              }
              &.tag_5{
                width: 0.4rem;
                @include bg-image('../../images/ic_invoice');
              }
              &.tag_6{
                width: 0.8rem;
                @include bg-image('../../images/ic_materiel');
              }
            }
          }

        }
        .no-server{
          line-height: 1.08rem;
          text-align: center;
          font-size: 0.22rem;
          color: #999;
        }
      }
      .double-norm-item{
        .parent{
          display: flex;
          justify-content: space-between;
          padding: 0.38rem 0.24rem 0.35rem;
          box-shadow: 0 0.04rem 0.08rem 0 rgba(0,0,0,0.1);
          background-color: #fff;
          .norm-detail{
            .sliver-text{
              font-size: 0.22rem;
              color: #999;
            }
            .norm-size{
              font-size: 0.28rem;
            }
            .norm-cus{
              margin-top: 0.08rem;
            }
            .norm-tag{
              margin-top: 0.08rem;
              .tag{
                font-size: 0.22rem;
                color: $fontColor;
              }
            }
          }
          .price{
            padding-top: 0.35rem;
            font-size: 0.22rem;
            color: #999;
            .price-pre{
              font-size: 0.24rem;
              color: $red;
            }
            .price-num{
              font-size: 0.36rem;
              font-weight: bold;
              color: $red ;
            }
            .cert-icon{
              display: inline-block;
              vertical-align: top;
              @include wh( 0.44rem , 0.44rem );
              margin-left:0.16rem;
              @include bg-image('../../images/ic_open_gray');
              transition: all 0.3s;
            }
          }
          &.translate{
            .price{
              .cert-icon{
                transform: rotate(180deg);
              }
            }

          }
        }
        .child-box{
          padding: 0.2rem 0.24rem;
          .child{
            height: 2.9rem;
            background-color: #fff;
            border-radius: 0.08rem;
            margin-bottom: 0.1rem;
            &:last-child{
              margin-bottom: 0;
            }
            .top{
              padding: 0.4rem 0 0.32rem;
              margin: 0 0.24rem;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(0,0,0,0.1);
              .place-order{
                display: flex;
                .price-box{
                  @include sc(0.22rem,#999);
                  margin-right: 0.2rem;
                  .price-label{
                    display: inline-block;
                    vertical-align: baseline;
                    @include wh( 0.32rem , 0.32rem );
                    margin-right: 0.04rem;
                    @include bg-image('../../images/ic_subsidy_normal_three copy');
                  }
                  .price-pre{
                    font-size: 0.28rem;
                    color: $red;
                  }
                  .price{
                    font-size: 0.36rem;
                    color: $red;
                    font-weight: bold;
                  }
                  .price-next{
                    @extend .price-pre;
                  }
                  .oringe-price{
                    margin-left: 0.08rem;
                  }
                }
                .order-btn{
                  @include wh( 1.12rem , 0.8rem );
                  line-height: 0.8rem;
                  text-align: center;
                  border-radius: 0.08rem;
                  font-size: 0.34rem;
                  color: #fff;
                  background-color: $orange;
                  &.disabled{
                    color: #bbb;
                    background-color:#ddd;
                  }
                }
                .order-btn2{
                  @include wh( 1.12rem , 1.2rem );
                  @include bg-image('../../images/ic_order Authentica_nor _three');
                  &.disabled{
                    @include bg-image('../../images/ic_orderauthentica_disabled_three');
                  }
                }
              }
              .self{
                @include wh( 1.32rem , 0.74rem );
                @include bg-image('../../images/ic_self support_three');
              }
              .agent{
                @include wh( 1.32rem , 0.74rem );
                @include bg-image('../../images/ic_third  agency_three');
              }
              .property{
                @include wh( 1.32rem , 0.74rem );
                @include bg-image('../../images/property_three');
              }
            }

          }
          &.translate{
            display: none;
          }
        }
      }
      .norm-item{
        .box{
          padding: 0 0.24rem ;
          background-color: #fff;
          .top{
            display: flex;
            justify-content: space-between;
            padding: 0.38rem 0 0.28rem;
            border-bottom: 1px solid #eee;

            .norm-detail{
              .sliver-text{
                font-size: 0.22rem;
                color: #999;
              }
              .norm-size{
                font-family: PingFangSC-Medium;
                font-size: 0.28rem;
              }
              .norm-cus{
                font-family: PingFangSC-Regular;
                margin-top: 0.08rem;
              }
              .norm-tag{
                margin-top: 0.1rem;
                .tag{
                  font-size: 0.22rem;
                  color: $fontColor;
                }
              }
            }
            .place-order{
              display: flex;
              .price-box{
                @include sc(0.22rem,#999);
                margin-right: 0.2rem;
                .price-label{
                  display: inline-block;
                  vertical-align: baseline;
                  @include wh( 0.32rem , 0.32rem );
                  margin-right: 0.04rem;
                  @include bg-image('../../images/ic_subsidy_normal_three copy');
                }
                .price-pre{
                  font-size: 0.28rem;
                  color: $red;
                }
                .price{
                  font-size: 0.36rem;
                  color: $red;
                  font-weight: bold;
                }
                .price-next{
                  @extend .price-pre;
                }
                .oringe-price{
                  margin-left: 0.08rem;
                }
              }
              .order-btn{
                @include wh( 1.12rem , 0.8rem );
                line-height: 0.8rem;
                text-align: center;
                border-radius: 0.08rem;
                font-size: 0.34rem;
                color: #fff;
                background-color: $orange;
                &.disabled{
                  color: #bbb;
                  background-color:#ddd;
                }
              }
              .order-btn2{
                @include wh( 1.12rem , 1.2rem );
                @include bg-image('../../images/ic_order Authentica_nor _three');
                &.disabled{
                  @include bg-image('../../images/ic_orderauthentica_disabled_three');
                }
              }
            }
          }
        }

      }
      .enquire{
        padding: 0 0.24rem;
        background-color: #fff;
        .enquire-flex{
          display: flex;
          justify-content: space-between;
          padding: 0.38rem 0 0.28rem;
          border-bottom: 1px solid #eee;
          .enquire-top{
            @include sc(0.3rem,$fontColor);
            font-family: PingFangSC-Medium;
            .no-price{
              @include sc(0.3rem,$red);
            }
            .like-price{
              font-family: PingFangSC-Regular;
              margin-top: 0.15rem;
            }
          }
          .enquire-btns{
            .enquire-btn{
              display: block;
              @include wh(1.12rem,0.8rem);
              line-height: 0.8rem ;
              text-align: center;
              @include sc(0.34rem,#fff);
              border-radius: 0.08rem;
              background-color: $orange;
              &.disabled{
                color: #bbb;
                background-color:#ddd;
              }
              &.press{
                position: relative;
                &:after{
                  content: '';
                  @include allcover;
                  border-radius: 0.08rem;
                  background-color: rgba(0,0,0,0.3);
                }
              }
            }
            .enquire-btn-self{
              display: block;
              @include wh(1.12rem,1.2rem);
              @include bg-image('../../images/button_vxunjia_nor_three_one');
              &.disabled{
                @include bg-image('../../images/button_vxunjia_disabled_three_one');
              }
              &.press{
                @include bg-image('../../images/button_vxunjia_press_three_one');
              }
            }
          }
        }
      }
    }
  }
  .res-detail{
    margin-top: 0.2rem;
    padding-bottom: 0.3rem;
    background-color: #fff;
    .com-info{
      padding: 0.15rem 0.24rem;
      .com-info-item{
        display: flex;
        margin-top: 0.2rem;
        .com-info-tit{
          width: 1.6rem;
          font-size: 0.3rem;
          color: #999;
        }
        .com-info-cnt{
          width: 5.5rem;
          line-height: 1.1;
          font-size: 0.3rem;
          color: $fontColor;
        }
      }
    }
    .gutter{
      .view-all{
        display: block;
        height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.24rem;
        text-align: center;
        color: $mainColor;
        background-color: #f8f8f8;
        .view-text{
          margin-right: 0.06rem;
        }
        .cert-icon{
          display: inline-block;
          vertical-align: middle;
          @include wh( 0.24rem , 0.24rem );
          @include bg-image('../../images/ic_open_blue');
        }
      }
    }
    /*tab栏重置样式*/
    .vux-tab{
      height: 0.94rem;
    }
    .vux-tab .vux-tab-item{
      line-height: 0.94rem;
      font-size: 0.28rem;
      color: #999;
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      font-size: 0.34rem;
      color: #282A2A!important;
    }
  }
  .other-res{
    margin-top: 0.2rem;
    background-color: #fff;
    .res-tit{
      height: 0.94rem;
      line-height: 0.94rem;
      padding: 0 0.24rem;
      font-size: 0.34rem;
      color: #1E1E1E;
    }
    .list-wraper{
      height: 4.32rem;
      overflow-x: scroll;
      .list{
        display: flex;
        margin-left: 0.2rem;
        .res-item{
          width: 4.28rem;
          margin-right: 0.2rem;
          .img-box{
            position: relative;
            top: 0;
            left: 0;
            >img{
              @include wh(4.28rem ,3rem)
            }
            .date{
              position: absolute;
              bottom: 0;
              left: 0;
              @include wh( 100% , 0.4rem );
              padding-left: 0.1rem;
              line-height: 0.4rem;
              font-size: 0.22rem;
              color: #fff;
            }
          }
          .text-info{
            .tit{
              margin-top: 0.2rem;
              font-size: 0.3rem;
              color: #1E1E1E;
            }
            .price-box{
              margin-top: 0.2rem;
              .price-pre{
                font-size: 0.22rem;
                color: $red;
              }
              .price-num{
                font-size: 0.34rem;
                color: $red;
              }
              .silver{
                font-size: 0.22rem;
                color: #999;
              }
            }
          }
        }
      }

    }
  }
  .comments{
    margin: 0.2rem 0;
    background-color: #fff;
    .comment-tit{
      display: flex;
      justify-content: space-between;
      padding: 0 0.24rem;
      height: 0.94rem;
      line-height: 0.94rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      font-size: 0.34rem;
      color: #1E1E1E;
      .cert-icon{
        display: inline-block;
        margin-top: 0.25rem;
        @include wh( 0.44rem , 0.44rem );
        @include bg-image('../../images/icon_more_gary');
      }
    }
    .comment-list{
      padding: 0 0.24rem;
      .comment-item{
        padding: 0.3rem 0;
        border-bottom: 1px solid #e8e8e8;
        .comment-name{
          display: flex;
          justify-content: space-between;
          font-size: 0.28rem;
          color: #666;
        }
        .comment-date{
          display: flex;
          justify-content: space-between;
          margin-top: 0.15rem;
          font-size: 0.24rem;
          color: #999;
          .number-people{
            color: #000;
          }
        }
        .comment-desc{
          padding: 0.3rem 0;
          font-size: 0.3rem;
          color: #1E1E1E;
        }
        .img-box{
          display: flex;
          >img{
            @include wh( 1.6rem , 1.6rem );
            margin-right: 0.2rem;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }

    }
  }

  .date-model{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    @include wh( 100% , 100% );
    .mask{
      @include allcover;
      background-color: rgba(0,0,0,0.6);
    }
    .date-box{
      position: absolute;
      bottom: 0;
      overflow-y: scroll;
      .select-norms{
        position: relative;
        top: 0;
        left: 0;
        padding: 0.6rem 0.6rem 0.5rem 0.5rem;
        font-size: 0.26rem;
        color: #fff;
        background-color: $mainColor;
        .date-close{
          position: absolute;
          top: 0.16rem;
          right: 0.16rem;
          @include wh( 0.46rem,0.46rem );
          @include bg-image('../../images/ic_close_white');
        }
        .com-box{
          display: flex;
          padding-bottom: 0.29rem;
          overflow: hidden;
          &:last-child{
            padding-bottom: 0;
          }
          .com-left{
            width: 3.74rem;
          }
          .com-right{
            width: 2.68rem;
            overflow: hidden;
          }
        }
      }
      .select-btns{
        display: flex;
        justify-content: space-between;
        height: 0.98rem;
        line-height: 0.98rem;
        text-align: center;
        font-size: 0.34rem;
        color: #fff;
        .join-car{
          flex: 1;
          background-color: $mainColor;
        }
        .buy-now{
          flex: 1;
          background-color: $orange;
        }
      }
    }

  }

  .norm-drop-wraper{
    .mask{
      position: fixed;
      z-index: 1000;
      top: 0.88rem;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .norm-drop{
      position: fixed;
      top: 0.88rem;
      left: 0;
      width: 100%;
      z-index: 10001;
      .norm-lables{
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.24rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        .lable-item{
          height: 0.56rem;
          line-height: 0.56rem;
          padding: 0 0.3rem;
          border-radius: 0.28rem;
          font-size: 0.24rem;
          background-color: #f1f2f6;
          &.active{
            color: $mainColor;
            background-color: #e5f1ff;
          }
        }
        .filter-lable-search{
          position: relative;
          .cert-icon{
            display: inline-block;
            @include wh(0.22rem,0.22rem);
            @include bg-image('../../images/icon_close_gray_nor_three_one');
          }
          &.active{
            color: $mainColor;
            background-color: #e5f1ff;
            .cert-icon{
              @include bg-image('../../images/icon_close_blue_selected_three_one');
            }
          }
        }
      }
      .filter-wraper{
        position: absolute;
        top: 0.96rem;
        left: 0;
        z-index: 1;
        width: 100%;
        max-height: 9.16rem;
        background-color: #f8f8f8;
        .norm-filter{
          max-height: 8.15rem;
          overflow-y: scroll;
          .filter-item{
            .tit{
              padding: 0.3rem 0.24rem;
              @include sc(0.24rem,#666);
            }
            .cont{
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              padding: 0 0.24rem;
              .deposit-item{
                width: 1.58rem;
                height: 0.66rem;
                line-height: 0.66rem;
                margin:0 0.2rem 0.3rem 0;
                font-size: 0.24rem;
                text-align: center;
                border-radius: 0.08rem;
                background-color: #f1f2f6;
                &.active{
                  color: $mainColor;
                  background-color: #e5f1ff;
                }
              }
              .valuation-item{
                width: 3.39rem;
                height: 0.66rem;
                line-height: 0.66rem;
                margin:0 0.2rem 0.2rem 0;
                font-size: 0.24rem;
                text-align: center;
                border-radius: 0.08rem;
                background-color: #f1f2f6;
                &:nth-child(2n){
                  margin-right: 0;
                }
                &.active{
                  color: $mainColor;
                  background-color: #e5f1ff;
                }
              }
              .cus-item{
                width: 2.18rem;
                height: 0.66rem;
                line-height: 0.66rem;
                margin:0 0.2rem 0.2rem 0;
                font-size: 0.24rem;
                text-align: center;
                border-radius: 0.08rem;
                background-color: #f1f2f6;
                &:nth-child(3n){
                  margin-right: 0;
                }
                &.active{
                  color: $mainColor;
                  background-color: #e5f1ff;
                }
              }
            }
          }
        }
        .btn-box{
          display: flex;
          height: 1rem;
          line-height: 1rem;
          border-top: 1px solid #eee;
          text-align: center;
          .reset{
            flex: 1;
            @include sc(0.34rem,$mainColor);
            background-color: #fff;
          }
          .confirm{
            flex: 1;
            @include sc(0.34rem,#fff);
            background-color: $mainColor;
          }
        }
      }
    }
  }
  .no-filter{
    padding: 0 0.24rem;
    background-color: #f8f8f8;
    .tit{
      padding-top: 0.4rem;
      font-size: 0.24rem;
    }
    .cont{
      display: flex;
      flex-wrap: wrap;
      padding-bottom:0.3rem;
      .item{
        position: relative;
        min-width: 1.32rem;
        height: 0.56rem;
        line-height: 0.56rem;
        padding: 0 0.3rem;
        margin:0.48rem 0.38rem 0 0;
        border-radius: 0.28rem;
        font-size: 0.24rem;
        color: $mainColor;
        background-color: #e5f1ff;
        .icon{
          position: absolute;
          top: -0.21rem;
          right: -0.21rem;
          @include wh(0.42rem,0.42rem);
          @include bg-image('../../images/ic_idelete_three_one');
        }
      }
    }
  }
</style>
