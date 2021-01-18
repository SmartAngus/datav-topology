import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Node, Topology } from '../../topology/core';
import { roundFun } from '../utils/cacl';
import { formatTimer, getNodeType } from '../utils/Property2NodeProps';
import echarts from 'echarts/lib/echarts';

import {
  echartsObjs,
  register as registerChart,
} from '../../topology/chart-diagram';
import { replacer, reviver } from '../utils/serializing';
import { register as registerBiciComp } from '../../topology/bici-diagram';
import {pieOption} from "../config/charts/pie";
import moment from "moment";
import 'antd/dist/antd.less';
import styles from './index.module.scss'
import {getTimeLineOption} from "../config/charts/timeline";
import {defaultTimelineShowData} from "../data/defines";
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
    // console.log('canvas', canvas);
    initWebsocketData();
    return () => {
      canvas.closeSocket();
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
            const activePens = [];
            (canvas.data.pens || []).map((node) => {
              // 循环遍历
              if (node.property?.dataPointParam?.qtDataList?.length > 0) {
                activePens.push(node);
                canvas.socket.socket.send(
                  JSON.stringify({
                    ...node.property.dataPointParam,
                    nodeTid: node.TID,
                    nodeId: node.id,
                  })
                );
              }
            });
            // canvas.activeLayer.setPens(activePens);
          }
        }
      };
      canvas.socket.socket.onmessage = (data) => {
        // console.log("onmessage==",data)
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if (canvas.socket != undefined) {
            //
            updateComp(canvas.data.pens, data);
          }
        }
      };
    }
    //canvas.data.pens
    updateTimerCom(canvas.data.pens);
  };
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
      // 实时曲线第一根有数据的曲线标志
      let flag=true;
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
              node.data.echarts.option.series[0].data[0] = cd;
              updateChartNode(node);
            } else {
              // node.data.echarts.option.series[0].data.pop()
              // updateChartNode(node)
            }
            break;
          case 'timeLine':
            node.property.dataPointSelectedRows.sort((a,b)=>{
              return a.intervalTime-b.intervalTime
            })
            let selectedRows = node.property.dataPointSelectedRows;

            const timesxAix=node.data.echarts.option.dataset.source[0];
            (selectedRows || []).map((row,index) => {
              if (row.id == r.id) {
                if(index==0){
                  timesxAix.push(moment(parseInt(r.time/1000+"")*1000).format("LTS"))
                  if(timesxAix.length>defaultTimelineShowData){
                    timesxAix.splice(1,1)
                  }
                  node.data.echarts.option = getTimeLineOption(node, null, r, timesxAix);
                }else{
                  node.data.echarts.option = getTimeLineOption(node, null, r);
                }

              }
            });
            updateChartNode(node);
            break;
          case 'pie':
            (node.property.dataPointSelectedRows || []).map((row) => {
              if (row.id == r.id) {
                if (timedata.length >20) {
                  timedata.shift()
                }
                timedata.push({
                  name:moment(r.time),
                  value:[r.time,parseInt(r.value)]
                })

                // if(timedata.length<9){
                //   for(let i=0;i<9-timedata.length;i++){
                //     timedata.unshift(undefined)
                //   }
                // }
                node.data.echarts.option = pieOption(timedata);
                updateChartNode(node);


              }
            });
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
            canvas.updateProps(false);
          }
        } else if (node.name === 'biciCard') {
          if (node.property.dataPointParam.qtDataList[0].id == r.id) {
            const n = node.property.dataDot;
            const val = roundFun(parseFloat(r.value), n);
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

                  if (
                      (item.lightRangeBottom <= r.value &&
                    item.lightRangeTop > r.value) ||
                      item.lightRangeBottom <= r.value ||
                      item.lightRangeTop > r.value
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
        }
      }
    });
  };

  const updateChartNode = (node) => {
    // 更新图表数据
    node.elementRendered = false;
    echartsObjs[node.id].chart.setOption(
      JSON.parse(JSON.stringify(node.data.echarts.option, replacer), reviver)
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
