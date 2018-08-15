// 定义一些需要的处理函数，比如过滤器 , 把所有的过滤器都集中管理， 这样在vue示例中都可以使用

// 保留两个小数
export const twoPoint = ( num  => {
  const a = num*1 ;
  const b = a.toFixed(2) ;
  return b;
})
// 保留两个小数，并获取到小数点前面的
export const twoPointPre = ( num  => {
  const a = num*1 ;
  const b = a.toFixed(2) + '';
  return b.split('.')[0];
})
// 保留两个小数，并获取到小数点后面的
export const twoPointNext = ( num  => {
  const a = num*1 ;
  const b = a.toFixed(2) + '';
  return b.split('.')[1];
})
// 超出99 显示99+
export const hundred = ( num => {
  if( num > 99 ){
    return '99+';
  }else{
    return num ;
  }
})

// 图片过滤，加上私有后缀 300*240
export const half = ( imgurl => {
  if( !imgurl ){
    return '/static/img/nophotos.22dee75.png';
  }
  imgurl += '-linhuiba_half?v=1';
  return imgurl;
})

// 图片过滤，加上私有后缀 180*180
export const small = ( imgurl => {
  if( !imgurl ){
    return '/static/img/nophotos.22dee75.png';
  }
  imgurl += '-linhuiba_thumbnail?v=1';
  return imgurl;
})

// 图片过滤，加上私有后缀 600*480
export const large = ( imgurl => {
  if( !imgurl ){
    return '/static/img/nophotos.22dee75.png' ;
  }
  imgurl += '-linhuiba_watermark?v=1';
  return imgurl;
})
// 图片没有时，默认给上 nophoto.png
export const nophoto = ( imgurl => {
  if( !imgurl ){
    return '/static/img/nophotos.22dee75.png';
  }
})


// 去掉空格
export const trim = ( val => {
  if( !val ){
    return ;
  }
  return val.replace( /^\s*|\s*$/ , "" ) ;
})
// 时间格式化
export const timeFormat = ( time => {
  if( !time ){ return ;}
  return time.replace( /-/gi , '.' );
})

// 场地规格*号换成x
export const normFormat = ( norm => {
  if( !norm ){ return ;}
  return norm.replace( /\*/gi , 'x' );
})
// 把秒转化成小时
export const ssTohh = ( hour => {
  if( hour > 0 ){
    let h = '' ;
    let number = 0 ;
    if( hour > 3600 ){
      number = parseInt( hour/3600 );
      h = number + '小时' ;
    }else if( hour >= 60 ){
      number = parseInt( hour/60 );
      h = number + '分钟' ;
    }else{
      h = hour + '秒' ;
    }
    return h;
  }
})

// 支付方式转化
export const payModel = ( model => {
  if( model == 0 ){
    return '线下支付' ;
  }
  else if( model == 1 ){
    return '微信app支付' ;
  }
  else if( model == 2 ){
    return '微信公众号支付' ;
  }
  else if( model == 3 ){
    return '微信原生扫码支付' ;
  }
  else if( model == 4 ){
    return '钱包支付' ;
  }
  else if( model == 5 ){
    return '微信小程序支付' ;
  }
  else if( model == 6 ){
    return '5w微信app支付' ;
  }
  else if( model == 7 ){
    return '微信H5支付' ;
  }
  else if( model == 8 ){
    return '支付宝PC端网页支付' ;
  }
  else if( model == 9 ){
    return '支付宝手机网页支付' ;
  }
  else if( model == 10 ){
    return '支付宝APP支付' ;
  }
  else{
    return '未支付' ;
  }
})

export const toWeeks = val => {
  let name = ''
  switch (val) {
    case '周日': 
      name = '星期天'
      break;
    case '周一': 
      name = '星期一'
      break;
    case '周二': 
      name = '星期二'
      break;
    case '周三': 
      name = '星期三'
      break;
    case '周四': 
      name = '星期四'
      break;
    case '周五': 
      name = '星期五'
      break;
    case '周六': 
      name = '星期六'
      break; 
    default: 
      console.error('The Value Not In Week')
      break;
  }
  return name
}

