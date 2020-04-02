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

import Tooler from './core/Tooler'


let stats;
let app;
let isDebug = Tooler.getQueryString("debug") == 1;
let isStop = Tooler.getQueryString("stop") == 1;

Vue.use(MintUI);

new Vue({
    store,
    render: h => h(Home)
}).$mount("#home");
