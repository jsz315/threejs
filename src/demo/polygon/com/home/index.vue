<template>
    <div class="home">

        <canvas ref="canvas" class="canvas"></canvas>
        <div class="btns">
            <mt-button class="btn" type="default" @click="drawStart">开始绘图</mt-button>
            <mt-button class="btn" type="default" @click="drawEnd">结束绘图</mt-button>
            <mt-button class="btn" type="default" @click="doShape('Intersection')">交集(Intersection)</mt-button>
            <mt-button class="btn" type="default" @click="doShape('Union')">并集(Union)</mt-button>
            <mt-button class="btn" type="default" @click="doShape('Difference')">差集(Difference)</mt-button>
        </div>
        <mt-field class="textarea" placeholder="顶点数组" type="textarea" rows="4" v-model="pots"></mt-field>
        <div class="btns">
            <mt-button class="btn" type="default" @click="drawJson">解析JSON数据</mt-button>
        </div>
    </div>
</template>

<script>

let canvas, ctx, curPots, moving, curSprites, multi;
import Sprite from "./sprite";
import Tooler from "./tooler";

let sprites = [];

export default {
    data() {
        return {
            pots: "",
            drawing: false
        };
    },
    components: {},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    mounted(){
        canvas = this.$refs.canvas;
        canvas.width = window.innerWidth;
        canvas.height = canvas.width * 0.64;
        ctx = canvas.getContext("2d");
        document.addEventListener("keydown", (e) => {
            if(e.key == "Shift"){
                multi = true;
            }
        })
        document.addEventListener("keyup", (e) => {
            multi = false;
        })
        canvas.addEventListener("mousedown", (e) => {
            let x = e.offsetX;
            let y = e.offsetY;
            if(this.drawing){
                curPots.push({x, y});
                ctx.strokeStyle = "#000000";
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                if(curPots.length == 0){
                    ctx.moveTo(x, y);
                }
                else{
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            else{
                if(!multi){
                    curSprites = [];
                    sprites.forEach(item => {
                        item.selected = false;
                    })
                }
                for(let t = sprites.length - 1; t >= 0; t--){
                    let item = sprites[t];
                    if(item.checkHit(x, y)){
                        curSprites.push(item);
                        item.selected = true;
                        moving = true;
                        break;
                    }
                }
            }
        });

        canvas.addEventListener("mousemove", (e) => {
            if(moving){
                curSprites.forEach(item => {
                    item.x += e.movementX;
                    item.y += e.movementY;
                })
            }
        });

        canvas.addEventListener("mouseup", (e) => {
            moving = false;
            // curSprites = null;
        })

        this.updateCanvas();
    },
    methods: {
        doShape(type){
            if(curSprites.length >= 2){
                // let t1 = curSprites[0].getList();
                // let t2 = curSprites[1].getList();
                let ps = curSprites.map(item => {
                    return item.getList()
                })
                let list = Tooler.computeShape("ct" + type, ps);
                this.drawList(list);
            }
        },
        updateCanvas(){
            if(!this.drawing){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                sprites.forEach(item=>{
                    item.draw();
                })
            }
            window.requestAnimationFrame(()=>{
                this.updateCanvas();
            });
        },
        drawJson(){
            let list = eval(this.pots.toLowerCase());
            if(!list){
                this.$toast("请输入顶点数据");
                return;
            }
            this.drawList(list);
        },
        drawList(list){
            if(Array.isArray(list[0])){
                list.forEach(item => {
                    this.drawList(item);
                })
                return;
            }
            let sprite = new Sprite(ctx, list);
            sprites.push(sprite);
        },
        drawStart(){
            this.drawing = true;
            curPots = [];
            ctx.beginPath();
        },
        drawEnd(){
            this.drawing = false;
            let sprite = new Sprite(ctx, curPots);
            sprites.push(sprite);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
