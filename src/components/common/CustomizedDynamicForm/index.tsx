import React, { useState } from 'react';
import {Button, Checkbox, Col, Collapse, Form, Input, InputNumber, Row, Select, Tooltip, Radio} from 'antd';
import {Node} from "../../../topology/core/src/models";
import * as _ from 'lodash';
import ColorPicker from "../ColorPicker/ColorPicker";
import CustomIcon from "../../config/iconConfig";
const { Panel } = Collapse;
const { TextArea } = Input;
const {Option}=Select;
const alignObj = {
    left: ['左对齐', 'iconzuoduiqi'],
    right: ['右对齐', 'iconyouduiqi'],
    top: ['顶部对齐', 'iconshangduiqi'],
    bottom: ['底部对齐', 'iconxiaduiqi'],
    center: ['垂直居中', 'iconzongxiangjuzhong'],
    middle: ['水平居中', 'iconhengxiangjuzhong'],
};

export interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}
export interface FormFieldGroup{
    group:string;
    formItems:FieldData[]
}

export interface CustomizedFormProps {
    onChange: (group:string,fields: FieldData[]) => void;
    formStyle: FormFieldGroup[];
}



const CustomizedDynamicForm: React.FC<CustomizedFormProps> = ({ onChange, formStyle }) => {
    const hasField = (formItems:FieldData[],field:string)=>{
        const i = _.findIndex(formItems,(item)=>item.name[0]==field);
        if(i>=0){
            return true;
        }else{
            return false;
        }
    }
    return (
        <React.Fragment>
            <Collapse defaultActiveKey={['0','1']}>
                {
                    (formStyle||[]).map((item,index)=>{
                        return (
                            <Panel header={item.group} key={index}>
                                <Form
                                    fields={item.formItems}
                                    onFieldsChange={(_, allFields) => {
                                        onChange(item.group,allFields);
                                    }}
                                >
                                    {
                                        hasField(item.formItems,'username')?(
                                            <Row>
                                                <Col>
                                                    <Form.Item
                                                        name="username"
                                                        label="username"
                                                        rules={[{ required: true, message: 'Username is required!' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                        hasField(item.formItems,'color')?(
                                            <Row>
                                                <Col>
                                                    <Form.Item
                                                        name="color"
                                                        label="color"
                                                        rules={[{ required: true, message: 'Username is required!' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                        hasField(item.formItems,'fontStyle')?(
                                            <Row>
                                                <Col>
                                                    <Form.Item
                                                        name="fontStyle"
                                                        label="字体颜色"
                                                    >
                                                        <ColorPicker/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                        hasField(item.formItems,'refreshRate')?(
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="refreshRateCheck"
                                                        label="刷新频率"
                                                        valuePropName="checked"
                                                    >
                                                        <Checkbox/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="refreshRate"
                                                        label=""
                                                    >
                                                        <InputNumber/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                        hasField(item.formItems,'iframe')?(
                                            <Row>
                                                <Col>
                                                    <Form.Item
                                                        name="iframe"
                                                        label="网页地址"
                                                    >
                                                        <TextArea
                                                            placeholder="请输入网页地址"
                                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                        hasField(item.formItems,'title')?(
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="titleShow"
                                                        label="标题"
                                                    >
                                                        <Checkbox/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="title"
                                                    >
                                                       <Input/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ):''
                                    }
                                    {
                                    hasField(item.formItems,'titleFontFamily')?(
                                        <Row>
                                            <Col>
                                                <Form.Item
                                                    name="titleFontFamily"
                                                    label="字体"
                                                >
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
                                        </Row>
                                    ):''
                                }
                                {
                                    hasField(item.formItems,'titleFontColor')?(
                                        <Row>
                                            <Col>
                                                <Form.Item
                                                    name="titleFontColor"
                                                    label="颜色字号"
                                                >
                                                    <ColorPicker/>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item
                                                    name="titleFontSize"
                                                >
                                                    <InputNumber/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ):''
                                }
                                {
                                    hasField(item.formItems,'titlePosition')?(
                                        <React.Fragment>
                                        <Row justify="space-around" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                            <Col>
                                                <Form.Item label="" name="titlePosition">
                                                    <Radio.Group>
                                                        <Radio.Button value="left">Horizontal</Radio.Button>
                                                        <Radio.Button value="center">Vertical</Radio.Button>
                                                        <Radio.Button value="right">Inline</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row justify="space-around" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                            <Col>
                                                <Form.Item label="" name="titlePosition">
                                                    <Checkbox.Group>
                                                    <Checkbox value="left">Horizontal</Checkbox>
                                                    <Checkbox value="center">Vertical</Checkbox>
                                                    <Checkbox value="right">Inline</Checkbox>
                                                    </Checkbox.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        </React.Fragment>
                                    ):''
                                }

                                </Form>
                            </Panel>
                        )
                    })
                }

            </Collapse>
        </React.Fragment>
    );
};
export default CustomizedDynamicForm;

