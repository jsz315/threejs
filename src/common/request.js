import axios from 'axios'
import qs from 'qs'

const NO_SERVER = window.CFG && window.CFG.baseURL;
const DATA_FORM = 'application/x-www-form-urlencoded';
const DATA_JSON = 'application/json';

axios.defaults.headers.common['token'] = 'jsz';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Content-type'] = 'application/json';

if(NO_SERVER){
    axios.defaults.baseURL = window.CFG.baseURL;
}

function insertExt(url){
    var list = url.split("?");
    if(list.length == 1){
        return url + '.json';
    }
    return list.shift()+ '.json?' + list.join("?");
}


// axios请求拦截
axios.interceptors.request.use(
    config => {
        // 统一拼上固定要传的参数
        if(NO_SERVER){
            config.url = insertExt(config.url);
        }
        return config;
    }, 
    error => {
        return Promise.error(error);
    }
);


export const httpGet = (url, params, config)=> {
    return new Promise((resolve, reject)=>{
        axios({
            method:'get',
            url:url,
            params: params,
            paramsSerializer: function(params) {
               return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

export const httpPost = (url, params, config)=> {
    if(NO_SERVER){
        return httpGet(url, params, config);
    }
    return new Promise((resolve, reject)=>{
        axios({
            method:'post',
            url:url,
            data: params,
            headers: { 'content-type': config && config.isForm ? DATA_FORM : DATA_JSON }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}


