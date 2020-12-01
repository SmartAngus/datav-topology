import React, { useEffect } from 'react';
import { Node, Topology } from '../../topology/core'
import { PageHeader, Button } from 'antd';
import moment from 'moment'
import { formatTimer } from '../utils/Property2NodeProps'
let canvas;
let x, y;
export class PreviewProps {
  history?: any;
  key?:number;
  ref?:any;
  // 画布数据 json对象
  data?:any;
  websocketConf?:{
    url:string,
  }
}
const Preview = ({ data,websocketConf }:PreviewProps) => {
  useEffect(() => {
    const canvasOptions = {
      rotateCursor: '/rotate.cur',
      locked: 1
    };
    canvas = new Topology('topology-canvas-preview', canvasOptions);

    // 渲染页面数据
    if(data!=undefined&&typeof data=='object'){
      data.locked=1;
      canvas.open(data)
    }
    initWebsocketData()
    return ()=>{
      canvas.closeSocket()
    }
  }, [data]);

  const initWebsocketData=()=>{
    canvas.closeSocket()
    if(websocketConf!==undefined){
      canvas.openSocket(`${websocketConf.url}`);
    }
    if(canvas!=undefined&&canvas.socket!=undefined){
      canvas.socket.socket.onopen=()=> {
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if(canvas.socket!=undefined){
            (canvas.data.pens||[]).map((node)=>{// 循环遍历
              if(node.property?.dataPointParam?.qtDataList?.length>0){
                canvas.socket.socket.send(JSON.stringify(({...node.property.dataPointParam,tid:node.TID,id:node.id})))
              }
            })
          }
        }
      }
      canvas.socket.socket.onmessage=(data)=>{
        console.log("onmessage==",data)
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
                    if(node.property.dataPointSelectedRows[0].id==r.id){
                      node.data.echarts.option.series[0].data[0].value = r.value;
                      canvas.updateProps(false);
                    }
                    break;
                  case 'timeLine':
                    const lastPoint=node.property.dataPointSelectedRows.slice(-1)[0];
                    console.log("lastPoint",lastPoint)
                    if(lastPoint&&lastPoint.id==r.id) {
                      const xAxisData = node.data.echarts.option.xAxis.data;
                      const yAxisData = node.data.echarts.option.series[0].data;
                      if (xAxisData.length > 10) {
                        xAxisData.shift();
                      }
                      if (yAxisData.length > 10) {
                        yAxisData.shift();
                      }
                      xAxisData.push(moment(r.time).format('LTS'));
                      yAxisData.push(r.value);
                      node.data.echarts.option.xAxis.data = xAxisData;
                      node.data.echarts.option.series[0].data = yAxisData;
                      canvas.updateProps(false);
                      canvas.render()
                    }
                    break;
                  default:
                }
              }else if (node.property?.dataPointParam?.qtDataList?.length > 0) {
                 const r = JSON.parse(data.data);
                 if (node.name == 'biciVarer') {
                   if (node.text != r.value) {
                     node.text = r.value;
                     canvas.updateProps(false);
                   }
                 }
               }
            });
          }
        }
      }
    }
    (canvas.data.pens||[]).map(node=>{
      if(node.name=='biciTimer'){
        setInterval(()=>{
          formatTimer(node,canvas)
        },1000)
      }
    })
  }


  /**
   * 自动适应窗口大小
   */

  const onHandleFit = () => {
    const rect = canvas.getRect();
    rect.calcCenter();
    x = document.body.clientWidth / 2 - rect.center.x;
    y = (document.body.clientHeight - 66) / 2 - rect.center.y;
    canvas.translate(x, y);
    initWebsocketData()
  };

  /**
   * 实际大小
   */

  const onHandlePre = () => {
    canvas.translate(-x, -y);
    x = 0;
    y = 0;
    initWebsocketData()
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
      <div id="topology-canvas-preview" style={{
        height: '100vh',
        width: '100vw',
        backgroundImage:`url(${data?.bkImage})`
      }} />
    </React.Fragment>
  );
};

// @ts-ignore
export default Preview;
