import React, {CSSProperties, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,} from 'react';
import {Lock, Options, s8, Topology} from '../../topology/core';
import {echartsObjs, register as registerChart,} from '../../topology/chart-diagram';
import {register as registerBiciComp} from '../../topology/bici-diagram';
import {message, Modal, Tabs, Tooltip} from 'antd';
import {Tools} from '../config/config';
import {useClickAway} from 'ahooks';
import {replacer, reviver} from '../utils/serializing';
import Header from '../Header';
import NodeComponent from './component/nodeComponent';
import BackgroundComponent from './component/backgroundComponent';
import LineComponent from './component/lineComponent';
import SystemComponent from './LeftAreaComponent/SystemComponent';
import CustomComponent from './LeftAreaComponent/CustomComponent';
import PicComponent from './LeftAreaComponent/PicComponent';

import styles from './index.module.scss';
import CanvasContextMenu from '../canvasContextMenu';
import {DataVEditorProps} from '../data/defines';
import {calcCanvas, eraseOverlapIntervals} from '../utils/cacl';
import * as _ from 'lodash';
import moment from 'moment';
import {getGaugeOption} from '../config/charts/gauge'
import {getTimeLineOption} from "../config/charts/timeline";
import set = Reflect.set;


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
  const [scaleVal, setScaleVal] = useState(1);
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
    // locked: Lock.None
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
  const [showHeader, setShowHeader] = useState(false);
  const svgRef = useRef();
  const canvasRef = useRef();
  const customCompRef = useRef<any>();

  const canvasOptions: Options = {
    rotateCursor: '/rotate.cur',
    autoExpandDistance: 0,
    viewPadding: [0],
    autoAnchor: false,
    cacheLen: 50,
    hideInput: false,
    disableEmptyLine: false,
    disableScale:false,
    minScale:0.2,
    maxScale:3.1,
    color:'#096DD9',
    hoverColor:'#096DD9',
    // activeColor:'#999999',
    rule:false
    // locked: Lock.None
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
      canvas.open(props.editorData);
    }
    if (props.editorData) {
      const w = props.editorData.width as number;
      const h = props.editorData.height as number;
      const r = calcCanvas(w, h);
      setCanvasSizeInfo({ ...r, width: w, height: h });
      canvas.data['gridColor'] = props.editorData.gridColor;
      if (canvas.data.grid) {
        canvas.data.grid = true;
      }
      setIsLoadCanvas(true);
      canvas.scaleContainer( props.editorData.scale)
      canvas.resize({ width: w, height: h });
      canvas.render();
    } else {
      setIsLoadCanvas(false);
    }
    setShowHeader(true);

  }, [props.editorData]);

  useEffect(() => {
    handleScaleCanvas(scaleVal)
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
      // data.id = s8();
      event.dataTransfer.setData('Topology', JSON.stringify(data, replacer));
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
    selected.node.property.dataMax = values.dataMax;
    selected.node.property.dataMin = values.dataMin;
    let lineColors = [];
    (selected.node.property.dataColors || []).map((item) => {
      if (item.checked) {
        let lineColor = [];
        lineColor[0] = Math.abs(
            (item.top- selected.node.property.dataMin)/ (selected.node.property.dataMax-selected.node.property.dataMin));
        lineColor[1] = item.color;
        lineColors.push(lineColor);
      }
    });
    if (lineColors.length == 0) {
      lineColors = undefined;
    }
    selected.node.data.echarts.option = getGaugeOption(
      {
        max: selected.node.property.dataMax,
        min: selected.node.property.dataMin,
        lineColors: lineColors,
        chartTitle: selected.node.property.chartTitle,
        chartTitleChecked: selected.node.property.chartTitleChecked,
        chartUnitChecked: selected.node.property.chartUnitChecked,
        chartUnit: selected.node.property.chartUnit,
      },
      values
    );
  };
  const handleTimeLineOption = (values) => {
    const changedProps = values;

    for (const key in changedProps) {
      if (typeof changedProps[key] === 'object') {
        selected.node.property[key] = changedProps[key];
      } else {
        if (changedProps[key] !== undefined) {
          selected.node[key] = changedProps[key];
        }
      }
    }
    selected.node.data.echarts.option = getTimeLineOption(
      selected.node,
      values,
      undefined
    );
    // 更新图表数据
    echartsObjs[selected.node.id].chart.setOption(
      JSON.parse(JSON.stringify(selected.node.data.echarts.option), reviver)
    );
    echartsObjs[selected.node.id].chart.resize();
    selected.node.elementRendered = false;
    canvas.updateProps(true, [selected.node]);
  };
  // 计量器
  const handleChartMeasureOption = (values) => {
    for (let k in values) {
      if (k.indexOf('-') > 0) {
        let kindex = k.split('-');
        let index = parseInt(kindex[1]);

        selected.node.property.dataColors[index][kindex[0]] = values[k];
      }
    }
    selected.node.property.dataMax = values.dataMax;
    selected.node.property.dataMin = values.dataMin;
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
  };

  /**
   * 数据卡片自定义数据逻辑处理
   */
  const handleBiciCard = (value) => {
    const { cardTitle, showTitle, showLimit } = value;
    if (showTitle !== undefined) {
      selected.node.text = showTitle ? cardTitle : '';
    }
    if (showLimit !== undefined) {
      selected.node.children[1].text = showLimit
        ? `下限: ${
            !isNaN(parseInt(value['limit.bottom'])) ? value['limit.bottom'] : ''
          }   上限: ${
            !isNaN(parseInt(value['limit.top'])) ? value['limit.top'] : ''
          }`
        : '';
    }
    if (selected.node.property.preType !== selected.node.property.limitType) {
      // 切换的标签
      selected.node.children[1].text = ''
    }
    if ('limit.top' in value) {
      // 下限不能高于上限
      const limitTop = value['limit.top'];
      const limitBottom = value['limit.bottom'];
      if (limitTop && limitBottom && limitTop < limitBottom) {
        selected.node.property.limit.top = undefined
        selected.node.property.limit.bottom = undefined
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
      if (lightRange.includes(undefined)) {
        return;
      }

      if (stateType === 'single') {
        const vals = lightRange.map((item) => item?.lightRangeVal);
        const tmpSet = new Set(vals);
        if (tmpSet.size !== vals.length) {
          let tmp = {};
          let lightRangeTmp = _.cloneDeep(lightRange);
          lightRangeTmp = lightRangeTmp.reduce((item, next) => {
            tmp[next.lightRangeVal]
              ? ''
              : (tmp[next.lightRangeVal] = true && item.push(next));
            return item;
          }, []);
          selected.node.property.lightRange = lightRangeTmp;
        }
      } else {
        const vals = lightRange.map((item) => [
          item?.lightRangeBottom,
          item?.lightRangeTop,
        ]);
        if (!vals.flat().includes(undefined)) {
          const nums = eraseOverlapIntervals(vals);
          if (nums.length !== 0) {
            let lightRangeTmp = _.cloneDeep(lightRange);
            nums.forEach((num) => {
              lightRangeTmp.forEach((item, index) => {
                if (
                  item.lightRangeBottom === num[0] &&
                  item.lightRangeTop === num[1]
                ) {
                  lightRangeTmp.splice(index, 1);
                }
              });
            });
            selected.node.property.lightRange = lightRangeTmp;
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
        textAlign,
      } = value;
      const changedProps = {
        rect: {
          x: x ? Number(x) : undefined,
          y: y ? Number(y) : undefined,
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
        },
        font: {
          color,
          textAlign,
          fontSize: isNaN(Number(fontSize)) ? undefined : Number(fontSize),
          fontFamily,
        },
        rotate: isNaN(Number(rotate)) ? undefined : Number(rotate),
        strokeStyle,
        lineWidth: isNaN(Number(lineWidth)) ? undefined : Number(lineWidth),
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
      canvas.updateProps(true, [selected.node]);
    },
    [selected]
  );
  /*当自定义的属性发生变化时*/
  const onHandlePropertyFormValueChange = useCallback(
    (value) => {
      // console.log("自定义属性：",value)
      setIsSave(false);
      canvas.cache();
      // 只能两层嵌套，后期需要更改，如果有多层的话
      // canvas.setValue(selected.node.id, 'setValue');
      // 通知有数据属性更新,会重新渲染画布
      const { name } = selected.node;
      if (name === 'biciCard') {
        selected.node.property.preType = selected.node.property.limitType
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

      switch (name) {
        case 'biciCard':
          handleBiciCard(value);
          break;
        case 'biciPilot':
          handlePilot(value);
          break;
        case 'biciMeasure':
          handleChartMeasureOption(value);
          break;
        case 'biciTimer':
          let y = '';
          let h = '';
          let node = selected.node;
          if (value['date.show']) {
            y = moment().format(value['date.format']);
          }
          if (value['time.show']) {
            h = moment().format(value['time.format']);
          }
          node.text = y + ' ' + h;
          if (node.text == ' ') {
            node.text = moment().format('LLLL');
          }
          canvas.updateProps(false);
          break;
        case 'echarts':
          const theChart = selected.node.property.echartsType;
          if (theChart == 'gauge') {
            handleGaugeOption(value);
          } else if (theChart === 'timeLine') {
            handleTimeLineOption(value);
          }
          break;
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
      selected.node.events = value;
      canvas.updateProps(true, selected.node);
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
   * 当线条表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */
  const onHandleLineFormValueChange = useCallback(
    (value) => {
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
      canvas.updateProps(true, [selected.line]);
      setIsSave(false);
    },
    [selected]
  );

  /**
   * 监听画布上元素的事件
   * @params {string} event - 事件名称
   * @params {object} data - 节点数据
   */

  const onMessage = (event: string, data: any) => {
    const node = data;
    switch (event) {
      case 'resize':
        break
      case 'dblclick':
        setIsSave(false);
        break;
      case 'node': // 节点切换或者点击
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          // locked: Lock.None
        });
        setIsSave(false)
        break;
      case 'addNode':
        setIsSave(false);
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          // locked: Lock.None
        });
        setIsLoadCanvas(true);
        // 老代码，解决拖动图表组件到画布不显示的问题
        // canvas.activeLayer.saveNodeRects();
        // canvas.activeLayer.move(1, 0);
        // canvas.overflow();
        // canvas.animateLayer.animate();
        break;
      case 'delete':
        setIsSave(false);
        setSelected({
          node: undefined,
          line: null,
          multi: false,
          nodes: null,
          // locked: Lock.None
        });
        break;
      case 'line': // 连线
      case 'addLine':
        setIsSave(false);
        setSelected({
          node: null,
          line: data,
          multi: false,
          nodes: null,
          // locked: Lock.None
        });
        break;
      case 'space': // 空白处
        setIsLoadCanvas(true);
        setSelected({
          node: null,
          line: null,
          multi: false,
          nodes: null,
          // locked: Lock.None
        });
        setIsSave(false)
        break;
      case 'rotated':
        let temp = data[0];
        temp.rotate += temp.offsetRotate;
        setIsSave(false);
        setSelected({ ...selected, node: temp });
        break;
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
              // locked: Lock.None
            }
          )
        );
        break;
      case 'scale':
        if (typeof data === 'number') {
          setScaleVal(data);
          scrollCenter()
        }
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
    isLoadCanvas,
    canvas,
  ]);
  /**
   * 处理放大缩小
   * @param scale
   */
  const handleScaleCanvas=(scale:number)=>{
    canvas.render()
    scrollCenter()
  }

  /**
   * 渲染画布右侧区域操作栏
   */
  const renderRightArea = useMemo(() => {
    if (isLoadCanvas) {
      let _component = rightAreaConfig.default;
      Object.keys(rightAreaConfig).forEach((item) => {
        if (selected[item]) {
          _component = rightAreaConfig[item];
        }
      });
      return _component;
    }
  }, [selected, rightAreaConfig, isLoadCanvas]);
  // 渲染头部
  const renderHeader = useMemo(() => {
    if (showHeader) {
      return (
        <Header
          ref={headerRef}
          canvas={canvas}
          history={history}
          rootRef={layoutRef}
          isSave={isSave}
          scaleVal={scaleVal}
          setIsSave={setIsSave}
          onExtraSetting={props.onExtraSetting}
          onEditorSaveCb={props.onEditorSaveCb}
          onPoweroff={props.onPoweroff}
          autoSaveInterval={props.autoSaveInterval}
          onPreview={props.onPreview}
          onScaleCanvas={handleScaleCanvas}
        />
      );
    }
  }, [showHeader, history, layoutRef, isSave, scaleVal, canvas]);
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
        isSave={isSave}
        setIsSave={setIsSave}
        onNeedHide={() => setShowContextmenu(false)}
        combineCom={props.uploadConfig.combineCom}
        getNewComponents={customCompRef.current?.getNewComponents}
      />
    </div>
  );
  const divHeight = document.body.clientHeight-92;
  return (
    <div id="editLayout" ref={layoutRef}>
      {renderHeader}
      <div className={styles.page}>
        {/*<ResizePanel direction="e" style={{ width: 250 }}>*/}
          <div className={styles.tool} style={{overflow:'hidden'}}>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="组件" key="1" style={{ margin: 0 }}>
                <div style={{height:divHeight,overflow:"auto"}}>
                  <SystemComponent onDrag={onDrag} Tools={Tools} />
                  <CustomComponent
                    ref={customCompRef}
                    onDrag={onDrag}
                    combineCom={props.uploadConfig.combineCom}
                  />
                </div>
              </TabPane>
              <TabPane tab="图库" key="2" style={{ margin: 0 }}>
                <PicComponent
                  uploaConfig={props.uploadConfig}
                  industrialLibrary={props.industrialLibrary}
                />
              </TabPane>
            </Tabs>
          </div>
        {/*</ResizePanel>*/}
        <div
          className={styles.full}
          id="full"
          style={{ background: '#f8f9fa' }}
        >
          <div id="topology-canvas-wrapper">
          <svg
            className={styles.svg}
            id="topology-canvas-svg"
            ref={svgRef}
            style={{
              minWidth: canvasSizeInfo.minWidth,
              minHeight: canvasSizeInfo.minHeight,
            }}
          ></svg>
          {props.boardData && (
            <p
              className={styles.titleInfo}
              style={{
                left: canvasSizeInfo.left,
                top: canvasSizeInfo.top,
              }}
            >
              <Tooltip title={props.boardData.code}>
                <span>No.{props.boardData.code}</span>
              </Tooltip>
              <span style={{ margin: '0 5px' }}>/</span>
              <Tooltip title={props.boardData.name}>
                <span>{props.boardData.name}</span>
              </Tooltip>
              <span style={{ margin: '0 5px' }}>/</span>
              <Tooltip title={props.boardData.typeName}>
                <span>{props.boardData.typeName}</span>
              </Tooltip>
              <span style={{ margin: '0 5px' }}>/</span>
              <Tooltip title={props.boardData.remark}>
                <span>{props.boardData.remark}</span>
              </Tooltip>
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
              border: '1px solid #f3f3f3',
            }}
            onContextMenu={handleContextMenu}
          />
        </div>
        </div>
        <div className={styles.props} id="props">
          {renderRightArea}
        </div>
        {renderContextMenu}
      </div>
    </div>
  );
});
