import React from 'react';

const Layout = ({ Tools, onDrag }) => {
  return (
    <div>
      <div className="title">自定义组件</div>
      <div className="button">
        <a
          key={1}
          draggable
          href="/#"
          onDragStart={(ev) => onDrag(ev, {})}
        >
          <i
            className="iconfont icon-triangle"
            style={{ fontSize: 13 }}
          ></i>
        </a>
      </div>
    </div>
  );
};

export default Layout;
