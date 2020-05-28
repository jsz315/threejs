import './index.less'
import listener from "./lib/listener"
import Vue from 'vue'
import Home from "./com/home/index.vue"
// import 'lib-flexible'


import VueAwesomeSwiper from 'vue-awesome-swiper'
// import style
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

var timer = setInterval(()=>{
    var dom = document.getElementById("MDCloudDesign3DWEB");
    if(dom){
        clearInterval(timer);
        init();
    }
}, 300);

if(location.search.indexOf("debug=1") != -1){
    init();
    clearInterval(timer);
    // window.hideLoading = function(){}
}

function init(){
    new Vue({
        render: h => h(Home)
    }).$mount("#vue");
}

window.hideLoading = function(){
    listener.emit('loaded');
}
