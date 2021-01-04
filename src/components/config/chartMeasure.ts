import echarts from 'echarts/lib/echarts';
import moment from 'moment';
import * as _ from 'lodash';
import {getContrastColor, rgbaStringToRgb, rgbToHsl, roundFun} from '../utils/cacl';
import {colorList} from '../data/defines'

moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm A',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD HH:mm:ss',
    LL: 'YYYY/MM/DD',
    LLL: 'YYYY年MM月DD日Ah点mm分',
    LLLL: 'YYYY年MM月DD日ddddAh点mm分',
    l: 'YY/MM/DD',
    ll: 'MM/DD',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm',
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' ||
        meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    const hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: {
    sameDay: '[今天]LT',
    nextDay: '[明天]LT',
    nextWeek: '[下]ddddLT',
    lastDay: '[昨天]LT',
    lastWeek: '[上]ddddLT',
    sameElse: 'L'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    ss: '%d秒',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d个月',
    y: '1年',
    yy: '%d年'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
})

/***
 * 仪表盘
 * @param opt
 * @param changeValues
 */
export function getGaugeOption(
  opt?: {
    min: number;
    max: number;
    lineColors: any[];
    chartTitle: string;
    chartTitleChecked: boolean;
    chartUnitChecked: boolean;
    chartUnit: string;
  },
  changeValues?: any
) {
  if (opt) {
    opt = Object.assign({}, opt, changeValues);
  }
  let min = 0;
  if(opt){
    min=opt.min
  }
  let max = 100;
  if(opt){
    console.log(opt.max)
    max=opt.max
  }
  const lineColors = opt?.lineColors || [
    //数组第一个属性是颜色所占line百分比
    [0.4, '#49afff'],
    [0.6, '#68A54A'],
    [1, '#f56c6c'],
  ];
  if(lineColors[lineColors.length-1][0]<1){
    lineColors.push([1, '#f56c6c'])
  }
  lineColors.sort((a,b)=>{
    return a[0]-b[0]
  })
  let showTitle = true;
  let unit;
  let title;
  if (opt) {
    if (opt.chartUnitChecked) {
      unit = opt?.chartUnit || '';
    } else {
      unit = '';
    }
    if (opt.chartTitleChecked) {
      showTitle = true;
      title = opt.chartTitle;
    } else {
      showTitle = false;
    }
  } else {
    unit = '';
    showTitle = false;
    title = '仪表盘';
  }
  const option = {
    tooltip: {
      formatter: '{a} {b} : {c}%',
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 50,
    },
    toolbox: {
      feature: {
        restore: {
          show: false,
        },
        saveAsImage: {
          show: false,
        },
      },
    },
    series: [
      {
        name: '',
        type: 'gauge',
        min: min,
        max: max,
        radius: '100%',
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            width: 22,
            color:lineColors
          }
        },
        axisTick: {            // 坐标轴小标记
          length: 27,        // 属性length控制线长
          lineStyle: {       // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        splitLine: {           // 分隔线
          length: 30,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        axisLabel: {
          // backgroundColor: 'auto',
          // borderRadius: 2,
          color: '#345678',
          padding: 3,
          // textShadowBlur: 2,
          // textShadowOffsetX: 1,
          // textShadowOffsetY: 1,
          // textShadowColor: '#222'
        },
        title: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: 'bolder',
          fontSize: 20,
          fontStyle: 'italic',
          show: showTitle,
          offsetCenter: [0, '90%'],
        },
        detail: {
          formatter: '{value} ' + unit,
          offsetCenter: [0, '60%'],
          textStyle: {
            fontSize: 16,
            color: '#F37B1D',
          },
        },
        data: [{value: 0, name: title}]
      },
    ],
  };
  return option;
}

/**
 * 计量器
 * @param opt
 */
