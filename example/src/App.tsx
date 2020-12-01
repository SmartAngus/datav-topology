import React, { useEffect, useRef, useState } from 'react';

import { EditorLayout, Preview } from 'bici-datav-npm';
import 'antd/dist/antd.css';
import 'bici-datav-npm/dist/index.css';
import axios from 'axios';
import { Route, BrowserRouter } from 'react-router-dom';
import { Modal } from 'antd';
import preBgImg1 from './bg01.png';
import preBgImg2 from './bg02.png';
import preBgImg3 from './bg03.png';

const { confirm } = Modal;

const EditorLayoutCanvas: React.FC<any> = ({ ...props }) => {
  const history = props.history;
  const [editorData, setEditorData] = useState(undefined);
  const [extraVisible, setExtraVisible] = useState(false);
  const preInstallBgImages = [
    { key: 1, img: preBgImg1 },
    { key: 2, img: preBgImg2 },
    { key: 3, img: preBgImg3 },
  ];
  const token = '5Yin6wBp0lPSKj0J5wLUAr';
  const industrialLibrary = [
    {
      type: 'mk',
      name: '灯光',
      images: [
        {
          name: '1',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          width: 100,
          height: 100,
          type: 'image',
          key: '1',
        },
        {
          name: '2',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          width: 100,
          height: 100,
          type: 'image',
          key: '2',
        },
      ],
    },
    {
      type: 'mj',
      name: '管道',
      images: [
        {
          name: '3',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          width: 100,
          height: 100,
          type: 'image',
          key: '3',
        },
        {
          name: '4',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          width: 100,
          height: 100,
          type: 'image',
          key: '4',
        },
      ],
    },
  ];
  const selfIndustrialLibrary = [
    {
      name: '9',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      width: 100,
      height: 100,
      type: 'image',
      key: '8',
    },
    {
      name: '10',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      width: 100,
      height: 100,
      type: 'image',
      key: '9',
    },
  ];
  const uploadConfig = {
    baseURL: 'http://qt.test.bicisims.com',
    self: {
      baseURL: 'http://qt.test.bicisims.com',
      token: token,
      url: '/api/file/file/uploadReturnPath',
      apiUrl: {
        list: '/applications/custom/component/componentList',
        delete: '/file/file/delete',
        update: '/file/file/updateFile',
      },
      data: {
        mappingId: 'ooip6ffe388d487db754b885b8aa65b9',
        mappingType: '106',
      },
    },
    preInstall: {
      baseURL: 'http://qt.test.bicisims.com',
      token: token,
      url: '/api/file/file/uploadReturnPath',
      data: {
        mappingId: 'ooip6ffe388d487db754b885b8aa65b9',
        mappingType: '107',
      },
    },
    combineCom: {
      apiURL: 'http://qt.test.bicisims.com',
      token: token,
      list: {
        url: '/applications/customComponent/list',
        params: {},
      },
      add: {
        url: '/applications/customComponent/save',
        params: {},
      },
      delete: {
        url: '/applications/customComponent/delete',
        params: {},
      },
      rename: {
        url: '/applications/customComponent/update',
        params: {},
      },
    },
  };
  const apiURL = 'http://qt.test.bicisims.com';
  const websocketConf = {
    url: 'ws://47.96.159.115:51060/ws?token=5Yin6wBp0lPSKj0J5wLUAr',
  };
  useEffect(() => {
    // 获取数据
    const formData = new FormData();
    formData.append('mappingId', '23233');
    formData.append('mappingType', '107');
    const instance = axios.create({
      baseURL: 'http://qt.test.bicisims.com',
      timeout: 10000000,
      maxContentLength: 1000000000,
    });
    // 获取面板数据
    // 获取面板数据
    instance
      .get('/api/applications/newBoard/detail', {
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: token,
          'Content-Type': 'application/json',
        },
        params: {
          id: 'aeeded41ccd34422ab9591d69bde21ec',
        },
      })
      .then(res => {
        if (res.data?.data != null) {
          if (
            res.data.data.property != null &&
            res.data.data.property != null
          ) {
            // const getEditorData = JSON.parse(
            //   decodeURIComponent(escape(window.atob(res.data.data.property)))
            // );
            const getEditorData = JSON.parse(res.data.data.property)
            setEditorData(getEditorData);
          }
        }
      });
    // 获取获取当前租户下 上传的背景图片
    // instance
    //   .post(
    //     '/api/applications/custom/component/componentList',
    //     { mappingType: '107' },
    //     {
    //       method: 'post',
    //       headers: {
    //         token: 'development_of_special_token_by_star_quest',
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //   .then((res) => {
    //   });
    // 获取获取当前租户下 指定自定义组件图片列表
    // instance
    //   .post(
    //     '/api/applications/custom/component/componentList',
    //     { mappingType: '106' },
    //     {
    //       method: 'post',
    //       headers: {
    //         token: 'development_of_special_token_by_star_quest',
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     (res.data.data || []).map((image: any) => {
    //       const newImg = {
    //         ...image,
    //         name: image.name.replace(/\.(jpg|png)$/g, ''),
    //         width: 100,
    //         height: 100,
    //         type: 'image',
    //         key: image.id,
    //       };
    //       selfIndustrialLibrary.push(newImg);
    //       return null;
    //     });
    //   });

  }, []);
  // 保存数据到数据库
  const handleSaveEditorData = (data: any) => {
    const api = axios.create({
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const formData = new FormData();
    api.defaults.headers.common['token'] = '5Yin6wBp0lPSKj0J5wLUAr';
    formData.append('file', data.screenshot);
    formData.append('mappingId', 'ooip6ffe388d487db754b885b8aa65b9');

    formData.append('mappingType', '107');
    api.post(
      `http://qt.test.bicisims.com//api/file/file/uploadReturnPath`,
      formData
    );

    const instance = axios.create({
      baseURL: 'http://qt.test.bicisims.com',
      timeout: 10000000,
      maxContentLength: 1000000000,
    });
    delete data.screenshot
    instance
      .request({
        url:"/api/applications/newBoard/updateProperty",
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: token,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data:{
          id: 'aeeded41ccd34422ab9591d69bde21ec',
          // property: window.btoa(
          //   unescape(encodeURIComponent(JSON.stringify(data)))
          // )
          property:JSON.stringify(data)
        }
      }).then((res) => {
        console.log('update==', res);
      });
  };
  // 自定义预览，多数为打开一个新页面，路由，内置的预览是弹窗
  // const handlePreview = ()=>{
  //
  // }

  //
  const handleExtraOk = () => {
    setExtraVisible(false);
  };
  const handleExtraCancel = () => {
    setExtraVisible(false);
  };

  // 点击额外配置按钮的回调
  const handleExtraSetting = () => {
    setExtraVisible(true);
  };
  const ExtraModel = () => {
    return (
      <Modal
        title="额外配置"
        className="extra-modal"
        visible={extraVisible}
        onOk={handleExtraOk}
        onCancel={handleExtraCancel}
        okText="确认"
        cancelText="取消"
      >
        <div>这是额外配置</div>
      </Modal>
    );
  };
  const editorRef = useRef();
  const handlePoweroff = () => {
    // @ts-ignore
    const isSave = editorRef?.current.getIsSave();
    if (!isSave) {
      showConfirm();
    }
  };
  function showConfirm() {
    confirm({
      title: '退出页面提示！',
      content: '画布已经修改未保存，是否离开？',
      okText: '保存并退出',
      cancelText: ' 取消',
      onOk() {
        console.log('OK');
        // @ts-ignore
        editorRef?.current.handleSaveData();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <div>
      <ExtraModel />
      <EditorLayout
        history={history}
        ref={editorRef}
        onEditorSaveCb={handleSaveEditorData}
        editorData={editorData}
        onExtraSetting={handleExtraSetting}
        selfIndustrialLibrary={selfIndustrialLibrary}
        industrialLibrary={industrialLibrary}
        uploadConfig={uploadConfig}
        onPoweroff={handlePoweroff}
        preInstallBgImages={preInstallBgImages}
        autoSaveInterval={30}
        websocketConf={websocketConf}
        apiURL={apiURL}
        token={token}
        // onPreview={handlePreview}
      />
    </div>
  );
};

const PreviewLayout: React.FC<any>=({history})=>{
  const [editorData,setEditorData]=useState<any>()
  const websocketConf = {
    url: 'ws://47.96.159.115:51060/ws?token=5Yin6wBp0lPSKj0J5wLUAr',
  };
  useEffect(()=>{
    const instance = axios.create({
      baseURL: 'http://qt.test.bicisims.com',
      timeout: 10000000,
      maxContentLength: 1000000000,
    });
    // 获取面板数据
    instance
      .get('/api/applications/newBoard/detail', {
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          token: "5Yin6wBp0lPSKj0J5wLUAr",
          'Content-Type': 'application/json',
        },
        params: {
          id: 'aeeded41ccd34422ab9591d69bde21ec',
        },
      })
      .then(res => {
        console.log('detail', res);
        if (res.data?.data != null) {
          if (
            res.data.data.property != null &&
            res.data.data.property != null
          ) {
            // const getEditorData = JSON.parse(
            //   decodeURIComponent(escape(window.atob(res.data.data.property)))
            // );
            const getEditorData = JSON.parse(res.data.data.property)
            setEditorData(getEditorData);
          }
        }
      });
  },[])
  return (<Preview history={history} data={editorData} websocketConf={websocketConf}></Preview>)
}

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={EditorLayoutCanvas} key={1} />
      <Route path="/preview" component={PreviewLayout} key={2} />
    </BrowserRouter>
  );
};

export default App;
