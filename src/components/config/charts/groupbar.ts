export function getGroupBarOption(){
    const option = {
        legend: {},
        tooltip: {},
        dataset: [{
            dimensions:['product', '2012', '2013', '2014', '2015'],
            source: [
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ],
        }],
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
            {type: 'bar',seriesLayoutBy:'column'},
            {type: 'bar',seriesLayoutBy:'column'},
            {type: 'bar',seriesLayoutBy:'column'},
            {type: 'bar',seriesLayoutBy:'column'},
            // {type: 'bar',seriesLayoutBy:'row'},
            // {type: 'bar',seriesLayoutBy:'row'},
            // {type: 'bar',seriesLayoutBy:'row'},
        ]
    }
    return option;
}