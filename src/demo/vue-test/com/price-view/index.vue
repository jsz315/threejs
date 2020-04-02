<template>
    <div class="price-view">
        <div class="header">
            <div class="title">门窗整体报价</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="find" v-if="list.length==0">此方案暂无报价</div>
        
        <div class="content">
            <div class="box" v-for="(item, index) in list" v-bind:key="index">
                <div class="logo">
                    <img class="ico" :src="logo" />
                    {{1}}
                </div>
                <div class="win">
                    <div class="img-box">
                        <img class="img" :src="item"/>
                    </div>
                    <div class="info">
                        <div class="name">1</div>
                        <div class="total">￥1</div>
                        <div class="total">x1</div>
                    </div>
                </div>
                <div class="tb">
                    <div class="label">颜 色:</div>
                    <div class="value">1</div>
                </div>
                <div class="tb">
                    <div class="label">尺 寸:</div>
                    <div class="value">1</div>
                </div>
                <div class="tb">
                    <div class="label">面 积:</div>
                    <div class="value">1</div>
                </div>
                <div class="tb">
                    <div class="label">折 扣:</div>
                    <div class="value color">1</div>
                </div>
                <div class="all">共1件 计:<span class="color">￥1</span></div>
            </div>

            <div class="result">
                <div class="item">总数量：1</div>
                <div class="item">总面积：1</div>
                <div class="item color">合计：￥1</div>
            </div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"

export default {
    data() {
        return {
            retry: false,
            list: [
                'http://3d.mendaow.com/data/upload/model2d/brand/125/6614/planThumb1565317617.jpg',
                'http://3d.mendaow.com/data/upload/model2d/brand/125/11638/planThumb1572493921.jpg'
            ],
            totalNum: '-',
            totalArea: '-',
            totalPrice: '-'
        };
    },
    components: {},
    computed: {
        logo(){
            return "./asset/img/logo.png";
        }
    },
    async mounted() {
        
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>