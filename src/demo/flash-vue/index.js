import './index.less'
import listener from "./lib/listener"
import Vue from 'vue'
import Home from "./com/home/index.vue"
// import 'lib-flexible'


import VueAwesomeSwiper from 'vue-awesome-swiper'
// import style
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

new Vue({
    render: h => h(Home)
}).$mount("#vue");


window.hideLoading = function(){
    listener.emit('loaded');
}
