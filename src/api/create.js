import ajax from '../https'
const spare2 = 'http://157.230.241.99:8066' 
const chainProductRealmIP = 'http://otc.mars99999.cloud' 


export function userLogin(params) {
  return ajax({
    url: spare2 + '/web/sgn/pbreq.do',
    method: 'post',
    data: params
  })
}

export function getBalance(params) {
  return ajax({
    url: chainProductRealmIP + '/fbs/act/pbgac.do',
    method: 'post',
    data: params
  })
}

export function getUserInfo(params) {
  return ajax({
    url: spare2 + '/web/sgn/pbbki.do',
    method: 'post',
    data: params
  })
}