<template lang="html">
  <div class="addAddress-wrap">
      <v-head go-back="true">
        <div slot="center-part">添加联系人</div>
      </v-head>
      <section class="address-info">
        <ul>
          <li  class="address-item">
            <span class="tit">联系人</span>
            <input class="input" type="text" v-model="detail.name" placeholder="请输入联系人"/>
          </li>
          <li  class="address-item">
            <span class="tit">联系电话</span>
            <input class="input" type="text" v-model="detail.mobile" placeholder="请输入联系人"/>
          </li>
          <li  class="address-item">
            <span class="tit">选择地区</span>
            <span class="txt">
              <vAddress :idsArr="currentArea" @change="getIds"></vAddress>
            </span>
            <span class="arrow-rt"></span>

          </li>
          <li  class="address-item">
            <span class="tit">详细地址</span>
            <input class="input" type="text" v-model="detail.address" placeholder="请输入详细地址"/>
          </li>
          <li  class="address-item" @click.stop="setDefaultAddress">
            <icon v-if="detail.is_default" class="ic icon" type="success"></icon>
            <icon v-else  class="ic" type="circle"></icon>
            <span>默认联系人</span>
          </li>
        </ul>
        <div class="save" @click.stop="saveEditAddress">保存</div>
      </section>


  </div>
</template>

<script>
import { LoadMore, Icon, Group, XAddress, ChinaAddressV3Data,PopupPicker} from 'vux'
import vHead from 'src/components/vHead'
import vAddress from 'src/components/vAddress'
import { addAddress ,getAddressList , getCurrentCity, getDistrictList } from 'src/service/getData';
import { WORLD_HTML_REG, COMPANY_REG, MOBILE_REG, EMAIL_REG } from 'src/config/data';
export default {
  data() {
    return {
      detail:{
        is_default:false,
        address:'',
        mobile:'',
        province_id:undefined,
        city_id:undefined,
        district_id:undefined
      },
      currentArea : []
    }
  },
  mounted(){
    this.$vux.loading.show({
      text: 'loading...'
    });
    getCurrentCity().then( res => {
      let city_id = res.result.city_id ;
      let province_id = res.result.province_id ;
      getDistrictList(city_id).then(res=>{
        this.$vux.loading.hide();
        // console.log(res)
        let districtList = res.result
        let district_id = districtList[0].id
        this.currentArea = [ 'p'+ province_id,'c'+ city_id ,'d'+ district_id];
      })
    }).catch( err => {this.$vux.loading.hide();});
  },
  components: { vHead, Icon, Group, vAddress, PopupPicker },
  methods: {
    setDefaultAddress() {
      this.detail.is_default = this.detail.is_default == 1 ? 0 : 1;
    },
    getIds( idObj ){
      let {province_id,city_id,district_id} = idObj
      this.detail.province_id = province_id
      this.detail.city_id = city_id
      this.detail.district_id = district_id
    },
     check() {
      let { address, city, city_id, district, district_id, id, is_default, mobile, name, province, province_id } = this.detail;
      if (!COMPANY_REG.test(name)) {
        this.$vux.toast.text('请输入正确的联系人信息', 'middle');
        return false;
      }
      if (!MOBILE_REG.test(mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return false;
      }
      if(!(city_id&&district_id&&province_id)){
        this.$vux.toast.text('请选择地址', 'middle');
        return false;
      }
      if (!COMPANY_REG.test(address)) {
        this.$vux.toast.text('请输入详细地址', 'middle');
        return false;
      }
      return true;
    },
    saveEditAddress() {

      if(this.check()){
        addAddress(this.detail).then(res => {
          this.$emit('edit');
          this.$router.go(-1)
        })
      }

    }
  }

}

</script>

<style lang="scss" scoped>
@import "../../../style/mixin";

.addAddress-wrap {
  @include allcoverfixed;
  z-index: 100;
  background-color: $bgc;
}

body {
  @include wh(100%, 100%);
  .address-info {
    ul {
      background: #fff;
      padding: 0 0.25rem; // display: flex;
      // flex-direction: column;
      .address-item {
        display: flex;
        align-items: center;

        @include wh(100%, 0.9rem);
        @include bb-1px(#ddd);
        @include sc(0.28rem, #333);
        .arrow-rt{
          width: 0.44rem;
          height: 0.44rem;
          @include bg-image('../../../images/ic_next');
        }
        .ic{
          margin-right: 0.1rem;
        }
        &:last-child {
          @include bb-1px(transparent);
        }
        .tit {
          display: flex;
          align-items: center;
          @include wh(1.5rem, 100%);
        }
        .txt{
          width: 4.8rem;
           color: #888;
        }
        .picker,.input {
          color: #888;
          font-size: 0.26rem;
          display: flex;
          align-items: center;
          flex: 1;
          @include wh(1.5rem, 100%);
        }
        .picker {
          justify-content: space-between;
                line-height: 0.8rem;
                &:before{
                    display:none;
                }
            }

      }
    }
    .save {
      background: $mainColor;
      border-radius: 0.1rem;
      margin: 0.8rem auto;
      text-align: center;
      line-height: 0.9rem;
      @include sc(0.32rem, #fff);
      @include wh(7rem, 0.9rem);
    }
  }
}


</style>
