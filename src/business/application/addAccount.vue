<template>
  <div class="add-account">
    <v-head path="/admin/profile" isFixed="true">
      <div slot="center-part">新增收款帐号</div>
    </v-head>
    <section action="javascript:;" class="login-modal">
      <div class="receipt-type">
        <p>收款类型：</p>
        <label class="login-com border-1px">
          <span class="flex">
            <input type="radio" id="alipays" name="pay_type" value="1" v-model="pay_type"/>
            <label for="alipays">支付宝</label>
          </span>
          <span class="flex">
            <input type="radio" id="weChats" name="pay_type" value="2" v-model="pay_type"/>
            <label for="weChats">微信</label> 
          </span>
          <span class="flex">
            <input type="radio" id="bankCards" name="pay_type" value="3" v-model="pay_type"/>
            <label for="bankCards">银行卡</label>  
          </span>
        </label>
      </div>
      <label class="login-com border-1px" v-show="pay_type === '1'">
        <span>收款账号</span>
        <input type="text" placeholder="请输入支付宝账号" class="password" autocomplete="off" v-model.trim="alipayAccount">
      </label>
      <label class="login-com border-1px" v-show="pay_type === '2'">
        <span>收款账号</span>
        <input type="text" placeholder="请输入微信账号" class="password" autocomplete="off" v-model.trim="weAccount">
      </label>
      <label class="login-com border-1px" v-show="pay_type === '3'">
        <span>开户行</span>
        <input type="text" placeholder="请填写开户行" class="password" autocomplete="off" v-model.trim="bank">
      </label>
        <label class="login-com border-1px" v-show="pay_type === '3'">
        <span>银行账号</span>
        <input type="text" placeholder="请填写银行账号" class="password" autocomplete="off" v-model.trim="bankAccount">
      </label>
    </section>
    <div class="login-submit"  ref="submit" :class="alipayAccount || weAccount|| bankAccount ?  'active' : ''" @click="saveInfo">
      保存
    </div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { beneficiaryInfo } from 'src/service/getData'
import { CHINESE, REGPOS } from '../../config/data' ;
export default {
  data () {
		return {
      pay_type: '1',
      alipayAccount: '',
      weAccount: '',
      bank: '',
      bankAccount: ''
		}
  },
  components: { vHead },
  methods: {
    saveInfo () {
      let params = {}
      if (this.pay_type === '1') {
          params.pay_type = 4
          params.beneficiary_account_number = this.alipayAccount
          params.opening_bank = ''
        } else if (this.pay_type === '2') {
          params.pay_type = 3
          params.beneficiary_account_number = this.weAccount
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
          params.beneficiary_account_number = this.bankAccount
          params.opening_bank = this.bank
        }
        if (!params.beneficiary_account_number) {
          this.$vux.toast.text('请输入收款账号', 'middle')
          return
        }
        // if (this.pay === 3) {
        //   if (!params.opening_bank) {
        //     this.$vux.toast.text('请输入开户地', 'middle')
        //   }
        // }
        beneficiaryInfo(params).then(res => {
          if (res.code === 1) {
            this.$vux.toast.text('新增成功', 'middle');
            this.$router.go(-1);
            return 
          } else {
            this.$vux.toast.text('新增失败', 'middle');
          }
        }).catch(e => {
          this.$vux.toast.text(e.msg, 'middle');
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
  .add-account{
    @include allcover;
    z-index: 100;
    background-color: $bgc;
    @include wh(100%, 100%);
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
</style>


