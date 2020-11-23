import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  CSSProperties,
  useRef, useImperativeHandle
} from 'react'
import { Topology, registerNode, Options, Node } from '../../topology/core';
import {
  register as registerChart,
  echartsObjs,
} from '../../topology/chart-diagram';
import { register as registerBiciComp } from '../../topology/bici-diagram';
import {
  flowData,
  flowDataAnchors,
  flowDataIconRect,
  flowDataTextRect,
  flowSubprocess,
  flowSubprocessIconRect,
  flowSubprocessTextRect,
  flowDb,
  flowDbIconRect,
  flowDbTextRect,
  flowDocument,
  flowDocumentAnchors,
  flowDocumentIconRect,
  flowDocumentTextRect,
  flowInternalStorage,
  flowInternalStorageIconRect,
  flowInternalStorageTextRect,
  flowExternStorage,
  flowExternStorageAnchors,
  flowExternStorageIconRect,
  flowExternStorageTextRect,
  flowQueue,
  flowQueueIconRect,
  flowQueueTextRect,
  flowManually,
  flowManuallyAnchors,
  flowManuallyIconRect,
  flowManuallyTextRect,
  flowDisplay,
  flowDisplayAnchors,
  flowDisplayIconRect,
  flowDisplayTextRect,
  flowParallel,
  flowParallelAnchors,
  flowComment,
  flowCommentAnchors,
} from '../../topology/flow-diagram';

import {
  activityFinal,
  activityFinalIconRect,
  activityFinalTextRect,
  swimlaneV,
  swimlaneVIconRect,
  swimlaneVTextRect,
  swimlaneH,
  swimlaneHIconRect,
  swimlaneHTextRect,
  fork,
  forkHAnchors,
  forkIconRect,
  forkTextRect,
  forkVAnchors,
} from '../../topology/activity-diagram';

import {
  simpleClass,
  simpleClassIconRect,
  simpleClassTextRect,
  interfaceClass,
  interfaceClassIconRect,
  interfaceClassTextRect,
} from '../../topology/class-diagram';

import {
  lifeline,
  lifelineAnchors,
  lifelineIconRect,
  lifelineTextRect,
  sequenceFocus,
  sequenceFocusAnchors,
  sequenceFocusIconRect,
  sequenceFocusTextRect,
} from '../../topology/sequence-diagram';
import { Modal, Tabs } from 'antd';
import { Tools } from '../config/config';
import { getNodeById } from '../Service/topologyService';
import { useClickAway } from 'ahooks';
import Header from '../Header';
import NodeComponent from './component/nodeComponent';
import BackgroundComponent from './component/backgroundComponent';
import LineComponent from './component/lineComponent';
import SystemComponent from './LeftAreaComponent/SystemComponent';
import CustomComponent from './LeftAreaComponent/CustomComponent'
import MyComponent from './LeftAreaComponent/MyComponent';

import './index.css';
import CanvasContextMenu from '../canvasContextMenu';
import { DataVEditorProps } from '../data/defines'
const { confirm } = Modal;
const { TabPane } = Tabs;
export let canvas: Topology;

/**
 * 编辑器画布
 * @param history
 * @constructor
 */
