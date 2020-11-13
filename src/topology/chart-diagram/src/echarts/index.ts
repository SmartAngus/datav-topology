import { s8, Node, createDiv, rectangle } from '../../../core';
import {Stomp} from '@stomp/stompjs'
import SockJS from 'sockjs-client'
export const echartsObjs: any = {};

export function echarts(ctx: CanvasRenderingContext2D, node: Node) {
  // 绘制一个底图，类似于占位符。
  rectangle(ctx, node);

  // tslint:disable-next-line:no-shadowed-variable
  const echarts = echartsObjs.echarts || (window as any).echarts;
  if (!node.data || !echarts) {
    return;
  }

  if (typeof node.data === 'string') {
    node.data = JSON.parse(node.data);
  }

  if (!node.data.echarts) {
    return;
  }

  if (!node.elementId) {
    node.elementId = s8();
  }

  if (!node.elementLoaded) {
    echartsObjs[node.id] = {
      div: createDiv(node),
    };
    node.elementLoaded = true;
    document.body.appendChild(echartsObjs[node.id].div);
    // 添加当前节点到div层
    node.addToDiv();
    echartsObjs[node.id].chart = echarts.init(
      echartsObjs[node.id].div,
      node.data.echarts.theme
    );
    node.elementRendered = false;

    // 等待父div先渲染完成，避免初始图表控件太大
    setTimeout(() => {
      echartsObjs[node.id].chart.resize();
    });
  }

  if (!node.elementRendered) {
    // 初始化时，等待父div先渲染完成，避免初始图表控件太大。
    setTimeout(() => {

      var stompClient = null;



      function connect() {
        var socket = new WebSocket('ws://localhost/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
          console.log('Connected: ' + frame);
          stompClient.subscribe('http://localhost/app/topic/greetings', function (greeting) {
            console.log(JSON.parse(greeting.body).content);
          });
        });
      }

      function disconnect() {
        if (stompClient !== null) {
          stompClient.disconnect();
        }
        console.log("Disconnected");
      }

      function sendName() {
        stompClient.send("http://localhost/app/hello", {}, JSON.stringify({'name': "majy"}));
      }








      echartsObjs[node.id].chart.setOption(node.data.echarts.option);
      echartsObjs[node.id].chart.resize();
      node.elementRendered = true;
    });
  }
}
