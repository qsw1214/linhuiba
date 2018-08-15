import { setSession, getSession } from 'src/config/tools';
import Store from 'src/store';

/**
 * 正则部分
 * @gourd
 */
export const COMPANY_ACCOUNT  = /^[a-zA-Z0-9_]{1,30}$/ // 数字英文和下划线
export const ONLY_CHINESE_REG = /^[\u4e00-\u9fa5]/ // 只能中文
export const TEL_REG          = /^1[2345789]\d{9}$|^(\d{3,4}-?)?\d{7,8}(-\d{1,4})?$/ ; // 手机和座机
// export const MOBILE_REG       = /^1[2345789]\d{9}$/ ; // 11位手机号码
export const MOBILE_REG       = /^1(28|3[0-9]|4[5-7]|5[0-9]|7[0-8]|8[0-9])[0-9]{8}$/ ; // 11位手机号码
export const PASSWORD_REG     = /^[0-9a-zA-Z]{6,30}$/ ; // 密码匹配
export const WORLD_REG        = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/ ; // 中英文最少一位
export const EMAIL_REG        = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,4}$/ ; // 邮箱检测
export const WORLD_TEN_REG    = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1 , 10}$/ ; // 限制长度为 n 的中英文
export const WORLD_HTML_REG   = /<(S*?)[^>]*>.*?|<.*? \/>/g ; // textarea框检测html标签
export const POSITIVE_INT_REG = /^\d+$/ ; // 正整数最少一位
export const INT_SIX_REG      = /^\d{4,6}$/ ; // 正整数4-6位
export const INT_Four_REG     = /^\d{4}$/ ; // 正整数4位
export const FLOAT_REG        = /^\d+(\.\d+)?$/ ; // 整数或者小数
export const USRT_REG         = /^\d{17}[\d|x]$|^\d{15}$/ ; // 身份证号
export const CHINESE          = /^[\u4e00-\u9fa5]+$/;
export const CAPTCHA_REG      = /^[a-zA-Z0-9]{6}$/ ; // 数字字母6位
export const REGPOS	          = /^([1-9]{1})(\d{14}|\d{18})$/; // 银行卡号
export const NUM_LET_REG      = /^[a-zA-Z0-9]+$/ ; // 数字字母
export const PIN_REG          = /^\d{6}$/ ; // 6位数字支付密码及验证码
export const COMPANY_REG      = /[\u4e00-\u9fa5_a-zA-Z0-9\.\s\,\(\)（）]{0,}[\u4e00-\u9fa5_a-zA-Z0-9\,\.\(\)（）]+[\u4e00-\u9fa5_a-zA-Z0-9\.\s\,\(\)（）]{0,}/; //验证公司名 中英文最少一位 .,() ()
/**
 * AJAX请求数据处理部分
 * @gourd
 */
