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
            source: [
                ['product', '2012', '2013', '2014', '2015'],
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ]
        }, {
            transform: {
                type: 'sort',
                config: { dimension: '2012', order: 'asc' }
            }
        }],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
            type: 'bar',
            encode: { x: 'product', y: '2012' },
            datasetIndex: 1,
        }
    };
    return option;
}