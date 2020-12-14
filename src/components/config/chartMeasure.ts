import echarts from 'echarts/lib/echarts';
import moment from 'moment';
import * as _ from 'lodash';

export function getMeasureOption(option?: {
  min: number;
  max: number;
  value: number;
}) {
  let TP_value = 4;
  let kd = [];
  let Gradient = [];
  let leftColor = '';
  let showValue = 0;
  let TP_txt = '';
  // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
  for (var i = 0, len = 135; i <= len; i++) {
    if (i < 10 || i > 130) {
      kd.push('');
    } else {
      if ((i - 10) % 20 === 0) {
        kd.push('-3');
      } else if ((i - 10) % 4 === 0) {
        kd.push('-1');
      } else {
        kd.push('');
      }
    }
  }
  //中间线的渐变色和文本内容
  if (TP_value > 20) {
    TP_txt = '高';
    Gradient.push(
      {
        offset: 0,
        color: '#93FE94',
      },
      {
        offset: 0.5,
        color: '#E4D225',
      },
      {
        offset: 1,
        color: '#E01F28',
      }
    );
  } else if (TP_value > -20) {
    TP_txt = '正常';
    Gradient.push(
      {
        offset: 0,
        color: '#93FE94',
      },
      {
        offset: 1,
        color: '#E4D225',
      }
    );
  } else {
    TP_txt = '偏低';
    Gradient.push({
      offset: 1,
      color: '#93FE94',
    });
  }

  if (TP_value > 62) {
    showValue = 62;
  } else {
    if (TP_value < -60) {
      showValue = -60;
    } else {
      showValue = TP_value;
    }
  }
  leftColor = Gradient[Gradient.length - 1].color;
  // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
  let measureOption = {
    backgroundColor: 'blue',
    title: {
      text: '温度计',
      show: false,
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 50,
    },
    yAxis: [
      {
        show: false,
        data: [],
        min: 0,
        max: 135,
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
          color: 'white',
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
        show: false,
        min: -45,
        max: 45,
        data: [],
      },
      {
        show: false,
        min: -45,
        max: 45,
        data: [],
      },
      {
        show: false,
        min: -45,
        max: 45,
        data: [],
      },
      {
        show: false,
        min: -30,
        max: 50,
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
            value: showValue + 70,
            label: {
              normal: {
                show: true,
                position: 'bottom',
                distance: 30,
                backgroundColor: {
                  image: 'plugin/subway_beijing/images/power/bg5Valuebg.png', //文字框背景图
                },
                formatter:
                  '{back| ' + TP_value + ' }{unit|°C} {downTxt|' + TP_txt + '}',
                rich: {
                  back: {
                    align: 'center',
                    lineHeight: 20,
                    fontSize: 15,
                    fontFamily: 'digifacewide',
                    color: leftColor,
                  },
                  unit: {
                    fontFamily: '微软雅黑',
                    fontSize: 15,
                    lineHeight: 20,
                    color: leftColor,
                  },
                  downTxt: {
                    lineHeight: 20,
                    fontSize: 16,
                    align: 'center',
                    color: leftColor,
                  },
                },
              },
            },
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
        data: [134],
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
        data: [135],
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
        label: {
          normal: {
            show: true,
            position: 'left',
            distance: 10,
            color: 'white',
            fontSize: 14,
            formatter: function (params) {
              if (params.dataIndex > 130 || params.dataIndex < 10) {
                return '';
              } else {
                if ((params.dataIndex - 10) % 20 === 0) {
                  return params.dataIndex - 70;
                } else {
                  return '';
                }
              }
            },
          },
        },
        barGap: '-100%',
        data: kd,
        barWidth: 1,
        itemStyle: {
          normal: {
            color: 'white',
            barBorderRadius: 120,
          },
        },
        z: 0,
      },
    ],
  };

  return measureOption;
}
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
  const min = opt?.min || 0;
  const max = opt?.max || 100;
  const lineColors = opt?.lineColors || [
    //数组第一个属性是颜色所占line百分比
    [0.4, '#49afff'],
    [0.6, '#68A54A'],
    [1, '#f56c6c'],
  ];
  let showTitle = true;
  let unit;
  let title;
  if (opt) {
    if (opt.chartUnitChecked) {
      unit = opt?.chartUnit || '°C';
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
        radius: '100%',
        max: max,
        min: min,
        data: [{ value: 0, name: title }],
        axisLine: {
          lineStyle: {
            color: lineColors,
            width: 22,
          },
        },
        axisTick: { // 坐标轴小标记
          lineStyle: { // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 1,
          },
        },
        itemStyle:{
          color:'auto'
        },
        detail: {
          formatter: '{value} ' + unit,
          offsetCenter: [0, '60%'],
          textStyle: {
            fontSize: 16,
            color: '#F37B1D',
          },
        },
        title: {
          show: showTitle,
          offsetCenter: [0, '90%'],
        },
      },
    ],
  };
  return option;
}
// 计量器
export function getMeasureOption2(opt?: {
  associationObject?: string;
  value?: string | number;
  max?: number;
  min?: number;
  unit?: string;
  dataColors?: any;
}) {
  function f() {
    /*****设置*****/
    var TP_name = opt?.associationObject || '计量器';
    var TP_value = opt?.value || 0; //值
    var min = 0; //最小刻度
    var max = opt?.max || 100; //最大刻度
    var offset = 0; //负数设置
    var step = max / 5; //步长
    var range = [0, 20, 40]; //范围[高,中,低]
    var unit = opt?.unit || '°C'; //单位

    var dataColors = opt?.dataColors || [
      {
        checked: false,
        color: '#93FE94',
        top: 20,
        bottom: 0,
      },
      {
        checked: false,
        color: '#E4D225',
        top: 40,
        bottom: 20,
      },
      {
        checked: false,
        color: '#E01F28',
        top: 70,
        bottom: 40,
      },
    ];
    dataColors.map((item, index) => {
      range[index] = item.top;
      return item;
    });

    if (opt && opt.min && opt.min < 0) {
      offset = Math.abs(opt.min);
      max = max + 2 * offset;
    } else {
      min = opt?.min || 0;
    }
    /**************/
    var scale = step / 20; //比例
    var kd = [];
    var Gradient = [];
    var leftColor;
    var showValue;
    var len = max + scale * 15; //刻度+15
    var TP_txt = '';
    // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
    for (var i = 0; i <= len; i++) {
      if (i < min + scale * 10 || i > max + scale * 10) {
        kd.push('');
      } else {
        if ((i - scale * 10) % step === 0) {
          kd.push('-6');
        } else if ((i - scale * 10) % (step / 5) === 0) {
          kd.push('-3');
        } else {
          kd.push('');
        }
      }
    }
    //中间线的渐变色和文本内容
    if (TP_value > range[2]) {
      Gradient.push(
        {
          offset: 0,
          color: dataColors[0].color,
        },
        {
          offset: 0.5,
          color: dataColors[1].color,
        },
        {
          offset: 1,
          color: dataColors[2].color,
        }
      );
    } else if (TP_value > range[1]) {
      Gradient.push(
        {
          offset: 0,
          color: dataColors[0].color,
        },
        {
          offset: 1,
          color: dataColors[1].color,
        }
      );
    } else {
      Gradient.push({
        offset: 1,
        color: dataColors[0].color,
      });
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
    window['echarts_option_max'] = max;
    window['echarts_option_scale'] = scale;
    window['echarts_option_min'] = min;
    window['echarts_option_step'] = step;
    window['echarts_option_offset'] = offset;

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
              show: true,
              position: 'left',
              distance: 10,
              color: leftColor,
              fontSize: 14,
              formatter: function (params) {
                const max = window['echarts_option_max'];
                const scale = window['echarts_option_scale'];
                const min = window['echarts_option_min'];
                const step = window['echarts_option_step'];
                const offset = window['echarts_option_offset'];
                if (
                  params.dataIndex > max + scale * 10 ||
                  params.dataIndex < min + scale * 10
                ) {
                  return '';
                } else {
                  if ((params.dataIndex - scale * 10) % step === 0) {
                    return params.dataIndex - offset;
                  } else {
                    return '';
                  }
                }
              },
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
      ],
    };
    return option;
  }
  return f();
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
  let colorList=["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
  if(node != undefined){
    (node.property.lineGraphRange || []).map((colorObj, index) => {
      if(colorObj!=undefined&&colorObj.lineGraphRangeCheck&&colorObj.lineGraphRangeColor){
        colorList[index]=colorObj.lineGraphRangeColor
      }else{
        colorList[index]=colorList[index]
      }
    })
  }
  var charts = {
    unit: '',
    names: [],
    lineX: [],
    value: [],
  };
  var color = ['rgba(23, 255, 243', 'rgba(255,100,97'];
  var lineY = [];
  if (socketData != undefined) {
    charts.lineX = node.data.echarts.option.xAxis.data;
    if (charts.lineX.length > 9) {
      charts.lineX.shift();
    }
    charts.lineX.push(moment(socketData.time).format('LTS') + '');
  }
  if (node != undefined) {
    (node.property.dataPointSelectedRows || []).map((row, index) => {
      charts.value[index] = node.data.echarts.option.series[index]
        ? node.data.echarts.option.series[index].data
        : [];
      if (charts.value[index] && charts.value[index].length > 9) {
        charts.value[index].shift();
      }
      charts.names[index] = row.dataName||row.name;
      charts.unit=row.unit;
      if (socketData && row.id == socketData.id) {
        charts.value[index].push(socketData.value);
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
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: color[x] + ', 0.3)',
              },
              {
                offset: 0.8,
                color: color[x] + ', 0)',
              },
            ],
            false
          ),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
      symbol: 'circle',
      symbolSize: 5,
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
            opacity: dataTopShow,
          },
        },
      },
      data: [
        {
          type: 'average',
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
            opacity: dataTopShow,
          },
        },
      },
      data: [
        {
          type: 'average',
          name: '上限',
        },
      ],
    },
  });
  let showReference;
  let showReferenceColor="#1b2735";
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
  var option = {
    title: {
      text: chartTitle,
      show: chartTitleChecked,
      textStyle: {
        color: chartTitleColor,
      },
    },
    // backgroundColor: '#1b2735',
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: charts.names,
      textStyle: {
        fontSize: 12,
        color: 'rgb(0,253,255,0.6)',
      },
      left: 'center',
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
      boundaryGap: false,
      data: charts.lineX,
      axisLabel: {
        textStyle: {
          color: 'rgb(0,253,255,0.6)',
        },
        formatter: function (params) {
          return params.split(' ')[0];
        },
      },
    },
    yAxis: {
      name: '',//charts.unit,//
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: 'rgb(0,253,255,0.6)',
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
          color: 'rgb(0,253,255,0.6)',
        },
      },
    },
    series: lineY,
  };
  return option;
}
