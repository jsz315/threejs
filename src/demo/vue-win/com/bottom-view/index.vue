<template>
    <div class="bottom-view">
        <div class="btn" @click="openDesign">免费设计</div>
        <div class="btn" @click="openDetail">产品详情</div>
        <div class="btn">产品报价</div>
        <div class="btn" @click="openAnimate">开关动效</div>
    </div>
</template>

<script>
import listener from '../../lib/listener'
export default {
    data() {
        return {
            
        };
    },
    components: {},
    computed: {},
    methods: {
        openDesign(){
            this.$store.commit("changeDesignVisible", true);
        },
        openDetail(){
            this.$store.commit("changeDetailVisible", true);
        },
        openAnimate(){
            console.log("open");
            listener.emit("open");
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>

