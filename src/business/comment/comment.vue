<template lang="html">
  <div>
    <v-head goBack="true" isFixed="true">
      <div slot="center-part">发表评价</div>
      <div slot="right-part" class="submit rt" @click="submit">提交</div>
    </v-head>
    <div class="resource" v-show="resource.name">
      <img :src="resource.pic_url | half" alt="资源图片">
      <div class="resource-content">
        <p class="title ellipsis">{{ resource.name }}</p>
        <p><span class="price-pre">¥</span><span class="price">{{ resource.price/100 }}</span></p>
      </div>
    </div>
    <div class="comment-info">
      <div class="sys">
        <span class="sys-score">综合评分</span>
        <rater v-model="score"></rater>
        <span class="sys-text"
        v-text="score == 5 ? '非常好!' :
        score == 4 ? '好!' :
        score == 3 ? '一般!' :
        score == 2 ? '差!' : '非常差!'"></span>
      </div>
      <div class="people">
        <div class="border-1px bb">
          <span>现场人流量</span><input type="number" v-model="number_of_people" placeholder="请输入人数" autocomplete="off" class="number-people"><span>左右</span>
        </div>
      </div>
      <div class="comment-word">
        <group>
          <x-textarea v-model="content" :max="100" placeholder="上传该场地图片并说出您对场地10字以上真实评价(关注量，下载量等),可获得500积分。"></x-textarea>
        </group>
      </div>
      <div class="img-wraper">
        <v-upload-img :picArr="images" name="z0" max=4 region="z0" fileType="comment"></v-upload-img>
      </div>
      <div class="anonymous">
          <label><input type="checkbox" v-model="anonymity" autocomplete="off"><span>匿名评价</span></label>
      </div>
    </div>
    <div class="comment-score">
      <div class="title border-1px">
        <span class="resource-icon" :class="{ field : true , activity : $route.query.type == 3 , ads : $route.query.type == 2}"></span>
        <span v-text="$route.query.type == 3 ? '活动评分' : $route.query.type == 2 ? '广告评分' : '场地评分' "></span>
      </div>
      <ul class="score-box">
        <li class="score-item">
          <span class="com-left">人流量</span>
          <rater v-model="score_of_visitorsflowrate"></rater>
          <span class="com-text"
          v-text="score_of_visitorsflowrate == 5 ? '很多!' :
          score_of_visitorsflowrate == 4 ? '多!' :
          score_of_visitorsflowrate == 3 ? '一般!' :
          score_of_visitorsflowrate == 2 ? '少!' : '很少!'"></span>
        </li>
        <li class="score-item">
          <span class="com-left">物业配合度</span>
          <rater v-model="score_of_propertymatching"></rater>
          <span class="com-text"
          v-text="score_of_propertymatching == 5 ? '非常好!' :
          score_of_propertymatching == 4 ? '好!' :
          score_of_propertymatching == 3 ? '一般!' :
          score_of_propertymatching == 2 ? '差!' : '非常差!'"></span>
        </li>
        <li class="score-item">
          <span class="com-left">用户参与度</span>
          <rater v-model="score_of_userparticipation"></rater>
          <span class="com-text"
          v-text="score_of_userparticipation == 5 ? '非常好!' :
          score_of_userparticipation == 4 ? '好!' :
          score_of_userparticipation == 3 ? '一般!' :
          score_of_userparticipation == 2 ? '差!' : '非常差!'"></span>
        </li>
        <li class="score-item">
          <span class="com-left">目标完成度</span>
          <rater v-model="score_of_goalcompletion"></rater>
          <span class="com-text"
          v-text="score_of_goalcompletion == 5 ? '很高!' :
          score_of_goalcompletion == 4 ? '高!' :
          score_of_goalcompletion == 3 ? '一般!' :
          score_of_goalcompletion == 2 ? '低!' : '非常低!'"></span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import vUploadImg from 'src/components/vUploadImg.vue';
  import { XTextarea , Group , Rater } from 'vux';
  import { POSITIVE_INT_REG , WORLD_HTML_REG } from 'src/config/data';
  import { mapState } from 'vuex';
  import { postComments , getCommentResource } from 'src/service/getData';
  import { half } from 'src/filters';
