<template>
    <div class="effect-view" v-if="visible">
        <SlotView title="效果">
            <div slot="content">

                <RangeView :num="param.ambient" attr="ambient" @change="onChange" class="range" label="环境光" :min="0" :max="4"></RangeView>
                <RangeView :num="param.directional" attr="directional" @change="onChange" class="range" label="平行光" :min="0" :max="4"></RangeView>
                <RangeView :num="param.roughness" attr="roughness" @change="onChange" class="range" label="粗糙度" :min="0" :max="2"></RangeView>
                <RangeView :num="param.metalness" attr="metalness" @change="onChange" class="range" label="金属性" :min="0" :max="1"></RangeView>
                <RangeView :num="param.far" attr="far" @change="onChange" class="range" label="距离" :min="0" :max="1"></RangeView>

                <div class="btns">
                    <div class="btn" @click="close(false)">取消</div>
                    <div class="btn" @click="close(true)">确定</div>
                </div>
            </div>
        </SlotView>
    </div>
</template>

<script>
import SlotView from '../slot-view/index.vue'
import RangeView from '../range-view/index.vue'
import listener from '../../lib/listener'

export default {
    data() {
        return {
            cur: 0
        };
    },
    components: {SlotView, RangeView},
    computed: {
        visible(){
            return this.$store.state.effectVisible;
        },
        param(){
            return this.$store.state.effectParam;
        }
    },
    mounted(){
        this.$on("close", ()=>{
            this.$store.commit("changeEffectVisible", false);
        });
    },
    methods: {
        close(n){
            this.$store.commit("changeEffectVisible", false);
            // if(n){
            //     this.$store.commit("changeEffectParam", {});
            // }
        },
        onChange(attr, num){
            let param = Object.assign(this.param, {});
            param[attr] = num;
            this.$store.commit("changeEffectParam", param);
            listener.emit("param", attr, num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>