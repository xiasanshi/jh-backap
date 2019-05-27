import axios from 'axios'

// import qs from 'qs'

export class Api {
  constructor (url) {
    this.url = url
    this.name = null
  }

  connect (name) {
    this.name = name
  }

  getAll (params) {
    return axios.post(`${this.url}/api/${this.name}/list`, params)
  }

  // 根据shopid和状态获取数据
  getDataByStatus (params) {
    console.log(params)
    return axios.post(`${this.url}/api/order/${params.id}/${params.status}/shop`, params)
  }

  getDetail (params) {
    return axios.post(`${this.url}/api/${this.name}/${params.id}`, params)
  }

  create (params) {
    return axios.put(`${this.url}/api/${this.name}`, params)
  }

  update (params) {
    return axios.put(`${this.url}/api/${this.name}/${params.id}`, params)
  }

  reSave (params) {
    return axios.put(`${this.url}/api/${this.name}/update`, params)
  }

  delete (params) {
    return axios.delete(`${this.url}/api/${this.name}/${params.id}`, params)
  }

  getDataByName (params) {
    return axios.post(`${this.url}/api/${this.name}`, params)
  }
}

export const requestLogin = params => {
  return axios.post(`https://diancan.qingzhao.net.cn/diancanrs/api/login/account`, params)
}
