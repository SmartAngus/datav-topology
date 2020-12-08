import type { Topology } from '../../topology/core';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { History } from 'history';
import { Button, Menu, Popover, Tag, Space, Tooltip, message } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { BasicTarget } from 'ahooks/lib/utils/dom';
import { base64ToFile } from '../utils/cacl';
import CustomIcon from '../config/iconConfig';

import styles from './index.module.scss';

message.config({
  getContainer: () => document.querySelector('#editLayout'),
});

const headTools = [
  {
    key: 'cut',
    name: '剪切',
    icon: 'iconjianqie',
    title: 'Ctrl+X',
  },
  {
    key: 'copy',
    name: '复制',
    icon: 'iconfuzhi',
    title: 'Ctrl+C',
  },
  {
    key: 'paste',
    name: '粘贴',
    icon: 'iconniantie',
    title: 'Ctrl+V',
  },
  {
    key: 'undo',
    name: '撤销',
    icon: 'iconchexiao',
    title: 'Ctrl+Z',
  },
  {
    key: 'redo',
    name: '恢复',
    icon: 'iconhuifu',
    title: 'Ctrl+Y',
  },
  {
    key: 'bottom',
    name: '置于底层',
    icon: 'iconzhiyudiceng',
    title: 'Ctrl+Alt+[',
  },
  {
    key: 'down',
    name: '后置一层',
    icon: 'iconhouzhiyiceng',
    title: 'Ctrl+[',
  },
  {
    key: 'up',
    name: '前置一层',
    icon: 'iconqianzhiyiceng',
    title: 'Ctrl+]',
  },
  {
    key: 'top',
    name: '置于顶层',
    icon: 'iconzhiyudingceng',
    title: 'Ctrl+Alt+]',
  },
  {
    key: 'combo',
    name: '编组',
    icon: 'iconbianzu1',
    title: 'Ctrl+G',
  },
  {
    key: 'unCombo',
    name: '解组',
    icon: 'iconjiechubianzu1',
    title: 'Ctrl+U',
  },
];

interface HeaderProps {
  canvas?: Topology;
  history?: History;
  rootRef?: BasicTarget<HTMLElement>;
  isSave?: boolean;
  scaleVal?: number;
  setIsSave?: (value: boolean) => void;
  onExtraSetting?: () => void;
  onScaleCanvas?: (scale: number) => void;
  onEditorSaveCb?: (canvasData: any) => void;
  onPoweroff?: () => void;
  autoSaveInterval?: number;
  onPreview?: (data: any) => void;
  ref?: any;
}

const ButtonGroup = Button.Group;

