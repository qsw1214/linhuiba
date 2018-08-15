<template lang="html">
  <div>
    <v-scroolhead path="/home">
      <div slot="center-part">需求定制</div>
    </v-scroolhead>
    <section class="D-banner">
      <img src="../../images/banner@2x.png" alt=" ">
    </section>
    <section class="D-required">
        <div class="required-item" @click="cityListDisplay">
            <div class="tit">
                <i>*</i>
                <span>所需城市</span>
            </div>
            <div class="list-items" :class="{active:cityListShow}">
                <span @click.stop="setCityList(item)" class="item"
                v-for="(item,index) in cityList"
                    :class="{
                       active: item.flag
                    }"
                >{{item.name}}</span>
            </div>
            <i class="ic-arrow" :class="{active:cityListShow}"></i>
        </div>
        <div class="required-item" @click="fieldtypeDisplay">
            <div class="tit">
                <i>*</i>
                <span>场地类型</span>
            </div>
            <div class="list-items" :class="{active:fieldtypeShow}">
                <span @click.stop="setCityList(item)" class="item"
                v-for="(item,index) in fieldtype"
                    :class="{
                       active: item.flag
                    }"
                >{{item.display_name}}</span>
            </div>
            <i class="ic-arrow" :class="{active:fieldtypeShow}"></i>
        </div>
        <div class="required-item special">
            <div class="tit">
                <i>*</i>
                <span>单场预算</span>
            </div>
            <div class="input-wrap"
            @click="focus( 'a' )" :class="{
                active:  focusA ,
                warning: single_field_budget!==undefined&&single_field_budget===''
            }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input  type="number" v-model="single_field_budget" maxlength="128" placeholder="请填写单场预算金额"  />

            </div>
            <i class="icon-unit">元/天</i>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>所需场地数</span>
            </div>
            <div class="input-wrap"
                @click="focus( 'b' )"
                :class="{
                    active: focusB ,
                    warning: number_of_fields!==undefined&&number_of_fields===''
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input class="" v-model="number_of_fields" type="text" maxlength="256" placeholder="请填写所需场地数" />
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>推广形式</span>
            </div>
            <div class="input-wrap"
              @click="focus( 'c' )"
                :class="{
                    active: focusC ,
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <popup-picker class="picker" value-text-align="left" :columns="2" :show-name="true"  placeholder="请选择"  v-model="spread_way_selected" :data="spreadWay"  ></popup-picker>
                <i class="ic-arrow"></i>
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>开始时间</span>
            </div>
            <div class="input-wrap"
                @click="focus( 'd' )"
                :class="{
                    active: focusD
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <datetime class="picker" v-model="start" placeholder="请选择"></datetime>
               <i class="ic-arrow"></i>
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>公司名称</span>
            </div>
            <div class="input-wrap"
                @click="focus( 'e' )"
                :class="{
                    active: focusE ,
                    warning: company!==undefined&&company===''
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input class="" v-model="company" type="text" maxlength="256" placeholder="请填写公司名称" />
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>产品名称</span>
            </div>
            <div class="input-wrap"
                 @click="focus( 'f' )"
                :class="{
                    active: focusF ,
                    warning: product!==undefined&&product===''
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input class="" v-model="product" type="text" maxlength="256" placeholder="请填写产品名称" />
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>联系人</span>
            </div>
            <div class="input-wrap"
                @click="focus( 'g' )"
                :class="{
                    active: focusG ,
                    warning: name!==undefined&&name===''
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input class="" v-model="name" type="text" maxlength="16" placeholder="请填写联系人" />
            </div>
        </div>
        <div class="required-item">
            <div class="tit">
                <i>*</i>
                <span>手机号码</span>
            </div>
            <div class="input-wrap"
                 @click="focus( 'h' )"
                :class="{
                    active: focusH ,
                    warning: mobile!==undefined&&mobile===''
                }">
                <img class="icon" src="../../images/ic_tips_red@2x.png">
                <input class="" v-model="mobile" type="number" maxlength="16" placeholder="请填写手机号" />
            </div>
        </div>

    </section>
    <section class="D-more"  :class="{active: showMore}">
        <span @click='inputMore'>更多需求信息填写</span>
        <i class="ic-arrow" @click='inputMore'></i>
    </section>
    <section v-if="showMore" class="D-optional">
        <section class="optional-fields">
            <div class="required-item">
                <div class="tit">
                <!-- <i>*</i> -->
                    <span>需求面积</span>
                </div>
                <div class="input-wrap"
                     @click="focus( 'i' )"
                    :class="{
                        active: focusI
                    }">
                    <img class="icon" src="../../images/ic_tips_red@2x.png" />
                   <input type="number" autocomplete="off" placeholder="最小面积" v-model.number="minimum_area">
                </div>
                <i class="icon-line"></i>
                <div class="input-wrap"
                   @click="focus( 'j' )"
                    :class="{
                        active: focusJ,
                        warning: maximum_area&&minimum_area&&minimum_area>maximum_area
                    }">
                    <img class="icon" src="../../images/ic_tips_red@2x.png" />
                    <input type="number" autocomplete="off" placeholder="最大面积" v-model.number="maximum_area">
                </div>
            </div>
            <!-- <div class="required-item">
                <div class="tit">
                    <span>地推频率</span>
                </div>
               <div class="input-wrap"
                    :class="{
                        active: pushing_frequency_level_id,
                    }">
                    <img class="icon" src="../../images/ic_tips_red@2x.png">
                    <popup-picker class="picker" value-text-align="left" :columns="2" :show-name="true"  placeholder="请选择"  v-model="pushing_frequency_level_selected" :data="pushFrequency"  ></popup-picker>
                    <i class="ic-arrow"></i>
                </div>
            </div> -->
            <div class="required-item">
                <div class="tit">
                    <span>周期偏好</span>
                </div>
                <div class="input-wrap"
                    @click="focus( 'k' )"
                    :class="{
                        active: focusK ,
                    }">
                    <img class="icon" src="../../images/ic_tips_red@2x.png">
                    <popup-picker class="picker" value-text-align="left" :columns="2" :show-name="true"  placeholder="请选择"  v-model="lease_term_type_selected" :data="leaseTermType"  ></popup-picker>
                    <i class="ic-arrow"></i>
                </div>
            </div>

        </section>
        <section class="optional-fields optional-service">
             <!-- 服务需求 -->
            <div class="required-item">
                <div class="tit">
                    <!-- <i>*</i> -->
                    <span>服务需求</span>
                </div>
                <div class="service-option line-two">
                    <div @click="setServive('power')" class="option" :class="{active: power}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>需用电</span>
                    </div>
                    <div @click="setServive('stay_overnight')" class="option" :class="{active: stay_overnight}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>物料过夜</span>
                    </div>
                    <div @click="setServive('establish')" class="option" :class="{active: establish}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>设计搭建</span>
                    </div>
                    <div @click="setServive('part_time_job')" class="option" :class="{active: part_time_job}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>需要兼职</span>
                    </div>
                </div>
            </div>
             <!-- 物料需求 -->
            <div class="required-item">
                <div class="tit">
                    <!-- <i>*</i> -->
                    <span>物料需求</span>
                </div>
                <div class="service-option">
                    <div @click="setServive('desk')" class="option" :class="{active: desk}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>桌子</span>
                    </div>
                    <div class="option-input" :class="{warning: desk&&!desk_size}">
                        <span>尺寸:</span>
                        <input v-model="desk_size" type='text' placeholder="例：2m*3m"  data-name="desk_size" data-prevname="desk"/>
                    </div>
                    <div @click="setServive('tent')" class="option" :class="{active: tent}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>帐篷</span>
                    </div>
                    <div class="option-input" :class="{warning: tent&&!tent_size}">
                        <span>尺寸:</span>
                        <input v-model="tent_size" type='text' placeholder="例：2m*3m"  data-name="desk_size" data-prevname="desk"/>
                    </div>
                    <div @click="setServive('backdrop')" class="option" :class="{active: backdrop}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>背景板</span>
                    </div>
                    <div class="option-input" :class="{warning: backdrop&&!backdrop_size}">
                        <span>尺寸:</span>
                        <input v-model="backdrop_size" type='text' placeholder="例：2m*3m"  data-name="desk_size" data-prevname="desk"/>
                    </div>
                    <div @click="setServive('leaflet')" class="option" :class="{active: leaflet}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>传单</span>
                    </div>
                    <div @click="setServive('gift')" class="option" :class="{active: gift}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>礼品</span>
                    </div>
                    <div @click="setServive('roll_up_banner')" class="option" :class="{active: roll_up_banner}">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>易拉宝</span>
                    </div>
                </div>
            </div>
             <!-- 消费水平 -->
            <div class="required-item">
                <div class="tit">
                    <!-- <i>*</i> -->
                    <span>目标用户<br/>消费水平</span>
                </div>
                <div class="service-option">
                    <div @click='setCityList(item)' class="option"
                        :class="{active: item.flag}" :key="index"
                        v-for="(item ,index) in consumptionLevel">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>{{item.display_name}}</span>
                    </div>

                </div>
            </div>
             <!-- 年龄层 -->
            <div class="required-item">
                <div class="tit">
                    <!-- <i>*</i> -->
                    <span>目标用户<br/>年龄层</span>
                </div>
                <div class="service-option">
                    <div @click='setCityList(item)' class="option"
                        :class="{active: item.flag}"
                        v-for="(item ,index) in ageLevel">
                        <icon class="ic-right" type="success-no-circle"></icon>
                        <span>{{item.display_name}}</span>
                    </div>
                </div>
            </div>
            <!-- 效果图 -->
            <div class="required-item item-upload-img">
                <div class="tit"  >
                    <!-- <i>*</i> -->
                    <span>效果图：</span>
                </div>
                <div class="btn-upload" @click="clickInput">
                    <div class="ic-upload"></div>
                    <span>上传往期效果图</span>
                </div>
            </div>
             <div class="img-box">
               <vUploadImg ref="vUpload" name="img3" :picArr="pic_url" max="12" region="z0" fileType="cert"></vUploadImg>
            </div>
            <!-- 备注 -->
            <div class="required-item">
                <div class="tit">
                <!-- <i>*</i> -->
                <span>备注</span>
                </div>
                <div class="remark-textarea">
                    <textarea v-model.trim="remarks" maxlength='1000' placeholder='其他服务及要求'></textarea>
                </div>
            </div>

        </section>
    </section>
    <section>
        <!-- 提交按钮 -->
        <div @click='submit' class="D-btn" hover-class='hover-class'>
            <span>帮我找场地</span>
        </div>
    </section>

    <!--https://aj4j3o.mlinks.cc/Ad7u-->
    <app-down :params="{}" link="https://aj4j3o.mlinks.cc/Ad7u"></app-down>
  </div>

