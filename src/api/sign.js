import ajax from '../https'

const spare2 = 'http://157.230.241.99:8066'

export function login(params) {
  // 登陆注册
  return ajax({
    url: spare2 + '/web/sys/pblin.do',
    method: 'post',
    data: params
  })
}

export function getSignData(params) {
  // 获取签名数据
  return ajax({
    url: spare2 + '/web/sgn/pbreq.do',
    method: 'post',
    data: params
  })
}

export function sendSignData(params) {
  // 发起签名
  return ajax({
    url: spare2 + '/web/sgn/pbsnt.do',
    method: 'post',
    data: params
  })
}