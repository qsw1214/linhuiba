<template>
	<div class="profile">
    <div class="top-tool">
      <router-link class="message" to="/message">
        <span :class="{ dot: unreadMessage }"></span>
        <span class="dot-icon"></span>
      </router-link>
    </div>
		<div class="header-content">
      <!-- 未登录跳到登录页 登录完成重定向到 我的 页面 -->
			<router-link class="flex-box" :to="userInfo ?  '/userProfile' : { path : '/login' , query : { redirect : '/admin/profile' } }">
				<div class="flex-box">
          <div class="img-box">
            <img class="avatar-img" v-if="userInfo&&userInfo.avatar" v-lazy="userInfo.avatar">
            <img class="avatar-img" src="../../images/image_touxiang_three_two@2x.png" v-else>
            <span class="level-icon" :class="{ v0 : level_id == 1 ,v1 : level_id == 2 , v2 : level_id == 3 ,v3 : level_id == 4,v4 : level_id == 5,v5 : level_id == 6 }"></span>
          </div>
          <div class="user-info">
            <div v-if="userInfo" class="info-content">
              <div class="name ellipsis">
                {{ name }}
              </div>
              <div class="subhead">
                <!-- 隐藏加入企业相关功能部分 -->
                <span v-if="userProfile&&userProfile.enterprise_authorize_status == 1">
                  <img src="">
                  <span class="hadCertified">企业已认证</span>
                  <!-- <span class="vertical-line">|</span> -->
                </span>
                <span v-else>
                  <router-link class="hadCertified" to="/enterpriseCertificate">企业未认证</router-link>
                </span>
                <!-- <span>积分值：{{ integral }}</span> -->
              </div>
            </div>
            <span v-else>
              未登录
            </span>
          </div>
				</div>
        <div v-if="userInfo">
          <div class="personal-part" v-if="userInfo&&userInfo.enterprise_role">
            <div class="personal-center"  v-if="showInfo">
              <span class="arr-text">完善企业信息</span><span class="arr-right"></span>
            </div>
            <div class="personal-center" v-else>
              <span class="arr-text">企业资料</span><span class="arr-right"></span>
            </div>
          </div>
          <div class="personal-part" v-else>
            <div class="personal-center"  v-if="showInfo">
              <span class="arr-text">完善个人信息</span><span class="arr-right"></span>
            </div>
            <div class="personal-center" v-else>
              <span class="arr-text">个人中心</span><span class="arr-right"></span>
            </div>
          </div>
        </div>
			</router-link>
    </div>

		<div class="table-view">
			<router-link class="cell has-divider" to="/myorder">
				 <div>
           <span class="img-style order"></span>
				 	<span class="img-text">订单管理</span>
				 </div>
				 <div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
      <router-link class="cell has-divider" :to="{ path : '/group' , query : { type : 2 } }">
        <div>
          <span class="img-style group"></span>
          <span class="img-text">我的拼团</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
      <router-link class="cell has-divider" to="/enquirelist">
        <div>
          <span class="img-style enquire"></span>
          <span class="img-text">我的询价</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
      <router-link class="cell" to="/mydemand">
        <div>
          <span class="img-style appeal"></span>
          我的需求
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
    </div>



		<div class="table-view">
			<router-link class="cell has-divider" to="/address">
				<div>
          <span class="img-style contract"></span>
					<span class="img-text">联系人管理</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
			<router-link class="cell" to="/myInvoice">
				<div>
          <span class="img-style invoice"></span>
					<span class="img-text">票据管理</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				</div>
			</router-link>
		</div>
    <div class="table-view">

      <div class="cell has-divider" @click="onClick">
        <div>
          <span class="img-style wallet"></span>
          <span class="img-text">我的钱包</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </div>
      <router-link class="cell" to="/care">
        <div>
          <span class="img-style care"></span>
          <span class="img-text">我的关注</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
    </div>
		<div class="table-view">
      <div  class="cell has-divider" @click="showServer">
        <div>
          <span class="img-style link-server"></span>
          <span class="img-text">联系客服</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </div>
      <router-link  class="cell has-divider" to="/invite">
        <div>
          <span class="img-style invite"></span>
          <span class="img-text">邀请有奖</span>
        </div>
        <div class="arrow-box">
          <span class="gray-arrow"></span>
        </div>
      </router-link>
			<router-link  class="cell"  :to="{ name: 'help'}">
				<div>
          <span class="img-style help"></span>
					<span class="img-text">帮助中心</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				 </div>
			</router-link>
		</div>

		<v-footer :fourselected="true"></v-footer>

		<div v-transfer-dom>
			<x-dialog  v-model="openWallet" class="model">
				<div>
					<img src="../../images/ic_blue_logo_three@2x.png" class="model-logo">
					<div class="model-info">
						预订场地时，可使用钱包中余额支付，是否开通钱包？
					</div>
					<div class="model-divider"></div>
					<div class="model-dialog flex-box">
						<div class="border-right" @click="cancelModel" style="flex:1">
							以后再说
						</div>
						<div style="flex:1">
							<div class="primary-color" @click="submitModel">开通钱包</div>
						</div>
					</div>
				</div>
			</x-dialog>
		</div>
	</div>
