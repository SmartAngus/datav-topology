import React, { useMemo, useEffect, useState } from 'react';
import {
  Form,
  Tabs,
  Row,
  Col,
  Input,
  Collapse,
  Button,
  Popover,
  Image,
  Upload,
  Checkbox,
} from 'antd';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import MQTTComponent from './MQTTComponent';
import { Topology } from '../../../../topology/core';
import LayoutComponent from './LayoutComponent';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import { canvas } from '../../index';
import { FormProps } from 'antd/lib/form/Form';
import CustomIcon from '../../../config/iconConfig';
import styles from './index.module.scss';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
interface ICanvasProps extends FormProps {
  data?: Topology;
  onFormValueChange?: any;
  onEventValueChange?: any;
}
const BackgroundCanvasProps: React.FC<ICanvasProps> = ({ data }) => {
  const [form] = Form.useForm();
  const { bkColor, bkImage } = data.data;
  const [wsAddress, setWsAddress] = useState(
    'ws://47.96.159.115:51060/ws?token=1NU6lvRQmTVfx4c7ppOFJb'
  );

  useEffect(() => {
    console.log(data);
    form.validateFields(['bkColor', 'bkImage']).then((values) => {});
    // form.validateFields((err, value) => {
    //   if (err) return;
    //   data.clearBkImg();
    //   data.data.bkColor = value.bkColor;
    //   data.data.bkImage = value.bkImage;
    //   data.render();
    //   form.resetFields();
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  /**
   * 渲染位置和大小的表单
   */
  const handleFormValueChange = (changeValues, allValues) => {
    console.log(changeValues);
    for (let k in changeValues) {
      data.data[k] = changeValues[k];
    }
    data.render();
    form.resetFields();
  };

  // const renderForm = useMemo(() => {
  //   const formLayout = {
  //     labelCol: { span: 7 },
  //     wrapperCol: { span: 15 },
  //   };
  //   return (
  //     <Form
  //       {...formLayout}
  //       style={{ marginTop: 10, position: 'relative' }}
  //       onValuesChange={handleFormValueChange}
  //     >
  //       <Row>
  //         <Col span={24}>
  //           <Form.Item name="bkColor" label="背景颜色">
  //             {/* <Input type="color" /> */}
  //             <ColorPicker />
  //           </Form.Item>
  //         </Col>
  //         <Col span={24}>
  //           <Form.Item name="bkImage" label="背景图片">
  //             <TextArea placeholder="请输入图片的地址" />
  //           </Form.Item>
  //         </Col>
  //         <Col span={24}>
  //           <Form.Item label="背景网格">
  //             <Switch
  //               checkedChildren="开"
  //               unCheckedChildren="关"
  //               // checked={gridChecked}
  //               onClick={(e) => {
  //                 canvas.showGrid(e);
  //               }}
  //             />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }, [bkColor, bkImage]);

  // 画布背景图片上传
  const bgUploadChange = ({ file }) => {
    if (file.status === 'done') {
      const url = file.response.data[0];
      console.log(url);
    }
  };

  //
  const bgImgChange = (e) => {
    console.log(e.target.checked);
  };

  // 背景颜色改变
  const colorPickerChange = (val) => {
    data.data['bkColor'] = val;
    data.render();
  };

  // 分辨率Popover
  const resolutionContent = (
    <div>
      <h3>16:9</h3>
      <Row gutter={[0, 16]}>
        <Col span={12}>
          <a href="#">1920*1080</a>
        </Col>
        <Col span={12}>
          <a href="#">1680*1050</a>
        </Col>
        <Col span={12}>
          <a href="#">1600*900</a>
        </Col>
        <Col span={12}>
          <a href="#">1366*768</a>
        </Col>
      </Row>
      <h3>4:3</h3>
      <Row gutter={[0, 16]}>
        <Col span={12}>
          <a href="#">1024*768</a>
        </Col>
        <Col span={12}>
          <a href="#">800*600</a>
        </Col>
      </Row>
      <h3>2:3</h3>
      <Row gutter={[0, 16]}>
        <Col span={12}>
          <a href="#">1280:1920</a>
        </Col>
        <Col span={12}>
          <a href="#">768*1024</a>
        </Col>
        <Col span={12}>
          <a href="#">640*960</a>
        </Col>
        <Col span={12}>
          <a href="#">600*800</a>
        </Col>
      </Row>
    </div>
  );
  const bgSeletedContent = (
    <div>
      <h3>预设图片</h3>
      <Row
        style={{
          border: '1px solid #096DD9',
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Image
          src={require('./bg01.png')}
          preview={false}
          alt="预设背景1"
          width={260}
          height={120}
        />
      </Row>
      <Row
        style={{
          margin: '10px 0',
          border: '1px solid #096DD9',
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Image
          src={require('./bg02.png')}
          preview={false}
          alt="预设背景2"
          width={260}
          height={120}
        />
      </Row>
      <Row>
        <Image
          src={require('./bg03.png')}
          preview={false}
          alt="预设背景3"
          width={260}
          height={120}
        />
      </Row>
    </div>
  );
  const renderDefultOptions = (
    <Collapse defaultActiveKey={['1']} expandIconPosition="right">
      <Panel header="基础属性" key="1">
        <Popover
          placement="bottom"
          trigger="click"
          content={resolutionContent}
          arrowPointAtCenter
        >
          <Input suffix={<DownOutlined />} readOnly />
        </Popover>
        <Row style={{ marginTop: 15 }} gutter={[8, 0]} align="middle">
          <Col span={8}>
            <Input suffix="W" />
          </Col>
          <Col span={8}>
            <Input suffix="H" />
          </Col>
          <Col span={8}>
            <Button icon={<CustomIcon type="icon-heng" />} />
            <Button icon={<CustomIcon type="icon-shu" />} />
          </Col>
        </Row>
      </Panel>
      <Panel header="背景" key="2">
        <Popover
          placement="bottom"
          trigger="click"
          content={bgSeletedContent}
          arrowPointAtCenter
        >
          <Input readOnly suffix={<DownOutlined />} />
        </Popover>
        <Row style={{ marginTop: 15 }} align="middle">
          <Col>背景颜色</Col>
          <Col push={1}>
            <Checkbox />
          </Col>
          <Col push={2}>
            <ColorPicker onChange={colorPickerChange} />
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }} align="middle">
          <Col>背景图片</Col>
          <Col push={1}>
            <Checkbox onChange={bgImgChange} />
          </Col>
          <Col push={2}>
            <Upload
              action="http://qt.test.bicisims.com/api/file/file/uploadReturnPath"
              accept="image/*"
              data={{
                mappingType: 107,
                mappingId: 'ooip6ffe388d487db754b885b8aa65b9',
              }}
              headers={{ token: 'development_of_special_token_by_star_quest' }}
              showUploadList={false}
              onChange={bgUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Col>
        </Row>
      </Panel>
      <Panel header="网格" key="3">
        <Row align="middle">
          <Col>网格</Col>
          <Col push={1}>
            <Checkbox />
          </Col>
          <Col push={2}>
            <ColorPicker onChange={colorPickerChange} />
          </Col>
          <Col push={3} span={8}>
            <Input suffix="px" />
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );

  /**
   * 发起websocket连接
   */

  const onHandleConnectWS = () => {
    canvas.openSocket(wsAddress);

    canvas.socket.socket.onerror=()=>{
       console.log("socket onerror")
    }
    canvas.socket.socket.onopen=()=> {
      console.log("onopen")
      if (canvas.data && canvas.data.pens.length > 0) {
        // 有数据，去遍历有websocket的组件，并订阅
        if(canvas.socket!=undefined){
          (canvas.data.pens||[]).map((node)=>{
            if(node.property?.dataPointParam?.qtDataList?.length>0){
              canvas.socket.socket.send(JSON.stringify(({...node.property.dataPointParam,tid:node.TID,id:node.id})))
            }
          })
        }
      }
    }
    canvas.socket.socket.onmessage=(data)=>{
      console.log("socket onmessage",data.data)
      if (canvas.data && canvas.data.pens.length > 0) {
        // 有数据，去遍历有websocket的组件，并订阅
        if(canvas.socket!=undefined){
          (canvas.data.pens||[]).map((node)=> {
            if (node.property?.dataPointParam?.qtDataList?.length > 0) {
              const r = JSON.parse(data.data)
              if(node.name=='biciVarer'){
                if(node.text!=r.value){
                  node.text=r.value;
                  canvas.updateProps(false)
                }
              }
            }
          })
        }
      }
    }
    // const index = new WebSocket(wsAddress);
    // //打开事件
    // index.onopen = function() {
    //   console.log("Socket 已打开");
    //
    //   index.send(JSON.stringify({
    //     qtDataList: [{id: "6413f3a606754c31987ec584ed56d5b7", type: 2},{id: "b32723eaebfe48aaa0f85970c3a39036", type: 2}],
    //     subscribe: true
    //   }));
    // };
    // //获得消息事件
    // index.onmessage = function(msg) {
    //   console.log("返回消息")
    //   console.log(msg);
    //   //发现消息进入    开始处理前端触发逻辑
    // };
    // //关闭事件
    // index.onclose = function() {
    //   console.log("Socket已关闭");
    // };
    // //发生了错误事件
    // index.onerror = function() {
    //   alert("Socket发生了错误");
    //   //此时可以尝试刷新页面
    // }
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" animated={false}>
        <TabPane tab="图文设置" key="1" style={{ margin: 0 }}>
          {renderDefultOptions}
          <ul className={styles.bottomTip}>
            <li>← ↑ → ↓ ：移动5个像素</li>
            <li>Ctrl + 鼠标点击：多选</li>
            <li>Ctrl + 鼠标滚轮：缩放画布</li>
            <li>Ctrl + ← ↑ → ↓ ：移动1个像素</li>
            <li>Ctrl + 鼠标拖拽空白：移动整个画布</li>
            <li>Shift/Alt + 鼠标拖拽节点：独立拖拽（子）节点</li>
          </ul>
        </TabPane>
        <TabPane tab="消息通信" key="2" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="websocket地址" key="1">
              <TextArea
                placeholder="请输入websocket地址"
                value={wsAddress}
                onChange={(e) => setWsAddress(e.target.value)}
              />
              <Button
                type="primary"
                style={{ width: 265, marginTop: 10 }}
                onClick={() => onHandleConnectWS()}
              >
                测试连接
              </Button>
            </Panel>
            {/* <Panel header="MQTT地址" key="2">
              <MQTTComponent />
            </Panel> */}
          </Collapse>
        </TabPane>
        <TabPane tab="排版布局" key="3" style={{ margin: 0 }}>
          <LayoutComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BackgroundCanvasProps;
