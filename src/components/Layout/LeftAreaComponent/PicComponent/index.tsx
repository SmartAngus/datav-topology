import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Row, Col, Upload, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { clientParam } from '../../../data/api';
import { useClickAway } from 'ahooks';
import CompContextMenu from '../../../common/CompContextMenu';
import styles from './index.module.scss';

const Layout = ({ uploaConfig }) => {
  const [formRef] = Form.useForm();
  // 是否显示右键菜单
  const [showContextmenu, setShowContextmenu] = useState(false);
  const [list, setList] = useState([]);
  const [contextmenu, setContextmenu] = useState({
    position: 'fixed',
    zIndex: '10',
    display: 'none',
    left: '',
    top: '',
    bottom: '',
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const contextMenuRef = useRef();
  useClickAway(() => {
    setShowContextmenu(false);
  }, contextMenuRef);

  useEffect(() => {
    requstPicList();
  }, [uploaConfig.self]);

  // 请求获取图片列表
  const requstPicList = () => {
    clientParam(uploaConfig.self.baseURL)
      .post(uploaConfig.self.apiUrl.list, uploaConfig.self.data, {
        headers: {
          token: uploaConfig.self.token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        const data = res.data.data;
        if (data) {
          data.map((item: any) => {
            item.name = item.name.substring(0, item.name.lastIndexOf('.'));
            item.type = item.name.substring(item.name.lastIndexOf('.') + 1);
            getBase64(item.url, (data: string) => {
              item.url = data;
            });
          });
        }
        setList(data);
      });
  };

  function getBase64(url: string, callback: Function) {
    let Img = new Image();
    let dataURL = '';
    Img.src = url + '?v=' + Math.random();
    Img.setAttribute('crossOrigin', 'Anonymous');
    Img.onload = function () {
      let canvas = document.createElement('canvas');
      let width = Img.width;
      let height = Img.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
      dataURL = canvas.toDataURL('image/jpeg');
      return callback ? callback(dataURL) : null;
    };
  }

  const beforeUpload = (file) => {
    const isLt512K = file.size / 1024 / 1024 < 1;
    if (!isLt512K) {
      message.error('上传图片不可大于1M');
    }
    return isLt512K;
  };

  const onHandleUpload = ({ file }) => {
    if (file.status === 'done') {
      const url = file.response.data[0];
      getBase64(url, (data: string) => {
        let _data = [...list];
        _data.unshift({ name: file.name, url: data });
        setList(_data);
      });
    }
  };
  // 确定重命名
  const handleOk = async () => {
    try {
      const values = await formRef.validateFields(['componentName']);
      clientParam(uploaConfig.baseURL)
        .post(
          uploaConfig.self.apiUrl.update,
          {
            id: selectedItem.id,
            name: values.componentName + '.' + selectedItem.type,
          },
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              token: uploaConfig.self.token,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          message.success('重命名成功！');
          requstPicList();
        });
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  const handleDelete = () => {
    clientParam(uploaConfig.baseURL)
      .get(uploaConfig.self.apiUrl.delete, {
        headers: {
          token: uploaConfig.self.token,
        },
        params: {
          id: selectedItem?.id,
        },
      })
      .then((res) => {
        message.success('删除组件成功！');
        requstPicList();
      });
  };

  const onDrag = (event, image: string) => {
    event.dataTransfer.setData(
      'Text',
      JSON.stringify({
        name: 'image',
        rect: {
          width: 100,
          height: 100,
        },
        image,
      })
    );
  };

  // 右键菜单
  const handleContextMenu = (event, item: any) => {
    setShowContextmenu(!showContextmenu);
    setSelectedItem(item);
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

  return (
    <div className={styles.container}>
      <Row>
        {list?.map((item, index) => (
          <Col
            key={index}
            span={12}
            className={styles.colStyle}
            style={{ textAlign: 'center' }}
            onContextMenu={(event) => handleContextMenu(event, item)}
          >
            <a
              title={item.name}
              draggable
              href="#"
              onClick={(e) => e.preventDefault()}
              onDragStart={(ev) => onDrag(ev, item.url)}
            >
              <img
                alt={item.name}
                src={item.url}
                style={{ width: 100, height: 100 }}
              />
              <span
                style={{
                  marginTop: 5,
                  marginLeft: 8,
                  width: 100,
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
        ))}
        <Col
          key="upload"
          span={12}
          className={styles.colStyle}
          style={{ textAlign: 'center' }}
        >
          <Upload
            listType="picture-card"
            showUploadList={false}
            action={`${uploaConfig.self.baseURL}${uploaConfig.self.url}`}
            accept="image/*"
            data={{
              mappingType: uploaConfig.self.data.mappingType,
              mappingId: uploaConfig.self.data.mappingId,
            }}
            headers={{
              token: uploaConfig.self.token,
            }}
            beforeUpload={beforeUpload}
            onChange={onHandleUpload}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Col>
      </Row>
      <CompContextMenu
        contextMenuRef={contextMenuRef}
        showContextmenu={showContextmenu}
        contextmenu={contextmenu as CSSProperties}
        name={selectedItem?.name}
        form={formRef}
        handleOk={handleOk}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Layout;
