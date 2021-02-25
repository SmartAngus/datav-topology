import {defaultLineColors, defaultTimelineShowData} from "../../data/defines";

export function getHorizontalBarOption(node:any=null,resData:any=null){
    let dimensions=["xdata", "2020-09"]
    let source=[
        ["补强板", 99.899],
        ["电梯导轨", 1457.332],
        ["扁钢", 1768.992]
    ]
    let series={
        type: 'bar',
        encode: { x: 'xdata', y: dimensions[1] },
        datasetIndex: 1,
    }
    let config={ dimension: dimensions[1], order: 'desc' }
    let encode={
        // Map the "amount" column to X axis.
        x: dimensions[1],
        // Map the "product" column to Y axis
        y: 'xdata'
    }
    if(resData){
        dimensions=resData["dimensions"]
        source=resData["source"]
        series.encode.y=dimensions[1]
        config.dimension=dimensions[1]
        encode.x=dimensions[1]
    }

    let chartBackgroundColor;
    let title="中国历代gdp";
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
        title:{
            text: titleShow?title:'',
            left: titlePosition,
            textStyle:{
                ...font,
                rich:{

                }
            }
        },
        grid: { //图表的位置
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            containLabel: true
        },
        dataset: [{
            dimensions:dimensions,
            source: source
        },
        {
            transform: {
                type: 'sort',
                config: config
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
                encode: encode
            }
        ]
    };
    return option;
}
