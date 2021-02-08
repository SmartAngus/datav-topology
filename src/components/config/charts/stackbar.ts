import {defaultLineColors} from "../../data/defines";

export function getStackBarOption(node?:any,data?:any){

    let chartBackgroundColor;
    let title="堆叠图";
    let titleShow=true;
    let font:any={};
    let titlePosition='left';
    if(node){
        title=node.property.props.title;
        titleShow=node.property.props.titleShow;
        if(node.property.props.chartBkColor!=''&&node.property.props.chartBkColorChecked==true){
            chartBackgroundColor=node.property.props.chartBkColor;
        }else{
            chartBackgroundColor='transparent'
        }
        (node.property.props.titleFontStyle||[]).forEach(item=>{
            if(item.checked&&item.name=='bold'){
                font.fontWeight=item.value
            }else{
                font.fontWeight=undefined
            }
            if(item.checked&&item.name=='italic'){
                font.fontStyle=item.value
            }else{
                font.fontStyle=undefined
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
        backgroundColor:chartBackgroundColor,
        color: defaultLineColors,
        tooltip: {
            trigger: 'axis',
        },
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
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 17,
            itemHeight: 30,
            textStyle: {
                color: '#333333',
                fontSize: 14
            },
        },
        grid: { //图表的位置
            top: '20%',
            left: '2%',
            right: '20%',
            bottom: '10%',
            containLabel: true
        },

        dataset: [{
            dimensions:['xdata', '750车间', '740车间', '哈哈哈车间', '呵呵呵车间'],
            source: [
                ['202001', 41.1, 30.4, 65.1, 53.3],
                ['202002', 86.5, 92.1, 85.7, 83.1],
                ['202003', 24.1, 67.2, 79.5, 86.4],
                ['202004', 24.1, 67.2, 79.5, 86.4],
                ['202005', 24.1, 67.2, 79.5, 86.4],
                ['202006', 24.1, 67.2, 79.5, 86.4],
            ],
        }],
        yAxis: {
            axisLine:{
                show:false
            },
            splitLine:{
                show:false
            }
        },
        xAxis: {
            type: 'category',
            axisLine:{
                show:false
            },
            splitLine:{
                show:false
            },
            axisTick:{
                show:false
            }
        },
        series: [
            {type: 'bar', stack: 'sum', barWidth: '20%',barGap:"20%"},
            {type: 'bar', stack: 'sum', barWidth: '20%',barGap:"20%"},
            {type: 'bar', stack: 'sum', barWidth: '20%',barGap:"20%"},
            {type: 'bar', stack: 'sum', barWidth: '20%',barGap:"20%"},
        ]
    };
    return option;
}