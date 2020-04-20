<template>
    <div class="progress-view">
        <div class="line">
            <div class="color" :style="{width: left + 'px'}"></div>
            <div class="num" :style="{transform: 'translateX(' + x + 'px)'}">{{percent}}%</div>
        </div>
        <div class="info">
            <div class="logo"></div>
            <div class="space"></div>
            <div class="tip">【小提示】{{tip}}</div>
        </div>
    </div>
</template>

<script>
import listener from "../../lib/listener"

let timerId;
let max = 70 + Math.random() * 20;

export default {
    props: ['tips'],
    data() {
        return {
            visible: true,
            num: 0,
            left: 0,
            x: 0,
            tip: '',
            id: 0
        };
    },
    components: {},
    computed: {
        percent(){
            return this.num.toFixed(0);
        }
    },
    mounted() {
        timerId = setInterval(()=>{
            this.play();
        }, 60);
    },
    destroyed(){
        clearInterval(timerId);
        console.log('移除定时器');
    },
    filters: {
        
    },
    methods: {
        play(){
            var m = (max - this.num) * 0.04;
            this.num = this.num + m;
            this.left = this.num * window.innerWidth / 100;
            if(this.left > window.innerWidth - 40){
                this.x = window.innerWidth - 40;
            }
            else{
                this.x = this.left;
            }
            if(this.num >= 99){
                console.log('all loaded');
                this.$emit("end");
            }
        },
        end(){
            max = 100;
        },
        changeTip(){
            // this.tip = 'say' + Math.random();
            console.log('changeTip', this.tips);
            if(this.tips.length > 0){
                if(++this.id >= this.tips.length - 1){
                    this.id = 0;
                }
                this.tip = this.tips[this.id];
                console.log(this.tip, 'this.tip');
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>