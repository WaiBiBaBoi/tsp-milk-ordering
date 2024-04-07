import { axiosInstance } from '@/utils/request'
const axios = axiosInstance
// 获取菜单
export const getSystemMenu = () => {
    return axios({
        url: '/SystemMenu/system-menu',
        method: 'get',
    })
}
// 登录
export const accountLogin = (param) => {
    return axios({
        url: '/SystmeUser/login',
        method: 'post',
        data:param
    })
}
// 获取下拉列表
export const selectList = (param) => {
    return axios({
        url: '/System/select-list',
        method: 'post',
        data:param
    })
}