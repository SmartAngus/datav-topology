import React from 'react';
import { Row, Col } from 'antd';

const Layout = ({ Tools, onDrag }) => {
  return Tools.map((item, index) => (
    <div key={index}>
      <div className="title">{item.group}</div>
      <div className="button">
        <Row justify="space-between" align="middle">
          {item.children.map((item, idx) => {
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            return (
              <Col
                span={8}
                key={idx}
                style={{ marginBottom: 20, textAlign: 'center' }}
              >
                <a
                  title={item.name}
                  draggable
                  href="/#"
                  onDragStart={(ev) => onDrag(ev, item)}
                >
                  <i
                    className={'iconfont ' + item.icon}
                    style={{ fontSize: 13 }}
                  ></i>
                  <span
                    style={{
                      marginTop: 5,
                      overflow: 'hidden',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </span>
                </a>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  ));
};

export default Layout;
