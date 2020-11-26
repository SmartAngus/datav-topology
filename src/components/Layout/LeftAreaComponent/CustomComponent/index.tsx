import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { clientParam } from '../../../data/api';
import { Row, Col, Form, message } from 'antd';
import { useClickAway } from 'ahooks';
import CompContextMenu from '../../../common/CompContextMenu';

const Layout = ({ Tools, onDrag, combineCom }) => {
  const [formRef] = Form.useForm();
  // 是否显示右键菜单
  const [showContextmenu, setShowContextmenu] = useState(false);

  const [contextmenu, setContextmenu] = useState({
    position: 'fixed',
    zIndex: '10',
    display: 'none',
    left: '',
    top: '',
    bottom: '',
  });
  const [selectedCom, setSelectedCom] = useState(null);
  const contextMenuRef = useRef();
  useClickAway(() => {
    setShowContextmenu(false);
  }, contextMenuRef);
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

  const handleDelete = () => {
    clientParam(combineCom.apiURL)
      .post(combineCom.delete.url, selectedCom, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: combineCom.token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        message.success('删除组件成功！');
        getNewComponents().then((r) => {
          setComponentList(r.data.data);
        });
      });
  };

  const [componentList, setComponentList] = useState([]);
  useEffect(() => {
    getNewComponents().then((r) => {
      setComponentList(r.data.data);
    });
  }, []);
  // 右键菜单
  const handleContextMenu = (event, item: any) => {
    setShowContextmenu(!showContextmenu);
    setSelectedCom(item);
    event.preventDefault();
    event.stopPropagation();
    if (event.clientY + 360 < document.body.clientHeight) {
      setContextmenu({
        position: 'fixed',
        zIndex: '10',
        display: 'block',
        left: event.clientX + 'px',
        top: event.clientY + 'px',
        bottom: '',
      });
    } else {
      setContextmenu({
        position: 'fixed',
        zIndex: '10',
        display: 'block',
        left: event.clientX + 'px',
        top: '',
        bottom: document.body.clientHeight - event.clientY + 'px',
      });
    }
  };

  // 确定重命名
  const handleOk = () => {
    onCheck();
  };
  const onCheck = async () => {
    try {
      const values = await formRef.validateFields(['componentName']);
      const newCom = {
        ...selectedCom,
        componentName: values.componentName,
      };
      clientParam(combineCom.apiURL)
        .post(combineCom.rename.url, newCom, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            token: combineCom.token,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          message.success('重命名组件成功！');
          getNewComponents().then((r) => {
            setComponentList(r.data.data);
          });
        });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div>
      <div className="title">自定义组件</div>
      <div className="button">
        <Row align="middle">
          {(componentList || []).map((item, key) => {
            return (
              <Col
                key={key}
                span={8}
                style={{
                  marginBottom: 20,
                  textAlign: 'center',
                }}
                onContextMenu={(event) => handleContextMenu(event, item)}
              >
                <a
                  draggable
                  href="/#"
                  title={item.componentName}
                  onDragStart={(ev) =>
                    onDrag(ev, JSON.parse(item.componentProperty), true)
                  }
                >
                  <i
                    className="iconfont icon-triangle"
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
                    {item.componentName}
                  </span>
                </a>
              </Col>
            );
          })}
        </Row>
      </div>

      <CompContextMenu
        contextMenuRef={contextMenuRef}
        showContextmenu={showContextmenu}
        contextmenu={contextmenu as CSSProperties}
        name={selectedCom?.componentName}
        form={formRef}
        handleOk={handleOk}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Layout;
