<template>
    <div class="color-view">
        <div class="label">{{label}}</div>
        <input class="color" type="color" v-model="cur" @change="onInput"/>
        <!-- <mt-range class="range" v-model="cur" :bar-height="1" @input="onInput"></mt-range> -->
        <div class="cur">{{cur}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cur: '#000000'
        };
    },
    props: {
        label: String,
        attr: String,
        num: {
            type: String,
            default: '#000000'
        }
    },
    components: {},
    computed: {
        
    },
    mounted(){
        this.cur = this.num;
    },
    methods: {
        onInput(){
            this.$emit("change", this.attr, this.cur);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>