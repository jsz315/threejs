import './index.less'
import Vue from 'vue'
import Home from "./com/home/index.vue"

window.onload = function(){
    new Vue({
        render: h => h(Home)
    }).$mount("#vue");
}