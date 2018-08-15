<template lang="html">
	<div class="wallet-password">
		<v-head go-back="true">
	    <div slot="center-part">支付密码</div>
	  </v-head>
	  <div class="header-title">
	  	<div :class="{active:stepOne}">
	  		1.验证身份
	  	</div>
	  	<div class="arrow-box">
				<span class="gray-arrow"></span>
			</div>
	  	<div :class="{active:stepTwo}">
	  		2.设置密码
	  	</div>
	  	<div class="arrow-box">
				<span class="gray-arrow"></span>
			</div>
	  	<div :class="{active:stepThree}">
	  		3.确认密码
	  	</div>
	  </div>
	  <div v-if="stepOne">
	  	<div class="input-box">
	  		<input type="number" name="" placeholder="请输入手机号" v-model="mobile" disabled>
	  		<span class="input-text" :class="{active:checkPhone}" @click="sendCode" v-show="!sendTime">获取验证码</span>
	  		<span class="input-text" @click.prevent v-show="sendTime">已发送({{ sendTime }}s)</span>
	  	</div>
	  	<div class="input-box">
	  		<input type="number" v-model="captcha" :disabled="!sendTime" placeholder="请输入6位数字验证码">
	  	</div>
	  </div>
	  <div class="step" v-if="stepTwo">
	  	<div class="align-center">
	  		输入6位支付密码
	  	</div>
	  	<div class="password-box">
	  		<input type="text" class="real-input" v-model="password">
	  		<div class="bogus-input">
	  			<input type="password" :value="password ? password[0] : ''" disabled/>
					<input type="password" :value="password ? password[1] : ''" disabled/>
					<input type="password" :value="password ? password[2] : ''" disabled/>
					<input type="password" :value="password ? password[3] : ''" disabled/>
					<input type="password" :value="password ? password[4] : ''" disabled/>
					<input type="password" :value="password ? password[5] : ''" disabled/>
	  		</div>
	  	</div>
	  </div>
	  <div class="step" v-if="stepThree">
	  	<div class="align-center">
	  		确认6位支付密码
	  	</div>
	  	<div class="password-box">
	  		<input type="text" class="real-input" v-model="passwordConfirmation">
	  		<div class="bogus-input">
	  			<input type="password" :value="passwordConfirmation ? passwordConfirmation[0] : ''" disabled/>
					<input type="password" :value="passwordConfirmation ? passwordConfirmation[1] : ''" disabled/>
					<input type="password" :value="passwordConfirmation ? passwordConfirmation[2] : ''" disabled/>
					<input type="password" :value="passwordConfirmation ? passwordConfirmation[3] : ''" disabled/>
					<input type="password" :value="passwordConfirmation ? passwordConfirmation[4] : ''" disabled/>
					<input type="password" :value="passwordConfirmation ? passwordConfirmation[5] : ''" disabled/>
	  		</div>
	  	</div>
	  </div>
	  <!-- <transition name="router-slid" mode="out-in">
	        <router-view></router-view>
	      </transition> -->
	</div>
</template>