export const headers = ( version = 1, boolean, isRegistered = 0 ) => {
  let login = Store.state.login || getSession('login');
  let apikey = '' ;
  let key = getSession('key') ; // 从APP传入到session里拿值

  if(key){
    // 表明在session里拿到值了;
    let app = key.slice(2 , -8) ;
    apikey = app ;
  }else{
    // 拿不到在cookie里拿
    function getCookie( name ){
      name = name + "=" ;
      var start = document.cookie.indexOf(name),
        value = null;
      if(start>-1){
        var end = document.cookie.indexOf(";",start);
        if(end == -1){
          end = document.cookie.length;
        }
        value = document.cookie.substring( start+name.length ,end);
      }
      return value;
    }
    let isApi_key = getCookie("LINHUIBA_KEY");
    if(isApi_key){
      let app = isApi_key.slice(2 , -8) ;
      apikey = app ; // 有值就赋值给apikey
      // alert('ios传cookie的api_key='+ apikey );
    }
  }
  if (login) {
    let userInfo = Store.state.userInfo || getSession('userInfo') ;
    if( userInfo ){
      apikey = userInfo.apikey ;
      Store.commit('RECORD_USERINFO', userInfo)
    }
  }
  let config = {
    "Accept": "application/vnd.linhuiba.v" + version + "+json",
    "Authorization" : "Bearer" + apikey
  } ;
  if (isRegistered) {
    config = {
      "Accept": "application/vnd.linhuiba.v" + version + "+json",
      "Authorization" : "Bearer"
    } ;
  }
  if( boolean ){
    Object.assign( config , { "Content-Type" : "application/json" } );
  }
  return config ;
};
export const initDataConfig = ( data ) => {

  let data_config = {
    keywords: '',
    city_id: 90,
    resource_type: 1,
    field_type_id: JSON.stringify([]),
    ad_type_id: JSON.stringify([]),
    district_id: JSON.stringify([]),
    trading_area_id: JSON.stringify([]),
    activity_type_id : JSON.stringify([]),
    community_type_id: JSON.stringify([]),
    label_id: JSON.stringify([]),
    facilities: JSON.stringify([]),
    order: "desc",
    order_by: "default_sort",
    page: 1,
    pageSize: 10,
    is_home_page: 0
  };
  if (data) {
    if (data.subsidy === 0 || data.subsidy) {
      data_config.subsidy = data.subsidy;
    }
    if (data.keywords) {
      data_config.keywords = decodeURIComponent( data.keywords );
    }
    if (data.lease_term_type_id) {
      data_config.lease_term_type_id = data.lease_term_type_id;
    }
    if (data.city_id) {
      data_config.city_id = data.city_id;
    }
    if (data.resource_type) {
      data_config.resource_type = data.resource_type;
    }
    if (data.field_type_id) {
      data_config.field_type_id = JSON.stringify(data.field_type_id);
    }

    if (data.activity_type_id) {
      data_config.activity_type_id = JSON.stringify(data.activity_type_id);
    }

    if (data.ad_type_id) {
      data_config.ad_type_id = JSON.stringify(data.ad_type_id);
    }
    if (data.district_id) {
      data_config.district_id = JSON.stringify(data.district_id);
    }
    if (data.community_type_id) {
      data_config.community_type_id = JSON.stringify(data.community_type_id);
    }
    if (data.trading_area_id) {
      data_config.trading_area_id = JSON.stringify(data.trading_area_id);
    }
    if (data.label_id) {
      data_config.label_id = JSON.stringify(data.label_id);
    }
    if (data.facilities) {
      data_config.facilities = JSON.stringify(data.facilities);
    }
    if (data.order) {
      data_config.order = data.order;
    }
    if (data.order_by) {
      data_config.order_by = data.order_by;
    }
    if (data.page) {
      data_config.page = data.page;
    }
    if (data.pageSize) {
      data_config.pageSize = data.pageSize;
    }
    /*可选*/
    if (data.lowPrice === 0 || data.lowPrice) {
      data_config.lowPrice = data.lowPrice*100;
    }
    if (data.highPrice === 0 || data.highPrice) {
      data_config.highPrice = data.highPrice*100;
    }
    if (data.minimum_peoples === 0 || data.minimum_peoples) {
      data_config.minimum_peoples = data.minimum_peoples;
    }
    if (data.maximum_peoples === 0 || data.maximum_peoples) {
      data_config.maximum_peoples = data.maximum_peoples;
    }
    if (data.minimum_build_year === 0 || data.minimum_build_year) {
      data_config.minimum_build_year = data.minimum_build_year;
    }
    if (data.maximum_build_year === 0 || data.maximum_build_year) {
      data_config.maximum_build_year = data.maximum_build_year;
    }
    if (data.minimum_households === 0 || data.minimum_households) {
      data_config.minimum_households = data.minimum_households;
    }
    if (data.maximum_households === 0 || data.maximum_households) {
      data_config.maximum_households = data.maximum_households;
    }
    if (data.minimum_property_costs === 0 || data.minimum_property_costs) {
      data_config.minimum_property_costs = data.minimum_property_costs*100;
    }
    if (data.maximum_property_costs === 0 || data.maximum_property_costs) {
      data_config.maximum_property_costs = data.maximum_property_costs*100;
    }
    if (data.minimum_house_price === 0 || data.minimum_house_price) {
      data_config.minimum_house_price = data.minimum_house_price*100;
    }
    if (data.maximum_house_price === 0 || data.maximum_house_price) {
      data_config.maximum_house_price = data.maximum_house_price*100;
    }
    if (data.minimum_area === 0 || data.minimum_area) {
      data_config.minimum_area = data.minimum_area;
    }
    if (data.hot) {
      data_config.hot = data.hot;
    }
    if( data.self_support ){
      data_config.self_support = data.self_support;
    }
    if( data.indoor ){
      data_config.indoor = JSON.stringify( data.indoor );
    }
    if( data.created_by ){
      data_config.created_by = data.created_by;
    }
    if( data.latitude || data.latitude === 0 ){
      data_config.latitude = data.latitude ;
    }
    if( data.longitude || data.longitude === 0 ){
      data_config.longitude = data.longitude ;
    }
    if( data.latitude_delta ){
      data_config.latitude_delta = data.latitude_delta ;
    }
    if( data.longitude_delta ){
      data_config.longitude_delta = data.longitude_delta ;
    }
    if( data.nearby ){
      data_config.nearby = data.nearby ;
    }
    if( data.is_home_page ){
      data_config.is_home_page = data.is_home_page ;
    }
    if( data.subway_station_id ){
      data_config.subway_station_id = JSON.stringify( data.subway_station_id );
    }
  }
  return data_config;
} ;

/**
 * appid 保存
 * @gourd
 */
export const APPID_LOGIN = () => {
  let host = window.location.host ;
  let reg = /lanhanba/g ;
  if(reg.test(host)){
    // 测试环境微信的appid
    return 'wx479beb642e297ac7';
  }else{
    // 正式环境的微信的appid
    return 'wx16545bd44731bb5d' ;
  }
};

