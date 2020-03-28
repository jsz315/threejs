<template>
    <div class="detail-view" v-if="visible">
        <div class="header">
            <div class="title">产品详情</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="content">
            <DebugView></DebugView>
            <img class="img" v-for="item in imgs" v-bind:Key="item" :src="item">
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import DebugView from '../debug-view/index.vue'
import listener from "../../lib/listener"

export default {
    data() {
        return {
            retry: false
        };
    },
    components: {DebugView},
    computed: {
        visible() {
            return this.$store.state.detailVisible;
        },
        imgs(){
            return this.$store.state.productImages;
        }
    },
    mounted() {
        // console.log("url ==============");
        // let url = Tooler.getQueryString("url");
        // console.log(url);
        // let id = url.split("/").pop().split(".")[0];

        // let id = this.$store.state.modelId;
        // this.getImg(id);
    },
    methods: {
        close() {
            this.$store.commit("changeDetailVisible", false);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>