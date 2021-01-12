import { Node } from '../../core';

export function biciMeasure(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  ctx.fillStyle = "#EBEBEB";
  // Set line width
  ctx.lineWidth = 0;

// Wall
  ctx.fillRect(node.rect.x, node.rect.y-2, node.rect.width, node.rect.height+4);
  ctx.closePath();

  const scale=node.property.marks||10
  const step=node.rect.height/scale;
  let dataMax =  100;
  if(isNotNaN(node.property.dataMax)){
    dataMax = node.property.dataMax
  }
  let dataMin = node.property.dataMin || 0;
  let value = node.property.value||0
  if(value<dataMin) value=dataMin;
  if(value>dataMax) value=dataMax;
  // 绘制数据柱状图
  ctx.beginPath();
  ctx.fillStyle = "#1890ff";
  let vh=node.rect.height*(value-dataMin)/(dataMax-dataMin)
  ctx.fillRect(node.rect.x+8, node.rect.y+node.rect.height-vh, node.rect.width-16, vh+2);
  ctx.closePath();
  ctx.stroke();
  //-----
  ctx.strokeStyle = "#999999";
  ctx.fillStyle = "#999999";
  //  画直线，也就是刻度
  ctx.font = '12px serif';
  if(node.property.markChecked){
    for(let i=scale;i>=0;i--){
      ctx.beginPath();
      ctx.moveTo(node.rect.x-14, node.rect.y+i*step);
      ctx.lineTo(node.rect.x-4, node.rect.y+i*step);
      let txt=dataMin+(scale-i)*(dataMax-dataMin)/scale;
      txt = getFixed(txt,2);
      ctx.fillText(txt, node.rect.x-(txt.length)*6-20, node.rect.y+i*step+4.5);
      ctx.closePath();
      ctx.stroke();
    }
  }
  // 绘制单位
  ctx.beginPath();
  ctx.font = '14px serif';
  ctx.strokeStyle = "#333333";
  ctx.fillStyle = "#333333";
  if(node.property.chartUnitChecked){
    ctx.fillText(getFixed(node.property.value,node.property.dataDot)+" "+node.property.chartUnit, node.rect.x, node.rect.y+node.rect.height+20);
  }else{
    ctx.fillText(getFixed(node.property.value,node.property.dataDot), node.rect.x, node.rect.y+node.rect.height+20);
  }
  ctx.closePath();
  ctx.stroke();

  // 绘制两端的分段颜色
  let dataColors = node.property.dataColors;
  dataColors=dataColors.filter((item)=>item.checked==true);
  dataColors.sort((a,b)=>{
    return a.top-b.top;
  })
  let beforeHeight=0;
  dataColors.map((item)=>{
    let top=item.top;
    if((top-dataMin)>(dataMax-dataMin)){
      top=dataMax;
    }
    if(top<dataMin) top=dataMin;
    if(top>dataMax) top=dataMax;
    ctx.beginPath();
    ctx.fillStyle = item.color;
    if((dataMax-dataMin)!=0){// 分母不能为0
      let h=node.rect.height*((top-dataMin)/(dataMax-dataMin))
      ctx.fillRect(node.rect.x, node.rect.y+(node.rect.height-h), 4, h-beforeHeight);
      ctx.fillRect(node.rect.x+node.rect.width-4, node.rect.y+(node.rect.height-h), 4, h-beforeHeight);
      ctx.closePath();
      ctx.stroke();
      beforeHeight=h;
    }
  })
}

function getFixed(num,fix) {
  let numStr = num.toString()
  let index = numStr.indexOf('.')
  if(index<0) return numStr;
  if(fix==0){
    return numStr.slice(0, index + fix)
  }
  return numStr.slice(0, index + fix+1)
}
function isNotNaN(value) {
  const r = typeof value === 'number' && !isNaN(value);
  return r;
}

