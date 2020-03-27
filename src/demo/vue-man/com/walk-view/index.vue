<template>
    <div class="walk-view" v-if="visible">

        <template v-if="isMobile">
            <div class="btns">
                <div class="btn left" @touchstart.stop.prevent="touchstart('left')" @touchend.stop.prevent="touchend('left')"></div>
                <div class="btn right" @touchstart.stop.prevent="touchstart('right')" @touchend.stop.prevent="touchend('right')"></div>
                
                <div class="btn front" @touchstart.stop.prevent="touchstart('front')" @touchend.stop.prevent="touchend('front')"></div>
                <div class="btn back" @touchstart.stop.prevent="touchstart('back')" @touchend.stop.prevent="touchend('back')"></div>
            </div>

            <div class="btn up" @touchstart.stop.prevent="touchstart('up')" @touchend.stop.prevent="touchend('up')"></div>
            <div class="btn down" @touchstart.stop.prevent="touchstart('down')" @touchend.stop.prevent="touchend('down')"></div>
        </template>

        <template v-if="!isMobile">
            <div class="btns">
                <div class="btn left" @mousedown="touchstart('left')" @mouseup="touchend('left')"></div>
                <div class="btn right" @mousedown="touchstart('right')" @mouseup="touchend('right')"></div>
                
                <div class="btn front" @mousedown="touchstart('front')" @mouseup="touchend('front')"></div>
                <div class="btn back" @mousedown="touchstart('back')" @mouseup="touchend('back')"></div>
            </div>

            <div class="btn up" @mousedown="touchstart('up')" @mouseup="touchend('up')"></div>
            <div class="btn down" @mousedown="touchstart('down')" @mouseup="touchend('down')"></div>
        </template>

        
    </div>
    
</template>

<script>
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler'
let tid = 0;
let total = 0;
export default {
    data() {
        return {
            visible: true,
            isMobile: true
        };
    },
    components: {},
    computed: {},
    mounted(){
        this.isMobile = Tooler.checkMobile();

        // window.addEventListener("all loaded", e => {
        //     this.visible = false;
        // })

        // listener.on("init", ()=>{
        //     this.isInit = true;
        // })
    },
    methods: {
        // listener.on("init", ()=>{
        //     this.isInit = true;
        // })
        touchstart(n){
            listener.emit("touchstart", n);
        },
        touchend(n){
            listener.emit("touchend", n);
        }
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>