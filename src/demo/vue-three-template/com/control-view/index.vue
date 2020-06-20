<template>
    <div class="control-view">
        <div class="move-btn" ref="move">
            <div class="cir" :style="style"></div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import listener from "../../lib/listener"

let onTouchMove;
let onTouchEnd;

export default {
    data() {
        return {
            x: 0,
            y: 0
        };
    },
    components: {},
    computed: {
        style(){
            return {
                transform: `translate(${this.x}px, ${this.y}px)`
            }
        }
    },
    mounted() {
        this.init();
    },
    filters: {
        
    },
    methods: {
        init(){
            let pot;
            let start;
            this.$refs.move.addEventListener("touchstart", (e)=>{
                start = e.changedTouches[0];
                pot = e.changedTouches[0];
                onTouchMove = listener.make(window, 'touchmove', (e)=>{
                    var p = e.changedTouches[0];
                    this.x += p.clientX - pot.clientX;
                    this.y += p.clientY - pot.clientY;
                    pot = p;
                })

                onTouchEnd = listener.make(window, 'touchend', (e)=>{
                   
                    onTouchMove.destory();
                    onTouchEnd.destory();
                    this.x = 0;
                    this.y = 0;

                    var ox = e.changedTouches[0].clientX - start.clientX;
                    var oy = e.changedTouches[0].clientY - start.clientY;
                    listener.emit("move", ox, oy);
                    console.log(e, 'end', ox, oy);
                    
                })
            })
        },
        jump(){
            
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>