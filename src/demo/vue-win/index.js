import Vue from 'vue'
import Home from "./com/home/index.vue"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from "axios";

import './index.less'
import App from'./core/App'
import store from "./store/index";
import listener from './lib/listener';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Toast } from 'mint-ui';
import chat from './chat';
import Tooler from './core/Tooler'


let stats;
let app;
let isDebug = Tooler.getQueryString("debug") == 1;
let isStop = Tooler.getQueryString("stop") == 1;

if(isDebug){
    chat.init();
}

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
    else if(attr == "far"){
        app.setFar(num);
    }
})

listener.on("map", (url) => {
    app.changeMap(url);
});

window.onload = function(){
    stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    if(window.location.search.indexOf("debug=1") == -1){
        stats.domElement.style.display = 'none';
    }
    
    document.body.appendChild(stats.domElement);

    let canvas = $("#canvas");
    app = new App(canvas);

    !isStop && app.setup();
    
    app.setStats(stats);

    let param = store.state.effectParam;
    app.setAmbient(param.ambient);
    app.setDirectional(param.directional);
    app.setRoughness(param.roughness);
    app.setMetalness(param.metalness);
}

function $(sel){
    return document.querySelector(sel);
}


// async function test(){
//     var list = [100, 200, 300];
//     console.log("start");
//     for(var i = 0; i < list.length; i++){
//         var item = list[i];
//         console.log(item);
//         await sleep(item);
//     }
//     console.log("end");
// }
// test();

// function sleep(m){
//     return new Promise(resolve=>{
//         setTimeout(() => {
//             console.log('await ' + m);
//             resolve();
//         }, m);
//     })
// }


(function () {
    var active = false;
    if(location.search.indexOf("eruda=true") != -1){
        active = true;
    }
    else{
        if(localStorage.getItem("active-eruda") == "true"){
            active = true;
        }
    }
    if (!active) return;
    var script = document.createElement("script");
    script.src = "https://libs.cdnjs.net/eruda/2.3.3/eruda.min.js";
    document.body.appendChild(script);
    script = document.createElement("script");
    script.innerHTML = 'setTimeout(function(){eruda.init();console.log("eruda.init");}, 3000);';
    document.body.appendChild(script);
})();