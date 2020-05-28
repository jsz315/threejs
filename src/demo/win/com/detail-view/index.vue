<template>
    <div class="detail-view" v-if="visible">
        <img class="pic" :src="item" v-for="(item, index) in list" v-bind:key="index"/>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"

export default {
    data() {
        return {
            visible: true
        };
    },
    components: {},
    computed: {
        list(){
            var imgs = [];
            var {windoorImages, seriesImages, businessImages, brandImages} = this.$store.state;
            imgs = imgs.concat(windoorImages);
            imgs = imgs.concat(seriesImages);
            imgs = imgs.concat(businessImages);
            imgs = imgs.concat(brandImages);
            return imgs;
        }
    },
    mounted() {
        
    },
    filters: {
        
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>