/**
 * 结构核心控制
 * important ☆☆☆☆☆
 */

(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth){
              return;
            } else if( clientWidth < 300 ){
              docEl.style.fontSize =  '40px';  // 300
            }else{
              docEl.style.fontSize = 50 * (clientWidth / 375) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