const Header: React.FC<HeaderProps> = React.forwardRef(
  (props: HeaderProps, ref) => {
    const {
      canvas,
      scaleVal,
      history,
      rootRef,
      isSave,
      setIsSave,
      onScaleCanvas,
    } = props;
    const [isFullscreen, { toggleFull }] = useFullscreen(rootRef);
    const [scaleNumber, setScaleNumber] = useState(canvas?.data.scale); // 缩放的基数

    const [scaleVisible, setScaleVisible] = useState(false); // 缩放Popover的可见

    useEffect(() => {
      if (Math.round(scaleVal * 10) / 10 !== scaleNumber) {
        setScaleNumber(Math.round(scaleVal * 10) / 10);
        setIsSave(false);
      }
    }, [scaleVal]);

    // 对父组件暴露保存数据的接口
    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          handleSave();
        },
      }),
      [isSave]
    );

    // 设置每五分钟保存一次数据
    useEffect(() => {
      const timer = setTimeout(() => {
        handleSave();
      }, 1000 * 60 * (props.autoSaveInterval || 5));
      return () => {
        clearTimeout(timer);
      };
    }, [isSave]);

    const handleSave = () => {
      if (!isSave) {
        setIsSave(true);
        // FileSaver.saveAs(
        //   new Blob([JSON.stringify(canvas.data)], {
        //     type: 'text/plain;charset=utf-8',
        //   }),
        //   `le5le.topology.json`
        // );
        const saveData = new Blob([JSON.stringify(canvas.data)], {
          type: 'text/plain;charset=utf-8',
        });
        const screenshot = base64ToFile(canvas.toImage());
        // canvas.saveAsImage();
        saveData.text().then((r) => {
          const json = JSON.parse(r);
          json.screenshot = screenshot;
          props.onEditorSaveCb && props.onEditorSaveCb(json);
        });
      } else {
        message.warn('数据已经保存！');
      }
    };

    // 处理退出按钮
    const handleExitEditor = () => {
      props.onPoweroff && props.onPoweroff();
    };

    const handleHeaderClick = (key: string) => {
      const pens = canvas.activeLayer.pens;
      switch (key) {
        case 'cut':
          canvas.cut();
          break;
        case 'copy':
          canvas.copy();
          break;
        case 'paste':
          canvas.paste();
          break;
        case 'undo':
          canvas.undo();
          break;
        case 'redo':
          canvas.redo();
          break;
        case 'combo':
          canvas.combine(pens);
          break;
        case 'unCombo':
          pens
            .filter((pen) => pen.name === 'combine')
            .forEach((pen) => canvas.uncombine(pen));
          break;
        case 'bottom':
          pens.forEach((pen) => canvas.bottom(pen));
          break;
        case 'top':
          pens.forEach((pen) => canvas.top(pen));
          break;
        case 'up':
          pens.forEach((pen) => canvas.up(pen));
          break;
        case 'down':
          pens.forEach((pen) => canvas.down(pen));
          break;
        default:
          break;
      }
      setIsSave(false);
    };

    /**
     * 放大画布
     */
    const scaleZoomOut = () => {
      if (scaleNumber < 3) {
        setScaleNumber(scaleNumber + 0.1);
        canvas.scaleTo(scaleNumber + 0.1);
        // onScaleCanvas && onScaleCanvas(scaleNumber + 0.1);
        props.setIsSave(false);
      }
    };

    /**
     * 缩小画布
     */
    const scaleZoomIn = () => {
      if (scaleNumber > 0.3) {
        setScaleNumber(scaleNumber - 0.1);
        canvas.scaleTo(scaleNumber - 0.1);
        // onScaleCanvas && onScaleCanvas(scaleNumber + 0.1);
        props.setIsSave(false);
      }
    };

    /**
     * 点击选择缩放菜单后隐藏
     */
    const handleScalePopClick = (visible) => {
      setScaleVisible(visible);
    };

    /**
     * 处理选择缩放菜单数据
     */
    const handleSelectScaleMenu = (data) => {
      setScaleNumber(parseInt(data.key) / 100);
      canvas.scaleTo(parseInt(data.key) / 100);
      onScaleCanvas && onScaleCanvas(parseInt(data.key) / 100);
      setScaleVisible(false);
      props.setIsSave(false);
    };

    /**
     * 预览
     */
    const handlePreview = () => {
      if (!isSave) {
        message.warn('预览之前请先保存数据！');
      } else {
        if (props.onPreview && typeof props.onPreview == 'function') {
          props.onPreview({});
        } else {
          let reader = new FileReader();
          const result = new Blob([JSON.stringify(canvas.data)], {
            type: 'text/plain;charset=utf-8',
          });
          reader.readAsText(result, 'text/plain;charset=utf-8');
          reader.onload = (e) => {
            history.push({
              pathname: '/preview',
              state: { data: JSON.parse(reader.result as any) },
            });
          };
        }
      }
    };
    /**
     * 点击额外配置
     */
    const handleExtraSetting = () => {
      const { onExtraSetting } = props;
      onExtraSetting && onExtraSetting();
      setIsSave(false);
    };

    /**
     * 缩放比例菜单
     */
    const scaleMenu = (
      <Menu
        onClick={(data) => handleSelectScaleMenu(data)}
        style={{ border: 0 }}
      >
        <Menu.Item key="50">50%</Menu.Item>
        <Menu.Item key="100">100%</Menu.Item>
        <Menu.Item key="150">150%</Menu.Item>
        <Menu.Item key="200">200%</Menu.Item>
        {/* <Menu.Divider />
      <Menu.Item key="adaptive">适应屏幕</Menu.Item> */}
      </Menu>
    );

    return (
      <div className={styles.toolsHeader}>
        <a className={styles.toolItem} onClick={handleExitEditor}>
          <CustomIcon type="icontuichu" />
          <span>退出</span>
        </a>
        {/* <a className={styles.toolItem}>
        <CustomIcon type="icon-lianxian_icon" />
        <span>连线</span>
      </a> */}
        {headTools.map((item) => (
          <Tooltip
            placement="bottom"
            title={item.title}
            key={item.key}
            getPopupContainer={() => document.querySelector('#editLayout')}
          >
            <a
              className={styles.toolItem}
              onClick={() => handleHeaderClick(item.key)}
            >
              <CustomIcon type={item.icon} />
              <span>{item.name}</span>
            </a>
          </Tooltip>
        ))}

        <a
          style={{
            display: 'inline-block',
            marginTop: '5px',
            background: '#F0F0F0',
            borderRadius: '4px',
            height: 36,
            lineHeight: '36px',
          }}
        >
          <Button
            size="small"
            shape="circle"
            icon={<MinusOutlined style={{ color: '#666666' }} />}
            onClick={() => scaleZoomIn()}
          />
          <Popover
            content={scaleMenu}
            trigger="click"
            visible={scaleVisible}
            onVisibleChange={handleScalePopClick}
          >
            <span
              style={{
                margin: '0 12px',
                width: '4ch',
                display: 'inline-block',
              }}
            >
              {Math.round(scaleNumber * 100)}%
            </span>
          </Popover>
          <Button
            size="small"
            shape="circle"
            icon={<PlusOutlined style={{ color: '#666666' }} />}
            onClick={() => scaleZoomOut()}
          />
        </a>
        <a
          className={styles.toolItem}
          style={{ margin: '0 30px' }}
          onClick={toggleFull}
        >
          <CustomIcon type="iconquanping1" />
          <span>{isFullscreen ? '退出全屏' : '全屏'}</span>
        </a>
        <a
          style={{ lineHeight: '48px', marginRight: 30 }}
          onClick={handleExtraSetting}
        >
          <CustomIcon type="iconpeizhikanban" />
          <span style={{ marginLeft: 5 }}>配置看板</span>
        </a>

        <Tag
          color="#F0DCCE"
          visible={!isSave}
          style={{
            color: '#FA6400',
            height: '28px',
            padding: '3px 10px',
            marginTop: '10px',
          }}
        >
          修改未保存
        </Tag>

        <ButtonGroup
          style={{ flex: 1, flexDirection: 'row-reverse', right: 20 }}
        >
          <Space size="large">
            <Button onClick={handlePreview}>预览</Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Space>
        </ButtonGroup>
      </div>
    );
  }
);

export default Header;
