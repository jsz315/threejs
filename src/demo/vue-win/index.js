import Vue from 'vue'
import Home from "./com/home/index.vue"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from "axios";

import './index.less'
import App from'./core/App'
import store from "./store/index";
import listener from './lib/listener';
import { Toast } from 'mint-ui';

let app;
Vue.use(MintUI)
// Vue.prototype.$axios = axios;
Vue.prototype.$toast = (tip) => {
    Toast({
        message: tip,
        position: 'top',
        duration: 2000
    });
}

Vue.prototype.$get = (url, param) => {
    return axios.get(url, {
        params: param
    });
}

Vue.prototype.$post = (url, param, isForm = true) => {
    let data;
    if(isForm){
        data = new FormData();
        for(let i in param){
            data.append(i, param[i]);
        }
    }
    else{
        data = param;
    }
    return axios.post(url, data);
}

new Vue({
    store,
    render: h => h(Home)
}).$mount("#home");


listener.on("open", () => {
    app.playAnimate();
})

listener.on("background", (src) => {
    document.querySelector(".canvas-box").style.backgroundImage = `url(${src})`;
})

listener.on("param", (attr, num) => {
    if(attr == "ambient"){
        app.setAmbient(num);
    }
    else if(attr == "directional"){
        app.setDirectional(num);
    }
    else if(attr == "roughness"){
        app.setRoughness(num);
    }
    else if(attr == "metalness"){
        app.setMetalness(num);
    }
})

listener.on("map", (url) => {
    app.changeMap(url);
});

window.onload = function(){
    let canvas = $("#canvas");
    app = new App(canvas);
    app.setup();

    let param = store.state.effectParam;
    app.setAmbient(param.ambient);
    app.setDirectional(param.directional);
    app.setRoughness(param.roughness);
    app.setMetalness(param.metalness);
}

function $(sel){
    return document.querySelector(sel);
}
