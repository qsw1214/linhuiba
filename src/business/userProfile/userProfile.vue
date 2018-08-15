<template lang="html">
  <div class="user-profile">
      <v-head path="/admin/profile" isFixed="true">
        <div slot="center-part" v-if="userProfile">{{userProfile.enterprise_role ? '企业资料' : '个人信息'}}</div>
      </v-head>
      <section  v-if="userProfile!=null" class="user-profile-list" v-show="showProfileParent">
        <ul class="profile-list">
           <li class="profile-item" @click="select">
             <span class="tit">邻汇吧头像</span>
             <img class="profile-avatar" v-lazy="userProfile.avatar" />
             <vUploadImg ref="upload" @success="changeAvatar"  name="img123" fileType="comment" class="profile-avatar-upload" max=1 :picArr="[userProfile.avatar]"></vUploadImg>
           </li>
           <li class="profile-item" @click='changeUserName'>
             <span class="tit">用户名</span>
             <span class="txt" v-if="userProfile.username.length > 0">{{userProfile.username}}</span>
             <span class="txt" v-else><span class="red-tips"></span>设置用户名</span>
           </li>
           <router-link to="/admin/gradeDesc" class="profile-item">
             <span class="tit">会员等级</span>
             <span class="txt">{{userProfile.membership_level ||""}}</span>
           </router-link>
           
            <!-- 判定权限 -->
           <router-link :to="{name:'companyInfo'}" class="profile-item" v-if="userProfile.enterprise_role">
             <span class="tit">企业信息</span>
             <!-- <span class="txt">{{userProfile.company||"未填写"}}</span> -->
           </router-link>

           <!-- <router-link :to="{name:'editName',query:{name:userProfile.name||''}}" class="profile-item">
             <span class="tit">姓名</span>
             <span class="txt">{{userProfile.name||"未填写"}}</span>
           </router-link> -->
          <router-link :to="{name:'changeMobile'}" class="profile-item">
             <span class="tit">绑定手机号</span>
             <span class="txt">{{userProfile.mobile||"未绑定"}}</span>
           </router-link>
           <router-link :to="{name:'point'}" class="profile-item">
             <span class="tit">积分</span>
             <span class="txt">{{userProfile.consumption_point||'0'}}</span>
           </router-link>
           <li class="profile-item ">
             <span class="tit">邀请码</span>
             <span class="txt">{{userProfile.invite_code||""}}</span>
           </li>
           <router-link :to="{name:'editEmail',query:{email:userProfile.email||''}}" class="profile-item">
             <span class="tit">邮箱</span>
             <span class="txt">{{userProfile.email||"未填写"}}</span>
           </router-link>
            <router-link :to="{name:'accountBound'}" class="profile-item">
             <span class="tit">第三方账号</span>
             <!-- <span class="txt">{{userProfile.wechat_bound?"已绑定":"未绑定"}}</span> -->
           </router-link>
        </ul>
        <ul class="profile-list m-20">
          <router-link :to="{name:'company'}" class="profile-item">
             <span class="tit">场地意向</span>
             <span class="txt">{{userProfile.industry_name == '/' ? "未填写" : userProfile.industry_name  }}</span>
           </router-link>
           <router-link :to="{name:'address'}" class="profile-item">
             <span class="tit">联系人管理</span>
             <!-- <span class="txt">{{userProfile.email||"未填写"}}</span> -->
           </router-link>
           <!-- <router-link :to="{name:'publishingPermissions'}" class="profile-item">
             <span class="tit">申请发布人权限</span>
             <span class="txt">{{userProfile.email||"未填写"}}</span>
           </router-link> -->
           <!-- <router-link :to="{name:'company'}" class="profile-item">
             <span class="tit">公司信息</span>
             <span class="txt">{{userProfile.company||"未填写"}}</span>
           </router-link>
            <router-link :to="{name:'changePassword'}" class="profile-item">
             <span class="tit">修改密码</span>
           </router-link>
            <router-link :to="{name:'accountBound'}" class="profile-item">
             <span class="tit">第三方账号</span>
             <span class="txt">{{userProfile.wechat_bound?"已绑定":"未绑定"}}</span>
           </router-link> -->
        </ul>

        <div class="logout" @click.stop="logout">退出登录</div>
      </section>
      <transition name="router-slid" mode="out-in">
        <router-view @edit="initData" v-on:viewIn="changeParent"></router-view>
      </transition>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import vUploadImg from 'src/components/vUploadImg';
import { mapState, mapActions, mapMutations } from 'vuex'
import { getProfile, logout ,setUserAvatar} from 'src/service/getData';
import { getStorage, getSession } from 'src/config/tools';
export default {
   directives: {

  },
  data() {
    return {
      isShow: false,
      avatar:'',
      menu: [
        {
          label: '查看原图',
          type: 'primary',
          value: 'preview'
        },
        {
          label: '更换头像',
          type: 'primary',
          value: 'changeAvatar'
        },
      ],
      list: [{
        src: 'src/images/ic_logo_one.png'
      }
      ],
      hiddenParent: false
    }
  },
  components: { vHead,vUploadImg },

  computed: {
    ...mapState([
      'userProfile',
      'showProfileParent'
    ]),
  },
  created() {
    this.initData()
    // console.log(this.userProfile.enterprise_role)
    this.$store.dispatch('ProfileParent', true);
  },
  mounted () {
    console.log(this.userProfile, 123)
    // if (this.showProfileParent === false) {
    //   this.$store.dispatch('ProfileParent', true);
    // }
  },
  methods: {
    ...mapActions([
      'getUserProfile',
      'ProfileParent'
    ]),
    ...mapMutations([
      'LOGOUT'
    ]),
    async initData() {
      this.$vux.loading.show({ text: 'loading...' });
      await this.$store.dispatch('getUserProfile');
      this.$vux.loading.hide();
    },
    logout() {
      let that = this;
      this.$vux.confirm.show({
        confirmText: '确认',
        cancelText: '取消',
        title: '退出登录',
        content: '确认退出登录？',
        onConfirm() {
          logout().then( res => {
            that.LOGOUT();
            that.$router.go(-1);
            that.$router.replace({ path: '/admin/profile' })
          })
        }
      })

    },
    select(){
      // 更换图片
      this.$refs.upload.changeImg()
    },
    changeAvatar(e){
      console.log(1)
      setUserAvatar(e[0]).then(res=>{
        this.$store.dispatch('getUserProfile');
      })
    },
    changeParent () {
      console.log(1)
    },
    beforeRouteLeave (to, from, next) {
      console.log(1)
    },
    changeUserName () {
      // console.log(this.userProfile.username.length )
      if (this.userProfile.username == null || this.userProfile.username.length < 1) {
        this.$router.push({name: 'editUserName'})
      } else {
        this.$vux.toast.text('用户名已设置完成不可更改～', 'middle');
      }
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../style/mixin";

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translateX( 100%);
  opacity: 0;
}

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
    right: 0.1rem;
  }
}

.m-20 {
  margin-top: 0.2rem;
}




.user-profile {
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
        @include angle(0.15rem, 1px , #888, 45deg);
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
        }
      }
    }
  }
  .logout {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0.4rem;
    border-radius: 0.06rem;
    text-align: center;
    @include sc(0.32rem, #fff);
    background-color: $mainColor;
  }
  .red-tips {
    background: #F23030;
    width: .14rem;
    height: .14rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: .08rem;
    position: relative;
    top: -.05rem;
  }
}
</style>


