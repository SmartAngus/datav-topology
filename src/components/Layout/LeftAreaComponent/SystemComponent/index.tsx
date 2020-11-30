import React from 'react';
import { Row, Col, Collapse } from 'antd';

import styles from '../../index.module.scss';
import CustomIcon from '../../../config/iconConfig';

const { Panel } = Collapse;

const Layout = ({ Tools, onDrag }) => {
  return (
    <Collapse defaultActiveKey={['0']}>
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
                      href="javascript:void(0);"
                      onDragStart={(ev) => onDrag(ev, item)}
                    >
                      <CustomIcon type={item.icon} style={{ fontSize: 28 }} />
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
