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