export function getMeasureOption2(node?:any,changeValues?:any,socketData?:any) {
  const dataColors =  [
    {
      checked: true,
      color: '#93FE94',
      top: 20,
      bottom: 0,
    },
    {
      checked: true,
      color: '#E4D875',
      top: 40,
      bottom: 20,
    },
    {
      checked: true,
      color: '#E98F28',
      top: 60,
      bottom: 40,
    },
    {
      checked: true,
      color: '#49D225',
      top: 80,
      bottom: 20,
    },
    {
      checked: true,
      color: '#E01F28',
      top: 100,
      bottom: 40,
    },
  ];
  const defaultOption={
    dataName:'',
    value: 0,
    chartUnit: '',
    dataColors: dataColors,
    chartUnitChecked: false,
    dataMax: 100,
    dataMin: 0,
  }
  let options=Object.assign({},defaultOption,node?.property,changeValues)
  options={
    ...options,
    ...node?.property?.dataPointSelectedRows[0],
    value:roundFun(socketData?.value, node?.property?.dataDot)||0
    // value:socketData?.value||0
  }
  if(node&&node.property){
    options.dataColors.map((color,index)=>{
      if(node.property.dataColors[index].checked){
        options.dataColors[index]=node.property.dataColors[index];
      }else{
        options.dataColors[index]=dataColors[index];
      }
    })
  }
  options.dataColors.sort((a,b)=>{
    return a.top-b.top
  })
  // options.dataColors=_.sortedUniqBy(options.dataColors,(item:any)=>{
  //   return item.top
  // })
  function f() {
    /*****设置*****/
    var TP_name = options.dataName ;
    var TP_value = options.value; //值
    var min = options.dataMin; //最小刻度
    var max = options.dataMax //最大刻度
    var offset = 0; //负数设置
    var step = max/10; //步长
    var range = [0, 20, 40]; //范围[高,中,低]
    var unit = options.chartUnit; //单位
    if(options.chartUnitChecked!=true){
      unit=''
    }
    var scale = step / 20; //比例

    options.dataColors.map((item, index) => {
      range[index] = item.top;
      return item;
    });

    if (options.dataMin < 0) {
      offset = Math.abs(options.dataMin);
      max = max + offset;
    } else {
      min = options.dataMin
    }
    /**************/

    var kd = [];
    var Gradient = [];
    var leftColor;
    var showValue;
    var len = max + scale * 15; //刻度+15
    var TP_txt = '';
    let showKd=[]
    // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
    for (var i = 0; i <= len; i++) {
      if (i < min + scale * 10 || i > max + scale * 10) {
        kd.push('');
        showKd.push('')
      } else {
        if ((i - scale * 10) % step === 0) {
          kd.push('-6');
          showKd.push(i - offset-scale * 10)
        } else if ((i - scale * 10) % (step / 5) === 0) {
          kd.push('-3');
          showKd.push('')
        } else {
          kd.push('');
          showKd.push('')
        }
      }
    }
    //中间线的渐变色和文本内容
    // if (TP_value > range[4]) {
    //   Gradient.push(
    //       {
    //         offset: 0,
    //         color: options.dataColors[0].color,
    //       },
    //       {
    //         offset: 0.25,
    //         color: options.dataColors[1].color,
    //       },
    //       {
    //         offset: 0.5,
    //         color: options.dataColors[2].color,
    //       },
    //       {
    //         offset: 0.75,
    //         color: options.dataColors[3].color,
    //       },
    //       {
    //         offset: 1,
    //         color: options.dataColors[4].color,
    //       }
    //   );
    // }else if (TP_value > range[3]) {
    //   Gradient.push(
    //       {
    //         offset: 0,
    //         color: options.dataColors[0].color,
    //       },
    //       {
    //         offset: 0.33,
    //         color: options.dataColors[1].color,
    //       },
    //       {
    //         offset: 0.66,
    //         color: options.dataColors[2].color,
    //       },
    //       {
    //         offset: 1,
    //         color: options.dataColors[3].color,
    //       }
    //   );
    // } else if (TP_value > range[2]) {
    //   Gradient.push(
    //     {
    //       offset: 0,
    //       color: options.dataColors[0].color,
    //     },
    //     {
    //       offset: 0.5,
    //       color: options.dataColors[1].color,
    //     },
    //     {
    //       offset: 1,
    //       color: options.dataColors[2].color,
    //     }
    //   );
    // } else if (TP_value > range[1]) {
    //   Gradient.push(
    //     {
    //       offset: 0,
    //       color: options.dataColors[0].color,
    //     },
    //     {
    //       offset: 1,
    //       color: options.dataColors[1].color,
    //     }
    //   );
    // } else {
    //   Gradient.push({
    //     offset: 1,
    //     color: options.dataColors[0].color,
    //   });
    // }
    // 相反
    if(TP_value < range[0]){
      Gradient.push({
        offset: 1,
        color: options.dataColors[0].color,
      });
    }else if(TP_value < range[1]){
      Gradient.push(
          {
            offset: 0,
            color: options.dataColors[0].color,
          },
          {
            offset: 1,
            color: options.dataColors[1].color,
          }
      );
    }else if (TP_value < range[2]) {
      Gradient.push(
          {
            offset: 0,
            color: options.dataColors[0].color,
          },
          {
            offset: (options.dataColors[1].top-min)/max,
            color: options.dataColors[1].color,
          },
          {
            offset: 1,
            color: options.dataColors[2].color,
          }
      );
    }else if (TP_value < range[3]) {
      Gradient.push(
          {
            offset: 0,
            color: options.dataColors[0].color,
          },
          {
            offset: (options.dataColors[1].top-min)/max,
            color: options.dataColors[1].color,
          },
          {
            offset: (options.dataColors[2].top-min)/max,
            color: options.dataColors[2].color,
          },
          {
            offset: 1,
            color: options.dataColors[3].color,
          }
      );
    }else {
      Gradient.push(
          {
            offset: 0,
            color: options.dataColors[0].color,
          },
          {
            offset: (options.dataColors[1].top-min)/max,
            color: options.dataColors[1].color,
          },
          {
            offset: (options.dataColors[2].top-min)/max,
            color: options.dataColors[2].color,
          },
          {
            offset: (options.dataColors[3].top-min)/max,
            color: options.dataColors[3].color,
          },
          {
            offset: 1,
            color: options.dataColors[4].color,
          }
      );
    }


    if (TP_value > max - offset + scale * 2) {
      showValue = max - offset + scale * 2;
    } else if (TP_value < min - offset) {
      showValue = min - offset;
    } else {
      showValue = TP_value;
    }

    offset = offset + scale * 10; //负数设置+10
    leftColor = Gradient[Gradient.length - 1].color;
    // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10


    var option = {
      backgroundColor: 'rgba(255,255,255,0)',
      grid: {
        top: '10%',
        bottom: '15%',
      },
      yAxis: [
        {
          show: false,
          data: [],
          min: 0,
          max: len,
          axisLine: {
            show: false,
          },
        },
        {
          show: false,
          min: 0,
          max: 50,
        },
        {
          type: 'category',
          data: ['', '', ''],
          position: 'left',
          offset: -40,
          axisLabel: {
            fontSize: 10,
            color: leftColor,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      xAxis: [
        {
          show: true,
          min: -55,
          max: 35,
          axisTick: 'none',
          axisLine: 'none',
          offset: 15,
          axisLabel: {
            textStyle: {
              color: leftColor,
              fontSize: '14',
            },
          },
          data: [TP_name],
        },
        {
          show: true,
          min: -55,
          max: 35,
          axisTick: 'none',
          axisLine: 'none',
          offset: 0,
          axisLabel: {
            textStyle: {
              color: leftColor,
              fontSize: '16',
            },
          },
          data: [TP_value + unit],
          z: 9,
        },
        {
          show: false,
          min: -55,
          max: 35,
          data: [],
        },
        {
          show: false,
          min: -40,
          max: 45,
        },
      ],
      series: [
        {
          name: '条',
          type: 'bar',
          // 对应上面XAxis的第一个对)象配置
          xAxisIndex: 0,
          data: [
            {
              value: showValue + offset,
            },
          ],
          barWidth: 8,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient),
            },
          },
          z: 2,
        },
        {
          name: '白框',
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          data: [len - scale],
          barWidth: 18,
          itemStyle: {
            normal: {
              color: '#0C2E6D',
              barBorderRadius: 50,
            },
          },
          z: 1,
        },
        {
          name: '外框',
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          data: [len],
          barWidth: 28,
          itemStyle: {
            normal: {
              color: '#4577BA',
              barBorderRadius: 50,
            },
          },
          z: 0,
        },
        {
          name: '圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 0,
          symbolSize: 18,
          itemStyle: {
            normal: {
              color: '#93FE94',
              opacity: 1,
            },
          },
          z: 2,
        },
        {
          name: '白圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 1,
          symbolSize: 30,
          itemStyle: {
            normal: {
              color: '#0C2E6D',
              opacity: 1,
            },
          },
          z: 1,
        },
        {
          name: '外圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 2,
          symbolSize: 40,
          itemStyle: {
            normal: {
              color: '#4577BA',
              opacity: 1,
            },
          },
          z: 0,
        },
        {
          name: '刻度',
          type: 'bar',
          yAxisIndex: 0,
          xAxisIndex: 3,
          myData: 1,
          label: {
            normal: {
              show: false,
              position: 'left',
              distance: 10,
              color: leftColor,
              fontSize: 14
            },
          },
          barGap: '-100%',
          data: kd,
          barWidth: 1,
          itemStyle: {
            normal: {
              color: leftColor,
              barBorderRadius: 120,
            },
          },
          z: 0,
        },
        {
          name: '刻度',
          type: 'bar',
          yAxisIndex: 0,
          xAxisIndex: 3,
          myData: 1,
          label: {
            normal: {
              show: true,
              position: [-40,-5],
              distance: 20,
              color: leftColor,
              fontSize: 14,
            },
          },
          barGap: '-100%',
          data: showKd,
          barWidth: 1,
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0.0001)',
              barBorderRadius: 120,
            },
          },
          z: 0,
        },
      ],
    };
    return option;
  }
  const o = f();

  return o;
}

