import React from 'react'
import { Upload, Modal } from 'antd';
import { UploadFile, UploadListType } from 'antd/es/upload/interface'
import axios from 'axios'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
// 工业上传组件
interface IndustrialLibraryUploadProps {
  onUploadComplete?: (newFile:UploadFile,files:UploadFile[])=>void;
  onRemoveFile?:(file:UploadFile)=>void;
}
const uploadConfig = {
  baseURL:"http://qt.test.bicisims.com",
  token:"development_of_special_token_by_star_quest",
  url:"/api/file/file/uploadReturnPath",
  data:{
    mappingId:"ooip6ffe388d487db754b885b8aa65b9",
    mappingType:"106"
  }
}

export default class IndustrialLibraryUpload extends React.Component<IndustrialLibraryUploadProps,any> {
  state = {
    previewVisible: false,
    previewImage: '',
    addFile:undefined,
    fileList: [],
    timer:null,
  };
  componentDidMount() {

  }
  componentWillUnmount(): void {
    clearTimeout(this.state.timer)
  }

  // 手动上传文件
  handleUpload = ()=>{
    const {onUploadComplete} = this.props
    const formData = new FormData()
    formData.append("file",this.state.addFile)
    for(let k in uploadConfig.data){
      formData.append(k,uploadConfig.data[k])
    }
    // formData.append("mappingId","23233")
    // formData.append("mappingType","106")
    const instance = axios.create({
      baseURL:uploadConfig?.baseURL,
      timeout:10000000,
      maxContentLength:1000000000
    })
    instance.post(uploadConfig.url,formData,{
      method:'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':uploadConfig.token,
        'Content-Type':'multipart/form-data'
      }
    }).then((res)=>{
      let fileList = this.state.fileList;
      let newFile = fileList.pop();
      newFile["url"] = res.data?.data[0]
      fileList.push(newFile)
      this.setState({fileList:fileList})
      onUploadComplete&&onUploadComplete(newFile,this.state.fileList)
    })
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    const timer = setTimeout(this.handleUpload,500);
    this.setState({timer:timer})
  }

  render() {
    const { fileList } = this.state;
    const uploadProps = {
      listType: 'picture-card' as UploadListType,
      onChange:this.handleChange,
      showUploadList:false,
      accept:'image/*',
      beforeUpload: file => {
        this.setState(state => ({
          addFile: file,
        }));
        return false;
      }
    }
    const uploadButton = (
      <div>
        <div className="ant-upload-text">添加</div>
      </div>
    );
    return (
      <div className="clearfix" draggable={false}>
        <Upload {...uploadProps}>
          {fileList.length >= 58 ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}
