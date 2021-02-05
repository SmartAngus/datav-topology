import {defaultLineColors} from "../../data/defines";

export function getStackBarOption(){
    const option = {
        backgroundColor:"#001037",
        color: defaultLineColors,
        tooltip: {
            trigger: 'axis',
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
            top: '10%',
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
        },
        dataset: [{
            dimensions:['xdata', '2012', '2013', '2014', '2015'],
            source: [
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ],
        }],
        yAxis: {},
        xAxis: {
            type: 'category'
        },
        series: [
            {type: 'bar', stack: 'sum', barWidth: '25%'},
            {type: 'bar', stack: 'sum', barWidth: '25%'},
            {type: 'bar', stack: 'sum', barWidth: '25%'},
            {type: 'bar', stack: 'sum', barWidth: '25%'},
        ]
    };
    return option;
}