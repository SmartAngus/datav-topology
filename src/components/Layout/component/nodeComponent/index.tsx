import React, {
  useMemo,
  useEffect,
  useState,
  Fragment,
  useCallback,
} from 'react';
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
  Tooltip,
  Radio,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FormProps } from 'antd/lib/form/Form';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import { canvas } from '../../index';
import { alignNodes } from '../../../../topology/layout/src/align';
import CustomIcon from '../../../config/iconConfig';
import DataBindModal from '../../../FilterDataPoint';

import styles from './index.module.scss';
import { getNodeType } from '../../../utils/Property2NodeProps';
import * as _ from 'lodash';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
// 对齐方式 key 对齐方式 val 图标名称
const alignObj = {
  left: ['左对齐', 'iconzuoduiqi'],
  right: ['右对齐', 'iconyouduiqi'],
  top: ['顶部对齐', 'iconshangduiqi'],
  bottom: ['底部对齐', 'iconxiaduiqi'],
  center: ['垂直居中', 'iconzongxiangjuzhong'],
  middle: ['水平居中', 'iconhengxiangjuzhong'],
};
// 需要显示文件填充的节点列表
const fillStyleNodeList = ['circle', 'rectangle', 'biciVarer', 'combine'];
// 字体样式
const fontStyleNodeList = [
  'biciPilot',
  'circle',
  'rectangle',
  'text',
  'biciVarer',
];
// 边框样式
const boardStyleNodeList = ['circle', 'rectangle', 'biciVarer', 'combine'];
interface ICanvasProps extends FormProps {
  data?: any;
  onFormValueChange?: any;
  onPropertyFormValueChange?: any;
  onEventValueChange: any;
  setIsSave?: (isSave: boolean) => void;
}

