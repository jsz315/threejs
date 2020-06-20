// import './index.less'
// import App from'./core/App'
// import Stats from 'three/examples/jsm/libs/stats.module';

// let app = new App();
// app.setup();

// initStats();

// function initStats(){
//     var stats = new Stats();
//     stats.setMode(0); 
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.left = '0px';
//     stats.domElement.style.top = '0px';
//     document.body.appendChild(stats.domElement);
    
//     app.setStats(stats);
// }

import './index.less'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import Vue from 'vue'
import Home from "./com/home/index.vue"
import store from "./store/index";

import { Toast } from 'mint-ui';
Vue.use(MintUI);

Vue.prototype.$toast = (tip) => {
    Toast({
        message: tip,
        position: 'top',
        duration: 2000
    });
}


window.onload = function(){
    new Vue({
        store,
        render: h => h(Home)
    }).$mount("#vue");
}