export default {
  data () {
    return {
      content : '' , // 评论词
      score : 5 , // 综合评分
      resource : {} ,// 场地资源
      score_of_visitorsflowrate: 5 , // 人流量评分
      score_of_propertymatching: 5 , // 物业配合度
      score_of_userparticipation: 5 ,//  用户参与度
      score_of_goalcompletion: 5 , // 目标完成度
      anonymity : false , // 匿名评价
      number_of_people : '' , // 人流量
      images : [] , // 图片集
    }
  },
  filters:{ half },
  components : {
    vHead ,
    XTextarea ,
    Group ,
    Rater,vUploadImg
  },
  mounted(){
    let id = this.$route.params.id ;
    getCommentResource( id ).then( res => {
      this.resource = res.result ;
    });

  },
  computed:{
    ...mapState(['commentResource'])
  },
  methods : {
    submit(){
      // 优先检测
      if(this.content){
        if( WORLD_HTML_REG.test(this.content) ){
          this.content = '';
          this.$vux.toast.text('你输入的评论包含非法信息,请重新输入');
          return ;
        }
      }else{
        this.$vux.toast.text('请输入评论信息!');
        return ;
      }

      let id = this.$route.params.id  ;
      let params = {
        score : this.score ,
        content : this.content,
        score_of_visitorsflowrate : this.score_of_visitorsflowrate,
        score_of_propertymatching : this.score_of_propertymatching,
        score_of_userparticipation : this.score_of_userparticipation,
        score_of_goalcompletion : this.score_of_goalcompletion,
      };
      if( this.number_of_people ){
        if( !POSITIVE_INT_REG.test( this.number_of_people ) ){
          this.number_of_people = '' ;
          this.$vux.toast.text('你输入的人流量必须为数字');
          return ;
        }else{
          params.number_of_people = this.number_of_people ;
        }
      }
      if( this.images.length ){
        params.images = JSON.stringify(this.images ) ;
      }
      if( this.anonymity ){
        params.anonymity = +this.anonymity ;
      }
      postComments(id, params).then( res => {
        this.$vux.toast.show({
          type : 'success',
          text : '评论成功!'
        });
        this.$router.push({path : '/myOrder' , query : { status : 'finished' } }) ;
      }).catch(err => {
        this.$vux.toast.show({
          type :'warn',
          text : err.msg
        });
      })
    }
  }
}

</script>
<style lang="scss">
  @import "../../style/mixin";
  .vux-rater{
    margin:0 0.4rem;
    .vux-rater-box{
      font-size: 0 !important;
      width: 0.36rem!important;
      height: 0.36rem!important;
      line-height: 0.6rem!important;
      margin-right: 0.2rem !important;
      @include bg-image('../../images/ic_unselectstar_two_six');
      &.is-active{
        font-size: 0 !important;
        width: 0.36rem!important;
        height: 0.36rem!important;
        margin-right: 0.2rem !important;
        @include bg-image('../../images/ic_selectstar_two_six');
      }
      &:last-child{
        margin-right: 0 !important;
      }
    }
  }
  .weui-cells{
    margin-top: 0 !important;
    &:after{
      border-bottom: 0 none!important;
      height: 0!important;
    }
    &:before{
      border-top: 0 none!important;
      height: 0!important;
    }
    .weui-cell{
      font-size: 0.26rem;
      padding: 0.2rem 0.24rem !important;
      .weui-textarea{
        height: 1.04rem;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";
  .submit{
    font-size: 0.3rem;
  }
  .resource{
    display: flex;
    padding: 0.2rem 0.24rem;
    background-color: #fff;
    >img{
      @include wh( 0.8rem ,0.8rem );
    }
    .resource-content{
      padding-left: 0.2rem;
      font-size: 0.28rem;
      line-height: 0.4rem;
      overflow: hidden;
      .price-pre{
        font-size: 0.24rem;
      }
    }
  }
  .comment-info{
    margin-top: 0.2rem;
    background-color: #fff;
    .sys{
      padding: 0 0.24rem;
      line-height: 0.9rem;
      font-size: 0;
      @include bb-1px(#e8e8e8);
      .sys-score{
        font-size: 0.26rem;
      }
      .sys-text{
        font-size: 0.24rem;
        color: #666;
      }
    }
    .people{
      padding: 0 0.24rem ;
      line-height: 0.9rem;
      font-size: 0.26rem;
      .bb{
        @include bb-1px(#e8e8e8);
        .number-people{
          vertical-align: top;
          @include wh( 1.54rem , 0.9rem );
          margin: 0 0.3rem 0 0.4rem;
          font-size: 0.26rem;
        }
      }
    }
    .img-wraper{
      padding: 0 0.24rem;
      .img-box{
        display: flex;
        padding: 0.3rem 0;
        @include bb-1px(#e8e8e8);
        .upload{
          @include wh( 1.2rem , 1.2rem );
          @include bg-image('../../images/ic_photo_two_four_one');
        }
      }
    }
    .anonymous{
      line-height: 0.9rem;
      padding: 0 0.24rem;
      label{
        position: relative;
        display: inline-block;
        padding-left: 0.6rem;
        font-size: 0.26rem;
        input{
          position: absolute;
          top: 0.26rem;
          left: 0;
          @include wh( 0.38rem , 0.38rem );
          @include bg-image('../../images/ic_unchecked_two_four_one');
          &:checked{
            @include bg-image('../../images/ic_selected_two_four_one');
          }
        }
      }
    }
  }
  .comment-score{
    padding: 0 0.24rem;
    margin: 0.2rem 0;
    background-color: #fff;
    .title{
      line-height: 0.9rem;
      font-size: 0.28rem;
      @include bb-1px(#e8e8e8);
      .resource-icon{
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.1rem;
        @include wh( 0.36rem , 0.36rem );
        &.field{
          @include bg-image('../../images/ic_space_one_two_four');
        }
        &.activity{
          @include bg-image('../../images/ic_activity_one_two_four');
        }
        &.ads{
          @include bg-image('../../images/ic_ad_one_two_four');
        }

      }
    }
    .score-box{
      .score-item{
        line-height: 0.76rem;
        font-size: 0;
        .com-left{
          display: inline-block;
          width: 1.4rem;
          font-size: 0.26rem;
        }
        .com-text{
          font-size: 0.26rem;
          color: #666;
        }
      }
    }
  }
</style>
