<template>
    <div class="home">
        <!-- <mt-range v-model="rangeValue" :min="0" :max="100" :step="1" :bar-height="1">
            <div slot="start" class="start p-num">0</div>
            <div slot="end" class="end p-num">100</div>
        </mt-range>
        <mt-picker :slots="slots" @change="onValuesChange" ref="picker"></mt-picker> -->

        <div class="menu" @click="play">退出</div>
        <audio :src="src" v-if="src" controls/>
    </div>
</template>

<script>
import Vue from "vue";
// import { Range } from 'mint-ui';
// import { Button } from 'mint-ui';

// Vue.component(Button.name, Button);
// Vue.component(Range.name, Range);

// import BottomView from '../bottom-view/index.vue'
// import RightView from '../right-view/index.vue'
// import TopView from '../top-view/index.vue'
// import EffectView from '../effect-view/index.vue'
// import DetailView from '../detail-view/index.vue'
// import PriceView from '../price-view/index.vue'
// import PriceDetailView from '../price-detail-view/index.vue'
// import OrderView from '../order-view/index.vue'

// import RoleView from '../role-view/index.vue'
// import ColorView from '../color-view/index.vue'
// import GuiderView from '../guider-view/index.vue'
// import LoadingView from '../loading-view/index.vue'
// import WalkView from '../walk-view/index.vue'
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'
import soundMaker from '../../js/soundMaker'
import audioClip from '../../js/audioClip'

// import price from "../../lib/price"
import axios from "axios";

var isWalk;

export default {
    data() {
        return {
            src: ''
        };
    },
    // components: {BottomView, RightView, TopView, EffectView, DetailView, RoleView, ColorView, GuiderView, LoadingView, WalkView, PriceView, PriceDetailView, OrderView},
    computed: {},
    beforeCreate(){
        var url = Tooler.getQueryString("u")||"";
    },
    created(){
        
    },
    mounted(){
        listener.on("url", (url) => {
            console.log('url==============')
            this.src = url
        })

        // axios.post("http://hhsrv.iadolph.com/usr/login.json?protocolVersion=1.0.1&platform=ios&productCodett=101&appName=timetunnel", {

        // }).then(res=>{
        //     console.log(res);
        // })
    },
    methods: {
        play(){
            soundMaker.load();
            // audioClip.test("https://wlwol.cn/media/audio/1582017952748.mp3");
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
