import { getMeasureOption, getGaugeOption,getMeasureOption2 } from './chartMeasure';
export const Tools = [
  {
    group: '通用组件',
    children: [
      {
        name: '矩形',
        icon: 'iconjuxing',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 50,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0.1,
          name: 'rectangle',
        },
      },
      {
        name: '圆',
        icon: 'iconyuanxing',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'circle',
          textMaxLine: 1,
        },
      },
      {
        name: '文本',
        icon: 'iconwenben',
        data: {
          text: '文本',
          rect: {
            width: 160,
            height: 30,
          },
          name: 'text',
        },
      },
      {
        name: '时间',
        icon: 'iconshijian',
        data: {
          text: '1970-01-01 00:00:00',
          hideInput: true,
          rect: {
            width: 200,
            height: 45,
          },
          name: 'biciTimer',
          elementRendered: false,
          property: {
            date: {
              show: true,
              format: 'L',
            },
            time: {
              show: true,
              format: 'LTS',
            },
          },
          iconColor: '#ccc',
        },
      },
      {
        name: '变量值',
        icon: 'iconbianliangzhi',
        data: {
          text: '00:00:00',
          rect: {
            width: 100,
            height: 45,
          },
          name: 'biciVarer',
          elementRendered: false,
          iconColor: '#ccc',
          property: {
            dataMethod: 'point',
            dataDot: 2,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
          },
        },
      },
      {
        name: '数据卡片',
        icon: 'iconshujukapian',
        data: {
          text: '数据卡片',
          hideInput: true,
          rect: {
            width: 278,
            height: 128,
          },
          paddingTop: 30,
          font: {
            fontFamily: 'Arial',
            color: '#fff',
            fontSize: 14,
            fontWeight: 400,
          },
          fillStyle: '#6236FF',
          strokeStyle: '#222',
          name: 'biciCard',
          children: [
            {
              text: '0.00',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: '50%',
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '50%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#fff',
                textAlign: 'center',
                fontSize: 42,
                textBaseline: 'middle',
                fontWight: 400,
              },
            },
            {
              text: '',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: '50%',
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: '50%',
                width: '100%',
                height: '50%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#fff',
                fontSize: 14,
                fontWight: 400,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            },
          ],
          property: {
            title: '数据卡片',
            showTitle: true,
            limitType: 'custom', // 数据类型：dataPoint 数据点  custom 自定义
            showLimit: false, // 展示上下限
            limit: {
              bottom: 0, // 下限
              top: 0, // 上限
            },
            normal: {
              fontFamily: 'Arial',
              fontSize: 42,
              color: '#fff',
              showBkColor: true,
              bkColor: '#6236FF',
            },
            topLimit: {
              fontFamily: 'Arial',
              fontSize: 42,
              color: '#fff',
              showBkColor: true,
              bkColor: '#FF0000',
            },
            bottomLimit: {
              fontFamily: 'Arial',
              fontSize: 42,
              color: '#fff',
              showBkColor: true,
              bkColor: '#FFFF00',
            },
            dataMethod: 'point',
            dataDot: 2,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
          },
        },
      },
      {
        name: '指示灯',
        icon: 'iconzhishideng',
        data: {
          text: '指示灯',
          hideInput: true,
          rect: {
            width: 30,
            height: 30,
          },
          font: {
            textAlign: 'left',
          },
          hideAnchor: true,
          name: 'biciPilot',
          property: {
            color: '#222',
            size: 15,
            text: '指示灯',
            showText: true,
            stateType: 'single', // 状态定义: single 单点值,  range 范围值
            lightRange: [], // 指示灯 状态定义 列表
            rangeIsOk: true,
            dataMethod: 'point',
            dataDot: 2,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
          },
        },
      },
    ],
  },
  // {
  //   group: '自定义图片',
  //   children: [
  //     {
  //       name: 'image',
  //       icon: 'icon-image',
  //       data: {
  //         text: '',
  //         rect: {
  //           width: 100,
  //           height: 100,
  //         },
  //         name: 'image',
  //         image:
  //           'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  //       },
  //     },
  //     {
  //       name: 'image',
  //       icon: 'icon-image',
  //       data: {
  //         text: '',
  //         rect: {
  //           width: 100,
  //           height: 100,
  //         },
  //         name: 'image',
  //         image: require('./machine.jpg'),
  //       },
  //     },
  //   ],
  // },
  // {
  //   group: '基本形状',
  //   children: [
  // {
  //   name: 'triangle',
  //   icon: 'icon-triangle',
  //   data: {
  //     text: '三角形',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'triangle',
  //   },
  // },
  // {
  //   name: 'diamond',
  //   icon: 'icon-diamond',
  //   data: {
  //     text: '菱形',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'diamond',
  //   },
  // },
  // {
  //   name: 'pentagon',
  //   icon: 'icon-pentagon',
  //   data: {
  //     text: '五边形',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'pentagon',
  //   },
  // },
  // {
  //   name: 'hexagon',
  //   icon: 'icon-hexagon',
  //   data: {
  //     text: '六边形',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     paddingTop: 10,
  //     paddingBottom: 10,
  //     name: 'hexagon',
  //   },
  // },
  // {
  //   name: 'pentagram',
  //   icon: 'icon-pentagram',
  //   data: {
  //     text: '五角星',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'pentagram',
  //   },
  // },
  // {
  //   name: 'leftArrow',
  //   icon: 'icon-arrow-left',
  //   data: {
  //     text: '左箭头',
  //     rect: {
  //       width: 200,
  //       height: 100,
  //     },
  //     name: 'leftArrow',
  //   },
  // },
  // {
  //   name: 'rightArrow',
  //   icon: 'icon-arrow-right',
  //   data: {
  //     text: '右箭头',
  //     rect: {
  //       width: 200,
  //       height: 100,
  //     },
  //     name: 'rightArrow',
  //   },
  // },
  // {
  //   name: 'twowayArrow',
  //   icon: 'icon-twoway-arrow',
  //   data: {
  //     text: '双向箭头',
  //     rect: {
  //       width: 200,
  //       height: 100,
  //     },
  //     name: 'twowayArrow',
  //   },
  // },
  // {
  //   name: 'line',
  //   icon: 'icon-line',
  //   data: {
  //     text: '直线',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'line',
  //   },
  // },
  // {
  //   name: 'cloud',
  //   icon: 'icon-cloud',
  //   data: {
  //     text: '云',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     name: 'cloud',
  //   },
  // },
  // {
  //   name: 'message',
  //   icon: 'icon-msg',
  //   data: {
  //     text: '消息框',
  //     rect: {
  //       width: 100,
  //       height: 100,
  //     },
  //     paddingLeft: 10,
  //     paddingRight: 10,
  //     paddingTop: 10,
  //     paddingBottom: 10,
  //     name: 'message',
  //   },
  // },
  // {
  //   name: 'file',
  //   icon: 'icon-file',
  //   data: {
  //     text: '文档',
  //     rect: {
  //       width: 80,
  //       height: 100,
  //     },
  //     paddingLeft: 10,
  //     paddingRight: 10,
  //     paddingTop: 10,
  //     paddingBottom: 10,
  //     name: 'file',
  //   },
  // },
  // {
  //   name: 'people',
  //   icon: 'icon-people',
  //   data: {
  //     rect: {
  //       width: 70,
  //       height: 100,
  //     },
  //     name: 'people',
  //   },
  // },
  // {
  //   name: '视频/网页',
  //   icon: 'icon-pc',
  //   data: {
  //     text: '视频/网页',
  //     rect: {
  //       width: 200,
  //       height: 200,
  //     },
  //     paddingLeft: 10,
  //     paddingRight: 10,
  //     paddingTop: 10,
  //     paddingBottom: 10,
  //     strokeStyle: 'transparent',
  //     name: 'div',
  //   },
  // },
  //   ],
  // },
  {
    group: '图表控件',
    children: [
      // {
      //   elementRendered: false,
      //   name: '折线图', // 用name来区分不同的组件
      //   icon: 'icon-line-chart',
      //   data: {
      //     text: '',
      //     rect: {
      //       width: 300,
      //       height: 200,
      //     },
      //     name: 'echarts',
      //     data: {
      //       echarts: {
      //         option: {
      //           title: {
      //             text: '曲线图',
      //           },
      //           legend: {},
      //           tooltip: {},
      //           dataset: {
      //             // 用 dimensions 指定了维度的顺序。直角坐标系中，
      //             // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
      //             // 如果不指定 dimensions，也可以通过指定 series.encode
      //             // 完成映射，参见后文。
      //             dimensions: ['product', '2015', '2016', '2017'],
      //             source: [
      //               {
      //                 product: 'Matcha Latte',
      //                 '2015': 43.3,
      //                 '2016': 85.8,
      //                 '2017': 93.7,
      //               },
      //               {
      //                 product: 'Milk Tea',
      //                 '2015': 83.1,
      //                 '2016': 73.4,
      //                 '2017': 55.1,
      //               },
      //               {
      //                 product: 'Cheese Cocoa',
      //                 '2015': 86.4,
      //                 '2016': 65.2,
      //                 '2017': 82.5,
      //               },
      //               {
      //                 product: 'Walnut Brownie',
      //                 '2015': 72.4,
      //                 '2016': 53.9,
      //                 '2017': 39.1,
      //               },
      //             ],
      //           },
      //           xAxis: { type: 'category' },
      //           yAxis: {},
      //           series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }],
      //         },
      //       },
      //       property: {
      //         echartsType: 'line',
      //         dataMethod: 'aa',
      //         dataDot: 1,
      //         dataPointParam: {
      //           qtDataList: [
      //             {
      //               id: '14040d68efd3401c9fd977c8e7f9bce8', // id 为数据点id
      //               type: 1,
      //             },
      //           ],
      //           subscribe: true,
      //         },
      //       },
      //     },
      //   },
      // },
      {
        elementRendered: false,
        name: '实时曲线图', // 用name来区分不同的组件
        icon: 'iconquxiantu',
        data: {
          text: '',
          hideInput: true,
          rect: {
            width: 300,
            height: 200,
          },
          name: 'echarts',
          strokeStyle:"rgba(0,0,0,0)",
          data: {
            echarts: {
              option: {
                animation: false,
                title: {
                  text: '总流量（kbps）' /*,
        left:"110px"*/,
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'cross' },
                },
                grid: {
                  left: 50 /*"50px"*/,
                  right: 15 /*"15px"*/,
                },
                legend: {
                  data: ['当前流量'],
                },
                xAxis: {
                  boundaryGap: false,
                  data: [],
                },
                yAxis: { boundaryGap: false },
                series: [],
              },
            },
            // property: {
            //   echartsType: 'timeLine',
            //   dataMethod: 'point',
            //   dataDot: 1,
            //   dataPointParam: {
            //     qtDataList: [
            //       {
            //         id: '14040d68efd3401c9fd977c8e7f9bce8', // id 为数据点id
            //         type: 1,
            //       },
            //     ],
            //     subscribe: true,
            //   },
            // },
          },
          property: {
            echartsType: 'timeLine',
            dataMethod: 'point',
            dataDot: 1,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
          },
        },
      },
      // {
      //   name: '柱状图',
      //   icon: 'icon-bar-chart',
      //   data: {
      //     text: '柱状图',
      //     rect: {
      //       width: 300,
      //       height: 200,
      //     },
      //     name: 'echarts',
      //     data: {
      //       echarts: {
      //         option: {
      //           legend: {},
      //           tooltip: {},
      //           dataset: {
      //             dimensions: ['product', '2015', '2016', '2017'],
      //             source: [
      //               {
      //                 product: 'Matcha Latte',
      //                 '2015': 43.3,
      //                 '2016': 85.8,
      //                 '2017': 93.7,
      //               },
      //               {
      //                 product: 'Milk Tea',
      //                 '2015': 83.1,
      //                 '2016': 73.4,
      //                 '2017': 55.1,
      //               },
      //               {
      //                 product: 'Cheese Cocoa',
      //                 '2015': 86.4,
      //                 '2016': 65.2,
      //                 '2017': 82.5,
      //               },
      //               {
      //                 product: 'Walnut Brownie',
      //                 '2015': 72.4,
      //                 '2016': 53.9,
      //                 '2017': 39.1,
      //               },
      //             ],
      //           },
      //           xAxis: { type: 'category' },
      //           yAxis: {},
      //           series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
      //         }, // end echarts option
      //       },
      //       property: {
      //         echartsType: 'bar',
      //         dataMethod: 'aa',
      //         dataDot: 1,
      //         dataPointParam: {
      //           qtDataList: [
      //             {
      //               id: '14040d68efd3401c9fd977c8e7f9bce8', // id 为数据点id
      //               type: 1,
      //             },
      //           ],
      //           subscribe: true,
      //         },
      //       },
      //     },
      //   },
      // },
      // {
      //   name: '饼图',
      //   icon: 'icon-pie-chart',
      //   data: {
      //     text: '饼图',
      //     rect: {
      //       width: 200,
      //       height: 200,
      //     },
      //     name: 'echarts',
      //     data: {
      //       echarts: {
      //         option: {
      //           tooltip: {
      //             trigger: 'item',
      //             formatter: '{a} <br/>{b}: {c} ({d}%)',
      //           },
      //           legend: {
      //             orient: 'vertical',
      //             x: 'left',
      //             data: [
      //               '直接访问',
      //               '邮件营销',
      //               '联盟广告',
      //               '视频广告',
      //               '搜索引擎',
      //             ],
      //           },
      //           series: [
      //             {
      //               name: '访问来源',
      //               type: 'pie',
      //               radius: ['50%', '70%'],
      //               avoidLabelOverlap: false,
      //               label: {
      //                 normal: {
      //                   show: false,
      //                   position: 'center',
      //                 },
      //                 emphasis: {
      //                   show: true,
      //                   textStyle: {
      //                     fontSize: '30',
      //                     fontWeight: 'bold',
      //                   },
      //                 },
      //               },
      //               labelLine: {
      //                 normal: {
      //                   show: false,
      //                 },
      //               },
      //               data: [
      //                 { value: 335, name: '直接访问' },
      //                 { value: 310, name: '邮件营销' },
      //                 { value: 234, name: '联盟广告' },
      //                 { value: 135, name: '视频广告' },
      //                 { value: 1548, name: '搜索引擎' },
      //               ],
      //             },
      //           ],
      //         },
      //       },
      //       property: {
      //         echartsType: 'pie',
      //         dataMethod: 'aa',
      //         dataDot: 1,
      //         dataPointParam: {
      //           qtDataList: [
      //             {
      //               id: '14040d68efd3401c9fd977c8e7f9bce8', // id 为数据点id
      //               type: 1,
      //             },
      //           ],
      //           subscribe: true,
      //         },
      //       },
      //     },
      //   },
      // },
      {
        name: '仪表盘',
        icon: 'iconyibiaopan',
        data: {
          text: '',
          hideInput: true,
          rect: {
            width: 300,
            height: 300,
          },
          strokeStyle:"rgba(0,0,0,0)",
          lineWidth:0,
          name: 'echarts',
          paddingTopNum: 0,
          paddingRightNum: 0,
          paddingBottomNum: 0,
          paddingLeftNum: 0,
          data: {
            echarts: {
              option: getGaugeOption(),
            },
          },
          property: {
            echartsType: 'gauge',
            dataMethod: 'point',
            dataDot: 1,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
            dataColors: [
              {
                checked: false,
                color: '#ccc',
                top: 100,
                bottom: -10,
              },
              {
                checked: false,
                color: '#ccc',
                top: 100,
                bottom: -10,
              },
              {
                checked: false,
                color: '#02df35',
                top: 100,
                bottom: -10,
              },
              {
                checked: true,
                color: '#02df23',
                top: 100,
                bottom: -10,
              },
              {
                checked: false,
                color: '#02df31',
                top: 100,
                bottom: -10,
              },
            ],
            dataMax: 100,
            dataMin: 0,
          },
        },
      },
      {
        elementRendered: false,
        name: '计量器',
        icon: 'iconjiliangqi',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 250,
          },
          name: 'echarts',
          strokeStyle:"rgba(0,0,0,0)",
          elementRendered: false,
          hideInput: true,
          data: {
            echarts: {
              option: getMeasureOption2(),
            },
          },
          property: {
            echartsType: 'chartMeasure',
            dataMethod: 'point',
            dataPointSelectedRows: [],
            dataDot: 1,
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
            dataColors: [
              {
                checked: false,
                color: '#ccc',
                top: 100,
                bottom: -10,
              },
            ],
            dataMax: 100,
            dataMin: 0,
          },
        },
      },
    ],
  },
];
