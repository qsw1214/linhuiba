<template lang="html">
  <div class="editAddress-wrap">
      <v-head go-back="true">
        <div slot="center-part">编辑联系人</div>
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
              <vAddress :idsArr="ids" @change="getIds"></vAddress>
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

import {  Icon } from 'vux'
import vHead from 'src/components/vHead'
import vAddress from 'src/components/vAddress'
import { mapState } from 'vuex'
import { editAddress } from 'src/service/getData';
import { WORLD_HTML_REG, COMPANY_REG, MOBILE_REG, EMAIL_REG } from 'src/config/data';

export default {
  data() {
    return {
      detail:{},
      ids:[],
      idObj:{}
    }
  },
  components: { vHead, Icon, vAddress},

  mounted() {
    // 对象中间转化 便面对象索引唯一
    let { address, city, city_id, district, district_id, id, is_default, mobile, name, province, province_id} = this.editAddress;
    this.detail = { address, city, city_id, district, district_id, id, is_default, mobile, name, province, province_id }
    this.ids = ['p'+province_id,'c'+city_id,'d'+district_id]
  },
  computed: {
    ...mapState([
      'editAddress'
    ]),
  },
  methods: {
    setDefaultAddress(){
      this.detail.is_default=this.detail.is_default==1?0:1;
    },
    getIds(idObj){
      let {province_id,city_id,district_id} = idObj
      this.detail.province_id = province_id
      this.detail.city_id = city_id
      this.detail.district_id = district_id
    },
    check(){
      let { address, city, city_id, district, district_id, id, is_default, mobile, name, province, province_id } = this.detail;
      if (!COMPANY_REG.test(name)) {
        this.$vux.toast.text('请输入正确的联系人信息', 'middle');
        return false;
      }
      if (!MOBILE_REG.test(mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return false;
      }
      if (!COMPANY_REG.test(address)) {
        this.$vux.toast.text('请输入详细地址', 'middle');
        return false;
      }
      return true;
    },
    saveEditAddress(){
      if (this.check()) {
        editAddress(this.detail).then(res => {
          // this.detail = this.editAddress
          this.$emit('edit')
          this.$router.go(-1)
        })
      }
    }
  }

}

</script>

<style lang="scss" scoped>
@import "../../../style/mixin";

.editAddress-wrap {
  @include allcoverfixed;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}

body {
  .address-info{
    ul{
      background: #fff;
      padding:0 0.28rem;
      // display: flex;
      // flex-direction: column;

      .address-item{
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
        &:last-child{
          @include bb-1px(transparent);
        }
        .tit{
          display: flex;
          align-items: center;
           @include wh(1.5rem, 100%);
        }
        .txt{
          width: 4.8rem;
           color: #888;
        }
        .ic{
          margin-right: 0.1rem;
        }
        .input{
          font-size: 0.26rem;
          color:#888 ;
          display: flex;
          align-items: center;
          flex:1;
           @include wh(1.5rem, 100%);
        }
      }
    }
    .save{
        background: $mainColor;
        border-radius:0.1rem;
        margin: 0.8rem auto;
        text-align: center;
        line-height: 0.9rem;
        @include sc(0.32rem, #fff);
       @include wh(7rem, 0.9rem);
    }
  }
}

</style>
