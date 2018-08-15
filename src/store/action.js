import {
    getProfile,
    getConfig
} from '../service/getData'
import { setStorage, setSession, getStorage } from 'src/config/tools';

export default {

    async getUserProfile({
		commit,
        state
	}) {
        let res = await getProfile();
        commit("RECORD_USERPROFILE", res.result)
    },
    refreshConfig({
		commit,
        state
	}) {
        let config = state.config || getStorage('config');
        let version = 0
        if (config) {
            version = config.version
        }
        getConfig(version).then(res => {
          if (res.result.version <= version) {
            commit("RECORD_CONFIG", config)
          }else{
            commit("RECORD_CONFIG", res.result)
          }
        });

    },
    uploadLicense ({commit,state}, url) {
        commit("SET_LICENSEURL", url)
    },
    ProfileParent ({commit}, boo) {
        commit("SET_SHOWPROFILEPARENT", boo)
    },
    setProductDetailsToCar ({commit}, arr) {
        console.log(arr)
        commit("SET_PRODUCTDETAILSTOCAR", arr)
    },
    setSiteIntentionIndustry ({commit}, arr) {
        commit("SET_SITEINTENTIONINDUSTRY", arr)
    },
    setSiteIntentionDeputyIndustry ({commit}, arr) {
        commit("SET_SITEINTENTIONDEPUTYINDUSTRY", arr)
    },
    setSiteIntentionChoseCity ({commit}, arr) {
        commit("SET_SITEINTENTIONCHOSECITY", arr)
    },
    setSiteIntentionChoseSiteType ({commit}, arr) {
        commit("SET_SITEINTENTIONCHOSESITEYPE", arr)
    },
    setSiteIntentionProgrammeActivites ({commit}, arr) {
        commit("SET_SITEINTENTIONPROGRAMMEACTIVITES", arr)
    },
    setSiteIntentionActivitesImages ({commit}, arr) {
        commit("SET_SITEINTENTIONACTIVITESIMAGES", arr)
    },
    setSiteIntentionFoodSafeImages ({commit}, arr) {
        commit("SET_SITEINTENTIONFOODSAFEIMAGES", arr)
    },
    setSiteIntentionSpreadway ({commit}, arr) {
        commit("SET_SITEINTENTIONSPREADWAY", arr)
    },
    setSiteIntentionPushfrequency ({commit}, arr) {
        commit("SET_SITEINTENTIONPUSHFREQUENCY", arr)
    },
    setSiteIntentionTargetGender ({commit}, arr) {
        commit("SET_SITEINTENTIONTARGETGENDER", arr)
    },
    setSiteIntentionConsumptionLevel ({commit}, arr) {
        commit("SET_SITEINTENTIONCONSUMPTIONLEVEL", arr)
    },
    setSiteIntentionOutsourcingProject ({commit}, arr) {
        commit("SET_SITEINTENTIONOUTSOURCINGPROJECT", arr)
    },
    setSiteIntentionAdditionalRequirement ({commit}, arr) {
        commit("SET_SITEINTENTIONADDITIONALREQUIREMENT", arr)
    },
    setSiteIntentionOtherRequirement ({commit}, arr) {
        commit("SET_SITEINTENTIONOTHERREQUIREMENT", arr)
    },
    setSiteIntentionAreaAndPrice ({commit}, arr) {
        commit("SET_SITEINTENTIONAREAANDPRICE", arr)
    },
    setSiteIntentionProduct ({commit}, arr) {
        commit("SET_SITEINTENTIONPRODUCT", arr)
    }

}
