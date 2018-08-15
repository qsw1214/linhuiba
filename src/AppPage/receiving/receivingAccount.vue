<template lang="html">
  <div class="receiving-account">
    <div class="account-info" v-for="item in result">
      <div class="account-msg">
        <p class="account-state">账号类型:{{item.pay_type}}{{item.opening_bank ? `(${item.opening_bank})` : ''}}</p>
        <p class="account">收款账号：{{ item.account }}</p>
        <div class="account-control">
          <span class="flex">
            <input type="radio" :id="item.id" name="pay" :value="item.id" v-model="pay" @click="defaultChose(item.id)"/>
            <label :for="item.id">设为默认账号</label>  
          </span>
          <span class="right">
            <span class="account-del"></span>
            <span @click="delInfo(item.id)">删除</span>
          </span>
          <span class="right mg-20">
            <span class="account-edit"></span>
            <router-link :to="{ path : `/appEditAccount/${item.id}`}">编辑</router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPayeeInfor, delUserPayInfor, setDefaultPayAccount } from 'src/service/getData';
  export default {
    data () {
      return {
        pay: 0,
        result: []
      }
    },
    mounted () {
      this.getUserInfor()
    },
    methods: {
      getUserInfor () {
        getUserPayeeInfor().then(res => {
          this.result = res.result
          this.result.forEach(val => {
            if (val.flag === 1) {
              this.pay = val.id
            }
          });
        }).catch(e => {
          this.$vux.toast.text(e.msg , 'middle');
        })
      },
      delInfo(id) {
        console.log(id)
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
      },
      defaultChose(id) {
        setDefaultPayAccount(id).then(res => {
          this.$vux.toast.text('设置默认收款帐号成功' , 'middle');
        }).catch(e => {
          this.$vux.toast.text(e.msg, 'middle');
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.receiving-account {
  // background: #f0f0f0;
  .account-info {
    background-color: white;
    // border-top: .2rem solid #f0f0f0;
    // border-right: .2rem solid #f0f0f0;
    // border-left: .2rem solid #f0f0f0;
    margin: .2rem;
    border-radius: .08rem
  }
  .account-msg {
    padding: .5rem  .26rem 0 .26rem;
    .account-state {
      font-size: .32rem;
      color: #282A2A;
      letter-spacing: 0;
      line-height: .32rem;
      font-weight: bold;
      padding-bottom: .2rem;
    }
    .account {
      font-size: .28rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .28rem;
      padding-bottom: .3rem;
      border-bottom: 1px solid #EEEEEE;
    }
    .account-control {
      padding: .22rem 0 .24rem 0;
      font-size: .28rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .28rem;
      > span {
        > label {
          font-size: .28rem;
          line-height: .28rem;
        }
      }
    }
  }
}

.account-edit {
  @include bg-image( '../../images/ic_bianji_three_three');
  width: .56rem;
  height: .56rem;
  font-size: .4rem;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: -.02rem;
  > span {
    font-size: .24rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .24rem;
    
  }
}
.account-del {
  @include bg-image( '../../images/ic_delete_gray');
  width: .56rem;
  height: .56rem;
  font-size: .4rem;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: -.05rem;
  > span {
    font-size: .24rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .24rem;
  }
}
.mg-20 {
  margin-right: .4rem;
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


</style>

