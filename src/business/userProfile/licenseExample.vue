<template>
  <div>
    <v-head go-back="true">
      <div slot="center-part">营业执照样例</div>
    </v-head>
    <div class="example-img"></div>
    <div class="submit" @click="select">
      立即上传
    </div>
    <!-- <vUploadImg ref="upload" name="img1234567" fileType="cert" class="profile-avatar-upload" max=1 :picArr="pic_url"></vUploadImg> -->
  </div>
</template>

<script>
import vHead from 'src/components/vHead';
import vUploadImg from 'src/components/vUploadImg';
// import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        pic_url: []
      }
    },
    // watch: {
    //   pic_url (oldValue, newValue) {
    //     this.$store.dispatch('uploadLicense', oldValue[0]);
    //   }
    // },
    components: {
      vHead,
      vUploadImg
    },
    methods: {
    //   ...mapActions([
    //   'getUserProfile'
    // ]),
      select(){
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
  .example-img {
    @include bg-image( '../../images/image_yingyezhizhao_three_three');
    width: 100%;
    height: 10.84rem;
    margin-top: .2rem;
  }
  .submit {
    width: 100%;
    background: $mainColor;
    padding: .36rem 0 .32rem 0;
    text-align: center;
    font-size: .34rem;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .34rem;
  }
  .profile-avatar-upload{
    position: absolute;
    // visibility: hidden;
    height:0;
    width:0;
    overflow: hidden;
    z-index: -999;
  }
</style>
