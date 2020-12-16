import React, { Component } from 'react';

import { Topology, Node, Line, Lock } from '../../topology/core';

import styles from './index.module.scss';
import { Form, Input, Modal, message } from 'antd';
import { FormInstance } from 'antd/es/form';
import { client, clientParam } from '../data/api';
import {replacer} from "../utils/serializing";

export interface CanvasContextMenuProps {
  data: {
    node?: Node;
    line?: Line;
    multi?: boolean;
    nodes?: Node[];
    locked?: Lock;
  };
  canvas: Topology;
  show?: boolean;
  combineCom?: any;
  onNeedHide?: () => void;
  getNewComponents?: () => void;
  isSave?: boolean;
  setIsSave?: (value: boolean) => void;
}

export default class CanvasContextMenu extends Component<
  CanvasContextMenuProps
> {
  state = {
    newComVisible: false,
    componentName: '添加到自定义组件',
  };
  formRef = React.createRef<FormInstance>();
  saveNewComponent(params) {
    return clientParam(this.props.combineCom.apiURL).post(
      this.props.combineCom.add.url,
      params,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: this.props.combineCom.token,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  onTop() {
    if (this.props.data.node) {
      this.props.canvas.top(this.props.data.node);
    }

    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        this.props.canvas.top(item);
      }
    }

    this.props.canvas.render();
    this.props.onNeedHide();
    this.props.setIsSave(false);
  }

  onBottom() {
    if (this.props.data.node) {
      this.props.canvas.bottom(this.props.data.node);
    }

    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        this.props.canvas.bottom(item);
      }
    }

    this.props.canvas.render();
    this.props.onNeedHide();
    this.props.setIsSave(false);
  }

  onCombine(stand: boolean) {
    if (!this.props.data.nodes) {
      return;
    }
    this.props.canvas.combine(this.props.data.nodes, stand);
    this.props.canvas.render();
    this.props.onNeedHide();
    this.props.setIsSave(false)
  }

  onUncombine = () => {
    if (!this.props.data.node) {
      return;
    }
    this.props.canvas.uncombine(this.props.data.node);
    this.props.canvas.render();
    this.props.onNeedHide();
    this.props.setIsSave(false)
  };

  onLock = () => {
    this.props.data.locked = 2;
    if (this.props.data.node) {
      this.props.data.node.locked = this.props.data.locked;
    }
    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        item.locked = this.props.data.locked;
      }
    }
    this.props.canvas.render(true);
    this.props.setIsSave(false);
  };
  // 打开新建组件弹窗
  onNewComponent = () => {
    this.setState({ newComVisible: true });
  };
  // 确定新建组件
  handleOk = () => {
    this.onCheck();
  };
  handleCancel = () => {
    this.setState({ newComVisible: false });
  };
  onCheck = async () => {
    try {
      const values = await this.formRef.current.validateFields([
        'componentName',
      ]);
      this.setState({ componentName: values.componentName });
      this.setState({ newComVisible: false });
      if (this.props.data.nodes) {
        this.props.data.nodes.forEach(item => {
          item.property.dataPointSelectedRows = [];
          item.property.dataPointParam.qtDataList= [];
        })
      }else {
        this.props.data.node.property.dataPointSelectedRows = [];
        this.props.data.node.property.dataPointParam.qtDataList = [];
      }
      const newNode = this.props.data.nodes
        ? this.props.canvas.toComponent(this.props.data.nodes)
        : this.props.canvas.toComponent([this.props.data.node]);
      // this.props.canvas.delete();
      // this.props.canvas.addNode(newNode);
      this.props.canvas.render();
      this.saveNewComponent({
        componentName: this.state.componentName,
        componentProperty: JSON.stringify(newNode, replacer),
      }).then((res) => {
        message.info('添加到自定义组件成功');
        this.props.getNewComponents();
        this.formRef.current.resetFields();
      });
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
      this.formRef.current.resetFields();
    }
  };
  renderNewComponentModal = () => {
    return (
      <Modal
        title="添加到自定义组件"
        visible={this.state.newComVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        okText="确定"
        cancelText="取消"
        getContainer={() => document.querySelector('#editLayout')}
      >
        <Form ref={this.formRef} preserve={false}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入组件名称',
              },
              {
                max: 20,
                message: '最长为20个字符',
              },
              {
                min: 2,
                message: '不低于2个字符',
              },
            ]}
            label="组件名字"
            name="componentName"
          >
            <Input placeholder="输入组件名字" id="componentName" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  render() {
    return (
      <div
        className={styles.menus}
        style={{ display: this.props.show ? 'block' : 'none' }}
      >
        <div>
          <a
            className={
              this.props.data.node || this.props.data.nodes
                ? ''
                : styles.disabled
            }
            onClick={this.onTop.bind(this)}
          >
            置顶
          </a>
        </div>
        <div>
          <a
            className={
              this.props.data.node || this.props.data.nodes
                ? ''
                : styles.disabled
            }
            onClick={this.onBottom.bind(this)}
          >
            置底
          </a>
        </div>
        <div>
          <a
              className={
                this.props.data.node || this.props.data.nodes
                    ? ''
                    : styles.disabled
              }
              onClick={() => {
                this.onNewComponent();
              }}
          >
            添加到自定义组件
          </a>
        </div>
        <div className={styles.line} />
        {this.props.data.nodes ? (
          <div>
            <a
              onClick={() => {
                this.onCombine(false);
              }}
            >
              组合
            </a>
            {/*<a onClick={() => { this.onCombine(true) }}>包含</a>*/}
          </div>
        ) : null}
        {this.props.data.node && this.props.data.node.name === 'combine' ? (
          <div>
            <a onClick={this.onUncombine}>取消组合/包含</a>
          </div>
        ) : null}
        {/*<div>*/}
        {/*  <a*/}
        {/*    className={(this.props.data.node || this.props.data.nodes) ? '' : styles.disabled}*/}
        {/*    onClick={this.onLock}*/}
        {/*  >{this.props.data.locked ? '解锁' : '锁定'}</a>*/}
        {/*</div>*/}
        {this.renderNewComponentModal()}
      </div>
    );
  }
}
