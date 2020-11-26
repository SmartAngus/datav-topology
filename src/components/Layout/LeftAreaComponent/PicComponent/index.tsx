import React, { useState, useEffect } from 'react';
import { Row, Col, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { clientParam } from '../../../data/api';
import styles from './index.module.css';

const Layout = ({ uploaConfig }) => {
  const [list, setList] = useState([]);

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

  const onHandleUpload = ({ file }) => {
    if (file.status === 'done') {
      const url = file.response.data[0];
      getBase64(url, (data: string) => {
        let _data = [...list];
        _data.push({ name: file.name, url: data });
        setList(_data);
      });
    }
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

  return (
    <div className={styles.container}>
      <Row>
        {list.map((item, index) => (
          <Col
            key={index}
            span={12}
            className={styles.colStyle}
            style={{ textAlign: 'center' }}
          >
            <a
              title={item.name}
              draggable
              href="/#"
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
            onChange={onHandleUpload}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Col>
      </Row>
      {/* <div style={{ paddingLeft: 10 }}>
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
          onChange={onHandleUpload}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </div> */}
    </div>
  );
};

export default Layout;
