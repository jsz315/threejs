<template>
    <div class="home">
        <div class="content">
            <input class="txt" type="text" v-model="points">
            <div class="btn" @click="onAdd(3)">添加3D点</div>
            <div class="btn" @click="onAdd(2)">添加2D点</div>
            <div class="btn" @click="onRand">随机</div>
            <div class="btn" @click="onClear">清空</div>
        </div>
        <div class="ico" @click="showSetting"></div>
        <Setting ref="setting"></Setting>
    </div>
</template>

<script>
import listener from '../../lib/listener';
import Setting from "../setting/index.vue"

export default {
    data() {
        return {
            points: "",
            min: 3,
            max: 100
        };
    },
    components: {Setting},
    computed: {},
    beforeCreate(){
       
    },
    created(){
        
    },
    mounted(){
        listener.on("changeRandom", obj => {
            console.log("changeRandom");
            console.log(obj);
            this.min = Number(obj.min);
            this.max = Number(obj.max);
        })
        this.points = localStorage.getItem("points");
    },
    methods: {
        showSetting(){
            this.$refs.setting.show();
        },
        onAdd(type){
            var ps = this.points;
            ps = ps.replace(/\s/g, "");
            // if(type == 1){
            //     ps = ps.replace(/\s/g, "");
            //     var list = ps.split(",");
            //     var total = list.length;
            //     var aim = [];
            //     if(total % 2 == 0){
            //         for(var i = 0; i < total; i++){
            //             aim.push(list[i]);
            //             if(i % 2 == 1){
            //                 aim.push(0);
            //             }
            //         }
            //         ps = aim.join(",");
            //     }
            //     else{
            //         alert("顶点应为2的倍数");
            //         return;
            //     }
            // }
            listener.emit("points", ps, type);
            this.save();
        },
        onRand(){
            var list = [];
            var t = Math.random() * (this.max - this.min) + this.min;
            for(var i = 0; i < t; i++){
                var x = (0.5 - Math.random()) * 400;
                var y = (0.5 - Math.random()) * 400;
                var z = (0.5 - Math.random()) * 400;
                list.push(x, y, z);
            }
            this.points = list.join(",")
            listener.emit("points", this.points, 3);
            this.save();
        },
        onClear(){
            listener.emit("clear");
        },
        save(){
            localStorage.setItem("points", this.points);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
