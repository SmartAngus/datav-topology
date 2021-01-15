import React, {
  useMemo,
  useEffect,
  useState,
  Fragment,
  useCallback, useImperativeHandle,
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
  message,
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
import { echartsObjs } from '../../../../topology/chart-diagram/src/echarts';
import { reviver } from '../../../utils/serializing';
import { eraseOverlapIntervals } from '../../../utils/cacl';
import {DataPointPropsMap, defaultLineColors, Node} from '../../../data/defines';
import {getTimeLineOption} from "../../../config/charts/timeline";

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
// 不展示旋转
const disabledRotateList = ['biciPilot', 'echarts', 'biciCard'];
interface ICanvasProps extends FormProps {
  data?: any;
  onFormValueChange?: any;
  onPropertyFormValueChange?: any;
  onEventValueChange: any;
  setIsSave?: (isSave: boolean) => void;
  onAddDataPoint?:(node:Node,disableSource:string[],selectedRowKeys:string[])=>void;
  ref?:any;
  dataPointPropsMap:DataPointPropsMap
}

const NodeCanvasProps: React.FC<ICanvasProps> = React.forwardRef(({
  data,
  onFormValueChange,
  onPropertyFormValueChange,
  setIsSave,
  onAddDataPoint,
  dataPointPropsMap
},ref) => {
  const [form] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [pilotBtnSize, setPilotBtnSize] = useState('small');
  const [btnColor, setBtnColor] = useState({
    italicBtn: '#fff',
    boldBtn: '#fff',
  });

  const { x, y, width, height } = data?.node?.rect || {};
  const { rotate, lineWidth, strokeStyle, text, id, name, fillStyle } =
    data?.node || {};
  const { color, fontSize, fontFamily, textAlign } = data?.node?.font || {};
  const { property } = data?.node; // 用户自定义数据片段
  const [dataPointSelectedRows, setDataPointSelectedRows] = useState(
    property?.dataPointSelectedRows || []
  );
  const [showSelectDataPoint, setShowSelectDataPoint] = useState(false);
  const addLineColorBtnRef = React.useRef();
  const removeLineColorBtnRef = React.useRef();
  const { dataMethod, dataDot } = property || {};
  const [refreshProperty, setRefreshProperty] = useState(false);

  let disableSource = ['react'];
  if (data.node.name == 'biciPilot') {
    disableSource = [];
  }
  // 渲染数据点弹出窗口 不包含 disableSource:['react','complex','dataPoint]
  const selectedRowKeys = [];
  data.node.property &&
  (data.node.property.dataPointSelectedRows || []).map((row) => {
    selectedRowKeys.push(row.id);
    return row;
  });

  useEffect(() => {
    if (data.node.font.fontStyle !== 'normal') {
      setBtnColor({ ...btnColor, italicBtn: '#1890ff' });
    }
    if (data.node.font.fontWeight !== 'normal') {
      setBtnColor({ ...btnColor, boldBtn: '#1890ff' });
    }
    // 设置基本表单
    form.setFieldsValue({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      rotate: parseInt(rotate),
      lineWidth,
      strokeStyle,
      color,
      fontSize: parseInt(fontSize),
      fontFamily: fontFamily.split(','),
      text,
      textAlign,
      fillStyle: fillStyle,
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
    textAlign,
    property,
  ]);

  useEffect(() => {
    setShowSelectDataPoint(property?.dataTopSource == 'custom');
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
        cardTitle: property.cardTitle,
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
        size: Math.round(width / 2),
        showText: property.showText,
        text: property.text,
        stateType: property.stateType,
        lightRange: property.lightRange,
      });
      const btnSize =
        width / 2 <= 15 ? 'small' : width / 2 <= 20 ? 'middle' : 'large';
      setPilotBtnSize(btnSize);
    } else if (data.node.name == 'echarts'||data.node.name == 'biciMeasure') {
      let lineRangedefaultColor = defaultLineColors.map((color) => {
        return {
          lineGraphRangeColor: color,
          lineGraphRangeCheck:true

        };
      });

      let nodeLineRangeColor = [];
      if (property && property.lineGraphRange) {
        nodeLineRangeColor = _.compact(property.lineGraphRange);
      }
      lineRangedefaultColor.map((colorObj, index) => {
        if (nodeLineRangeColor[index] != null) {
          lineRangedefaultColor[index] = nodeLineRangeColor[index];
        }
      });
      // lineRangedefaultColor = _.slice(
      //   lineRangedefaultColor,
      //   0,
      //   property.dataPointSelectedRows.length
      // );
      propertyForm.setFieldsValue({
        dataMax: property.dataMax,
        dataMin: property.dataMin,
        marks: property.marks,
        markChecked: property.markChecked,
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
        chartTitleChecked:
          property.chartTitleChecked && property.chartTitleChecked,
        chartTitle: property.chartTitle && property.chartTitle,
        chartTitleColor: property.chartTitleColor && property.chartTitleColor,
        lineReferenceChecked:
          property.lineReferenceChecked && property.lineReferenceChecked,
        lineReferenceColor:
          property.lineReferenceColor && property.lineReferenceColor,
        chartUnitChecked:
          property.chartUnitChecked && property.chartUnitChecked,
        chartUnit: property.chartUnit && property.chartUnit,
        lineGraphRange: lineRangedefaultColor,
        chartBackgroundColor:
          property.chartBackgroundColor && property.chartBackgroundColor,
        chartBackgroundChecked:
          property.chartBackgroundChecked && property.chartBackgroundChecked,
      });
    }
  }, [property, refreshProperty]);

  // 对父组件暴露保存数据的接口
  useImperativeHandle(
      ref,
      () => ({
        onDataPointBind:(selectedRowKeys, selectedRows)=>{
          onDataPointBind(selectedRowKeys, selectedRows)
        }
      }),
      [property]
  );

  // 字段值更新时触发的回掉
  const handleValuesChange = (changedValues) => {
    if ('fillStyle' in changedValues) {
      form.setFieldsValue({ showFillStyle: true });
    }
    if ('strokeStyle' in changedValues) {
      form.setFieldsValue({ showBoardColor: true });
    }
    if ('showFillStyle' in changedValues) {
      changedValues.fillStyle = changedValues.showFillStyle
        ? form.getFieldValue('fillStyle')
        : '';
    }
    if ('showBoardColor' in changedValues) {
      changedValues.strokeStyle = changedValues.showBoardColor
        ? form.getFieldValue('strokeStyle')
        : '#222';
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
      setIsSave(false);
    }
  };
  // 设置日期格式
  const onSetBiciTimerDataFmt = () => {};
  // 数据绑定方式
  const handlePropertyDataMethodChange = (value) => {};

  // 添加数据点
  const addDataPoint = () => {
    //setVisible(!visible);
    onAddDataPoint&&onAddDataPoint(data.node,disableSource,selectedRowKeys)
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
    // if (selectedRows.length === 0) {
    //   return;
    // }
    const nodeType = getNodeType(data.node);
    if (property && property.dataPointSelectedRows) {
      if (nodeType == 'timeLine') {
        // 最多可绑定十个数据点
        selectedRows = selectedRows.slice(0, 10);
        (selectedRows||[]).map(row=>{
          return {
              ...row,
            id:row[dataPointPropsMap.id],
            type:row[dataPointPropsMap.type],
            dataName:row[dataPointPropsMap.dataName],
            intervalTime:row[dataPointPropsMap.intervalTime],
          }
        })
        if (data.node.property.dataPointSelectedRows.length < 10) {
          data.node.property.dataPointSelectedRows = selectedRows;
          selectedRows.map((row, index) => {
            const q = {
              id: selectedRows[index][dataPointPropsMap.id],
              type: selectedRows[index][dataPointPropsMap.type],
            };
            data.node.property.dataPointParam.qtDataList[index] = q;
          });
          setDataPointSelectedRows(selectedRows);
          updateTimelineOption();
        }
      } else {
        const selectedData = selectedRows[0];
        if (nodeType === 'biciCard') {
          const scopeMin = !isNaN(Number(selectedData?.scopeMin))
            ? selectedData?.scopeMin
            : undefined;
          const scopeMax = !isNaN(Number(selectedData?.scopeMax))
            ? selectedData?.scopeMax
            : undefined;
          // 不生效？？？
          // propertyForm.setFieldsValue({
          //   'limitType': 'dataPoint',
          //   'showLimit': false,
          //   'limit.bottom': scopeMin,
          //   'limit.top': scopeMax,
          // })
          property.limitType = 'dataPoint';
          property.showLimit = false;
          property.limit.bottom = scopeMin;
          property.limit.top = scopeMax;
        }
        data.node.property.dataPointSelectedRows = selectedRows;
        data.node.property.dataPointParam.qtDataList[0] = {
          id: selectedData.id,
          type: selectedData.dataType || selectedData.type,
        };
        setDataPointSelectedRows(selectedRows);
      }
      setIsSave(false);
    }
    setRefreshProperty(!refreshProperty);
  };
  // 删除数据点
  const handleDeleteDataPoint = (item) => {
    Modal.confirm({
      title: '确认删除数据点吗？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      getContainer: () => document.querySelector('#editLayout'),
      onOk() {
        setIsSave(false);
        setRefreshProperty(!refreshProperty);
        if (data.node.property.echartsType == 'timeLine') {
          const itemRowIndex = _.findIndex(
            property.dataPointSelectedRows,
            (r: any) => r.id == item.id
          );
          const itemQueryIndex = _.findIndex(
            property.dataPointParam.qtDataList,
            (r: any) => r.id == item.id
          );
          data.node.property.dataPointParam.qtDataList.splice(
            itemQueryIndex,
            1
          );
          data.node.property.dataPointSelectedRows.splice(itemRowIndex, 1);
          const newRows = _.cloneDeep(data.node.property.dataPointSelectedRows);
          setDataPointSelectedRows(newRows);
          updateTimelineOption();
        } else {
          data.node.property.dataPointParam.qtDataList = [];
          data.node.property.dataPointSelectedRows = [];
          setDataPointSelectedRows([]);
        }
      },
      onCancel() {},
    });
  };
  // 选择数据点，将数值配置上区
  const handleChangeDataPoint = (value) => {
    const dataTween = value.split('~');
    propertyForm.setFieldsValue({
      dataBottom: dataTween[0] == 'undefined' ? '' : dataTween[0],
      dataTop: dataTween[1] == 'undefined' ? '' : dataTween[1],
    });
    onPropertyFormValueChange &&
      onPropertyFormValueChange({
        dataBottom: dataTween[0] == 'undefined' ? '' : dataTween[0],
        dataTop: dataTween[1] == 'undefined' ? '' : dataTween[1],
      });
  };
  const updateTimelineOption = () => {
    data.node.elementRendered = false;
    const newOption = getTimeLineOption(
      data.node,
      undefined,
      undefined
    );
    data.node.data.echarts.option=newOption;

    // 更新图表数据
    echartsObjs[data.node.id].chart.setOption(
      JSON.parse(JSON.stringify(newOption), reviver),true
    );
    echartsObjs[data.node.id].chart.resize();
    canvas.updateProps(true, [data.node]);
  };

  const renderDataPointModal = useCallback(() => {
    return (
      <DataBindModal
        visible={true}
        disableSource={disableSource}
        selectedRows={data.node.property?.dataPointSelectedRows}
        onCancel={addDataPoint}
        onGetSelectRow={onDataPointBind}
        selectedRowKeys={selectedRowKeys}
        node={data.node}
        mode={
          data.node.property.echartsType == 'timeLine' ? 'checkbox' : 'radio'
        }
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
                <Input suffix={<span style={{ color: '#999999' }}>X</span>} />
              </Form.Item>
            </Col>
            <Col span={9} push={1}>
              <Form.Item name="y">
                <Input suffix={<span style={{ color: '#999999' }}>Y</span>} />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="width" label="宽高">
                <Input suffix={<span style={{ color: '#999999' }}>W</span>} />
              </Form.Item>
            </Col>
            <Col span={9} push={1}>
              <Form.Item name="height">
                <Input suffix={<span style={{ color: '#999999' }}>H</span>} />
              </Form.Item>
            </Col>
            {!disabledRotateList.includes(data?.node.name) && (
              <Col span={14}>
                <Form.Item name="rotate" label="旋转">
                  <Input suffix={<span style={{ color: '#999999' }}>°</span>} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Panel>
    );
  }, [x, y, width, height, rotate, data?.node]);

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
                <ColorPicker />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [fillStyle, data?.node]);

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
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col push={2}>
              <Form.Item name="lineWidth" initialValue={1}>
                <InputNumber min={1} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  }, [strokeStyle, lineWidth, data?.node]);

  // 字体的斜体和加粗功能
  const fontStyleChange = (val: string) => {
    if (val === 'fontStyle') {
      // 斜体
      if (data.node.font.fontStyle === 'normal') {
        data.node.font.fontStyle = 'italic';
        setBtnColor({ ...btnColor, italicBtn: '#1890ff' });
      } else {
        data.node.font.fontStyle = 'normal';
        setBtnColor({ ...btnColor, italicBtn: '#fff' });
      }
    } else {
      // 加粗
      if (data.node.font.fontWeight === 'normal') {
        data.node.font.fontWeight = 'bold';
        setBtnColor({ ...btnColor, boldBtn: '#1890ff' });
      } else {
        data.node.font.fontWeight = 'normal';
        setBtnColor({ ...btnColor, boldBtn: '#fff' });
      }
    }
    setIsSave(false);
    canvas.updateProps(true, [data.node]);
  };

  /**
   * 渲染字体的表单
   */
  const renderFontForm = useMemo(() => {
    return (
      <Panel header="字符" key="font">
        <Form form={form} onValuesChange={handleValuesChange}>
          <Col span={24}>
            <Form.Item name="color" label="颜色">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="fontFamily" label="字体">
              <Select
                allowClear
                getPopupContainer={() => document.querySelector('#editLayout')}
              >
                <Option
                  value='"Microsoft YaHei"'
                  style={{ fontFamily: '"Microsoft YaHei"' }}
                >
                  微软雅黑
                </Option>
                <Option value="SimSun" style={{ fontFamily: 'SimSun' }}>
                  宋体
                </Option>
                <Option value="KaiTi" style={{ fontFamily: 'KaiTi' }}>
                  楷体
                </Option>
                <Option value="SimHei" style={{ fontFamily: 'SimHei' }}>
                  黑体
                </Option>
                <Option
                  value='"Hiragino Sans GB"'
                  style={{ fontFamily: '"Hiragino Sans GB"' }}
                >
                  冬青黑体
                </Option>
                <Option value="Arial" style={{ fontFamily: 'Arial' }}>
                  Arial
                </Option>
                <Option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>
                  Tahoma
                </Option>
                <Option value="Helvetica" style={{ fontFamily: 'Helvetica' }}>
                  Helvetica
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="fontSize" label="大小">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button.Group
                style={{ width: '100%', justifyContent: 'flex-end' }}
              >
                <Button
                  size="small"
                  style={{ width: '50%', background: btnColor.italicBtn }}
                  icon={<CustomIcon type="iconzu" />}
                  onClick={() => fontStyleChange('fontStyle')}
                />
                <Button
                  size="small"
                  style={{ width: '50%', background: btnColor.boldBtn }}
                  icon={<CustomIcon type="iconjiacu" />}
                  onClick={() => fontStyleChange('fontWeight')}
                />
              </Button.Group>
            </Form.Item>
          </Col>
          {data.node.name !== 'biciPilot' && (
            <Fragment>
              <Col span={24}>
                <Form.Item name="textAlign" wrapperCol={{ offset: 4 }}>
                  <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                    <Radio.Button
                      value="left"
                      style={{ width: '25%', textAlign: 'center' }}
                    >
                      <CustomIcon type="iconleft" />
                    </Radio.Button>
                    <Radio.Button
                      value="center"
                      style={{ width: '25%', textAlign: 'center' }}
                    >
                      <CustomIcon type="iconjuzhongduiqi" />
                    </Radio.Button>
                    <Radio.Button
                      value="right"
                      style={{ width: '25%', textAlign: 'center' }}
                    >
                      <CustomIcon type="iconyouduiqi2" />
                    </Radio.Button>
                    <Radio.Button
                      value="justify"
                      style={{ width: '25%', textAlign: 'center' }}
                    >
                      <CustomIcon type="iconjustify" />
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="text" label="内容">
                  <Input />
                </Form.Item>
              </Col>
            </Fragment>
          )}
        </Form>
      </Panel>
    );
  }, [color, fontFamily, fontSize, text, data?.node, btnColor]);

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
  }, [id, data?.node]);
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
                    allowClear={false}
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
                    allowClear={false}
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
  }, [property, data?.node]);

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
          >
            <Select
              placeholder="选择"
              onChange={handlePropertyDataMethodChange}
              allowClear={false}
              disabled
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
              <Form.Item
                label={`数据点${index + 1}`}
                key={index}
                wrapperCol={{ style: { alignItems: 'flex-end' } }}
              >
                <span>{item.dataName || item.name}</span>
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
  }, [alignObj, data?.node]);

  const checkCardRange = () => {
    const bottom = propertyForm.getFieldValue('limit.bottom');
    const top = propertyForm.getFieldValue('limit.top');
    if (top < bottom) {
      message.config({
        getContainer: () => document.getElementById('editLayout'),
      });
      message.error('上限不能超过下限');
    }
  };

  const limitTypeOnChange = (e) => {
    const selectRows = data.node.property.dataPointSelectedRows;
    if (e.target.value === 'dataPoint' && selectRows && selectRows.length > 0) {
      const selectedData = selectRows[0];
      const scopeMin = !isNaN(Number(selectedData?.scopeMin))
        ? selectedData?.scopeMin
        : undefined;
      const scopeMax = !isNaN(Number(selectedData?.scopeMax))
        ? selectedData?.scopeMax
        : undefined;
      propertyForm.setFieldsValue({
        showLimit: false,
        'limit.bottom': scopeMin,
        'limit.top': scopeMax,
      });
    } else {
      propertyForm.setFieldsValue({
        showLimit: false,
        'limit.bottom': undefined,
        'limit.top': undefined,
      });
    }
  };

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
                  <Input placeholder="标题名称" maxLength={20} />
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
                style={{ float: 'right' }}
                onChange={limitTypeOnChange}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Row justify="space-between">
              <Col span={4}>
                <Form.Item name="showLimit" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Input.Group compact>
                  <Form.Item name="limit.bottom">
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
                  <Form.Item name="limit.top">
                    <InputNumber
                      style={{ width: 85 }}
                      placeholder="上限"
                      onBlur={checkCardRange}
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
                  <Select
                    allowClear
                    getPopupContainer={() =>
                      document.querySelector('#editLayout')
                    }
                  >
                    <Option
                      value='"Microsoft YaHei"'
                      style={{ fontFamily: '"Microsoft YaHei"' }}
                    >
                      微软雅黑
                    </Option>
                    <Option value="SimSun" style={{ fontFamily: 'SimSun' }}>
                      宋体
                    </Option>
                    <Option value="KaiTi" style={{ fontFamily: 'KaiTi' }}>
                      楷体
                    </Option>
                    <Option value="SimHei" style={{ fontFamily: 'SimHei' }}>
                      黑体
                    </Option>
                    <Option
                      value='"Hiragino Sans GB"'
                      style={{ fontFamily: '"Hiragino Sans GB"' }}
                    >
                      冬青黑体
                    </Option>
                    <Option value="Arial" style={{ fontFamily: 'Arial' }}>
                      Arial
                    </Option>
                    <Option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>
                      Tahoma
                    </Option>
                    <Option
                      value="Helvetica"
                      style={{ fontFamily: 'Helvetica' }}
                    >
                      Helvetica
                    </Option>
                  </Select>
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
    if (propertyForm.getFieldValue('showText')) {
      node.text = propertyForm.getFieldValue('text');
    }
    node.rect.width = size * 2;
    node.rect.height = size * 2;
    form.setFieldsValue({ width: size * 2, height: size * 2 });
    node.property.size = size;
    propertyForm.setFieldsValue({ size });
    setPilotBtnSize(size === 15 ? 'small' : size === 20 ? 'middle' : 'large');
    canvas.updateProps(false, [node]);
  };

  const checkPilotSingleRepeat = () => {
    const vals = propertyForm
      .getFieldValue('lightRange')
      .map((item) => item?.lightRangeVal);
    const tmpSet = new Set(vals);
    if (tmpSet.size !== vals.length) {
      message.config({
        getContainer: () => document.getElementById('editLayout'),
      });
      message.error('单点值不能重复');
    }
  };

  const checkPilotRangeRepeat = () => {
    const vals = propertyForm
      .getFieldValue('lightRange')
      .map((item) => [item?.lightRangeBottom, item?.lightRangeTop]);
    let flag = false;
    if (!vals.flat().includes(undefined)) {
      message.config({
        getContainer: () => document.getElementById('editLayout'),
      });
      vals.some((item) => {
        if (item[1] < item[0]) {
          message.error('下限不能大于上限');
          flag = true;
          return true;
        }
      });
      if (flag) return;
      const nums = eraseOverlapIntervals(vals);
      if (nums.length !== 0) {
        message.error('范围值出现重叠');
      }
    }
  };

  /**
   * 渲染指示灯样式
   */
  const renderLight = useMemo(() => {
    const radioButtonStyle = { height: 26, lineHeight: '24px' };

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
              <Button.Group style={{ width: '100%' }}>
                <Button
                  block
                  size="small"
                  style={{
                    background:
                      pilotBtnSize === 'small' ? '#1890ff' : '#F0F0F0',
                    color: pilotBtnSize === 'small' ? '#ffffff' : '#000000',
                  }}
                  onClick={() => changePolitSize(15)}
                >
                  小
                </Button>
                <Button
                  block
                  size="small"
                  style={{
                    background:
                      pilotBtnSize === 'middle' ? '#1890ff' : '#F0F0F0',
                    color: pilotBtnSize === 'middle' ? '#ffffff' : '#000000',
                  }}
                  onClick={() => changePolitSize(20)}
                >
                  中
                </Button>
                <Button
                  block
                  size="small"
                  style={{
                    background:
                      pilotBtnSize === 'large' ? '#1890ff' : '#F0F0F0',
                    color: pilotBtnSize === 'large' ? '#ffffff' : '#000000',
                  }}
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
                <Input maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item name="stateType" label="状态定义">
              <Radio.Group
                options={[
                  { label: '单点值', value: 'single', style: radioButtonStyle },
                  { label: '范围值', value: 'range', style: radioButtonStyle },
                ]}
                style={{ float: 'right' }}
                onChange={() => propertyForm.setFieldsValue({ lightRange: [] })}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
          </Col>
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
                          <InputNumber
                            placeholder="数值"
                            onBlur={checkPilotSingleRepeat}
                          />
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
                            placeholder="上限"
                            onBlur={checkPilotRangeRepeat}
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
                {fields.length < 10 && (
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
                )}
              </Fragment>
            )}
          </Form.List>
        </Form>
      </Panel>
    );
  }, [propertyForm, property, data?.node, pilotBtnSize]);

  /**
   * 渲染计量器样式
   */
  const renderMeter = useMemo(() => {
    return (
      <Panel header="样式" key="style">
        <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
          {data?.node.name === 'biciMeasure' && (
              <React.Fragment>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="单位"
                  name="chartUnitChecked"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="chartUnit">
                  <Input placeholder="单位" maxLength={5} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
            <Col span={10}>
            <Form.Item
            label="刻度"
            name="markChecked"
            labelCol={{ span: 12 }}
            labelAlign="left"
            valuePropName="checked"
            >
            <Checkbox />
            </Form.Item>
            </Col>
            <Col span={14}>
            <Form.Item name="marks">
              <InputNumber placeholder="刻度个数" min={0} max={100}></InputNumber>
            </Form.Item>
            </Col>
            </Row>
              </React.Fragment>
          )}
          <Row>
            <Col>
              <Form.Item label="范围"></Form.Item>
            </Col>
            <Col>
              <Input.Group compact>
                <Form.Item
                  name="dataMin"
                  rules={[{ required: true, message: ' ' }]}
                >
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
                <Form.Item
                  name="dataMax"
                  rules={[
                    {
                      required: true,
                      message: ' ',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('dataMin') <= value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(' ');
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    style={{
                      width: 85,
                    }}
                    placeholder="上限"
                    required={true}
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
                      disabled
                    />
                  </Form.Item>
                  <Input
                    style={{ width: 30, pointerEvents: 'none' }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item name={`top-${index}`}>
                    <InputNumber style={{ width: 60 }} placeholder="上限" />
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          ))}
        </Form>
      </Panel>
    );
  }, [property, data?.node]);

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
                  name="chartTitleChecked"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="chartTitle">
                  <Input placeholder="标题名称" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="单位"
                  name="chartUnitChecked"
                  labelCol={{ span: 12 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="chartUnit">
                  <Input placeholder="单位" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        {renderMeter}
      </Fragment>
    );
  }, [property, data?.node]);

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
                <Form.Item
                  label="标题"
                  name="chartTitleChecked"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="chartTitleColor">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="chartTitle">
                  <Input placeholder="标题" maxLength={20} />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Form.Item label="上下限" name="dataTopSource">
                <Radio.Group
                  options={[
                    { label: '自定义', value: 'custom' },
                    { label: '数据点', value: 'dataPoint' },
                  ]}
                  style={{ float: 'right' }}
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(value) => {
                    if (value.target.value == 'custom') {
                      setShowSelectDataPoint(true);
                    } else {
                      setShowSelectDataPoint(false);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Row justify="space-between">
              <Col>
                <Form.Item name="dataTopChecked" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col>
                <Input.Group compact>
                  <Form.Item name="dataBottom">
                    <InputNumber
                      style={{ width: 85 }}
                      placeholder="下限"
                      readOnly={!showSelectDataPoint}
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
                        width: 85,
                      }}
                      min={0}
                      placeholder="上限"
                      readOnly={!showSelectDataPoint}
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
            <Row
              style={{
                display: showSelectDataPoint ? 'none' : 'block',
              }}
            >
              <Col push={4} span={20}>
                <Form.Item name="selectDataPoint">
                  <Select
                    style={{ width: '100%' }}
                    onChange={handleChangeDataPoint}
                    placeholder="选择数据点"
                  >
                    {(data.node.property?.dataPointSelectedRows || []).map(
                      (item, index) => {
                        return (
                          <Option
                            value={item.scopeMin + '~' + item.scopeMax}
                            key={index}
                          >
                            {item.dataName}
                          </Option>
                        );
                      }
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel header="样式" key="lineStyle">
          <Form form={propertyForm} onValuesChange={handlePropertyValuesChange}>
            <Col span={24}>
              <Form.Item label="线型" name="smooth">
                <Radio.Group
                  options={[
                    { label: '曲线', value: true },
                    { label: '折线', value: false },
                  ]}
                  style={{ float: 'right' }}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            </Col>
            <Row>
              <Col span={10}>
                <Form.Item
                  label="背景色"
                  labelCol={{ span: 16 }}
                  labelAlign="left"
                  name="chartBackgroundChecked"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={12} push={2}>
                <Form.Item name="chartBackgroundColor">
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>
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
              <Col span={8}>
                <Form.Item label="曲线颜色"></Form.Item>
              </Col>
              <Col span={16}>
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
                                  style={{marginBottom:0}}
                              >
                                <Checkbox />
                              </Form.Item>
                              <Form.Item
                                  {...field}
                                  name={[field.name, 'lineGraphRangeColor']}
                                  fieldKey={[field.fieldKey, 'lineGraphRangeColor']}
                                  style={{marginBottom:0}}
                              >
                                <ColorPicker />
                              </Form.Item>
                              <Form.Item style={{ display: 'none' }}>
                                <MinusCircleOutlined
                                    ref={removeLineColorBtnRef}
                                    onClick={() => remove(field.name)}
                                />
                              </Form.Item>
                            </Space>
                        ))}
                        {fields.length < 10 ? (
                            <Form.Item style={{ display: 'none' }}>
                              <Button
                                  type="dashed"
                                  ref={addLineColorBtnRef}
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
              </Col>
            </Row>

          </Form>
        </Panel>
      </Fragment>
    );
  }, [property, data?.node, showSelectDataPoint, refreshProperty]);

  const divHeight = document.body.clientHeight-134;

  return (
    <div className={styles.rightArea}  style={{overflow:'hidden'}}>
      {renderAlign}
      {!data.multi && (
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="&nbsp;&nbsp;&nbsp;&nbsp;外&nbsp;&nbsp;观&nbsp;&nbsp;&nbsp;&nbsp;" key="1" style={{ margin: 0 }}>
            <div style={{height:divHeight,overflow:"auto"}}>
              <Collapse defaultActiveKey={['pos', 'lineInfo', 'lineStyle']}
                        expandIconPosition="right"
                        ghost={false} bordered={false}>
                {renderPositionForm}
                {fontStyleNodeList.includes(name) && renderFontForm}
                {fillStyleNodeList.includes(name) && renderFillStyle}
                {boardStyleNodeList.includes(name) && renderBorderStyle}
                {name === 'biciPilot' && renderLight}
                {name === 'biciTimer' && renderBiciTimerDataForm}
                {name === 'biciCard' && renderDataCard}
                {data?.node.name === 'biciMeasure' && renderMeter}
                {property?.echartsType === 'timeLine' && renderLineGraph}
                {property?.echartsType === 'gauge' && renderGauge}
              </Collapse>
            </div>
          </TabPane>
          <TabPane tab="&nbsp;&nbsp;&nbsp;&nbsp;数&nbsp;&nbsp;据&nbsp;&nbsp;&nbsp;&nbsp;" key="2" style={{ margin: 0 }}>
            <Collapse defaultActiveKey={['2']}
                      expandIconPosition="right"
                      ghost={false} bordered={false}>
              {/*<Panel header="本身数据" key="1">*/}
              {/*  {renderDataForm}*/}
              {/*</Panel>*/}
              {(data.node.name == 'biciVarer' ||
                data.node.name == 'echarts' ||
                data.node.name == 'biciCard' ||
                data.node.name == 'biciPilot'||
                data.node.name == 'biciMeasure'
              ) && (
                <Panel header="自定义数据" key="2">
                  {renderExtraDataForm}
                </Panel>
              )}
            </Collapse>
          </TabPane>
        </Tabs>
      )}
      {visible && renderDataPointModal()}
    </div>
  );
});

export default NodeCanvasProps;
