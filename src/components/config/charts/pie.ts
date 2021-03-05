import {defaultChartColors} from "../../data/defines";

export function getPieOption() {
    const option = {
        color:defaultChartColors,
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
            radius: ['50%'],
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

    let chartShape:any='50%';
    if(node.property.props.chartShape=="circle"){
        chartShape=["30%","50%"]
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
    if(node.property.props.titleFontColor){
        font.color=node.property.props.titleFontColor;
    }
    if(node.property.props.titleFontFamily){
        font.fontFamily=node.property.props.titleFontFamily;
    }
    if(node.property.props.titleFontSize){
        font.fontSize=node.property.props.titleFontSize;
    }

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
        color:defaultChartColors,
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
            textStyle: {
                color:font.color,
                fontSize: 12
            }
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
                color:font.color,
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
