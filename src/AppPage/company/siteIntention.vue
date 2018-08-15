<template lang="html">
  <div class="company" v-show="isFinishLoad">
      <app-head birght-back="siteIntentionBack" brige-prop="返回app" isFixed="true" shortenHead="true">
        <div slot="center-part">场地意向</div>
      </app-head>
      <section class="C-main" v-show="hiddenCompany == undefined">
        <ul class="C-list">
          <!-- <li class="C-item no-angle">
            <span class="tit"><i class="require-icon">*</i>公司名称</span>
            <input class="input" type="text" v-model="companyInfo.company" placeholder="请输入公司名称" maxlength="100"/>
          </li> -->
          <router-link :to="{name: 'appIndustry', query: {type: '0'}}" >
            <li class="C-item bt1">
              <span class="tit"><i class="require-icon">*</i>主行业</span>
              <input class="checkUserAttr" placeholder="请选择主行业" disabled v-model="mainIndustry.display_name">
                <!-- <popup-picker class="picker" title="行业选择" value-text-align="left" :columns="2" :show-name="true"  :placeholder="companyInfo.industry_name||'请选择'"  v-model="industry_selected" :data="industry"  @on-change="chooseIndustry"></popup-picker> -->
            </li>
          </router-link>
          <router-link :to="{name: 'appIndustry', query: {type: '1'}}" >
            <li class="C-item ">
              <span class="tit">副行业</span>
              <input class="checkUserAttr" placeholder="请选择副行业，可多选" disabled v-model="deputyIndustryStr">
            </li>
          </router-link>
          <li class="C-item no-angle bt1">
            <span class="tit">产品名称</span>
            <input class="checkUserAttr" type="text" v-model.trim="product" placeholder="请输入产品名称" maxlength="100" @input="storeProduct"/>
          </li>
          <router-link :to="{name: 'appCompanyChoseCity'}" >
            <li class="C-item">
              <span class="tit">城市选择</span>
              <input class="checkUserAttr" placeholder="请选择所需要的城市" disabled v-model="citySelectionStr">
            </li>
          </router-link>
          <li class="C-item" @click="choseSite()">
            <span class="tit">场地类型</span>
            <input class="checkUserAttr" placeholder="不限" disabled v-model="stringSiteType">
          </li>

          <li class="C-item no-angle item-two">
            <span class="tit">需求面积<span class="area-unit">(m<sup>2</sup>)</span></span>
            <div>
              <input class="twoCheckUserAttr" placeholder="最小面积" type="number" v-model.trim="minArea" @input="handleAreaAndPrice">
              <span class="link-bar">—</span>
              <input class="twoCheckUserAttr" placeholder="最大面积" type="number" v-model.trim="maxArea" @input="handleAreaAndPrice">
            </div>
            <!-- <input class="checkUserAttr" type="text" v-model.trim="product" placeholder="请输入产品名称" maxlength="100" @input="storeProduct"/> -->
          </li>
          <li class="C-item no-angle item-two">
            <span class="tit">价格区间<span class="area-unit">(元)</span></span>
            <div>
              <input class="twoCheckUserAttr" placeholder="最低价" type="number" v-model.trim="minPrice" @input="handleAreaAndPrice">
              <span class="link-bar">—</span>
              <input class="twoCheckUserAttr" placeholder="最高价" type="number" v-model.trim="maxPrice" @input="handleAreaAndPrice">
            </div>
          </li>

          <li class="C-item no-angle item-two">
           <span class="tit">推广方式</span>
           <div class="tags consumption-level-tags">
              <div @click="selectedItem(item, '3')" class="tag"
                :class="{ active : item.flag }" :key="index"
                v-for="(item,index) in spreadway">{{item.display_name}}</div>
            </div>
            <!-- <popup-picker value-text-align="left" :columns="1" :show-name="true" title="推广形式" :placeholder="companyInfo.spread_way ? companyInfo.spread_way.spread_way : ''" :data="spreadway" v-model="spread_way_id" @on-change="changeSpreadWay"></popup-picker> -->
          </li>
           <!-- <li class="C-item no-angle">
            <span class="tit">需求面积</span>
            <input class="input deman-input" type="number"  v-model.number="companyInfo.demand_area" placeholder="请输入常用摆摊面积" maxlength="16"/>
            <span class="tit">m²</span>
          </li> -->
          <li class="C-item no-angle item-two">
            <span class="tit">地推频率</span>
            <div class="push-rate ">
              <div @click.stop="selectedItem(item, '0')" class="radios" :key="index"
                v-for="(item,index) in pushfrequency">
                <input type="radio"  name="type"  :checked="item.flag" />
                <label >{{ item.display_name }}</label>
              </div>
            </div>
            <!-- <input class="checkUserAttr" placeholder="不限" disabled> -->
          </li>

          <li class="C-item no-angle item-two">
            <span class="tit">目标人群性别倾向</span>
            <div class="push-rate ">
              <div @click="selectedItem(item, '1')" class="male" :key="index"
                v-for="(item,index) in targetGender">
                <input type="radio" :id="item.display_name" name="male"  :checked="item.flag" />
                <label :for="item.display_name">{{ item.display_name }}</label>
              </div>
            </div>
          </li>

           <!-- <li v-if="companyInfo.pushing_frequency_level&&companyInfo.pushing_frequency_level" class="C-item">
            <popup-picker value-text-align="left" :columns="1" :show-name="true" title="频　　率" :placeholder="companyInfo.pushing_frequency_level.display_name" :data="pushfrequency" v-model="pushfrequency_id" @on-change="changePushingFrequencyLevel"></popup-picker>
          </li> -->
           <!-- <li class="C-item no-angle item-two">
            <span class="tit">单场接受的价格区间</span>
            <div class="tags price-area">
              <input class="input price-input" type="number" v-model.number="companyInfo.acceptable_minimum_price" placeholder="最低价" maxlength="16"/>-
              <input class="input price-input" type="number" v-model.number="companyInfo.acceptable_maximum_price" placeholder="最高价" maxlength="16"/>
              <span class="tit">m²</span>
            </div>

          </li> -->
          <li class="C-item no-angle item-two">
            <span class="tit">目标人群消费水平</span>
            <div class="tags consumption-level-tags">
              <div @click="selectedItem(item, '2')" class="tag"
                :class="{ active : item.flag }" :key="index"
                v-for="(item,index) in consumptionLevel">{{item.display_name}}</div>
            </div>
          </li>

          <!-- <li class="C-item no-angle item-two">
            <span class="tit">年龄层</span>
            <div class="tags age-level-tags">
              <span class="tag" :class="{ active : item.flag }" v-for="item in agelevel" :key="item.id" @click="selectedItem( item )">{{ item.display_name }}</span>
            </div>
          </li> -->
          <li class="C-item no-angle item-two">
            <span class="tit">外包项目</span>
            <div class="tags consumption-level-tags">
              <div @click="selectedItem(item, '4')" class="tag"
                :class="{ active : item.flag }" :key="index"
                v-for="(item,index) in outsourcingProject">{{item.display_name}}</div>
            </div>
          </li>
           <!-- <li class="C-item no-angle item-two">
            <span class="tit">其他用户特征</span>
            <textarea class="textarea" v-model="companyInfo.feature_description" placeholder="其他需求"  maxlength="2000"></textarea>
          </li> -->
          <li class="C-item no-angle item-two pt10" v-show="isIos">
            <span class="tit">活动案例</span>
            <div class="file-upload upload-file">
              <span class="upload-icon" @click.stop="chooseFileType" v-if="!fileUrls.length"></span>
              <div class="file-box" v-show="chooseUpload">
                <vUploadFile ref="vfileUpload" uploadId="file" :fileUrls="fileUrls"></vUploadFile>
              </div>
              <span class="upload-file-tip">(限PDF/WORD/Excel/PPT格式，不能超过8M)</span>
            </div>
          </li>
          <li class="C-item no-angle item-two pt10">
            <span class="tit">案例图片</span>
            <div class="upload-file">
              <vUploadImg name="img2" :picArr="chooseImages" max=5 region='z0' fileType="cert"></vUploadImg>
              <span class="upload-file-tip">(最多可上传5张照片)</span>
            </div>
          </li>
           <!-- <li class="C-item no-angle item-two">
            <span class="tit">上传营业执照<span class="txt">(仅可穿1张)</span></span>
            <div class="">
               <vUploadImg name="img1" :picArr="cert_url" max=1 region='z0' fileType="cert"></vUploadImg>
            </div>
          </li> -->

           <li v-show="is_food_induatry" class="C-item no-angle item-two pt10">
            <span class="tit">安全许可证</span>
            <!-- <div class="tags field-image">
              <img v-for="(item,index) in companyInfo.food_safety_license" :src="item" />
              <div v-show="companyInfo.food_safety_license&&companyInfo.food_safety_license.length<3" class="ic-camera">
              </div>
            </div> -->
             <div class="upload-file">
              <vUploadImg name="img3" :picArr="foodSafetyLicense" max=5 region='z0' fileType="cert"></vUploadImg>
              <span class="upload-file-tip">(最多可上传5张照片)</span>
            </div>
          </li>
          <li class="C-item no-angle item-two">
            <span class="tit">额外需求</span>
            <div class="tags consumption-level-tags">
              <div @click="selectedItem(item, '5')" class="tag"
                :class="{ active : item.flag }" :key="index"
                v-for="(item,index) in additional_requirement">{{item.display_name}}</div>
            </div>
          </li>
          <li class="C-item no-angle item-two bt0">
            <!-- <span class="tit">其他用户特征</span> -->
            <textarea class="textarea" @input="saveRequirement" v-model="other_requirement"  maxlength="2000"></textarea>
          </li>
        </ul>
        <div @click="save"  class="save" >保存</div>
      </section>

       <transition name="router-slid" mode="out-in">
        <router-view @industry="chooseIndustry"></router-view>
      </transition>


      <div v-transfer-dom>
        <popup v-model="showSiteType" position="right">
          <div class="siteChose">
            <p class="title">场地类型</p>
            <p class="allChose">不限场地类型 <x-switch title="" v-model="allChoseSite"></x-switch></p>
            <p class="choseItem">需特定场地类型：</p>
            <div class="specificVenue">
              <div v-for="(item, index) in siteType" :class="allChoseSite ? 'specificVenue-item' : item.flag ? 'active' : 'normal'" @click="selectSites(item)">
                <span>{{ item.display_name }}</span>
              </div>
            </div>
            <div class="sureSelect">
              <span class="cancelSite" @click="choseSite">取消</span>
              <span class="surelSite" @click="submitSite">确定</span>
            </div>
          </div>
        </popup>
      </div>

  </div>
