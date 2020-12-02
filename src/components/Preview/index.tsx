import React, { useEffect } from 'react';
import { Node, Topology } from '../../topology/core';
import { PageHeader, Button } from 'antd';
import { roundFun } from '../utils/cacl';
import moment from 'moment';
import { formatTimer } from '../utils/Property2NodeProps';
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
    initWebsocketData();
    return () => {
      canvas.closeSocket();
    };
  }, [data]);

  // 数据卡片颜色根据数据变化
  const setCardStyle = (
    node: Node,
    fontFamily: string,
    size: number,
    bkColor: string
  ) => {
    if (fontFamily) {
      node.font.fontFamily = fontFamily;
      node.children[0].font.fontFamily = fontFamily;
      node.children[1].font.fontFamily = fontFamily;
    }
    if (size) {
      node.font.fontSize = size;
      node.children[0].font.fontSize = size;
      node.children[1].font.fontSize = size;
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
                    tid: node.TID,
                    id: node.id,
                  })
                );
              }
            });
            canvas.activeLayer.setPens(activePens);
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
                    if (node.property.dataPointSelectedRows[0].id == r.id) {
                      node.data.echarts.option.series[0].data[0].value =
                        r.value;
                      canvas.updateProps(false);
                    }
                    break;
                  case 'timeLine':
                    (node.property.dataPointSelectedRows||[]).map((row,index)=>{
                      const seria = {
                        symbol: 'none',
                        name: '当前流量',
                        type: 'line',
                        smoothMonotone: 'x',
                        smooth: true,
                        markLine: {
                          silent: true,
                          data: [
                            {
                              yAxis: 20,
                            },
                            {
                              yAxis: 40,
                            },
                            {
                              yAxis: 60,
                            },
                            {
                              yAxis: 100,
                            },
                            {
                              yAxis: 120,
                            },
                          ],
                        },
                        data: []
                      };
                      if(row.id==r.id){
                        const xAxisData = node.data.echarts.option.xAxis.data;
                        const yAxisData = node.data.echarts.option.series[index]||seria;
                        if (xAxisData.length > 10) {
                          xAxisData.shift();
                        }
                        if (yAxisData&&yAxisData.data.length > 10) {
                          yAxisData.data.shift();
                        }
                        xAxisData.push(moment(r.time).format('LTS'));
                        yAxisData.data.push(r.value);
                        yAxisData.name=row.dataName
                        node.data.echarts.option.xAxis.data = xAxisData;

                       node.data.echarts.option.series[index]=yAxisData;
                      }
                    })
                    canvas.updateProps(false);
                    break;
                  default:
                }
              } else if (
                node.property?.dataPointParam?.qtDataList?.length > 0
              ) {
                const r = JSON.parse(data.data);
                if (node.name == 'biciVarer') {
                  if (node.text != r.value && node.property.dataPointParam.qtDataList[0].id == r.id) {
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
                    if (tempVal < bottom) {
                      // 小于下限
                      setCardStyle(
                        node,
                        node.property.bottomLimit.fontFamily,
                        parseInt(node.property.bottomLimit.fontSize),
                        node.property.bottomLimit.bkColor
                      );
                    } else if (tempVal > top) {
                      // 高于上限
                      setCardStyle(
                        node,
                        node.property.topLimit.fontFamily,
                        parseInt(node.property.topLimit.fontSize),
                        node.property.topLimit.bkColor
                      );
                    } else {
                      setCardStyle(
                        node,
                        node.property.normal.fontFamily,
                        parseInt(node.property.normal.fontSize),
                        node.property.normal.bkColor
                      );
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