</template>

<script>

import vScroolhead from 'src/components/vScroolhead';
import vUploadImg from 'src/components/vUploadImg';
import AppDown from 'src/components/AppDown.vue';
import { mapState, mapActions } from 'vuex';
import { PopupPicker,Picker, Icon,Datetime  } from 'vux';
import { getDefaultAppealsInfo,getCitys, getDemandInfo, getConfig, postDemand } from 'src/service/getData';
import { WORLD_HTML_REG, MOBILE_REG, POSITIVE_INT_REG, FLOAT_REG } from 'src/config/data';
import { setStorage, setSession, getStorage, getSession } from 'src/config/tools';
import { wxshare } from 'src/config/wechatShare';
export default {
    data() {
        return {

            single_field_budget: undefined, // 单场预算
            number_of_fields: undefined, // 所需场地数
            start: undefined, // 开始时间
            name: undefined, // 联系人
            mobile: undefined, // 手机号
            company: undefined, // 公司名
            product: undefined, // 产品名
            showMore: false,
            consumptionLevel: [],// 消费水平

            ageLevel: [],// 年龄层


            spreadWay: [],
            spread_way_selected: [],
            spread_way_id: undefined, // 推广形式id
            minimum_area: undefined, // 最低价
            maximum_area: undefined, // 最高价
            pushFrequency: [],//地推频率
            pushing_frequency_level_selected: [],
            pushing_frequency_level_id: undefined,
            leaseTermType: [],//规格偏好
            lease_term_type_selected: [],
            lease_term_type_id: undefined,
            cityList: [], // 开通城市
            cityListShow: false ,
            fieldtype: [], // 场地类型
            fieldtypeShow: false ,

            stay_overnight: false, // 过夜
            power: false, // 供电
            establish: false, // 设计搭建
            part_time_job:false,//是否需要兼职

            desk: false, // 桌子
            desk_size: '', // 桌子大小
            backdrop: false, // 背景板
            backdrop_size: '', // 背景板大小
            tent: false, // 帐篷
            tent_size: '', // 帐篷大小

            leaflet: false, // 传单
            roll_up_banner: false,// 易拉宝
            gift: false, // 礼品
            pic_url:[],//往期效果图
            remarks: undefined, //备注

          focusA : false , focusB : false , focusC : false , focusD : false , focusE : false ,
          focusF : false , focusG : false , focusH : false ,focusI : false ,focusJ : false ,focusK : false
        }
    },
    components: {
        PopupPicker,
        Picker,
        Icon,
        Datetime ,
        vUploadImg,vScroolhead , AppDown
    },
    beforeCreate(){
        this.$store.dispatch('refreshConfig');
    },
     created() {
      // 分享出去的链接 要检测是否登录，避免报错
       let login = getSession('login');
       if(!login){
         this.$router.push({ path : '/login' , query : { redirect : '/demand' } });
         return false ;
       }
    },

    mounted() {
        this.initData();
        wxshare({
          title: '【需求定制】只为您挑选场地',
          desc : '找不到合适的场地？选择恐惧症？无需担心，专人为你挑选',
          imgUrl : 'https://comment.linhuiba.com/Fvzp6E31LRVKuz8U2jW4MMMdpCO-' ,
          link :  window.location.origin + '?from=singlemessage'+ window.location.hash
        })
    },
    computed: {
        ...mapState([
            'config'
        ]),
    },
    filters: {

    },
    watch: {
        spread_way_selected: function(val, oldVal) {
            this.spread_way_id = val[0] * 1;
        },
        pushing_frequency_level_selected :function(val, oldVal) {
            this.pushing_frequency_level_id = val[0] * 1;
        },
        lease_term_type_selected :function(val, oldVal) {
            this.lease_term_type_id = val[0] * 1;
        },
        config:function(){
            let fieldtype=JSON.parse(JSON.stringify(this.config.fieldtype))
            this.fieldtype = fieldtype.map((item) => {
                item.flag = false
                return item
            });
        }
    },
    methods: {
        ...mapActions([
            'refreshConfig'
        ]),
        focus( n ){
        this.focusA = this.focusB = this.focusC = this.focusD = this.focusE = this.focusF = this.focusG = this.focusH = this.focusI = this.focusJ =this.focusK = false ;
        switch ( n ){
          case 'a':
            this.focusA = true ;
            break ;
          case 'b':
            this.focusB = true ;
            break ;
          case 'c':
            this.focusC = true ;
            break ;
          case 'd':
            this.focusD = true ;
            break ;
          case 'e':
            this.focusE = true ;
            break ;
          case 'f':
            this.focusF = true ;
            break ;
          case 'g':
            this.focusG = true ;
            break ;
          case 'h':
            this.focusH = true ;
            break ;
          case 'i':
            this.focusI = true ;
            break ;
          case 'j':
            this.focusJ = true ;
            break ;
          case 'k':
            this.focusK = true ;
            break ;
          default :
            break ;
        }
      },
        initData() {
          getDemandInfo().then(res => {
            console.log('getDemandInfo', res);
            this.consumptionLevel = this.changeSelectData(res.result.consumptionlevel);
            this.ageLevel = this.changeSelectData(res.result.agelevel);
            this.pushFrequency = this.changeData(res.result.pushfrequency);
            this.leaseTermType = this.changeData(res.result.appealleasetermtype).map((item) => {
                                    item.name = ''+item.name
                                    return item
                                });
            this.spreadWay = this.changeData(res.result.spreadway);
          }).catch(err => {});
          getCitys().then(res => {
            this.cityList = res.result.cities.map((item) => {
                item.flag = false
                return item
            });
          }).catch(err => {});
          getDefaultAppealsInfo().then(res=>{
            let { company, product, name, mobile } = res.result;
            if (company) this.company = company;
            if (product) this.product = product;
            if (name) this.name = name;
            if (mobile) this.mobile = mobile;
          }).catch(err => {})
        },
        inputMore() {
            this.showMore = !this.showMore
        },
        setCityList(item) {
            // //console.log(item)
            item.flag = !item.flag
        },
        cityListDisplay() {
            this.cityListShow = !this.cityListShow
        },
        fieldtypeDisplay() {
            this.fieldtypeShow = !this.fieldtypeShow
        },
        setServive(name) {
            this[name] = this[name] == 0 ? 1 : 0;
        },
        changeData(obj) {
            let arr = [];
            for (let item of obj) {
                arr.push({
                    name: item.display_name + '',
                    value: item.id + '',
                    parent: 0,
                });
                if (item.selected_children) {
                    for (let children of item.selected_children) {
                        arr.push({
                            name: children.display_name + '',
                            value: children.id + '',
                            parent: item.id + '',
                        });
                    }

                }
            }
            return arr;
        },
        changeSelectData(obj) {
            for (let item of obj) {
                Object.assign(item, { "flag": false });
            }
            return obj;
        },
        getPicUrlArr(arr){
          this.pic_url=[...this.pic_url,...arr]
        },
        clickInput(){
          this.$refs.vUpload.selectImg();
        },
        submit() {
            // 检测数据是否正常
            let {
                single_field_budget, number_of_fields, start,
                name, // 联系人
                mobile, // 手机号
                company, // 公司名
                product, // 产品名
                consumptionLevel,// 消费水平
                ageLevel,// 年龄层
                spreadWay,
                spread_way_id, // 推广形式id
                minimum_area, // 最低价
                maximum_area, // 最高价
                pushing_frequency_level_id,
                lease_term_type_id,
                cityList, // 开通城市
                fieldtype, // 场地类型
                stay_overnight, // 过夜
                power, // 供电
                establish, // 设计搭建
                part_time_job,
                desk, // 桌子
                desk_size, // 桌子大小
                backdrop, // 背景板
                backdrop_size, // 背景板大小
                tent, // 帐篷
                tent_size, // 帐篷大小
                leaflet, // 传单
                roll_up_banner,// 易拉宝
                gift, // 礼品
                pic_url=[],
                remarks //备注
            } = this.$data;
            let data = {name, mobile,company, product, spread_way_id};
            // 城市、场地类型
            let [city_id = [], field_type_id = [], consumption_level_id = [], age_level_id = []] = [];
            //城市
            for (let item of cityList) {
                if (item.flag) {
                    city_id.push(item.id)
                }
            }
            if (city_id.length) {
                data.city_id = JSON.stringify(city_id)
            }else{
                this.$vux.toast.text('请选择城市', 'middle');
                return;
            }
            // 场地类型
            for (let item of fieldtype) {
                if (item.flag) {
                    field_type_id.push(item.field_type_id)
                }
            }
            if (field_type_id.length) {
                data.field_type_id = JSON.stringify(field_type_id)
            } else {
                this.$vux.toast.text('请选择场地类型', 'middle');
                return;
            }
            // 单场预算
            if (single_field_budget){
              if( FLOAT_REG.test(single_field_budget) ){
                data.single_field_budget = single_field_budget
              }else{
                this.$vux.toast.text('单场预算必须为整数或者小数', 'middle');
                return;
              }

            } else  {
                this.single_field_budget = '';
                this.$vux.toast.text('请填写单场预算', 'middle');
                return;
            }
            // 所需场地数
            if (number_of_fields){
                if( !POSITIVE_INT_REG.test(number_of_fields) ){
                  this.$vux.toast.text('您填写的场地数必须为整数', 'middle');
                  return;
                }else{
                  data.number_of_fields = +number_of_fields ;
                }
            }else {
                this.number_of_fields = '';
                this.$vux.toast.text('请填写所需场地数', 'middle');
                return;
            }
            //
            if (spread_way_id){
                data.spread_way_id = spread_way_id
            } else{
                this.spread_way_id = '';
                this.$vux.toast.text('请选择推广形式', 'middle');
                return;
            }
            if (start){
                data.start = start
            } else{
                this.start = '';
                this.$vux.toast.text('请选择开始时间', 'middle');
                return;
            }

            if (name===undefined || WORLD_HTML_REG.test(name)) {
                this.$vux.toast.text('请输入正确的联系人信息', 'middle');
                return
            }

            if (!MOBILE_REG.test(+mobile)) {
                this.$vux.toast.text('请输入正确的手机号', 'middle');
                return
            }
            if (company===undefined||WORLD_HTML_REG.test(company)) {
                this.$vux.toast.text('请输入正确的公司名称信息', 'middle');
                return
            }
            if (product===undefined||WORLD_HTML_REG.test(product)) {
                this.$vux.toast.text('请输入正确的产品名信息', 'middle');
                return
            }

            if (maximum_area && minimum_area) {
                if (minimum_area * 1 > maximum_area * 1) {
                     this.$vux.toast.text('最小面积大于最大面积,请重新输入', 'middle');
                    return;
                }
            }
          if(minimum_area){
            data['minimum_area'] = minimum_area;
          }
          if(maximum_area){
            data['maximum_area'] = maximum_area;
          }
            if(pushing_frequency_level_id){
                data['pushing_frequency_level_id'] = pushing_frequency_level_id;
            }
            if(lease_term_type_id){
                data['lease_term_type_id'] = lease_term_type_id;
            }

            // 消费水平
            for (let item of consumptionLevel) {
                if (item.flag) {
                    consumption_level_id.push(item.id)
                }
            }
            if (consumption_level_id.length) {
                data.consumption_level_id = JSON.stringify(consumption_level_id)
            }
            // 年龄层
            for (let item of ageLevel) {
                if (item.flag) {
                    age_level_id.push(item.id)
                }
            }
            if (age_level_id.length) {
                data.age_level_id = JSON.stringify(age_level_id)
            }
            if (desk) {
                if(desk_size){
                    data['desk'] = desk;
                    data['desk_size'] = desk_size; // 桌子大小
                }else{
                    this.$vux.toast.text('请输入桌子尺寸', 'middle');
                    return;
                }
            }
            if (tent) {
                if(tent_size){
                    data['tent'] = tent;
                    data['tent_size'] = tent_size; // 帐篷大小
                }else{
                    this.$vux.toast.text('请输入帐篷尺寸', 'middle');
                    return
                }
            }
            if (backdrop) {
                if(desk_size){
                    data['backdrop'] = backdrop;
                    data['backdrop_size'] = backdrop_size; // 桌子大小
                }else{
                    this.$vux.toast.text('请输入背景板尺寸', 'middle');
                    return
                }
            }
            // 电、过夜、设计
            if (power) {
                data.power = +power
            }
            if (stay_overnight) {
                data.stay_overnight = +stay_overnight
            }
            if (establish) {
                data.establish = +establish
            }
            if (part_time_job) {
                data.part_time_job = +part_time_job
            }
            // 传单、礼品、易拉宝
            if (leaflet) {
                data.leaflet = +leaflet
            }
            if (gift) {
                data.gift = +gift
            }
            if (roll_up_banner) {
                data.roll_up_banner = +roll_up_banner
            }
            if(pic_url.length){
                data.pic_url = JSON.stringify(pic_url)
            }
             if (remarks) {
                data.remarks = remarks
            }

            postDemand(data).then(res => {
              this.$vux.toast.show({
                  text: '成功',
                  type: 'success',
                  width: '25%'
              });
              let id = res.result.id ;
              let city = res.result.city ;
              let field_type = res.result.field_type ;
              this.$router.push({ path : '/demand/success' , query: { id : id , city: city , field_type : field_type  } });
            }).catch(err => {
              this.$vux.toast.text(err.msg);
            })

        }

    }
}

