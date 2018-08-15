<template lang="html">
  <div class="article">
    <router-link to="/appThematic" class="mask"></router-link>
    <app-head isFixed="true" goBack="true">
      <div slot="center-part">主题展详情</div>
      <div slot="right-part" class="rt" @click="share">
        <span class="share-icon"></span>
      </div>
    </app-head>
    <section class="main">
        <div class="article-top">
          <h3  class="title">
            {{article.name}}
          </h3>
          <div v-show="article.digest" class="digest"><span>摘要：</span>{{article.digest}}</div>
        </div>
        <div class="content">
          <div class="details" v-html="article.content"></div>
        </div>
      </section>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import appHead from 'src/components/appHead.vue';
  import { getArticle } from 'src/service/getData';
export default {
  data () {
    return {
      article: {}, // 文章
      page: '',
      id: 0
    }
  },
  components: {
    appHead
  },
  created() {
    this.$vux.loading.show();
  },
  async mounted() {
    this.id = this.$route.params.id;
    let id = this.id ;
    let res = await getArticle(id) ;
    this.article = res.result;
    this.$vux.loading.hide();
  },
  methods:{
    share(){
      let obj = this.article ;
      obj = JSON.stringify(obj);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('shareThematic', obj , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .article {
    background-color: #fff;
    .mask{
      position: fixed;
      top: 0.44rem;
      left: 0.15rem;
      width: 0.8rem;
      height: 0.9rem;
      z-index: 150;
    }
    .share-icon{
      display: inline-block;
      vertical-align: top;
      @include wh(0.44rem,0.44rem);
      margin-top: 0.22rem;
      @include bg-image('../../images/popup_ic_share');
    }
    .main{
      padding:  0 0 0.2rem;
    }
    .article-top {
      min-height: 0.5rem;
      margin: 0 0.28rem;
      .digest {
        color: #666;
        background: #fafafa;
        padding: 0.15rem 0;
        text {
          font-size: 0.14rem;
          font-weight: 800;
          color: #999;
        }
      }
      .title {
        width: 100%;
        min-height: 0.6rem;
        display: flex;
        line-height: 0.6rem;
        word-break: break-all;
        font-size: 0.32rem;
        font-weight: normal;
        color: #000;
        padding: .1rem 0;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0.2rem
      }
    }
      .content {
          padding: 0 0.28rem;
          .details{
              width: 100%;
              overflow-x: scroll;
          }
      }
  }
</style>
