import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Row, Col, Upload, Form, message, Collapse } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { clientParam } from '../../../data/api';
import { useClickAway } from 'ahooks';
import CompContextMenu from '../../../common/CompContextMenu';
import styles from './index.module.scss';
import * as _ from 'lodash'

const { Panel } = Collapse;

const Layout = ({ uploaConfig, industrialLibrary }) => {
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
          data.forEach((item: any) => {
            item.name = item.name.substring(0, item.name.lastIndexOf('.'));
            item.type = item.name.substring(item.name.lastIndexOf('.') + 1);
            // getBase64(item.url, (data: string) => {
            //   item.url = item.url;
            // });
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
      dataURL = canvas.toDataURL('image/png');
      return callback ? callback(dataURL) : null;
    };
  }

  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('上传图片不可大于1M');
    }
    return isLt1M;
  };

  const onHandleUpload = ({ file }) => {
    if (file.status === 'done') {
      requstPicList()
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
    if(selectedItem==null){
      message.error('请选择要删除的组件！');
      return;
    }
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
  const scaleWidthHeight=(width:number,height:number,maxSize:number)=>{
    if(width>maxSize && width>height){
      const w=maxSize;
      const h=Math.round(w*height/width);
      return {
        width:w,
        height:h,
      }
    }else {
      const h=maxSize;
      const w=Math.round(h*width/height);
      return {
        width:w,
        height:h,
      }
    }
  }
  const rtnImg=(nImg:any,resolve:any,maxSize:number,img:any)=>{
    const width = nImg.width;
    const height = nImg.height;
    const r=scaleWidthHeight(width,height,maxSize);
    resolve({
      ...img,
      url:img.url+'?_t='+new Date().getTime(),
      width:r.width,
      height:r.height,
    })
  }
  /**
   *
   * @param img
   * @param maxSize
   */
  const fitImageSize = (img:any,maxSize:number=250)=>{
    return new Promise((resolve,reject)=>{
      if(!img.width){// 如果没有图片的宽度
        var nImg = new Image();
        nImg.src = img.url;
        if(img.complete){
          rtnImg(nImg,resolve,maxSize,img)
        }else{
          nImg.onload = function () {
            rtnImg(nImg,resolve,maxSize,img)
          }
        }
      }else if(typeof img==='object'){// 包含图片大小的对象
        if(img.width<=maxSize&&img.height<=maxSize){
          resolve({
            ...img,
          })
        }else if(img.width>maxSize&&img.width>img.height){
          const width=maxSize;
          const height=width*img.height/img.width;
          resolve({
            ...img,
            width,
            height,
          })
        }else {
          const height=maxSize;
          const width=height*img.width/img.height;
          resolve({
            ...img,
            width,
            height,
          })
        }
      }
    })
  }

  const onDrag = (event, item: any) => {
    if(!item.width){
      console.log(item)
      event.dataTransfer.setData(
          'Text',
          JSON.stringify({
            name: 'image',
            rect: {
              width: 150,
              height: 150,
            },
            image: item.url
          })
      );
      return;
    }
    const eventClone=_.cloneDeep(event)
    fitImageSize(item).then((r:any)=>{
      eventClone.dataTransfer.setData(
          'Text',
          JSON.stringify({
            name: 'image',
            rect: {
              width: r.width,
              height: r.height,
            },
            image: r.url
          })
      );
    })

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
      <Collapse defaultActiveKey={['1']}>
        <Panel header="工业图库" key="1">
          <Row>
            {industrialLibrary?.map((item, index) => (
              <Col
                key={index}
                span={8}
                className={styles.colStyle}
                style={{ textAlign: 'center' }}
              >
                <a
                  title={item.name}
                  draggable
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  onDragStart={(ev) => onDrag(ev, item)}
                >
                  <img
                    alt={item.name}
                    src={item.url}
                    style={{height: 60, width: 60 }}
                  />
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
            ))}
          </Row>
        </Panel>
        <Panel header="自定义上传" key="2">
          <Row>
            {list?.map((item, index) => (
              <Col
                key={index}
                span={8}
                className={styles.colStyle}
                style={{ textAlign: 'center' }}
                onContextMenu={(event) => handleContextMenu(event, item)}
              >
                <a
                  title={item.name}
                  draggable
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  onDragStart={(ev) => onDrag(ev, item)}
                >
                  <img
                    alt={item.name}
                    src={item.url}
                    style={{ width: 60, height: 60 }}
                  />
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
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Col>
          </Row>
        </Panel>
      </Collapse>

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
