import {defaultLineColors} from "../../data/defines";

export function getBarOption(){
    const option = {
        color: defaultLineColors,
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
            top: '10%',
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
        },
        dataset: [{
            "dimensions": ["xdata", "2020-09"],
            "source": [
                ["补强板", 99.899],
                ["电梯导轨", 1457.332],
                ["扁钢", 1768.992]
            ]
        }, {
            transform: {
                type: 'sort',
                config: { dimension: '2020-09', order: 'asc' }
            }
        }],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
            type: 'bar',
            encode: { x: 'xdata', y: '2020-09' },
            datasetIndex: 1,
        }
    };
    return option;
}