const NodeCanvasProps: React.FC<ICanvasProps> = ({
  data,
  onFormValueChange,
  onPropertyFormValueChange,
  setIsSave,
}) => {
  const [form] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { x, y, width, height } = data?.node?.rect || {};
  const { rotate, lineWidth, strokeStyle, text, id, name, fillStyle } =
    data?.node || {};
  const { color, fontSize, fontFamily } = data?.node?.font || {};
  const { property } = data?.node; // 用户自定义数据片段
  const [dataPointSelectedRows, setDataPointSelectedRows] = useState(
    property?.dataPointSelectedRows || []
  );
  const { dataMethod, dataDot } = property || {};
  useEffect(() => {
    // console.log('selected data:', data);
    // 设置基本表单
    form.setFieldsValue({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      rotate: Math.round(rotate),
      lineWidth,
      strokeStyle,
      color,
      fontSize: parseInt(fontSize),
      fontFamily,
      text,
      fillStyle,
      showFillStyle: fillStyle ? true : false,
      showBoardColor: strokeStyle ? true : false,
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
    color,
    fontSize,
    fontFamily,
    text,
    fillStyle,
    property,
  ]);

  useEffect(() => {
    propertyForm.setFieldsValue({
      dataMethod,
      dataDot,
      'date.show': property?.date?.show,
      'date.format': property?.date?.format,
      'time.show': property?.time?.show,
      'time.format': property?.time?.format,
    });
    if (data.node.name === 'biciCard') {
      // 设置数据卡片
      propertyForm.setFieldsValue({
        showTitle: property.showTitle,
        cardTitle: property.title,
        limitType: property.limitType,
        showLimit: property.showLimit,
        'limit.bottom': property.limit.bottom,
        'limit.top': property.limit.top,
        'normal.fontFamily': property.normal.fontFamily,
        'normal.fontSize': property.normal.fontSize,
        'normal.color': property.normal.color,
        'normal.showBkColor': property.normal.showBkColor,
        'normal.bkColor': property.normal.bkColor,
        'topLimit.fontFamily': property.topLimit.fontFamily,
        'topLimit.fontSize': property.topLimit.fontSize,
        'topLimit.color': property.topLimit.color,
        'topLimit.showBkColor': property.topLimit.showBkColor,
        'topLimit.bkColor': property.topLimit.bkColor,
        'bottomLimit.fontFamily': property.bottomLimit.fontFamily,
        'bottomLimit.fontSize': property.bottomLimit.fontSize,
        'bottomLimit.color': property.bottomLimit.color,
        'bottomLimit.showBkColor': property.bottomLimit.showBkColor,
        'bottomLimit.bkColor': property.bottomLimit.bkColor,
      });
    } else if (data.node.name === 'biciPilot') {
      propertyForm.setFieldsValue({
        color: property.color,
        size: width / 2,
        showText: property.showText,
        text: property.text,
        stateType: property.stateType,
        lightRange: property.lightRange,
      });
    } else if (data.node.name == 'echarts') {
      propertyForm.setFieldsValue({
        dataMax: property.dataMax,
        dataMin: property.dataMin,
        'checked-0': property.dataColors && property.dataColors[0]?.checked,
        'color-0': property.dataColors && property.dataColors[0]?.color,
        'top-0': property.dataColors && property.dataColors[0]?.top,
        'bottom-0': property.dataColors && property.dataColors[0]?.bottom,
        'checked-1': property.dataColors && property.dataColors[1]?.checked,
        'color-1': property.dataColors && property.dataColors[1]?.color,
        'top-1': property.dataColors && property.dataColors[1]?.top,
        'bottom-1': property.dataColors && property.dataColors[1]?.bottom,
        'checked-2': property.dataColors && property.dataColors[2]?.checked,
        'color-2': property.dataColors && property.dataColors[2]?.color,
        'top-2': property.dataColors && property.dataColors[2]?.top,
        'bottom-2': property.dataColors && property.dataColors[2]?.bottom,
        'checked-3': property.dataColors && property.dataColors[3]?.checked,
        'color-3': property.dataColors && property.dataColors[3]?.color,
        'top-3': property.dataColors && property.dataColors[3]?.top,
        'bottom-3': property.dataColors && property.dataColors[3]?.bottom,
        'checked-4': property.dataColors && property.dataColors[4]?.checked,
        'color-4': property.dataColors && property.dataColors[4]?.color,
        'top-4': property.dataColors && property.dataColors[4]?.top,
        'bottom-4': property.dataColors && property.dataColors[4]?.bottom,
        smooth: property.smooth && property.smooth,
        dataTopSource: property.dataTopSource && property.dataTopSource,
        dataTopChecked: property.dataTopChecked && property.dataTopChecked,
        dataTop: property.dataTop && property.dataTop,
        dataBottom: property.dataBottom && property.dataBottom,
        chartTitleChecked: property.chartTitleChecked && property.chartTitleChecked,
        chartTitle: property.chartTitle && property.chartTitle,
        chartTitleColor: property.chartTitleColor && property.chartTitleColor,
        lineReferenceChecked: property.lineReferenceChecked && property.lineReferenceChecked,
        lineReferenceColor: property.lineReferenceColor && property.lineReferenceColor,
      });
    }
  }, [property]);

  // 字段值更新时触发的回掉
  const handleValuesChange = (changedValues) => {
    if ('showFillStyle' in changedValues) {
      changedValues.fillStyle = changedValues.showFillStyle
        ? form.getFieldValue('fillStyle')
        : '';
    }
    if ('showBoardColor' in changedValues) {
      changedValues.strokeStyle = changedValues.showBoardColor
        ? form.getFieldValue('strokeStyle')
        : '';
    }
    onFormValueChange && onFormValueChange(changedValues);
  };

  const handlePropertyValuesChange = (changedValues, allValues) => {
    onPropertyFormValueChange && onPropertyFormValueChange(allValues);
  };
  //

  // 设置对齐方式
  const handleAlign = (key: string) => {
    const pens = canvas.activeLayer.pens;
    const rect = canvas.activeLayer.rect;
    if (pens.length >= 2) {
      alignNodes(pens, rect, key);
      canvas.cache();
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
  // 获得选中的数据点
  const onDataPointBind = (selectedRowKeys, selectedRows) => {
    const nodeType = getNodeType(data.node);
    if (property && property.dataPointSelectedRows) {
      if (nodeType == 'timeLine') {
        // 最多可绑定十个数据点
        if (data.node.property.dataPointSelectedRows.length < 10) {
          data.node.property.dataPointSelectedRows = data.node.property.dataPointSelectedRows.concat(
            selectedRows
          );
          data.node.property.dataPointParam.qtDataList.push({
            id: selectedRows[0].id,
            type: selectedRows[0].dataType,
          });
          setDataPointSelectedRows(selectedRows);
        }
      } else {
        data.node.property.dataPointSelectedRows = selectedRows;
        data.node.property.dataPointParam.qtDataList[0] = {
          id: selectedRows[0].id,
          type: selectedRows[0].dataType,
        };
        setDataPointSelectedRows(selectedRows);
      }
      setIsSave(false);
    }
  };
  // 删除数据点
  const handleDeleteDataPoint = (item) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除数据点吗？',
      okText: '确认',
      cancelText: '取消',
      getContainer: () => document.querySelector('#editLayout'),
      onOk() {
        setIsSave(false);
        const itemRowIndex = _.findIndex(
          property.dataPointSelectedRows,
          (r: any) => r.id == item.id
        );
        const itemQueryIndex = _.findIndex(
          property.dataPointParam.qtDataList,
          (r: any) => r.id == item.id
        );
        data.node.property.dataPointParam.qtDataList.splice(itemQueryIndex, 1);
        data.node.property.dataPointSelectedRows.splice(itemRowIndex, 1);
        const newRows = _.cloneDeep(data.node.property.dataPointSelectedRows);
        setDataPointSelectedRows(newRows);
      },
      onCancel() {},
    });
  };
  // 渲染数据点弹出窗口 不包含 disableSource:['react','complex','dataPoint]
  const renderDataPointModal = useCallback(() => {
    return (
      <DataBindModal
        visible={true}
        disableSource={['react']}
        selectedRows={[]}
        onCancel={addDataPoint}
        onGetSelectRow={onDataPointBind}
        node={data.node}
      ></DataBindModal>
    );
  }, [visible]);

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

  /**
   * 渲染填充样式
   */
  const renderFillStyle = useMemo(() => {
    return (
      <Panel header="填充" key="fill">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Row align="middle">
            <Col span={8}>
              <Form.Item
                name="showFillStyle"
                label="颜色"
                labelCol={{ span: 16 }}
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col push={1}>
              <Form.Item name="fillStyle">
                <ColorPicker
                  onChange={() => form.setFieldsValue({ showFillStyle: true })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [form, fillStyle, data.node]);

  /**
   * 渲染边框样式
   */
  const renderBorderStyle = useMemo(() => {
    return (
      <Panel header="边框" key="border">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Row align="middle">
            <Col span={8}>
              <Form.Item
                name="showBoardColor"
                label="颜色"
                labelCol={{ span: 16 }}
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={6} push={1}>
              <Form.Item name="strokeStyle">
                <ColorPicker
                  onChange={() => form.setFieldsValue({ showBoardColor: true })}
                />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item name="lineWidth" initialValue={1}>
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [form, strokeStyle, lineWidth]);

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
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          {data.node.name !== 'biciPilot' && (
            <Col span={24}>
              <Form.Item name="text" label="内容">
                <Input />
              </Form.Item>
            </Col>
          )}
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
      <React.Fragment>
        {renderFillStyle}
        {renderFontForm}
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
                <Form.Item
                  name="date.format"
                  rules={[{ required: true, message: '日期格式不能为空' }]}
                >
                  <Select
                    placeholder="设置日期格式"
                    onChange={onSetBiciTimerDataFmt}
                    allowClear
                  >
                    <Option value="L">YYYY-MM-DD</Option>
                    <Option value="LL">YYYY/MM/DD</Option>
                    <Option value="l">YY/MM/DD</Option>
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
                <Form.Item
                  name="time.format"
                  rules={[{ required: true, message: '时间格式不能为空' }]}
                >
                  <Select
                    placeholder="设置时间格式"
                    onChange={onSetBiciTimerDataFmt}
                    allowClear
                  >
                    <Option value="LTS">hh：mm：ss</Option>
                    <Option value="LT">hh:mm(24h)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </React.Fragment>
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
              <Option value="point">绑定数据点</Option>
              <Option value="restful">接口传入</Option>
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
          {(property?.dataPointSelectedRows || []).map((item, index) => {
            return (
              <Form.Item label={`数据点${index}`} key={index}>
                <span>{item.dataName}</span>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteDataPoint(item)}
                ></Button>
              </Form.Item>
            );
          })}
          <Form.Item name="dataDot" label="显示精度">
            <InputNumber min={0} max={5} />
          </Form.Item>
        </Col>
      </Form>
    );
  }, [data?.node, propertyForm, dataPointSelectedRows]);

  /**
   * 渲染对齐方式
   */
  const renderAlign = useMemo(() => {
    return (
      <Row justify="space-around" style={{ borderBottom: '1px solid #d9d9d9' }}>
        {Object.keys(alignObj).map((key: string, index: number) => {
          return (
            <Col key={index} span={4}>
              <Tooltip
                title={alignObj[key][0]}
                getPopupContainer={() => document.querySelector('#editLayout')}
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
    const statusObj = {
      normal: '正常状态',
      bottomLimit: '低于下限',
      topLimit: '高于上限',
    };

    return (
      <Fragment>
        <Panel header="基本信息" key="info">
          <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="标题"
                  name="showTitle"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="cardTitle">
                  <Input placeholder="标题名称" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="limitType"
              label="上下限"
              labelCol={{ span: 9 }}
              labelAlign="left"
              initialValue="dataPoint"
            >
              <Radio.Group
                options={[
                  { label: '数据点', value: 'dataPoint' },
                  { label: '自定义', value: 'custom' },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Row>
              <Col span={4}>
                <Form.Item name="showLimit" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Input.Group compact>
                  <Form.Item name="limit.bottom">
                    <InputNumber
                      style={{ width: 80 }}
                      min={0}
                      placeholder="下限"
                    />
                  </Form.Item>
                  <Input
                    style={{
                      width: 30,
                      pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item name="limit.top">
                    <InputNumber
                      style={{ width: 80 }}
                      min={0}
                      placeholder="上限"
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          </Form>
        </Panel>
        {Object.keys(statusObj).map((key) => {
          return (
            <Panel header={`样式-${statusObj[key]}`} key={key}>
              <Form
                form={propertyForm}
                onValuesChange={handlePropertyValuesChange}
              >
                <Form.Item
                  name={`${key}.fontFamily`}
                  label="字体"
                  labelCol={{ span: 8 }}
                  labelAlign="left"
                >
                  <Input />
                </Form.Item>
                <Row>
                  <Col span={7}>
                    <Form.Item label="颜色字号"></Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={`${key}.color`}>
                      <ColorPicker />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item name={`${key}.fontSize`}>
                      <InputNumber min={12} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Form.Item label="背景颜色"></Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name={`${key}.showBkColor`}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item name={`${key}.bkColor`}>
                      <ColorPicker />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Panel>
          );
        })}
      </Fragment>
    );
  }, [propertyForm, property, data.node]);

  // 改变指示灯大小
  const changePolitSize = (size: number) => {
    let { node } = data;
    node.text = propertyForm.getFieldValue('text');
    node.rect.width = size * 2;
    node.rect.height = size * 2;
    form.setFieldsValue({ width: size * 2, height: size * 2 });
    node.property.size = size;
    propertyForm.setFieldsValue({ size });
    canvas.updateProps(false, [node]);
  };

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
            <Form.Item name="size" label="尺寸">
              <InputNumber
                placeholder="请输入直径"
                min={0}
                style={{ width: '100%' }}
                onChange={changePolitSize}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Button.Group
                style={{ width: '100%', backgroundColor: '#E0E7F5' }}
              >
                <Button
                  block
                  size="small"
                  type="text"
                  onClick={() => changePolitSize(15)}
                >
                  小
                </Button>
                <Button
                  block
                  size="small"
                  type="text"
                  onClick={() => changePolitSize(20)}
                >
                  中
                </Button>
                <Button
                  block
                  size="small"
                  type="text"
                  onClick={() => changePolitSize(30)}
                >
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
                <Input maxLength={4} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="stateType"
            label="状态定义"
            wrapperCol={{ offset: 3 }}
          >
            <Radio.Group
              options={[
                { label: '单点值', value: 'single' },
                { label: '范围值', value: 'range' },
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.List name="lightRange">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 5 }}
                    align="center"
                    size="small"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'lightRangeColor']}
                      fieldKey={[field.fieldKey, 'lightRangeColor']}
                    >
                      <ColorPicker />
                    </Form.Item>
                    {propertyForm.getFieldValue('stateType') === 'single' && (
                      <Fragment>
                        <Form.Item
                          {...field}
                          name={[field.name, 'lightRangeVal']}
                          fieldKey={[field.fieldKey, 'lightRangeVal']}
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <InputNumber placeholder="数值" min={0} />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'lightRangeText']}
                          fieldKey={[field.fieldKey, 'lightRangeText']}
                        >
                          <Input placeholder="文本" />
                        </Form.Item>
                      </Fragment>
                    )}

                    {propertyForm.getFieldValue('stateType') === 'range' && (
                      <Fragment>
                        <Form.Item
                          {...field}
                          name={[field.name, 'lightRangeBottom']}
                          fieldKey={[field.fieldKey, 'lightRangeBottom']}
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <InputNumber
                            style={{ width: 60 }}
                            min={0}
                            placeholder="下限"
                          />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, 'lightRangeTop']}
                          fieldKey={[field.fieldKey, 'lightRangeTop']}
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <InputNumber
                            style={{ width: 60 }}
                            min={0}
                            placeholder="上限"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'lightRangeText']}
                          fieldKey={[field.fieldKey, 'lightRangeText']}
                        >
                          <Input style={{ width: 50 }} placeholder="文本" />
                        </Form.Item>
                      </Fragment>
                    )}
                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Form.Item>
                  </Space>
                ))}
                {form.getFieldValue('lightRange')?.length <= 10 ||
                !form.getFieldValue('lightRange') ? (
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
  }, [propertyForm, data.node]);

  /**
   * 渲染计量器样式
   */
  const renderMeter = useMemo(() => {
    return (
      <Panel header="样式" key="style">
        <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
          <Row>
            <Col>
              <Form.Item label="范围"></Form.Item>
            </Col>
            <Col>
              <Input.Group compact>
                <Form.Item name="dataMin">
                  <InputNumber style={{ width: 85 }} placeholder="下限" />
                </Form.Item>
                <Input
                  style={{
                    width: 30,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item name="dataMax">
                  <InputNumber
                    style={{
                      width: 85,
                    }}
                    placeholder="上限"
                  />
                </Form.Item>
              </Input.Group>
            </Col>
          </Row>
          {/*<Form.Item name="scale" label="刻度">*/}
          {/*  <Input placeholder="请输入个数" suffix="个" />*/}
          {/*</Form.Item>*/}
          <Row>
            <Form.Item label="颜色分区"></Form.Item>
          </Row>
          {(property?.dataColors || []).map((item, index) => (
            <Row key={index}>
              <Col span={3}>
                <Form.Item name={`checked-${index}`} valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={`color-${index}`}>
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={15}>
                <Input.Group compact>
                  <Form.Item name={`bottom-${index}`}>
                    <InputNumber
                      style={{ width: 60 }}
                      placeholder="下限"
                      min={-100}
                      max={500}
                    />
                  </Form.Item>
                  <Input
                    style={{ width: 30, pointerEvents: 'none' }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item name={`top-${index}`}>
                    <InputNumber
                      style={{ width: 60 }}
                      placeholder="上限"
                      min={-100}
                      max={500}
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          ))}
        </Form>
      </Panel>
    );
  }, [property, data.node]);

  /**
   * 渲染仪表盘样式
   */
  const renderGauge = useMemo(() => {
    return (
      <Fragment>
        <Panel header="基本信息" key="info">
          <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="标题"
                  name="showTitle"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="title">
                  <Input placeholder="标题名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="单位"
                  name="showUnit"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="unit">
                  <Input placeholder="单位" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        {renderMeter}
      </Fragment>
    );
  }, [property, data.node]);

  /**
   * 渲染实时曲线图样式
   */
  const renderLineGraph = useMemo(() => {
    return (
      <Fragment>
        <Panel header="基本信息" key="lineInfo">
          <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
            <Row>
              <Col span={6}>
                <Form.Item label="标题" name="chartTitleChecked" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="chartTitleColor">
                  <ColorPicker  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="chartTitle">
                  <Input placeholder="标题" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="上下限" wrapperCol={{ push: 6 }} name="dataTopSource" >
              <Radio.Group
                options={[
                  { label: '数据点', value: 'dataPoint' },
                  { label: '自定义', value: 'custom' },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Row>
              <Col>
                <Form.Item name="dataTopChecked"  valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col push={2}>
                <Input.Group compact>
                  <Form.Item name="dataBottom">
                    <InputNumber
                      style={{ width: 90 }}
                      min={0}
                      placeholder="下限"
                    />
                  </Form.Item>
                  <Input
                    style={{
                      width: 30,
                      pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item name="dataTop">
                    <InputNumber
                      style={{
                        width: 90,
                      }}
                      min={0}
                      placeholder="上限"
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel header="样式" key="lineStyle">
          <Form  form={propertyForm} onValuesChange={handlePropertyValuesChange}>
            <Form.Item label="线性" wrapperCol={{ push: 10 }} name="smooth">
              <Radio.Group
                options={[
                  { label: '曲线', value: true },
                  { label: '折线', value: false },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="参考线"
                  labelCol={{ span: 16 }}
                  labelAlign="left"
                  name="lineReferenceChecked"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={12} push={2}>
                <Form.Item name="lineReferenceColor">
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label="曲线颜色"></Form.Item>
            </Row>
            <Form.List name="lineGraphRange">
              {(fields, { add, remove }) => (
                <Fragment>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="center"
                      size={20}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'lineGraphRangeCheck']}
                        fieldKey={[field.fieldKey, 'lineGraphRangeCheck']}
                        valuePropName="checked"
                      >
                        <Checkbox />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'lineGraphRangeColor']}
                        fieldKey={[field.fieldKey, 'lineGraphRangeColor']}
                      >
                        <ColorPicker />
                      </Form.Item>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      </Form.Item>
                    </Space>
                  ))}
                  {form.getFieldValue('lineGraphRange')?.length <= 10 ||
                  !form.getFieldValue('lineGraphRange') ? (
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
      </Fragment>
    );
  }, [property, data.node]);

  return (
    <div className={styles.rightArea}>
      {data.multi && renderAlign}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="外观" key="1" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['pos']}>
            {renderPositionForm}
            {fontStyleNodeList.includes(name) && !data.multi && renderFontForm}
            {fillStyleNodeList.includes(name) && !data.multi && renderFillStyle}
            {boardStyleNodeList.includes(name) &&
              !data.multi &&
              renderBorderStyle}
            {name === 'biciPilot' && !data.multi && renderLight}
            {name === 'biciTimer' && !data.multi && renderBiciTimerDataForm}
            {name === 'biciCard' && !data.multi && renderDataCard}
            {property?.echartsType === 'chartMeasure' &&
              !data.multi &&
              renderMeter}
            {property?.echartsType === 'timeLine' &&
              !data.multi &&
              renderLineGraph}
            {property?.echartsType === 'gauge' && !data.multi && renderGauge}
          </Collapse>
        </TabPane>
        <TabPane tab="数据" key="2" style={{ margin: 0 }}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="本身数据" key="1">
              {renderDataForm}
            </Panel>
            {(data.node.name == 'biciVarer' ||
              data.node.name == 'echarts' ||
              data.node.name == 'biciCard' ||
              data.node.name == 'biciPilot') && (
              <Panel header="自定义数据" key="2">
                {renderExtraDataForm}
              </Panel>
            )}
          </Collapse>
        </TabPane>
      </Tabs>
      {visible && renderDataPointModal()}
    </div>
  );
};

export default NodeCanvasProps;
