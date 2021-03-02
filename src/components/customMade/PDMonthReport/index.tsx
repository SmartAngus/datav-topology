import React, {useEffect, useState} from "react";
import './style.scss'
import {handleRequestError, loginSZGC, maxContentLength, timeout, withCredentials} from "../../data/api";
import axios from "axios";
interface PDMonthReportProp{
    iframe:string;
    dataUrl:string;
    pullRate:number;
}
const PDMonthReport=(props:PDMonthReportProp)=>{
    const {dataUrl}=props;
    const [data,setData]=useState([])
    let interfaceToken='';
    // console.log("pdMonthReport==",dataUrl)
    useEffect(()=>{
        loginSZGC().then((res:string)=>{
            interfaceToken=res;
            fetchData().then((data:any[])=>{
                // let t1 = parseFloat(data[0].value)+parseFloat(data[1].value)+parseFloat(data[2].value);
                // let t2 = parseFloat(data[3].value)+parseFloat(data[4].value)+parseFloat(data[5].value)+parseFloat(data[6].value);
                // // 减去间隔的部分
                // data[0]['percent']=parseInt(parseFloat(data[0].value)/t1*100-1.4+'');
                // data[1]['percent']=parseInt(parseFloat(data[1].value)/t1*100-1.4+'');
                // data[2]['percent']=parseInt(parseFloat(data[2].value)/t1*100-1.4+'');
                //
                // data[3]['percent']=parseInt(parseFloat(data[3].value)/t2*100-1.5+'');
                // if(data[3]['percent']<0){
                //     data[3]['percent']=5;
                // }
                // data[4]['percent']=parseInt(parseFloat(data[4].value)/t2*100-1.5+'');
                // if(data[4]['percent']<0){
                //     data[4]['percent']=5;
                // }
                // data[5]['percent']=parseInt(parseFloat(data[5].value)/t2*100-1.5+'');
                // if(data[5]['percent']<0){
                //     data[5]['percent']=5;
                // }
                // data[6]['percent']=parseInt(parseFloat(data[6].value)/t2*100-1.5+'');
                // if(data[6]['percent']<0){
                //     data[6]['percent']=5;
                // }
                setData(data)

            })
        })
    },[dataUrl])
    const fetchData=()=>{
        return new Promise((resolve,reject)=>{
            if(!dataUrl){
                resolve({front_error:4})
                return;
            }
            const myURL = new URL(dataUrl)
            const ajax = axios.create({baseURL: `${myURL.origin}/`, timeout, maxContentLength,withCredentials})
            ajax.request({
                url:myURL.pathname,//myURL.pathname
                method:'get',
                headers: {
                    token: interfaceToken,
                    'Content-Type': 'application/json',
                },
                data: {
                    firstName: 'Fred'
                },
            }).then(res=>{
                console.log(res.data.code)
                if(res&&res.data.code==1000){
                    resolve(res.data.data)
                }else{
                    resolve({front_error:2})
                }
            }).catch((error)=>{
                handleRequestError(error);
                resolve({front_error:1});
            });
        })
    }
    return (
        <div className="month-report">
            {/*<div className="header">*/}
            {/*    <h3>坯锭收发月报表</h3>*/}
            {/*</div>*/}
            <div className="content">
                <div className="bar-container">
                    <div className="bar-wrapper">
                        <div className="bar-item" style={{width:'55%'}}>
                            <h3>{data[0]?.text}</h3>
                            <div className="bar-chart" style={{backgroundColor:'rgba(45, 65, 181, 0.7)'}}>{data[0]?.value}{data[0]?.unit}</div>
                        </div>
                        <div className="bar-item" style={{width:'14%'}}>
                            <h3>{data[1]?.text}</h3>
                            <div className="bar-chart" style={{backgroundColor:'rgba(65, 117, 5, 0.7)'}}>{data[1]?.value}{data[1]?.unit}</div>
                        </div>
                        <div className="bar-item" style={{width:'27%'}}>
                            <h3>{data[2]?.text}</h3>
                            <div className="bar-chart" style={{backgroundColor:'rgba(65, 117, 5, 0.7)'}}>{data[2]?.value}{data[2]?.unit}</div>
                        </div>
                    </div>
                    <div className="bar-wrapper">
                        <div className="bar-item"  style={{width:'41%'}}>
                            <div className="bar-chart" style={{backgroundColor:'rgba(45, 65, 181, 0.7)'}}>{data[3]?.value}{data[3]?.unit}</div>
                            <h3>{data[3]?.text}</h3>
                        </div>
                        <div className="bar-item"  style={{width:'17%'}}>
                            <div className="bar-chart" style={{backgroundColor:'rgba(156, 25, 25, 0.7)'}}>{data[4]?.value}{data[4]?.unit}</div>
                            <h3>{data[4]?.text}</h3>
                        </div>
                        <div className="bar-item"  style={{width:'16%'}}>
                            <div className="bar-chart" style={{backgroundColor:'rgba(156, 25, 25, 0.7)'}}>{data[5]?.value}{data[5]?.unit}</div>
                            <h3>{data[5]?.text}</h3>
                        </div>
                        <div className="bar-item"  style={{width:'20%'}}>
                            <div className="bar-chart"   style={{borderColor:'red',backgroundColor:'rgba(156, 25, 25, 0.7)'}}>{data[6]?.value}{data[6]?.unit}</div>
                            <h3>{data[6]?.text}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PDMonthReport;
