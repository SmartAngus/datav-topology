import React, { Component } from 'react';

import { Topology,Node,Line,Lock } from '../../topology/core';

import styles from './index.module.scss';
import { Form, Input, Modal } from 'antd'
import { FormInstance } from 'antd/es/form'

export interface CanvasContextMenuProps {
  data: {
    node?: Node,
    line?: Line,
    multi?: boolean,
    nodes?: Node[],
    locked?: Lock
  };
  canvas: Topology;
}

export default class CanvasContextMenu extends Component<CanvasContextMenuProps> {
  state={
    visible:false
  }
  formRef = React.createRef<FormInstance>();
  onTop() {
    if (this.props.data.node) {
      this.props.canvas.top(this.props.data.node)
    }

    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        this.props.canvas.top(item)
      }
    }

    this.props.canvas.render()
  }

  onBottom() {
    if (this.props.data.node) {
      this.props.canvas.bottom(this.props.data.node)
    }

    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        this.props.canvas.bottom(item)
      }
    }

    this.props.canvas.render()
  }

  onCombine(stand: boolean) {
    if (!this.props.data.nodes) {
      return
    }
    this.props.canvas.combine(this.props.data.nodes, stand)
    this.props.canvas.render()
  }

  onUncombine = () => {
    if (!this.props.data.node) {
      return
    }
    this.props.canvas.uncombine(this.props.data.node)
    this.props.canvas.render()
  }

  onLock = () => {
    this.props.data.locked = 2
    if (this.props.data.node) {
      this.props.data.node.locked = this.props.data.locked
    }
    if (this.props.data.nodes) {
      for (const item of this.props.data.nodes) {
        item.locked = this.props.data.locked
      }
    }
    this.props.canvas.render(true)
  }
  onNewComponent = ()=>{
    this.setState({visible:true})
  }
  handleOk=()=>{
    this.onCheck()
    this.setState({visible:false})
    const newNode = this.props.canvas.toComponent(this.props.data.nodes)
    this.props.canvas.delete();
    this.props.canvas.addNode(newNode)
    this.props.canvas.render()
    console.log("newNode",newNode)
  }
  handleCancel=()=>{
    this.setState({visible:false})
  }
  onCheck = async () => {
    try {
      const values = await this.formRef.current.validateFields(['newCompName']);
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  render() {
    return (
      <div className={styles.menus}>
        <div>
          <a className={(this.props.data.node || this.props.data.nodes) ? '' : styles.disabled} onClick={this.onTop}>置顶</a>
        </div>
        <div>
          <a className={(this.props.data.node || this.props.data.nodes) ? '' : styles.disabled} onClick={this.onBottom}>置底</a>
        </div>
        <div className={styles.line} />
        {
          this.props.data.nodes ? (
            <div>
              <a onClick={() => { this.onCombine(false) }}>组合</a>
              <a onClick={() => { this.onNewComponent() }}>新建节点</a>
              <a onClick={() => { this.onCombine(true) }}>包含</a>
            </div>
          ) : null
        }
        {
          this.props.data.node && this.props.data.node.name === 'combine' ? (
            <div >
              <a onClick={this.onUncombine}>取消组合/包含</a>
            </div>
          ) : null

        }
        <div>
          <a
            className={(this.props.data.node || this.props.data.nodes) ? '' : styles.disabled}
            onClick={this.onLock}
          >{this.props.data.locked ? '解锁' : '锁定'}</a>
        </div>
        <Modal
          title="新建组合节点"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form ref={this.formRef}>
            <Form.Item rules={[
              {
                required: true,
                message: 'Please input your name',
              },
              {
                max: 20,
                message: '最长为20个字符',
              },
              {
                min: 2,
                message: '不低于2个字符',
              }
            ]} label="组件名字" name="newCompName">
              <Input placeholder="Warning" id="warning2" />
            </Form.Item>
          </Form>
        </Modal>
      </div >
    );
  };
}