</template>
<script>
import appHead from 'src/components/appHead.vue';
import vUploadImg from 'src/components/vUploadImg';
import vUploadFile from 'src/components/vUploadFile.vue' ;
import { Icon, PopupPicker, Popup, TransferDom, XSwitch  } from 'vux'
import { mapState, mapActions } from 'vuex'
import { getCompanyInfo, getDemandInfo, postCompanyInfo ,getIndustry, getFieldType, getCityLists } from 'src/service/getData';
import { getStorage, getSession } from 'src/config/tools';
import { twoPoint } from 'src/filters';
import { setupWebViewJavascriptBridge } from 'src/config/tools';
import { isMobile } from 'src/config/isMobile';

export default {
  data() {
    return {
      isFinishLoad: false,
      hiddenCompany: this.$route.query.type,
      active: true,
      chooseUpload: false,
      allChoseSite:false,
      info: {},
      product: '',
      companyInfo: {},
      agelevel: [],
      pushfrequency: [], // 地推频率
      pushfrequency_id:[],
      leasetermtype: [],
      spreadway: [],
      outsourcingProject: [], // 外包项目
      additional_requirement: [], // 额外需求
      targetGender: [{id: 0, display_name: '不限',flag:false},{id: 1, display_name: '男',flag:false},{id: 2, display_name: '女',flag:false}],
      consumptionLevel: [], // 消费水平
      spread_way_id: [], // 推广形式id
      catering_industry_id:[],
      is_food_induatry:'',
      industry: [],//行业
      mainIndustry: [], // 主行业
      industry_id:undefined,
      industry_selected: [],//选择的行业 父、子级ids  [parentid,children]
      qiniuToken: '',
      chooseImages: [],
      cert_url:[],
      deputyIndustryStr: '', // 副行业字符串
      deputyIndustry: [], // 副行业数组
      citySelectionStr: '',
      citySelection: [],
      siteType: [],
      hadChoseSiteType: [],
      stringSiteType: '',
      showSiteType: false,
      fileUrls: [],
      foodSafetyLicense: [],
      other_requirement: '',
      isIos: false,
      minArea: '',
      maxArea: '',
      minPrice: '',
      maxPrice: '',
    }
  },
  components: {appHead, Icon, PopupPicker ,vUploadImg, Popup, XSwitch, vUploadFile},
  filters: {
    twoPoint
  },
  directives: {
    TransferDom
  },
  watch:{
    fileUrls (oldValue, newValue) {
      let arr = this.fileUrls
      this.$store.dispatch('setSiteIntentionProgrammeActivites', arr)
    },
    chooseImages (oldValue, newValue) {
      let arr = this.chooseImages
      this.$store.dispatch('setSiteIntentionActivitesImages', arr)
    },
    foodSafetyLicense (oldValue, newValue) {
      let arr = this.foodSafetyLicense
      this.$store.dispatch('setSiteIntentionFoodSafeImages', arr)
    }
  },
  computed: {
    ...mapState([
      'userProfile',
      'siteIntention',
      'setSiteIntentionChoseSiteType',
    ]),
  },
  beforeMount () {
    this.isFinishLoad = true
  },
  async mounted() {
    await this.initData()
    if (this.siteIntention && this.siteIntention.deputyIndustry && this.siteIntention.deputyIndustry.select) {
        this.deputyIndustry = this.siteIntention.deputyIndustry.select
        this.siteIntention.deputyIndustry.select.forEach((item, index) => {
        this.deputyIndustryStr += index == this.siteIntention.deputyIndustry.select.length-1 ? `${item.display_name}` : `${item.display_name},`
        })
    }
    if (this.siteIntention.mainIndustry) {
      this.mainIndustry = this.siteIntention.mainIndustry
    }

    if (this.siteIntention.areaAndPrice && this.siteIntention.areaAndPrice.minArea) {
      this.minArea = this.siteIntention.areaAndPrice.minArea
    }
    if (this.siteIntention.areaAndPrice && this.siteIntention.areaAndPrice.maxArea) {
      this.maxArea = this.siteIntention.areaAndPrice.maxArea
    }
    if (this.siteIntention.areaAndPrice && this.siteIntention.areaAndPrice.minPrice) {
      this.minPrice = this.siteIntention.areaAndPrice.minPrice
    }
    if (this.siteIntention.areaAndPrice && this.siteIntention.areaAndPrice.maxPrice) {
      this.maxPrice = this.siteIntention.areaAndPrice.maxPrice
    }


    if (this.siteIntention.other_requirement) {
      this.other_requirement = this.siteIntention.other_requirement
    }
    if (this.siteIntention.additional_requirement) {
      this.additional_requirement = this.siteIntention.additional_requirement
    }
    if (this.siteIntention.outsourcingProject) {
      this.outsourcingProject = this.siteIntention.outsourcingProject
    }
    if (this.siteIntention.consumptionLevel) {
      this.consumptionLevel = this.siteIntention.consumptionLevel
    }
    if (this.siteIntention.pushfrequency) {
      this.pushfrequency = this.siteIntention.pushfrequency
    }
    if (this.siteIntention.targetGender) {
      this.targetGender = this.siteIntention.targetGender
    }
    if (this.siteIntention.spreadway) {
      this.spreadway = this.siteIntention.spreadway
    }
    if (this.siteIntention.programmeActivites) {
      this.chooseUpload = !this.chooseUpload
      this.fileUrls = this.siteIntention.programmeActivites
    }
    if (this.siteIntention.activitesImages) {
      this.chooseImages = this.siteIntention.activitesImages
    }
    if (this.siteIntention.foodSafeImages) {
      this.foodSafetyLicense = this.siteIntention.foodSafeImages
    }
    if (this.siteIntention && this.siteIntention.selectCitys && this.siteIntention.selectCitys.select) {
      this.allChoseSite = this.siteIntention.selectCitys.allSelect
      if (this.siteIntention.selectCitys.allSelect) {
        this.citySelectionStr = '不限'
        this.citySelection = [{id: 0}]
      } else {
        this.citySelection = this.siteIntention.selectCitys.select
        this.siteIntention.selectCitys.select.forEach((item, index) => {
          this.citySelectionStr += index == this.siteIntention.selectCitys.select.length - 1 ? `${item.name}` : `${item.name},`
        })
      }
    }
    if (this.siteIntention && this.siteIntention.selectSiteType && this.siteIntention.selectSiteType.select && this.siteIntention.selectSiteType._allChoseSiteCache) {
      this.hadChoseSiteType = this.siteIntention.selectSiteType.select
      this.siteType = this.siteIntention.selectSiteType._allChoseSiteCache
      if (this.siteIntention.selectSiteType.allSelect) {
        this.allChoseSite = true
        this.stringSiteType = '不限场地'
      } else {
        this.hadChoseSiteType.forEach((item, index) => {
          this.stringSiteType += index == this.hadChoseSiteType.length - 1 ? `${item.display_name}` : `${item.display_name},`
        })
      }
    } else {
      getFieldType().then(res => {
        this.siteType = this.changeSelectData(res.result)
        let {field_type} = this.companyInfo
        if (field_type[0] && field_type[0].id != 0)
        this.siteType.forEach(item => {
          field_type.forEach(item2 => {
            if (item2.display_name == item.display_name) {
              item.flag = !item.flag
              this.hadChoseSiteType.push(item)
            }
          })
        })
      })
    }
    if (this.siteIntention && this.siteIntention.product) {
      this.product = this.siteIntention.product
    }
  },
  methods: {
    ...mapActions([
      'getUserProfile',
      'setSiteIntentionProduct',
      'setSiteIntentionProgrammeActivites',
      'setSiteIntentionActivitesImages',
      'setSiteIntentionSpreadway',
      'setSiteIntentionPushfrequency',
      'setSiteIntentionTargetGender',
      'setSiteIntentionConsumptionLevel',
      'setSiteIntentionOutsourcingProject',
      'setSiteIntentionAdditionalRequirement',
      'setSiteIntentionOtherRequirement',
      'setSiteIntentionAreaAndPrice'
    ]),
    async initData() {
      await getCompanyInfo().then(res => {
        this.companyInfo = res.result;
        if(  res.result.cert_url ){
          this.cert_url = [this.companyInfo.cert_url+'']
        }
        getDemandInfo().then( async res => {
          // console.log(res)
          // this.info =JSON.parse(JSON.stringify(res.result))
          this.catering_industry_id =  res.result.catering_industry_id;
          if (!this.siteIntention.consumptionLevel) {
             this.consumptionLevel = this.changeSelectData(res.result.consumptionlevel);
          }
          this.agelevel = this.changeSelectData(res.result.agelevel);
          if (!this.siteIntention.pushfrequency) {
            this.pushfrequency = this.changeSelectData(res.result.pushfrequency);
          }
          if (!this.siteIntention.outsourcingProject) {
            this.outsourcingProject = this.changeSelectData(res.result.outsourcingprojects);
          }
          this.leasetermtype = this.changeData(res.result.leasetermtype);
          if (!this.siteIntention.spreadway) {
            this.spreadway = this.changeSelectData(res.result.spreadway);
          }
          if (!this.siteIntention.additional_requirement) {
            this.additional_requirement = this.changeSelectData(res.result.additional_requirement)
          }
          await this.choseLevel();
          this.isFoodInduatry()
          // console.log(this.pushfrequency)
        })
      }).catch(err => {
        this.$vux.toast.text(err.msg, 'middle')
      });
      getIndustry().then(res => {
        this.industry = res.result
      })
    },
    choseSite() {
      this.showSiteType = !this.showSiteType
    },
    changeDataTwo(obj) {
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
      choseLevel(){
      let {consumption_level,age_level, industry_id, industry_name, deputy_industry, city, field_type, spread_way, gender_tendency,outsourcing_projects, additional_requirement, activity_cases, product, pushing_frequency_level, images, food_safety_license, other_requirement, demand_area, demand_max_area, acceptable_minimum_price, acceptable_maximum_price} = this.companyInfo
      console.log(this.companyInfo)
      if (!this.siteIntention.consumptionLevel) {
        this.consumptionLevel.map(item=>{
          for(let value of consumption_level){
            if(value.id == item.id){
              item.flag=true ;
              break;
            }
          }
          return item
        })
      }
       this.agelevel.map(item=>{
        for(let value of age_level){
          if(value.id == item.id){
            item.flag=true ;
            break;
          }
        }
        return item
      })
      if (!this.siteIntention.mainIndustry) {
        this.mainIndustry= {display_name: industry_name, id: industry_id}
      }
      if (!this.siteIntention.deputyIndustry) {
        this.deputyIndustry = deputy_industry
        this.deputyIndustry.forEach((item, index) => {
          this.deputyIndustryStr += index == this.deputyIndustry.length-1 ? `${item.display_name}` : `${item.display_name},`
        })
      }
      if (!this.siteIntention.selectCitys) {
        if (city[0] && city[0].id == 0) {
          this.citySelectionStr = '不限'
          this.citySelection = [{id: 0}]
        } else {
          this.citySelection = city
          this.citySelection.forEach((item, index) => {
            this.citySelectionStr += index == this.citySelection.length - 1 ? `${item.name}` : `${item.name},`
          })
        }
      }
      if (!this.siteIntention.selectSiteType) {
        if (field_type[0] && field_type[0].id == 0) {
          this.allChoseSite = true
          this.stringSiteType = '不限场地'
        } else {
          this.hadChoseSiteType = field_type
          this.hadChoseSiteType.forEach((item, index) => {
            this.stringSiteType += index == this.hadChoseSiteType.length - 1 ? `${item.display_name}` : `${item.display_name},`
          })
        }
      }
      if (!this.siteIntention.activitesImages) {
        this.chooseImages = images
      }
      if (!this.siteIntention.product) {
        this.product = product
      }
      if (!this.siteIntention.foodSafeImages) {
        this.foodSafetyLicense = food_safety_license
      }
      if (!this.siteIntention.spreadway) {
        this.spreadway.forEach(item => {
          spread_way.forEach(item2 => {
            if (item2.spread_way == item.display_name) item.flag = !item.flag
          })
        }) 
      }
      if (gender_tendency != null && !this.siteIntention.targetGender) {
        this.targetGender.forEach(item => {
          if (item.id == gender_tendency) item.flag = !item.flag
        })
      }

      if (outsourcing_projects[0] && !this.siteIntention.outsourcingProject) {
        this.outsourcingProject.forEach(item => {
          outsourcing_projects.forEach(item2 => {
            if (item.display_name == item2.display_name) item.flag = !item.flag
          })
        })
      }
      
      if (!this.siteIntention.areaAndPrice || !this.siteIntention.areaAndPrice.minArea) {
        this.minArea = demand_area
      }
      if (!this.siteIntention.areaAndPrice || !this.siteIntention.areaAndPrice.maxArea) {
        this.maxArea = demand_max_area
      }
      if (!this.siteIntention.areaAndPrice || !this.siteIntention.areaAndPrice.minPrice) {
        this.minPrice = acceptable_minimum_price
      }
      if (!this.siteIntention.areaAndPrice || !this.siteIntention.areaAndPrice.maxPrice) {
        this.maxPrice = acceptable_maximum_price
      }

      if (additional_requirement[0] && !this.siteIntention.additional_requirement) {
        this.additional_requirement.forEach(item => {
          additional_requirement.forEach(item2 => {
            if (item.display_name == item2.display_name) item.flag = !item.flag
          })
        })
      }
      if (activity_cases[0] && !this.siteIntention.programmeActivites) {
        this.chooseUpload = true
        this.$set(this.fileUrls, 0, {filename: activity_cases[0].name, link: activity_cases[0].url})
      }
      if (pushing_frequency_level != null && !this.siteIntention.pushfrequency) {
        this.pushfrequency.forEach(item => {
          if (item.id == pushing_frequency_level.id) item.flag = !item.flag
        })
      }
      if (!this.siteIntention.other_requirement) {
        this.other_requirement = other_requirement
      }
    },
    chooseIndustry(e){
      let industry_id =  e[1]?e[1] * 1:e[0] * 1;
      this.companyInfo.industry_id =industry_id
      for (let item of this.industry) {
          if(industry_id==item.id){
            this.companyInfo.industry_name = item.name;
            break;
          }
      }
      this.isFoodInduatry()
    },
    selectedItem(item ,type){
      if (type === '0') {
        if (!item.flag) {
          this.pushfrequency.forEach(val => {
            val.flag = false
          })
        }
        let arr = this.pushfrequency
        this.$store.dispatch('setSiteIntentionPushfrequency', arr)
      }
      if (type === '1') {
        if (!item.flag) {
          this.targetGender.forEach(val => {
            val.flag = false
          })
        }
        let arr = this.targetGender
        this.$store.dispatch('setSiteIntentionTargetGender', arr)
      }
      if (type === '3') {
        item.flag = !item.flag;
        let arr = this.spreadway
        this.$store.dispatch('setSiteIntentionSpreadway', arr)
        return 
      }
      if (type === '2') {
         item.flag = !item.flag;
        let arr = this.consumptionLevel
        this.$store.dispatch('setSiteIntentionConsumptionLevel', arr)
        return 
      } 
      if (type === '4') {
         item.flag = !item.flag;
        let arr = this.outsourcingProject
        this.$store.dispatch('setSiteIntentionOutsourcingProject', arr)
        return 
      }
      if (type === '5') {
         item.flag = !item.flag;
        let arr = this.additional_requirement
        this.$store.dispatch('setSiteIntentionAdditionalRequirement', arr)
        return 
      } 
      item.flag = !item.flag;
    },
    setCityList(item) {

            item.flag = !item.flag
        },
    changeData(obj) {
      let arr = [];
      for (let item of obj) {
        arr.push({
          name: item.display_name + '',
          value: item.id + ''
        });
      }
      return arr;
    },
    isFoodInduatry(){
       if(!this.mainIndustry.id|| !this.catering_industry_id.length){
        return;
      }
      this.is_food_induatry = this.catering_industry_id.find((value, index, arr) => {
        return this.mainIndustry.id == value;
      })
    },
    changeSelectData(obj) {
      for (let item of obj) {
        Object.assign(item, { "flag": false });
      }
      return obj;
    },
    changeSpreadWay(e){
      for(let item of this.spreadway){
        if(item.value==e[0]){
          this.companyInfo.spread_way ={
            id:+item.value,
            spread_way:item.name}
          break;
        }
      }
    },
    changePushingFrequencyLevel(e){
      for(let item of this.pushfrequency){
        if(item.value==e[0]){
          this.companyInfo.pushing_frequency_level ={
            id:+item.value,
            display_name:item.name}
          break;
        }
      }
    },
    storeProduct () {
      let str = this.product
      this.$store.dispatch('setSiteIntentionProduct', str)
    },
    selectSites (item) {
      item.flag = !item.flag 
      if (item.flag) {
        this.hadChoseSiteType.push(item)
      } else {
        let len = this.hadChoseSiteType.length
        for (let i = 0; i < len; i++) {
          if (item.display_name == this.hadChoseSiteType[i].display_name) {
            this.hadChoseSiteType.splice(i, 1)
            return
          }
        }
      }
    },
    chooseFileType () {
      let j = setTimeout( () => {
        clearTimeout(j);
        this.$refs.vfileUpload&&this.$refs.vfileUpload.selectImg();
      } , 500 );
      this.chooseUpload = !this.chooseUpload  ;
    },
    submitSite () {
      // if (this.allChoseSite) {
      //   this.hadChoseSiteType = []
      //   this.siteType.forEach(item => {
      //     item.flag = true
      //     this.hadChoseSiteType.push(item)
      //   })
      // } 
      if (this.hadChoseSiteType.length) {
        this.stringSiteType = ''
        if (this.allChoseSite) {
          this.stringSiteType = '不限场地'
        } else {
          this.hadChoseSiteType.forEach((item, index) => {
            this.stringSiteType += index == this.hadChoseSiteType.length - 1 ? `${item.display_name}` : `${item.display_name},`
          })
        }
      }
      let _allChoseSite = this.allChoseSite
      this.showSiteType = !this.showSiteType
      let params = {
        select: this.hadChoseSiteType,
        allSelect: _allChoseSite,
        _allChoseSiteCache: this.siteType
      }
      console.log(params)
      this.$store.dispatch('setSiteIntentionChoseSiteType', params)
    },
    save(){
      let { consumptionLevel,agelevel ,cert_url:cert_urlArr} = this.$data;
      let {
        company='',
        product='',
        industry_id=undefined,
        spread_way=null,
        demand_area='',
        pushing_frequency_level,
        acceptable_minimum_price,
        acceptable_maximum_price,
        food_safety_license,
        images,
        cert_url,
        feature_description=''
      } = this.companyInfo

      let consumption_level_id = []
      for (let item of consumptionLevel) {
        if (item.flag) {
          consumption_level_id.push(item.id)
        }
      }
      let age_level_id = []
      for (let item of agelevel) {
        if (item.flag) {
          age_level_id.push(item.id)
        }
      }
      if(!this.checkParams()){
        return
      }

      let params = {
        company,
        product,
        industry_id,
        cert_url:cert_urlArr[0]||cert_url,
        consumption_level_id: JSON.stringify(consumption_level_id),
        age_level_id: JSON.stringify(age_level_id),
        food_safety_license: JSON.stringify(food_safety_license),
        images: JSON.stringify(images),
        feature_description
      }
      // params.spread_way_id=spread_way.id
       if (demand_area != '' || demand_area === '0.00' || demand_area === 0 || demand_area) {
          params.demand_area = Number(demand_area).toFixed(2)
        }
      // if (pushing_frequency_level !== null && pushing_frequency_level.id) {
      //     params.pushing_frequency_level_id = pushing_frequency_level.id
      //   }
      if (acceptable_minimum_price === 0 || acceptable_minimum_price === '0.00' || acceptable_minimum_price) {
          params.acceptable_minimum_price = Number(acceptable_minimum_price).toFixed(2)
        }
      if (acceptable_maximum_price === 0 || acceptable_maximum_price === '0.00' || acceptable_maximum_price) {
        if (acceptable_minimum_price) {
          if (acceptable_maximum_price < acceptable_minimum_price) {
            this.$vux.toast.text('最低价大于最高价！', 'middle');
            this.companyInfo.acceptable_maximum_price = ''
            return;
          }
        }
        params.acceptable_maximum_price = Number(acceptable_maximum_price).toFixed(2)
      }


      if (!this.mainIndustry.display_name) {
        this.$vux.toast.text('请选择主行业', 'middle');
        return false;
      }

      let _deputyIndustry = []
      this.deputyIndustry.forEach(item => {
        _deputyIndustry.push(item.id)
      })
      let _pushfrequency = ''
      this.pushfrequency.forEach(item => {
        if (item.flag) _pushfrequency = item.id
      })
      let _consumptionLevel = []
      this.consumptionLevel.forEach(item => {
        if (item.flag) {
          _consumptionLevel.push(item.id)
        }
      })
      let _targetGender = ''
      this.targetGender.forEach(item => {
        if (item.flag) _targetGender = item.id
      })
      let _citySelection = []
      this.citySelection.forEach(item => {
        _citySelection.push(item.id)
      })
      let _hadChoseSiteType = []
      if (this.allChoseSite) {
        _hadChoseSiteType = [0]
      } else {
        this.hadChoseSiteType.forEach(item => {
          if (item.flag) _hadChoseSiteType.push(item.id)
        })
      }
      let _spreadway = []
      this.spreadway.forEach(item => {
        if (item.flag) _spreadway.push(item.id)
      })
      let _outsourcingProject = []
      this.outsourcingProject.forEach(item => {
        if (item.flag) _outsourcingProject.push(item.id)
      })
      let _additional_requirement = []
      this.additional_requirement.forEach(item => {
        if (item.flag) _additional_requirement.push(item.id)
      })
      let _fileUrls = []
      if (this.fileUrls[0] && this.fileUrls[0].link) {
        _fileUrls.push({
          name: this.fileUrls[0].filename,
          url: this.fileUrls[0].link
        })
      }
      let _minArea = Number(this.minArea).toFixed(2)
      let _maxArea = Number(this.maxArea).toFixed(2)
      let _minPrice = Number(this.minPrice).toFixed(2)
      let _maxPrice = Number(this.maxPrice).toFixed(2)
      if (_minArea > _maxArea) {
        this.$vux.toast.text('最小面积不能大于最大面积', 'middle');
        return false;
      }
      if (_minPrice > _maxPrice) {
        this.$vux.toast.text('最小价格不能大于最大价格', 'middle');
        return false;
      }

      let param = {
        industry_id: this.mainIndustry.id,
        product: this.product,
        deputy_industry_id: _deputyIndustry,
        pushing_frequency_level_id: _pushfrequency,
        gender_tendency: _targetGender,
        consumption_level_id: _consumptionLevel,
        city_id: _citySelection,
        field_type_id: _hadChoseSiteType,
        spread_way_id: _spreadway,
        outsourcing_projects_id: _outsourcingProject,
        additional_requirement_id: _additional_requirement,
        other_requirement: this.other_requirement,
        activity_case_url: _fileUrls,
        images: this.chooseImages,
        food_safety_license: this.foodSafetyLicense,
        demand_area: _minArea == '0.00' ? '' : _minArea,
        demand_max_area: _maxArea == '0.00' ? '' : _maxArea,
        acceptable_minimum_price: _minPrice == '0.00' ? '' : _minPrice,
        acceptable_maximum_price: _maxPrice == '0.00' ? '' : _maxPrice
      }
      postCompanyInfo(param).then(res=>{
        let brightMainIndustry = this.mainIndustry.display_name
        this.appBrightSaveInfo(brightMainIndustry)
      })
    },
    appBrightSaveInfo (brightMainIndustry) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('saveSiteIntention', brightMainIndustry , function (data) {}) ;
      });
    },
    checkParams(){
      let {
        company='',product='',industry_id=undefined,spread_way=null,
      } = this.companyInfo
      // if(!company){
      //   this.$vux.toast.text('请填写公司名称', 'middle');
      //   return false;
      // }
      // if(!industry_id){
      //   this.$vux.toast.text('请填写公司名称', 'middle');
      //   return false;
      // }
      // if(!company){
      //   this.$vux.toast.text('请填写公司名称', 'middle');
      //   return false;
      // }
      // console.log(industry_id)
      // if(spread_way==null||!spread_way.id){
      //   this.$vux.toast.text('请选择推广方式', 'middle');
      //   return false;
      // }
      // if(product==null||!product.length){
      //   this.$vux.toast.text('请选择产品名称', 'middle');
      //   return false;
      // }
      // if (!industry_id) {
      //   this.$vux.toast.text('请选择行业', 'middle');
      //   return false;
      // }
      return true;
    },
    saveRequirement () {
      let arr = this.other_requirement
      this.$store.dispatch('setSiteIntentionOtherRequirement', arr)
    },
    handleAreaAndPrice () {
      let arr = {
        minArea: this.minArea,
        maxArea: this.maxArea,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      }
      this.$store.dispatch('setSiteIntentionAreaAndPrice', arr)
    }
  }
}

