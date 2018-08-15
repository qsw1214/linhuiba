<template lang="html">
  <div class="wraper">
    <div class="title">
      <div class="icon" @click.stop="link"></div>
      <div class="tit">邻汇纳贤</div>
    </div>
    <div class="job-box">
      <div class="job-item" v-if="$route.params.id==1">
        <div class="job-tit">
          <div class="tit">商家拓展专员</div>
          <p class="price">7-12K</p>
          <p class="city">岗位城市：杭州 北京 上海 深圳 广州 成都</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、拓展优质品牌客户和4A公司，如拓展汽车 房产 快消 教育等消费品行业，挖掘快闪店、线下活动推广的场地需求；</p>
                <p>2、完成每月销售目标，同时辅导商家了解公司产品；</p>
                <p>3、收集及挖掘商家需求，实现产品化；</p>
                <p>4、对品牌客户推广计划、需求有深刻了解。</p>
              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、优秀的语言表达与商业谈判能力；形象好；</p>
                <p>2、热爱销售工作，有强烈成功欲望和企图心；</p>
                <p>3、精力充沛，具备在较强压力下出色完成任务的能力；</p>
                <p>4、学习能力强，工作热情高，富有责任感，跟随公司集体的步伐完成自己的任务；</p>
                <p>5、有过广告公司、活动公司或购物中心招商企划相关经验者优先。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="job-item" v-else-if="$route.params.id==2">
        <div class="job-tit">
          <div class="tit">资源拓展专员</div>
          <p class="price">7-12K</p>
          <p class="city">岗位城市：杭州 北京 上海 深圳 广州 成都</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1.挖掘优质的线下流量场地资源，如商场、写字楼、社区、交通枢纽等场景；</p>
                <p>2.维护与深耕场地方关系，获取档期和价格优势，提高邻汇吧产品使用率；</p>
                <p>3.充分了解资源情况，协助商拓、解决商家场地的相关需求；</p>
                <p>4.及时反馈市场情况，以帮助修订公司市场策略。</p>
              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、有相关渠道、市场推广、地推经验者优先；</p>
                <p>2、踏实肯干，乐于学习；</p>
                <p>3、性格外向，善于沟通，有责任心；</p>
                <p>4、优秀的协作能力，配合销售部门的工作；</p>
                <p>5、有强烈的目标意识，按时按量完成任务。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="job-item" v-else-if="$route.params.id==3">
        <div class="job-tit">
          <div class="tit">销售总监</div>
          <p class="price">10-20K</p>
          <p class="city">岗位城市：北京 上海 深圳 广州 </p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1.负责品牌客户和4A的开发和维护；</p>
                <p>2.带领和培养销售团队，帮助个人成长；</p>
                <p>3.关注线下营销的需求动向；</p>
              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1.拥有5年以上4A公司PR部门经历，尤其是路演、event、展点、快闪店经历优先，具有广泛的人脉资源、熟悉品牌客户的关系维护；</p>
                <p>2.充满好奇心，乐于接受挑战，结果导向；</p>
                <p>3.具备战略眼光、对客户的品牌策略有深刻见解；</p>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item" v-else-if="$route.params.id==4">
        <div class="job-tit">
          <div class="tit">城市经理</div>
          <p class="price">8-12K</p>
          <p class="city">岗位城市：天津、厦门</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、制定季度计划和月度计划，将其分解部署，注重过程和结果管理；</p>
                <p>2、组建资源、销售团队，并出色管理，确保团队稳定成长； </p>
                <p>3、对市场动向有敏锐的洞察力，并针对竞品作出应对方案 。</p>

              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、有3-5年销售、BD、活动执行团队的管理经验；</p>
                <p>2、对线下流量或者广告行业有深刻认知；</p>
                <p>3、 优秀的组织、协调、沟通能力；</p>
                <p>4、有品牌和4A资源优先。</p>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item" v-else-if="$route.params.id==5">
        <div class="job-tit">
          <div class="tit">产品运营</div>
          <p class="price">7-12K</p>
          <p class="city">岗位城市：杭州</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>了解app运营各项指标及监测方式，对独立的数据分析能力，能够从数据中找到规律</p>
              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、大专及以上学历，良好的沟通协调能力；</p>
                <p>2、有3年以上互联网行业运营经验；</p>
                <p>3、工作积极主动、实干，勇于创新开拓。</p>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item" v-else-if="$route.params.id==6">
        <div class="job-tit">
          <div class="tit">电销主管</div>
          <p class="price">7-12K</p>
          <p class="city">岗位城市：杭州</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、独立搭建团队体系；</p>
                <p>2、建立电销团队绩效考核方式，激励团队，和兄弟部门完美协作。</p>

              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、大专及以上学历，良好的沟通协调能力；</p>
                <p>2、有 5年以上电话销售经验，3年左右团队管理经验；</p>
                <p>3、工作积极主动、实干，勇于创新开拓。</p>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item"  v-else-if="$route.params.id==7">
        <div class="job-tit">
          <div class="tit">PHP开发工程师</div>
          <p class="price">10-20K</p>
          <p class="city">岗位城市：杭州</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、参与邻汇吧相关产品的设计、开发、维护以及撰写开发文档</p>
                <p>2、分析改进系统架构，增强系统稳定性与安全性并提高其实际性能</p>

              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、本科及以上学历，2年及以上PHP开发经验，精通PHP以及性能分析和优化；</p>
                <p>2、熟悉MySQL数据库，熟悉SQL编写以及调优；</p>
                <p>3、熟悉面向对象的软件设计方法，对面向对象的设计模式有较深的理解并能熟练应用；</p>
                <p>4、熟悉主流开发框架，laravel框架优先考虑；</p>
                <p>5、熟悉web前端HTML（XHTML）、VUE等JS框架优先考虑；</p>
                <p>6、具有较强的自我驱动性，做事追求效率，不断自我学习者优先；</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item" v-else-if="$route.params.id==8">
        <div class="job-tit">
          <div class="tit">前端开发工程师</div>
          <p class="price">10-20K</p>
          <p class="city">岗位城市：杭州</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、参与邻汇吧相关产品的设计、开发、维护以及撰写开发文档；</p>
                <p>2、持续的优化前端体验和页面响应速度，提升web界面的友好和易用；</p>

              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、本科及以上学历，2年及以上前端开发经验，精通JS以及性能分析和优化；</p>
                <p>2、需有应用Vue的实战项目经验，深入理解W3C标准与ES规范，熟悉Web语义化，掌握盒模型、常用布局以及浏览器兼容性；</p>
                <p>3、理解并掌握JavaScript语言核心技术DOM、BOM、Ajax、JSON等；</p>
                <p>4、熟悉前端工程化与模块化开发，并有丰富实践经验；</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="job-item" v-else-if="$route.params.id==9">
        <div class="job-tit">
          <div class="tit">前端开发主管</div>
          <p class="price">15-20K</p>
          <p class="city">岗位城市：杭州</p>
        </div>
        <div class="job-cont">
          <div class="item">
            <div class="small-tit">我们需要你：</div>
            <div class="txt">
              <div>
                <p>1、主导前端技术发展方向，负责开发规范和开发方案的制定；</p>
                <p>2、参与邻汇吧相关产品的设计、开发；</p>

              </div>

            </div>
          </div>
          <div class="item">
            <div class="small-tit">我们希望你：</div>
            <div class="txt">
              <div>
                <p>1、本科及以上学历，3年及以上前端开发以及项目管理经验；</p>
                <p>2、有app与web前端工作经验者优先。</p>
                <p>3、理解并掌握JavaScript语言核心技术DOM、BOM、Ajax、JSON等；</p>
                <p>4、熟悉前端工程化与模块化开发，并有丰富实践经验；</p>
                <p>5、技术视野广阔，持续了解互联网的各种流行应用，在交互开发、用户体验等方面有自己的见解；</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="fill"></div>
    <div class="email" @click.stop="copy">投递邮箱：hr@linhuiba.com <span class="small">点击可复制</span></div>
    <textarea ref="ipt" class="hidden">hr@linhuiba.com</textarea>
  </div>
