<template lang="html">
<div class="fullpage-container">
  <div class="fullpage-wp" v-fullpage="opts">
    <div class="page-1 page">
      <div class="label" v-animate="{value: 'hinge' , delay : 1200 }">春季招聘</div>
    </div>
    <div class="page-2 page">
      <div class="part-2 first" v-animate="{value: 'bounceInLeft'}">
        <div class="tit">简介：</div>
        <div class="cont">
          邻汇吧是国内拥有场地数量最多、场地数据最多、场景类型最多，品牌用户最多，每年场次数最多的快闪场地租赁平台。
        </div>
      </div>
       <div class="part-2 two" v-animate="{value: 'lightSpeedIn' , delay : 600 }">
        <div class="tit">业绩：</div>
        <div class="cont">
          2015年成立至今，公司已经完成了4轮融资，
          拥有北上广深杭成都武汉7个分公司，覆盖城市超过20个。
          在2017年，公司已经完成了7万次线下活动，同比增长近7倍，累积场地超过14000个，
          单日覆盖4000万人流量。
        </div>
      </div>
      <div class="part-2 three" v-animate="{value: 'bounceInLeft', delay : 1200 }">
        <div class="tit">团队：</div>
        <div class="cont">
          天猫商城、阿里旅行创始运营总监南哥曾进驻湖畔花园，现在进驻了邻汇吧。
          还有淘宝产品委员会秘书长小云云准备用他170多斤的身躯带飞我们。
          以及来自英伟达、NEC、腾讯、蓝标、分众的强大腰杆力量和一批不拼啥就拼命的基层团队。
        </div>
      </div>

    </div>
    <div class="page-3 page">
      <div class="number">01</div>
      <div class="price-job">薪资与职位<p class="tips">点击职位可查看详情</p></div>

      <div class="circle"></div>
      <div class="swiper-wp">

      <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
               <div class="job">
              <div class="tit">业务部</div>
              <div class="cont">
                <router-link :to="{ name : 'recruitDetail' , params : { id : 1 } }" class="item">
                  <span>商家拓展专员</span>
                  <span>7-12K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 2 } }">
                  <span>资源拓展专员</span>
                  <span>7-12K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 3 } }">
                  <span>销售总监</span>
                  <span>10-20K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 4 } }">
                  <span>城市经理</span>
                  <span>8-12K</span>
                </router-link>
              </div>
              <div class="bm">
                <span>城市：</span>
                <span>杭州 北京 上海 深圳 广州 成都</span>
              </div>
            </div>
            </div>
            <div class="swiper-slide">
            <div class="job">
              <div class="tit">技术部</div>
              <div class="cont">
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 7 } }">
                  <span>PHP开发工程师</span>
                  <span>10-20K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 8 } }">
                  <span>前端开发工程师</span>
                  <span>10-20K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 9 } }">
                  <span>前端开发主管</span>
                  <span>15-20K</span>
                </router-link>
                <!--<div class="item ign">-->
                  <!--<span>......</span>-->
                  <!--<span>......</span>-->
                <!--</div>-->
              </div>
              <div class="bm">
                <span>城市：</span>
                <span>杭州</span>
              </div>
            </div>
            </div>
            <div class="swiper-slide">
            <div class="job">
              <div class="tit">运营部</div>
              <div class="cont">
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 5 } }">
                  <span>产品运营</span>
                  <span>7-12K</span>
                </router-link>
                <router-link class="item" :to="{ name : 'recruitDetail' , params : { id : 6 } }">
                  <span>电销主管</span>
                  <span>7-12K</span>
                </router-link>
                 <!--<div class="item ign">-->
                  <!--<span>......</span>-->
                  <!--<span>......</span>-->
                <!--</div>-->
                <!--<div class="item ign-two">-->
                  <!--<span>......</span>-->
                  <!--<span>......</span>-->
                <!--</div>-->
              </div>
              <div class="bm">
                <span>城市：</span><span>杭州</span>
              </div>
            </div>
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>

      </div>

      </div>
    </div>

    <div class="page-4 page">
      <div class="number">02</div>
      <div class="big-tit">员工评语</div>
      <div class="circle"></div>
      <div class="txt product" v-animate="{ value : 'bounceInDown', delay : 600 }">邻汇吧给我的感觉就像一所倒给钱的学校，会有人真正的关心你未来的成长方向，有困惑可以一起探讨，在犯错的时候也会像家人一样直接告诉你错在哪，应该怎么做才能更好（就是犯了错要发红包就好）。很注重沟通（老板经常12点以后炸群）。特别特别喜欢邻汇吧的氛围，某天的下午茶是狗哥妈妈亲手做的永康饼，至今印象深刻！因为狗哥来问我们收钱了。
                                      <p class="rt">——来自人事部的伙伴</p>
      </div>
      <div class="txt product" v-animate="{ value : 'bounceInUp', delay : 600  }">毕业之后就加入了邻汇吧，在这一年多的时间里，有比我更年轻的95后小伙伴加入，也有来自阿里、蓝标等大企业的“大佬”们的加盟。只要你愿意花时间和精力去学，总有人能成为你的导师，总有人看得到你做出的努力。公司的经营理念和盈利模式逐渐被市场验证，我们在撕裂般的成长的同时，邻汇吧也变得越来越强大，这是一件很让人兴奋的事。
                                      <p class="rt">——来自业务部的伙伴</p>
      </div>
    </div>

    <div class="page-5 page">
      <div class="number">03</div>
      <div class="big-tit">客户评语</div>
      <div class="circle"></div>
      <div class="txt"  v-animate="{ value : 'rotateIn' }">
        邻汇吧拥有的场地非常丰富，覆盖城市也多，不管是商场还是写字楼，都能满足我们公司在不同城市做快闪营销的需求。
        <p class="rt">——快消品牌客户</p>
      </div>
      <div class="txt"  v-animate="{ value : 'zoomInLeft' }">我们从16年就开始使用邻汇吧的服务，邻汇吧平台上拥有非常多的小区，对我们摆客来说，使用邻汇吧能够得到很多人群流量相关的数据，还有其他去过的人的评价，省去了我们踩点的大把时间。
         <p class="rt">——零售客户</p>
      </div>
      <div class="txt" v-animate="{ value : 'zoomInRight' }">邻汇吧的产品做得非常好：在线接单、年底数据报告，让我们的闲置场地产生新的经营收入的同时，还丰富了我们园区的生活。
         <p class="rt">——物业方</p>
      </div>
      <div class="join-me"></div>
      <div class="email">hr@linhuiba.com</div>
      <div class="bb-circle" v-animate="{ value : 'fadeIn' , delay : 1200 }"></div>
    </div>
  </div>
  <div class="pull">
    <span class="icon"></span>
  </div>
