<template lang="html">
  <div class="article">

      <section class="main">
        <div class="article-top">
          <h3  class="title">
            {{article.name}}
          </h3>
          <div v-show="article.digest" class="digest"><span>摘要：</span>{{article.digest}}</div>
        </div>

        <div class="content" v-html="article.content"></div>
      </section>


  </div>
</template>

<script>

import { getArticle } from 'src/service/getData';
export default {
  data() {
    return {
      article: {}, // 文章
      id: 0
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    let id = this.id ;
    let res = await getArticle(id);
    this.article = res.result;
  }
}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.article {
  background-color: #fff;
  .main{
    padding: 0.2rem 0;
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
      justify-content: center;
      line-height: 0.6rem;
      word-break: break-all;
      font-size: 0.32rem;
      font-weight: 800;
      color: #000;
      padding: .1rem 0;
      border-bottom: 1px solid #ddd;
      margin-bottom: 0.2rem
    }
  }
  .content {
    padding: 0 0.28rem;
    overflow: hidden;
    img {
      max-width: 6rem !important;
      height: auto!important;
    }
  }
}
</style>

