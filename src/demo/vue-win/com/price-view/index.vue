<template>
    <div class="price-view" v-if="visible">
        <div class="header">
            <div class="title">门窗整体报价</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="find" v-if="list.length==0">此方案暂无报价</div>
        
        <div class="content">
            <div class="box" v-for="(item, index) in list" v-bind:key="index" @click="jump(item)">
                <div class="win">
                    <div class="img-box">
                        <img class="img" :src="getImage(item)"/>
                    </div>
                    <div class="info">
                        <div class="line bold head">
                            <div class="left">{{item.pro_name}}</div>
                            <div class="right price">￥{{item.detail.cost}}</div>
                        </div>
                        <div class="line bold">
                            <div class="left">{{item.sys_name}}-{{item.pro_name}}</div>
                        </div>
                        <div class="line">
                            <div class="left">颜&emsp;&emsp;色：<span class="color">{{item.color_name}}</span></div>
                            <div class="right">楼层：<span class="color">4楼</span></div>
                        </div>
                        <div class="line">
                            <div class="left">门洞尺寸：<span class="color">{{getSize(item.detail)}}</span></div>
                            <div class="right">面积：<span class="color">{{item.detail.acreage}}m²</span></div>
                        </div>
                        <div class="line">
                            <div class="left frame">备&emsp;&emsp;注：<span class="color">无</span></div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="result">
                <div class="item">总数量：{{totalNum}}</div>
                <div class="item">总面积：{{totalArea}}</div>
                <div class="item">合计：<span class="total">￥{{totalPrice}}</span></div>
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
            list: [],
            totalNum: '-',
            totalArea: '-',
            totalPrice: '-'
        };
    },
    components: {},
    computed: {
        visible() {
            return this.$store.state.priceVisible;
        },
        imgs(){
            return this.$store.state.productImages;
        },
        logo(){
            return this.$store.state.logoImage || "./asset/img/logo.png";
        }
    },
    async mounted() {
        // this.init();
        let res = await price.getList();
        if(res && res.length != 0){
            this.list = res;
            var totalNum = 0;
            var totalArea = 0;
            var totalPrice = 0;
            this.list.forEach(item=>{
                totalNum += item.setnum;
                totalArea += item.detail.acreage;
                totalPrice += item.detail.cost;
            })
            this.totalNum = totalNum;
            this.totalArea = totalArea.toFixed(2);
            this.totalPrice = totalPrice.toFixed(2);
        }
    },
    methods: {
        close() {
            this.$store.commit("changePriceVisible", false);
        },
        getImage(obj){
            var host = price.getHost();
            var url = host + '/data/upload' + obj.plan_path + "/" + obj.plan_img;
            return url;
        },
        getSize(obj){
            return price.getSize(obj);
        },
        jump(item){
            console.log(item, 'jump');
            this.$store.commit("changePriceDetailVisible", true);
            this.$store.commit("changePriceItem", item);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>