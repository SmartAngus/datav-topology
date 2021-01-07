/***
 * 仪表盘
 * @param opt
 * @param changeValues
 */
export function getGaugeOption(
    opt?: {
        min: number;
        max: number;
        lineColors: any[];
        chartTitle: string;
        chartTitleChecked: boolean;
        chartUnitChecked: boolean;
        chartUnit: string;
    },
    changeValues?: any
) {
    if (opt) {
        opt = Object.assign({}, opt, changeValues);
    }
    let min = 0;
    if(opt){
        min=opt.min
    }
    let max = 100;
    if(opt){
        max=opt.max
    }
    const lineColors = opt?.lineColors || [
        //数组第一个属性是颜色所占line百分比
        [0.4, '#49afff'],
        [0.6, '#68A54A'],
        [1, '#f56c6c'],
    ];
    if(lineColors[lineColors.length-1][0]<1){
        lineColors.push([1, '#f56c6c'])
    }
    lineColors.sort((a,b)=>{
        return a[0]-b[0]
    })
    let showTitle = true;
    let unit;
    let title;
    if (opt) {
        if (opt.chartUnitChecked) {
            unit = opt?.chartUnit || '';
        } else {
            unit = '';
        }
        if (opt.chartTitleChecked) {
            showTitle = true;
            title = opt.chartTitle;
        } else {
            showTitle = false;
        }
    } else {
        unit = '';
        showTitle = false;
        title = '仪表盘';
    }
    const option = {
        tooltip: {
            formatter: '{a} {b} : {c}%',
        },
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 50,
        },
        toolbox: {
            feature: {
                restore: {
                    show: false,
                },
                saveAsImage: {
                    show: false,
                },
            },
        },
        series: [
            {
                name: '',
                type: 'gauge',
                min: min,
                max: max,
                radius: '100%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 22,
                        color:lineColors
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 27,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 30,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    // backgroundColor: 'auto',
                    // borderRadius: 2,
                    color: '#345678',
                    padding: 3,
                    // textShadowBlur: 2,
                    // textShadowOffsetX: 1,
                    // textShadowOffsetY: 1,
                    // textShadowColor: '#222'
                },
                title: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 14,
                    fontStyle: 'normal',
                    color:'#222222',
                    show: showTitle,
                    offsetCenter: [0, '90%'],
                },
                detail: {
                    formatter: '{value} ' + unit,
                    offsetCenter: [0, '60%'],
                    textStyle: {
                        fontSize: 16,
                        color: '#333333',
                    },
                },
                data: [{value: 0, name: title}]
            },
        ],
    };
    return option;
}