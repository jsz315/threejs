<template>
    <div class="color-view" v-if="visible">
        <div class="color-tip" id="main-tip">{{isSingle ? '替换颜色' : '替换内框颜色'}}</div>
        <div class="colors" id="colors-main">
            <div class="color" :style="{'background-image': 'url(' + item['color_img'] + ')'}" v-for="(item, index) in list" v-bind:key="index" @click="changeColor(item, false)"></div>
        </div>
        <div class="color-tip" id="sub-tip" v-if="!isSingle">替换外框颜色</div>
        <div class="colors" id="colors-sub" v-if="!isSingle">
            <div class="color" :style="{'background-image': 'url(' + item['color_img'] + ')'}" v-for="(item, index) in list" v-bind:key="index" @click="changeColor(item, true)"></div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import listener from "../../lib/listener"

export default {
    data() {
        return {
            visible: true
        };
    },
    components: {},
    computed: {
        isSingle(){
            return this.$store.state.isSingle;
        },
        list(){
            return this.$store.state.colorList.slice(0, 22);
        }
    },
    mounted() {
        // this.init();
    },
    filters: {
        formatNum: function (value) {
            if (!value) return '-';
            return Number(value).toFixed(2);
        }
    },
    methods: {
        changeColor(item, isSub){
            listener.emit('changeColor', item['color_img'], isSub);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>