export function getTimelineOption(
  selectedNode?: any,
  socketData?: any,
  changeValues?: any
) {
  let node = _.cloneDeep(selectedNode);
  if (node != undefined) {
    node.property = Object.assign({}, node.property, changeValues);
  }

  if(node != undefined){
    (node.property.lineGraphRange || []).map((colorObj, index) => {
      if(colorObj!=undefined&&colorObj.lineGraphRangeColor){
        colorList[index]=colorObj.lineGraphRangeColor
      }else{
        colorList[index]=colorList[index]
      }
    })
  }
  var charts = {
    unit: '',
    names: [],
    value: [],
  };
  var color = ['rgba(23, 255, 243', 'rgba(255,100,97'];
  var lineY = [];
  if (node != undefined) {
    (node.property.dataPointSelectedRows || []).map((row, index) => {
      charts.value[index] = node.data.echarts.option.series[index]
        ? node.data.echarts.option.series[index].data
        : [];


      charts.names[index] = row.dataName||row.name;
      charts.unit=row.unit;
      if (socketData && row.id == socketData.id) {
        if (charts.value[index] && charts.value[index].length > 29 ) {
          charts.value[index].shift();
        }
        // if(charts.value[index][0]&&charts.value[index][0]==0){
        //   charts.value[index].shift();
        // }
        const v =  roundFun(socketData.value, node.property.dataDot);
        charts.value[index].push({
          name:moment(socketData.time),
          value:[
            socketData.time,v
          ]
        });
      }
    });
  }
  let smooth;
  if (node && node.property.smooth == true) {
    smooth = true;
  } else {
    smooth = false;
  }
  for (var i = 0; i < charts.names.length; i++) {
    var x = i;
    if (x > color.length - 1) {
      x = color.length - 1;
    }
    var data = {
      name: charts.names[i],
      type: 'line',
      color: color[x] + ')',
      smooth: smooth,
      // areaStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0,
      //       0,
      //       0,
      //       1,
      //       [
      //         {
      //           offset: 0,
      //           color: color[x] + ', 0.3)',
      //         },
      //         {
      //           offset: 0.8,
      //           color: color[x] + ', 0)',
      //         },
      //       ],
      //       false
      //     ),
      //     shadowColor: 'rgba(0, 0, 0, 0.1)',
      //     shadowBlur: 10,
      //   },
      // },
      // symbol: 'circle',
      // symbolSize: 5,
      showSymbol: false,
      hoverAnimation: false,
      data: charts.value[i],
      itemStyle: {
        normal: {
          color: colorList[i],
          borderColor: colorList[i]
        }
      }
    };
    lineY.push(data);
  }
  let dataTopShow;
  let dataTop = 100;
  let dataBottom = 0;
  if (node && node.property.dataTopChecked == true) {
    dataTopShow = 1;
  } else {
    dataTopShow = 0;
  }
  if (node) {
    dataTop = node.property.dataTop;
    dataBottom = node.property.dataBottom;
  }

   lineY.push({
     name: '下限',
     type: 'line',
     symbolSize: 0,
     data: [dataBottom],
     markLine: {
       itemStyle: {
         normal: {
           lineStyle: {
             color: '#18D8F7',
             opacity:dataTopShow
           },
         },
       },
       data: [
         {
           type: 'median',
           name: '下限',
         },
       ],
     },
   });
   lineY.push({
     name: '上限',
     type: 'line',
     data: [dataTop],
     symbolSize: 0,
     markLine: {
       itemStyle: {
         normal: {
           lineStyle: {
             color: '#FF0000',
             opacity:dataTopShow
           },
         },
       },
       data: [
         {
           type: 'median',
           name: '上限',
         },
       ],
     },
   });

  let showReference;
  let showReferenceColor="#1b2735";
  let showBackground;
  let showBackgroundColor="transparent";
  if (node && node.property.chartBackgroundChecked == true) {
    showBackground = true;
    showBackgroundColor=node.property.chartBackgroundColor;
  } else {
    showBackground = false;
    if(node){
      showBackgroundColor="transparent";
    }
  }
  if (node && node.property.lineReferenceChecked == true) {
    showReference = true;
    showReferenceColor=node.property.lineReferenceColor;
  } else {
    showReference = false;
  }
  let chartTitleChecked = false,
    chartTitle = '实时曲线',
    chartTitleColor = '#c0c0c0';
  if (node && node.property.chartTitleChecked == true) {
    chartTitleChecked = node.property.chartTitleChecked;
    chartTitle = node.property.chartTitle;
    chartTitleColor = node.property.chartTitleColor;
  } else if(node&&node.property.chartTitleChecked==false){
    chartTitleChecked = false;
    chartTitle = '';
    chartTitleColor = '#c0c0c0';
  } else {
    chartTitleChecked = false;
    chartTitle = '';
    chartTitleColor = '#c0c0c0';
  }

let trastColor = getContrastColor(showBackgroundColor)
  if(showBackgroundColor=='transparent'){
    trastColor="#4a4a4a"
  }

  var option = {
    title: {
      text: chartTitle,
      show: chartTitleChecked,
      textStyle: {
        color: chartTitleColor,
      },
    },
    backgroundColor: showBackgroundColor,
    legend: {
      data: charts.names,
      textStyle: {
        fontSize: 12,
        color: 'rgb(0,253,255,0.6)',
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      show:false,
      // formatter: function (params) {
      //   params = params[0];
      //   var date = new Date(params.name);
      //   return moment(date).format("LTS")+": "+ params.value[1]
      // },
      axisPointer: {
        animation: false
      }
    },
    grid: {
      top: '24%',
      left: '4%',
      right: '10%',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false
      },
      axisLine:{
        lineStyle:{
          color:trastColor
        }
      },
      axisLabel: {
        textStyle: {
          color: trastColor,
        },
        formatter: function (value, index) {
          // 格式化成月/日，只在第一个刻度显示年份
          return moment(Number(value)).format('LTS');
        }
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      axisLabel: {
        textStyle: {
          color: trastColor,
        },
      },
      splitLine: {
        show: showReference,
        lineStyle: {
          color: showReferenceColor,
        },
      },
      axisLine: {
        lineStyle: {
          color: trastColor,
        },
      },
    },
    series: lineY,
  };

  return option;
}
