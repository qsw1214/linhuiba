

<template lang="html">

  <div class="v-address-wrap">
    <popup-picker class="picker" value-text-align="left" :columns="3" :show-name="true"  placeholder="请选择"  v-model="currentArea" :data="list"  @on-change="changeAddress"></popup-picker>
  </div>


</template>

<script>
/* 使用方法 */
/*
1.引入
<vAddress :idsArr="[]" @change="getIds"></vAddress>
2
2.1  idsArr= ['p'+province_id,'c'+city_id,'d'+district_id];加前缀p,c,d
2.2暴露的方法
getIds(obj) obj={
    province_id,
    city_id,
    district_id
}

*/
import { getAddress, deleteAddress, editAddress ,getAddressList  } from 'src/service/getData';
import { PopupPicker } from 'vux';
export default {
  directives: {
  },
  data () {
    return {
      list:[],
      currentArea : []
    }
  },
  props : [ 'idsArr' ] ,
  components:{ PopupPicker },
  async mounted(){
    await this.initData();
  },
  methods:{
    initData() {
      getAddressList().then(res=>{
        let arr = [];
        // res=JSON.parse(JSON.stringify(res).replace(/province_id|city_id/g,'parent').replace(/id/g,'value'))
        // 剔除青海 宁夏 新疆
        res = [...res.slice(0,res.length-3)] ;
        for(let [index,item] of res.entries()){
          // console.log(item,index)
          let cities = item.cities
          arr.push({
            name:item.name,
            value:'p'+item.id,
            parent:0
          })
          for(let city of cities){
            let districts = city.districts
            arr.push({
              name:city.name,
              value:'c'+city.id,
              parent:'p'+item.id
            })
            for(let district of districts){
              arr.push({
                name:district.name,
                value:'d'+district.id,
                parent:'c'+city.id
              })
            }
          }
        }
        this.list = arr
      }).catch( err => {
        this.$vux.toast.text(err, 'middle');
      });
    },
    changeAddress(e){
      let idObj = {
          province_id:e[0].substr(1)*1,
          city_id:e[1].substr(1)*1,
          district_id:e[2].substr(1)*1
      } ;
      this.$emit('change',idObj)
      // this.$props.idsArr=e
    }
  },
  watch :{
    'idsArr' :function (newVal , oldVal) {
      this.currentArea = this.idsArr ;
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../style/mixin';
  .v-address-wrap{
    @include wh(100%,0.9rem);
    display:flex;
    background:#fff;
    align-items:center;
    .picker{
      width: 100%;
       &:before{
            display:none;
        }
    }
  }
</style>
