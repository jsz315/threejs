import './index.less'
import Vue from 'vue'
import Home from "./com/home/index.vue"

import * as Physijs from 'physijs';
Physijs.scripts.worker = '/lib/physijs_worker';
Physijs.scripts.ammo = '/lib/ammo.js';

window.onload = function(){
    new Vue({
        render: h => h(Home)
    }).$mount("#vue");
}