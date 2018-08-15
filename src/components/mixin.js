/**
 * Created by gourd on 2017/8/18.
 */
import { getStyle } from 'src/config/tools' ;

export const loadMore = {
  directives: {
    'load-more': {
      bind: (el, binding) => {
        let windowHeight = window.screen.height;
        let height;
        let setTop;
        let paddingBottom;
        let marginBottom;
        let requestFram;
        let oldScrollTop;
        let scrollEl;
        let heightEl;
        let scrollType = el.attributes.type && el.attributes.type.value;
        let scrollReduce = 2;
        // 判断滚动的元素  不为2则是整个body滚动
        if (scrollType == 2) {
          //
          scrollEl = el;
          heightEl = el.children[0];
        } else {
          scrollEl = document.body;
          heightEl = el;
        }

        el.addEventListener('touchstart', () => {
          height = heightEl.clientHeight;
          if (scrollType == 2) {
            height = height
          }
          setTop = el.offsetTop;
          paddingBottom = getStyle(el, 'paddingBottom');
          marginBottom = getStyle(el, 'marginBottom');
        }, false)

        el.addEventListener('touchmove', () => {
          loadMore();
        }, false)

        el.addEventListener('touchend', () => {
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        }, false)

        // const moveEnd = () => {
        //   requestFram = requestAnimationFrame(() => {
        //     if (scrollEl.scrollTop != oldScrollTop) {
        //       oldScrollTop = scrollEl.scrollTop;
        //       moveEnd()
        //     } else {
        //       cancelAnimationFrame(requestFram);
        //       height = heightEl.clientHeight;
        //       loadMore();
        //     }
        //   })
        // }
        const moveEnd = () => {
          // 兼容写法
          if( !window.requestAnimationFrame && !window.cancelAnimationFrame ){
            requestFram = setTimeout( () => {
              if (scrollEl.scrollTop != oldScrollTop) {
                oldScrollTop = scrollEl.scrollTop;
                moveEnd()
              } else {
                clearTimeout(requestFram);
                height = heightEl.clientHeight;
                loadMore();
              }
            } , 16 );
          }else{
            requestFram = requestAnimationFrame(() => {
              if (scrollEl.scrollTop != oldScrollTop) {
                oldScrollTop = scrollEl.scrollTop;
                moveEnd()
              } else {
                cancelAnimationFrame(requestFram);
                height = heightEl.clientHeight;
                loadMore();
              }
            })
          }

        };
        const loadMore = () => {
          // 多减去的10px是为了更快的加载数据，避免等待
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce - 100 ) {
            binding.value();
          }
        }
      }
    }
  }
};
