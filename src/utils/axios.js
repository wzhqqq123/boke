
"use strict";

import Vue from "vue";
import axios from "axios";
import { Message } from "element-ui";
//取消请求
let CancelToken = axios.CancelToken

let config = {
    baseURL: "",
    timeout: 10 * 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

// console.log('process.env.NODE_ENV---------', developUrl)
if (process.env.NODE_ENV == "development") {
    // config.baseURL = `http://${process.env.VUE_APP_BASE_API_IP}:${process.env.VUE_APP_BASE_API_PORT}/`
    config.baseURL = process.env.BASE_URL;
} else {
    // config.baseURL = `http://${process.env.VUE_APP_BASE_API_IP}:${process.env.VUE_APP_BASE_API_PORT}/`
    //IE10不支持window.location.origin，使用以下方法实现API baseURL 路径拼接
    let locationOrigin;
    window.location.origin
        ? (locationOrigin = window.location.origin)
        : (locationOrigin = window.location.protocol + "//" + window.location.host);
    config.baseURL = locationOrigin;
    // 设置nodeServe请求路径
    config.baseURL = developUrl;
}
const _axios = axios.create(config);

//请求拦截器
_axios.interceptors.request.use(
    function (config) {
        config.headers["Content-Type"] = "application/json;charset=utf-8";
        let requestName;
        if (config.method === 'post') {
            if (config.data && config.data.requestName) {
                requestName = config.data.requestName
            } else {
                requestName = new Date().getTime()
            }
        } else {
            if (config.params && config.params.requestName) {
                requestName = config.params.requestName
            } else {
                requestName = new Date().getTime()
            }
        }
        // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
        if (requestName) {
            if (axios[requestName] && axios[requestName].cancel) {
                axios[requestName].cancel()
            }
            config.cancelToken = new CancelToken(c => {
                axios[requestName] = {}
                axios[requestName].cancel = c
            })
        }
        // 配置token身份验证
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
//响应拦截器
_axios.interceptors.response.use(
    function (response) {
        const res = response.data;
        if (res.code != 200) {
            if (res.code != undefined) {
                // 身份认证失败跳转登录页
                if (res.message.includes('身份认证失败')) {
                    window.location.hash = "#/login"
                }
                Message({
                    dangerouslyUseHTMLString: true,
                    message: res.message || "error",
                    type: "error",
                    duration: 1.5 * 1000,
                });
                return Promise.reject(res || "error");
            } else {
                //读取静态配置文件，此时没有对应的code码值，需要直接返回读取数据即可。
                return res;
            }
        } else {
            if (res.message) {
                Message({
                    dangerouslyUseHTMLString: true,
                    message: res.message,
                    type: "success",
                    duration: 1.5 * 1000,
                });
            }
            return res.data || "";
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break
                case 401:
                    error.message = '未授权，请重新登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = '请求错误,未找到该资源'
                    break
                case 405:
                    error.message = '请求方法未允许'
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器端出错'
                    break
                case 501:
                    error.message = '网络未实现'
                    break
                case 502:
                    error.message = '网络错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网络超时'
                    break
                case 505:
                    error.message = 'http版本不支持该请求'
                    break
                default:
                    error.message = `连接错误${error.response.status}`
            }
        } else {
            error.message = "连接到服务器失败"
        }
        Message({
            dangerouslyUseHTMLString: true,
            message: error.message || "error",
            type: "error",
            duration: 1.5 * 1000,
        });
        return Promise.reject(error.message);
    }
);

// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
Vue.prototype.$post = function (url, params) {
    return _axios.post(url, params)
}
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
Vue.prototype.$get = function (url, params) {
    return _axios.get(url, {
        params: params
    })
}

export default _axios;

