<template>
    <div class="range-view">
        <div class="label">{{label}}</div>
        <mt-range class="range" v-model="num" :min="0" :max="100" :step="1" :bar-height="1"></mt-range>
        <div class="cur">100</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            num: 50
        };
    },
    props: ["label"],
    components: {},
    computed: {},
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>