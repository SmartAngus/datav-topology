import echarts from 'echarts/lib/echarts';
import moment from "moment";

export function getMeasureOption(option?:
  {
     min:number,
     max:number,
     value:number,
  }){
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
    grid:{
      top:0,
      left:0,
      right:0,
      bottom:50
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
                position: "bottom",
                distance:30,
                backgroundColor: {
                  image: 'plugin/subway_beijing/images/power/bg5Valuebg.png', //文字框背景图
                },
                formatter:
                  '{back| ' +
                  TP_value +
                  ' }{unit|°C} {downTxt|' +
                  TP_txt +
                  '}',
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
export function getGaugeOption(opt?:{
  min:number,
  max:number,
  lineColors:any[]
}) {
  const min = opt?.min || 0;
  const max = opt?.max || 100;
  const lineColors = opt?.lineColors||[ //数组第一个属性是颜色所占line百分比
    [0.4, "#49afff"],
    [0.6, "#68A54A"],
    [1, "#f56c6c"]
  ]
  const option={
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    grid:{
      top:0,
      left:0,
      right:0,
      bottom:50
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
        radius:"100%",
        max:max,
        min:min,
        detail: { formatter: '{value}' },
        data: [{ value: 0, name: '' }],
        axisLine: {
          lineStyle: {
            color: lineColors,
            width: 22
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 1
          }
        }
      }
    ]
  }
  return option;
}

export function getMeasureOption2(opt?:{
  associationObject?:string,
  value?:string|number
  max?:number;
  min?:number;
  unit?:string;
  dataColors?:any;
}) {
  function f() {
    /*****设置*****/
    var TP_name=opt?.associationObject||"计量器";
    var TP_value = opt?.value||0;//值
    var min = 0;//最小刻度
    var max = opt?.max||100;//最大刻度
    var offset = 0;//负数设置
    var step = max/5;//步长
    var range = [0,20,40]//范围[高,中,低]
    var unit = opt?.unit||'°C';//单位

    var dataColors=opt?.dataColors||[
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
    ]
    dataColors.map((item,index)=>{
      range[index]=item.top
      return item
    })

    if(opt&&opt.min&&opt.min<0){
      offset = Math.abs(opt.min)
      max=max+2*offset
    }else{
      min=opt?.min||0
    }
    /**************/
    var scale = step/20;//比例
    var kd = [];
    var Gradient = [];
    var leftColor;
    var showValue;
    var len = max+(scale*15);//刻度+15
    var TP_txt = '';
    // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
    for (var i = 0; i <= len; i++) {
      if (i < (min+(scale*10)) || i > (max+(scale*10))) {
        kd.push('')
      } else {
        if ((i - (scale*10)) % step === 0) {
          kd.push('-6');
        } else if ((i - (scale*10)) % (step/5) === 0) {
          kd.push('-3');
        } else {
          kd.push('');
        }
      }

    }
    //中间线的渐变色和文本内容
    if (TP_value > range[2]) {
      Gradient.push({
        offset: 0,
        color: dataColors[0].color
      }, {
        offset: 0.5,
        color: dataColors[1].color
      }, {
        offset: 1,
        color: dataColors[2].color
      })
    } else if (TP_value > range[1]) {
      Gradient.push({
        offset: 0,
        color: dataColors[0].color
      }, {
        offset: 1,
        color: dataColors[1].color
      })
    } else {
      Gradient.push({
        offset: 1,
        color: dataColors[0].color
      })
    }
    if (TP_value > (max-offset+(scale*2))) {
      showValue = max-offset+(scale*2);
    } else if (TP_value < min-offset) {
      showValue = min-offset;
    } else {
      showValue = TP_value
    }

    offset = offset+(scale*10);//负数设置+10
    leftColor = Gradient[Gradient.length - 1].color;
    // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
    window["echarts_option_max"]=max;
    window["echarts_option_scale"]=scale;
    window["echarts_option_min"]=min;
    window["echarts_option_step"]=step;
    window["echarts_option_offset"]=offset;

    var option = {
      backgroundColor: 'rgba(255,255,255,0)',
      grid:{
        top:'10%',
        bottom:'15%',
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
      xAxis: [{
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
      }, {
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
        data: [TP_value+unit],
        z: 9,
      }, {
        show: false,
        min: -55,
        max: 35,
        data: []
      }, {
        show: false,
        min: -40,
        max: 45,

      }],
      series: [{
        name: '条',
        type: 'bar',
        // 对应上面XAxis的第一个对)象配置
        xAxisIndex: 0,
        data: [{
          value: (showValue + offset),
        }],
        barWidth: 8,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
          }
        },
        z: 2
      }, {
        name: '白框',
        type: 'bar',
        xAxisIndex: 1,
        barGap: '-100%',
        data: [len-scale],
        barWidth: 18,
        itemStyle: {
          normal: {
            color: '#0C2E6D',
            barBorderRadius: 50,
          }
        },
        z: 1
      }, {
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
          }
        },
        z: 0
      }, {
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
          }
        },
        z: 2
      }, {
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
          }
        },
        z: 1
      }, {
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
          }
        },
        z: 0
      }, {
        name: '刻度',
        type: 'bar',
        yAxisIndex: 0,
        xAxisIndex: 3,
        myData:1,
        label: {
          normal: {
            show: true,
            position: 'left',
            distance: 10,
            color: leftColor,
            fontSize: 14,
            formatter: function(params) {
              const max=window["echarts_option_max"];
              const scale=window["echarts_option_scale"];
              const min = window["echarts_option_min"];
              const step=window["echarts_option_step"];
              const offset=window["echarts_option_offset"];
              if (params.dataIndex > (max+(scale*10)) || params.dataIndex < (min+(scale*10))) {
                return '';
              } else {
                if ((params.dataIndex - (scale*10)) % step === 0) {
                  return params.dataIndex - offset;
                } else {
                  return '';
                }
              }
            }
          }
        },
        barGap: '-100%',
        data: kd,
        barWidth: 1,
        itemStyle: {
          normal: {
            color: leftColor,
            barBorderRadius: 120,
          }
        },
        z: 0
      }]
    };
    return option;
  }
  return f();
}

