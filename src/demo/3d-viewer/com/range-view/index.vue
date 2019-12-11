<template>
    <div class="range-view">
        <div class="label">{{label}}</div>
        <mt-range class="range" v-model="cur" :bar-height="1" @input="onInput" :min="min" :max="max" :step="step"></mt-range>
        <div class="cur">{{showNum}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cur: 0
        };
    },
    props: {
        label: String,
        attr: String,
        num: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1
        }
    },
    components: {},
    computed: {
        showNum(){
            // return this.cur * (this.max - this.min) / 100;
            return this.cur;
        }
    },
    mounted(){
        if(this.max <= this.min){
            this.$toast('最小值不能大于最大值');
            return;
        }
        // this.cur = this.num * 100 / (this.max - this.min);
    },
    methods: {
        onInput(){
            this.$emit("change", this.attr, this.showNum);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>