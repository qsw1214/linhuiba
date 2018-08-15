<template>
  <div class="publishing-permissions">
    <v-head path="/admin/profile" isFixed="true">
      <div slot="center-part">申请发布权限</div>
    </v-head>
    <section action="javascript:;" class="login-modal">
      <tips v-show="status === 0"><div slot="text">您的申请正在审核中，如需更改，请重新提交。</div></tips>
      <tips v-show="status === -1"><div slot="text">您还未提交申请,请尽快提交。</div></tips>
      <tips v-show="status === 2"><div slot="text">您的申请失败了，原因：{{ errorReason }}</div></tips>
      <label class="login-com border-1px">
        <span>联系人</span>
        <input type="text" placeholder="请输入联系人姓名" class="account" autocomplete="off" v-model.trim="name">
      </label>
      <label class="login-com border-1px">
        <span>手机号</span>
        <input type="text" placeholder="请输入手机号码" class="password" autocomplete="off" v-model.trim="phone">
      </label>
      <div class="receipt-type b-20">
        <p>收款类型：</p>
        <label class="login-com border-1px">
          <span class="flex">
            <input type="radio" id="alipay" name="pay" value="1" v-model="pay"/>
            <label for="alipay">支付宝</label>
          </span>
          <span class="flex">
            <input type="radio" id="weChat" name="pay" value="2" v-model="pay"/>
            <label for="weChat">微信</label> 
          </span>
          <span class="flex">
            <input type="radio" id="bankCard" name="pay" value="3" v-model="pay"/>
            <label for="bankCard">银行卡</label>  
          </span>
        </label>
      </div>
      <label class="login-com border-1px" v-show="pay === '1'">
        <span>收款账号</span>
        <input type="text" placeholder="请输入支付宝账号" class="password" autocomplete="off" v-model.trim="alipayAccount">
      </label>
      <label class="login-com border-1px" v-show="pay === '2'">
        <span>收款账号</span>
        <input type="text" placeholder="请输入微信账号" class="password" autocomplete="off" v-model.trim="weAccount">
      </label>
      <label class="login-com border-1px" v-show="pay === '3'">
        <span>开户行</span>
        <input type="text" placeholder="请填写开户行" class="password" autocomplete="off" v-model.trim="bank">
      </label>
        <label class="login-com border-1px" v-show="pay === '3'">
        <span>银行账号</span>
        <input type="text" placeholder="请输入银行账号" class="password" autocomplete="off" v-model.trim="bankAccount">
      </label>
    </section>

    <div class="account-lists">
      <div class="account-list" v-for="item in payAccount" :key="item.id">
        <span class="pay-types">{{ item.pay_type }}</span>
        <span class="pay-account">{{ item.account }}</span>
        <span class="pay-delete" @click="delAccount(item.id)">删除</span>
      </div>
    </div>

    <div class="clear other-login">
      <div class="right">
        <router-link class="phone-login" :to="{ path : '/publishingPermissions/addAccount' }">添加更多账号<span class="arrow"></span></router-link>
      </div>
    </div>

    <div class="login-submit" :class="name && phone ?  'active' : ''" ref="submit" @click="saveInfo">
      保存
    </div>
    <transition name="router-slid" mode="out-in">
        <router-view ></router-view>
    </transition>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead'
  import tips from 'src/components/tips'
  // import vUploadImg from 'src/components/vUploadImg';
  import { mapState, mapActions } from 'vuex'
  import { propertyApplications, getUserPayeeInfor, GetUserPermissionData, delUserPayInfor } from 'src/service/getData'
  import { MOBILE_REG , PASSWORD_REG , COMPANY_REG, CHINESE, REGPOS } from '../../config/data' ;
