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
  Switch,
} from 'antd';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import MQTTComponent from './MQTTComponent';
import { Topology } from '../../../../topology/core';
import LayoutComponent from './LayoutComponent';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import ReactSwitch from '../../../common/ReactSwitch';
import { canvas } from '../../index';
import { FormProps } from 'antd/lib/form/Form';
import CustomIcon from '../../../config/iconConfig';
import styles from './index.module.scss';
import { dynamicWebSocketData } from '../../../common/DynamicWebSocketData';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { calcCanvas, getHexColor } from '../../../utils/cacl';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const panelSizeObj = {
  '16:9': ['1920*1080', '1680*1050', '1600*900', '1366*768'],
  '4:3': ['1024*768', '800*600'],
  '2:3': ['1280:1920', '768*1024', '640*960', '600*800'],
};

interface ICanvasProps extends FormProps {
  data?: Topology;
  baseUrl?: string;
  onFormValueChange?: any;
  onEventValueChange?: any;
  websocketConf?: any;
  preInstallBgImages?: any;
  svgRef?: any;
  canvasRef?: any;
  onChangeCanvasSize?: (sizeInfo: any) => void;
  onChangeBkImage?: (imageUrl: string) => void;
}
const BackgroundCanvasProps: React.FC<ICanvasProps> = ({
  data,
  baseUrl,
  onChangeCanvasSize,
  onChangeBkImage,
  websocketConf,
  ...props
}) => {
  const [form] = Form.useForm();
  const [rcSwitchState, setRcSwitchState] = useState(
    data.canvas.width > data.canvas.height ? false : true
  ); // 页面布局切换
  // 控制Popover的显示隐藏
  const [popoverVisible, setPopoverVisible] = useState({
    resolution: false, // 分辨率
    bgSelect: false, // 预设背景选择
  });
  const [wsAddress, setWsAddress] = useState(websocketConf.url);

  useEffect(() => {
    console.log('canvas>>>', canvas);
    // 回显数值
    const w = data.canvas.width;
    const h = data.canvas.height;
    const bgColor = data.data.bkColor;
    const bkImage = data.data.bkImage;
    form.setFieldsValue({
      sizeVal: `预设·${w}*${h}`,
      w,
      h,
      bgColor,
      bgColorCheck: bgColor ? true : false,
      bgImgCheck: bkImage ? true : false,
      gridCheck: data.data.grid ? data.data.grid : false,
      gridSize: data.data.gridSize,
      gridColor: data.data.gridColor,
    });
  }, [form]);

  /**
   * 渲染位置和大小的表单
   */
  const handleFormValueChange = (changeValues, allValues) => {
    console.log('handleFormValueChange>>>', changeValues);
    console.log('allValues>>>', allValues);
    if (changeValues.gridSize) {
      const gridSize = parseInt(changeValues.gridSize);
      data.data['gridSize'] = gridSize;
      canvas.createGrid(true);
      if (data.data.grid) {
        canvas.showGrid(true);
      }
    } else if (changeValues.gridColor) {
      data.data['gridColor'] = changeValues.gridColor;
      canvas.createGrid(true);
      if (data.data.grid) {
        canvas.showGrid(true);
      }
    }
    // for (let k in changeValues) {
    //   data.data[k] = changeValues[k];
    // }
    // data.render();
    // form.resetFields();
  };

  // 背景图片checkbox切换
  const handleBgImgChange = () => {};

  // 画布背景图片上传
  const bgUploadChange = ({ file }) => {
    if (file.status === 'done') {
      const url = file.response.data[0];
      console.log(url);
    }
  };

  // 设置背景图片
  const selectedBgImg = (url: string) => {
    // TODO: 设置背景图片
    // 修改背景图片前，需要先canvas.clearBkImg清空旧图片
    canvas.clearBkImg();
    data.data['bkImage']=url;
    console.log(data.data['bkImage'])
    setPopoverVisible({ ...popoverVisible, bgSelect: false });
    onChangeBkImage && onChangeBkImage(url);
  };

  // 背景颜色改变
  const colorPickerChange = (val: string) => {
    data.data['bkColor'] = val;
    data.render();
  };

  // 网格选择切换
  const gridOnChange = (e: CheckboxChangeEvent) => {
    canvas.showGrid(e.target.checked);
  };

  // 设置宽高
  const panelSizeChange = () => {
    const { w, h } = form.getFieldsValue(['w', 'h']);
    data.resize({ width: w, height: h });
  };

  // 画布布局切换
  const handleRCSwitchStateChange = () => {
    setRcSwitchState(!rcSwitchState);
    // 宽高互换
    const width = data.canvas.height;
    const height = data.canvas.width;
    const r = calcCanvas(width, height);
    data.resize({ width, height });
    onChangeCanvasSize && onChangeCanvasSize({ ...r, width, height });
  };

  // 选择画布大小后重新渲染画布
  const selectedResolution = (size: string) => {
    const width = +size.split('*')[0];
    const height = +size.split('*')[1];
    data.resize({ width, height });
    form.setFieldsValue({ w: width, h: height });
    // 隐藏Popover
    setPopoverVisible({ ...popoverVisible, resolution: false });
    const r = calcCanvas(width, height);
    data.resize({ width, height });
    onChangeCanvasSize && onChangeCanvasSize({ ...r, width, height });
  };

  // 分辨率Popover
  const resolutionContent = useMemo(() => {
    return (
      <div>
        {Object.keys(panelSizeObj).map((key: string, index: number) => {
          return (
            <div key={index}>
              <h3>{key}</h3>
              <Row gutter={[0, 16]}>
                {panelSizeObj[key].map((val: string, index: number) => {
                  return (
                    <Col span={12} key={index}>
                      <a href="#" onClick={() => selectedResolution(val)}>
                        {val}
                      </a>
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}
      </div>
    );
  }, [panelSizeObj]);
  const bgSeletedContent = (
    <div>
      <h3>预设图片</h3>
      {(props.preInstallBgImages || []).map((item) => {
        return (
          <Row
            key={item.key}
            style={{
              border: '1px solid #096DD9',
              boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
            }}
            onClick={() => selectedBgImg(item.img)}
          >
            <Image
              src={item.img}
              preview={false}
              alt={`预设背景${item}`}
              width={260}
              height={120}
            />
          </Row>
        );
      })}
    </div>
  );

  const renderDefultOptions = (
    <Collapse defaultActiveKey={['1']} expandIconPosition="right">
      <Panel header="基础属性" key="1">
        <Form form={form}>
          <Popover
            placement="bottom"
            trigger="click"
            content={resolutionContent}
            visible={popoverVisible.resolution}
            onVisibleChange={(visible) =>
              setPopoverVisible({ ...popoverVisible, resolution: visible })
            }
            getPopupContainer={() => document.querySelector('#layout')}
            arrowPointAtCenter
          >
            <Form.Item name="sizeVal" initialValue="自定义">
              <Input suffix={<DownOutlined />} readOnly />
            </Form.Item>
          </Popover>

          <Row style={{ marginTop: 15 }} gutter={[8, 0]} align="middle">
            <Col span={8}>
              <Form.Item name="w">
                <Input suffix="W" onChange={panelSizeChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="h">
                <Input suffix="H" onChange={panelSizeChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <ReactSwitch
                  onChange={handleRCSwitchStateChange}
                  checked={rcSwitchState}
                  offHandleColor="#096DD9"
                  onHandleColor="#096DD9"
                  offColor="#ccc"
                  onColor="#ccc"
                  uncheckedIcon={
                    <CustomIcon style={{ lineHeight: 2 }} type="icon-shu" />
                  }
                  checkedIcon={
                    <CustomIcon style={{ lineHeight: 2 }} type="icon-heng" />
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
      <Panel header="背景" key="2">
        <Form form={form}>
          <Popover
            placement="bottom"
            trigger="click"
            content={bgSeletedContent}
            arrowPointAtCenter
            visible={popoverVisible.bgSelect}
            onVisibleChange={(visible) =>
              setPopoverVisible({ ...popoverVisible, bgSelect: visible })
            }
            getPopupContainer={() => document.querySelector('#layout')}
            arrowContent
          >
            <Form.Item name="bgVal" initialValue="预设背景">
              <Input readOnly suffix={<DownOutlined />} />
            </Form.Item>
          </Popover>

          <Row style={{ marginTop: 15 }} align="middle">
            <Col push={1}>
              <Form.Item
                name="bgColorCheck"
                label="背景颜色"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item name="bgColor">
                <ColorPicker onChange={colorPickerChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col push={1}>
              <Form.Item
                name="bgImgCheck"
                label="背景图片"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item>
                <Upload
                  action={`${baseUrl}/api/file/file/uploadReturnPath`}
                  accept="image/*"
                  data={{
                    mappingType: 107,
                    mappingId: 'ooip6ffe388d487db754b885b8aa65b9',
                  }}
                  headers={{
                    token: 'development_of_special_token_by_star_quest',
                  }}
                  showUploadList={false}
                  onChange={bgUploadChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
      <Panel header="网格" key="3">
        <Form form={form}>
          <Row align="middle">
            <Col push={1}>
              <Form.Item name="gridCheck" label="网格" valuePropName="checked">
                <Checkbox onChange={gridOnChange} />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item name="gridColor">
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col push={3} span={8}>
              <Form.Item name="gridSize">
                <Input suffix="px" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );

  /**
   * 发起websocket连接
   */

  const onHandleConnectWS = () => {
    canvas.openSocket(wsAddress);
    // 将绑定获得wenbsocket数据
    dynamicWebSocketData();

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
      <Tabs defaultActiveKey="1" centered>
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
          </Collapse>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BackgroundCanvasProps;
