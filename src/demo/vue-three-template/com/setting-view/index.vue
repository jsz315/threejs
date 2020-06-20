<template>
    <div class="setting-view" v-if="settingVisible">
        <RangeView :num="param.ambient" attr="ambient" @change="onChange" class="range" label="环境光" :min="0" :max="4"></RangeView>
        <RangeView :num="param.directional" attr="directional" @change="onChange" class="range" label="平行光" :min="0" :max="4"></RangeView>
        <RangeView :num="param.roughness" attr="roughness" @change="onChange" class="range" label="粗糙度" :min="0" :max="2"></RangeView>
        <RangeView :num="param.metalness" attr="metalness" @change="onChange" class="range" label="金属性" :min="0" :max="2"></RangeView>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import listener from "../../lib/listener"
import RangeView from '../range-view/index.vue'
import axios from "axios";
import {mapMutations, mapState} from 'vuex'

export default {
    data() {
        return {
            
        };
    },
    components: {RangeView},
    computed: {
        ...mapState(["settingVisible", "param"])
    },
    mounted() {
        // console.log(this.param, "param");
        this.$toast("初始化完成");
        listener.on("setting", ()=>{
            this.changeSettingVisible(!this.settingVisible);
        })
    },
    filters: {
        
    },
    methods: {
        ...mapMutations(["changeSettingVisible", "changeParam"]),
        onChange(attr, num){
            let param = Object.assign(this.param, {});
            param[attr] = num;
            console.log(attr, num);
            this.changeParam(param);
            listener.emit("param", attr, num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>