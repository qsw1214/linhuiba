<template lang="html">
  <div class="enquire-wraper">
    <div class="mask" @click="back"></div>
    <app-head isFixed="true">
      <div slot="center-part">询价信息</div>
    </app-head>
    <div class="info">
      <div class="company item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">公司名称</span>
        </div>
        <div class="com-single-ipt">
          <input type="text" placeholder="请填写您的公司名称" v-model="company">
        </div>
      </div>
      <div class="product item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">产品名称</span>
        </div>
        <div class="com-single-ipt">
          <input type="text" placeholder="请填写您的产品名称" v-model="product">
        </div>
      </div>

      <div class="extend item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">所在行业</span>
        </div>
        <div class="extend-ipt">
          <popup-picker class="picker" :data="industry" v-model="selectedIndustry" value-text-align="left" :columns="2" :show-name="true"  placeholder="请选择所在行业"></popup-picker>
          <i class="down-arrow"></i>
        </div>
      </div>
      <div class="extend item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">推广形式</span>
        </div>
        <div class="extend-ipt">
          <popup-picker class="picker" :data="spread_way" v-model="selectedSpread_way" value-text-align="left" :columns="1" :show-name="true"  placeholder="请选择推广形式"></popup-picker>
          <i class="down-arrow"></i>
        </div>
      </div>
      <div class="act-time item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">活动时间</span>
        </div>
        <div class="com-double-ipt">
          <div class="ipt-com">
            <datetime class="picker" :start-date="startDate" v-model="start" placeholder="请选择开始时间"></datetime>
            <i class="down-arrow"></i>
          </div>
          <div class="ipt-com">
            <datetime class="picker" :start-date="tomorrowDate" v-model="end" placeholder="请选择结束时间"></datetime>
            <i class="down-arrow"></i>
          </div>
        </div>
      </div>
      <div class="area item">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">所需面积</span>
        </div>
        <div class="area-ipt">
          <input type="number" placeholder="请输入长度" v-model.trim="length">
          <span class="x-icon">ｘ</span>
          <input type="number" placeholder="请输入宽度" v-model.trim="width">
          <span>m</span>
        </div>
      </div>
    </div>
    <!-- ios 只显示上传图片组件 -->
    <div class="act-wraper" v-if="isIos">
      <div class="act-case">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">活动方案</span>
        </div>
        <div class="ios-img-box">
          <vUploadImg ref="vUpload" name="img" :picArr="pic_url" max=12 region='z0' fileType="cert" borderRadius="0.08rem"></vUploadImg>
        </div>
      </div>
      <p class="txt" v-if="info">（活动方案需包括：
        <span v-if="info.goal">活动目的</span>
        <span v-if="info.process">活动流程</span>
        <span v-if="info.effect_pic">效果图</span>
        <span v-if="info.license">营业执照</span>
        <span v-if="info.copying_of_id_card">执行人员身份证复印件</span>
        <span v-if="info.m_else">{{ info.m_else }}</span>
        ）
      </p>
    </div>

    <!-- 其他的可上传文件 -->
    <div class="act-wraper" v-else>
      <div class="act-case">
        <div class="com-left">
          <i class="icon">*</i><span class="tit">活动方案</span>
        </div>
        <div class="file-upload">
          <span class="upload-icon" @click.stop="chooseUpload=true" v-if="fileType==='img'? !pic_url.length : fileType==='file'?  !fileUrls.length : true "></span>
          <div class="img-box" v-if="fileType&&fileType=='img'">
            <vUploadImg ref="vimgUpload" name="img" :picArr="pic_url" max=12 region='z0' fileType="cert" borderRadius="0.08rem"></vUploadImg>
          </div>
          <div class="file-box" v-if="fileType&&fileType=='file'">
            <vUploadFile ref="vfileUpload" uploadId="file" :fileUrls="fileUrls"></vUploadFile>
          </div>
        </div>
      </div>
      <p class="txt" v-if="info">（活动方案需包括：
        <span v-if="info.goal">活动目的</span>
        <span v-if="info.process">活动流程</span>
        <span v-if="info.effect_pic">效果图</span>
        <span v-if="info.license">营业执照</span>
        <span v-if="info.copying_of_id_card">执行人员身份证复印件</span>
        <span v-if="info.m_else">{{ info.m_else }}</span>
        ）
      </p>

    </div>

    <div class="remark">
      <div class="com-left">
        <span class="tit">备注</span>
      </div>
      <div class="remark-ipt">
        <textarea v-model.trim="remark" maxlength='250' placeholder='其他服务及要求'></textarea>
      </div>
    </div>
    <div class="btns">
      <div class="submit" @click.stop="submit">提交</div>
      <p>询价成功后，邻汇吧将收取一定服务费，以报价为准</p>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="chooseUpload" hide-on-blur>
        <div class="upload-wraper">
          <div class="title">选择上传类型</div>
          <div class="select">
            <div class="img" @click.stop="chooseFileType('img')">
              <div class="bg"></div>
              <div class="txt">上传图片</div>
            </div>
            <div class="file"  @click.stop="chooseFileType('file')">
              <div class="bg"></div>
              <div class="txt">上传文档</div>
            </div>
          </div>
          <div class="close"></div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import appHead from 'src/components/appHead.vue';
  import vUploadImg from 'src/components/vUploadImg.vue' ;
  import vUploadFile from 'src/components/vUploadFile.vue' ;
  import { isMobile } from 'src/config/isMobile';
  import { PopupPicker,Picker ,Datetime , XDialog , TransferDomDirective as TransferDom } from 'vux';
  import { getDefaultenquireInfo , getDemandInfo , getIndustry , postEnquireInfo } from 'src/service/getData';
  import { FLOAT_REG , WORLD_HTML_REG } from 'src/config/data' ;
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      id : this.$route.params.id , // 售卖资源id
      industry : [],
      spread_way : [],
      info : null ,

      pic_url: [] ,//往期效果图
      fileUrls : [] , // 文档链接
      chooseUpload : false ,
      startDate : '',
      tomorrowDate : '',
      isIos : false ,
      fileType : '' ,

      selectedIndustry : [] ,
      selectedSpread_way : [],
      company : '',
      product : '',
      remark : '' ,
      start : '' ,
      end : '' ,
      length : '' ,
      width : ''
    }
  },
  components : { appHead,PopupPicker,Picker,Datetime , vUploadImg , vUploadFile , XDialog },
  created(){
    this.isIos = isMobile() > 0 ? false : true  ;
    if( this.isIos ){
      this.fileType = 'img' ;
    }
  },
  mounted(){
    this.startDate = this.todayFun();
    this.tomorrowDate = this.todayFun( true );
    this.init();
  },
  methods : {
    init(){
      getDefaultenquireInfo( this.id ).then(res=>{
        this.info = res.result;
        let { company, product, industry, spread_way } = res.result;
        if (company) this.company = company;
        if (product) this.product = product;
        this.selectedIndustry = [ industry.parent_id + '',industry.id + ''] ;
        if (spread_way) this.selectedSpread_way = [ spread_way.id + ''];
      }).catch(err => {});
      getIndustry().then(res => {
        this.industry = this.changeDataTwo(res.result)
      }).catch(err => {});
      getDemandInfo().then(res => {
        this.spread_way = this.changeData(res.result.spreadway);
      }).catch(err => {});
    },
    todayFun( arg ){
      let time = new Date().getTime() + 1*24*60*60*1000;
      if( arg ){
        // 后天
        time += 1*24*60*60*1000;
      }
      let y = new Date(time).getFullYear();
      let m = new Date(time).getMonth() + 1;
      let d = new Date(time).getDate();
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
      let str = `${y}-${m}-${d}` ;
      return str;
    },
    chooseFileType( n ){
      this.chooseUpload = false ;
      this.fileType = n ;
      if( this.fileType === 'img' ){
        this.fileUrls = [];
        let i = setTimeout( () => {
          clearTimeout(i);
          this.$refs.vimgUpload&&this.$refs.vimgUpload.selectImg();
        } , 500 );

      }else if( this.fileType === 'file' ){
        this.pic_url = [];
        let j = setTimeout( () => {
          clearTimeout(j);
          this.$refs.vfileUpload&&this.$refs.vfileUpload.selectImg();
        } , 500 );
      }
    },
    changeData(obj) {
      let arr = [];
      for (let item of obj) {
        arr.push({
          name: item.display_name + '',
          value: item.id + ''
        });
      }
      return arr;
    },
    changeDataTwo(obj) {
      let arr = [];
      for (let item of obj) {
        arr.push({
          name: item.display_name + '',
          value: item.id + '',
          parent: 0,
        });
        if (item.selected_children) {
          for (let children of item.selected_children) {
            arr.push({
              name: children.display_name + '',
              value: children.id + '',
              parent: item.id + '',
            });
          }
        }
      }
      return arr;
    },
    submit(){
      // 检测用户输入的信息是否合法 , 不能包含html代码片段
      if( this.company ){
        if( WORLD_HTML_REG.test(this.company) ){
          this.$vux.toast.text('公司名称包含非法信息,请重新输入', 'middle');
          this.company = '';
          return ;
        }
      }else{
        this.$vux.toast.text('请输入公司名称信息', 'middle');
        return ;
      }

      if( this.product ){
        if( WORLD_HTML_REG.test(this.product) ){
          this.$vux.toast.text('产品名称包含非法信息,请重新输入', 'middle');
          this.product = '';
          return ;
        }
      }else{
        this.$vux.toast.text('请输入产品名称信息', 'middle');
        return ;
      }

      if( !this.selectedSpread_way.length ){
        this.$vux.toast.text('请选择所在行业');
        return ;
      }

      if( !this.selectedIndustry.length ){
        this.$vux.toast.text('请选择推广形式');
        return ;
      }
      if( !this.start ){
        this.$vux.toast.text('请选择开始时间');
        return ;
      }
      if( !this.end ){
        this.$vux.toast.text('请选择结束时间');
        return ;
      }

      if( +this.length ){
        if( !FLOAT_REG.test( +this.length ) ){
          this.$vux.toast.text('所需面积长度必须为数字或小数,请重新输入', 'middle');
          this.length =  '';
          return ;
        }
      }else{
        this.$vux.toast.text('请输入所需面积长度信息,不能为0', 'middle');
        return ;
      }

      if( +this.width ){
        if( !FLOAT_REG.test( +this.width ) ){
          this.$vux.toast.text('所需面积宽度必须为数字或小数,请重新输入', 'middle');
          this.width = '' ;
          return ;
        }
      }else{
        this.$vux.toast.text('请输入所需面积宽度信息,不能为0', 'middle');
        return ;
      }

      if( this.fileType ){
        if( !(this.pic_url.length) && !(this.fileUrls.length)  ){
          this.$vux.toast.text('请上传活动方案');
          return ;
        }
      }else{
        this.$vux.toast.text('请上传活动方案');
        return ;
      }

      if( this.remarks ){
        if( WORLD_HTML_REG.test(this.remarks) ){
          this.$vux.toast.text('备注包含非法信息,请重新输入', 'middle');
          this.remarks = '';
          return ;
        }
      }
      // 处理参数
      let data = {
        sid : +this.id ,
        company : this.company ,
        product : this.product ,
        start : this.start ,
        end : this.end ,
        length : +this.length ,
        width : +this.width ,
        remark : this.remark ,
        spread_way_id : +this.selectedSpread_way[0],
        industry_id : this.selectedIndustry[1] ? +this.selectedIndustry[1] : +this.selectedIndustry[0]
      };
      if( this.fileType === 'img'){
        data.plan_url = JSON.stringify( this.pic_url );
      }else if ( this.fileType === 'file' ){
        data.plan_url = JSON.stringify( [this.fileUrls[0].link]);
        data.filename = this.fileUrls[0].filename ;
      }else{}

      postEnquireInfo( data ).then( res => {
        let id = res.result ;
        this.$router.push({ path : '/appEnquireSuccess' , query : { id : id } });
      }).catch( err => {
        this.$vux.toast.text(err.msg);
      })
    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('backOneStep', "返回上一页" , function (data) {}) ;
      });
    },
  }
}

