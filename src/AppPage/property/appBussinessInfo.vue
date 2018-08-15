<template lang="html">
  <div class="business-wraper">
    <div class="item">
      <div class="item-tit">公司</div>
      <div class="item-info">{{ detail.company }}</div>
    </div>
    <div class="item">
      <div class="item-tit">行业</div>
      <div class="item-info">{{ detail.industry }}</div>
    </div>
    <div class="item">
      <div class="item-tit">产品</div>
      <div class="item-info">{{ detail.product }}</div>
    </div>
    <div class="box" v-if="detail&&detail.pic_url.length">
      <div class="tit">地推照片</div>
      <div class="img-box">
        <img v-for="(pic, index) in detail.pic_url" :src="pic" alt=" " class="previewer-demo-img" @click="show(index)" :key="index">
      </div>
    </div>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import { getBusinessInfo } from 'src/service/getData'
  import { Previewer, TransferDom  } from 'vux'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      business_id: '',
      field_order_id: '',
      user_id: '',
      detail: '',
      list: []
    }
  },
  components:{
    Previewer
  },
  created(){
    this.business_id = this.$route.query.business_id
    this.field_order_id = this.$route.query.field_order_id
    this.user_id = this.$route.query.user_id
  },
  mounted(){
    this.init()
  },
  methods:{
    show (index) {
      this.$refs.previewer.show(index)
    },
    changeImg(data){
      let arr = [];
      for(let item of data){
        let o = {
          src: item
        }
        arr.push(o)
      }
      return arr
    },
    init(){
      let id = this.business_id
      let p = {
        field_order_id: this.field_order_id,
        user_id: this.user_id
      }
      getBusinessInfo(id, p).then(res => {
        this.detail = res.result
        this.list = this.changeImg(res.result.pic_url)
      }).catch(err => {this.$vux.toast.text(err.msg, 'middle')})
    }
  }
}

</script>

<style lang="scss" scoped>
  .business-wraper{
    padding: 0.3rem 0.24rem;
    background-color: #fff;
    .item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.8rem;
      .item-tit{
        font-size: 0.28rem;
        color: #333;
      }
      .item-info{
        font-size: 0.28rem;
        color: #666;
      }
    }
    .box{
      padding-top: 0.1rem;
      .tit{
        font-size: 0.28rem;
        color: #333;
      }
      .img-box{
        display: flex;
        flex-wrap: wrap;
        >img{
          width: 1.6rem;
          height: 1.6rem;
          margin: 0.2rem 0.15rem 0 0;
        }
      }
    }
  }
</style>
