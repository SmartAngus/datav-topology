import {defaultLineColors} from "../../data/defines";

export function getBarOption(node:any=null,resData:any=null){
    let dimensions=["xdata", "2020-09"]
    let source=[
        ["补强板", 99.899],
        ["电梯导轨", 1457.332],
        ["扁钢", 1768.992]
    ]
    let series={
        type: 'bar',
        encode: { x: 'xdata', y: '2020-09' },
        datasetIndex: 1,
    }
    // 后端数据
    if(resData){
        dimensions=resData["dimensions"]
        source=resData["source"]
        series.encode.y=dimensions[1]
    }
    let chartBackgroundColor;
    let title="堆叠图";
    let titleShow=true;
    let font:any={};
    let titlePosition='left';
    // 组件属性改变
    if(node){
        console.log("node==",node)
        title=node.property.props.title;
        titleShow=node.property.props.titleShow;
        if(node.property.props.chartBkColor!=''&&node.property.props.chartBkColorChecked==true){
            chartBackgroundColor=node.property.props.chartBkColor;
        }else{
            chartBackgroundColor='transparent'
        }
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
        titlePosition = node.property.props.titlePosition;
        if(node.property.props.titleFontColor){
            font.color=node.property.props.titleFontColor;
        }
        if(node.property.props.titleFontFamily){
            font.fontFamily=node.property.props.titleFontFamily;
        }
        if(node.property.props.titleFontSize){
            font.fontSize=node.property.props.titleFontSize;
        }
    }
    const option = {
        color: defaultLineColors,
        title:{
            text: titleShow?title:'',
            left: titlePosition,
            textStyle:{
                ...font,
                rich:{

                }
            }
        },
        legend: {
            top: '4%',
            right: '4%',
            itemWidth: 17,
            itemHeight: 12,
            textStyle: {
                color: font.color,
                fontSize: 10
            },
        },
        grid: { //图表的位置
            top: '20%',
            left: '6%',
            right: '6%',
            bottom: '6%',
            containLabel: true
        },
        dataset: [{
            "dimensions": dimensions,
            "source": source
        }, {
            transform: {
                type: 'sort',
                config: { dimension: dimensions[1], order: 'asc' }
            }
        }],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30,color:font.color, },
        },
        yAxis: {
            axisLabel:{
                color:font.color,
            }
        },
        series: series
    };
    return option;
}
