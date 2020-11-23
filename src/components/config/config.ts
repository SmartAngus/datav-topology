import {getMeasureOption} from './chartMeasure'
export const Tools = [
  {
    group: '通用组件',
    children: [
      {
        name: 'timer',
        icon: 'icon-triangle',
        data: {
          text: '1970-01-01 00:00:00',
          rect: {
            width: 200,
            height: 45
          },
          name: 'biciTimer',
          elementRendered:false,
          property:{
            date:{
              show:true,
              format:'L'
            },
            time:{
              show:true,
              format:'LTS'
            }
          },
          iconColor:'#ccc'
        }
      },
      {
        name: 'varer',
        icon: 'icon-triangle',
        data: {
          text: '00:00:00',
          rect: {
            width: 100,
            height: 45
          },
          name: 'biciVarer',
          elementRendered:false,
          iconColor:'#ccc',
          property:{
            dataMethod:'aa',
            dataDot:1,
            dataPointParam:{
              qtDataList:[{
                id:"14040d68efd3401c9fd977c8e7f9bce8",// id 为数据点id
                type:1
              }],
              subscribe:true
            }
          }
        }
      },
      {
        name: '数据卡片',
        icon: 'icon-class',
        data: {
          text: '数据卡片',
          rect: {
            width: 200,
            height: 120
          },
          paddingTop: 30,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold'
          },
          fillStyle: '#ffffba',
          strokeStyle: '#7e1212',
          name: 'biciCard',
          children: [
            {
              text: '10000',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '50%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'center',
                fontSize:20,
                textBaseline: 'middle',
                fontWight:800
              }
            },
            {
              text: '上线 1000  下线 10',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: '50%',
                width: '100%',
                height: '50%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'center',
                textBaseline: 'middle'
              }
            }
          ],
          property: {
            normal:{
              value:0,
              font:{
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'center',
                textBaseline: 'middle'
              },
              bkColor:'#fff'
            },
            topLimit:{
              value:0,
              font:{
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'center',
                textBaseline: 'middle'
              },
              bkColor:'#fff'
            },
            bottomLimit:{
              value:0,
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'center',
                textBaseline: 'middle'
              },
              bkColor:'#fff'
            }
          }
        }
      },
      {
        name: '指示灯',
        icon: 'icon-final',
        data: {
          text: '指示灯',
          rect: {
            width: 30,
            height: 30
          },
          name: 'biciPilot'
        }
      }
    ]
  },
  {
    group: '自定义图片',
    children: [
      {
        name: 'image',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'image',
          image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'image',
          image: require('./machine.jpg')
        }
      },
    ]
  },
  {
    group: '基本形状',
    children: [
      {
        name: 'rectangle',
        icon: 'icon-rectangle',
        data: {
          text: '圆角矩形',
          rect: {
            width: 200,
            height: 50
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0.1,
          name: 'rectangle'
        }
      },
      {
        name: 'circle',
        icon: 'icon-circle',
        data: {
          text: '圆',
          rect: {
            width: 100,
            height: 100
          },
          name: 'circle',
          textMaxLine: 1
        }
      },
      {
        name: 'triangle',
        icon: 'icon-triangle',
        data: {
          text: '三角形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'triangle'
        }
      },
      {
        name: 'diamond',
        icon: 'icon-diamond',
        data: {
          text: '菱形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'diamond'
        }
      },
      {
        name: 'pentagon',
        icon: 'icon-pentagon',
        data: {
          text: '五边形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagon'
        }
      },
      {
        name: 'hexagon',
        icon: 'icon-hexagon',
        data: {
          text: '六边形',
          rect: {
            width: 100,
            height: 100
          },
          paddingTop: 10,
          paddingBottom: 10,
          name: 'hexagon'
        }
      },
      {
        name: 'pentagram',
        icon: 'icon-pentagram',
        data: {
          text: '五角星',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagram'
        }
      },
      {
        name: 'leftArrow',
        icon: 'icon-arrow-left',
        data: {
          text: '左箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'leftArrow'
        }
      },
      {
        name: 'rightArrow',
        icon: 'icon-arrow-right',
        data: {
          text: '右箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'rightArrow'
        }
      },
      {
        name: 'twowayArrow',
        icon: 'icon-twoway-arrow',
        data: {
          text: '双向箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'twowayArrow'
        }
      },
      {
        name: 'line',
        icon: 'icon-line',
        data: {
          text: '直线',
          rect: {
            width: 100,
            height: 100
          },
          name: 'line'
        }
      },
      {
        name: 'cloud',
        icon: 'icon-cloud',
        data: {
          text: '云',
          rect: {
            width: 100,
            height: 100
          },
          name: 'cloud'
        }
      },
      {
        name: 'message',
        icon: 'icon-msg',
        data: {
          text: '消息框',
          rect: {
            width: 100,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'message'
        }
      },
      {
        name: 'file',
        icon: 'icon-file',
        data: {
          text: '文档',
          rect: {
            width: 80,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'file'
        }
      },
      {
        name: 'text',
        icon: 'icon-text',
        data: {
          text: 'le5le-topology / 乐吾乐',
          rect: {
            width: 160,
            height: 30
          },
          name: 'text'
        }
      },
      {
        name: 'people',
        icon: 'icon-people',
        data: {
          rect: {
            width: 70,
            height: 100
          },
          name: 'people'
        }
      },
      {
        name: '视频/网页',
        icon: 'icon-pc',
        data: {
          text: '视频/网页',
          rect: {
            width: 200,
            height: 200
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          strokeStyle: 'transparent',
          name: 'div',
        }
      }
    ]
  },
  {
    group: '图表控件',
    children: [
      {
        elementRendered: false,
        name: '折线图', // 用name来区分不同的组件
        icon: 'icon-line-chart',
        data: {
          text: '折线图',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                title:{
                  text:'曲线图'
                },
                legend: {},
                tooltip: {},
                dataset: {
                  // 用 dimensions 指定了维度的顺序。直角坐标系中，
                  // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
                  // 如果不指定 dimensions，也可以通过指定 series.encode
                  // 完成映射，参见后文。
                  dimensions: ['product', '2015', '2016', '2017'],
                  source: [
                    {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                    {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                    {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                    {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                  ]
                },
                xAxis: {type: 'category'},
                yAxis: {},
                series: [
                  {type: 'line'},
                  {type: 'line'},
                  {type: 'line'}
                ]
              }
            },
            property:{
              echartsType:'line',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"14040d68efd3401c9fd977c8e7f9bce8",// id 为数据点id
                  type:1
                }],
                subscribe:true
              }
            }
          }
        }
      },
      {
        elementRendered: false,
        name: '实时曲线图', // 用name来区分不同的组件
        icon: 'icon-line-chart',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option:{
                animation: false,
                title: {
                  text: '总流量（kbps）'/*,
        left:"110px"*/ },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'cross' }
                },
                grid: {
                  left: 50/*"50px"*/,
                  right: 15/*"15px"*/
                },
                legend: {
                  data: ['当前流量']
                },
                xAxis: {
                  boundaryGap: false,
                  data: [1,2,3,4,5,6,7,8,9,10]
                },
                yAxis: { boundaryGap: false },
                series: [{
                  symbol: "none",/*去掉小圆点*/
                  name: '当前流量',
                  type: 'line',
                  smoothMonotone:'x',
                  smooth:true,
                  markLine: {
                    silent: true,
                    data: [{
                      yAxis: 20
                    }, {
                      yAxis: 40
                    }, {
                      yAxis: 60
                    }, {
                      yAxis: 100
                    }, {
                      yAxis: 120
                    }]
                  },
                  data: []/*,             smooth:true//显示为平滑的曲线*/
                }]
              }
            },
            property:{
              echartsType:'timeLine',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"14040d68efd3401c9fd977c8e7f9bce8",// id 为数据点id
                  type:1
                }],
                subscribe:true
              }
            }
          }
        }
      },
      {
        name: '柱状图',
        icon: 'icon-bar-chart',
        data: {
          text: '柱状图',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                legend: {},
                tooltip: {},
                dataset: {
                  dimensions: ['product', '2015', '2016', '2017'],
                  source: [
                    {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                    {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                    {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                    {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                  ]
                },
                xAxis: {type: 'category'},
                yAxis: {},
                series: [
                  {type: 'bar'},
                  {type: 'bar'},
                  {type: 'bar'}
                ]
              } // end echarts option
            },
            property:{
              echartsType:'bar',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"14040d68efd3401c9fd977c8e7f9bce8",// id 为数据点id
                  type:1
                }],
                subscribe:true
              }
            }
          }
        }
      },
      {
        name: '饼图',
        icon: 'icon-pie-chart',
        data: {
          text: '饼图',
          rect: {
            width: 200,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                  orient: 'vertical',
                  x: 'left',
                  data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                      normal: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        show: true,
                        textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: [
                      { value: 335, name: '直接访问' },
                      { value: 310, name: '邮件营销' },
                      { value: 234, name: '联盟广告' },
                      { value: 135, name: '视频广告' },
                      { value: 1548, name: '搜索引擎' }
                    ]
                  }
                ]
              }
            },
            property:{
              echartsType:'pie',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"14040d68efd3401c9fd977c8e7f9bce8",// id 为数据点id
                  type:1
                }],
                subscribe:true
              }
            }
          }
        }
      }, {
        name: '仪表盘',
        icon: 'icon-dashboard-chart',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 300
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                tooltip: {
                  formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                  feature: {
                    restore: {
                      show:false
                    },
                    saveAsImage: {
                      show:false
                    }
                  }
                },
                series: [
                  {
                    name: '业务指标',
                    type: 'gauge',
                    detail: { formatter: '{value}%' },
                    data: [{ value: 0, name: '' }]
                  }
                ]
              }
            },
            property:{
              echartsType:'gauge',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"02399e78150d4ac5b68bd5516e1a6851",// id 为数据点id
                  type:1
                }],
                subscribe:true
              }
            }
          }
        }
      },
      {
        elementRendered: false,
        name: '计量器',
        icon: 'icon-line-chart',
        data: {
          text: '计量器',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getMeasureOption()
            },
            property:{
              echartsType:'chartMeasure',
              dataMethod:'aa',
              dataDot:1,
              dataPointParam:{
                qtDataList:[{
                  id:"6413f3a606754c31987ec584ed56d5b7",// id 为数据点id
                  type:2
                }],
                subscribe:true
              }
            }
          }
        }
      }
    ]
  },
  {
    group: '流程图',
    children: [
      {
        name: '开始/结束',
        icon: 'icon-flow-start',
        data: {
          text: '开始',
          rect: {
            width: 120,
            height: 40
          },
          borderRadius: 0.5,
          name: 'rectangle'
        }
      },
      {
        name: '流程',
        icon: 'icon-rectangle',
        data: {
          text: '流程',
          rect: {
            width: 120,
            height: 40
          },
          name: 'rectangle'
        }
      },
      {
        name: '判定',
        icon: 'icon-diamond',
        data: {
          text: '判定',
          rect: {
            width: 120,
            height: 60
          },
          name: 'diamond'
        }
      },
      {
        name: '数据',
        icon: 'icon-flow-data',
        data: {
          text: '数据',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowData'
        }
      },
      {
        name: '准备',
        icon: 'icon-flow-ready',
        data: {
          text: '准备',
          rect: {
            width: 120,
            height: 50
          },
          name: 'hexagon'
        }
      },
      {
        name: '子流程',
        icon: 'icon-flow-subprocess',
        data: {
          text: '子流程',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowSubprocess'
        }
      },
      {
        name: '数据库',
        icon: 'icon-db',
        data: {
          text: '数据库',
          rect: {
            width: 80,
            height: 120
          },
          name: 'flowDb'
        }
      },
      {
        name: '文档',
        icon: 'icon-flow-document',
        data: {
          text: '文档',
          rect: {
            width: 120,
            height: 100
          },
          name: 'flowDocument'
        }
      },
      {
        name: '内部存储',
        icon: 'icon-internal-storage',
        data: {
          text: '内部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowInternalStorage'
        }
      },
      {
        name: '外部存储',
        icon: 'icon-extern-storage',
        data: {
          text: '外部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowExternStorage'
        }
      },
      {
        name: '队列',
        icon: 'icon-flow-queue',
        data: {
          text: '队列',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowQueue'
        }
      },
      {
        name: '手动输入',
        icon: 'icon-flow-manually',
        data: {
          text: '手动输入',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowManually'
        }
      },
      {
        name: '展示',
        icon: 'icon-flow-display',
        data: {
          text: '展示',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowDisplay'
        }
      },
      {
        name: '并行模式',
        icon: 'icon-flow-parallel',
        data: {
          text: '并行模式',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowParallel'
        }
      },
      {
        name: '注释',
        icon: 'icon-flow-comment',
        data: {
          text: '注释',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowComment'
        }
      }
    ]
  },
  {
    group: '活动图',
    children: [
      {
        name: '开始',
        icon: 'icon-inital',
        data: {
          text: 'kaishi',
          rect: {
            width: 30,
            height: 30
          },
          name: 'circle',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      },
      {
        name: '结束',
        icon: 'icon-final',
        data: {
          text: '',
          rect: {
            width: 30,
            height: 30
          },
          name: 'activityFinal'
        }
      },
      {
        name: '活动',
        icon: 'icon-action',
        data: {
          text: '活动',
          rect: {
            width: 120,
            height: 50
          },
          borderRadius: 0.25,
          name: 'rectangle'
        }
      },
      {
        name: '决策/合并',
        icon: 'icon-diamond',
        data: {
          text: '决策',
          rect: {
            width: 120,
            height: 50
          },
          name: 'diamond'
        }
      },
      {
        name: '垂直泳道',
        icon: 'icon-swimlane-v',
        data: {
          text: '垂直泳道',
          rect: {
            width: 200,
            height: 500
          },
          name: 'swimlaneV'
        }
      },
      {
        name: '水平泳道',
        icon: 'icon-swimlane-h',
        data: {
          text: '水平泳道',
          rect: {
            width: 500,
            height: 200
          },
          name: 'swimlaneH'
        }
      },
      {
        name: '垂直分岔/汇合',
        icon: 'icon-fork-v',
        data: {
          text: '',
          rect: {
            width: 10,
            height: 150
          },
          name: 'forkV',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      },
      {
        name: '水平分岔/汇合',
        icon: 'icon-fork',
        data: {
          text: '',
          rect: {
            width: 150,
            height: 10
          },
          name: 'forkH',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      }
    ]
  },
  {
    group: '时序图和类图',
    children: [
      {
        name: '生命线',
        icon: 'icon-lifeline',
        data: {
          text: '生命线',
          rect: {
            width: 150,
            height: 400
          },
          name: 'lifeline'
        }
      },
      {
        name: '激活',
        icon: 'icon-focus',
        data: {
          text: '',
          rect: {
            width: 12,
            height: 200
          },
          name: 'sequenceFocus'
        }
      },
      {
        name: '简单类',
        icon: 'icon-simple-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold'
          },
          fillStyle: '#ffffba',
          strokeStyle: '#7e1212',
          name: 'simpleClass',
          children: [
            {
              text: '- name: string\n+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            }
          ]
        }
      },
      {
        name: '类',
        icon: 'icon-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold'
          },
          fillStyle: '#ffffba',
          strokeStyle: '#7e1212',
          name: 'interfaceClass',
          children: [
            {
              text: '- name: string',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '50%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            },
            {
              text: '+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: '50%',
                width: '100%',
                height: '50%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            }
          ]
        }
      }
    ]
  }
];
