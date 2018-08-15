<template lang="html">
  <div>

     <div class="date-pick">
      <div class="date-tit">
        <div class="pre" @click.stop="preMonth"></div>
        <div class="month"><span>{{ year }}</span>年<span>{{ month }}</span>月</div>
        <div class="next" @click.stop="nextMonth"></div>
      </div>
      <ul class="date-week">
        <li class="week-item">日</li>
        <li class="week-item">一</li>
        <li class="week-item">二</li>
        <li class="week-item">三</li>
        <li class="week-item">四</li>
        <li class="week-item">五</li>
        <li class="week-item">六</li>
      </ul>
      <div class="date-num">
        <div class="item" v-for="(item , index) in tempDateArr" :key="index"
        @click.stop="dateClick(item)"
        :class="{
        is_today : item.today ,
        is_selected : item.is_selected,
        is_disabled : item.is_disabled,
        is_start : item.timeStamp == selstart && resourceNorms.length == 1 && normsDays >=7 && !item.is_null ,
        is_center : item.timeStamp > selstart && item.timeStamp < selend ,
        is_end : item.timeStamp == selend
        }"
        >
          <div class="date-box">
            <span class="date-day">{{ item.day }}</span>

            <span class="date-weather" :class="[ codeToClass(item.weather) ]"></span>

          </div>
          <div class="date-price" v-if="item.price">
            <span v-if="item.price>0">¥{{ item.price | twoPoint }}</span>
            <span v-if="item.price=='不可预定'" class="not-order"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { twoPoint } from 'src/filters/index';
