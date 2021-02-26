import React, {useEffect, useState} from "react";
import './style.scss'
import axios from "axios";
import {handleRequestError, loginSZGC, maxContentLength, timeout, withCredentials} from "../../data/api";

interface ProductQueueProps{
    iframe:string;
    dataUrl:string;
    pullRate:number;
}

const ProductQueue = (props:ProductQueueProps)=>{
    const {dataUrl}=props;
    const [data,setData]=useState([])
    let interfaceToken='';
    console.log("productQueue==",dataUrl)
    useEffect(()=>{
        loginSZGC().then((res:string)=>{
            interfaceToken=res;
            fetchData().then((data:any[])=>{
                console.log("data==",data)
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
            var myURL = new URL(dataUrl)
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
        <div className="product-queue">
            <div className="header">
                <span className="left">产品生产队列</span>
                <span className="right">当前生产&nbsp;&nbsp;&nbsp;&nbsp;550车间</span>
            </div>
            <ul>
                {
                    data.map((item,index)=>{
                        return (
                            <li key={index}>
                                <span className="title">
                                    <p>{item.productName}</p>
                                    <p>{item.ticketNo}</p>
                                </span>
                                <span className="order">排位：{index+1}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
export default ProductQueue;
