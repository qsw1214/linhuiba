webpackJsonp([121],{1571:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r(699),o=r.n(a),i=r(214),n=r(39),d=r(220);t.default={data:function(){return{placeholder:"请输入城市名（如杭州，hangzhou)",search:"",hotWords:[],recentSearch:[],showSearchPanel:!1,list:[],city_id:r.i(n.c)("cityId")||this.$store.state.cityId}},created:function(){var e=r.i(n.c)("recentSearch");e&&e.length&&(this.recentSearch=e)},mounted:function(){this.init()},methods:{init:function(){var e=this,t=r.i(n.c)("cityId")||this.$store.state.cityId,a={city_id:t};r.i(i._71)(a).then(function(t){e.hotWords=t.result})},goBack:function(){this.$router.push("/home/city")},goTimeSearch:function(e){this.search=e,this.wordSearch()},wordSearch:function(){if(this.search){if(!d.i.test(this.search))return this.$vux.toast.text("你的输入包含特殊字符，请重新输入","middle"),this.search="",!1;var e=[];if(e&&e.length){e.length>=10&&e.pop();var t=!1,r=!0,a=!1,i=void 0;try{for(var n,s=o()(e);!(r=(n=s.next()).done);r=!0){if(n.value.word==this.search){t=!0;break}}}catch(e){a=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(a)throw i}}t||e.unshift({word:this.search,link:"/fields?keywords="+encodeURIComponent(this.search)+"&city_id="+this.city_id})}else e.unshift({word:this.search,link:"/fields?keywords="+encodeURIComponent(this.search)+"&city_id="+this.city_id});this.$router.push({path:"/citySearchresult",query:{keywords:encodeURIComponent(this.search)}})}else this.$router.push("/citySearchresult")},clearRecentSearch:function(){r.i(n.d)("recentSearch",[]),this.recentSearch=[]},goHotword:function(e){this.$router.push({path:"/fields",query:{keywords:encodeURIComponent(e),city_id:this.city_id}})}},beforeRouteLeave:function(e,t,r){e.meta.keepAlive=!1,r()},watch:{search:function(e,t){var a=this;if(e){var o={city_id:this.city_id,res_type_id:1,keyword:e};r.i(i._72)(o).then(function(e){a.list=e.result,a.list.length?a.showSearchPanel=!0:a.showSearchPanel=!1}).catch(function(e){a.$vux.toast.text(e.msg,"middle")})}else this.showSearchPanel=!1}}}},1637:function(e,t,r){var a=r(668);t=e.exports=r(213)(!1),t.push([e.i,'.head[data-v-221379ba]{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding:.14rem .26rem;font-size:0;background-color:#fff;position:relative}.head[data-v-221379ba]:after{content:"";position:absolute;bottom:-.16rem;left:0;width:100%;height:.16rem;opacity:.4;background-image:linear-gradient(-180deg,rgba(0,0,0,.04) 3%,transparent)}.head .dropdown[data-v-221379ba]{position:relative}.head .dropdown .type[data-v-221379ba]{margin-right:.1rem;font-size:.26rem;color:#333}.head .dropdown .drop-icon[data-v-221379ba]{display:inline-block;width:.2rem;height:.1rem;margin-bottom:.05rem;background-image:url('+a(r(993))+");background-repeat:no-repeat;background-position:50%;background-size:100% 100%}@media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.head .dropdown .drop-icon[data-v-221379ba]{background-image:url("+a(r(994))+');background-position:50%;background-repeat:no-repeat;background-size:100% 100%}}.head .dropdown .drop-down[data-v-221379ba]{position:absolute;z-index:1;top:.64rem;left:0;width:1.34rem;height:2rem;padding:.08rem .1rem 0;background-color:#fff;box-shadow:0 2px 20px 0 rgba(0,0,0,.1)}.head .dropdown .drop-down>li[data-v-221379ba]{width:100%;height:1rem;position:relative;line-height:1rem;text-align:center;font-size:.26rem;color:#282a2a}.head .dropdown .drop-down>li[data-v-221379ba]:after{content:" ";pointer-events:none;position:absolute;bottom:0;left:0;width:100%;box-sizing:border-box;border-top:1px solid #ddd}.head .dropdown .drop-down>li[data-v-221379ba]:last-child:after,.head .dropdown .drop-down>li[data-v-221379ba]:last-child:before{display:none}.head .dropdown .drop-down[data-v-221379ba]:before{content:"";position:absolute;top:-.16rem;left:.3rem;width:0;height:0;border-top:.08rem solid transparent;border-right:.08rem solid transparent;border-left:.08rem solid transparent;border-bottom:.08rem solid #fff}.head .ipt[data-v-221379ba]{position:relative}.head .ipt .search-ipt[data-v-221379ba]{width:5.88rem;height:.6rem;padding:0 .1rem 0 .7rem;border-radius:.32rem;font-size:.3rem;background:#f1f2f6}.head .ipt .search-ipt[data-v-221379ba]::-webkit-input-placeholder{font-size:.3rem}.head .ipt .search-icon[data-v-221379ba]{position:absolute;top:.23rem;left:.3rem;width:.18rem;height:.18rem;background-image:url('+a(r(916))+");background-repeat:no-repeat;background-position:50%;background-size:100% 100%}@media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.head .ipt .search-icon[data-v-221379ba]{background-image:url("+a(r(917))+");background-position:50%;background-repeat:no-repeat;background-size:100% 100%}}.head .cancle[data-v-221379ba]{font-size:.32rem;color:#07f;letter-spacing:0;line-height:.32rem;font-weight:700}.hot-search[data-v-221379ba]{padding:.3rem .28rem .4rem;background-color:#fff}.hot-search .title[data-v-221379ba]{font-size:.24rem;color:#999}.hot-search .word-box[data-v-221379ba]{font-size:0}.hot-search .word-box .word-item[data-v-221379ba]{display:inline-block;height:.6rem;line-height:.6rem;padding:0 .4rem;margin:.2rem .2rem 0 0;border-radius:.3rem;font-size:.26rem;color:#282a2a;background-color:#f1f2f6}.recent-search[data-v-221379ba]{margin-top:.2rem;overflow:hidden;background-color:#fff}.recent-search .title[data-v-221379ba]{margin-top:.3rem;font-size:.24rem;color:#999}.recent-search .title>span[data-v-221379ba]{color:#999}.recent-search .title>span[data-v-221379ba]:nth-of-type(2){display:inline-block;width:.26rem;height:.32rem;background-image:url("+a(r(912))+");background-position:50%;background-size:100% 100%;background-size:.26rem .32rem;background-repeat:no-repeat}@media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.recent-search .title>span[data-v-221379ba]:nth-of-type(2){background-image:url("+a(r(913))+");background-position:50%;background-repeat:no-repeat;background-size:100% 100%}}.recent-search .list[data-v-221379ba]{display:-ms-flexbox;display:flex;padding-bottom:.2rem;-ms-flex-wrap:wrap;flex-wrap:wrap}.recent-search .list .item[data-v-221379ba]{display:block;padding:0 .4rem;height:.6rem;line-height:.6rem;margin:.2rem .2rem 0 0;font-size:.26rem;color:#282a2a;background:#f1f2f6;border-radius:.3rem}.search-list[data-v-221379ba]{position:absolute;top:.88rem;left:0;width:100%;height:auto;padding:.2rem 0}.search-list .time-item[data-v-221379ba]{display:block;padding:0 .24rem;line-height:.8rem;background-color:#fff}",""])},2075:function(e,t,r){var a=r(1637);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);r(524)("4dea4225",a,!0,{})},2411:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"head"},[r("div",{staticClass:"ipt"},[r("div",{staticClass:"search-icon",on:{click:e.wordSearch}}),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.search,expression:"search"}],staticClass:"search-ipt",attrs:{type:"search",autocomplete:"off",placeholder:e.placeholder},domProps:{value:e.search},on:{keyup:function(t){return"button"in t||13===t.keyCode?e.wordSearch(t):null},input:function(t){t.target.composing||(e.search=t.target.value)}}})]),e._v(" "),r("div",{staticClass:"cancle",on:{click:function(t){return t.stopPropagation(),e.goBack(t)}}},[e._v("取消")])])])},staticRenderFns:[]}},641:function(e,t,r){function a(e){r(2075)}var o=r(54)(r(1571),r(2411),a,"data-v-221379ba",null);e.exports=o.exports},668:function(e,t){e.exports=function(e){return"string"!=typeof e?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),/["'() \t\n]/.test(e)?'"'+e.replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"':e)}},699:function(e,t,r){e.exports={default:r(701),__esModule:!0}},701:function(e,t,r){r(141),r(138),e.exports=r(702)},702:function(e,t,r){var a=r(35),o=r(215);e.exports=r(11).getIterator=function(e){var t=o(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return a(t.call(e))}},912:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAYAAACWwljjAAAAAXNSR0IArs4c6QAAAXtJREFUWAntWLFOwzAQ9ZmsMFQkUpbuqbr1A9jhH2Bj4RMQCwN/wifAChJrt1ZhY0BIUUtHhkpIMXcRYUhPd27airaypSj1vXvn8/NT1ATMkiPr9R6cMac+NDDm8TXPz3xy6xxb/9jIHQB7D2O9CsAynljv0ovVyHOb9dDimnJkZzxHx0iXvJ32qFQ/4sr6Pmc4rk9Mqr9dHsLd7EdDkgfoyDRcOlbWQxKBMMkDPrhUfz+OTNrhqlhQSFMwKBQU0hTQ8OChoJCmgIYHDwWFNAU0PHho5xRq9Z+a3sGN8Nqr4ZJKrRrSPkJpuNQQa2rcYUGkbDBIJXIbrK5Zr9GswTbkAIZV4nx+3iSsPP+t+bdGo+BBY15NkzT9cGV5AQAncZJ8x93u26wovrhc3xgpE3c6V5h/ixfYKLr8nEzem3xUjh9Zv3+NTRGZVZFneUVLa+1NPh7fcdmsQpQ4m05fUKkn59wxdn2EoUOugG+s8gzAMymTj0b3vrx/z/sBH9dVSTJ3iP0AAAAASUVORK5CYII="},913:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA8CAYAAAAt3km7AAAAAXNSR0IArs4c6QAAAtZJREFUaAXtWrFuE0EQvV0QPhEQDSZCSEgUSHAnEVmmSA8Nv5D8AxUdNV2qFJGQKIGOlgp6ClyYyBYSRRAULpwmCpFiE+0yc/KdNidnfHueiWOxluybu51582aedxLJqyKm14MkeaWUemGtvVIHEmLHELv1vd9/WSe+HKPLD+reA7HndYvCnBiLGHXzl+PYCgNi29j1coKq9xPFtqv6B7/QgSXpgJp3ml20Oid7dUs9TNND2PjXLhrBefhAcX/0vNNsHgISsf/3dAU1VZIkm/hGW6LDPpg+fC5TwGmabpgoeos+YOPlHX4s6uXDh/7PQ+v7RRGuXTw8Z8Pl4NpTaNCFTQlYlkehsGVRKufJqpjP1EICvv456SpXcipWAXB9fKYWxvn6u7lm2ayKRe6kcu2zWLg+rn2Wv8dz3sI8Eku7hsKkO8yNHxTj7qg0XlBMusPc+EEx7o5K4wXFpDvMjR8U4+6oNF5QTLrD3PhBMe6OSuMFxaQ7zI0fFOPuqDReUEy6w9z4QTHujkrjBcWkO8yNHxTj7qg0Hq9ixvwoCLt28bBkuD6uXXKrc8v6+1iv13s/OV0QoQ2HSUhOvv4kWGmRtTAoxAJ+dmRiVlHIw9e/xJ28pb+Kxhzm0cba27m9qOspDg63aXzIwqCjP52gdcdelFlwMFrvUSTIwuI4/gTF/c0ArH2ER48oMMm1LDdwwBzIaaXR+Ezlu0QtDgaD0c3V1Tvw8/5j9IMN9PRWs/l7OBzuUnHca1gUHH3aAdxGhq31m91u9wOVhx5bENlqtZrH4/FXOLpwtwBS6hvYX7RSg+KZgDHZU+vQ2EwpTAFq/boax+1Op7NPpZxZGAYna2upPTn5eKo4ClVoDYuCvfMM/kz0Z6Ug91ge3O92e9glOO7wuthz+eI5XLOckBs5VCkKKVVSzOXebrdvHI1GT7Qx96DQ6+4auw0jHacfDgr46h2w4y8j4D9pCeOeWijrmwAAAABJRU5ErkJggg=="},916:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAiCAYAAAA3WXuFAAAAAXNSR0IArs4c6QAABBFJREFUWAnNl01IVFEUx2fGsSFFCMPKWkwSbRrCRUFgUA2YnyMoQbSpQJEoIYRcREG6roUtE3PjJnIRWH4n6cI2NQRBLiINjFQ0CGEY02Z0+p3Xe8M4zHv3jkb14M59957/+d///Xj3nHG5/rPHnY2eRCLhGRsbO7a5uXmIUux2u2PUC3DMhUKhz9lw2WG1BA0NDZ1FzFVIQtRFNmQz9Pfn5OR0V1dXf7TBKLsdBQ0ODh6H4T4iqiwmVmWW9gz1InUu9UFsAd73CYZ2nKrH6/Xeq6ysXJa+bB5bQYi5DFE3A/moVyidzP5pptmD8YyMjJxi+2QVm2h7qRcQ1VBVVfWGd+0noyDEtEPaISzMuAshdyD+rsPKGTsai8W68A/iu0a5WFNT80LH1xgvHSgrA1kvRDFsN2prax+nY1TtiYkJ7+rq6kN4WuCJMqHTTOi9yk/sW1bIPDNvIfJB1LwdMamDDgwM9NBuhGuO7QtwpqKp9kzvnrROOcAi5tFOxQhvSUnJdbjCcPrZxltpY2VsJgWZn7Z8TSss8d2M6Cw7A4HATwS1mm5t4+Pje1UUSUHMQr4QeTp1D/BvuPMvB/o1okZAFayvrzc4o10uQxBipA4JWD5tldM27H2mT73K1xAk4QBRRcxkNtM9oyJR2TnQg4JhjDMqrCFIYpPpINf/H3/MGzsCccHU1FSB0wCWoGIBsUKLTuCd2OCWIOyKRCISamwfQxBguQRlSXNtkTs0WNwbGxvGWHZ01goZ6hHmqN6ORLPf2IXCwkLHXTAEQTgnpMxCDrfVpzmOGibxDdRuJrxcVlb2w8nDGNxMruRA75eo7eSwHRu3dJ3pN6ryT12NfgGbKYTKT9vOirspV8SBFXquckwK4kLsxkGSqyZziVW+WnZC0iWApXDP+f1+fUHmhdjDbLySz0gKoTWiA4js4QB8D0xIh8Q2B7hhSq6QtHw+XzszkdQ0KPmMytnJLhOCaxyMXLqTxLReJ7xl2yKovLx8ia2rh2gNUS2Sz0xPT++ywNnU0Wi0kfMYgCvGRG9Sb+r4b0nQLAf2vQ5BTyj5EIUprRK1LbtdDd49PDxcBn7e4/F8i8fjH+g7THuWcg6Or3a+Vn9GQWLk8y/lVu2H0C9tCCWF6JNAmfpvIhwO5y4tLZVguwC2mVre33GVnGDb9rD1L+k/qSvKVhCkrtHR0Xwz02ujmRoUIwwgt3seg8kZSd36T7RvI+gZtStbUY6ChFAeyfTM5KoeAZJCJMUhTGLTF0qYbeomuXtFX4J28slGlJagJLP5IimERG0ErFZUVMwjQHlgdUVtS1C6QN22jqi/KkiEq0T9dUEqUalfh+7K7xgXDAZX8vLyznP25D/bEcok8dPIxf6JIJlRuigu0WvS/wvsrwOTks48JwAAAABJRU5ErkJggg=="},917:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAzCAYAAADciPtuAAAAAXNSR0IArs4c6QAABlhJREFUaAXtmVtI5UUcx/Uca71UIhuprZAbLARCD6v1JKEkeAcJdKuHfdiC0JelJTYjuuxCUL1kEBEEWexTFuWSVxSNZZEWTISyVoIFWXBVSnFpvRxvfX5n/zPMOZ6jM/9z5HCggeH3m/n/LvOd+/z+GRn/p/TqgcxkNHdmZubBubm5Z7BVsre39zi0GJoPXczMzJwPBALzOzs7fzU1Nf2ZDH82NnwDGxkZyQ+FQg04aQFEPfRhC4e3AHoVud6Ghobr8LsWOr5EnIFNTk7mLiwsvE6jLgLoEV9e7yvNYKOzsbGxLwEbcVWdgPX397+KpcsAKo62SCNnqZsmz5PvILPKFCyEytQ8Aa2EFpAjEnrX+HaBafprxIcEC1bAJiYmclZWVr6mAW1R/mYoXwkGg7319fUCLG4aHx/PWl9ffw4BmbpnybIGVQrRCe1Mz69URaL0UGADAwMlu7u7vTgqV87o5ds05J26uror8M7rZHR09Pjm5ubb2OsA4DFlF9rF1HwDmztGnS/2QGAeqBtYlumkUldeXt5b1dXVG6rCLx0eHj65tbX1Hfpmp/Uwci8Cbs+vXdGLC0ym3/Ly8nVkTnsOkj5dxK43zbsZuTOenwxAXWLk3ldlPzQuMDaKb3Gm1lQI43Us8HE/Tmx08NeFv/MiK6NFbmPkvrfRjSUTE5jsfjj5Uimwnl5J5sJWdk2KvwB+f6JOzkYBd49N6RTr+I4pZ8sHogXlnKLuslHfddSgxBdAdunAl2BvShmgedvb25eE95P2AZPDF6Phcwpnt2Wj8GPYjw4deJdRajd0z7HBPGWUrdkIYHJNAsxFpS1bejJ2P2XPhnIe/ozcgCcbZNc0Z4+NibBMBDC5+zFa6po0I+eUtaUkCtK5ncocfDOjlqfKtjQCGEothqKvw9fQ982y1f+G8pQYoKOzGbVaV2MamDw9UK5TBuSapPgUUXkFhBOjZna4qj6QamDynlLTEEOzh939DrSahI9ZWVkaGO163tWkBoZiiaE8bfApYWtra2U6qjtjEeCCLg3RwFA074Py9EhpYtbI5XrBa0RgbGysyKVBGhiGNDBAphyYgKBN+tbBjq3bZwNQA+NporZ50btro3zUMnTwquHDbJ9RHZvVwPi8qEQ4mAsVn0rKiD2m/NPxS4q3oRoYRvT0i1pvNnaORIZ2hK92Yjw3N1dPSxtnGhijpIGheMJG+Shl5J1GZx/3fISqqqr+cfGngUncTynSU5USo1DlVNDV1dVq2hF+VgFwluz0otbAvGDmLQ9EgRd4SQWmsE/WVLPh3DlEp4GJEXpFn/YUna8xRkMSYhmpAFkDY5nIA9QpRQBDU98PMXxWoklO1pIkzEv6ZUyF1zmdvcQrQwJKTikCGA89Cd5IrFBu1fleiMzJYKLCvOAfwIZ+OQPsM7JziC8CmBgg67cQDjokRJZoY130FxcXO5B/UnRoy1JOTs4nLvpKNgKYVEosHYPXhGfUjkncT7ZeKR91GhoaehYfHxl+PuAF/69Rtmb3ARNNAF2AhDwr5YS3uz3+yAjrqojgzY/SmeKEzp0uLS39wq/DmMDkBwE7UbsyirMzOJa4X0x5JZcIxfYY+uqi+zd8S1lZmepcZ9NxG+qF3LqURRyfl7gfYW+ny6jSt6CnDJmbhYWF5k3I+GTHxgUm6t4Pgh7DVAMH543BwcEqo8436+2ASv8bxUAr2UR6or4bnw9nw1eWg8QYqUxG6T1k3hXekB2QHdQLvBjVB7PYCNAxL9BBneg/jfRr2Aiv4b6+vg8pv6ks8L2XkWurqKjYUnW21GzogTo4bcVRNw2LDoVNoXhVgj8cpL8js+/M4d750Nra2mm+NaPfSn7CcDbFmi5X5WSBswYmjtmOi72w8zmKsWIQEqNYAIA8MVbIsh4fBchJ6L5pj9w9civreZDvOiUDnBMw5VnCzhKh9UYgW9U7UHmCfJ6dnf1pTU1NzOdIouB8AVMAJEIrwUwAyu9XCZFJwCXWyGzx/Q/kfiH/wG1ijIN3W9mJRxMBlxCw6AbR+KBEkzY2NuTlW0CW2MkKYOaYbpvR8jZlv+CSCsymoX5k/IBLC2DSGa7g0gaYK7i0AuYCLu2A2YJLS2A24PadOaKUDolrmLz09aOUo6aFi7PcNcMpbYFJ6wUcZ+TH96GEH8hViv8PwBWbbtDivdAAAAAASUVORK5CYII="},993:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAAXNSR0IArs4c6QAAAXJJREFUKBVjZACCjIyMjUDKhJGR0Xb69On3QGLEAqDeyf///88BqlebOXPmbSaoxn6goNC/f//2ABVIE2tYZmZmG8gwoENWS0pK3gXpY4RpBhrkA5RcB+TfZWNjs5s8efJrmBw2Gqi+Aqi+HWjYNkNDw4D09PTfIHUwFzLMmDFjCzMzcyxQgdqvX792FRQUCGAzCCQGdFk21LADEhISwTDDQHJwF4I4IAC0OQmoeA6QeYKXl9e1p6fnK1gCSgANiwcGzXygxaeZmJicp02b9gVZnhmZA2KfOXPmvImJyQcgM/X3798WPj4+qw4cOPAHJAd0SQjQssVAw64AsQswAj+BxJEBhgthkkCX1ABd0gzkbwYGeNDLly9dgXxQarjPwcFhN3HixJcwtcg0TgNBioDe7wS6qAzomj1ArjUQvwJ60xbozccgeWwAw8vIioDe32NqaioONDQcaOhboGGOQMMeIKshmQ00jBHo0lRg+KkSoxkAzomTj9adqsMAAAAASUVORK5CYII="},994:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAAAXNSR0IArs4c6QAAAlhJREFUOBGtk01oE1EQx93NmiBSUopConhQFBQU7MGDB71EUPw6CEU8KHgoCfkQYmIiFEoOHj00h3yBghQRKSiCRWurguJBEG/evAgixINC0HxoNll/U/NkjWm2qw68vJl5M/9f5u2utgZLJpNjjUbjA+5aTdNOl8vlO5L/HxaJRMYty3qK1qiu6/tLpdJL0dXlx+/3fwX4CddD0a1oNHpE8v9q8Xh8JxqPWKPof0O7qjSXwblc7jsJgX1mebvd7t1YLHZQFf3NDnSraZqPgW0EajLtBDf5TmktgyUg+cbj8Qj8C8XraJpn8n2q0M0OdFMPuhlol96zxWLxvl3jF1iSHL4yDOM4xU3CkU6ns8Az2m1vcPJTqdSGHnQbtRZaYYa63d/3G1gOC4XCc67lFK5c/xhricm3sztaNpv11+v1RW5slxSjc5GX6dqgxj/AUsTkC1z7GdwOIgEmfwJ8yyABlUun0+trtdoD6sclx6TTQGfUef+u9SfscTgcPkd8g4WO9tbn8x3I5/Mf7TXiJxIJX7vdngd6SGImvQr0kvgr2cCJVXGlUpnFj0uM6I5Wq7Uk37w6l50vwgA6p6Ckyk5Q6RsKlgLgRSa4LD62p9lsPsxkMiMSANWr1eos0JMSYzeDwWDspzv8d+hV21t5u68AmJIc1/4sEAgcBTpDbrJXdw/oBH/GtPet5K8aLALA84AuiA/8Pb564RaBngAqX8KqzBUYkAb8OsrnbeovgB4G2rDlHF3HZ2xXYEorFApNss9Jnv211+s95hZq13Tt813vBWi4buw1/ADgevG9e8MFwAAAAABJRU5ErkJggg=="}});