import { getNormsId } from 'src/service/getData' ;
export default {
  data () {
    return {
      tempDateArr : [] ,// 存放界面显示用的日期数组
      year : 2018, // 年份
      month : 1 , // 月份
      selstart :  0 , // 选择的开始日期的时间戳
      selend : 0, // 选择的结束日期的时间戳
      selectedDate : [] , // 选中的日期数组
      price : '', // 活动的价格  或者是  周期大于天的价格  每天都为同一个价格
      MondayPrice : '' , // 周一价格
      TuesdayPrice : '',
      WednesdayPrice : '',
      ThursdayPrice : '',
      FridayPrice : '',
      SaturdayPrice : '',
      WeekdayPrice : '', // 周天价格
      notdayPrice : '' , // 非天价格
      lease_term_type_id : '' ,// 非天的规格

      monId : '' ,
      tueId : '' ,
      wedId : '' ,
      thuId : '' ,
      friId : '' ,
      satId : '' ,
      sunId : '' ,
    }
  },
  props : {
    resourceNorms : {
      type : Array ,
      default : function () {
        return []
      } , // 规格 价格数组
      required : true
    },
    rate : {
      default : 0 , // 补贴率
      required : true
    },
    normsDays : {
      default : 1 , // 时间规格天数 一年365年
      required : true
    },
    weather : {
      default : null ,
      required : true
    } ,
    activityStart : {
      default : ''   // 活动开始时间
    },
    activityEnd : {
      default : ''  // 活动结束时间
    },
    advanceDay : {
      default : 0 , // 提前预定天数
      required : true
    },
    calendars : {
      type : Array ,
      default : function () {
        return []
      } , // 不可预定天数组
      required : true
    }
  },
  filters : { twoPoint },
  created(){
    // 计算活动每天的价格
    if( this.activityStart&&this.activityEnd ){
      this.price = this.resourceNorms[0].price/100*(1 - this.rate/100) ;
    }
    // 场地每天的价格
    if( this.resourceNorms.length >= 1 && this.normsDays < 7 ){
      // 规格为天 每天的价格
      for( let norm of this.resourceNorms ){  // mon the  wed  thu  fri  sat  sun
        if( norm.lease_term_type.name === 'Mon' ){
          this.MondayPrice = norm.price/100*(1 - this.rate/100) ;
          this.monId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Tue' ){
          this.TuesdayPrice = norm.price/100*(1 - this.rate/100) ;
          this.tueId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Wed' ){
          this.WednesdayPrice = norm.price/100*(1 - this.rate/100) ;
          this.wedId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Thu' ){
          this.ThursdayPrice = norm.price/100*(1 - this.rate/100) ;
          this.thuId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Fri' ){
          this.FridayPrice = norm.price/100*(1 - this.rate/100) ;
          this.friId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Sat' ){
          this.SaturdayPrice = norm.price/100*(1 - this.rate/100) ;
          this.satId = norm.lease_term_type.id ;
        }else if( norm.lease_term_type.name === 'Sun' ){
          this.WeekdayPrice = norm.price/100*(1 - this.rate/100) ;
          this.sunId = norm.lease_term_type.id ;
        }else {
          this.notdayPrice = norm.price/100*(1 - this.rate/100) ;
        }
      }
    }else{
      // 规格 非天 的每天价格
      this.notdayPrice = this.resourceNorms[0].price/100*(1 - this.rate/100) ;
      // 非天的lease_term_type_id
      this.lease_term_type_id = this.resourceNorms[0].lease_term_type_id ;
    }

  },
  mounted(){
    this.year  = new Date().getFullYear() ;
    this.month = new Date().getMonth() + 1 ;
    this.initDate() ;
  },
  methods : {
    initDate(){
      this.tempDateArr = []; // 每次清空数组

      let today_d = new Date().getDate(); // 当日
      let today_m = new Date().getMonth() + 1; // 当月
      let today_y = new Date().getFullYear(); // 当年
      let todayTimestamp = new Date(today_y, today_m - 1, today_d).getTime(); // 当天时间戳
      let firstDay = new Date(this.year, this.month - 1, 1); // 本月第一天
      let weekDay = firstDay.getDay(); // 本月第一天星期几

      // 每月一号之前的日期都不显示
      for (let i = 0; i < weekDay; i++) {
        this.tempDateArr.push({ day: '', weather: '', price: '', is_disabled: true });
      }
      let y = firstDay.getFullYear();
      let m = firstDay.getMonth() + 1;
      let lastDate = new Date(y, m, 0);
      let ld = lastDate.getDate(); // 本月最后一天

      let candestineTimestamp = todayTimestamp;
      // 处理提前预定天数 可能为0
      if ( this.advanceDay || this.advanceDay == 0 ) {
        candestineTimestamp = todayTimestamp + ( this.advanceDay - 1 ) * 24 * 3600 * 1000;
      }
      // 循环拿到每月的日历数组( 包含不可预定的日期处理 ，今天的处理 ， 临时不可预定的处理 )
      for (let j = 1; j <= ld; j++) {

        let tempTimestamp = new Date(this.year, this.month - 1, j).getTime(); // 每一天的时间戳
        let week = new Date(this.year, this.month - 1, j).getDay(); // 每一天是星期几
        if (tempTimestamp <= candestineTimestamp) {
          // 不可预定的日期  今天之前的资源都不可预定（包含有提前预定的资源）
          let temp = {
            day: j, price: '', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
          };
          if (tempTimestamp == todayTimestamp) {
            temp.today = true;
            temp.day = '今天';
          }
          this.tempDateArr.push(temp);
        } else {
          // 可以预定的日期
            // 如果是活动
          if (this.activityStart && this.activityEnd ) {
            let startStamp = new Date(this.activityStart).getTime() - 1*24*3600*1000; // 开始当天也要算
            let endStamp = new Date(this.activityEnd).getTime();
            if (tempTimestamp > endStamp || tempTimestamp < startStamp) {
              // 不在活动期间
              let temp = {
                day: j, price: '', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
              };
              this.tempDateArr.push(temp);
            } else {
              // 在活动期间
              let temp = null ;
              if( this.calendars.length ){  // 存在禁用日期
                for( let cancle of this.calendars ){
                  // 处理不可预定的天
                  if( cancle.exp_date == this.formatDate( tempTimestamp ) ){
                    let temp = {
                      day: j, price: '不可预定', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
                    };
                    this.tempDateArr.push( temp );
                  }else{
                    if(week == 1){ // 周一
                      temp = { day: j, price: this.MondayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.monId };
                      if( !this.MondayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if (week == 2 ){ // 周二
                      temp = { day: j, price: this.TuesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.tueId };
                      if( !this.TuesdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 3){ // 周三
                      temp = { day: j, price: this.WednesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.wedId };
                      if( !this.WednesdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 4){ // 周四
                      temp = { day: j, price: this.ThursdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.thuId };
                      if( !this.ThursdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 5){ // 周五
                      temp = { day: j, price: this.FridayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.friId };
                      if( !this.FridayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 6){ // 周六
                      temp = { day: j, price: this.SaturdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.satId };
                      if( !this.SaturdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else{  // 周天
                      temp = { day: j, price: this.WeekdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.sunId };
                      if( !this.WeekdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }
                    this.tempDateArr.push(temp);
                  }
                }
              }else{ // 无禁用日期
                if(week == 1){ // 周一
                  temp = { day: j, price: this.MondayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.monId };
                  if( !this.MondayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if (week == 2 ){ // 周二
                  temp = { day: j, price: this.TuesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.tueId };
                  if( !this.TuesdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 3){ // 周三
                  temp = { day: j, price: this.WednesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.wedId };
                  if( !this.WednesdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 4){ // 周四
                  temp = { day: j, price: this.ThursdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.thuId };
                  if( !this.ThursdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 5){ // 周五
                  temp = { day: j, price: this.FridayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.friId };
                  if( !this.FridayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 6){ // 周六
                  temp = { day: j, price: this.SaturdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.satId };
                  if( !this.SaturdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else{  // 周天
                  temp = { day: j, price: this.WeekdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.sunId };
                  if( !this.WeekdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }
                this.tempDateArr.push(temp);
              }
            }
          } else {
            // 不为活动的处理
            let temp = null ;
            if( this.calendars.length ){ // 存在禁用日期
              for( let cancle of this.calendars ){
                if( cancle.exp_date == this.formatDate( tempTimestamp ) ){
                  // 禁用日期处理
                  temp = {
                    day: j, price: '不可预定', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
                  };
                  this.tempDateArr.push(temp);
                }else{
                  // 非禁用日期处理
                  if( this.resourceNorms.length >= 1 && this.normsDays < 7 ){
                    // 为天的情况
                    console.log('为天的情况')
                    if(week == 1){ // 周一
                      temp = { day: j, price: this.MondayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.monId };
                      if( !this.MondayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if (week == 2 ){ // 周二
                      temp = { day: j, price: this.TuesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.tueId };
                      if( !this.TuesdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 3){ // 周三
                      temp = { day: j, price: this.WednesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.wedId };
                      if( !this.WednesdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 4){ // 周四
                      temp = { day: j, price: this.ThursdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.thuId };
                      if( !this.ThursdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 5){ // 周五
                      temp = { day: j, price: this.FridayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.friId };
                      if( !this.FridayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else if(week == 6){ // 周六
                      temp = { day: j, price: this.SaturdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.satId };
                      if( !this.SaturdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }else{  // 周天
                      temp = { day: j, price: this.WeekdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.sunId };
                      if( !this.WeekdayPrice ){ // 价格不存在  不可预定
                        temp.is_disabled = true ;
                      }
                    }
                    this.tempDateArr.push(temp);
                  }else{
                    // 为其他周期的情况
                    console.log('为其他周期的情况')
                    temp = { day: j, price: this.notdayPrice, is_selected: false, timeStamp: tempTimestamp };
                    this.tempDateArr.push(temp);
                  }
                }
              }
            }else{ // 不存在禁用日期
              if( this.resourceNorms.length >= 1 && this.normsDays < 7 ){
                // 为天的情况
                if(week == 1){ // 周一
                  temp = { day: j, price: this.MondayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.monId };
                  if( !this.MondayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if (week == 2 ){ // 周二
                  temp = { day: j, price: this.TuesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.tueId };
                  if( !this.TuesdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 3){ // 周三
                  temp = { day: j, price: this.WednesdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.wedId };
                  if( !this.WednesdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 4){ // 周四
                  temp = { day: j, price: this.ThursdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.thuId };
                  if( !this.ThursdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 5){ // 周五
                  temp = { day: j, price: this.FridayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.friId };
                  if( !this.FridayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else if(week == 6){ // 周六
                  temp = { day: j, price: this.SaturdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.satId };
                  if( !this.SaturdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }else{  // 周天
                  temp = { day: j, price: this.WeekdayPrice, is_selected: false, timeStamp: tempTimestamp , lease_term_type_id : this.sunId };
                  if( !this.WeekdayPrice ){ // 价格不存在  不可预定
                    temp.is_disabled = true ;
                  }
                }
                this.tempDateArr.push(temp);
              }else{
                // 为其他周期的情况
                temp = { day: j, price: this.notdayPrice, is_selected: false, timeStamp: tempTimestamp };
                this.tempDateArr.push(temp);
              }
            }
          }
        }
      }
      // 处理天气的显示
      if (this.weather) {
        for (let w in this.weather) {
          for (let k of this.tempDateArr) {
            let date = this.formatDate(k.timeStamp);
            if (w == date) {
              k.weather = this.weather[w];
            }
          }
        }
      }
      // 已选 渲染
      if (this.selectedDate.length) {
        for (let t of this.selectedDate) {
          for (let k of this.tempDateArr) {
            let date = this.formatDate(k.timeStamp);
            if (date == t.date) {
              k.is_selected = true;
            }
          }
        }
      }
    },
    nextMonth(){
      this.month++;
      if (this.month > 12) {
        this.month = 1;
        this.year++;
      }
      this.initDate();
    },
    preMonth(){
      this.month--;
      if (this.month < 1) {
        this.month = 12;
        this.year--;
      }
      this.initDate();
    },
    formatDate(timestamp){
      let y = new Date(timestamp).getFullYear();
      let m = new Date(timestamp).getMonth() + 1;
      let d = new Date(timestamp).getDate();
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
      let date = y + '-' + m + '-' + d;
      return date;
    },
    dateClick(item){
      // 如果禁止了不做任何处理
      if (item.is_disabled) {
        return;
      }
      item.is_selected = !item.is_selected;
      // 记录当前点击的日期的时间戳
      if( !item.is_selected ){
        let currentTime = this.formatDate(item.timeStamp) ;
        for( let i = this.selectedDate.length - 1 ; i >= 0 ; i-- ){
          if( this.selectedDate[i].date == currentTime ){
            // 删除掉已保存数组中 的 取消日期
            this.selectedDate.splice( i , 1 );
          }
        }
      }
      // 记录开始时间
      this.selstart = item.timeStamp;
      // 为天的情况
      if ( this.resourceNorms.length >= 1 && this.normsDays < 7 ) {
        // 保存已选的数据
        for (let val of this.tempDateArr) {
          let date = this.formatDate(val.timeStamp);
          if (val.is_selected) {
            this.selectedDate.push({
              date : date,
              price : val.price ,
              lease_term_type_id : val.lease_term_type_id
            });
          }
        }
        // 去重
        let newArr = [];
        if(this.selectedDate.length ){
          for( let item of this.selectedDate ){
            let flag = true ;
            for( let newitem of newArr ){
              if( item.date == newitem.date ){
                flag = false ;
              }
            }
            if(flag){
              newArr.push( item )
            }
          }
        }
        // 重新赋值
        this.selectedDate = newArr ;
      } else {
        let arr = [] ;
        let startTime = this.selstart;
        let endTime = this.selstart + this.normsDays * 24 * 3600 * 1000;
        this.selend = endTime - 24 * 3600 * 1000;
        // 选中状态
        for (let k of this.tempDateArr) {
          if (k.timeStamp >= startTime && k.timeStamp < endTime) {
            k.is_selected = true;
          }else {
            k.is_selected = false;
          }
        }
        // 有开始时间才保存
        if (this.selstart) {
          for (let i = 0; i < this.normsDays; i++) {
            let time = this.selstart + i * 24 * 3600 * 1000;
            let date = this.formatDate(time);
            arr.push({
              date : date,
              price : item.price ,
              lease_term_type_id : this.lease_term_type_id
            });
          }
        }
        this.selectedDate = arr ;
      }

      console.log( this.selectedDate , '选择的日期数组');
      // 触发父级的监听事件
      this.$emit('pipeData', this.selectedDate)
    },
    codeToClass (code){
      if (!code) {
        return '';
      }
      if (code == 100 || code == 201) {
        return 'sun'
      }
      if (code == 101 || code == 102 || code == 103 || code == 104) {
        return 'cloudy'
      }
      if (code == 300 || code == 301 || code == 303 || code == 304) {
        return 'showerRain'
      }
      if (code == 305 || code == 309) {
        return 'lightRain'
      }
      if (code == 306) {
        return 'moderateRain'
      }
      if (code >= 307 && code <= 313 && code != 309) {
        return 'heavyRain'
      }
      if (code >= 400 && code <= 407) {
        return 'snow'
      }
      if (code >= 500 && code <= 402) {
        return 'foggy'
      }
      if (code >= 200 && code <= 213 && code != 201) {
        return 'wind'
      }
      if (code >= 503 && code <= 508) {
        return 'sand'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/mixin' ;
  .date-pick{
    padding: 0.2rem 0;
    background-color: #fff;
    .date-tit{
      padding: 0 0.25rem;
      height: 1.08rem;
      line-height: 1.08rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pre{
        display: inline-block;
        @include wh( 0.48rem, 0.48rem );
        @include bg-image( '../images/ic_back_black');
      }
      .next{
        display: inline-block;
        @include wh( 0.48rem, 0.48rem );
        @include bg-image( '../images/ic_next');
      }
      .month{
        font-size: 0.36rem;
        font-weight: bold;
      }
    }
    .date-week{
      height: 0.52rem;
      line-height: 0.52rem;
      display: flex;
      padding: 0 0.24rem;
      background-color: #F6F6FB;
      .week-item{
        width: 1rem;
        text-align: center;
        font-size: 0.24rem;
        color: #999;
      }
    }
    .date-num{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 0.24rem;
      max-height: 5rem;
      overflow-y: scroll;
      .item{
        @include wh(1rem ,1rem);
        &.is_today {
          .date-box{
            .date-day{
              font-size: 0.24rem;
              color: $mainColor !important;
              font-weight: normal;
            }
          }

        }
        &.is_selected{
          .date-box{
            .date-day{
              display: inline-block;
              @include wh( 0.44rem , 0.44rem );
              border-radius: 50%;
              color: #fff;
              background-color: $mainColor;
              overflow: hidden;
            }
          }
        }
        &.is_disabled{
          .date-box{
            .date-day{
              color:  #D2D2D2;
            }
          }
        }
        &.is_start {
          .date-box{
            border-radius: 0.22rem 0 0 0.22rem;
            background-color: $mainColor;
          }
        }
        &.is_center {
          .date-box{
            background-color: $mainColor;
          }
        }
        &.is_end {
          .date-box{
            border-radius:0 0.22rem 0.22rem 0;
            background-color: $mainColor;
          }
        }
        .date-box{
          position: relative;
          top: 0;
          left: 0;
          height: 0.44rem;
          line-height: 0.44rem;
          text-align: center;
          .date-day{
            font-size: 0.3rem;
            font-weight: bold;
            color: #666;
          }
          .date-weather{
            position: absolute;
            top: 0;
            right: 0;
            @include wh( 0.26rem , 0.26rem );
            &.sun{
              @include bg-image('../images/weather/ic_sun_three');
            }
            &.cloudy{
              @include bg-image('../images/weather/ic_cloudy_three');
            }
            &.showerRain{
              @include bg-image('../images/weather/ic_shower Rain_three');
            }
            &.lightRain{
              @include bg-image('../images/weather/ic_light rain_three');
            }
            &.moderateRain{
              @include bg-image('../images/weather/ic_moderate rain_three');
            }
            &.heavyRain{
              @include bg-image('../images/weather/ic_heavy Rain_three');
            }
            &.snow{
              @include bg-image('../images/weather/ic_snow_three');
            }
            &.foggy{
              @include bg-image('../images/weather/ic_foggy_three');
            }
            &.wind{
              @include bg-image('../images/weather/ic_wind_three');
            }
            &.sand{
              @include bg-image('../images/weather/ic_sand_three');
            }
          }
        }
        .date-price{
          margin-top: 0.1rem;
          text-align: center;
          font-size: 0.18rem;
          color: #999;
          .not-order{
            color: $mainColor;
          }
        }
      }
    }
  }
</style>
