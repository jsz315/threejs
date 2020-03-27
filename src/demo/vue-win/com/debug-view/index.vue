<template>
    <div class="debug-view" v-if="visible">
        <div class="info">
            <div class="tip">分辨率：{{dpr}}</div>
            <div class="tip">屏幕尺寸：{{screenSize.width + ' x ' + screenSize.height}}</div>
            <div class="tip">画布尺寸：{{canvasSize.width + ' x ' + canvasSize.height}}</div>
        </div>
        <div class="list" v-for="(item, index) in list" v-bind:key="index">
            <div class="item">
                <div class="state">
                    <div class="time">{{item.time}}</div>
                    <div class="num">{{item.num}}</div>
                </div>
                <div class="url">{{item.url}}</div>
            </div>
        </div>
        <div class="btn" @click="clear">清空</div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import chat from "../../chat"

export default {
    data() {
        return {
            visible: false,
            list: [],
            screenSize: Tooler.getStageSize(false),
            canvasSize: Tooler.getStageSize(true),
            dpr: window.devicePixelRatio
        };
    },
    components: {},
    computed: {
        
    },
    mounted() {
        this.init();
    },
    methods: {
        clear(){
            chat.clear();
            this.list = [];
        },
        init(){
            this.visible = Tooler.getQueryString("debug") == 1;
            var data = chat.readData();
            console.log("== debug data ==");
            console.log(data);
            var list = [];
            for(var i in data){
                var temp = data[i].pop().split("##");
                var item = {
                    time: i,
                    num: temp[0],
                    url: temp[1]
                }
                list.push(item);
            }
            this.list = list;
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>