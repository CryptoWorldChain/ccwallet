import axios from 'axios'

const isProd = process.env.NODE_ENV === 'production'
const service = axios.create({
  baseURL: !isProd ? '/api' : '',
  // baseURL: '/api',
  timeout: 30000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // if (config.url === '/login') {
  //   return Promise.reject('错误')
  // }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // console.log(response)
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default service