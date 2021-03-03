import {getTimeLineOption} from "./charts/timeline";
import {getGaugeOption} from "./charts/gauge"
import {defaultLineColors} from "../data/defines";
import {getGroupBarOption} from "./charts/groupbar";
import {getHorizontalBarOption} from "./charts/horizontalbar";
import {getBarOption} from "./charts/bar";
import {getPieOption} from "./charts/pie";
import {getStackBarOption} from "./charts/stackbar";
import {getLiquidFillOption} from "./charts/liquidFill";

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
const PEIDING_DATA=`
{"code":1000,"msg":"success","data":[{"text":"上月结存","value":4308.501,"unit":"t"},{"text":"其他收入","value":248.783,"unit":"t"},{"text":"本月收入","value":1051.36,"unit":"t"},{"text":"月末结存","value":4295.129,"unit":"t"},{"text":"其他支出","value":0,"unit":"t"},{"text":"销售","value":0,"unit":"t"},{"text":"转生产","value":869.403,"unit":"t"}]}
`;
const TICKET_LIST_DATA=`
{"code":1000,"msg":"success","data":[{"id":"747c93a6f8ce27dd7ac69e728dbcdb62","dataStatus":null,"createTime":"2021-02-26T02:42:51.000+0000","createUserId":"b6a1a336144546f3aa9f185601eba29f","createUsername":"admin","updateTime":null,"updateUserId":null,"updateUsername":null,"productionPlanId":"f9480667eb1aff59d30227834a9e0e92","ticketNo":"210144","productionBatchNo":"00052","materialFurnaceNo":"ololol,olpolpol","status":2,"startTime":"2021-02-26T02:42:53.000+0000","enterFurnaceNo":null,"enterSteelType":1,"enterSteelStartTime":null,"enterSteelEndTime":null,"outSteelType":1,"outSteelStartTime":null,"outSteelEndTime":null,"orderNum":9999,"remark":"1","color":"85,82,160","taskTime":null,"qtTaskId":null,"planNo":"P210207","workshopId":"ca2f3bdb-7257-11ea-8c8f-7cd48lop","workshopCode":"SCCJ_01","workshopName":"500车间","productId":"03d5e942986d44a4a48422d43cca7c33","productName":"数字钢厂产品名称","standardId":"66589695ef8b49f5baf42eeff8320396","standardName":"数字钢厂产品规格","steelId":"40df825fe390e6cc25689e6a1509f3b1","steelName":"数字钢厂钢号","countTotal":null,"weightTotal":null,"planStatus":2,"materialDetailDtoList":null,"addMaterialDetailDtoMap":null,"rollingCountTotal":null,"rollingCountEnterTotal":null,"stoveBackDtoList":null,"rollBackDtoList":null,"notRollingGoodsNum":null,"innerStoveCount":null,"outSteelCount":null,"enterProcessDetailAndGoodsInfoList":null,"enterType":null,"planTime":"2021-02-18T16:00:00.000+0000","productionPlan":null,"productWeight":null,"productCount":null,"rollWasteCount":null,"rollWasteWeight":null},{"id":"bf3216dcd32184d587bc0fc79bfd3992","dataStatus":null,"createTime":"2021-02-25T08:28:47.000+0000","createUserId":"b6a1a336144546f3aa9f185601eba29f","createUsername":"admin","updateTime":null,"updateUserId":null,"updateUsername":null,"productionPlanId":"f9480667eb1aff59d30227834a9e0e92","ticketNo":"210132-1","productionBatchNo":"00040-1","materialFurnaceNo":"915915,225225","status":2,"startTime":"2021-02-25T01:16:05.000+0000","enterFurnaceNo":"T000463","enterSteelType":3,"enterSteelStartTime":"2021-02-25T08:18:44.000+0000","enterSteelEndTime":"2021-02-25T08:21:14.000+0000","outSteelType":1,"outSteelStartTime":null,"outSteelEndTime":null,"orderNum":9999,"remark":"","color":"77,97,142","taskTime":null,"qtTaskId":null,"planNo":"P210207","workshopId":"ca2f3bdb-7257-11ea-8c8f-7cd48lop","workshopCode":"SCCJ_01","workshopName":"500车间","productId":"03d5e942986d44a4a48422d43cca7c33","productName":"数字钢厂产品名称","standardId":"66589695ef8b49f5baf42eeff8320396","standardName":"数字钢厂产品规格","steelId":"40df825fe390e6cc25689e6a1509f3b1","steelName":"数字钢厂钢号","countTotal":null,"weightTotal":null,"planStatus":2,"materialDetailDtoList":null,"addMaterialDetailDtoMap":null,"rollingCountTotal":null,"rollingCountEnterTotal":null,"stoveBackDtoList":null,"rollBackDtoList":null,"notRollingGoodsNum":null,"innerStoveCount":null,"outSteelCount":null,"enterProcessDetailAndGoodsInfoList":null,"enterType":null,"planTime":"2021-02-18T16:00:00.000+0000","productionPlan":null,"productWeight":null,"productCount":null,"rollWasteCount":null,"rollWasteWeight":null},{"id":"927df1710467a0b396f018fa9cec6e80","dataStatus":null,"createTime":"2021-02-25T02:32:40.000+0000","createUserId":"b6a1a336144546f3aa9f185601eba29f","createUsername":"admin","updateTime":null,"updateUserId":null,"updateUsername":null,"productionPlanId":"90e3cb9e5da6b9e7392c609da54b94b4","ticketNo":"210133","productionBatchNo":"00041","materialFurnaceNo":"915915,225225","status":1,"startTime":null,"enterFurnaceNo":null,"enterSteelType":1,"enterSteelStartTime":null,"enterSteelEndTime":null,"outSteelType":1,"outSteelStartTime":null,"outSteelEndTime":null,"orderNum":9999,"remark":"","color":"132,235,141","taskTime":null,"qtTaskId":null,"planNo":"P210214","workshopId":"ca2f3bdb-7257-11ea-8c8f-7cd48lop","workshopCode":"SCCJ_01","workshopName":"500车间","productId":"5f2a9ba8e83e429d8a7d5d124ff7c5b4","productName":"轮辋钢","standardId":"39049db7230840ffbd8a805cd82837a9","standardName":"5.50F","steelId":"0c1199a32b6dae70ff4bc447a4bf3f81","steelName":"42CrMo","countTotal":null,"weightTotal":null,"planStatus":2,"materialDetailDtoList":null,"addMaterialDetailDtoMap":null,"rollingCountTotal":null,"rollingCountEnterTotal":null,"stoveBackDtoList":null,"rollBackDtoList":null,"notRollingGoodsNum":null,"innerStoveCount":null,"outSteelCount":null,"enterProcessDetailAndGoodsInfoList":null,"enterType":null,"planTime":"2021-02-23T16:00:00.000+0000","productionPlan":null,"productWeight":null,"productCount":null,"rollWasteCount":null,"rollWasteWeight":null}]}
`;
const DATA_BASE_API="http://hxszgc.bicisims.com/api/statistic"


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
                fontWeight: 100,
                fontStyle:'italic'
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
                fontWeight: 800,
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
                fontWeight: 400,
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
                fontWeight: 400,
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
        name: '数据卡片2',
        icon: 'iconshujukapian',
        data: {
          text: '',
          hideInput: true,
          hideRotateCP: true,
          rect: {
            width: 200,
            height: 40,
          },
          paddingTop: 10,
          paddingBottom: 10,
          font: {
            fontFamily: '"Microsoft YaHei"',
            color: '#fff',
            fontSize: 14,
            fontWeight: 400,
          },
          fillStyle: '',
          strokeStyle: '#222',
          lineWidth: 0,
          name: 'biciCard2',
          children: [
            {
              text: '正在生产',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '35%',
                height: '100%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#fff',
                textAlign: 'center',
                fontSize: 14,
                textBaseline: 'middle',
                fontWeight: 400,
              },
            },
            {
              text: '数字钢厂产品名称',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: '35%',
                y: 0,
                width: '35%',
                height: '100%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#fff',
                fontSize: 14,
                fontWeight: 400,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            },
            {
              text: '1234567',
              name: 'text',
              hideInput: true,
              hideAnchor: true,
              hideRotateCP: true,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: '70%',
                y: 0,
                width: '30%',
                height: '100%',
              },
              font: {
                fontFamily: 'Arial',
                color: '#fff',
                fontSize: 14,
                fontWeight: 400,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            }
          ],
          property: {
            dataMethod: 'restful',
            dataDot: 2,
            dataFormat:TONGJI_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/currentProduceTicket',
            pullRate: 10,
            props: {
              iframe:"abcd"
            },
          }
        },
      },
      {
        name: '图标文本',
        icon: 'iconjuxing',
        data: {
          text: '暂无数据',
          rect: {
            width: 112,
            height: 40,
          },
          font: {
            fontSize: 14,
            fontFamily: '"Microsoft YaHei"',
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 4,
          fillStyle: '#F0F0F0',
          name: 'rectangle',
          // image:'https://bici-qt.oss-cn-hangzhou.aliyuncs.com/industry/化工/2021/01/2ffed161677c449bb882cdba47c55f67诱导循环结晶器.png',
          imageWidth:20,
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
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data: {
            echarts: {
              option: getGroupBarOption()
            },
          },
          property: {
            echartsType: 'groupBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/storageGoodsReportQtMonth',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: '分组柱状图' },
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
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
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
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data: {
            echarts: {
              option: getStackBarOption()
            },
          },
          property: {
            echartsType: 'stackBar',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/storageGoodsReportQtMonth',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: '堆叠柱状图' },
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
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
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
                  { name: ['title'], value: '条形图' },
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
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data: {
            echarts: {
              option: getPieOption()
            },
          },
          property: {
            echartsType: 'circleAndPie',
            dataMethod:'restful',
            dataFormat:CHART_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/productReceiveMonthQtChart',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd"
            },
            form:{
              style:[{
                group:'标题字符',
                formItems:[
                  { name: ['title'], value: '饼/环状图' },
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
      },
      {
        name: '水位图',
        icon: 'iconzhuzhuangtu1',
        data: {
          text: '',
          rect: {
            width: 50,
            height: 50,
          },
          name: 'echarts',
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data: {
            echarts: {
              option: getLiquidFillOption()
            },
          },
          property: {
            echartsType: 'liquidFill',
            dataMethod: 'point',
            dataDot: 1,
            dataPointSelectedRows: [],
            dataPointParam: {
              qtDataList: [],
              subscribe: true,
            },
          },
        },
      }
    ],
  },
  {
    group: 'react组件',
    children: [
      // {
      //   text: '按钮',
      //   icon: 'icon-rectangle',
      //   name: 'button',
      //   data: {
      //     autoRect: true,
      //     strokeStyle: '#fff',
      //     rect: {
      //       x: 100,
      //       y: 200,
      //       width: 100,
      //       height: 200
      //     },
      //     name: 'button',
      //     data: {
      //       props: {
      //         type: 'primary',
      //         children: '查询'
      //       }
      //     }
      //   }
      // },
      // {
      //   text: '日期组件',
      //   icon: 'icon-diamond',
      //   name: 'datePicker',
      //   data: {
      //     strokeStyle: '#fff',
      //     rect: {
      //       x: 100,
      //       y: 200,
      //       width: 300,
      //       height: 200
      //     },
      //     name: 'datePicker',
      //     data: {
      //       props: {}
      //     }
      //   }
      // },
      // {
      //   text: '结果页',
      //   icon: 'icon-pentagon',
      //   name: 'result',
      //   data: {
      //     strokeStyle: '#fff',
      //     rect: {
      //       x: 100,
      //       y: 200,
      //       width: 200,
      //       height: 200
      //     },
      //     name: 'result',
      //     data: {
      //       props: {
      //         status: '403',
      //         title: '403',
      //         subTitle: 'Sorry, you are not authorized to access this page.'
      //       }
      //     }
      //   }
      // },
      // {
      //   text: '表格',
      //   icon: 'icon-triangle',
      //   name: 'table',
      //   data: {
      //     strokeStyle: '#fff',
      //     rect: {
      //       x: 100,
      //       y: 200,
      //       width: 600,
      //       height: 400
      //     },
      //     name: 'table',
      //     data: {
      //       props: {
      //         columns: [],
      //         dataSource: []
      //       }
      //     }
      //   }
      // },
      // {
      //   text: '网页',
      //   icon: 'icon-triangle',
      //   name: 'webPage',
      //   data: {
      //     strokeStyle: '#fff',
      //     rect: {
      //       x: 100,
      //       y: 200,
      //       width: 350,
      //       height: 200
      //     },
      //     name: 'webPage',
      //     elementRendered:false,
      //     data:{},
      //     property: {
      //       props: {
      //         iframe:"abcd"
      //       },
      //       form:{
      //         style:[{
      //           group:'路径配置',
      //           formItems:[
      //             { name: ['username'], value: 'Ant Design' },
      //             { name: ['fontStyle'], value: '#ccc000' },
      //             { name: ['refreshRate'], value: 10 },
      //             { name: ['refreshRateCheck'], value: true },
      //             { name: ['iframe'], value: 'http://www.baidu.com' },
      //           ]
      //         },{
      //           group:'其他设置',
      //           formItems:[{ name: ['color'], value: '#ccc' }]
      //         }],
      //         data:[]
      //       }
      //     }
      //   }
      // },
      {
        text: '产品生产队列',
        icon: 'iconyibiaopan',
        name: '产品生产队列',
        data: {
          rect: {
            x: 100,
            y: 200,
            width: 600,
            height: 200
          },
          name: 'productQueue',
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data:{},
          property: {
            dataMethod:'restful',
            dataFormat:TICKET_LIST_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/produceTicketList',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd",
              dataUrl:DATA_BASE_API+'/creditBalance/produceTicketList',
              pullRate: 10,
            },
            form:{
              style:[{
                group:'路径配置',
                formItems:[
                  { name: ['username'], value: '产品生产队列' },
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
      },
      {
        text: '坯锭月报表',
        icon: 'iconyibiaopan',
        name: '坯锭月报表',
        data: {
          rect: {
            x: 100,
            y: 200,
            width: 400,
            height: 140
          },
          name: 'pdMonthReport',
          strokeStyle: 'rgba(0,0,0,0)',
          elementRendered: true,
          data:{},
          property: {
            dataMethod:'restful',
            dataFormat:PEIDING_DATA,
            dataUrl:DATA_BASE_API+'/creditBalance/goodsReceiveAll',
            pullRate: 10,
            dataDot:2,
            props: {
              iframe:"abcd",
              dataUrl:DATA_BASE_API+'/creditBalance/goodsReceiveAll',
              pullRate: 10,
            },
            form:{
              style:[{
                group:'路径配置',
                formItems:[
                  { name: ['username'], value: '坯锭月报表' },
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