</script>
<style lang="scss">
  .weui-dialog{
    width: 5.6rem !important;
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";
  @mixin arrow($direction:up, $size:0.18rem, $color:#999) {
    @include wh($size, $size);
    border-left: 1px solid $color;
    border-bottom: 1px solid $color;
    transition: all 0.3s;
    display: inline-block;
    @if ($direction=='up') {
      transform:translateY(0.04rem) rotateZ(135deg);
    }
    @else if($direction=='down') {
      transform: translateY(-0.02rem) rotateZ(-45deg);
    }
    @else if($direction=='left') {
      transform: rotateZ(45deg);
    }
    @else if($direction=='right') {
      transform: rotateZ(-135deg);
    }
  }
  .com-left{
    @include sc(0.24rem,#666);
    .icon{
      display: inline-block;
      vertical-align: top;
      height: 0.26rem;
      padding-top: 0.06rem;
      margin-right: 0.06rem;
      color: $red;
    }
  }
  .info{
    padding: 0.38rem 0.52rem 0 0.36rem;
    overflow: hidden;
    background-color: #fff;
    .item{
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .com-single-ipt{
      width: 5.1rem;
      height: 0.8rem;
      background-color: #F1F2F7;
      border-radius: 0.08rem ;
      border: 1px solid #F1F2F7;
      >input{
        width: 100%;
        height: 100%;
        padding-left: 0.2rem;
        @include sc(0.22rem,$fontColor);
      }
    }
    .com-double-ipt{
      width: 5.1rem;
      height: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .ipt-com{
        width: 2.42rem;
        height: 0.8rem;
        padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #F1F2F7;
        border-radius: 0.08rem ;
        .down-arrow{
          @include arrow(down , 0.14rem );
        }
      }
    }
    .extend-ipt{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 5.1rem;
      height: 0.8rem;
      padding: 0 0.2rem;
      background-color: #F1F2F7;
      border-radius: 0.08rem ;
      border: 1px solid #F1F2F7;
      .down-arrow{
        @include arrow(down , 0.14rem );
      }
    }
    .area-ipt{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 5.1rem;
      height: 0.8rem;
      >input{
        width: 2.02rem;
        height: 0.8rem;
        padding: 0 0.2rem;
        @include sc(0.22rem,$fontColor);
        background-color: #F1F2F7;
        border-radius: 0.08rem;
      }
      .x-icon{
        color: #000;
      }
    }
  }
  .act-wraper{
    margin-top: 0.2rem;
    padding: 0.3rem 0.52rem 0.4rem 0.36rem;
    background-color: #fff;
    .act-case{
      display: flex;
      justify-content: space-between;
      .com-left{
        padding-top: 0.2rem;
      }
      .ios-img-box{
        width: 5.1rem;
      }
      .file-upload{
        width: 5.1rem;
        .upload-icon{
          display: block;
          @include wh(2.28rem,0.6rem);
          @include bg-image('../../images/but_programme_three_one');
        }
        .img-box{
          padding-top: 0.2rem;
        }
        .file-box{
          padding-top: 0.2rem;
        }
      }
    }
    .txt{
      padding-left: 1.4rem;
      margin-top: 0.2rem;
      @include sc(0.22rem,#999);
    }
  }
  .remark{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 0.52rem 0.3rem 0.36rem;
    background-color: #fff;
    .remark-ipt{
      width: 5.1rem;
      height: 2.08rem;
      padding: 0.2rem;
      background-color:#F1F2F7;
      border-radius: 0.08rem;
      >textarea{
        width: 100%;
        height: 100%;
        @include sc(0.22rem,$fontColor);
      }
    }
  }
  .picker{
    flex: 1;
    height: 0.78rem;
    width: 100%;
    line-height: 0.78rem;
    @include sc(0.22rem,#999);
    &:before{
      height: 0;
      border-top: 0 none;
    }
  }
  .btns{
    padding: 0.6rem 0.52rem;
    background-color: #fff;
    .submit{
      width: 6.46rem;
      height: 1rem;
      line-height: 1rem;
      @include sc(0.34rem,#fff);
      text-align: center;
      background-color: $mainColor;
      border-radius: 0.08rem;
    }
    p{
      margin-top: 0.3rem;
      text-align: center;
      @include sc(0.22rem,#999);
    }
  }
  .upload-wraper{
    padding: 0.6rem 0.84rem;
    .title{
      @include sc(0.34rem,#1e1e1e);
    }
    .select{
      display: flex;
      justify-content: space-between;
      margin-top: 0.4rem;
      .img{
        .bg{
          @include wh(1.2rem,1.2rem);
          @include bg-image('../../images/ic_picture_three_one');
        }
      }
      .file{
        .bg{
          @include wh(1.2rem,1.2rem);
          @include bg-image('../../images/ic_file_three_one');
        }
      }
      .txt{
        margin-top: 0.2rem;
        @include sc(0.28rem,#1e1e1e);
      }
    }
  }
  .mask{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }
</style>
