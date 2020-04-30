<template>
    <div class="scroll-view">
        <div class="item title">
            <div class="t1 tip">姓名</div>
            <div class="t2 tip">电话</div>
            <div class="t3 tip">时间</div>
            <div class="t4 tip">结果</div>
        </div>
        <div class="box" :class="{scroll: canScroll}">
            <div class="list" :class="{move: move}">
                <div class="item" v-for="(item, index) in list" v-bind:key="item + '-' + index">
                    <div class="t1 tip">{{item.client_name}}</div>
                    <div class="t2 tip">{{item.phone | phoneNumber}}</div>
                    <div class="t3 tip">{{item.time | timeFormat}}</div>
                    <div class="t4 tip">预约成功</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"

let tid = 0;

export default {
    data() {
        return {
            move: false,
            canScroll: false
        };
    },
    props: ["list"],
    components: {},
    computed: {
        
    },
    mounted() {
        if(this.list.length > 8){
            this.canScroll = true;
            this.play();
        }
    },
    beforeDestroy(){
        console.log('移除滚动动画');
        clearInterval(tid);
    },
    filters: {
        phoneNumber(value){
            value = value + "";
            return value.substr(0, 3) + "***" + value.substr(-4);
        },
        timeFormat(value){
            return value.split(" ")[0];
            // return price.timerFormat(value);
        }
    },
    methods: {
        play(){
            clearInterval(tid);
            console.log('开启滚动动画');
            tid = setInterval(() => {
                this.move = true;
                setTimeout(() => {
                    this.move = false;
                    var temp = this.list;
                    var n = temp.shift();
                    temp.push(n);
                    this.list = temp;
                }, 500);
            }, 1500);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>