</template>

<script>
  import { wxshare } from 'src/config/wechatShare';
export default {
  data () {
    return {
      job : ''
    }
  },
  created(){
    if( +this.$route.params.id === 1 ){
      this.job = '【商家拓展专员】'
    }else if( +this.$route.params.id === 2 ){
      this.job = '【资源拓展专员】'
    }else if( +this.$route.params.id === 3 ){
      this.job = '【销售总监】'
    }else if( +this.$route.params.id === 4 ){
      this.job = '【城市经理】'
    }else if( +this.$route.params.id === 5 ){
      this.job = '【产品运营】'
    }else if( +this.$route.params.id === 6 ){
      this.job = '【电销主管】'
    }else if( +this.$route.params.id === 7 ){
      this.job = '【PHP开发工程师】'
    }else if( +this.$route.params.id === 8 ){
      this.job = '【前端开发工程师】'
    }else if( +this.$route.params.id === 9 ){
      this.job = '【前端开发主管】'
    }else{

    }
  },
  mounted(){

    wxshare({
      title : '听说，你五行缺伯乐？',
      desc : '邻汇吧正诚聘英才，期待与众不同的你' + this.job ,
      imgUrl : 'https://cert.linhuiba.com/FrXKfWg2fZjFtwGpYroq9s0EifoC',
      link : window.location.origin + '?from=singlemessage'+ window.location.hash
    });
  },
  methods:{
    link(){
      this.$store.state.page = 2 ;
      this.$router.push('/recruit');
    },
    copy(){
      let email = this.$refs.ipt ;
      email.select(); // 选择对象
      try{
        if(document.execCommand('copy', false, null)){
          document.execCommand("Copy");
          this.$vux.toast.text('已经复制好，可以粘贴' , 'middle')
        } else{
          this.$vux.toast.text('复制失败，请手动长按复制' , 'middle')
        }
      } catch(err){
        this.$vux.toast.text('复制失败，请手动长按复制' , 'middle')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .wraper{
    padding: 0.2rem 0.4rem;
    background-color: #fff;
  }
  .title{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.9rem;
    @include sc(0.34rem,$fontColor);
    padding: 0 0.3rem;
    text-align: center;
    line-height: 0.9rem;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    .icon{
      float: left;
      @include wh( 0.48rem , 0.48rem );
      margin-top: 0.2rem;
      @include bg-image("../../images/ic_back_black");
    }

  }
  .hidden{
   visibility: hidden;
  }
  .job-tit{
    margin-top: 1rem;
    padding: 0.3rem 0.4rem;
    box-shadow: 0 0 0.2rem #ccc;
    .tit{
      @include sc(0.48rem,$fontColor);
      font-weight: bold;
    }
    .price{
      margin-top: 0.2rem;
      @include sc(0.28rem,$orange);
      font-weight: bold;
    }
    .city{
      margin-top: 0.2rem;
      @include sc(0.26rem,#999);
    }
  }
  .job-cont{
    .item{
      margin-top: 0.6rem;
      .small-tit{
        @include sc(0.32rem,$fontColor);
        font-weight: bold;
      }
      .txt{
        margin-top: 0.3rem;
        @include sc(0.28rem,#666);
        line-height: 0.38rem;
        letter-spacing: 0;
      }
    }
  }
  .fill{
    @include wh(100%,1rem);
    background-color: #fff;
  }
  .email{
    position: fixed;
    bottom: 0;
    left: 0;
    @include wh(100%,1rem);
    padding-left: 0.4rem;
    line-height: 1rem;
    @include sc(0.36rem,#fff);
    background-image: linear-gradient(-90deg, #57B6F3 0%, #3856F7 100%);
    .small{
      @include sc(0.28rem,#fff);
    }
  }
</style>
