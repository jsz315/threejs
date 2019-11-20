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
Vue.prototype.$axios = axios;
Vue.prototype.$toast = (tip) => {
    Toast({
        message: tip,
        position: 'top',
        duration: 2000
    });
}
import './index.less';

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
  