import Vue from 'vue'
import Home from "./component/home/index.vue"
import './index.less'
import App from './game/App'

let app;

new Vue({
    render: h => h(Home)
}).$mount("#home");

window.onload = function(){
    let canvas = document.getElementById("canvas");
    app = new App(canvas);
    app.setup();
}