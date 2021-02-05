export function getPieOption() {
    const option = {
        grid: { //图表的位置
            top: '10%',
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
        },
        legend: {
            orient: 'horizontal',
            bottom: 'bottom',
        },
        dataset: [{
            dimensions:['xdata', '2012', '2013', '2014', '2015'],
            source: [
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ],
        }],
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '25%'],
            selectedOffset:30,
            label:{
                edgeDistance:'25%',
                alignTo:'labelLine',

            }
        }],


        // Optional. Only for responsive layout:图表响应式
        media: [{
            query: { minAspectRatio: 1 },
            option: {
                series: [
                    { center: ['50%', '50%'] },
                ]
            }
        }, {
            option: {
                series: [
                    { center: ['50%', '50%'] },
                ]
            }
        }]
    };

    return option;
}