import { registerNode, loadJS } from '../../core';
import { echarts, echartsObjs } from './echarts';

export function register(_echarts?: any) {
  echartsObjs.echarts = _echarts;
  if (!echartsObjs.echarts && !(window as any).echarts) {
    loadJS(
      'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js',
      null,
      true
    );
    // loadJS(
    //   'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js',
    //   null,
    //   true
    // );
    // loadJS(
    //   'http://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js',
    //   null,
    //   true
    // );
  }
  registerNode('echarts', echarts, null, null, null);
}
