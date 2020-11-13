import { Node } from '../../core';

export function biciVarer(ctx: CanvasRenderingContext2D, node: Node) {

  ctx.beginPath();
  const offsetX = node.rect.width / 2;
  ctx.moveTo(node.rect.x + offsetX, node.rect.y);
  ctx.lineTo(node.rect.x, node.rect.y);
  ctx.lineTo(node.rect.x, node.rect.ey);
  ctx.lineTo(node.rect.x + offsetX, node.rect.ey);
  ctx.stroke();
  // const index = new WebSocket("ws://47.96.159.115:51060/ws?token=2AccB6w5TT0eD5TxceZBBX");
  // //打开事件
  // index.onopen = function() {
  //   console.log("Socket 已打开");
  //
  //   index.send(JSON.stringify({
  //     qtDataList: [{id: "6413f3a606754c31987ec584ed56d5b7", type: 2},{id: "b32723eaebfe48aaa0f85970c3a39036", type: 2}],
  //     subscribe: true
  //   }));
  // };
  // //获得消息事件
  // index.onmessage = function(msg) {
  //   console.log("返回消息")
  //   console.log(msg);
  //   node.text=JSON.parse(msg.data).value
  //   //发现消息进入    开始处理前端触发逻辑
  // };
  // //关闭事件
  // index.onclose = function() {
  //   console.log("Socket已关闭");
  // };
  // //发生了错误事件
  // index.onerror = function() {
  //   alert("Socket发生了错误");
  //   //此时可以尝试刷新页面
  // }
}

