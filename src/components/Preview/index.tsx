import React, { useEffect } from 'react';
import { Topology } from '../../topology/core';
import { PageHeader, Button } from 'antd';
import moment from 'moment'
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
const Preview = ({ history,data,websocketConf }:PreviewProps) => {
  useEffect(() => {
    const canvasOptions = {
      rotateCursor: '/rotate.cur',
      locked: 1
    };
    canvas = new Topology('topology-canvas-preview', canvasOptions);
    if(history){
      history.location.state.data.locked = 1;
    }
    // 渲染页面数据
    if(data!=undefined&&typeof data=='object'){
      data.locked=1;
      canvas.open(data)
    }
    initWebsocketData()
    return ()=>{
      canvas.closeSocket()
    }
  }, [history?.location.state.data,data]);

  const initWebsocketData=()=>{
    canvas.closeSocket()
    if(websocketConf!==undefined){
      canvas.openSocket(`${websocketConf.url}`);
    }
    if(canvas!=undefined&&canvas.socket!=undefined){
      console.log("preview websocket")
      canvas.socket.socket.onopen=()=> {
        console.log("onopen")
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if(canvas.socket!=undefined){
            (canvas.data.pens||[]).map((node)=>{
              if(node.property?.dataPointParam?.qtDataList?.length>0){
                canvas.socket.socket.send(JSON.stringify(({...node.property.dataPointParam,tid:node.TID,id:node.id})))
              }
            })
          }
        }
      }
      canvas.socket.socket.onmessage=(data)=>{
        console.log("socket onmessage",data.data)
        if (canvas.data && canvas.data.pens.length > 0) {
          // 有数据，去遍历有websocket的组件，并订阅
          if(canvas.socket!=undefined){
            (canvas.data.pens||[]).map((node)=> {
              if (node.property?.dataPointParam?.qtDataList?.length > 0) {
                const r = JSON.parse(data.data)
                if(node.name=='biciVarer'){
                  if(node.text!=r.value){
                    node.text=r.value;
                    canvas.updateProps(false)
                  }
                }
              }
            })
          }
        }
      }
    }
    (canvas.data.pens||[]).map(node=>{
      console.log("init timer")
      if(node.name=='biciTimer'){
        setInterval(()=>{
          formatTimer(node)
        },1000)
      }
    })
  }
  function formatTimer(node) {
    let y=''
    let h=''
    if(node.property.date.show){
      y=moment().format(node.property.date.format)
    }
    if(node.property.time.show){
      h=moment().format(node.property.time.format)
    }
    node.text=y+' '+h
    canvas.updateProps(false)
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
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}
        extra={[
          <Button type="primary" key="2" onClick={() => onHandleFit()}>
            自动适应窗口大小
          </Button>,
          <Button key="1" onClick={() => onHandlePre()}>
            实际大小
          </Button>
        ]}
        onBack={() =>
          history.push({
            pathname: '/',
            state: { data: history.location.state.data, from: '/preview' }
          })
        }
        title="返回画板"
        subTitle="预览"
      />
      <div id="topology-canvas-preview" style={{
        height: 'calc(100vh - 66px)',
        width: '100vw',
        backgroundImage:`url(${history.location.state.data.bkImage})`
      }} />
    </React.Fragment>
  );
};

export default Preview;
