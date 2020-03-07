<template>
    <div class="setting" v-show="visible">
        <div class="title">控制面板<div class="close" @click="hide"></div></div>
        <div class="content">
            <div class="param">
                <div class="label">操作对象</div>
                <div class="choose">
                    <div class="item">
                        <div class="btn" :class="{'selected': type == 0}" @click="choose(0)"></div>全部
                    </div>
                    <div class="item">
                        <div class="btn" :class="{'selected': type == 1}" @click="choose(1)"></div>当前
                    </div>
                    <div class="item">
                        <div class="btn" :class="{'selected': type == 2}" @click="choose(2)"></div>起始
                    </div>
                </div>
            </div>
            <div class="param">
                <div class="label">顶点尺寸({{size}})</div>
                <input type="range" class="range" min="0.01" max="20" step="0.01" @change="changeSize">
            </div>
            <div class="param">
                <div class="label">顶点颜色</div>
                <input type="color" class="color" @change="changePointColor">
            </div>
            <div class="param">
                <div class="label">显示隐藏</div>
                <div class="choose">
                    <div class="item">
                        <div class="btn" :class="{'selected': isGrid}" @click="toggle(0)"></div>网格
                    </div>
                    <div class="item">
                        <div class="btn" :class="{'selected': isAxes}" @click="toggle(1)"></div>坐标
                    </div>
                    <div class="item">
                        <div class="btn" :class="{'selected': isFrame}" @click="toggle(2)"></div>边框
                    </div>
                </div>
            </div>
            <div class="param">
                <div class="label">线条颜色</div>
                <input type="color" class="color" @change="changeLineColor">
            </div>
            <div class="param">
                <div class="label">位置信息</div>
                <div class="choose">
                    <div class="item">
                        X:<input type="number" class="number" v-model="x" @change="changePosition($event, 'x')"/>
                    </div>
                    <div class="item">
                        Y:<input type="number" class="number" v-model="y" @change="changePosition($event, 'y')"/>
                    </div>
                    <div class="item">
                        Z:<input type="number" class="number" v-model="z" @change="changePosition($event, 'z')"/>
                    </div>
                </div>
            </div>
            <div class="param">
                <div class="label">顶点</div>
                <div class="info">
                    当前索引: {{index}}, {{total}}
                </div>
            </div>

            <div class="param">
                <div class="label">随机数</div>
                <div class="choose">
                    <div class="item">
                        min:<input type="number" class="number" v-model="min" @change="changeRandom($event, 'min')"/>
                    </div>
                    <div class="item">
                        max:<input type="number" class="number" v-model="max" @change="changeRandom($event, 'max')"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import listener from '../../lib/listener';

export default {
    data() {
        return {
            points: "",
            type: 0,
            pointColor: "",
            lineColor: "",
            size: 1,
            isGrid: true,
            isAxes: true,
            isFrame: true,
            x: 0,
            y: 0,
            z: 0,
            index: -1,
            total: 0,
            visible: false,
            min: 3,
            max: 100
        };
    },
    components: {},
    computed: {},
    beforeCreate(){
       
    },
    created(){
        
    },
    mounted(){
        listener.on("setPosition", obj => {
            console.log("setPosition");
            console.log(obj);
            this.x = obj.x;
            this.y = obj.y;
            this.z = obj.z;
        })
        listener.on("setIndex", (index, total) => {
            this.index = index;
            this.total = total;
        })
    },
    methods: {
        show(){
            this.visible = true;
        },
        hide(){
            this.visible = false;
        },
        choose(n){
            this.type = n;
        },
        toggle(n){
            if(n == 0){
                this.isGrid = !this.isGrid;
            }
            else if(n == 1){
                this.isAxes = !this.isAxes;
            }
            else{
                this.isFrame = !this.isFrame;
            }
            listener.emit("changeVisible", {
                isGrid: this.isGrid,
                isAxes: this.isAxes,
                isFrame: this.isFrame
            })
        },
        changeSize(e){
            console.log(e);
            this.size = e.target.value;
            listener.emit("size", this.type, Number(this.size));
        },
        changePointColor(e){
            console.log(e);
            this.pointColor = e.target.value;
            listener.emit("pointColor", this.type, this.pointColor);
        },
        changeLineColor(e){
            console.log(e);
            this.lineColor = e.target.value;
            listener.emit("lineColor", this.lineColor);
        },
        changePosition(event, type){
            console.log(event);
            console.log(type);
            this[type] = event.target.value;
            var {x, y, z} = this;
            console.log({x, y, z});
            listener.emit("changePosition", {x, y, z});
        },
        changeRandom(event, type){
            this[type] = event.target.value;
            var {min, max} = this;
            console.log({min, max});
            listener.emit("changeRandom", {min, max});
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
