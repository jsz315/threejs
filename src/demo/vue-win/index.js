import Vue from 'vue'
import Home from "./com/home/index.vue"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from "axios";

import './index.less'
import App from'./core/App'
import store from "./store/index";

let app;

Vue.use(MintUI)
Vue.prototype.$axios = axios;
import './index.less';

new Vue({
    store,
    render: h => h(Home)
}).$mount("#home");



window.onload = function(){
    let canvas = $("#canvas");
    app = new App(canvas);
    app.setup();
}

function $(sel){
    return document.querySelector(sel);
}
  