</script>

<style lang="scss">
@import "../../style/mixin";

// 重置时间选择 placholder
.vux-datetime-value{
    color:#999;
}

/* flex */

@mixin flex() {
    display: flex;
}

@mixin f-DAJ($direction:row, $align:stretch, $justify:flex-start) {
    display: flex;
    flex-direction: $direction;
    align-items: $align;
    justify-content: $justify
}


/*
  箭头
*/

@mixin arrow($direction:up, $size:0.18rem, $color:#999) {
    @include wh($size, $size);
    @include bl-1px($color);
    @include bb-1px($color);
    transition: all 0.3s;
    display: inline-block;
    @if ($direction=='up') {
      transform:translateY(0.04rem) rotateZ(135deg);
    }
    @else if($direction=='down') {
      transform: translateY(-0.02rem) rotateZ(-45deg);
    }
    @else if($direction=='left') {
        transform: rotateZ(45deg);
    }
    @else if($direction=='right') {
        transform: rotateZ(-135deg);
    }
}



/*
  横线
*/

@mixin line($width:0.18rem, $color:#999, $height:0.02rem) {
    @include wh($width, $height);
    display: inline-block;
    background: $color;
}


.D-banner {
  @include wh(7.5rem, 3.68rem);
  >img{
    @include wh(7.5rem, 3.68rem);
  }
}

