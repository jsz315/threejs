import './index.less'
import App from'./core/App'
import Vue from 'vue'

import Home from "./js/Home.vue";

new App();


new Vue({
    render: h => h(Home)
}).$mount("#app");