import { Node } from '../../core';

export function simpleCard(ctx: CanvasRenderingContext2D, node: Node) {
  let wr = node.borderRadius;
  let hr = node.borderRadius;
  if (node.borderRadius < 1) {
    wr = node.rect.width * node.borderRadius;
    hr = node.rect.height * node.borderRadius;
  }
  let r = wr < hr ? wr : hr;
  if (node.rect.width < 2 * r) {
    r = node.rect.width / 2;
  }
  if (node.rect.height < 2 * r) {
    r = node.rect.height / 2;
  }
  ctx.beginPath();
  ctx.moveTo(node.rect.x + r, node.rect.y);
  ctx.arcTo(
    node.rect.x + node.rect.width,
    node.rect.y,
    node.rect.x + node.rect.width,
    node.rect.y + node.rect.height,
    r
  );
  ctx.arcTo(
    node.rect.x + node.rect.width,
    node.rect.y + node.rect.height,
    node.rect.x,
    node.rect.y + node.rect.height,
    r
  );
  ctx.arcTo(
    node.rect.x,
    node.rect.y + node.rect.height,
    node.rect.x,
    node.rect.y,
    r
  );
  ctx.arcTo(
    node.rect.x,
    node.rect.y,
    node.rect.x + node.rect.width,
    node.rect.y,
    r
  );
  ctx.closePath();

  ctx.moveTo(node.rect.x, node.rect.y + 40);
  //ctx.lineTo(node.rect.ex, node.rect.y + 40);

  const height = node.rect.y + 20 + node.rect.height / 2;
  ctx.moveTo(node.rect.x, height);
  //ctx.lineTo(node.rect.ex, height);

  const linear = ctx.createLinearGradient(
      node.rect.x,
      node.rect.y,
      node.rect.ex+node.rect.width/2,
      node.rect.ey+node.rect.height);
  // const linear = ctx.createRadialGradient(
  //     node.rect.x+node.rect.width/2,
  //     node.rect.y+node.rect.height/2,
  //     10,
  //     node.rect.x+node.rect.width/2,
  //     node.rect.y+node.rect.height/2,
  //     100);
  const {fillStyle}=node;
  if(fillStyle){
    linear.addColorStop(0,'white');
    linear.addColorStop(1,fillStyle);
    ctx.fillStyle=linear;
    ctx.strokeStyle=fillStyle;
  }
  ctx.lineWidth=0;
  (node.fillStyle || node.bkType) && ctx.fill();
  ctx.stroke();
}
