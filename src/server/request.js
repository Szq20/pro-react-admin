/*
 * @Author: zhoupengfei03
 * @Date: 2021-12-21 18:56:06
 * @LastEditTime: 2022-01-17 12:37:46
 * @LastEditors: Please set LastEditors
 * @Description: 封装axios拦截器
 * @FilePath: /my-fe-project/src/server/utils/axiosRequest.js
 */
import axios from 'axios';
import {showError} from '@utils';

/* 创建axios实例 */
const request = axios.create({
    timeout: 5 * 60 * 1000, // 请求超时时间
    headers: {}
});
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/* request拦截器 */
request.interceptors.request.use(config => {
    return config;
}, error => {
    Promise.reject(error);
});

const errorMsgObj = {
    ResourceIsExists: '该资源已存在'
};

const handleError = data => {
    const {success, message} = data;
    const {global, code} = message || {};
    if (!success && !!global) {
        showError(errorMsgObj[code] || global);
    }
};

const handleLogin = data => {
    const {message} = data || {};
    if (message) {
        const {redirect} = message || {};
        if (redirect) {
            window.location.href = redirect;
        }
    }
};

/* respone拦截器 */
request.interceptors.response.use(
    response => {
        const {data} = response || {};
        // console.log(response, 'response:::');
        handleError(data);
        // handleLogin(data);
        return data;
    },
    error => {
        // console.log('error::::', error);
        showError(error.toString());
        return Promise.reject(error.toString());
    },
);


export default request;