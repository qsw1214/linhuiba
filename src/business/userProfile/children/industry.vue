<template lang="html">
  <div class="industry-wrap">
      <v-head go-back="true">
        <div slot="center-part">行业选择</div>
        <div slot="right-part" class="determine-num">
          <span @click="choseDeputyIndustry()" v-show="type === '1'">确定({{ determineNum }})</span>
          <span v-show="type === '0'">确定</span>
        </div>
      </v-head>
      <section class="I-content">
        <ul class="select-parent">
          <li @click.stop="setParentId(item)" :class="{'active': selected_parent_id==item.id }"  v-for="(item,index) in industry">{{item.display_name}}<span class="imprint" v-if="type == 0" v-show="item.falg2 == true"></span><span class="imprint" v-else v-show="item.falg1 == true"></span></li>
        </ul>
        <ul class="select-children" v-if="type === '1'">
          <li v-for="(item,index) in industryChlidren" @click.stop="select(item)" :key="index">
            <input type="checkbox"  :checked="item.select" />
            <label class="choose" >{{item.display_name}}</label>
          </li>
        </ul>
        <ul class="select-children" v-else>
          <li @click="chooseIndustry(item)" v-for="(item,index) in industryChlidren">{{item.display_name}}<span class="imprint" v-show="item.falg == true"></span></li>
        </ul>
      </section>

  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { getIndustry, getCompanyInfo } from 'src/service/getData';
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      industry:[],
      industryChlidren:[],
      selected_parent_id:'',
      selectArr: [],
      determineNum: 0,
      type: '0',
      companyInfo: {}
    }
  },
  components: { vHead },

  computed: {
    ...mapState([
      'siteIntention'
    ]),
  },
  async created() {
    this.initData()
  },
  mounted() {
    this.type = this.$route.query.type
    this.$emit('hiddenCompany', true)
  },
  methods: {
    ...mapActions([
      'setSiteIntentionIndustry',
      'setSiteIntentionDeputyIndustry'
    ]),
    async initData(){
      if (this.siteIntention && this.siteIntention.deputyIndustry && this.siteIntention.deputyIndustry._dataCaching) {
          this.industryChlidren = this.siteIntention.deputyIndustry._dataCaching
          this.selectArr = this.siteIntention.deputyIndustry.select
          this.determineNum = this.siteIntention.deputyIndustry.select.length
          this.industry = this.siteIntention.deputyIndustry._allDataCaching
      } else {
          await getIndustry().then(res => {
          this.industry = res.result;
          // console.log(res.result)
          this.industryChlidren = res.result[0].selected_children;
          for (let i of this.industryChlidren) { Object.assign(i, { "select": false }) };
            getCompanyInfo().then(response => {
            this.companyInfo = response.result
            let { industry_id, deputy_industry } = this.companyInfo
            // if (this.type != 0) {
              this.determineNum = deputy_industry.length
              this.industry.forEach(item => {
                item.selected_children.forEach(item2 => {
                  deputy_industry.forEach(item3 => {
                    if (item3.id == item2.id) {
                      this.$set(item, 'falg1', true) 
                      item2.select = !item2.select
                      this.selectArr.push(item2)
                    }
                  })
                })
              });
            // } else {
              this.industry.forEach(item => {
                item.selected_children.forEach(item2 => {
                  if (industry_id == item2.id) {
                    this.$set(item, 'falg2', true)
                    this.$set(item2, 'falg', true)
                  }
                })
              });
            }
          )
          let arr = {
            select: this.selectArr,
            _dataCaching: this.industryChlidren,
            _allDataCaching: this.industry
          }
 
          this.$store.dispatch('setSiteIntentionDeputyIndustry', arr)
          this.choseDeputyIndustry('1')
          
          this.selected_parent_id = res.result[0].id;
        })
      }
    },
    select (item) {
      item.select = !item.select
      if (item.select) {
        this.determineNum++
        this.selectArr.push(item)
      } else {
        this.determineNum--
        let len = this.selectArr.length
        for (let i = 0; i < len; i++) {
          if (item.display_name == this.selectArr[i].display_name) {
            this.selectArr.splice(i, 1)
            // return 
            len--
          }
        }
      }
      this.industry.forEach(item1 => {
        let _all = false
        item1.selected_children.forEach(item2 => {
          this.selectArr.forEach(item3 => {
            if (item3.id == item2.id) _all = true
          })
        })
        _all ? this.$set(item1, 'falg1', true) : this.$set(item1, 'falg1', false)
      });
    },
    setParentId(item){
      this.selected_parent_id = item.id;
      this.industryChlidren = item.selected_children;
    },
    chooseIndustry(item){
      this.industry.forEach(items => {
        items.falg2 = false
        items.selected_children.forEach(item2 => {
          if (item.id == item2.id) {
            this.$set(items, 'falg2', true)
            this.$set(item2, 'falg', true)
          } else {
           item2.falg = false 
          }
        })
      });
      this.$store.dispatch('setSiteIntentionIndustry', item)
      this.$router.go(-1)
    },
    choseDeputyIndustry (num) {
      let arr = {
        select: this.selectArr,
        _dataCaching: this.industryChlidren,
        _allDataCaching: this.industry
      }
      this.$store.dispatch('setSiteIntentionDeputyIndustry', arr)
      if (!num) {
        this.$router.go(-1)
      }
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";

.determine-num {
  font-size: .32rem;
  color: $mainColor;
  letter-spacing: 0;
  text-align: right;
  font-weight: bold;
}
.industry-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
  overflow: hidden;
  position: fixed;
}
.industry-wrap{
  .I-content{
    display: flex;

 height:100%;

    ul{
      flex:1;
      height:100%;
      overflow: auto;
      background: #f8f8f8;
      padding-bottom: 1.3rem;
      &.select-parent{
        background: #fff;
        display: flex;
        flex-direction: column;
        li{
          margin:0 0.15rem 0 0.3rem;
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#eee);
           @include sc(0.28rem, #333);
          &::last-child{
            @include bt-1px(transparent);
          }
        }
      }
      &.select-children{
        display: flex;
        flex-direction: column;
        li{
          margin:0 0.3rem 0 0.15rem;
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#eee);
           @include sc(0.26rem, #333);
          &::last-child{
            @include bt-1px(transparent);
          }
        }
      }
      li{
          line-height: 0.9rem;
          @include wh( auto,0.9rem);
          @include bt-1px(#ddd);
          &.active{
            background: #f8f8f8;
            margin:0;
            text-indent: 0.3rem;
            color:$mainColor;
             @include bt-1px(transparent);
          }
        }
    }
  }
}
.imprint {
  display: inline-block;
  width: .12rem;
  height: .12rem;
  background-color: red;
  border-radius: 100%;
  margin-left: .16rem;
  vertical-align: middle;
}
.choose {
  width: 100%;
  display: block;
}
input[type="checkbox"] + label::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: .4rem;
    @include bg-image( '../../../images/ic_unselected_three_four');
    width: 1.1em;
    height: 1.1em;
    position: relative;
    top: .22rem;
    float: right;
  }
  input[type="checkbox"]:checked + label::before {
    font-size: .4rem;
    @include bg-image( '../../../images/ic_selected_three_four');
    width: 1.1em;
    height: 1.1em;

  }
  input[type="checkbox"] {
      position: absolute;
      clip: rect(0, 0, 0, 0);
  }

</style>

<style lang="scss">
@import "../../../style/mixin";
body,
html {
 @include wh(100%, 100%);
}

</style>
