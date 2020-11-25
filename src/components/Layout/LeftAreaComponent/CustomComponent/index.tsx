import React, { useEffect, useState } from 'react';
import { client, clientParam } from '../../../data/api';

const Layout = ({ Tools, onDrag, combineCom }) => {
  function getNewComponents() {
    return clientParam(combineCom.apiURL).post(
      combineCom.list.url,
      combineCom.list.params,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: combineCom.token,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  // console.log("CustomComponent",Tools)
  const [componentList, setComponentList] = useState([]);
  useEffect(() => {
    getNewComponents().then((r) => {
      console.log('r', r);
      setComponentList(r.data.data);
    });
  }, []);
  return (
    <div>
      <div className="title">自定义组件</div>
      <div className="button">
        {(componentList || []).map((item, index) => {
          return (
            <a
              key={index}
              draggable
              href="/#"
              onDragStart={(ev) =>
                onDrag(ev, JSON.parse(item.componentProperty), true)
              }
            >
              <i
                className="iconfont icon-triangle"
                style={{ fontSize: 13 }}
              ></i>
              {item.componentName}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
