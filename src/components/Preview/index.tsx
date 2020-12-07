import React, { useEffect } from 'react';
import { Node, Topology } from '../../topology/core';
import { PageHeader, Button } from 'antd';
import { roundFun } from '../utils/cacl';
import moment from 'moment';
import { formatTimer, getNodeType } from '../utils/Property2NodeProps';
import {getMeasureOption2, getTimelineOption} from "../config/chartMeasure";
import {
  register as registerChart,
  echartsObjs,
} from '../../topology/chart-diagram';
import {reviver} from "../utils/serializing";
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
    };
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
            (canvas.data.pens || []).map((node: Node) => {
              if (node.name == 'echarts') {
                // 如果是图表组件，下面就需要判断具体的是那种图表组件
                const theChart = node.property.echartsType;
                const r = JSON.parse(data.data);
                switch (theChart) {
                  case 'gauge':
                    if (node.property.dataPointSelectedRows[0]?.id == r.id) {
                      node.data.echarts.option.series[0].data[0].value =
                        r.value;
                    }
                    break;
                  case 'chartMeasure':
                    if (node.property.dataPointSelectedRows[0]?.id == r.id) {
                      const option = getMeasureOption2({
                        associationObject:node.property.dataPointSelectedRows[0]?.associationObject,
                        value:r.value
                      })
                      node.data.echarts.option=option;
                    }
                    break;
                  case 'timeLine':
                    node.data.echarts.option=getTimelineOption(node,r);
                    break;
                  default:
                }
                // 更新图表数据
                echartsObjs[node.id].chart.setOption(
                    JSON.parse(JSON.stringify(node.data.echarts.option), reviver)
                );
                echartsObjs[node.id].chart.resize();
                node.elementRendered = true;
              } else if (
                node.property?.dataPointParam?.qtDataList?.length > 0
              ) {
                // 非图表组件
                const r = JSON.parse(data.data);
                const nodeType = getNodeType(node);
                if (node.name == 'biciVarer') {
                  if (
                    node.text != r.value &&
                    node.property.dataPointParam.qtDataList[0].id == r.id
                  ) {
                    node.text = r.value;
                    canvas.updateProps(false);
                  }
                } else if (node.name === 'biciCard') {
                  if (node.property.dataPointParam.qtDataList[0].id == r.id) {
                    const n = node.property.dataDot;
                    const val = roundFun(parseFloat(r.value), n);
                    node.children[0].text = val;
                    const bottom = parseFloat(node.property.limit.bottom);
                    const top = parseFloat(node.property.limit.top);
                    const tempVal = parseFloat(val);
                    if (top !== 0 && tempVal < bottom) {
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
                    } else if (top !== 0 && tempVal > top) {
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
                            node.strokeStyle = item.lightRangeColor;
                            node.text =
                              item?.lightRangeText || node.property.text;
                            flag = true;
                            break;
                          }
                        } else {
                          if (
                            item.lightRangeBottom <= r.value &&
                            item.lightRangeTop > r.value
                          ) {
                            node.strokeStyle = item.lightRangeColor;
                            node.text =
                              item?.lightRangeText || node.property.text;
                            flag = true;
                            break;
                          }
                        }
                      }
                      if (!flag) {
                        node.strokeStyle = node.property.color;
                        node.text = node.property.text;
                      }
                    }
                    canvas.updateProps(false);
                  }
                }
              }
            });
          }
        }
      };
    }
    (canvas.data.pens || []).map((node) => {
      if (node.name == 'biciTimer') {
        setInterval(() => {
          formatTimer(node, canvas);
        }, 1000);
      }
    });
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
    <React.Fragment>
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
        style={{
          height: '100vh',
          width: '100vw',
          backgroundImage: `url(${data?.bkImage})`,
        }}
      />
    </React.Fragment>
  );
};

// @ts-ignore
export default Preview;
