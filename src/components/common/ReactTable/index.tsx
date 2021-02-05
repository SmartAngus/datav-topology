import { registerNode } from '../../../topology/core';
import { Modal, Tabs, Button, DatePicker, Result, Table } from 'antd';
import drawReactNode from './drawReactNode';
import WebPage from "../WebPage";



export function register() {
    registerNode('button', drawReactNode(Button), null, null, null);
    registerNode('datePicker', drawReactNode(DatePicker), null, null, null);
    registerNode('result', drawReactNode(Result), null, null, null);
    registerNode('table', drawReactNode(Table), null, null, null);
    registerNode('webPage', drawReactNode(WebPage), null, null, null);
}