import React, { useEffect, useState } from 'react'
import { Table, Tag, Space } from 'antd';
import axios from "axios"

interface DataPointTable {
  onSelectedDataPoint?:(selectedRowKeys)=>void;
}

const DataPointTable=({onSelectedDataPoint}:DataPointTable)=>{
  const [selectedRowKeys,setSelectedRowKeys]=useState([])
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <React.Fragment>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </React.Fragment>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  // associationObject: "beili传感器0010"
  // attention: 2
  // channel: 1
  // dataCode: "Data2011160137"
  // dataName: "beili-反向-0010"
  // dataType: 1
  // id: "83591199c48a430d967eb6c47013c622"
  // intervalTime: 1
  // position: "18f"
  // status: -1
  // type: 1
  // unit: "摄氏度"
  useEffect(()=>{
    // 获取数据
    const formData = new FormData()

    const param = {
      id: '1a99aa5c58144a7b8ce8230ace2c53b6',
      dataType: 1,
      dataTypeList: [1],
      pagination: {current: 1, pageSize: 10, total: 0},
    }
    const instance = axios.create({
      baseURL:'http://qt.test.bicisims.com',
      timeout:10000000,
      maxContentLength:1000000000,
      withCredentials:false
    });
    // 获取面板数据
    instance.post("/api/manager/datapoint/list",param,{
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':'1NU6lvRQmTVfx4c7ppOFJb',
        'Content-Type':'application/json'
      }
    }).then((res)=>{
      console.log("detail",res)
    });// end then

  })

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    onSelectedDataPoint&&onSelectedDataPoint(selectedRowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
    ],
  };


  return (
    <Table columns={columns} dataSource={data} rowSelection={rowSelection}/>
  )
}
export default DataPointTable;
