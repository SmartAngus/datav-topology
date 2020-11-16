import React, { useMemo, useEffect, useState } from 'react';
import { Form, Tabs, Row, Col, Input, Collapse, Button, Switch } from 'antd';
import './index.css';
import MQTTComponent from './MQTTComponent';
import LayoutComponent from './LayoutComponent';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import { canvas } from '../../index';
import { FormProps } from 'antd/lib/form/Form';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
interface ICanvasProps extends FormProps {
  data?: any;
  onFormValueChange?: any;
  onEventValueChange?: any;
}
const BackgroundCanvasProps: React.FC<ICanvasProps> = ({ data }) => {
  const [form] = Form.useForm();
  const [gridChecked, setGridChecked] = useState(false);
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

  const renderForm = useMemo(() => {
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        {...formLayout}
        style={{ marginTop: 10, position: 'relative' }}
        onValuesChange={handleFormValueChange}
      >
        <Row>
          <Col span={24}>
            <Form.Item name="bkColor" label="背景颜色">
              {/* <Input type="color" /> */}
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="bkImage" label="背景图片">
              <TextArea placeholder="请输入图片的地址" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="背景网格">
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                // checked={gridChecked}
                onClick={(e) => {
                  canvas.showGrid(e);
                  setGridChecked(e);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [bkColor, bkImage]);

  /**
   * 发起websocket连接
   */

  const onHandleConnectWS = () => {
    canvas.openSocket(wsAddress);
    // console.log("onHandleConnectWS",wsAddress)
    canvas.socket.socket.onmessage=(data)=>{
      // console.log("socket onmessage",data.data)
    }
    canvas.socket.socket.onopen=()=>{
      // console.log("socket open")
      canvas.socket.socket.send(JSON.stringify({
            qtDataList: [{id: "6413f3a606754c31987ec584ed56d5b7", type: 2},{id: "b32723eaebfe48aaa0f85970c3a39036", type: 2}],
            subscribe: true
      }))}
    canvas.socket.socket.onerror=()=>{
      // console.log("socket onerror")
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
    <div className="rightArea">
      <Tabs defaultActiveKey="1" animated={false}>
        <TabPane
          tab="图文设置"
          key="1"
          style={{ margin: 0, position: 'relative' }}
        >
          {renderForm}
          <ul className="bottomTip">
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
