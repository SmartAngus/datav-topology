import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { clientParam } from '../../../data/api';
import { Row, Col, Modal, Form, Input, message } from 'antd'
import { useClickAway } from 'ahooks'
import styles from './index.module.scss'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Layout = ({ Tools, onDrag, combineCom }) => {
  const [visible,setVisible]=useState(false)
  const [formRef] = Form.useForm()
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
  const [selectedCom,setSelectedCom]=useState(null)
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
  const onDelete=()=>{
    confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除当前组件吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        clientParam(combineCom.apiURL).post(combineCom.delete.url, selectedCom,{
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            token: combineCom.token,
            'Content-Type': 'application/json',
          }
        }).then(res=>{
          message.success("删除组件成功！")
          getNewComponents().then((r) => {
            setComponentList(r.data.data);
          });
        })
      },
      onCancel() {

      },
    });
  }
  const onRename=()=>{
    setVisible(true)
    formRef.setFieldsValue({componentName: selectedCom.componentName})
  }

  const [componentList, setComponentList] = useState([]);
  useEffect(() => {
    getNewComponents().then((r) => {
      setComponentList(r.data.data);
    });
  }, []);
  // 右键菜单
  const handleContextMenu = (event,item:any) => {
    setShowContextmenu(!showContextmenu);
    setSelectedCom(item)
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
  const renderContextMenu = (
    <div style={contextmenu as CSSProperties} ref={contextMenuRef}>
      <div className={styles.menus} style={{display:showContextmenu?'block':'none'}}>
        <div>
          <a onClick={onRename}>重命名</a>
        </div>
        <div>
          <a  onClick={onDelete}>删除</a>
        </div>
      </div>
    </div>
  );
  // 确定重命名
  const handleOk=()=>{
    onCheck()
  }
  const handleCancel=()=>{
    setVisible(false)
  }
  const onCheck = async () => {
    try {
      const values = await formRef.validateFields(['componentName']);
      const newCom = {
        ...selectedCom,
        componentName:values.componentName
      }
      clientParam(combineCom.apiURL).post(combineCom.rename.url, newCom,{
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: combineCom.token,
          'Content-Type': 'application/json',
        }
      }).then(res=>{
        setVisible(false)
        message.success("重命名组件成功！")
        getNewComponents().then((r) => {
          setComponentList(r.data.data);
        });
      })

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const renderNewComponentModal=(
    <Modal
      title="重命名组合节点"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText="确定"
      cancelText="取消"

    >
      <Form form={formRef}>
        <Form.Item rules={[
          {
            required: true,
            message: '请输入组件名称',
          },
          {
            max: 20,
            message: '最长为20个字符',
          },
          {
            min: 2,
            message: '不低于2个字符',
          }
        ]} label="组件名字" name="componentName">
          <Input placeholder="输入组件名字" id="componentName" />
        </Form.Item>
      </Form>
    </Modal>
  );
  return (
    <div>
      <div className="title">自定义组件</div>
      <div className="button">
        <Row>
        {(componentList || []).map((item, key) => {
          return (
            <Col key={key} span={8} style={{
              textAlign:"center",
              overflow:"hidden",
              textOverflow:"ellipsis",
              wordBreak:"break-all",
              whiteSpace:"nowrap"
            }} onContextMenu={(event)=>handleContextMenu(event,item)}>
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
              >{item.componentName}</span>
            </a>
            </Col>
          );
        })}
        </Row>
      </div>
      {renderContextMenu}
      {renderNewComponentModal}
    </div>
  );
};

export default Layout;