</template>

<script>
	import { Toast, XDialog, TransferDomDirective as TransferDom} from 'vux'
  import { getSession, setSession } from 'src/config/tools'
  import { mapState, mapActions, mapMutations } from 'vuex'
	import { userInfo, walletInfo, getBadge , getUserStatus } from '../../service/getData'
	import vFooter from '../../components/vFooter'
  import tips from 'src/components/tips' ;
	export default {
		directives: {
    	TransferDom
  	},
		components: {
			Toast,
			XDialog,
			vFooter,tips
		},
		data() {
			return {
				name: '',
				integral: '',
				unreadMessage: false,
				openWallet: false ,
        level_id : 0 ,
        showInfo : false , // 完善弹窗
        userInfo :  getSession("userInfo"),
				login: getSession("login")
			}
    },
    computed: {
      ...mapState([
        'userProfile',
      ])
    },
    created() {
      this.initData()
      console.log(this.userProfile)
    },
		mounted() {
			this.init();
      _MEIQIA('init');
      getUserStatus().then( res => {
        let status = res.result.complete_status ;
        if( !status ){
          this.showInfo = true ;
        }else{
          this.showInfo = false ;
        }
      }).catch(err => {});

		},
		methods: {
      ...mapActions([
      'getUserProfile',
    ]),
    async initData() {
      // this.$vux.loading.show({ text: 'loading...' });
      await this.$store.dispatch('getUserProfile');
      // this.$vux.loading.hide();
      // console.log(this.userProfile)
    },
      init() {
      	if(this.login) {
      		userInfo().then (res => {
      		  console.log( res )
	      		let user = res.result;
	      		this.level_id = user.membership_level_id ;
	      		this.integral = res.result.consumption_point;
	      		if(user.enterprise_authorize_status == 1) {
	      			if(user.company) {
	      				this.name = user.company;
	      			}
	      			else {
	      				this.name = user.mobile;
	      			}
	      		}
	      		else {
	      			if(user.mobile) {
	      				this.name = user.mobile;
	      			}
	      			else if(user.username) {
	      				this.name = user.username;
	      			}
	      			else {
	      				this.name = user.name;
	      			}
	      		}
      		}).catch(err => {});
      		getBadge().then(res => {
            if(res.result.unread_count > 0) {
              this.unreadMessage = true;
            }
      		}).catch(err => { console.log(err )});
      	}
      },
      onClick() {
      	if(this.login) {
      		walletInfo().then(res => {
            this.$router.push( '/wallet' );
      		}).catch(err => {
      			if(err.code == -2) {
      				this.openWallet = true;
      			}
      		})
      	}
      	else {
      		this.$router.push( { path : '/login' , query :{ redirect : '/admin/profile' } } );
      	}
      },
      cancelModel() {
        this.openWallet = false;
      },
      submitModel() {
      	setSession("setWalletPassword",true);
	  		this.$router.push('/wallet/walletPassword');
      },
      showServer(){
        _MEIQIA('showPanel');
      }
		}
	}
</script>

<style lang="scss">
	@import "../../style/mixin";

	// 弹出框样式的重置
	.flex-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.model .weui-dialog {
		width: 90%;
		max-width: 90%;
		height: auto;
		border-radius: 0.3rem;
		padding: 0.3rem;
		overflow: visible;
		font-size: 0.28rem
	}

	.model-logo {
		position: absolute;
		left: 50%;
		margin-left: -0.8rem;
		top: -0.8rem;
		width: 1.6rem;
		height: 1.6rem
	}

	.border-right {
		border-right: 1px solid #ddd
	}

	.primary-color {
		color: $mainColor
	}

	.model-info {
		margin-top: 1rem;
		line-height: 0.5rem;
		text-align: left
	}

	.model-divider {
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		border-top: 1px solid #ddd
	}

	.model-dialog  {
		line-height: 0.5rem
	}

</style>

