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

/**
 * 将base64的图片数据转化成file对象上传
 * @param data
 */
export function base64ToFile(data) {

  // 将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
  let binary = atob(data.split(',')[1]);
  let mime = data.split(',')[0].match(/:(.*?);/)[1];
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let fileData = new Blob([new Uint8Array(array)], {
    type: mime,
  });

  let file = new File([fileData], `${new Date().getTime()}.png`, { type: mime });

  return file;

}
