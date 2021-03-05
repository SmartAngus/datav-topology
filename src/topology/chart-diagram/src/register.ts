import { registerNode, loadJS } from '../../core';
import { echarts, echartsObjs } from './echarts';

export function register(_echarts?: any) {
  echartsObjs.echarts = _echarts;
  if (!echartsObjs.echarts && !(window as any).echarts) {
    loadJS(
      'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js', null, true
    );
  }
  registerNode('echarts', echarts, null, null, null);
}