<style lang="scss" scoped>
	@import "../../style/mixin";
	 /*iphone6下1rem等于50px*/

  .go-user-info{
    display: block;
    border: 1px solid $mainColor;
    border-radius: 0.04rem;
    color: $mainColor;
  }
	.profile{
    padding-bottom: 1.2rem;
    background-color: $bgc;
		.header-content {
		  display: block;
		  width: 100%;
		  height: auto;
		  color: #FFFFFF;
		  padding: 0.36rem 0 0.36rem 0.24rem;
      background-color: #fff;
		}
    .top-tool{
      padding: 0 0.24rem;
      background-color: #fff;
      .message {
        display: block;
        position: relative;
        width: 100%;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: right;
        .dot {
          position: absolute;
          right: 0.04rem;
          top: 0.22rem;
          width: 0.14rem;
          height: 0.14rem;
          border-radius: 50%;
          background: #f56565;
          z-index: 2
        }
        .dot-icon{
          display: inline-block;
          margin-top: 0.22rem;
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/ic_tongzhi_three_two');
        }
        .message-img {
          position: absolute;
          right: 0.05rem;
          top: 0;
          z-index: 1;
          width: 0.4rem;
          height: 0.4rem
        }
      }
    }
    .img-box{
      position: relative;
      .level-icon{
        position: absolute;
        bottom: -0.1rem;
        right: 0.1rem;
        @include wh( 0.5rem , 0.3rem );
        &.v0{
         @include bg-image('../../images/ic_v0_three_two');
        }
        &.v1 {
          @include bg-image('../../images/ic_v1_three_two');
        }

        &.v2{
          @include bg-image('../../images/ic_v2_three_two');
        }
        &.v3{
          @include bg-image('../../images/ic_v3_three_two');
        }
        &.v4{
          @include bg-image('../../images/ic_v4_three_two');
        }
        &.v5{
          @include bg-image('../../images/ic_v5_three_two');
        }
      }
      .avatar-img {
        @include wh(1.2rem,1.2rem);
        border-radius: 50%
      }
    }

		.flex-box {
			display: flex;
			align-items: center;
			justify-content: space-between
		}

		.user-info {
			margin-left: 0.4rem;
			.info-content {
				width: 3.5rem;
				overflow: hidden;
				.name{
					width: 95%;
          @include sc(0.3rem,$fontColor);
				}
				.subhead {
					margin-top: 0.2rem;
					@include sc(0.24rem,$fontColor);
				}
			}
		}

		.personal-center{
      padding: 0 0 0 0.2rem;
      height: 0.56rem;
      line-height: 0.56rem;
      @include sc(0.24rem,$mainColor);
      background-color: rgba(0,119,255,0.1);
      border-radius: 0.28rem 0 0 0.28rem;
      .arr-right{
        display: inline-block;
        vertical-align: top;
        margin-top: 0.05rem;
        @include wh(0.44rem,0.44rem);
        @include bg-image('../../images/ic_more_blue_three_two');
      }
    }

    .table-view {
      background: $white;
      margin-top: 0.2rem;
      padding: 0 0.3rem;
      .cell {
        @extend .flex-box;
        padding: 0.3rem -0.3rem;
        height: 0.8rem;
        .img-style {
          display: inline-block;
          vertical-align: middle;
          width: 0.44rem;
          height: 0.44rem;
          margin-right: 0.1rem;
          &.link-server{
            @include bg-image('../../images/ic_kefu_three_two');
          }
          &.group{
            @include bg-image('../../images/ic_wodepingtuan_three_two');
          }
          &.help{
            @include bg-image('../../images/ic_bangzhu_three_two');
          }
          &.order{
            @include bg-image('../../images/ic_dingdan_chosed_three_two');
          }
          &.invoice{
            @include bg-image('../../images/ic_piaoju_three_two');
          }
          &.contract{
            @include bg-image('../../images/ic_lianxiren_three_two');
          }
          &.appeal{
            @include bg-image('../../images/ic_wodexuqiu_three_two');
          }
          &.care{
            @include bg-image('../../images/ic_wodeguanzhu_three_two');
          }
          &.wallet{
            @include bg-image('../../images/ic_wodeqianbao_three_two');
          }
          &.enquire{
            @include bg-image('../../images/ic_xunjia_three_two');
          }
          &.invite{
            @include bg-image('../../images/ic_yaooqing_three_two');
          }
        }

        .img-text {
          @include sc(0.28rem,#333);
          vertical-align: middle
        }
        .arrow-box{
          .gray-arrow{
            display: inline-block;
            @include wh(0.44rem,0.44rem);
            @include bg-image('../../images/icon_more_gary');
          }
        }
      }
      .has-divider {
        border-bottom: 1px solid #ddd ;
      }
    }

	}
  .hadCertified {
    color: $mainColor;
  }

</style>