export const EditorLayout = (props:DataVEditorProps) => {
  const history = props.history;
  const layoutRef = useRef();
  const contextMenuRef = useRef();
  const [isSave,setIsSave]=useState(true)

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

  useClickAway(() => {
    setShowContextmenu(false);
  }, contextMenuRef);

  useEffect(() => {
    console.log('ref type>>>', typeof layoutRef);
    console.log("industrialLibrary==",props.industrialLibrary)

    window["API_URL"]=props.apiURL
    console.log("apiURL",props.apiURL)

    const canvasOptions: Options = {
      rotateCursor: '/rotate.cur',
      locked: 1,
      autoExpandDistance: 0,
      viewPadding: [100],
      autoAnchor: false,
      cacheLen: 50,
      hideInput: true,
    };
    canvasOptions.on = onMessage;
    canvasRegister();
    canvas = new Topology('topology-canvas', canvasOptions);
    async function getNodeData() {
      const data = await getNodeById(history.location.state.id);
      canvas.open(data.data);
      console.log("history.location.state==",history.location.state)
    }

    if (history.location.state && history.location.state.from === '/preview') {
      confirm({
        title: '是否要保存预览前的数据?',
        okText: '保存',
        cancelText: '取消',
        onOk() {
          history.location.state.data.locked = 0;
          canvas.open(history.location.state.data);
        },
        onCancel() {
          getNodeData();
        },
      });
    } else {
      if (history.location?.state?.id) {
        getNodeData();
      }
    }
    setIsLoadCanvas(true);
  }, [history]);

  useEffect(() => {
    // console.log("isLoadCanvas==",isLoadCanvas)
    // console.log(canvas.data)
  }, []);

  /**
   * 注册图形库
   */
  const canvasRegister = () => {
    registerChart();
    registerBiciComp();
    registerNode(
      'flowData',
      flowData,
      flowDataAnchors,
      flowDataIconRect,
      flowDataTextRect
    );
    registerNode(
      'flowSubprocess',
      flowSubprocess,
      null,
      flowSubprocessIconRect,
      flowSubprocessTextRect
    );
    registerNode('flowDb', flowDb, null, flowDbIconRect, flowDbTextRect);
    registerNode(
      'flowDocument',
      flowDocument,
      flowDocumentAnchors,
      flowDocumentIconRect,
      flowDocumentTextRect
    );
    registerNode(
      'flowInternalStorage',
      flowInternalStorage,
      null,
      flowInternalStorageIconRect,
      flowInternalStorageTextRect
    );
    registerNode(
      'flowExternStorage',
      flowExternStorage,
      flowExternStorageAnchors,
      flowExternStorageIconRect,
      flowExternStorageTextRect
    );
    registerNode(
      'flowQueue',
      flowQueue,
      null,
      flowQueueIconRect,
      flowQueueTextRect
    );
    registerNode(
      'flowManually',
      flowManually,
      flowManuallyAnchors,
      flowManuallyIconRect,
      flowManuallyTextRect
    );
    registerNode(
      'flowDisplay',
      flowDisplay,
      flowDisplayAnchors,
      flowDisplayIconRect,
      flowDisplayTextRect
    );
    registerNode('flowParallel', flowParallel, flowParallelAnchors, null, null);
    registerNode('flowComment', flowComment, flowCommentAnchors, null, null);

    // activity
    registerNode(
      'activityFinal',
      activityFinal,
      null,
      activityFinalIconRect,
      activityFinalTextRect
    );
    registerNode(
      'swimlaneV',
      swimlaneV,
      null,
      swimlaneVIconRect,
      swimlaneVTextRect
    );
    registerNode(
      'swimlaneH',
      swimlaneH,
      null,
      swimlaneHIconRect,
      swimlaneHTextRect
    );
    registerNode('forkH', fork, forkHAnchors, forkIconRect, forkTextRect);
    registerNode('forkV', fork, forkVAnchors, forkIconRect, forkTextRect);

    // class
    registerNode(
      'simpleClass',
      simpleClass,
      null,
      simpleClassIconRect,
      simpleClassTextRect
    );
    registerNode(
      'interfaceClass',
      interfaceClass,
      null,
      interfaceClassIconRect,
      interfaceClassTextRect
    );

    // sequence
    registerNode(
      'lifeline',
      lifeline,
      lifelineAnchors,
      lifelineIconRect,
      lifelineTextRect
    );
    registerNode(
      'sequenceFocus',
      sequenceFocus,
      sequenceFocusAnchors,
      sequenceFocusIconRect,
      sequenceFocusTextRect
    );
  };

  const onDrag = (event, node, custom=false) => {
    if(custom){
      event.dataTransfer.setData('Text', JSON.stringify(node));
    }else{
      event.dataTransfer.setData('Text', JSON.stringify(node.data));
    }
  };

  /**
   * 当表单数据变化时, 重新渲染canvas
   * @params {object} value - 图形的宽度,高度, x, y等等
   */
  const onHandleFormValueChange = useCallback(
    (value) => {
      const {
        rotate,
        data,
        lineWidth,
        strokeStyle,
        dash,
        color,
        fontSize,
        fontFamily,
        text,
        fillStyle,
        ...other
      } = value;
      console.log('改变直>>>', value);
      const changedValues = {
        node: {
          rect: other,
          font: { color, fontSize, fontFamily },
          rotate,
          lineWidth,
          strokeStyle,
          fillStyle,
          dash,
          // text,
          data,
        },
      };

      if (changedValues.node) {
        // 遍历查找修改的属性，赋值给原始Node
        for (const key in changedValues.node) {
          if (Array.isArray(changedValues.node[key])) {
          } else if (typeof changedValues.node[key] === 'object') {
            for (const k in changedValues.node[key]) {
              selected.node[key][k] = changedValues.node[key][k];
            }
          } else {
            selected.node[key] = changedValues.node[key];
          }
        }
      }
      // 背景纯色
      // selected.node['bkType'] = 0;
      canvas.updateProps(selected.node);
    },
    [selected]
  );
  /*当自定义的属性发生变化时*/
  const onHandlePropertyFormValueChange = useCallback(
    (value) => {
      console.log('>>>', value);
      // 只能两层嵌套，后期需要更改，如果有多层的话
      canvas.setValue(selected.node.id, 'setValue');
      // 通知有数据属性更新,会重新渲染画布
      canvas.updateProps(false);
      for (const key in value) {
        if (key.indexOf('.') > 0) {
          if (key != undefined) {
            const k = key.split('.');
            selected.node.property[k[0]][k[1]] = value[key];
          }
        } else {
          if (value[key] !== undefined) {
            if (Array.isArray(value[key])) {
            } else {
              selected.node.property[key] = value[key];
            }
          }
        }
      }
    },
    [selected]
  );

  const onEventValueChange = useCallback(
    (value) => {
      selected.node.events = value;
      canvas.updateProps(selected.node);
    },
    [selected]
  );

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
      canvas.updateProps(selected.line);
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
    console.log('监听画布上元素的事件>>>', event);
    switch (event) {
      case 'node': // 节点
      case 'addNode':
        setIsSave(false)
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          locked: data.locked,
        });
        break;
      case 'line': // 连线
      case 'addLine':
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
        setIsSave(false)
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
        />
      ), // 渲染Node节点类型的组件
      line: selected && (
        <LineComponent
          data={selected}
          onFormValueChange={onHandleLineFormValueChange}
        />
      ), // 渲染线条类型的组件
      default: canvas && <BackgroundComponent data={canvas} websocketConf={props.websocketConf}/>, // 渲染画布背景的组件
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
      return <Header
        canvas={canvas}
        history={history}
        rootRef={layoutRef}
        isSave={isSave}
        setIsSave={setIsSave}
        onExtraSetting={props.onExtraSetting}
      />;
  }, [isLoadCanvas, history, layoutRef,isSave]);
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
      <CanvasContextMenu data={selected} canvas={canvas} show={showContextmenu} combineCom={props.uploadConfig.combineCom} />
    </div>
  )
  return (
    <div id="layout" ref={layoutRef}>
      {renderHeader}
      <div className="page">
        <div className="tool">
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="组件" key="1" style={{ margin: 0 }}>
              <SystemComponent onDrag={onDrag} Tools={Tools} />
              <CustomComponent  onDrag={onDrag} Tools={Tools} combineCom={props.uploadConfig.combineCom}/>
            </TabPane>
            <TabPane tab="图库" key="2" style={{ margin: 0 }}>
              <MyComponent />
            </TabPane>
          </Tabs>
        </div>
        <div className="full">
          <div>
            <div
              id="topology-canvas"
              style={{ height: 768, width: 1366, background: '#fff' }}
              onContextMenu={handleContextMenu}
            />
          </div>
        </div>
        <div className="props">{renderRightArea}</div>
        {renderContextMenu}
      </div>
    </div>
  );
};
