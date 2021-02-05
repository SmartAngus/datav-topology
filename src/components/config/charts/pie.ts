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
            "dimensions": ["xdata", "2020-09"],
            "source": [
                ["补强板", 99.899],
                ["电梯导轨", 1457.332],
                ["扁钢", 1768.992]
            ]
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