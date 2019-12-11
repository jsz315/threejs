<template>
    <div class="effect-view" v-if="visible">
        <SlotView title="变换">
            <div slot="content">

                <RangeView :num="param.x" attr="x" @change="onChange" class="range" label="X轴" :min="-180" :max="180" :step="10"></RangeView>
                <RangeView :num="param.y" attr="y" @change="onChange" class="range" label="Y轴" :min="-180" :max="180" :step="10"></RangeView>
                <RangeView :num="param.z" attr="z" @change="onChange" class="range" label="Z轴" :min="-180" :max="180" :step="10"></RangeView>

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
            return this.$store.state.transformVisible;
        },
        param(){
            return this.$store.state.transformParam;
        }
    },
    mounted(){
        this.$on("close", ()=>{
            this.$store.commit("changeTransformVisible", false);
        });
    },
    methods: {
        close(n){
            this.$store.commit("changeTransformVisible", false);
        },
        onChange(attr, num){
            let param = Object.assign(this.param, {});
            param[attr] = num;
            this.$store.commit("changeTransformParam", param);
            listener.emit("param", attr, num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>