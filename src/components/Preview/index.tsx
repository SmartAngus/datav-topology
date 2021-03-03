import React, {useEffect, useState} from 'react';
import { ConfigProvider } from 'antd';
import { Node, Topology } from '../../topology/core';
import { roundFun } from '../utils/cacl';
import { formatTimer, getNodeType } from '../utils/Property2NodeProps';
import echarts from 'echarts/lib/echarts';
import * as _ from 'lodash';


import {
  echartsObjs,
  register as registerChart,
} from '../../topology/chart-diagram';
import { replacer, reviver } from '../utils/serializing';
import { register as registerBiciComp } from '../../topology/bici-diagram';
import moment from "moment";
import 'antd/dist/antd.less';
import styles from './index.module.scss'
import {getTimeLineOption} from "../config/charts/timeline";
import {defaultTimelineShowData} from "../data/defines";
import {clientParam, handleRequestError, loginSZGC, maxContentLength, timeout, withCredentials} from "../data/api";
import axios from "axios";
import {getBarOption} from "../config/charts/bar";
import {getGroupBarOption} from "../config/charts/groupbar";
import {getStackBarOption} from "../config/charts/stackbar";
import {getHorizontalBarOption} from "../config/charts/horizontalbar";
import {getPieOptionByChangeProp} from "../config/charts/pie";
let canvas;
let x, y;
export class PreviewProps {
  history?: any;
  key?: number;
  ref?: any;
  // 画布数据 json对象
  data?: any;
  websocketConf?: {
    url: string;
  };
}

