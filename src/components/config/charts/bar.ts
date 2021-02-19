import {defaultLineColors} from "../../data/defines";

export function getBarOption(node:any=null,resData:any=null){
    let dimensions=["xdata", "2020-09"]
    let source=[
        ["补强板", 99.899],
        ["电梯导轨", 1457.332],
        ["扁钢", 1768.992]
    ]
    let series={
        type: 'bar',
        encode: { x: 'xdata', y: '2020-09' },
        datasetIndex: 1,
    }
    if(resData){
        dimensions=resData["dimensions"]
        source=resData["source"]
        series.encode.y=dimensions[1]
    }
    const option = {
        color: defaultLineColors,
        title:{
            text:'流浪来源统计图'
        },
        legend: {
            top: '4%',
            right: '4%',
            itemWidth: 17,
            itemHeight: 12,
            textStyle: {
                color: '#ADD6FF',
                fontSize: 10
            },
        },
        grid: { //图表的位置
            top: '20%',
            left: '6%',
            right: '6%',
            bottom: '6%',
            containLabel: true
        },
        dataset: [{
            "dimensions": dimensions,
            "source": source
        }, {
            transform: {
                type: 'sort',
                config: { dimension: dimensions[1], order: 'asc' }
            }
        }],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: series
    };
    return option;
}