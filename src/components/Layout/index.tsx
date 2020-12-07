import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  CSSProperties,
  useRef,
  useImperativeHandle,
} from 'react';
import { Topology, Options, Node } from '../../topology/core';
import {
  register as registerChart,
  echartsObjs,
} from '../../topology/chart-diagram';
import { register as registerBiciComp } from '../../topology/bici-diagram';
import { Modal, Tabs, message, Space } from 'antd';
import { Tools } from '../config/config';
import { useClickAway } from 'ahooks';
import {replacer, reviver} from '../utils/serializing';
import { s8 } from '../../topology/core/src/utils/uuid';
import Header from '../Header';
import NodeComponent from './component/nodeComponent';
import BackgroundComponent from './component/backgroundComponent';
import LineComponent from './component/lineComponent';
import SystemComponent from './LeftAreaComponent/SystemComponent';
import CustomComponent from './LeftAreaComponent/CustomComponent';
import MyComponent from './LeftAreaComponent/PicComponent';

import styles from './index.module.scss';
import CanvasContextMenu from '../canvasContextMenu';
import { DataVEditorProps } from '../data/defines';
import { calcCanvas, eraseOverlapIntervals } from '../utils/cacl';
import ResizePanel from '../common/resizeSidebar';
import {getGaugeOption, getMeasureOption2, getTimelineOption} from '../config/chartMeasure';
const { confirm } = Modal;
const { TabPane } = Tabs;
export let canvas: Topology;

/**
 * 编辑器画布
 * @param history
 * @constructor
 */
