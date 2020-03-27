<template>
    <div class="slot-view">
        <div class="panel">
            <div class="header" ref="div">
                <div class="title">{{title}}</div>
                <div class="close" @click="close"></div>
            </div>
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>

import Tooler from '../../core/Tooler'

const isMobile = Tooler.checkMobile();
let x = 0;
let y = 0;
let lastx = 0;
let lasty = 0;
let moving = false;
let div;

let temps = {tip: Math.random()}

function startDrag(e){
    moving = true;
    lastx = e.screenX;
    lasty = e.screenY;
    if(isMobile){
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);
    }
    else{
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
    }
}

function onEnd(e){
    if(isMobile){
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
    }
    else{
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
    }
}

function onMove(e){
    if(isMobile){
        e = e.changedTouches[0];
    }
    if(moving){
        x += e.screenX - lastx;
        y += e.screenY - lasty;
        update();
    }
    lastx = e.screenX;
    lasty = e.screenY;
}

function update(){
    div.parentElement.style.transform = `translate(${x}px,${y}px)`;
}

export default {
    data() {
        return {
            
        };
    },
    props: ["title"],
    components: {},
    computed: {},
    methods: {
        close(){
            this.$emit("close");
        }
    },
    mounted(){
        div = this.$refs.div;
        console.log(this.title + " slot on mounted");
        x = 0;
        y = 0;
        update();
        if(isMobile){
            div.addEventListener('touchstart', (e)=>{
                startDrag(e.changedTouches[0]);
            })
        }
        else{
            div.addEventListener('mousedown', (e)=>{
                startDrag(e);
            })
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>