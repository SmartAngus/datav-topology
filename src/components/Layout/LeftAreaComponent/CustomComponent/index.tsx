import React, { useEffect, useState } from 'react'
import { client } from '../../../data/api'

export function getNewComponents (params) {
  return client.post('/applications/customComponent/list', params,{
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      token: '5lpRaFsOnAtHmLXoG9fUbs',
      'Content-Type': 'application/json',
    }
  })
}
const Layout = ({ Tools, onDrag }) => {
  console.log("CustomComponent",Tools)
  const [componentList,setComponentList]=useState([])
  useEffect(()=>{
    getNewComponents({}).then(r=>{
      console.log("r",r)
      setComponentList(r.data.data)
    })
  },[])
  return (
    <div>
      <div className="title">自定义组件</div>
      <div className="button">
        {(componentList||[]).map((item,key)=>{
          return (
            <a
              key={key}
              draggable
              href="/#"
              onDragStart={(ev) => onDrag(ev, JSON.parse(item.componentProperty),true)}
            >
              <i
                className="iconfont icon-triangle"
                style={{ fontSize: 13 }}
              ></i>
              {item.componentName}
            </a>
          )
        })}
      </div>
    </div>
  );
};

export default Layout;