export const EditorLayout = React.forwardRef((props: DataVEditorProps, ref) => {
  const history = props.history;
  const layoutRef = useRef();
  const contextMenuRef = useRef();
  const headerRef = useRef();
  const [isSave, setIsSave] = useState(true);
  const [bkImageUrl, setBkImageUrl] = useState('');

  const [canvasSizeInfo, setCanvasSizeInfo] = useState({
    minWidth: 3199,
    minHeight: 2289,
    left: 1168,
    top: 560,
    width: props?.editorData?.width || 826,
    height: props?.editorData?.height || 1168,
  });

  const [selected, setSelected] = useState({
    node: null,
    line: null,
    multi: false,
    nodes: null,
    locked: 0,
  });

  // 是否显示右键菜单
  const [showContextmenu, setShowContextmenu] = useState(false);

  const [contextmenu, setContextmenu] = useState({
    position: 'fixed',
    zIndex: '10',
    display: 'none',
    left: '',
    top: '',
    bottom: '',
  });

  const [isLoadCanvas, setIsLoadCanvas] = useState(false);
  const svgRef = useRef();
  const canvasRef = useRef();
  const customCompRef = useRef<any>();

  const canvasOptions: Options = {
    rotateCursor: '/rotate.cur',
    locked: 1,
    autoExpandDistance: 0,
    viewPadding: [0],
    autoAnchor: false,
    cacheLen: 50,
    hideInput: false,
    disableEmptyLine: true,
  };

  useClickAway(() => {
    setShowContextmenu(false);
  }, contextMenuRef);

  // 对父组件暴露保存数据的接口
  useImperativeHandle(
    ref,
    () => ({
      getIsSave: () => {
        return isSave;
      },
      handleSaveData: () => {
        if (headerRef !== undefined) {
          (headerRef as any).current.save();
        }
      },
    }),
    [isSave]
  );

  useEffect(() => {
    window['API_URL'] = props.apiURL;
    window['token'] = props.token;
    canvasOptions.on = onMessage;
    canvasRegister();
    canvas = new Topology('topology-canvas', canvasOptions);
    if (props.editorData != undefined && typeof props.editorData == 'object') {
      props.editorData.locked = 0;
      canvas.open(props.editorData);
    }
    if (props.editorData) {
      const w = props.editorData.width as number;
      const h = props.editorData.height as number;
      const r = calcCanvas(w, h);
      setCanvasSizeInfo({ ...r, width: w, height: h });
      canvas.data['gridColor'] = props.editorData.gridColor;
      canvas.setGrid(undefined, props.editorData.gridColor);
      canvas.createGrid(true);
      if (canvas.data.grid) {
        canvas.showGrid(true);
      }
      canvas.resize({ width: w, height: h });
      canvas.render();
    }

    setIsLoadCanvas(true);
  }, [props.editorData]);

  useEffect(() => {
    scrollCenter();
  }, [canvasSizeInfo]);

  /**
   * 滚动条居中
   */
  const scrollCenter = () => {
    const fullDiv = document.querySelector('#full') as HTMLElement;
    fullDiv.scrollTo(
      (fullDiv.scrollWidth - fullDiv.offsetWidth) / 2,
      (fullDiv.scrollHeight - fullDiv.offsetHeight) / 2
    );
  };

  /**
   * 注册图形库
   */
  const canvasRegister = () => {
    registerChart();
    registerBiciComp();
  };

  const onDrag = (event, node, custom = false) => {
    if (custom) {
      let data = node;
      data.id = s8();
      event.dataTransfer.setData('Topology', JSON.stringify(node));
    } else {
      event.dataTransfer.setData(
        'Topology',
        JSON.stringify(node.data, replacer)
      );
    }
  };
  const handleGaugeOption = (values) => {
    for (let k in values) {
      let kindex = k.split('-');
      let index = parseInt(kindex[1]);
      if (k.indexOf('-') > 0) {
        selected.node.property.dataColors[index][kindex[0]] = values[k];
      }
    }
    selected.node.property.dataMax = values.dataMax || 100;
    selected.node.property.dataMin = values.dataMin || 0;
    let lineColors = [];
    (selected.node.property.dataColors || []).map((item) => {
      if (item.checked) {
        let lineColor = [];
        lineColor[0] = Math.abs(item.top / selected.node.property.dataMax);
        lineColor[1] = item.color;
        lineColors.push(lineColor);
      }
    });
    if (lineColors.length == 0) {
      lineColors = undefined;
    }
    selected.node.data.echarts.option = getGaugeOption({
      max: selected.node.property.dataMax,
      min: selected.node.property.dataMin,
      lineColors: lineColors,
    });
  };
  const handleTimeLineOption=(values)=>{
    const changedProps = values;
    console.log(values)
    for (const key in changedProps) {
      if (typeof changedProps[key] === 'object') {
        for (const k in changedProps[key]) {
          if (changedProps[key][k] !== undefined) {
            selected.node[key][k] = changedProps[key][k];
          }
        }
      } else {
        if (changedProps[key] !== undefined) {
          selected.node[key] = changedProps[key];
        }
      }
    }
    selected.node.data.echarts.option=getTimelineOption(selected.node,undefined,values);
    console.log(selected.node.data.echarts.option)
    // 更新图表数据
    echartsObjs[selected.node.id].chart.setOption(
        JSON.parse(JSON.stringify(selected.node.data.echarts.option), reviver)
    );
    echartsObjs[selected.node.id].chart.resize();
    selected.node.elementRendered = true;
  }

  const handleChartMeasureOption = (values) => {
    for (let k in values) {
      let kindex = k.split('-');
      let index = parseInt(kindex[1]);
      if (k.indexOf('-') > 0) {
        selected.node.property.dataColors[index][kindex[0]] = values[k];
      }
    }
    selected.node.property.dataMax = values.dataMax || 100;
    selected.node.property.dataMin = values.dataMin || 0;
    let lineColors = [];
    (selected.node.property.dataColors || []).map((item) => {
      if (item.checked) {
        let lineColor = [];
        lineColor[0] = Math.abs(item.top / selected.node.property.dataMax);
        lineColor[1] = item.color;
        lineColors.push(lineColor);
      }
    });
    if (lineColors.length == 0) {
      lineColors = undefined;
    }
    selected.node.data.echarts.option = getMeasureOption2({
      associationObject:
      selected.node.property.dataPointSelectedRows[0]?.associationObject,
      value: 0,
      max: selected.node.property.dataMax,
      min: selected.node.property.dataMin,
      dataColors: selected.node.property.dataColors,
    });
  };

  /**
   * 数据卡片自定义数据逻辑处理
   */
  const handleBiciCard = (value) => {
    const { cardTitle, showTitle, showLimit } = value;
    if (showTitle !== undefined) {
      const titleVal = showTitle ? cardTitle : '';
      selected.node.text = titleVal;
    }
    if (showLimit !== undefined) {
      const limitText = showLimit
        ? `上限: ${value['limit.top']}   下限: ${value['limit.bottom']}`
        : '';
      selected.node.children[1].text = limitText;
    }
    if ('limit.top' in value) {
      // 下限不能高于上限
      const limitTop = value['limit.top'];
      const limitBottom = value['limit.bottom'];
      if ((limitTop !== 0 || limitBottom !== 0) && limitTop <= limitBottom) {
        message.error('上限不能低于或等于下限');
      }
    }
    if ('normal.showBkColor' in value) {
      if (value['normal.showBkColor']) {
        selected.node.fillStyle = value['normal.bkColor'];
      } else {
        selected.node.fillStyle = '';
      }
    }
    if ('normal.fontSize' in value) {
      selected.node.children[0].font.fontSize = value['normal.fontSize'];
    }
    if ('normal.color' in value) {
      selected.node.children[0].font.color = value['normal.color'];
    }
  };
  /**
   * 指示灯自定义数据处理
   */
  const handlePilot = (value) => {
    const { color, text, showText, stateType, lightRange } = value;
    selected.node.strokeStyle = color;
    selected.node.text = showText ? text : '';
    if (lightRange.length > 0) {
      message.config({
        getContainer: () => document.querySelector('#editLayout'),
      });
      if (stateType === 'single') {
        const vals = lightRange.map((item) => item?.lightRangeVal);
        const tmpSet = new Set(vals);
        if (tmpSet.size !== vals.length) {
          message.error('单点值不能重复');
          selected.node.property.rangeIsOk = false;
        }
      } else {
        const vals = lightRange.map((item) => [
          item?.lightRangeBottom,
          item?.lightRangeTop,
        ]);
        if (!vals.flat().includes(undefined)) {
          const nums = eraseOverlapIntervals(vals);
          if (nums !== 0) {
            message.error('范围值区间不能重叠');
            selected.node.property.rangeIsOk = false;
          }
        }
      }
    }
  };

  /**
   * 当表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */
  const onHandleFormValueChange = useCallback(
    (value) => {
      setIsSave(false);
      canvas.cache();
      const {
        x,
        y,
        width,
        height,
        rotate,
        color,
        fontSize,
        fontFamily,
        fillStyle,
        strokeStyle,
        lineWidth,
        text,
      } = value;
      const rotate2 = rotate === '' ? 0 : rotate;

      const changedProps = {
        rect: {
          x: x ? Number(x) : undefined,
          y: y ? Number(y) : undefined,
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
        },
        font: {
          color,
          fontSize: fontSize ? Number(fontSize) : 12,
          fontFamily,
        },
        rotate: rotate2,
        strokeStyle,
        lineWidth: lineWidth ? Number(lineWidth) : 1,
        fillStyle,
        text,
      };
      for (const key in changedProps) {
        if (typeof changedProps[key] === 'object') {
          for (const k in changedProps[key]) {
            if (changedProps[key][k] !== undefined) {
              selected.node[key][k] = changedProps[key][k];
            }
          }
        } else {
          if (changedProps[key] !== undefined) {
            selected.node[key] = changedProps[key];
          }
        }
      }
      canvas.updateProps(false, [selected.node]);
    },
    [selected]
  );
  /*当自定义的属性发生变化时*/
  const onHandlePropertyFormValueChange = useCallback(
    (value) => {
      setIsSave(false);
      canvas.cache();
      // 只能两层嵌套，后期需要更改，如果有多层的话
      // canvas.setValue(selected.node.id, 'setValue');
      // 通知有数据属性更新,会重新渲染画布

      const { name } = selected.node;
      switch (name) {
        case 'biciCard':
          handleBiciCard(value);
          break;
        case 'biciPilot':
          handlePilot(value);
          break;
        case 'echarts':
          const theChart = selected.node.property.echartsType;
          if (theChart == 'gauge') {
            handleGaugeOption(value);
          } else if (theChart == 'chartMeasure') {
            console.log('cheart props');
            handleChartMeasureOption(value);
          }else if(theChart==='timeLine'){
            handleTimeLineOption(value)
          }
          break;
      }

      for (const key in value) {
        if (key.indexOf('.') > 0) {
          if (key != undefined) {
            const k = key.split('.');
            selected.node.property[k[0]][k[1]] = value[key];
          }
        } else {
          if (value[key] !== undefined) {
            selected.node.property[key] = value[key];
          }
        }
      }
      setIsSave(false);
      // 更新属性变化
      canvas.updateProps(false, [selected.node]);
    },
    [selected]
  );

  const onEventValueChange = useCallback(
    (value) => {
      setIsSave(false);
      canvas.cache();
      selected.node.events = value;
      canvas.updateProps(selected.node);
    },
    [selected]
  );
  /**
   * 切换画布大小
   */
  const handleChangeCanvasSize = useCallback((sizeInfo) => {
    setIsSave(false);
    canvas.cache();
    setCanvasSizeInfo(sizeInfo);
  }, []);
  /**
   * 切换画布背景图片
   */
  const handleChangeBkImage = useCallback((imgUrl) => {
    setIsSave(false);
    canvas.cache();
    setBkImageUrl(imgUrl);
  }, []);
  /**
   * 缩放画布
   * @param scaleKey 缩放系数
   */
  const handleScaleCanvas = (scaleKey) => {
    // const  width=canvasSizeInfo.width*scaleKey;
    // const height=canvasSizeInfo.height*scaleKey;
    // const r = calcCanvas(width,height)
    // setCanvasSizeInfo({...r,width,height})
  };

  /**
   * 当线条表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */
  const onHandleLineFormValueChange = useCallback(
    (value) => {
      setIsSave(false);
      canvas.cache();
      const {
        dash,
        lineWidth,
        strokeStyle,
        name,
        fromArrow,
        toArrow,
        ...other
      } = value;
      const changedValues = {
        line: {
          rect: other,
          lineWidth,
          dash,
          strokeStyle,
          name,
          fromArrow,
          toArrow,
        },
      };
      if (changedValues.line) {
        // 遍历查找修改的属性，赋值给原始line
        for (const key in changedValues.line) {
          if (Array.isArray(changedValues.line[key])) {
          } else if (typeof changedValues.line[key] === 'object') {
            for (const k in changedValues.line[key]) {
              selected.line[key][k] = changedValues.line[key][k];
            }
          } else {
            selected.line[key] = changedValues.line[key];
          }
        }
      }
      canvas.updateProps(selected.line);
      setIsSave(false);
    },
    [selected]
  );

  /**
   * 监听画布上元素的事件
   * @params {string} event - 事件名称
   * @params {object} data - 节点数据
   */

  const onMessage = (event: string, data: Node) => {
    const node = data;
    // console.log('onMessage==', event);
    switch (event) {
      case 'node': // 节点切换或者点击
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      case 'addNode':
        setIsSave(false);
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      case 'delete':
        setIsSave(false);
        break;
      case 'line': // 连线
      case 'addLine':
        setIsSave(false);
        setSelected({
          node: null,
          line: data,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      case 'space': // 空白处
        setSelected({
          node: null,
          line: null,
          multi: false,
          nodes: null,
          locked: null,
        });
        break;
      case 'rotated':
      case 'move':
        setIsSave(false);
        setSelected(
          Object.assign(
            {},
            {
              ...selected,
              node: data[0],
            }
          )
        );
        break;
      case 'resizePens':
        setIsSave(false);
        setSelected(
          Object.assign(
            {},
            {
              ...selected,
              node: data[0],
            }
          )
        );
        // 重新绘制图表
        if (node.name == 'echarts') {
          const chart = echartsObjs[node.id].chart;
          chart.setOption(data.data.echarts.option, true);
        }
        break;
      case 'multi':
        setSelected(
          Object.assign(
            {},
            {
              node: data[0],
              line: null,
              multi: true,
              nodes: data,
              locked: 0,
            }
          )
        );
        break;
      default:
        break;
    }
  };

  /**
   * 画布右侧配置区域
   */
  const rightAreaConfig = useMemo(() => {
    return {
      node: selected && (
        <NodeComponent
          data={selected}
          onFormValueChange={onHandleFormValueChange}
          onEventValueChange={onEventValueChange}
          onPropertyFormValueChange={onHandlePropertyFormValueChange}
          setIsSave={setIsSave}
        />
      ), // 渲染Node节点类型的组件
      line: selected && (
        <LineComponent
          data={selected}
          onFormValueChange={onHandleLineFormValueChange}
        />
      ), // 渲染线条类型的组件
      default: canvas && (
        <BackgroundComponent
          data={canvas}
          baseUrl={props.apiURL}
          websocketConf={props.websocketConf}
          preInstallBgImages={props.preInstallBgImages}
          svgRef={svgRef}
          canvasRef={canvasRef}
          onChangeCanvasSize={handleChangeCanvasSize}
          onChangeBkImage={handleChangeBkImage}
          isSave={isSave}
          setIsSave={setIsSave}
        />
      ), // 渲染画布背景的组件
    };
  }, [
    selected,
    onHandleFormValueChange,
    onHandleLineFormValueChange,
    onEventValueChange,
  ]);

  /**
   * 渲染画布右侧区域操作栏
   */
  const renderRightArea = useMemo(() => {
    let _component = rightAreaConfig.default;
    Object.keys(rightAreaConfig).forEach((item) => {
      if (selected[item]) {
        _component = rightAreaConfig[item];
      }
    });
    return _component;
  }, [selected, rightAreaConfig]);
  // 渲染头部
  const renderHeader = useMemo(() => {
    if (isLoadCanvas)
      return (
        <Header
          ref={headerRef}
          canvas={canvas}
          history={history}
          rootRef={layoutRef}
          isSave={isSave}
          setIsSave={setIsSave}
          onExtraSetting={props.onExtraSetting}
          onScaleCanvas={handleScaleCanvas}
          onEditorSaveCb={props.onEditorSaveCb}
          onPoweroff={props.onPoweroff}
          autoSaveInterval={props.autoSaveInterval}
          onPreview={props.onPreview}
        />
      );
  }, [isLoadCanvas, history, layoutRef, isSave]);
  // 右键菜单
  const handleContextMenu = (event) => {
    setShowContextmenu(!showContextmenu);
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
  const renderContextMenu = (
    <div style={contextmenu as CSSProperties} ref={contextMenuRef}>
      <CanvasContextMenu
        data={selected}
        canvas={canvas}
        show={showContextmenu}
        onNeedHide={() => setShowContextmenu(false)}
        combineCom={props.uploadConfig.combineCom}
        getNewComponents={customCompRef.current?.getNewComponents}
      />
    </div>
  );
  return (
    <div id="editLayout" ref={layoutRef}>
      {renderHeader}
      <div className={styles.page}>
        <ResizePanel direction="e" style={{ width: 250 }}>
          <div className={styles.tool}>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="组件" key="1" style={{ margin: 0 }}>
                <SystemComponent onDrag={onDrag} Tools={Tools} />
                <CustomComponent
                  ref={customCompRef}
                  onDrag={onDrag}
                  combineCom={props.uploadConfig.combineCom}
                />
              </TabPane>
              <TabPane tab="图库" key="2" style={{ margin: 0 }}>
                <MyComponent uploaConfig={props.uploadConfig} />
              </TabPane>
            </Tabs>
          </div>
        </ResizePanel>
        <div
          className={styles.full}
          id="full"
          style={{ background: '#f8f9fa' }}
        >
          <svg
            className={styles.svg}
            ref={svgRef}
            style={{
              minWidth: canvasSizeInfo.minWidth,
              minHeight: canvasSizeInfo.minHeight,
            }}
          ></svg>
          {props.boardData && (
            <p className={styles.titleInfo}>
              <span>{props.boardData.name}</span>
              <span style={{ margin: '0 5px' }}>/</span>
              <span>{props.boardData.typeName}</span>
              <span style={{ margin: '0 5px' }}>/</span>
              <span>{props.boardData.remark}</span>
            </p>
          )}
          <div
            className={styles.topology_canvas}
            ref={canvasRef}
            id="topology-canvas"
            style={{
              position: 'absolute',
              borderWidth: 1,
              overflow: 'hidden',
              left: canvasSizeInfo.left,
              top: canvasSizeInfo.top,
              width: canvasSizeInfo.width,
              height: canvasSizeInfo.height,
              background: '#fff',
              boxShadow: '0px 0px 2px 1px #d1d1d1',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
              // backgroundImage: `url(${bkImageUrl})`,
              border: '1px solid #f3f3f3',
            }}
            onContextMenu={handleContextMenu}
          />
        </div>
        <div className={styles.props} id="props">
          {renderRightArea}
        </div>
        {renderContextMenu}
      </div>
    </div>
  );
});
