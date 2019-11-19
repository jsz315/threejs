<template>
    <div class="right-view">
        <div class="ico share"></div>
        <div class="ico effect" @click="openEffect"></div>
        <div class="ico full"></div>
        <div class="ico picture"></div>
        <div class="ico camera"></div>
        <div class="ico thumb"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    components: {},
    computed: {},
    methods: {
        openEffect(){
            this.$store.commit("changeEffectVisible", true);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>