// echartsObjs[node.id].chart
const Preview = ({ data, websocketConf }: PreviewProps) => {
  let websocketData=null;
  let websocket_data_list=[]
  let userInterval=[];
  let interfaceToken='';

  useEffect(() => {
    const canvasOptions = {
      rotateCursor: '/rotate.cur',
      locked: 1,
      disableTranslate:true
    };
    canvasRegister();
    canvas = new Topology('topology-canvas-preview', canvasOptions);

    // 渲染页面数据
    if (data != undefined && typeof data == 'object') {
      data.locked = 1;
      canvas.open(data);
    }
    initWebsocketData();
    initRestfullData();
    return () => {
      canvas.closeSocket();
      canvas.destroy();
      userInterval.forEach(item=>{
        clearInterval(item)
      })
    };
  }, [data]);


  /**
   * 注册图形库
   */
  const canvasRegister = () => {
    registerChart();
    registerBiciComp();
  };

  // 数据卡片颜色根据数据变化
  const setCardStyle = (
    node: Node,
    fontFamily: string,
    color: string,
    size: number,
    bkColor: string
  ) => {
    if (fontFamily) {
      node.font.fontFamily = fontFamily;
      node.children[0].font.fontFamily = fontFamily;
    }
    if (color) {
      node.font.color = color;
      node.children[0].font.color = color;
    }
    if (size) {
      node.children[0].font.fontSize = size;
    }
    if (bkColor) {
      node.fillStyle = bkColor;
    }
  };

  // 停止数据推送时更新图表
  const stopCompData=(pens,intval)=>{
    (pens || []).map((node) => {
      // 循环遍历
      if(node.name=="combine"){
        stopCompData(node.children,intval);
      }else if (node.property?.dataPointParam?.qtDataList?.length > 0) {
        if (node.name == 'echarts'){// echart图表组件
          if(websocketData&&intval%2==0){

            const theChart = node.property.echartsType;
            switch (theChart){
              case "timeLine":
                const dataRows = node.property.dataPointSelectedRows;

                break
              case 'gauge':

                break;
              default:
                break
            }
          }
        }else {
          const dataRow = node.property.dataPointSelectedRows[0];
          if(dataRow&&intval%2==0){// 每2秒检测一次
            const nodeType=node.name;
            const hasData=_.findIndex(websocket_data_list,item=>{
              if(item){
                return item.id==dataRow.id;
              }else{
                return false;
              }
            });
            switch (nodeType){
              case "biciVarer":
                  if(hasData<0){ // 没有数据
                    node.text="00:00:00"
                    canvas.updateProps(false,[node])
                  }
                break;
              case "biciMeasure":
                if(hasData<0){
                  node.property.value = node.property.dataMin;
                  canvas.updateProps(false,[node]);
                }
                break;
              case "biciCard":
                if(hasData<0) {
                  node.children[0].text = '0.00';
                  canvas.updateProps(false, [node]);
                }
                break;
              case "biciPilot":
                if(hasData<0) {
                  node.strokeStyle = node.property.color;
                  if (node.property.showText) {
                    node.text = node.property.text;
                  }
                }
                break;
              default:
                break;
            }
          }
        }
      }
    });
  }
  /**
   * 初始话数据接口更新数据
   */
  const initRestfullData =  ()=>{
    if (canvas.data && canvas.data.pens.length > 0) {
      // 有数据，去遍历有websocket的组件，并订阅
      canvas.data.pens.forEach(async node=>{
        // 如果是图表组件，下面就需要判断具体的是那种图表组件
        if(node.property){
          if(node.property.dataMethod=="restful"){
            // 第一次请求数据
            loginAndFetchData(node)
            // 对于有轮训需求的数据设置轮训
            if(node.property.pullRate){
              const interval = setInterval(async ()=>{
                // const res = await requestData(node);

                // Promise.all([loginSZGC(),requestData(node)]).then((res)=>{
                //   console.log("promiseall==",res)
                //   mapRestDataToChart(node,res[1])
                // })
                loginAndFetchData(node)
              },node.property.pullRate*1000)
              userInterval.push(interval);
            }
          }
        }
      })
    }
  }
  /**
   * 登陆并获取数据
   * @param node
   */
  const loginAndFetchData=(node)=>{
    if(!interfaceToken){
      loginSZGC().then((res:string)=>{
        interfaceToken=res;
        requestData(node).then(data=>{
          mapRestDataToChart(node,data)
        })
      })
    }else{
      requestData(node).then(data=>{
        mapRestDataToChart(node,data)
      })
    }
  }

  /**
   * rest请求的数据更新到图表上
   * @param node
   * @param res
   * 统计组件数据格式：
   * {
    "code": 1000,
    "msg": "success",
    "data": {
        text:"产量",
        value:"1024",
        unit:"t"
    }
}
图表数据格式：
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
   */
  const mapRestDataToChart=(node: any, res: any)=>{
    if(res.front_error){// 请求出错，不做处理
      return;
    }
    let resTmp=null;
    if(typeof res=='string'){// 如果请求结果是字符串，尝试解析成对象
      resTmp=JSON.parse(res)
    }else{
      resTmp=res;
    }
    if(resTmp){
      if(
          resTmp.hasOwnProperty("text") ||
          resTmp.hasOwnProperty("value")||
          resTmp.hasOwnProperty("unit"))
      {// 说明是统计组件的数据
        const nodeType = node.name;
        switch (nodeType) {
          case "biciText":
            node.children[0].text=resTmp["value"]+resTmp["unit"]
            node.children[1].text=resTmp["text"]
            canvas.updateProps(false,[node])
            break;
          case "biciCard2":
            node.children[0].text=resTmp["text"]
            node.children[1].text=resTmp["unit"]
            node.children[2].text=resTmp["value"]
            canvas.updateProps(false,[node])
            break;
        }
      }else if(resTmp.hasOwnProperty("dimensions")||
          resTmp.hasOwnProperty("source"))
      {// 是图表组件的数据
        const nodeType = node.property.echartsType
        switch (nodeType) {
          case 'groupBar':
            node.data.echarts.option=getGroupBarOption(node,res);
            break;
          case 'verticalBar':
            node.data.echarts.option=getBarOption(node,res)
            break;
          case 'stackBar':
            node.data.echarts.option=getStackBarOption(node,res);
            break;
          case 'horizontalBar':
            node.data.echarts.option=getHorizontalBarOption(node,res);
            break;
          case 'circleAndPie':
            node.data.echarts.option= getPieOptionByChangeProp(node,res)
            break;
          case 'timeLine':
            break;
        }
        updateChartNode(node)
      }
    }else{

    }
  }
  /**
   * 请求接口数据
   * @param node
   */
  const requestData=(node)=>{
    return new Promise((resolve,reject)=>{
      var myURL = new URL(node.property.dataUrl)
      const ajax = axios.create({baseURL: `${myURL.origin}/`, timeout, maxContentLength,withCredentials})
      // const ajax = axios.create({baseURL: `http://qt.test.bicisims.com`, timeout, maxContentLength,withCredentials})
      ajax.request({
        url:myURL.pathname,//myURL.pathname
        method:'get',
        headers: {
          token: interfaceToken,
          'Content-Type': 'application/json',
        },
        data: {
          firstName: 'Fred'
        },
      }).then(res=>{
        if(res&&res.data.code==1000){
          resolve(res.data.data)
        }else{
          resolve({front_error:2})
        }
      }).catch((error)=>{
        handleRequestError(error);
        resolve({front_error:1});
      });
    })
  }

  const initWebsocketData = () => {
    canvas.closeSocket();
    if (websocketConf !== undefined) {
      canvas.openSocket(`${websocketConf.url}`);
    }
    if (canvas != undefined && canvas.socket != undefined) {
      canvas.socket.socket.onopen = () => {
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if (canvas.socket != undefined) {
            sendMessage(canvas.data.pens)
          }
        }
      };
      canvas.socket.socket.onmessage = (data) => {
        websocketData=JSON.parse(data.data);
        websocket_data_list.push(websocketData);
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if (canvas.socket != undefined) {
            //
            updateComp(canvas.data.pens, data);
          }
        }
      };
      canvas.socket.socket.onclose=(e)=>{
      }
    }
    //canvas.data.pens
    updateTimerCom(canvas.data.pens);
  };
  const sendMessage=(pens)=>{
    (pens || []).map((node) => {
      // 循环遍历
      if(node.name=="combine"){
        sendMessage(node.children)
      }else if (node.property?.dataPointParam?.qtDataList?.length > 0) {
        canvas.socket.socket.send(
            JSON.stringify({
              ...node.property.dataPointParam,
              nodeTid: node.TID,
              nodeId: node.id,
            })
        );
      }
    });
  }
  const updateTimerCom = (pens: any) => {
    (pens || []).map((node) => {
      if (node.name == 'biciTimer') {
        setInterval(() => {
          formatTimer(node, canvas);
        }, 1000);
      } else if (node.name == 'combine') {
        updateTimerCom(node.children);
      }
    });
  };
  let timedata=[];
  for(let i=0;i<10;i++){
    timedata.push({
      name:moment().subtract(1, "seconds"),
      value:[moment().subtract(1, "seconds"),null]
    })
  }

  const updateComp = (pens: any, data: any) => {
    (pens || []).map((node: Node) => {
      if (node.name == 'combine') {
        updateComp(node.children, data);
      } else if (node.name == 'echarts') {
        // 如果是图表组件，下面就需要判断具体的是那种图表组件
        const theChart = node.property.echartsType;
        const r = JSON.parse(data.data);
        switch (theChart) {
          case 'gauge':
            if (node.property.dataPointSelectedRows[0]?.id == r.id) {
              const cd = {
                value: 0,
                name: node.property.chartTitle,
              };
              cd.value = roundFun(r.value, node.property.dataDot);
              if(r.value==undefined){
                cd.value=node.property.dataMin
              }
              node.data.echarts.option.series[0].data[0] = cd;
              updateChartNode(node);
            } else {
              // node.data.echarts.option.series[0].data.pop()
              // updateChartNode(node)
            }
            break;
          case 'timeLine':
            let selectedRows = node.property.dataPointSelectedRows;

            const timesxAix=node.data.echarts.option.dataset.source[0];
            (selectedRows || []).map((row,index) => {
              if (row.id == r.id) {
                if(index==0){
                  timesxAix.push(moment(parseInt(r.time/1000+"")*1000).format("LTS"))
                  if(timesxAix.length>defaultTimelineShowData){
                    timesxAix.splice(1,1)
                  }
                  node.data.echarts.option = getTimeLineOption(node, null, r, timesxAix,true);
                }else{
                  node.data.echarts.option = getTimeLineOption(node, null, r);
                }
              }
            });
            updateChartNode(node);
            break;
          case 'pie':

            break;
          case "circleAndPie":

            break;
          default:
        }
        //
      } else if (node.property?.dataPointParam?.qtDataList?.length > 0) {

        // 非图表组件
        const r = JSON.parse(data.data);
        const nodeType = getNodeType(node);
        if (node.name == 'biciVarer') {
          if (
            node.text != r.value &&
            node.property.dataPointParam.qtDataList[0].id == r.id
          ) {
            if(r.value==undefined){
              node.text="00:00:00"
              canvas.updateProps(false,[node])
              return;
            }
            if (!isNaN(Number(r.value))) {
              // 数值型
              const n = node.property.dataDot;
              node.text = roundFun(Number(r.value), n);
            } else {
              node.text = r.value;
            }
            if(r.value==true||r.value=='true'){
              node.text=node.property.dataPointSelectedRows[0].trueDisplay||r.value
            }
            if(r.value==false||r.value=='false'){
              node.text=node.property.dataPointSelectedRows[0].falseDisplay||r.value
            }
            canvas.updateProps(false);
          }
        }else if(node.name === 'biciMeasure'){
          if (node.property.dataPointSelectedRows[0]?.id == r.id) {
            node.property.value = r.value;
            if(r.value==undefined){
              node.property.value = node.property.dataMin;
            }
            canvas.updateProps(false);
          }
        } else if (node.name === 'biciCard') {
          if (node.property.dataPointParam.qtDataList[0].id == r.id) {
            const n = node.property.dataDot;
            let val = roundFun(parseFloat(r.value), n);
            if(r.value==undefined){
              val="0.00"
            }
            node.children[0].text = val;
            const bottom = node.property.limit.bottom;
            const top = node.property.limit.top;
            const tempVal = parseFloat(val);
            if (!isNaN(bottom)&&tempVal < bottom && node.property.showLimit) {
              const showColor = node.property.bottomLimit.showBkColor
                ? node.property.bottomLimit.bkColor
                : node.property.normal.bkColor;
              // 小于下限
              setCardStyle(
                node,
                node.property.bottomLimit.fontFamily,
                node.property.bottomLimit.color,
                parseInt(node.property.bottomLimit.fontSize),
                showColor
              );
            } else if (!isNaN(top)&&tempVal > top && node.property.showLimit) {
              const showColor = node.property.bottomLimit.showBkColor
                ? node.property.topLimit.bkColor
                : node.property.normal.bkColor;
              // 高于上限
              setCardStyle(
                node,
                node.property.topLimit.fontFamily,
                node.property.topLimit.color,
                parseInt(node.property.topLimit.fontSize),
                showColor
              );
            } else {
              setCardStyle(
                node,
                node.property.normal.fontFamily,
                node.property.normal.color,
                parseInt(node.property.normal.fontSize),
                node.property.normal.bkColor
              );
            }
            canvas.updateProps(false);
          }
        } else if (node.name === 'biciPilot') {
          if (
            node.property.val !== r.value &&
            node.property.dataPointParam.qtDataList[0].id == r.id
          ) {
            let flag = false;
            node.property.val = r.value;
            if(r.value==undefined){
              node.property.val=0;
            }
            if (node.property.lightRange) {
              for (const item of node.property.lightRange) {
                if (node.property.stateType === 'single') {
                  if (item.lightRangeVal == r.value) {
                    node.strokeStyle =
                      item?.lightRangeColor || node.strokeStyle;
                    if (node.property.showText) {
                      node.text = item?.lightRangeText || node.property.text;
                    }
                    flag = true;
                    break;
                  }
                } else {

                  if ((item.lightRangeBottom <= r.value && item.lightRangeTop > r.value)||
                      (!item.lightRangeBottom&&item.lightRangeTop > r.value)||
                      (!item.lightRangeTop&&item.lightRangeBottom <= r.value)
                  ) {
                    node.strokeStyle =
                      item?.lightRangeColor || node.strokeStyle;
                    if (node.property.showText) {
                      node.text = item?.lightRangeText || node.property.text;
                    }
                    flag = true;
                    break;
                  }
                }
              }
              if (!flag) {
                node.strokeStyle = node.property.color;
                if (node.property.showText) {
                  node.text = node.property.text;
                }
              }
            }
            canvas.updateProps(false);
          }
        }else if(node.name=='rectangle'){
          if(r.value){
            node.text=r.value+"℃"
          }else{
            node.text="暂无数据"
          }
          canvas.updateProps(false);
        }
      }
    });
  };

  const updateChartNode = (node) => {
    // 更新图表数据
    node.elementRendered = false;
    echartsObjs[node.id].chart.setOption(
      JSON.parse(JSON.stringify(node.data.echarts.option, replacer), reviver),
        true
    );
    echartsObjs[node.id].chart.resize();
    node.elementRendered = true;
  };
  /**
   * 自动适应窗口大小
   */

  const onHandleFit = () => {
    const rect = canvas.getRect();
    rect.calcCenter();
    x = document.body.clientWidth / 2 - rect.center.x;
    y = (document.body.clientHeight - 66) / 2 - rect.center.y;
    canvas.translate(x, y);
    initWebsocketData();
  };

  /**
   * 实际大小
   */

  const onHandlePre = () => {
    canvas.translate(-x, -y);
    x = 0;
    y = 0;
    initWebsocketData();
  };

  return (
    <ConfigProvider prefixCls="antdv4">
      {/*<PageHeader*/}
      {/*  style={{*/}
      {/*    border: '1px solid rgb(235, 237, 240)'*/}
      {/*  }}*/}
      {/*  extra={[*/}
      {/*    <Button type="primary" key="2" onClick={() => onHandleFit()}>*/}
      {/*      自动适应窗口大小*/}
      {/*    </Button>,*/}
      {/*    <Button key="1" onClick={() => onHandlePre()}>*/}
      {/*      实际大小*/}
      {/*    </Button>*/}
      {/*  ]}*/}
      {/*  onBack={() =>*/}
      {/*    history.push({*/}
      {/*      pathname: '/',*/}
      {/*      state: { data: history.location.state.data, from: '/preview' }*/}
      {/*    })*/}
      {/*  }*/}
      {/*  title="返回画板"*/}
      {/*  subTitle="预览"*/}
      {/*/>*/}
      <div
        id="topology-canvas-preview"
        className={styles.topology_canvas_preview}
        style={{
          margin:"auto auto",
          height: data?.height,
          width: data?.width,
          overflow: "hidden!important",
          backgroundColor:data?.bkColor,
          backgroundImage: `url(${data?.bkImage})`,
        }}
      />
    </ConfigProvider>
  );
};




// @ts-ignore
export default Preview;
