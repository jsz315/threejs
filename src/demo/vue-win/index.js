import Vue from 'vue';
import App from "./com/App.vue";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)
import './index.less';

new Vue({
    render: h => h(App)
}).$mount("#app");
  