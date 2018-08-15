<template>
	<div>
    <v-head goBack="true">
      <div slot="center-part">绑定手机号</div>
    </v-head>
		<div class="input-box">
	  	<input type="number" placeholder="请输入手机号" v-model.trim="mobile">
	  	<span class="input-text" :class="{active:mobile}" @click="sendCode" v-show="!sendTime">获取验证码</span>
	  	<span class="input-text" @click.prevent v-show="sendTime">已发送({{ sendTime }}s)</span>
	  </div>
	  <div class="input-box">
	  	<input type="number" v-model.trim="captcha" :disabled="!sendTime" placeholder="请输入6位数字验证码">
	  </div>
	  <div class="btn" @click="verifyBtn">
	  	验证
	  </div>
	</div>
</template>

<script>
	import { MOBILE_REG, PIN_REG } from '../../config/data'
	import { bindMobile, sendMsg } from '../../service/getData'
	import { removeSession } from '../../config/tools'
  import vHead from 'src/components/vHead.vue'
	export default {
		data() {
			return {
				mobile: '',
				captcha: '',
				sendTime: 0,
			}
		},
    components:{vHead},
		methods: {
			verifyBtn: function(){
				if(!this.mobile) {
					this.$vux.toast.text("请输入手机号码");
					return;
				}else{
          if(!MOBILE_REG.test(this.mobile)) {
            this.$vux.toast.text("请输入有效的手机号码");
            return;
          }
        }

				if(!this.captcha) {
					this.$vux.toast.text("请输入短信验证码");
					return;
				}else{
          if(!PIN_REG.test(this.captcha)) {
            this.$vux.toast.text("请输入6位数字验证码");
            return;
          }
        }
				let params = {
					mobile: this.mobile,
					captcha: this.captcha
				};
				bindMobile(params).then(res => {
				   let redirect = this.$route.query.redirect ;
		       if(redirect) {
		         this.$router.push(redirect);
		       }
		       else {
		         this.$router.push('/admin/profile');
		       }
				}).catch(err => {
					//这里要清空上一步保存的用户信息
					removeSession(userInfo);
					removeSession(login);
					this.$vux.toast.text(err.msg);
				})

			},
			sendCode() {
        if(!this.mobile) {
          this.$vux.toast.text("请输入手机号码");
          return;
        }else{
          if(!MOBILE_REG.test(this.mobile)) {
            this.$vux.toast.text("请输入有效的手机号码");
            return;
          }
        }
				let params = {
					account: this.mobile,
					usage: 3
				};
				sendMsg(params).then(res => {
						this.sendTime = 60;
						this.timer = setInterval(() => {
			           this.sendTime --;
			           if (this.sendTime == 0) {
			             clearInterval(this.timer)
			           }
			         }, 1000);
				}).catch(err => {
					this.$vux.toast.text(err.msg);
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
  @import "../../style/mixin";
	.input-box {
		position: relative;
    line-height: 0.9rem;
		border-top: 1px solid #eee;
		padding: 0 0.24rem;
		background:#fff;
		input {
			@include wh(5rem,0.9rem);
      vertical-align: top;
      line-height: normal;
      font-size: 0.28rem;
		}

		.input-text {
			position: absolute;
			right: 0;
			top: 0;
			padding: 0 0.3rem;
			border-left: 1px solid #eee
		}
	}

	.btn {
		width: 90%;
		height: 0.88rem;
		line-height: 0.88rem;
		text-align: center;
		font-size: 0.28rem;
		border-radius: 0.04rem;
		color: #fff;
		background: $mainColor ;
		margin: 0.4rem auto
	}

	.active {
		color: $mainColor ;
	}
</style>
