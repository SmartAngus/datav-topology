export function calcCanvas(width:string|number=826,height:string|number=1168) {
  let minWidth=3198;
  let minHeight=2288;
  let left=1186;
  let top=560;
  let kw = 3.8716707;
  let kh = 1.95976027;
  width=width as number
  height=height as number;
  if(width<=height){
    minWidth = width*kw;
    minHeight=height*kh
  }else{
    minWidth = width*kh;
    minHeight=height*kw
  }
  left = (minWidth-width)/2;
  top = (minHeight-height)/2;
  return {
    minWidth,
    minHeight,
    left,
    top,
  }
}
export function calcScroll(width:string|number=826,height:string|number=1168) {

}
export function getHexColor(color) {
  if (color==="transparent") return "transparent";
  if(color==undefined){
    return color;
  }
  var a = parseFloat(color.a || 1),
    r = Math.floor(a * parseInt(color.r) + (1 - a) * 255),
    g = Math.floor(a * parseInt(color.g) + (1 - a) * 255),
    b = Math.floor(a * parseInt(color.b) + (1 - a) * 255)
  return '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
}
