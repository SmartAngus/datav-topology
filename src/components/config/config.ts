import {getTimeLineOption} from "./charts/timeline";
import {getGaugeOption} from "./charts/gauge"
import {defaultLineColors} from "../data/defines";
import {getGroupBarOption} from "./charts/groupbar";
import {getHorizontalBarOption} from "./charts/horizontalbar";
import {getBarOption} from "./charts/bar";
import {getPieOption} from "./charts/pie";
import {getStackBarOption} from "./charts/stackbar";

const TONGJI_DATA=`
{
    "code": 1000,
    "msg": "success",
    "data": {
        text:"产量",
        value:"1024",
        unit:"t"
    }
}
`;
const CHART_DATA=`
{
    "code": 1000,
    "msg": "success",
    "data": {
        "dimensions": [
            "xdata",
            "2020-09"
        ],
        "source": [
            [
                "补强板",
                99.899
            ],
            [
                "电梯导轨",
                1457.332
            ],
            [
                "扁钢",
                1768.992
            ]
        ]
    }
}
`;


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
          font: {
            fontSize: 14,
            fontFamily: '"Microsoft YaHei"',
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0,
          fillStyle: '#F0F0F0',
          name: 'rectangle',
        },
      },
      {
        name: '视频',
        icon: 'iconjuxing',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200,
          },
          font: {
            fontSize: 14,
            fontFamily: '"Microsoft YaHei"',
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0,
          fillStyle: '#F0F0F0',
          name: 'rectangle',
          iframe:'http://localhost:5000/newCockpit/JTdCJTIyaXNTaGFyZSUyMiUzQWZhbHNlJTJDJTIyaWQlMjIlM0ElMjIxNTEyZjg3MGZjZjc0NjI0YTM2NDVlZGEwY2Q5MGZmMCUyMiU3RA=='
        },
      },
      {
        name: '圆',
        icon: 'iconyuanxing',
        data: {
          text: '',
          hideRotateCP: false,
          fillStyle: '#F0F0F0',
          rect: {
            width: 100,
            height: 100,
          },
          font: {
            fontSize: 14,
            fontFamily: '"Microsoft YaHei"',
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
          font: {
            fontSize: 14,
            fontFamily: '"Microsoft YaHei"',
          },
          name: 'text',
          hideInput:false
        },
      },
      {
        name: '时间',
        icon: 'iconshijian',
        data: {
          text: '2021-01-01 12:00:00',
          hideInput: true,
          rect: {
            width: 200,
            height: 45,
          },
          font: {
            fontSize: 14,
            fontFamily: 'Arial',
          },
          name: 'biciTimer',
          elementRendered: false,
          strokeStyle: 'rgba(0,0,0,0)',
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
          font: {
            fontSize: 14,
            fontFamily: 'Arial',
          },
          name: 'biciVarer',
          elementRendered: false,
          strokeStyle: 'rgba(0,0,0,0)',
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
        name: '数据统计',
        icon: 'iconshujukapian',
        data: {
          text: '',
          hideInput: true,
          hideRotateCP: true,
          rect: {
            width: 120,
            height: 70,
          },
          paddingTop: 0,
          font: {
            fontFamily: '"Microsoft YaHei"',
            color: '#fff',
            fontSize: 14,
            fontWeight: 400,
          },
          fillStyle: '#6236FF',
          strokeStyle: '#222',
          lineWidth: 0,
          name: 'biciText',
          children: [
            {
              text: '150T',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
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
                color: '#333333',
                textAlign: 'center',
                fontSize: 24,
                textBaseline: 'middle',
                fontWight: 400,
              },
            },
            {
              text: '产量',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
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
                color: '#333333',
                fontSize: 14,
                fontWight: 800,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            },
          ],
          property: {
            dataMethod:'restful',
            dataFormat:TONGJI_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['titleFontFamily'], value: 'Arial' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 24 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "center" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              },{
                group:'副标题',
                formItems:[
                  { name: ['titleFontFamily'], value: 'Arial' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "center" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              }],
              data:[{
                group:"绑定数据",
                forItems:[
                  { name:['dataMethod'],value:"restful" },
                ]
              }]
            }
          },
        },
      },
      {
        name: '数据卡片',
        icon: 'iconshujukapian',
        data: {
          text: '数据卡片',
          hideInput: true,
          hideRotateCP: true,
          rect: {
            width: 200,
            height: 100,
          },
          paddingTop: 30,
          font: {
            fontFamily: '"Microsoft YaHei"',
            color: '#fff',
            fontSize: 14,
            fontWeight: 400,
          },
          fillStyle: '#6236FF',
          strokeStyle: '#222',
          lineWidth: 0,
          name: 'biciCard',
          children: [
            {
              text: '0.00',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
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
              hideRotateCP: true,
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
            cardTitle: '数据卡片',
            showTitle: true,
            limitType: 'custom', // 数据类型：dataPoint 数据点  custom 自定义
            showLimit: false, // 展示上下限
            limit: {
              bottom: undefined, // 下限
              top: undefined, // 上限
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
              bkColor: '#766863',
            },
            bottomLimit: {
              fontFamily: 'Arial',
              fontSize: 42,
              color: '#fff',
              showBkColor: true,
              bkColor: '#FA6400',
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
            fontFamily: '"Microsoft YaHei"',
            textAlign: 'left',
            fontSize: 14,
          },
          // hideAnchor: true,
          hideRotateCP: true,
          name: 'biciPilot',
          property: {
            val: 0,
            color: '#222',
            size: 15,
            text: '指示灯',
            showText: true,
            stateType: 'single', // 状态定义: single 单点值,  range 范围值
            lightRange: [], // 指示灯 状态定义 列表
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
        name: '直线',
        icon: 'iconzhixian',
        data: {
          text: '',
          type: 1,
          data:{
            type:'myLine'
          },
          rect:{
            x:0,
            y:100,
            width:100,
            height:0,
          },
          controlPoints: [
            { x: 0, y: 0 },
            { x: 0, y: 100 },
          ],
          name: 'line',
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
      {
        name: '分组柱状图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 350,
            height: 200,
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getGroupBarOption()
            },
          },
          property: {
            echartsType: 'groupBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: 'Ant Design' },
                  { name: ['titleShow'], value: true },
                  { name: ['titleFontFamily'], value: '"Microsoft YaHei"' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "left" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              }],
              data:[]
            }
          },
        },
      },
      {
        name: '柱状图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 350,
            height: 200,
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getBarOption()
            },
          },
          property: {
            echartsType: 'verticalBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: 'Ant Design' },
                  { name: ['titleShow'], value: true },
                  { name: ['titleFontFamily'], value: '"Microsoft YaHei"' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "left" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              }],
              data:[]
            }
          },
        },
      },
      {
        name: '堆叠柱状图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 350,
            height: 200,
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getStackBarOption()
            },
          },
          property: {
            echartsType: 'stackBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: 'Ant Design' },
                  { name: ['titleShow'], value: true },
                  { name: ['titleFontFamily'], value: '"Microsoft YaHei"' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "left" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              }],
              data:[]
            }
          },
        },
      },
      {
        name: '条形图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 450,
            height: 250,
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getHorizontalBarOption()
            },
          },
          property: {
            echartsType: 'horizontalBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: 'Ant Design' },
                  { name: ['titleShow'], value: true },
                  { name: ['titleFontFamily'], value: '"Microsoft YaHei"' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "left" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              }],
              data:[]
            }
          },
        },
      },
      {
        name: '饼状图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 400,
            height: 300,
          },
          name: 'echarts',
          data: {
            echarts: {
              option: getPieOption()
            },
          },
          property: {
            echartsType: 'circleAndPie',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:'http://qt.test.bicisims.com/api/applications/customComponent/list',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: 'Ant Design' },
                  { name: ['titleShow'], value: true },
                  { name: ['titleFontFamily'], value: '"Microsoft YaHei"' },
                  { name: ['titleFontColor'], value: "#333333" },
                  { name: ['titleFontSize'], value: 14 },
                  { name: ['titleFontBold'], value: 800 },
                  { name: ['titleFontItalic'], value: "normal" },
                  { name: ['titleFontBaseline'], value: "underline" },
                  { name: ['titlePosition'], value: "left" },
                  { name: ['titleFontStyle'], value: [
                      {name:"bold",value: 800,checked:false,icon:'iconjiacu'},
                      {name:"italic",value:"italic",checked:false,icon:'iconzu'},
                      // {name:"baseline",value:"baseline",checked:false,icon:'iconjiacu'}
                    ]},
                ]
              },{
                group:'图表设置',
                formItems:[
                  { name: ['chartShape'], value: 'pie' },
                  { name: ['chartBkColor'], value: '#ccc' },
                  { name: ['chartBkColorChecked'], value: true },
                ]
              }],
              data:[{
                group:"绑定数据",
                forItems:[
                  { name:['dataMethod'],value:"restful" },
                ]
              }]
            }
          },
        },
      },
      {
        name: '仪表盘',
        icon: 'iconyibiaopan',
        data: {
          elementRendered: false,
          text: '',
          hideInput: true,
          rect: {
            width: 300,
            height: 300,
          },
          strokeStyle: 'rgba(0,0,0,0)',
          hideRotateCP: true,
          lineWidth: 0,
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
                color: defaultLineColors[0],
                top: 20,
                bottom: null,
              },
              {
                checked: false,
                color: defaultLineColors[1],
                top: 40,
                bottom: null,
              },
              {
                checked: false,
                color: defaultLineColors[2],
                top: 60,
                bottom: null,
              },
              {
                checked: false,
                color: defaultLineColors[3],
                top: 80,
                bottom: null,
              },
              {
                checked: false,
                color: defaultLineColors[4],
                top: 100,
                bottom: null,
              },
            ],
            dataMax: 100,
            dataMin: 0,
            chartTitle: '仪表盘',
            chartTitleChecked: false,
            chartUnitChecked: false,
            chartUnit: 'C',
            marks:10,// 刻度
            markChecked:true,
            chartTitleColor:"#222222",
            chartTitleColorChecked: false,

          },
        },
      },
      {
        name: '计量器',
        icon: 'iconjiliangqi',
        data: {
          text: '',
          rect: {
            width: 20,
            height: 150,
          },
          font: {
            fontSize: 12,
            fontFamily: '"Microsoft YaHei"',
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0,
          fillStyle: '#F0F0F0',
          name: 'biciMeasure',
          onlySizeX:true,
          property: {
            dataMethod: 'point',
            dataPointSelectedRows: [],
            dataDot: 1,
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
            dataColors: [
              {
                checked: true,
                color: defaultLineColors[0],
                top: 20,
                bottom: null,
              },
              {
                checked: true,
                color: defaultLineColors[1],
                top: 40,
                bottom: null,
              },
              {
                checked: true,
                color: defaultLineColors[2],
                top: 60,
                bottom: null,
              },
              {
                checked: true,
                color: defaultLineColors[3],
                top: 80,
                bottom: null,
              },
              {
                checked: true,
                color: defaultLineColors[4],
                top: 100,
                bottom: null,
              },
            ],
            dataMax: 100,
            dataMin: 0,
            marks:10,
            markChecked:true,
            value:0,
            chartUnitChecked:false,
            chartUnit:'T',
            chartTitleColor:"#222222",
            chartTitleColorChecked: false,
          },
        },
      },
      {
        elementRendered: false,
        name: '实时曲线',
        icon: 'iconquxiantu',
        data: {
          text: '',
          rect: {
            width: 500,
            height: 270,
          },
          name: 'echarts',
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: false,
          hideRotateCP: true,
          hideInput: true,
          data: {
            echarts: {
              option: getTimeLineOption(),
            },
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
            smooth: true,
            limitType: 'custom', // dataPoint数据点或者custom=自定义
            dataTopChecked: false,
            dataTop: 100,
            dataBottom: 0,
            chartTitleChecked: true,
            chartTitle: '实时曲线',
            chartTitleColor: '#c0c0c0',
            chartBackgroundColor: '#1b2735',
            chartBackgroundChecked:false,
            lineReferenceChecked: true, // splitLine
            lineReferenceColor: '#ccc',
            lineColors: [],
          }
        },
      }
    ],
  },
  {
    group: 'react组件',
    children: [
      {
        text: '按钮',
        icon: 'icon-rectangle',
        name: 'button',
        data: {
          autoRect: true,
          strokeStyle: '#fff',
          rect: {
            x: 100,
            y: 200,
            width: 100,
            height: 200
          },
          name: 'button',
          data: {
            props: {
              type: 'primary',
              children: '查询'
            }
          }
        }
      },
      {
        text: '日期组件',
        icon: 'icon-diamond',
        name: 'datePicker',
        data: {
          strokeStyle: '#fff',
          rect: {
            x: 100,
            y: 200,
            width: 300,
            height: 200
          },
          name: 'datePicker',
          data: {
            props: {}
          }
        }
      },
      {
        text: '结果页',
        icon: 'icon-pentagon',
        name: 'result',
        data: {
          strokeStyle: '#fff',
          rect: {
            x: 100,
            y: 200,
            width: 200,
            height: 200
          },
          name: 'result',
          data: {
            props: {
              status: '403',
              title: '403',
              subTitle: 'Sorry, you are not authorized to access this page.'
            }
          }
        }
      },
      {
        text: '表格',
        icon: 'icon-triangle',
        name: 'table',
        data: {
          strokeStyle: '#fff',
          rect: {
            x: 100,
            y: 200,
            width: 600,
            height: 400
          },
          name: 'table',
          data: {
            props: {
              columns: [],
              dataSource: []
            }
          }
        }
      },
      {
        text: '网页',
        icon: 'icon-triangle',
        name: 'webPage',
        data: {
          strokeStyle: '#fff',
          rect: {
            x: 100,
            y: 200,
            width: 350,
            height: 200
          },
          name: 'webPage',
          elementRendered:false,
          data:{},
          property: {
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'路径配置',
                formItems:[
                  { name: ['username'], value: 'Ant Design' },
                  { name: ['fontStyle'], value: '#ccc000' },
                  { name: ['refreshRate'], value: 10 },
                  { name: ['refreshRateCheck'], value: true },
                  { name: ['iframe'], value: 'http://www.baidu.com' },
                ]
              },{
                group:'其他设置',
                formItems:[{ name: ['color'], value: '#ccc' }]
              }],
              data:[]
            }
          }
        }
      }
    ]
  },
];
