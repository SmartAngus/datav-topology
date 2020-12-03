export function calcCanvas(
  width: string | number = 826,
  height: string | number = 1168
) {
  let minWidth = 3198;
  let minHeight = 2288;
  let left = 1186;
  let top = 560;
  let kw = 3.8716707;
  let kh = 1.95976027;
  width = width as number;
  height = height as number;
  if (width <= height) {
    minWidth = width * kw;
    minHeight = height * kh;
  } else {
    minWidth = width * kh;
    minHeight = height * kw;
  }
  left = (minWidth - width) / 2;
  top = (minHeight - height) / 2;
  return {
    minWidth,
    minHeight,
    left,
    top,
  };
}
export function calcScroll(
  width: string | number = 826,
  height: string | number = 1168
) {}
export function getHexColor(color) {
  if (color === 'transparent') return 'transparent';
  if (color == undefined) {
    return color;
  }
  var a = parseFloat(color.a || 1),
    r = Math.floor(a * parseInt(color.r) + (1 - a) * 255),
    g = Math.floor(a * parseInt(color.g) + (1 - a) * 255),
    b = Math.floor(a * parseInt(color.b) + (1 - a) * 255);
  return (
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
  );
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

  let file = new File([fileData], `${new Date().getTime()}.png`, {
    type: mime,
  });

  return file;
}

// 保留n位小数并格式化输出（不足的部分补0）
export function roundFun(value: number, n: number) {
  let s = (Math.round(value * Math.pow(10, n)) / Math.pow(10, n)).toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    s += '.';
  }
  for (let i = s.length - s.indexOf('.'); i <= n; i++) {
    s += '0';
  }
  return s;
}

// 判断区间是否有重叠，返回重叠区间个数，!==0 代表区间有重叠
export function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); //按照区间末位对这些区间排个位，保证结束时间是按序上升的，从前往后取总是能取到当前结束时间的最小值

  let flag = -Infinity; //记录前一区间的结束值，此处一开始需取负无穷，因为必须保证这里一开始是最小的
  let sum = 0; //记录需要移除的区间个数
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i][0] >= flag) {
      //区间起点大于前一区间的结束点
      flag = intervals[i][1];
    } else {
      sum += 1; //有重叠
    }
  }
  return sum;
}
