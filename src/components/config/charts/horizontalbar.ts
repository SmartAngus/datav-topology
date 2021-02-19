import {defaultLineColors, defaultTimelineShowData} from "../../data/defines";

export function getHorizontalBarOption(node:any=null,resData:any=null){
    let dimensions=["xdata", "2020-09"]
    let source=[
        ["补强板", 99.899],
        ["电梯导轨", 1457.332],
        ["扁钢", 1768.992]
    ]
    let series={
        type: 'bar',
        encode: { x: 'xdata', y: dimensions[1] },
        datasetIndex: 1,
    }
    let config={ dimension: dimensions[1], order: 'desc' }
    let encode={
        // Map the "amount" column to X axis.
        x: dimensions[1],
        // Map the "product" column to Y axis
        y: 'xdata'
    }
    if(resData){
        dimensions=resData["dimensions"]
        source=resData["source"]
        series.encode.y=dimensions[1]
    }
    const option = {
        title:{
            text:"中国历代gdp"
        },
        grid: { //图表的位置
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            containLabel: true
        },
        dataset: [{
            dimensions:dimensions,
            source: source
        },
        {
            transform: {
                type: 'sort',
                config: config
            }
        }],
        xAxis: {name: ''},
        yAxis: {type: 'category',inverse: true},
        visualMap: {
            show:false,
            orient: 'horizontal',
            left: 'center',
            min:0,
            max:300,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 1,
            inRange: {
                color: defaultLineColors
            }
        },
        series: [
            {
                type: 'bar',
                realtimeSort: true,
                seriesLayoutBy: 'column',
                datasetIndex: 1,
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                },
                encode: encode
            }
        ]
    };
    return option;
}