import { setTimeout } from 'timers';
  export default {
    data () {
      return {
        name: '',
        phone: '',
        pay: '1',
        alipayAccount: '',
        weAccount: '',
        bankAccount: '',
        bank: '',
        payAccount: [],
        errorMsg: '',
        status: -1,
        errorReason: ''
      }
    },
    components: { vHead, tips },
    computed: {
      ...mapState([
        'userProfile'
      ])
    },
    async mounted() {
      await this.initData()
      this.getUserPermissionData()
      // if (this.userProfile.enterprise_authorize_status == 2 || this.userProfile.enterprise_authorize_status == 0 ) {
      //   // this.errorMsg = 
      // }
      this.getUserInfor()
    },
    methods: {
      ...mapActions([
        'getUserProfile',
      ]),
      getUserPermissionData () {
        GetUserPermissionData().then(res => {
          this.name = res.result.contact
          this.status = res.result.status
          this.errorReason = res.result.reason
        }).catch(err => {
          this.status = -1
        })
        if (this.status == -1) {
          this.phone = this.userProfile.mobile
        }
      },
      getUserInfor () {
        getUserPayeeInfor().then(res => {
          this.payAccount = res.result
        }).catch(e => {
          this.$vux.toast.text(e.msg, 'middle')
        })
      },
      async initData() {
        this.$vux.loading.show({ text: 'loading...' });
        await this.$store.dispatch('getUserProfile');
        this.$vux.loading.hide();
      },
      saveInfo () {
        if (!this.name) {
          this.$vux.toast.text('请正确填写联系人', 'middle');
          return
        }
        if (!MOBILE_REG.test(this.phone)) {
          this.$vux.toast.text('请输入11位有效手机号', 'middle')
          return
        }
        let params = {
          contact: this.name,
          mobile: this.phone,
          pay_type: 0,
          account: '',
          opening_bank: ''
        }
        if (this.pay === '1') {
          params.pay_type = 4
          params.account = this.alipayAccount
          params.opening_bank = ''
        } else if (this.pay === '2') {
          params.pay_type = 3
          params.account = this.weAccount
          params.opening_bank = ''
        } else {
          params.pay_type = 2
          if (!REGPOS.test(this.bankAccount)) {
            this.$vux.toast.text('请输入正确的银行卡号', 'middle')
            return
          }
           if (!CHINESE.test(this.bank)) {
            this.$vux.toast.text('请输入正确的开户地', 'middle')
            return
          }
          params.account = this.bankAccount
          params.opening_bank = this.bank
        }
        if (!params.account) {
          this.$vux.toast.text('请输入收款账号', 'middle')
          return
        }
        if (this.pay === '3') {
          if (!params.opening_bank) {
            this.$vux.toast.text('请输入开户地', 'middle')
          }
        }
        propertyApplications(params).then(res => {
          if (res.code === 1) {
            this.$vux.toast.text('申请成功', 'middle');
            this.alipayAccount = ''
            this.weAccount = ''
            this.bankAccount = ''
            this.bank = ''
            this.getUserPermissionData()
            this.getUserInfor()
          } else if (res.code === -101) {
            this.$vux.toast.text('已拥有发布权限', 'middle');
          } else {
            this.$vux.toast.text('请重新申请', 'middle');
          }
        }).catch(e => {
          this.$vux.toast.text(e.msg, 'middle');
        })
      },
      delAccount (id) {
        let that = this;
        this.$vux.confirm.show({
          confirmText: '确认',
          cancelText: '取消',
          title: '是否删除',
          content: '确认删除这条信息吗？',
          onConfirm() {
            delUserPayInfor(id).then(res => {
            that.getUserInfor()
          }).catch(e => {
            that.$vux.toast.text(err.msg , 'middle');
          })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .2s;
  }
  .router-slid-enter {
    transform: translateX( 100% );
  }
  .router-slid-leave-active{
    opacity: 0;
  }
  .login-modal {
    background-color: white;
    .login-com {
      padding: 0 0.28rem;
      display: flex;
      align-items: center;
      height: 1.1rem;
      @include bb-1px( #e8e8e8 );
      > span {
        font-size: 0.32rem;
        color: #282A2A;
        letter-spacing: 0;
        line-height: 0.32rem;
        padding-right: 0.74rem;
      }
      > input {
        flex: 1;
        font-size: 0.28rem;
        color: #666;
      }
    }
  }
  .b-20 {
    border-top: .22rem solid #f0f0f0
  }
  .receipt-type {
    > p {
      padding: 0.4rem 0.28rem .1rem 0.33rem;
      font-size: .28rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .28rem;
    }
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
  .flex {
    flex: 1;
  }

  .other-login {
    margin-top: 0.22rem;
    padding: 0 0.28rem;
    a {
      color: $mainColor ;
      font-size: 0.24rem;
    }
  }
  .arrow {
    @include bg-image( '../../images/ic_chakan_three_three');
    display: inline-block;
    width: .3rem;
    height: .3rem;
    position: relative;
    top: .045rem;
  }
  .login-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $noEnter;
  }
  .active {
    background-color: $mainColor;
  }
  .account-lists {
    padding: 0 .28rem;
    font-size: .26rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: 0.32rem;
    .account-list {
      padding: .2rem 0;
      .pay-types {
        padding-right: .26rem;
      }
      .pay-account {
        
      }
      .pay-delete {
        color: $mainColor;
        float: right;
        line-height: .37rem;
      }
    }
  }
</style>
