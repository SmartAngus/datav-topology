import React, { useState, CSSProperties, Fragment } from 'react';
import { Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from './index.module.scss';

const { confirm } = Modal;

interface CompContextMenuProps {
  contextMenuRef: any;
  showContextmenu: boolean;
  contextmenu: CSSProperties;
  name: string;
  form: FormInstance;
  handleDelete: () => void;
  handleOk: () => void;
}

const CompContextMenu = (props: CompContextMenuProps) => {
  const {
    contextMenuRef,
    showContextmenu,
    contextmenu,
    name,
    form,
    handleOk,
    handleDelete,
  } = props;
  const [visible, setVisible] = useState(false);

  const onRename = () => {
    setVisible(true);
    form.setFieldsValue({ componentName: name });
  };

  const onDelete = () => {
    confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        handleDelete();
      },
      onCancel() {},
    });
  };

  const handleOnOk = () => {
    handleOk();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const renderNewComponentModal = (
    <Modal
      title="重命名"
      visible={visible}
      onOk={handleOnOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form}>
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

  return (
    <Fragment>
      <div style={contextmenu as CSSProperties} ref={contextMenuRef}>
        <div
          className={styles.menus}
          style={{ display: showContextmenu ? 'block' : 'none' }}
        >
          <div>
            <a onClick={onRename}>重命名</a>
          </div>
          <div>
            <a onClick={onDelete}>删除</a>
          </div>
        </div>
      </div>
      {renderNewComponentModal}
    </Fragment>
  );
};

export default CompContextMenu;