<script>
	import vHead from '../../../components/vHead'
	import { Toast } from 'vux'
	import { sendMsg, walletPwd, walletPwdReset } from '../../../service/getData'
	import { getSession, setSession } from '../../../config/tools'
	import { MOBILE_REG, PIN_REG } from '../../../config/data'

	// 未开通钱包时执行开通钱包功能
	// 已开通钱包时执行重置支付密码功能
	export default {
		data() {
			return {
				mobile: '',
				captcha: '',
				password: '',
				passwordConfirmation: '',
				sendTime: 0,
				stepOne: true,
				stepTwo: false,
				stepThree: false,
				type: getSession("setWalletPassword") ? getSession("setWalletPassword") : ''
			}
		},
		components: {
			vHead,
			Toast,
		},
		mounted() {
	  	this.init();
	  },
	  computed: {
	  	checkPhone: function() {
	  		return MOBILE_REG.test(this.mobile);
	  	}
	  },
	  watch: {
	  	captcha: function() {
	  		if(this.captcha.length == 6) {
		  		if(!PIN_REG.test(this.captcha)) {
		  			this.$vux.toast.text("请输入6位数字验证码");
		  			return;
		  		}
		  		else {
	  				this.stepOne = false;
	  				this.stepTwo = true;
	  			}
		  	}
		  	else if(this.captcha.length > 6) {
		  		this.$vux.toast.text("请输入6位数字验证码");
		  		return;
		  	}
	  	},
	  	password: function() {
	  		this.password = this.password.replace(/[^\d]/g,'');
	  		if(this.password.length == 6) {
	  			if(!PIN_REG.test(this.captcha)) {
	  				this.$vux.toast.text("请输入6位数字密码");
		  			return;
	  			}
	  			else {
	  				this.stepTwo = false;
	  				this.stepThree = true;
	  			}
	  		}
	  	},
	  	passwordConfirmation: function() {
	  		this.passwordConfirmation = this.passwordConfirmation.replace(/[^\d]/g,'');
	  		if(this.passwordConfirmation.length == 6) {
	  			if(!PIN_REG.test(this.captcha)) {
	  				this.$vux.toast.text("请输入6位数字密码");
		  			return;
	  			}
	  			else {
	  				if(this.password !== this.passwordConfirmation) {
	  					this.$vux.toast.text("两次密码输入不一致");
	  					this.stepTwo = true;
	  					this.stepThree = false;
	  					this.password = "";
	  					this.passwordConfirmation = "";
	  				}
	  				else {
	  					let params = {
	  						password: this.password,
	  						password_confirmation: this.passwordConfirmation,
	  						mobile: this.mobile,
	  						captcha: this.captcha
	  					};
	  					if(this.type) {
		  					walletPwd(params).then(res => {
		  						if(res.code == 1) {
		  							this.$vux.toast.text("设置支付密码成功");
		  							setSession("setWalletPassword",false);
		  							this.$router.push('/wallet');
		  						}
		  						else {
		  							this.$vux.toast.text(res.msg);
		  							this.init();
		  						}
		  					}).catch(err => {
		  						this.$vux.toast.text(err.msg);
		  						this.init();
		  						return;
		  					})
		  				}
		  				else {
		  					walletPwdReset(params).then(res => {
		  						if(res.code == 1) {
		  							this.$vux.toast.text("重置支付密码成功");
		  							this.$router.go(-1);
		  						}
		  						else {
		  							this.$vux.toast.text(res.msg);
		  							this.init();
		  						}
		  					}).catch(err => {
		  						this.$vux.toast.text(err.msg);
		  						this.init();
		  						return;
		  					})
		  				}
	  				}
	  			}
	  		}
	  	}
	  },
		methods: {
			init() {
				let userInfo = getSession('userInfo');
				this.mobile = userInfo.mobile;
				this.captcha = '';
				this.password = '';
				this.passwordConfirmation = '';
				this.sendTime = 0;
				clearInterval(this.timer);
				this.stepOne = true;
				this.stepTwo = false;
				this.stepThree = false;
			},
			sendCode() {
				if(!this.mobile) {
					this.$vux.toast.text("请您先绑定手机号码");
    			return;
				}
				else if(!this.checkPhone) {
					this.$vux.toast.text("无效的手机号码");
    			return;
				}
				else {
					let params = {
						account: this.mobile,
						usage: 3
					};
					sendMsg(params).then(res => {
						if(res.code == 1) {
							this.sendTime = 60;
							this.timer = setInterval(() => {
			            this.sendTime --;
			            if (this.sendTime == 0) {
			              clearInterval(this.timer)
			            }
			          }, 1000);
						}
						else {
							this.$vux.toast.text(res.msg);
							return;
						}
					}).catch(err => {
						this.$vux.toast.text(err.msg);
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../style/mixin";
	.wallet-password {
		@include allcover;
		@include wh(100%, 100%);
		background-color: $bgc;
    z-index: 100;
		font-size: 0.26rem;
		@mixin arrow-right($size,$thickness,$color,$distance) {
		  content: "";
		  position: absolute;
		  width: $size;
		  height: $size;
      border-style: solid;
      border-color: $color;
      border-width: 0 $thickness $thickness 0;
		  -webkit-transform: rotate(315deg);
		          transform: rotate(315deg);
		  right: $distance;
		}

		.arrow-box {
		 	position: relative;
		 	.gray-arrow {
		 		@include arrow-right(0.15rem,1px ,#666,0);
		 		top: -0.1rem;
		 	}
		}

		.flex {
			display: flex;
			align-items: center;
			justify-content: space-around
		}

		.active {
			color: $mainColor
		}

		.align-center {
			text-align: center
		}

		.header-title {
			@extend .flex;
			height: 0.8rem;
			line-height: 0.8rem;
			background: #fafafa
		}

		.input-box {
			position: relative;
			border-top: 1px solid #eee;
			padding: 0.25rem 0.3rem;
			background:#fff;
			input {
				width: 100%
			}
			.input-text {
				position: absolute;
				right: 0;
				top: 0;
				padding: 0.25rem 0.3rem;
				border-left: 1px solid #eee
			}
		}

		.step {
			margin: 0.6rem auto;
		}

		.password-box {
			position: relative;
			margin: 0.6rem auto;
			width: 90%;
			height: 1rem;
			.bogus-input {
				position: absolute;
				width: 100%;
				height: 100%;
				border: 1px solid #ccc;
				overflow: hidden;
				z-index: 0;
				border-radius: 0.14rem;
				input {
					padding: 0;
					width: 16.65%;
					height: 100%;
					float: left;
					background: $white;
					@extend .align-center;
					border: none;
					outline: 0;
					border-right: 1px solid #ccc
				}
				input:last-child {
					border-right: 0;
				}
			}
			.real-input {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0
			}
		}
	}
</style>
