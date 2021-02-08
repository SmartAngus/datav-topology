import {defaultLineColors, defaultTimelineShowData} from "../../data/defines";

export function getHorizontalBarOption(){
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
            dimensions:['xdata', '2012', '2013', '2014', '2015'],
            source: [
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa1', 24.1, 67.2, 79.5, 86.4],
                ['Cheese Cocoa2', 24.1, 167.2, 79.5, 86.4],
                ['Cheese Cocoa3', 24.1, 267.2, 79.5, 86.4]
            ]
        },
        {
            transform: {
                type: 'sort',
                config: { dimension: '2013', order: 'desc' }
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
                encode: {
                    // Map the "amount" column to X axis.
                    x: '2013',
                    // Map the "product" column to Y axis
                    y: 'xdata'
                }
            }
        ]
    };
    return option;
}