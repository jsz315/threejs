import Vue from 'vue'
import Home from "./com/home/index.vue"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from "axios";
import Stats from 'three/examples/jsm/libs/stats.module';

import './index.less'
import App from'./core/App'
import store from "./store/index";
import listener from './lib/listener';
import { Toast } from 'mint-ui';

let app, stats;
Vue.use(MintUI)

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

listener.on("map", (url) => {
    app.changeMap(url);
});

window.onload = function(){
    init();
}


function init(){
    stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.domElement.style.display = 'block';
    document.body.appendChild(stats.domElement);

    let canvas = $("#canvas");
    app = new App(canvas);
    app.setStats(stats);
}

function $(sel){
    return document.querySelector(sel);
}
