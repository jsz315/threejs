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

var list = [];
var r = 10;
for(var i = 0; i <= 360; i += 10){
    var x = r * Math.cos(i * Math.PI / 180);
    var y = r * Math.sin(i * Math.PI / 180);
    list.push(x, y);
}
console.log(list);
console.log(list.join(","))