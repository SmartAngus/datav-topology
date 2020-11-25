import axios from 'axios'
const API_URL='http://qt.test.bicisims.com'
const timeout=2000;
const maxContentLength=200000000;
const withCredentials = false
export const client = axios.create({baseURL: `${API_URL}/api`, timeout, maxContentLength,withCredentials}) // 基础请求包装对象
export function clientParam(apiURL) {
  return axios.create({baseURL: `${apiURL}/api`, timeout, maxContentLength,withCredentials})
}
// 数据中心请求包装对象 兼容之前的请求
export const apiClient = axios.create({baseURL: `${API_URL}/api/manager`, timeout, maxContentLength,withCredentials})

export function apiClientParam(apiURL) {
  return axios.create({baseURL: `${API_URL}/api/manager`, timeout, maxContentLength,withCredentials})
}

