<template lang="html">
  <div class="address">
      <v-head go-back="true">
        <div slot="center-part">管理联系人</div>
      </v-head>
      <section class="address-list" v-load-more="loadingMore" v-if="addressList.length" type="1">
        <div class="address-item"   v-for="(item ,index ) in addressList" :key="index">


          <div class="item-info" v-if="$route.query.Clinks" @click.stop="changeLinks(item)">
            <p class="item-name-moblie">
                <span>{{item.name}}</span>
                <span>{{item.mobile}}</span>
            </p>
            <p class="item-address">
                {{(item.province==item.city?item.city:item.province+item.city)+item.district+item.address}}
            </p>
          </div>
          <div class="item-info" v-else>
            <p class="item-name-moblie">
                <span>{{item.name}}</span>
                <span>{{item.mobile}}</span>
            </p>
            <p class="item-address">
                {{(item.province==item.city?item.city:item.province+item.city)+item.district+item.address}}
            </p>
          </div>

          <div class="item-handle">
            <div class="item-default" @click.stop="setDefaultAddress(item)">
               <icon v-if="item.is_default" class="ic icon" type="success"></icon>
               <icon v-else  class="ic" type="circle"></icon>
               <span :class="{ active : item.is_default }">默认联系人</span>
            </div>
            <div class="item-edit" @click.stop="setEditAddress(item)" >
              <i class="ic-edit"></i><span>编辑</span>
            </div>
            <div class="item-delete" @click.stop="deleteAddress(item.id)">
              <i class="ic-delete"></i><span>删除</span>
            </div>
          </div>
        </div>
        <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" background-color="transparent"></load-more>
      </section>
     <router-link class="address-add" :to="{ name: 'addAddress' }" >+添加联系人</router-link >
     <transition name="router-slid" mode="out-in">
      <router-view  @edit="initData"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { LoadMore, Icon, Confirm } from 'vux'
import { loadMore } from 'src/components/mixin'
import vHead from 'src/components/vHead'
import { getAddress, deleteAddress, editAddress } from 'src/service/getData';
import { getStorage , setSession } from 'src/config/tools';

export default {
  data() {
    return {
      addressList: [],
      data:{
        page: 1,
        pageSize: 10
      },
      showLoading: false,
      loadingTip: '正在加载...',
      end: false, // 到底了
      preventRepeatReuqest: false, // 阻止重复请求
      is_show: false,
    }
  },
  mixins: [loadMore],
  components: { vHead, Icon, LoadMore, Confirm },
  created() {

  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapMutations([
      'RECORD_EDIT_ADDRESS',
    ]),
    initData() {
      let dataConst= {
        page: 1,
        pageSize: 10
      };
      getAddress(dataConst).then(res => {
        this.addressList = res.result;
      })
    },
    deleteAddress(id) {
      let that = this;
      this.$vux.confirm.show({
        confirmText: '是',
        cancelText: '否',
        title: '删除联系人',
        content: '确认删除此联系人',
        onConfirm() {
          deleteAddress(id).then(res => {
            that.addressList = [];
            that.addressList = [] ;
              that.data = {
                page: 1,
                pageSize: 10
              };
              that.showLoading = false;
              that.loadingTip = '正在加载...';
              that.end = false;
              that.preventRepeatReuqest = false;
              that.is_show = false;
              that.initData()
          })
        }
      })

    },
    setDefaultAddress(item) {
      if(item.is_default){
        return;
      }
      item.is_default = 1;
      editAddress(item).then(res => {
        this.addressList = [];
        this.addressList = [];
          this.data = {
            page: 1,
            pageSize: 10
          };
          this.showLoading = false;
          this.loadingTip = '正在加载...';
          this.end = false;
          this.preventRepeatReuqest = false;
          this.is_show = false;
          this.initData()
      })
    },
    setEditAddress(item){

      this.RECORD_EDIT_ADDRESS(item)
      this.$router.push({ name: 'editAddress', params: { id: item.id } })

    },
    loadingMore() {
      if (this.end) {
        return;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;

      // 正在加载
      this.is_show = true;
      this.showLoading = true;

      this.data.page++;

      getAddress(this.data)
        .then(res => {
          this.addressList = [...this.addressList, ...res.result];
          // 加载完成
          this.is_show = false;
          this.showLoading = false;

          if (res.result.length < this.data.pageSize) {
            this.end = true;
            this.is_show = true;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        })
    },
    changeLinks(item){
//      console.log(item)
      let obj = {
        contact : item.name ,
        mobile : item.mobile ,
        address : item.province + item.city + item.district + item.address,
        is_default : item.is_default,
        id : item.id
      };
      if( !item.address ){
        this.$vux.toast.text('详细地址不存在，请重新编辑地址' , 'middle');
        return ;
      }
//      console.log(obj);
      setSession( 'links' , obj );
      this.$router.go(-1);
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


body {
  background: $bgc;
  // @include wh(100%, 100%);
}

.address {

 background: $bgc;
//  @include wh(100%, 100%);

  padding-bottom: 1rem;
  // 此路由下面所有的选择圈 都为主色 蓝色 大小44px
  .ic {
    font-size: 0.44rem;
    &.icon {
      color: $mainColor;
    }
  }
  .address-list {
    display: flex;
    flex-direction: column;
    background: $bgc;
    .address-item {
      background: #fff;
      margin-bottom: 0.2rem;
      padding: 0 0.28rem;
      display: flex;
      flex-direction: column;
      .item-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        @include wh(100%, 1.4rem);
        @include sc(0.28rem, #333);
        .item-name-moblie {
          display: flex;
          justify-content: space-between;
        }
        .item-address {
          @include one-ellipsis();
        }
      }
      .item-handle {
        display: flex;
        align-items: center;
        @include wh(100%, 1rem);
        @include sc(0.28rem, #666);
        @include bt-1px(#ddd);
        .item-default {
          flex: 1;
          .ic {

            font-size: 0.44rem;
            &.icon {
              color: $mainColor;
            }
          }
          span{
            &.active{
              color: $mainColor;
            }
          }
        }
        .item-edit,
        .item-delete {
          display: flex;
          align-items: center;
          margin-right: 0.6rem;
          &.item-delete {
            margin-right: 0;
          }
          .ic-edit {
            margin: 0 0.1rem;
            display: inline-block;
            @include wh(0.34rem, 0.36rem);
            @include bg-image('../../images/ic_edit_two_four_one');
          }
          .ic-delete {
            margin: 0 0.1rem;
            display: inline-block;
            @include wh(0.26rem, 0.32rem);
            @include bg-image('../../images/ic_delete');
          }
        }
      }
    }
  }
  .address-add {
    background: $mainColor;
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    line-height: 1rem;
    text-align: center;
    @include sc(0.32rem, #fff);
    @include wh(7.5rem, 1rem);
  }
}
</style>
