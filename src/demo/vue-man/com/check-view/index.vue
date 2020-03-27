<template>
    <div class="check-view">
        <div class="label">{{label}}</div>
        <div class="check-box" :class="{'selected': num}" @click="onInput"></div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            
        };
    },
    props: {
        label: String,
        attr: String,
        num: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    computed: {
        
    },
    mounted(){
        
    },
    methods: {
        onInput(){
            this.$emit("change", this.attr, !this.num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>