export function getTimelineOption(node?:any,socketData?:any) {
  var charts = {
    unit: 'Kbps',
    names: [],
    lineX: [],
    value: []
  };
  var color = ['rgba(23, 255, 243', 'rgba(255,100,97'];
  var lineY = [];
  if(socketData!=undefined){
    charts.lineX = node.data.echarts.option.xAxis.data;
    if(charts.lineX.length>9){
      charts.lineX.shift()
    }
    charts.lineX.push(moment(socketData.time).format('LTS')+'')
  }
  if(node!=undefined){
    (node.property.dataPointSelectedRows || []).map((row,index)=>{
        charts.value[index]=node.data.echarts.option.series[index]?node.data.echarts.option.series[index].data:[]
        if(charts.value[index]&&charts.value[index].length>9){
          charts.value[index].shift()
        }
      charts.names[index]=row.associationObject;
      if(row.id==socketData.id){
          charts.value[index].push(socketData.value)
        }

    });
  }
  for (var i = 0; i < charts.names.length; i++) {
    var x = i
    if (x > color.length - 1) {
      x = color.length - 1
    }
    var data = {
      name: charts.names[i],
      type: 'line',
      color: color[x] + ')',
      smooth: true,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: color[x] + ', 0.3)'
          }, {
            offset: 0.8,
            color: color[x] + ', 0)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        }
      },
      symbol: 'circle',
      symbolSize: 5,
      data: charts.value[i]
    }
    lineY.push(data)
  }

  lineY.push({
    name: '标准 ',
    type: 'line',
    symbolSize:0,
    data: [50],
    markLine: {
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#18D8F7'
          },
        }
      },
      data: [{
        type: 'average',
        name: '标准'
      }]
    }
  })
  lineY.push({
    name: '最大值 ',
    type: 'line',
    data: [110],
    symbolSize:0,
    markLine: {
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#FF0000'
          },
        }
      },
      data: [{
        type: 'average',
        name: '最大值'
      }]
    }
  })
  var option = {
    backgroundColor:'#1b2735',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: charts.names,
      textStyle: {
        fontSize: 12,
        color: 'rgb(0,253,255,0.6)'
      },
      right: '4%'
    },
    grid: {
      top: '14%',
      left: '4%',
      right: '10%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: charts.lineX,
      axisLabel: {
        textStyle: {
          color: 'rgb(0,253,255,0.6)'
        },
        formatter: function(params) {
          return params.split(' ')[0]
        }
      }
    },
    yAxis: {
      name: charts.unit,
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: 'rgb(0,253,255,0.6)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgb(23,255,243,0.3)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgb(0,253,255,0.6)'
        }
      }
    },
    series: lineY
  }
  return option;
}