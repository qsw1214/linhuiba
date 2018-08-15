<template lang="html">
  <div>
    <div  class="card">
    <img src="../../images/image_Membership card@2x.png">
      <div class="level">
        <span>您目前的等级是</span>
        <span class="level-icon" :class="{ v0: level_id == 1 , v1 : level_id == 2 , v2 : level_id == 3 ,v3 : level_id == 4 ,v4 : level_id == 5 ,v5 : level_id == 6 }"></span>
      </div>
    </div>
    <div class="desc gutter">
      <div class="part-1">
        <div class="title">1.会员等级说明</div>
        <p class="level-desc">邻汇吧通过累计成长值的形式，给用户划分会员等级。
          用户可以通过下单、评价等行为获得成长值，成长值越高，会员等级越高，享受的会员权益越多。
        </p>
      </div>
      <div class="part-2">
        <div class="title">2.会员等级划分</div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>会员等级</th>
                <th>对应的成长值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>V0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>V1</td>
                <td>1-1999</td>
              </tr>
              <tr>
                <td>V2</td>
                <td>2000-39999</td>
              </tr>
              <tr>
                <td>V3</td>
                <td>40000-319999</td>
              </tr>
              <tr>
                <td>V4</td>
                <td>320000-1999999</td>
              </tr>
              <tr>
                <td>V5</td>
                <td>2000000以上</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="part-3">
        <div class="title">3.如何获得成长值？</div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>行为</th>
                <th>成长值发放条件</th>
                <th>成长值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>下单</td>
                <td>订单支付完且审核通过</td>
                <td>订单实际支付金额</td>
              </tr>
              <tr>
                <td>文字评价</td>
                <td>文字超过10字</td>
                <td>200</td>
              </tr>
              <tr>
                <td>上传图片评价</td>
                <td>含有文字内容且带图</td>
                <td>300</td>
              </tr>
              <tr>
                <td>取消订单</td>
                <td>订单审核通过之后取消订单，扣除此订单发放的成长值</td>
                <td>减订单实际支付金额</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="part-1 part-4">
        <div class="title">4.会员等级有效期</div>
        <p class="level-desc">
          会员等级保级有效期为3个月。自升级日起，每满3个月计算一次当前等级，
          若3个月内没有下单并且成功执行，将扣减10%的成长值，并重新计算等级。若满6个月没有下单并且成功执行，
          则扣减20%的成长值，以此类推，直到会员等级降到V1。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper , SwiperItem , Tab , TabItem } from 'vux';
  import { userInfo } from '../../service/getData'
export default {
  data () {
    return {
      level_id : undefined
    }
  },
  mounted(){
    userInfo().then (res => {
      this.level_id = res.result.membership_level_id ;
    })
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .card{
    position: relative;
    top: 0;
    left: 0;
    background-color: #fff;
    @include wh( 100% , 4.2rem );
    img{
      @include wh( 100% , 4.2rem );
    }
    .level{
      position: absolute;
      left: 0.65rem;
      bottom: 0.9rem;
      font-size: 0.22rem;
      color: #fff;
      .level-icon{
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.05rem;
        @include wh( 0.46rem , 0.32rem );
        &.v0{
          @include bg-image('../../images/ic_v0_three');
        }
        &.v1{
          @include bg-image('../../images/ic_v1');
        }
        &.v2{
          @include bg-image('../../images/ic_v2');
        }
        &.v3{
          @include bg-image('../../images/ic_v3');
        }
        &.v4{
          @include bg-image('../../images/ic_v4');
        }
        &.v5{
          @include bg-image('../../images/ic_v5');
        }
      }
    }
  }
  .desc{
    background-color: #fff;
    .title{
      font-size: 0.3rem;
      font-weight: 600;
    }
    .part-1{
      .level-desc{
        margin-top: 0.15rem;
        padding:0 0.28rem;
        font-size: 0.26rem;
        color: #666666;
        letter-spacing: 0;
        line-height: 0.4rem;
      }
    }
    .part-2{
      margin-top: 0.5rem;
      .table{
        padding: 0.3rem 0.28rem 0;
        table{
          width: 100%;
          border: 0.01rem solid rgba(0,0,0,0.1);
          border-radius: 0.08rem;
          border-spacing: 0;
          overflow: hidden;
          thead{
            line-height: 0.88rem;
            background-color: $mainColor;
            color: #fff;
            font-size: 0.26rem;
            th{
              font-weight: normal;
            }
          }
          tbody{
            tr{
              line-height: 0.82rem;
              font-size: 0.24rem;
              color: #666;
              &:nth-child(even){
                background-color:  #F1F2F7;
              }
            }
          }
          td{
            text-align: center;
          }
        }
      }
    }
    .part-3{
      margin-top: 0.5rem;
      .table{
        padding: 0.3rem 0.28rem 0;
        table{
          width: 100%;
          border: 0.01rem solid rgba(0,0,0,0.1);
          border-radius: 0.08rem;
          border-spacing: 0;
          overflow: hidden;
          thead{
            line-height: 0.88rem;
            background-color: $mainColor;
            color: #fff;
            font-size: 0.26rem;
            th{
              font-weight: normal;
            }
          }
          tbody{
            tr{
              line-height: 0.34rem;
              height: 1.3rem;
              font-size: 0.24rem;
              color: #666;
              td{
                width: 2.16rem;
                word-break:break-all;
              }
              &:nth-child(even){
                background-color:  #F1F2F7;
              }
            }
          }
          td{
            text-align: center;
          }
        }
      }
    }
    .part-4{
      margin-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
</style>
