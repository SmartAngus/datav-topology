import axios from 'axios'
const timeout=20000;
const maxContentLength=200000000;
const withCredentials = false
export function clientParam(apiURL) {
  return axios.create({baseURL: `${apiURL}/api`, timeout, maxContentLength,withCredentials})
}

export function apiClientParam(apiURL) {
  return axios.create({baseURL: `${apiURL}/api/manager`, timeout, maxContentLength,withCredentials})
}

// 查询数据点列表
export function fetchSearchDataPointManageList(params) {
  return apiClientParam(window["API_URL"]).post('/datapoint/list', params,{
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      token: window["token"],
      'Content-Type': 'application/json',
    }
  })
}
// 查询反应堆列表
export function fetchSearchReactStackList (params) {
  return clientParam(window["API_URL"]).post('/applications/reactor/list', params,{
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      token: window['token'],
      'Content-Type': 'application/json',
    }
  })
}
// 获取复杂感知点列表
export function fetchPerceptualPointList(params) {
  return clientParam(window["API_URL"]).post('/applications/complexData/list', params,{
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      token: window["token"],
      'Content-Type': 'application/json',
    }
  })
}