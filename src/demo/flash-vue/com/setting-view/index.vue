<template>
    <div class="setting-view" :class="{hide: !visible}">
        <RangeView :num="param.ambient" attr="ambient" @change="onChange" class="range" label="环境光" :min="0" :max="4"></RangeView>
        <RangeView :num="param.directional" attr="directional" @change="onChange" class="range" label="平行光" :min="0" :max="4"></RangeView>
        <RangeView :num="param.roughness" attr="roughness" @change="onChange" class="range" label="粗糙度" :min="0" :max="2"></RangeView>
        <RangeView :num="param.metalness" attr="metalness" @change="onChange" class="range" label="金属性" :min="0" :max="2"></RangeView>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import listener from "../../lib/listener"
import RangeView from '../range-view/index.vue'
import axios from "axios";

export default {
    data() {
        return {
            phone: "",
            word: ""
        };
    },
    components: {RangeView},
    computed: {
        visible(){
            return this.$store.state.settingVisible;
        },
        param(){
            return this.$store.state.param;
        }
    },
    mounted() {
        // this.init();
        listener.on("setting", ()=>{
            this.$store.commit('changeSettingVisible', !this.visible);
        })
    },
    filters: {
        
    },
    methods: {
        onChange(attr, num){
            let param = Object.assign(this.param, {});
            param[attr] = num;
            console.log(attr, num);
            this.$store.commit("changeParam", param);
            listener.emit("param", attr, num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>