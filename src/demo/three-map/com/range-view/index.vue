<template>
    <div class="range-view">
        <div class="label">{{label}}</div>
        <mt-range class="range" v-model="cur" :bar-height="1" @input="onInput"></mt-range>
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
        }
    },
    components: {},
    computed: {
        showNum(){
            return (this.cur * (this.max - this.min) / 100).toFixed(2);
        }
    },
    mounted(){
        if(this.max <= this.min){
            this.$toast('最小值不能大于最大值');
            return;
        }
        this.cur = this.num * 100 / (this.max - this.min);
    },
    methods: {
        onInput(){
            this.$emit("change", this.attr, Number(this.showNum));
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>