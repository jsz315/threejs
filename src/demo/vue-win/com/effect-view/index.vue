<template>
    <div class="effect-view" v-if="visible">
        <SlotView title="效果">
            <div slot="content">
                <RangeView class="range" label="环境光"></RangeView>
                <RangeView class="range" label="光强"></RangeView>
                <RangeView class="range" label="粗糙度"></RangeView>
                <RangeView class="range" label="金属性"></RangeView>
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
export default {
    data() {
        return {
            
        };
    },
    components: {SlotView, RangeView},
    computed: {
        visible(){
            return this.$store.state.effectVisible;
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
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>