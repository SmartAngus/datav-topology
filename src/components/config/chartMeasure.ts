import echarts from 'echarts/lib/echarts';
export function getMeasureOption(){
  let TP_value = 40;
  let kd = [];
  let Gradient = [];
  let leftColor = null;
  let showValue = null;
  let boxPosition = [65, 0];
  let TP_txt = ''
  let yAxisData=[]
// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
  for(let i = 0, len = 135; i <= len; i++) {
    const kv={key:'',value:0};
    if(i < 10 || i > 130) {
      kv.key=''
      if(i<10) kv.value=-60
      if(i>130) kv.value= 70
      kd.push(kv)

    } else {
      if((i - 10) % 20 === 0) {
        kv.key='-3';
        kv.value=i
      } else if((i - 10) % 4 === 0) {
        kv.key='-1';
        kv.value=i
      } else {
        kv.key='';
        kv.value=i
      }
      kd.push(kv)
    }
    yAxisData.push(i)

  }
//中间线的渐变色和文本内容
  if(TP_value > 20) {
    TP_txt = '温度偏高';
    Gradient.push({
      offset: 0,
      color: '#93FE94'
    }, {
      offset: 0.5,
      color: '#E4D225'
    }, {
      offset: 1,
      color: '#E01F28'
    })
  } else if(TP_value > -20) {
    TP_txt = '温度正常';
    Gradient.push({
      offset: 0,
      color: '#93FE94'
    }, {
      offset: 1,
      color: '#E4D225'
    })
  } else {
    TP_txt = '温度偏低';
    Gradient.push({
      offset: 1,
      color: '#93FE94'
    })
  }
  if(TP_value > 62) {
    showValue = 62
  } else {
    if(TP_value < -60) {
      showValue = -60
    } else {
      showValue = TP_value
    }
  }
  if(TP_value < -10) {
    boxPosition = [165, -120];
  }
  leftColor = Gradient[Gradient.length - 1].color;
// 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
  const measureOption = {
    backgroundColor: '#0C2F6F',
    title: {
      text: '温度计',
      show: false
    },
    yAxis: [{// 刻度坐标轴配置
      show: true,
      data: [],
      min: 0,
      max: 135,
      axisLine: {
        show: false
      }
    }, {
      show: false,
      min: 0,
      max: 50,
    }, {
      type: 'category',
      data: ['', '', '', '', '', '', '', '', '', '', '°C'],
      position: 'right',
      offset: 0,
      axisLabel: {
        fontSize: 10,
        color: 'white'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
    }],
    xAxis: [{
      show: false,
      min: -10,
      max: 80,
      data: []
    }, {
      show: false,
      min: -10,
      max: 80,
      data: []
    }, {
      show: false,
      min: -10,
      max: 80,
      data: []
    }, {
      show: false,
      min: -5,
      max: 80,
    }],
    series: [{
      name: '条',
      type: 'bar',
      // 对应上面XAxis的第一个对)象配置
      xAxisIndex: 0,
      data: [{
        value: (showValue + 70),
        label: {
          normal: {
            show: true,
            position: "top",
            distance:-10,
            // formatter: '{back| ' + TP_value + ' }{unit|°C}{downTxt|' + TP_txt + '}',
            formatter: '{back| ' + TP_value + ' }{unit|°C}',
            rich: {
              back: {
                align: 'center',
                lineHeight: 50,
                fontSize: 14,
                fontFamily: 'digifacewide',
                color: leftColor
              },
              unit: {
                fontFamily: '微软雅黑',
                fontSize: 15,
                lineHeight: 50,
                color: leftColor
              },
              downTxt: {
                lineHeight: 28,
                fontSize: 14,
                align: 'center',
                color: leftColor
              }
            }
          }
        }
      }],

      barWidth: 18,
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
      data: [134],
      barWidth: 28,
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
      data: [135],
      barWidth: 38,
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
      symbolSize: 48,
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
      symbolSize: 60,
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
      symbolSize: 70,
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
      label: {
        show: true,
        position: 'left',
        distance: 10,
        color: 'white',
        fontSize: 14,
        formatter: function(params) {
          if (params.dataIndex % 10 === 0) {
            return params.dataIndex ;
          } else if( params.dataIndex==100){
            return params.dataIndex;
          }else{
            return ""
          }
        }
      },
      barGap: '-100%',
      data: kd.map(item=>item.key),
      barWidth: 1,
      itemStyle: {
        normal: {
          color: 'white',
          barBorderRadius: 120,
        }
      },
      z: 0
    }]
  };
  return measureOption;
}

