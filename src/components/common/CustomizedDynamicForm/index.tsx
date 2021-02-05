import React, { useState } from 'react';
import {Checkbox, Col, Collapse, Form, Input, InputNumber, Row} from 'antd';
import {Node} from "../../../topology/core/src/models";
import * as _ from 'lodash';
import ColorPicker from "../ColorPicker/ColorPicker";
const { Panel } = Collapse;
const { TextArea } = Input;

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
                                    name="global_state"
                                    layout="inline"
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

