import React from 'react';
import { Row, Col, Collapse } from 'antd';

import styles from './index.moudle.scss';

const { Panel } = Collapse;

const Layout = ({ Tools, onDrag }) => {
  return (
    <Collapse>
      {Tools.map((item, index) => (
        <Panel header={item.group} key={index}>
          <div className={styles.button}>
            <Row align="middle">
              {item.children.map((item, idx) => {
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
        </Panel>
      ))}
    </Collapse>
  );
};

export default Layout;