.D-required,
.optional-fields {
    background: #fff; // @include f-DAJ(column, center, center);
    box-sizing: border-box;
    padding: 0.30rem 0.52rem 0.40rem 0.36rem;
    .required-item {
        min-height: 0.80rem;
        height: auto;
        @include wh(100%, auto);
        @include f-DAJ(row, center);
        margin-top: 0.30rem;
        .tit {
            margin-top: 0.26rem;
            align-self: flex-start;
            width: 1.6rem;
            @include sc(0.24rem, #666);
            @include f-DAJ(row, center);
            &.two-line {
                margin: 0;
            }
            i {
                color: $red;
                margin-right: 0.06rem;
            }
        }
        i.icon-placeholder {
            width: 0.30rem;
        }
        i.ic-arrow {
           align-self: flex-start;
           margin-top: 0.25rem;
           @include arrow(down, 0.16rem, #666);
           &.active{
            transform: rotateZ(135deg);
           }
         }
         .list-items{
           height: .80rem;
           display: flex;
           flex-wrap: wrap;
           flex:1;
           overflow: hidden;
            &.active {
                height: auto;
            }
           .item{
             display: flex;
             align-items: center;
             height:.72rem;
             padding: 0 .20rem;
             border:1px solid #979797;
             border-radius:0.08rem;
             margin:0 .20rem .20rem 0;
             &.active{
               border:1px solid $mainColor;
               background: $mainColor;
               color:#fff;
             }
           }
         }
        .input-wrap {
            background: #F1F2F7;
            border-radius: 0.08rem;
            box-sizing: border-box;
            @include f-DAJ(row, center);
            @include wh(auto, 0.80rem);
            flex: 1;
            &.input-wrap-two {
                width: 2.4rem;
            }
            &.active {
                background: transparent;
                border: 1px solid $mainColor;
            }
            &.warning {
                background: transparent;
                border: 1px solid $red;
                .icon {
                    margin: 0 0.10rem;
                    visibility: visible;
                }
                .placeholder-active {
                    color: $red;
                }
            }
            .icon {
                margin: 0;
                transition: all 0.3s;
                visibility: hidden;
                @include wh(0.32rem, 0.32rem);
            }
            .picker,
            input {
                flex: 1;
                width: 100%;
                height: 0.78rem;
                @include sc(0.28rem, $fontColor);
            }
            .picker {
                line-height: 0.78rem;
                &:before{
                    display:none;
                }
            }
            i.ic-arrow {
                margin-right: 0.25rem;
                @include arrow(down, 0.16rem, #666);
            }
        }
      &.special{
        .input-wrap{
         flex: 0.95;
          margin-right: 0.2rem;
        }
      }
    }
}

.D-more {
    background: #fff;
    @include f-DAJ(row, center, flex-end);
    @include wh(100%, 0.80rem);
    @include sc(0.22rem, $mainColor);
    padding: 0 0.52rem 0.40rem 0rem;
    box-sizing: border-box;
    transition: all 0.3s;
    &.active {
        margin-bottom: 0.20rem;
        i.ic-arrow {
            @include arrow(up, 0.12rem, $mainColor);
        }
    }
    span {}
    i.ic-arrow {
        margin: 0 0.16rem;
        @include arrow(down, 0.12rem, $mainColor);
    }
}

.D-optional {
    // height: 0; // height: 0;
    transition: all 0.3s;
    overflow: hidden;
    margin-top: 0.20rem;
    height: auto;
    .optional-fields {
        background: #fff;
        transition: all 0.3s;
        box-sizing: border-box;
        padding: 0.30rem 0.52rem 0.40rem 0.36rem;

        .required-item {
            i.icon-line {
                margin: 0 0.20rem;
                @include line(0.30rem, #999);
            }
            i.icon-unit {
                width: 0.52rem;
                text-align: right;
                @include sc(0.32rem, #666);
            }
            .tit {
                // margin-top: 0.26rem;
                // align-self: center;
                span {
                    line-height: 0.36rem;
                }
            }
            &.required-city {

                .input-wrap {
                    padding: 0.10rem;
                    min-height: 0.80rem;
                    height: auto;
                    position: relative;
                    &.active {
                        background: #F1F2F7;
                    }
                    .input-items {
                        height: auto;
                        flex: 1;
                        display: flex;
                        flex-wrap: wrap;
                        &>span{
                            color:#999;
                        }
                        text {
                            @include sc(0.22rem, #999);
                        }
                        div.input-item {
                            @include sc(0.24rem, $fontColor);
                            @include wh(1.28rem, 0.44rem);
                            @include f-DAJ(row, center); // @include one-ellipsis;
                            border-radius: 0.08rem;
                            background: #fff;
                            margin: 0.10rem 0.08rem;
                            box-shadow: 0.05rem 0.05rem 0.05rem #ccc;
                            span {
                                text-align: center;
                                @include one-ellipsis();
                                flex: 1;
                            }
                            img.icon {
                                visibility: visible;
                                @include wh(0.38rem, 0.38rem);
                            }
                        }
                    }
                    i.ic-arrow {
                        &.active {
                            @include arrow(up, 0.16rem, $mainColor);
                        }
                    }
                    .city-list {
                        overflow: auto;
                        position: absolute;
                        z-index: 2;
                        bottom: -0.10rem;
                        left: 0;
                        background: #fff;
                        @include wh(5.0rem, 3.60rem);
                        transform: translateY(100%);
                        box-shadow: 0rem 0rem 0.10rem #ccc;

                        .city-item {
                            margin: 0 0.25rem;
                            height: 0.70rem;
                            @include f-DAJ(row, center, space-between);
                            .tit {
                                @include sc(0.24rem, $fontColor);
                                &.active {
                                    color: $mainColor;
                                }
                            }
                            .ic-right {
                                @include sc(0.30rem, $mainColor);
                            }
                        }
                    }
                }
            }
        } // 服务需求
        &.optional-service {
            margin-top: 1px;
            padding-bottom: 0.60rem;
            .required-item {
                min-height: 0.80rem;
                height: auto;
                .tit {
                    margin-top: 0.26rem;
                    align-self: flex-start;
                }
                .service-option {
                    flex: 1;
                    @include sc(0.28rem, $fontColor);
                    @include f-DAJ(row, center);
                    flex-flow: wrap;
                    &.line-two{
                        .option{
                            width: 2.20rem;
                        }
                    }
                    div.option {
                        width: 1.64rem;
                        height: 0.80rem;
                        @include f-DAJ(row, center);
                        .ic-right {
                            @include sc(0.26rem, #fff);
                            @include wh(0.3rem, 0.3rem);
                            background: #eee;
                            margin-right: 0.1rem;
                            border-radius: 0.04rem;
                            text-align: center;
                            line-height: 0.3rem;
                            &:before {
                                margin: 0;
                            }
                        }
                        &.active {
                            .ic-right {
                                background: $mainColor;
                            }
                        }
                    }
                    .option-input {
                        width: 3.20rem;
                        @include f-DAJ(row, center, center);
                        &.warning {
                            span {
                                color: $red
                            }
                            input {
                                // @include bb-1px($red);
                                border-color: $red;
                            }
                        }

                        span {
                            width: 0.84rem;
                        }
                        input {
                            width: 2.00rem; // @include bb-1px(#eee);
                            border-bottom: 1px solid #eee;
                        }
                    }
                }
                .remark-textarea {
                    box-sizing: border-box;
                    padding: 0.20rem;
                    border-radius: 0.08rem;
                    background: #F1F2F7;
                    margin-top: 0.26rem;
                    @include wh(5.10rem, 2.08rem);
                    textarea {
                        @include wh(100%, 100%);
                        @include sc(0.28rem, $fontColor);
                    }
                }
            }
        }
    }

    .optional-service {
        .item-upload-img{

          .btn-upload{
            flex:1;
            @include f-DAJ(row, center);
            @include sc(0.24rem, $mainColor);
            position: relative;
            .ic-upload{
                border:none;
              @include wh(0.44rem, 0.44rem);
              @include bg-image( '../../images/ic_upload_three' );
            }
            .file{
                @include wh(100%,100%);
                position: absolute;
                z-index:2;
                // background:#000;
                opacity:0;
            }
          }
        }
        .item-pictures{
          display: flex;
          flex-wrap:wrap;
          .item-pic{
            background: $bgc;
            margin:0 0.20rem 0.20rem 0;
             @include wh(2.00rem, 2.00rem);
          }
        }
      .img-box{
        padding-left: 1.6rem;
      }
    }
}

.D-btn {
    background: #fff;
    padding-bottom: 0.74rem;
    @include f-DAJ(row, center, center);
    span {
        background: $mainColor;
        border-radius: 0.08rem;
        @include f-DAJ(row, center, center);
        @include wh(6.46rem, 1.00rem);
        @include sc(0.34rem, #fff);
    }
}
</style>