</div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
import { wxshare } from 'src/config/wechatShare';
export default {
  data () {
    return {
      opts: {
        start: +this.$store.state.page || 0,
        dir: 'v',
        duration: 500,
        loop: true ,
        beforeChange: function (prev, next) {
        },
        afterChange: function (prev, next) {
          return false ;
        }
      }
    }
  },

  mounted(){
    var swiper = new Swiper('.swiper-container', {
      paginationClickable: true,
      loop: true,
      speed: 600,
      autoplay: {
        delay : 4000
      } ,
      pagination: {
        el: '.swiper-pagination',
      },
      onTouchEnd: function() {
        swiper.startAutoplay()
      }
    });
    wxshare({
      title : '听说，你五行缺伯乐？',
      desc : '邻汇吧正诚聘英才，期待与众不同的你' ,
      imgUrl : 'https://cert.linhuiba.com/FrXKfWg2fZjFtwGpYroq9s0EifoC',
      link :   window.location.origin + '?from=singlemessage'+ window.location.hash
    });
  }
}
</script>
<style lang="scss">
  .swiper-pagination-bullet{
    width: 0.2rem !important;
    height: 0.2rem !important;
    &.swiper-pagination-bullet-active{
      background-color: #0077FF !important;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";

  .fullpage-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .page-1{
      background: url('../../images/page1.png') top center no-repeat;
      background-size: 100% auto;
      .label{
        position: absolute;
        top: 0;
        left: 0.8rem;
        @include wh(1.14rem,1.2rem);
        padding: 0.2rem;
        background-color: #0F41F9;
        border-radius: 0 0 0.2rem 0.2rem;
        @include sc(0.35rem,#fff);
      }
    }
    .page-2{
      padding: 0 0.4rem;
      background: #F1F0FD;
      .first{
        padding-top: 0.6rem;
      }
      .two{
        padding-top: 0.5rem;
      }
      .three{
        padding-top: 0.5rem;
      }
      .tit{
        font-family: FZLTDHK--GBK1-0;
        font-size: 0.32rem;
        font-weight: bold;
        color: #3234CA;
        letter-spacing: 0;
        line-height: 0.32rem;
      }
      .cont{
        margin-top: 0.1rem;
        font-family: PingFangSC-Medium;
        font-size: 0.26rem;
        color: #808CCB;
        letter-spacing: 0.22px;
        line-height: 0.4rem;
      }
    }
    .page-3{
      background: #F1F1FF;
      .number{
        opacity: 0.5;
        font-family: HelveticaNeue-CondensedBlack;
        font-size: 1.76rem;
        color: #DFDDF4;
        letter-spacing: 0;
        line-height: 1.76rem;
      }
      .circle{
        position: absolute;
        top: 0.5rem;
        right: 0;
        @include wh(2.2rem,1.8rem);
        @include bg-image('../../images/ic_yellow_three_two');
      }
      .price-job{
        position: relative;
        padding: 1rem 0 0.5rem;
        font-family: FZZCHJW--GB1-0;
        font-size: 0.56rem;
        color: #3234CA;
        letter-spacing: 0;
        line-height: 0.56rem;
        text-align: center;
        .tips{
          margin-top: 0.05rem;
          @include sc(0.24rem, $orange );
          animation: pointScale 1.5s infinite;
        }
      }
      .swiper-container {
        width: 100%;
        height: 7.5rem;
      }

      .job{
        position: relative;
        @include wh(5.5rem,6.24rem);
        padding: 0 0.4rem 0.5rem;
        margin: 0 auto;
        background-image: linear-gradient(-180deg, #3244F7 0%, #58B8F3 100%);
        border-radius: 0.16rem;
        box-shadow: 0 0.1rem 0.4rem 0 #58B8F3;
        .tit{
          position: relative;
          padding: 0.6rem 0;
          text-align: center;
          font-family: FZZCHJW--GB1-0;
          font-size: 0.36rem;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 0.36rem;
          &:before{
            content: '';
            position: absolute;
            top: 50%;
            left: 1.3rem;
            @include wh(0.3rem,0.02rem);
            background-color: #fff;
          }
          &:after{
            content: '';
            position: absolute;
            top: 50%;
            right: 1.3rem;
            @include wh(0.3rem,0.02rem);
            background-color: #fff;
          }
        }
        .cont{
          .item{
            display: flex;
            justify-content: space-between;
            height: 0.7rem;
            padding: 0 0.3rem;
            align-items: center;
            margin-bottom: 0.2rem;
            font-family: PingFangSC-Regular;
            font-size: 0.3rem;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 0.3rem;
            background-color: rgba(243,241,255,0.3);
            border-radius: 0.08rem;
            &.ign{
              background-color: rgba(243,241,255,0.2);
              border-radius: 0.08rem;
              color: rgba(255,255,255,0.3);
            }
            &.ign-two{
              background-color: rgba(243,241,255,0.05);
              border-radius: 0.08rem;
              color: rgba(255,255,255,0.3);
            }
          }
        }
        .bm{
          position: absolute;
          bottom: 0.5rem;
          left: 0.15rem;
          padding: 0.15rem 0 0 0.3rem;
          @include sc(0.24rem, #fff);
        }
      }

    }
    .page-4{
      background: #0220B4;
      .circle{
        position: absolute;
        top: 1.3rem;
        left: 0.9rem;
        z-index: 1;
        @include wh(0.76rem,0.76rem);
        border-radius: 50%;
        background-image: linear-gradient(-151deg, #75C3FD 12%, #447CF5 93%);
        animation: pointShadow 1s infinite;
      }
    }
    .page-5{
      background-color: #0220B4;
      .circle{
        position: absolute;
        top: 1.5rem;
        right: 0.32rem;
        z-index: 1;
        @include wh(0.6rem,0.6rem);
        border-radius: 50%;
        background-image: linear-gradient(-159deg, #43E9A6 29%, #17A26A 91%);
        box-shadow: 0 0 0.1rem #17A26A;
        animation: pointScale 1.5s infinite;
      }
      .bb-circle{
        position: relative;
        bottom: 1.5rem;
        left: 0.1rem;
        @include wh(2.48rem,2.16rem);
        @include bg-image('../../images/ic_red_three_two');
      }
      .join-me{
        @include wh(2.7rem,0.44rem);
        margin: 0.1rem auto 0;
        background: url('../../images/joinme.png') center no-repeat;
        background-size: 100% 100%;
        /*animation: pointScale 0.6s infinite;*/
      }
      .email{
        margin-top: 0.1rem;
        text-align: center;
        @include sc(0.36rem,$red);
      }
    }
    .txt{
      padding: 0.2rem;
      margin: 0 0.4rem 0.2rem;
      background-color: #FFFFFF;
      border-radius: 0.16rem;
      font-family: PingFangSC-Medium;
      font-size: 0.24rem;
      color: #8B91B1;
      letter-spacing: 0.4px;
      line-height: 0.4rem;
      @include bg-image('../../images/bg_yuangongpingyu_three_two');
      background-position: left bottom;
      background-size: 6.7rem 3.9rem;
    }
    .big-tit{
      margin: 1rem 0 0.4rem;
      text-align: center;
      font-family: FZZCHJW--GB1-0;
      font-size: 0.56rem;
      color: #F1F1FF;
      letter-spacing: 0;
      line-height: 0.56rem;
    }
    .number{
      position: absolute;
      top: 0.2rem;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.1;
      font-family: HelveticaNeue-CondensedBlack;
      font-weight: bold;
      font-size: 1.76rem;
      color: #DFDDF4;
      letter-spacing: 0;
      line-height: 1.76rem;
    }
  }
  .pull{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.9rem;
    text-align: center;
    .icon{
      display: inline-block;
      @include wh(0.9rem,0.9rem);
      @include bg-image('../../images/ic_down_three_two');
      animation: scroll 1s infinite;
    }
  }
  @keyframes pointScale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100%{
      transform: scale(0.8);
    }
  }
  @keyframes pointShadow {
    0% {
      box-shadow: 0 0 0.05rem 0.05rem #447CF5;
    }
    25%{
      box-shadow: 0 0 0.08rem 0.08rem #447CF5;
      animation-delay : 0.1s ;
    }
    50% {
      box-shadow: 0 0 0.12rem 0.12rem #447CF5;
      animation-delay : 0.2s ;
    }
    70%{
      box-shadow: 0 0 0.16rem 0.16rem #447CF5;
      animation-delay : 0.3s ;
    }
    100%{
      box-shadow: 0 0 0.2rem 0.2rem #447CF5;
      animation-delay : 0.4s ;
    }
  }
  @keyframes scroll {
    0%{
      transform: translateY(-0.2rem);
    }
    50%{
      transform: translateY(-0.4rem);
    }
    100%{
      transform: translateY(0.1rem);
    }
  }
  @keyframes fade {
    0%{
      opacity: 0.1;
    }
    100%{
      opacity: 0.9;
    }
  }
</style>
