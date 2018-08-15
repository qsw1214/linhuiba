<template>
  <div class="company-info">
    <v-head go-back="true">
      <div slot="center-part">企业信息</div>
    </v-head>
    <section class="user-profile-list">
      <ul class="profile-list">
        <li class="profile-item">
          <span class="tit">统一社会信用代码 </span>
          <span class="txt">{{companyInfo.registration_no||""}}</span>
        </li>
        <li class="profile-item">
          <span class="tit">企业名称</span>
          <span class="txt">{{companyInfo.name||""}}</span>
        </li>
        <!-- <li class="profile-item">
          <span class="tit">法人代表</span>
          <span class="txt">{{companyInfo.corporation||""}}</span>
        </li> -->
        <li class="profile-item">
          <span class="tit">所在省市</span>
          <span class="txt">{{companyInfo.city||""}}</span>
        </li>
        <li class="profile-item">
          <span class="tit">详细地址</span>
          <span class="txt">{{companyInfo.address||""}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { companyCertifiedInfo } from '../../../service/getData';
  export default {
    data () {
      return {
        companyInfo: {}
      }
    },
    components: {
      vHead
    },
    mounted () {
      companyCertifiedInfo().then(res => {
        if (res.code === 1 ) {
          console.log(res)
          this.companyInfo = res.result
        } else {
          throw new Error("Get companyInfo was wrong")
        }
      })
    }
  } 
</script>

<style lang="scss" scoped>
  @import "../../../style/mixin";
  .company-info {
  @include sc(0.26rem, #333);
  padding-bottom:.2rem;
  .user-profile-list {
    .profile-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #fff;
      .profile-item {
        margin: 0 .288rem 0 .26rem;
        padding-right: 0.28rem;
        height: 1.12rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // @include angle(0.15rem, 1px , #888, 45deg);
        border-top:1px solid #E8E8E8;
        &:first-child {
          border:0 none;
        }
        &.no-angle {
          &::after {
            display: none;
          }
        }
        .profile-avatar {
          @include wh(0.7rem, 0.7rem);
          border-radius: 50%;
          // @include bg-image( '../../images/ic_blue_logo_three');
        }
        .profile-avatar-upload{
          position: absolute;
          // visibility: hidden;
          height:0;
          width:0;
          overflow: hidden;
          z-index: -999;
        }
        .tit {
          font-size: 0.28rem;
        }
        .txt {
          position: relative;
          top: 0.04rem;
          @include sc(0.27rem, #888);
          width: 4.4rem;
          text-align: right;
          line-height: .37rem;
        }
      }
    }
  }
}
</style>