</script>
<style lang="scss">
@import "../../style/mixin";

.company {
  padding-bottom:.2rem;
  .C-item {
    .weui-cell__hd {
      @include sc(0.28rem, #333);
      @include wh(1.5rem, auto);
    }
    .weui-cell_access {
      display: flex !important;
    }
    .vux-popup-picker-select-box {
      @include wh( 4.5rem, auto);
      @include sc(0.26rem, #888);
    }
  }
}

</style>
<style lang="scss" scoped>
@import "../../style/mixin";

@mixin angle($width, $bw, $color, $direction) {
  position: relative;
  &::after {
    content: " ";
    display: inline-block;
    height: $width;
    width: $width;
    border: $bw solid $color;
    border-color: $color $color transparent transparent; // -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    // transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: rotate($direction) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }
}



/*
 reset weui css start...
 */

.weui-cells {
  line-height: 0.9rem;
}

.vux-cell-box {
  width: 100%!important;
}

.vux-cell-box:before {
  height: 0 !important;
  border-top: 0 none !important;
}

.weui-cells:before,
.weui-cells:after {
  content: "";
  height: 0 !important;
  border-top: 0 none !important;
  border-bottom: 0 none !important;
}

.weui-cell {
  line-height: 0.9rem;
  font-size: 0.28rem;
  padding: 0!important;
}

.weui-cell_access .weui-cell__ft:after {
  width: 0.1rem;
  height: 0.1rem;
}

.weui-cell:before {
  height: 0;
  border-top: 0 none!important;
}

.vux-cell-box:before {
  position: relative;
}

.vux-no-group-title {
  margin-top: 0 !important;
}

.user .weui-cell__hd,
.description .weui-cell__hd {
  width: 0 !important;
}



/* reset weui css end */

.company {
  .C-main {
    .save {
      width: 7rem;
      height: 0.88rem;
      line-height: 0.88rem;
      margin: 0.8rem auto;
      border-radius: 0.06rem;
      text-align: center;
      @include sc(0.32rem, #fff);
      background-color: $mainColor;
    }
    .C-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #fff;
      .C-item {
        margin: 0 0.28rem;
        padding-right: 0.28rem;
        min-height: 0.9rem;
        display: flex;
        align-items: center;
        @include angle(0.15rem, 0.02rem, #888, 45deg);
        &::after {
          position: absolute;
          top: 45%;
          right: 11px;
        }
        @include bt-1px(#ddd);
        position: relative;
        .checkUserAttr {
          text-align: right;
          float: right;
           top: .01rem;
          position: relative;
          width: 4rem;
          right: -1.1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: .26rem;
          color: #666;
        }
        .twoCheckUserAttr {
          width: 1.6rem;
          text-align: center;
          background: #F1F2F6;
          border-radius: 4px;
          height: .66rem;
          margin-bottom: .2rem;
        }
        .twoCheckUserAttr::-webkit-input-placeholder {
            color: #d2d2d2 !important;
          }
        .link-bar {
          position: relative;
          top: -.05rem;
          color: #D2D2D2;
          margin:0 .1rem;
        }
        .area-unit {
          position: relative;
          top: -.02rem;
          right: -0.1rem;
          font-size: .28rem;
        }
        &:first-child {
          @include bt-1px(transparent);
        }
        &.no-angle {
          &::after {
            display: none;
          }
        }
        &.item-two {
          line-height: 0.64rem;
          flex-direction: column;
          align-items: flex-start;
          padding-bottom: .1rem;
          .tit {
            @include wh(auto, .64rem);
            margin: .1rem 0;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            @include wh(100%, auto);

              .tag {
                @include wh(1.4rem, .6rem);
                text-align: center;
                border-radius: 0.08rem;
                background: #F1F2F6;
                box-sizing: border-box;
                @include sc(0.24rem, #666);
                margin-right: 0.2rem;
                margin-bottom: 0.2rem;
                &.active {
                  color: $mainColor;
                  background: #E5F1FF;
                }
              }
            &.price-area {

              .price-input {
                @include wh(1rem, auto);
                text-align: center;
              }
            }
          }
          .push-rate {
            width: 100%;
            .radios {
              width: 50%;
              display: inline-block;
            }
            .male {
              width: 33.3%;
              display: inline-block;
            }
          }
          .textarea {
            @include wh(100%, 2.02rem);
            @include sc(0.24rem, #666);
            background: #F1F2F7;
            border-radius: .08rem;
            margin-bottom: 0.2rem;
            resize: none;
            padding: .2rem;
          }
          .field-image {
            padding-bottom: 0.2rem;
            .vux-x-icon {
              fill: #999;
              margin-right: 0.1rem;
            }
            .ic-camera {
              @include wh( 1.5rem, 1.5rem);
              border: 1px solid #ccc;
              @include bg-image('../../images/ic_photograph_two_five');
              background-size: 0.55rem 0.44rem !important;
              background-position: center;
            }
            img {
              @include wh( 1.5rem, 1.5rem);
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;
            }
          }
        }
        .profile-avatar {
          @include wh(0.7rem, 0.7rem);
          border-radius: 50%;
          @include bg-image( '../../images/ic_mine_default_three')
        }
        .require-icon{
          position: relative;
          top: .1rem;
          font-size: .36rem;
          margin-right: .1rem;
          // top:0.35rem;
          // left:1.16rem;
          //   position: absolute;
            color: $red;
          }
        .tit {
          @include sc(0.28rem, #333);
          @include wh(1.5rem, auto);

        }
        .input {
          @include wh( 4.5rem, auto);
          @include sc(0.26rem, #888);
        }
        .deman-input {
          width: 2.4rem;
          margin-right: 0.2rem;
        }
      }
    }
  }
}
.bt1 {
  border-bottom: 1px solid #ddd
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
  color: #999; 
} 
.siteChose {
  position: relative;
  width: 6rem;
  background: #FFFFFF !important;
  height: 100%;
  .title {
    font-size: .36rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: .36rem;
    font-weight: bold;
    padding: .26rem .3rem;
    border-bottom: 1px solid #EEEEEE;
  }
  .allChose {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
    padding: .2rem .3rem;
    font-size: .32rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: .32rem;
  }
  .choseItem {
    padding: .4rem .3rem .3rem .3rem;
    font-size: .24rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .24rem;
  }
  .specificVenue {
    display: flex;
    // padding: 0 .3rem 0 0;
    flex-wrap: wrap;
    height: auto;
    width: 100%;
    .specificVenue-item {
      width: 1.6rem;
      height: .56rem;
      font-size: .24rem;
      color: #D2D2D2;
      background: #F0F0F0;
      border-radius: .06rem;
      letter-spacing: 0;
      text-align: center;
      line-height: .56rem;
      margin: 0 0 .3rem .3rem;
    }
    .active {
      width: 1.6rem;
      height: .56rem;
      background: rgba(216,216,216,0.00);
      border: 0 solid #B2D6FF;
      border-radius: .06rem;
      font-size: .24rem;
      color: #0077FF;
      letter-spacing: 0;
      text-align: center;
      line-height: .56rem;
      margin: 0 0 .3rem .3rem;
      background: rgba(216,216,216,0.00);
      border: 1px solid #B2D6FF;
      border-radius: 3px;
    }
    .normal {
      width: 1.6rem;
      height: .56rem;
      // opacity: 0.4;
      background: rgba(216,216,216, 0);
      border: 1px solid rgba(210,210,210, .4);
      border-radius: .06rem;
      font-size: .24rem;
      letter-spacing: 0;
      text-align: center;
      line-height: .56rem;
      margin: 0 0 .3rem .3rem;
      > span {
        color: #404042;
        opacity: 1 !important;
      }
    }
  }
  .sureSelect {
    position: absolute;
    bottom: 0;
    padding: .24rem .2rem .2rem .2rem;
    .cancelSite {
      width: 2.06rem;
      height: .88rem;
      font-size: .3rem;
      color: $mainColor;
      letter-spacing: 0;
      text-align: center;
      line-height: .88rem;
      display: inline-block;
      // padding: .32rem .76rem;
      background: #B2D6FF;
      border-radius: .06rem;
    }
    .surelSite {
      width: 3.34rem;
      height: .88rem;
      background: $mainColor;
      border-radius: .06rem;
      font-size: .3rem;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: center;
      line-height: .88rem;
      display: inline-block;
      margin-left: 0.1rem
    }
  }
}
.upload-file {
  margin-left: 2rem;
  margin-top: -.7rem
}
.upload-file-tip {
  font-size: .24rem;
  color: #999999;
  letter-spacing: 0;
  line-height: .24rem;
}
.bt0 {
  &::before {
    content: " ";
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 0px solid #ddd !important;
  }
}
.file-upload{
  width: 5.1rem;
  .upload-icon{
    display: block;
    @include wh(2.28rem,0.6rem);
    @include bg-image('../../images/but_programme_three_one');
  }
  .img-box{
    padding-top: 0.2rem;
  }
  .file-box{
    padding-top: 0.2rem;
  }
}

.pt10 {
  padding-top: 0.2rem;
}

input[type="radio"] + label::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: .4rem;
    @include bg-image( '../../images/ic_xuanqi');
    width: 1.1em;
    height: 1.1em;
    position: relative;
    top: -.03rem
  }
  input[type="radio"]:checked + label::before {
    font-size: .4rem;
    @include bg-image( '../../images/ic_xuanzhong');
    width: 1.1em;
    height: 1.1em;

  }
  input[type="radio"] {
      position: absolute;
      clip: rect(0, 0, 0, 0);
  }

</style>

