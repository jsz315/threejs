<template>
    <div class="slot-view">
        <div class="panel">
            <div class="header">
                <div class="title">{{title}}</div>
                <div class="close" @click="close"></div>
            </div>
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    props: ["title"],
    components: {},
    computed: {},
    methods: {
        close(){
            this.$parent.$emit("close");
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>