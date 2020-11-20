import React, { useMemo, useEffect, useState, Fragment } from 'react';
import {
  Form,
  InputNumber,
  Tabs,
  Collapse,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Checkbox,
  Button,
  Space,
  Modal,
  Tooltip,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
// import AnimateComponent from './AnimateComponent';
import EventComponent from './EventComponent';
import { FormProps } from 'antd/lib/form/Form';
import './index.css';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import { canvas } from '../../index';
import { alignNodes } from '../../../../topology/layout/src/align';
import AnimateComponent from './AnimateComponent';
import DataPointTable from '../../../common/DataPointTable';
import CustomIcon from '../../../config/iconConfig';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import DataBindModal from '../../../FilterDataPoint';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
// 对齐方式 key 对齐方式 val 图标名称
const alignObj = {
  left: ['左对齐', 'icon-zuoduiqi'],
  right: ['右对齐', 'icon-youduiqi'],
  top: ['顶部对齐', 'icon-dingbuduiqi'],
  bottom: ['底部对齐', 'icon-dibuduiqi'],
  center: ['垂直居中', 'icon-chuizhijuzhong'],
  middle: ['水平居中', 'icon-shuipingjuzhong'],
};

interface ICanvasProps extends FormProps {
  data?: any;
  onFormValueChange?: any;
  onPropertyFormValueChange?: any;
  onEventValueChange: any;
}

const NodeCanvasProps: React.FC<ICanvasProps> = ({
  data,
  onFormValueChange,
  onEventValueChange,
  onPropertyFormValueChange,
}) => {
  const [form] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkObj, setCheckObj] = useState({
    fill: data.node['fillStyle'] !== '', // 填充颜色checkbox
    border: data.node['strokeStyle'] !== '#222' || data.node['lineWidth'] !== 1, // 边框颜色checkbox
  });

  const { x, y, width, height } = data?.node?.rect || {};
  const { rotate, lineWidth, strokeStyle, dash, text, id, name, fillStyle } =
    data?.node || {};
  const { color, fontSize, fontFamily } = data?.node?.font || {};
  const { property } = data?.node;
  const extraFields = data.node.data; // 用户自定义数据片段
  const { dataMethod, dataDot } = property || {};
  useEffect(() => {
    form.setFieldsValue({
      x,
      y,
      width,
      height,
      rotate,
      lineWidth,
      strokeStyle,
      dash,
      color,
      fontSize,
      fontFamily,
      text,
    });
  }, [
    x,
    y,
    width,
    height,
    rotate,
    text,
    lineWidth,
    strokeStyle,
    dash,
    color,
    fontSize,
    fontFamily,
    text,
  ]);
  useEffect(() => {
    propertyForm.setFieldsValue({
      dataMethod,
      dataDot,
    });
    console.log('property====', data);
  }, [property]);

  // 字段值更新时触发的回掉
  const handleValuesChange = (changedValues, allValues) => {
    onFormValueChange && onFormValueChange(allValues);
  };
  const handlePropertyValuesChange = (changedValues, allValues) => {
    // console.log('allValues', allValues);
    onPropertyFormValueChange && onPropertyFormValueChange(allValues);
  };
  //

  // 设置对齐方式
  const handleAlign = (key: string) => {
    const pens = canvas.activeLayer.pens;
    const rect = canvas.activeLayer.rect;
    console.log(canvas);
    if (pens.length >= 2) {
      alignNodes(pens, rect, key);
      canvas.render();
    }
  };
  // 设置日期格式
  const onSetBiciTimerDataFmt = () => {};
  // 数据绑定方式
  const handlePropertyDataMethodChange = (value) => {};
  const handleOk = () => {
    setVisible(false);
    setLoading(false);
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };
  // 添加数据点
  const addDataPoint = () => {
    setVisible(!visible);
  };
  const handleSelectedDataPoint = (selectedPointIds) => {
    for (let k in selectedPointIds) {
      data.node.property.dataPointParam.qtDataList.push({
        id: selectedPointIds[k],
        type: 2,
      });
    }
  };
  const onDataPointBind = (selectedRowKeys, selectedRows) => {
    console.log('onDataPointBind');
    console.log(selectedRowKeys, selectedRows);
  };
  // 渲染数据点弹出窗口 不包含 disableSource:['react','complex','dataPoint]
  const renderDataPointModal = () => {
    return (
      <DataBindModal
        visible={visible}
        disableSource={['react']}
        selectedRows={[]}
        onCancel={addDataPoint}
        onGetSelectRow={onDataPointBind}
      ></DataBindModal>
    );
  };
  /**
   * 渲染位置和大小的表单
   */
  const renderPositionForm = useMemo(() => {
    return (
      <Panel header="位置和大小" key="pos">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Row>
            <Col span={14}>
              <Form.Item name="x" label="位置">
                <Input suffix="X" />
              </Form.Item>
            </Col>
            <Col span={9} push={1}>
              <Form.Item name="y">
                <Input suffix="Y" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="width" label="宽高">
                <Input suffix="W" />
              </Form.Item>
            </Col>
            <Col span={9} push={1}>
              <Form.Item name="height">
                <Input suffix="H" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="rotate" label="旋转角度">
                <Input suffix="°" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [x, y, width, height, rotate]);

  const fillColorCheckboxChange = (e: CheckboxChangeEvent) => {
    data.node['fillStyle'] = e.target.checked
      ? form.getFieldValue('fillStyle')
      : '';
    setCheckObj({ ...checkObj, fill: e.target.checked });
    canvas.updateProps(data.node);
  };
  /**
   * 渲染填充样式
   */
  const renderFillStyle = useMemo(() => {
    return (
      <Panel header="填充" key="fill">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Row align="middle">
            <Col span={8}>
              <Form.Item label="颜色" labelCol={{ span: 16 }} labelAlign="left">
                <Checkbox onChange={fillColorCheckboxChange} />
              </Form.Item>
            </Col>
            <Col push={1}>
              <Form.Item name="fillStyle">
                <ColorPicker disabled={!checkObj.fill} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [fillStyle]);

  const borderColorCheckboxChange = (e: CheckboxChangeEvent) => {
    data.node['strokeStyle'] = e.target.checked
      ? form.getFieldValue('strokeStyle')
      : '#222';
    data.node['lineWidth'] = e.target.checked
      ? form.getFieldValue('lineWidth')
      : 1;
    setCheckObj({ ...checkObj, border: e.target.checked });
    canvas.updateProps(data.node);
  };

  /**
   * 渲染边框样式
   */
  const renderBorderStyle = useMemo(() => {
    return (
      <Panel header="边框" key="border">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Row align="middle">
            <Col span={8}>
              <Form.Item label="颜色" labelCol={{ span: 16 }} labelAlign="left">
                <Checkbox
                  onChange={borderColorCheckboxChange}
                  checked={checkObj.border}
                />
              </Form.Item>
            </Col>
            <Col span={6} push={1}>
              <Form.Item name="strokeStyle">
                <ColorPicker disabled={!checkObj.border} />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item name="lineWidth" initialValue={1}>
                <InputNumber disabled={!checkObj.border} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [strokeStyle, lineWidth, checkObj.border]);

  /**
   * 渲染字体的表单
   */
  const renderFontForm = useMemo(() => {
    return (
      <Panel header="文字" key="font">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Col span={24}>
            <Form.Item name="color" label="颜色">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="fontFamily" label="字体">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="fontSize" label="大小">
              <InputNumber />
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item name="text" label="内容">
              <TextArea />
            </Form.Item>
          </Col> */}
        </Form>
      </Panel>
    );
  }, [color, fontFamily, fontSize, text]);

  /**
   * 渲染元素本身数据
   */
  const renderDataForm = useMemo(() => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Form {...formItemLayout}>
        <Col>
          <Form.Item label="ID">
            <span className="ant-form-text">
              <Tag color="#f50">{id}</Tag>
            </span>
          </Form.Item>
        </Col>
      </Form>
    );
  }, [id]);
  /**
   * 渲染时间组件的属性设置
   */
  const renderBiciTimerDataForm = useMemo(() => {
    return (
      <Panel header="时间格式" key="biciTimer">
        <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
          <Row>
            <Col span={10}>
              <Form.Item
                name="date.show"
                valuePropName="checked"
                label="日期"
                labelCol={{ span: 14 }}
                labelAlign="left"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="date.format" rules={[{ required: true }]}>
                <Select
                  placeholder="设置日期格式"
                  onChange={onSetBiciTimerDataFmt}
                  allowClear
                >
                  <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                name="time.show"
                valuePropName="checked"
                label="时间"
                labelCol={{ span: 14 }}
                labelAlign="left"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="time.format" rules={[{ required: true }]}>
                <Select
                  placeholder="设置时间格式"
                  onChange={onSetBiciTimerDataFmt}
                  allowClear
                >
                  <Option value="hh：mm：ss">hh：mm：ss</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [property]);

  /**
   * 渲染元素额外数据 {"qtDataList":[{"id":"6413f3a606754c31987ec584ed56d5b7","type":2}],"subscribe":true,"page":"动态曲线"}
   */
  const renderExtraDataForm = useMemo(() => {
    return (
      <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
        <Col>
          <Form.Item
            name="dataMethod"
            label="数据传入方式"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="选择"
              onChange={handlePropertyDataMethodChange}
              allowClear
            >
              <Option value="male">绑定数据点</Option>
              <Option value="female">接口传入</Option>
            </Select>
          </Form.Item>
          <Form.Item label="数据点">
            <Button
              type="dashed"
              onClick={() => addDataPoint()}
              icon={<PlusOutlined />}
            >
              添加数据点
            </Button>
          </Form.Item>
          <Form.Item label="数据点1">
            <span>擎天哈哈哈</span>
            <Button type="link" icon={<DeleteOutlined />}></Button>
          </Form.Item>
          <Form.Item name="dataDot" label="显示精度">
            <InputNumber min={0} max={5} />
          </Form.Item>
        </Col>
      </Form>
    );
  }, [property]);

  /**
   * 渲染对齐方式
   */
  const renderAlign = useMemo(() => {
    return (
      <Row justify="space-around" style={{ borderBottom: '1px solid #d9d9d9' }}>
        {Object.keys(alignObj).map((key: string, index: number) => {
          return (
            <Col key={index}>
              <Tooltip
                title={alignObj[key][0]}
                getPopupContainer={() => document.querySelector('#layout')}
              >
                <Button
                  size="large"
                  type="text"
                  icon={<CustomIcon type={alignObj[key][1]} />}
                  onClick={() => handleAlign(key)}
                />
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    );
  }, [alignObj]);

  /**
   * 渲染数据卡片样式设置  property
   */
  const renderDataCard = useMemo(() => {
    return (
      <Panel header="数据卡片样式设置" key="biciCard">
        <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
          <Col span={12}>
            <Form.Item valuePropName="checked" style={{ marginBottom: 0 }}>
              数据上下限
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: 'inline-block' }}>
                <InputNumber />
              </Form.Item>
              <span
                style={{
                  display: 'inline-block',
                  width: '24px',
                  lineHeight: '32px',
                  textAlign: 'center',
                }}
              >
                -
              </span>
              <Form.Item style={{ display: 'inline-block' }}>
                <InputNumber />
              </Form.Item>
            </Form.Item>
          </Col>
        </Form>
      </Panel>
    );
  }, [property]);

  /**
   * 渲染指示灯样式
   */
  const renderLight = useMemo(() => {
    return (
      <Panel header="样式" key="biciLight">
        <Form
          form={propertyForm}
          onValuesChange={handlePropertyValuesChange}
          labelCol={{ span: 6 }}
          labelAlign="left"
        >
          <Col span={24}>
            <Form.Item name="color" label="颜色">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="尺寸">
              <InputNumber placeholder="请输入直径" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Button.Group
                style={{ width: '100%', backgroundColor: '#E0E7F5' }}
              >
                <Button block size="small" type="text">
                  小
                </Button>
                <Button block size="small" type="text">
                  中
                </Button>
                <Button block size="small" type="text">
                  大
                </Button>
              </Button.Group>
            </Form.Item>
          </Col>
          <Row>
            <Col span={10}>
              <Form.Item
                name="showText"
                label="文字标签"
                labelCol={{ span: 16 }}
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="text">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态定义" wrapperCol={{ offset: 3 }}>
            <Radio.Group
              options={[
                { label: '单点值', value: 'single' },
                { label: '范围值', value: 'area' },
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.List name="lightAreas">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="center"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'lightAreaCheck']}
                      fieldKey={[field.fieldKey, 'lightAreaCheck']}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'lightAreaColor']}
                      fieldKey={[field.fieldKey, 'lightAreaColor']}
                    >
                      <ColorPicker />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'lightAreaVal']}
                      fieldKey={[field.fieldKey, 'lightAreaVal']}
                    >
                      <Input placeholder="数值" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'lightAreaText']}
                      fieldKey={[field.fieldKey, 'lightAreaText']}
                    >
                      <Input placeholder="文本" />
                    </Form.Item>
                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Form.Item>
                  </Space>
                ))}
                {form.getFieldValue('lightAreas')?.length <= 10 ||
                !form.getFieldValue('lightAreas') ? (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加
                    </Button>
                  </Form.Item>
                ) : null}
              </Fragment>
            )}
          </Form.List>
        </Form>
      </Panel>
    );
  }, []);

  return (
    <div className="rightArea">
      {renderAlign}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="外观" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            {renderPositionForm}
            {/* {renderFillStyle} */}
            {/* {renderBorderStyle} */}
            {renderFontForm}
            {renderLight}
            {/** 渲染时间组件属性 */}
            {name === 'biciTimer' && renderBiciTimerDataForm}
            {name === 'biciCard' && renderDataCard}
          </Collapse>
        </TabPane>
        <TabPane tab="数据" key="2" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="本身数据" key="1">
              {renderDataForm}
            </Panel>
            <Panel header="自定义数据" key="2">
              {renderExtraDataForm}
            </Panel>
          </Collapse>
        </TabPane>
        {/*<TabPane tab="事件" key="3" style={{ margin: 0 }}>
          <EventComponent
            canvasData={data}
            onEventValueChange={onEventValueChange}
          />
        </TabPane>
         <TabPane tab="动效" key="4" style={{ margin: 0 }}>
          <AnimateComponent canvasData={data} />
          待开发...
        </TabPane>
        <TabPane tab="结构" key="5" style={{ margin: 0 }}>
          待开发...
        </TabPane> */}
      </Tabs>
      {renderDataPointModal()}
    </div>
  );
};

export default NodeCanvasProps;
