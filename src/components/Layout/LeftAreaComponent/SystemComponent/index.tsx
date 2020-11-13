import React from 'react';
import IndustrialLibraryUpload from '../../../common/IndustrialLibraryUpload'


const Layout = ({ Tools, onDrag }) => {
  return Tools.map((item, index) => (
    <div key={index}>
      <div className="title">{item.group}</div>
      <div className="button">
        {item.children.map((item, idx) => {
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          return (
            <a
              key={idx}
              title={item.name}
              draggable
              href="/#"
              onDragStart={(ev) => onDrag(ev, item)}
            >
              <i className={'iconfont ' + item.icon} style={{ fontSize: 13 }}></i>
            </a>
          );
        })}
        {
            item.group=="自定义图片"? <IndustrialLibraryUpload/> :''
        }
      </div>
    </div>
  ));
};

export default Layout;
