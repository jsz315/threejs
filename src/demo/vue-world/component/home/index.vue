<template>
    <div class="home">
        <div class="content">
            <input class="txt" type="text" v-model="points">
            <div class="btn" @click="onAdd">确定</div>
            <div class="btn" @click="onRand">随机</div>
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
        onAdd(){
            listener.emit("points", this.points);
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
            listener.emit("points", this.points);
            this.save();
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
