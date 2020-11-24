import React, { useEffect, useState } from 'react';
import { Topology } from '../../topology/core';
import { History } from 'history';
import { Button, Menu, Popover, Tag, Space } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { BasicTarget } from 'ahooks/lib/utils/dom';
import CustomIcon from '../config/iconConfig';
import styles from './index.module.scss';

interface HeaderProps {
  canvas?: Topology;
  history?: History;
  rootRef?: BasicTarget<HTMLElement>;
  isSave?: boolean;
  setIsSave?: (value: boolean) => void;
  onExtraSetting?: () => void;
  onScaleCanvas?:(scale:number)=>void;
}

const ButtonGroup = Button.Group;

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { canvas, history, rootRef, isSave, setIsSave,onScaleCanvas } = props;

  const [isFullscreen, { toggleFull }] = useFullscreen(rootRef);
  const [scaleNumber, setScaleNumber] = useState(1); // 缩放的基数

  const [scaleVisible, setScaleVisible] = useState(false); // 缩放Popover的可见

  useEffect(() => {
    canvas.updateProps(false);
  }, [canvas]);

  const handleSave = () => {
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
    console.log('save data>>>');
    saveData.text().then((r) => {
      console.log(JSON.parse(r));
    });
  };

  /**
   * 成组
   * @param key 'combo': 成组  'unCombo': 解组
   */
  const handleCombine = (key: string) => {
    const pens = canvas.activeLayer.pens;
    switch (key) {
      case 'combo':
        canvas.combine(pens);
        break;
      case 'unCombo':
        pens
          .filter((pen) => pen.name === 'combine')
          .forEach((pen) => canvas.uncombine(pen));
        break;
      default:
        break;
    }
  };

  /**
   * 置于顶层(top)、置于底层(bottom)、上移一层(up)、下移一层(down)
   */
  const nodePanelLevel = (key: string) => {
    // 获取选中的节点
    const pens = canvas.activeLayer.pens;
    pens.forEach((pen) => {
      switch (key) {
        case 'bottom':
          canvas.bottom(pen);
          return;
        case 'top':
          canvas.top(pen);
          return;
        case 'up':
          canvas.up(pen);
          return;
        case 'down':
          canvas.down(pen);
          return;
        default:
          return;
      }
    });
  };

  /**
   * 放大画布
   */
  const scaleZoomOut = () => {
    if (scaleNumber < 3) {
      setScaleNumber(scaleNumber + 0.1);
      // canvas.scaleTo(scaleNumber + 0.1);
      onScaleCanvas&&onScaleCanvas(scaleNumber + 0.1)
    }
  };

  /**
   * 缩小画布
   */
  const scaleZoomIn = () => {
    if (scaleNumber > 0.3) {
      setScaleNumber(scaleNumber - 0.1);
      // canvas.scaleTo(scaleNumber - 0.1);
      onScaleCanvas&&onScaleCanvas(scaleNumber + 0.1)
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
    if (data.key === 'adaptive') {
    } else {
      setScaleNumber(parseInt(data.key) / 100);
      // canvas.scaleTo(parseInt(data.key) / 100);
      onScaleCanvas&&onScaleCanvas(parseInt(data.key) / 100)
    }
    setScaleVisible(false);
  };

  /**
   * 预览
   */
  const handlePreview = () => {
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
  };
  /**
   * 点击额外配置
   */
  const handleExtraSetting = () => {
    const { onExtraSetting } = props;
    onExtraSetting && onExtraSetting();
  };

  /**
   * 缩放比例菜单
   */
  const scaleMenu = (
    <Menu onClick={(data) => handleSelectScaleMenu(data)} style={{ border: 0 }}>
      <Menu.Item key="50">50%</Menu.Item>
      <Menu.Item key="100">100%</Menu.Item>
      <Menu.Item key="150">150%</Menu.Item>
      <Menu.Item key="200">200%</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="adaptive">适应屏幕</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.toolsHeader}>
      <a
        className={styles.toolItem}
        onClick={() => console.log('canvas>>>', canvas)}
      >
        <CustomIcon type="icon-exit" />
        <span>退出</span>
      </a>
      {/* <a className={styles.toolItem}>
        <CustomIcon type="icon-lianxian_icon" />
        <span>连线</span>
      </a> */}
      <a className={styles.toolItem} onClick={() => canvas.cut()}>
        <CustomIcon type="icon-jianqie" />
        <span>剪切</span>
      </a>
      <a className={styles.toolItem} onClick={() => canvas.copy()}>
        <CustomIcon type="icon-fuzhi" />
        <span>复制</span>
      </a>
      <a className={styles.toolItem} onClick={() => canvas.paste()}>
        <CustomIcon type="icon-niantie" />
        <span>粘贴</span>
      </a>
      <a className={styles.toolItem} onClick={() => canvas.undo()}>
        <CustomIcon type="icon-chexiao" />
        <span>撤销</span>
      </a>
      <a className={styles.toolItem} onClick={() => canvas.redo()}>
        <CustomIcon type="icon-icon_huifu" />
        <span>恢复</span>
      </a>
      <a className={styles.toolItem} onClick={() => nodePanelLevel('bottom')}>
        <CustomIcon type="icon-zhiyudiceng" />
        <span>置于底层</span>
      </a>
      <a className={styles.toolItem} onClick={() => nodePanelLevel('down')}>
        <CustomIcon type="icon-zhiyudiceng" />
        <span>后置一层</span>
      </a>
      <a className={styles.toolItem} onClick={() => nodePanelLevel('up')}>
        <CustomIcon type="icon-ziyuan" />
        <span>前置一层</span>
      </a>
      <a className={styles.toolItem} onClick={() => nodePanelLevel('top')}>
        <CustomIcon type="icon-ziyuan" />
        <span>置于顶层</span>
      </a>
      <a className={styles.toolItem} onClick={() => handleCombine('combo')}>
        <CustomIcon type="icon-jianlizuhe" />
        <span>编组</span>
      </a>
      <a className={styles.toolItem} onClick={() => handleCombine('unCombo')}>
        <CustomIcon type="icon-quxiaozuhe" />
        <span>解组</span>
      </a>
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
        <CustomIcon type="icon-quanping" />
        <span>{isFullscreen ? '退出全屏' : '全屏'}</span>
      </a>
      <a
        style={{ lineHeight: '48px', marginRight: 30 }}
        onClick={handleExtraSetting}
      >
        <CustomIcon type="icon-peizhi-" />
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

      <ButtonGroup style={{ flex: 1, flexDirection: 'row-reverse', right: 20 }}>
        <Space size="large">
          <Button onClick={handlePreview}>预览</Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      </ButtonGroup>
    </div>
  );
};

export default Header;
