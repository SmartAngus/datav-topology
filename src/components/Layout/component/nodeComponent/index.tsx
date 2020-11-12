import React, { useMemo, useEffect, useState } from 'react'
import { Form, InputNumber, Tabs, Collapse, Row, Col, Input, Select, Tag,Checkbox } from 'antd';
// import AnimateComponent from './AnimateComponent';
import EventComponent from './EventComponent';
import {FormProps} from 'antd/lib/form/Form';
import './index.css';
import ColorPicker from '../../../common/ColorPicker'
import {canvas} from '../../index'

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface ICanvasProps extends FormProps {
  data?: any
  onFormValueChange?: any
  onPropertyFormValueChange?: any
  onEventValueChange: any
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const NodeCanvasProps:React.FC<ICanvasProps> = ({ data, onFormValueChange, onEventValueChange,onPropertyFormValueChange }) => {

  const [form]=Form.useForm()
  const [propertyForm] = Form.useForm()
  const [baseAllValues,setBaseAllValues] = useState({...data?.node})

  const { x, y, width, height } = data?.node?.rect || {};
  const { rotate, lineWidth, strokeStyle, dash, text, id,name } = data?.node || {};
  const { color, fontSize, fontFamily } = data?.node?.font || {};
  const { property } = data?.node?.property||{}
  const extraFields = data.node.data; // 用户自定义数据片段
  useEffect(() => {
    form.setFieldsValue({
      x, y, width, height,rotate,lineWidth, strokeStyle,
      dash,color, fontSize, fontFamily, text
    });
  }, [x, y, width, height,rotate,text,lineWidth, strokeStyle, dash,color, fontSize, fontFamily, text])


  // 字段值更新时触发的回掉
  const handleValuesChange = (changedValues, allValues)=>{
    onFormValueChange&&onFormValueChange(allValues)
  }
  const handlePropertyValuesChange = (changedValues, allValues)=>{
    onPropertyFormValueChange&&onPropertyFormValueChange(allValues)
  }
  //
  const handleFieldsChange=(changedValues, allValues)=>{
    //console.log("handleFieldsChange")
  }
  //
  const handleFinish=()=>{
    //console.log("handleFinish")
  }
  // 设置日期格式
  const onSetBiciTimerDataFmt=()=>{

  }
  /**
  * 渲染位置和大小的表单
  */

  const renderForm = useMemo(() => {
    return (
      <Form form={form}
             onValuesChange={handleValuesChange}
             onFieldsChange={handleFieldsChange}
             onFinish={handleFinish}
      >
      <Row>
        <Col span={12}>
          <Form.Item name="x" label="X(px)">
           <InputNumber />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="y" label="Y(px)">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="width" label="宽(px)" >
           <InputNumber />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="height" label="高(px)">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="rotate" label="角度(deg)">
            <InputNumber />
          </Form.Item>
        </Col>
      </Row>
    </Form>)
  }, [x, y, width, height, rotate]);

  /**
  * 渲染样式的表单
  */

  const renderStyleForm = useMemo(() => {
    return <Form form={form}
                 onValuesChange={handleValuesChange}
                 onFieldsChange={handleFieldsChange}
                 onFinish={handleFinish}
    >
      <Row>
        <Col span={24}>
          <Form.Item name="strokeStyle" label="线条颜色">
            <Input type="color" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dash" label="线条样式">
              <Select style={{ width: '95%' }}>
                <Option value={0}>_________</Option>
                <Option value={1}>---------</Option>
                <Option value={2}>_ _ _ _ _</Option>
                <Option value={3}>- . - . - .</Option>
              </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lineWidth" label="线条宽度">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }, [lineWidth, strokeStyle, dash]);

  /**
  * 渲染字体的表单
  */

  const renderFontForm = useMemo(() => {
    return <Form form={form}
                 onValuesChange={handleValuesChange}
                 onFieldsChange={handleFieldsChange}
                 onFinish={handleFinish}
    >
      <Col span={24}>
        <Form.Item name="color" label="字体颜色">
          <Input type="color" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="fontFamily" label="字体类型">
          <Input />
        </Form.Item>
      </Col>
      <Col span={11} offset={1}>
        <Form.Item name="fontSize" label="字体大小">
          <InputNumber />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="text" label="内容">
         <TextArea />
        </Form.Item>
      </Col>
    </Form>
  }, [color, fontFamily, fontSize, text])

  /**
  * 渲染元素本身数据
  */

  const renderDataForm = useMemo(() => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return <Form {...formItemLayout}>
      <Col>
        <Form.Item label="ID">
          <span className="ant-form-text"><Tag color="#f50">{id}</Tag></span>
        </Form.Item>
      </Col>
    </Form>
  }, [id]);
  /**
   * 渲染时间组件的属性设置
   */
  const renderBiciTimerDataForm = useMemo(() => {
    return <Panel header="时间格式" key="4">
    <Form form={propertyForm}
          onValuesChange={handlePropertyValuesChange}>
      <Col span={8}>
        <Form.Item  name="date.show" valuePropName="checked">
          <Checkbox>日期</Checkbox>
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item name="date.format" rules={[{ required: true }]}>
          <Select
            placeholder="设置日期格式"
            onChange={onSetBiciTimerDataFmt}
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item  name="time.show" valuePropName="checked">
          <Checkbox>时间</Checkbox>
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item name="time.format" rules={[{ required: true }]}>
          <Select
            placeholder="设置日期格式"
            onChange={onSetBiciTimerDataFmt}
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
      </Col>
    </Form>
    </Panel>
  }, [property])


  /**
  * 渲染元素额外数据
  */

  const renderExtraDataForm = useMemo(() => {
    return <Form >
      <Col>
        <Form.Item label="自定义数据字段">
          <TextArea rows={10} />
        </Form.Item>
      </Col>
    </Form>
  }, [extraFields])

  return (
    <div className="rightArea">
      <Tabs defaultActiveKey="1">
        <TabPane tab="外观" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="位置和大小" key="1">
              {
                renderForm
              }
            </Panel>
            <Panel header="样式" key="2">
              {
                renderStyleForm
              }
            </Panel>
            <Panel header="文字" key="3" >
              {
                renderFontForm
              }
            </Panel>
            {/** 渲染时间组件属性 */}
            {
              name==="biciTimer"&&renderBiciTimerDataForm
            }
          </Collapse>
        </TabPane>
        <TabPane tab="数据" key="2" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="本身数据" key="1">
              {
                renderDataForm
              }
            </Panel>
            <Panel header="自定义数据" key="2">
              {
                renderExtraDataForm
              }
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane tab="事件" key="3" style={{ margin: 0 }}>
          <EventComponent canvasData={data} onEventValueChange={onEventValueChange} />
        </TabPane>
        <TabPane tab="动效" key="4" style={{ margin: 0 }}>
          {/* <AnimateComponent canvasData={data} /> */}
          待开发...
        </TabPane>
        <TabPane tab="结构" key="5" style={{ margin: 0 }}>
          待开发...
        </TabPane>
      </Tabs>

    </div>
  );
};

export default NodeCanvasProps;
