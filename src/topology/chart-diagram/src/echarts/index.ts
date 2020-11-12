import { s8, Node, createDiv, rectangle } from '../../../core';

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
      const index = new WebSocket("ws://localhost/websocket/23");
      //打开事件
      index.onopen = function() {
        console.log("Socket 已打开");
        index.send("这是来自客户端的消息" + location.href + new Date());
      };
      //获得消息事件
      index.onmessage = function(msg) {
        console.log("返回消息")
        console.log(msg.data);
        //发现消息进入    开始处理前端触发逻辑
      };
      //关闭事件
      index.onclose = function() {
        console.log("Socket已关闭");
      };
      //发生了错误事件
      index.onerror = function() {
        alert("Socket发生了错误");
        //此时可以尝试刷新页面
      }
      echartsObjs[node.id].chart.setOption(node.data.echarts.option);
      echartsObjs[node.id].chart.resize();
      node.elementRendered = true;
    });
  }
}
