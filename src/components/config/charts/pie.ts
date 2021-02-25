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
                edgeDistance:'auto',
                alignTo:'labelLine',
                formatter:function(param){
                    return param.value[0]+'\n'+param.value[1]
                }
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
export function getPieOptionByChangeProp(node:any,resData:any) {

    let chartShape:any='70%';
    if(node.property.props.chartShape=="circle"){
        chartShape=["50%","70%"]
    }
    let chartBackgroundColor;
    if(node.property.props.chartBkColor!=''&&node.property.props.chartBkColorChecked==true){
        chartBackgroundColor=node.property.props.chartBkColor;
    }else{
        chartBackgroundColor='transparent'
    }
    let title=node.property.props.title;
    let titleShow=node.property.props.titleShow;
    let font:any={};
    (node.property.props.titleFontStyle||[]).forEach(item=>{
        if(item.name=='bold'){
            if(item.checked){
                font.fontWeight=item.value
            }else{
                font.fontWeight='normal'
            }
        }
        if(item.name=='italic'){
            if(item.checked){
                font.fontStyle=item.value
            }else{
                font.fontStyle='normal'
            }
        }
    })
    /****后端数据***/
    let dimensions=["xdata", "2020-09"]
    let source=[
        ["补强板", 99.899],
        ["电梯导轨", 1457.332],
        ["扁钢", 1768.992]
    ]

    // 后端数据
    if(resData){
        dimensions=resData["dimensions"]
        source=resData["source"]
    }
    const option = {
        backgroundColor:chartBackgroundColor,
        title:{
            text:titleShow?title:'',
            left:node.property.props.titlePosition,
            textStyle:{
                ...font,
                color:node.property.props.titleFontColor,
                fontFamily:node.property.props.titleFontFamily,
                fontSize:node.property.props.titleFontSize,
            }
        },
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
            "dimensions": dimensions,
            "source": source
        }],
        series: [{
            type: 'pie',
            radius: chartShape,
            center: ['50%', '25%'],
            selectedOffset:30,
            label:{
                edgeDistance:'auto',
                alignTo:'labelLine',
                formatter:function(param){
                    return param.value[0]+'\n'+param.value[1]
                }
            },
            labelLine:{
                length:10,
                length2:10,
                minTurnAngle:120,
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
