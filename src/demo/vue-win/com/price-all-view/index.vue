<template>
    <div class="price-all-view" v-if="visible">
        <div class="header">
            <div class="title">产品报价</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="find" v-if="isTip">-- {{tip}} --</div>
        
        <div class="content">
            <div class="box" v-for="(item, index) in list" v-bind:key="index" @click="jump(item)">
                <div class="win">
                    <div class="img-box">
                        <img class="img" :src="getImage(item)"/>
                    </div>
                    <div class="info">
                        
                        
                        <!--门窗数据-->
                        <template v-if="item.type=='windoor'">
                            <div class="line bold head">
                                <div class="left">{{item.planname}}</div>
                                <div class="right price">￥{{item.detail.amount}}</div>
                            </div>
                            <div class="line bold">
                                <div class="left">{{item.sys_name}}-{{item.pro_name}}</div>
                                <div class="right num">X {{item.setnum}}</div>
                            </div>

                            <div class="line">
                                <div class="left">颜&emsp;&emsp;色：<span class="color">{{item.color_name}}</span></div>
                                <div class="right">楼层：<span class="color">{{item.floorName||'暂无数据'}}</span></div>
                            </div>
                            <div class="line">
                                <div class="left">门洞尺寸：<span class="color">{{getSize(item)}}</span></div>
                                <div class="right">面积：<span class="color">{{item.detail.acreage}}m²</span></div>
                            </div>
                        </template>

                        <!--方案数据-->
                        <template v-else>
                            <div class="line bold head">
                                <div class="left">{{item.planname}}</div>
                                <div class="right price">￥{{getPartPrice(item)}}</div>
                            </div>
                            <div class="line bold">
                                <div class="left">{{''}}</div>
                                <div class="right num">X {{1}}</div>
                            </div>

                            <div class="line">
                                <div class="left">门窗数量：<span class="color">{{item.windoor_number || 0}}</span></div>
                                <div class="right long">门窗报价：<span class="color">￥{{formatPrice(item.windoor_price, 2)}}</span></div>
                            </div>
                            <div class="line">
                                <div class="left">面&emsp;&emsp;积：<span class="color">{{formatPrice(item.acreage, 2)}}m²</span></div>
                                <div class="right long">其他加价：<span class="color">￥{{formatPrice(item.base_price, 2)}}</span></div>
                            </div>
                        </template>
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
import listener from '../../lib/listener'

export default {
    data() {
        return {
            retry: false,
            list: [],
            totalNum: '-',
            totalArea: '-',
            totalPrice: '-',
            isInit: false,
            isTip: true,
            tip: "数据加载中"
        };
    },
    components: {},
    computed: {
        visible() {
            return this.$store.state.priceAllVisible;
        },
        imgs(){
            return this.$store.state.productImages;
        },
        logo(){
            return this.$store.state.logoImage || "./asset/img/logo.png";
        }
    },
    async mounted() {
        listener.on("price", ()=>{
            this.init();
        })

        // setTimeout(() => {
        //     this.init();
        // }, 1200);
    },
    methods: {
        getPartPrice(item){
            var n = (item.windoor_price + item.base_price) * item.discount;
            if(isNaN(n)){
                return 0;
            }
            return n;
        },
        formatPrice(n, count){
            var num = Number(n);
            if(isNaN(num)){
                num = 0;
            }
            return num.toFixed(count);
        },
        async init(){
            if(this.isInit){
                return;
            }
            this.isInit = true;
            let res = await price.getList();
            console.log(res, "price list");
            if(res && res.length != 0){
                this.list = res;
                var totalNum = 0;
                var totalArea = 0;
                var totalPrice = 0;
                this.list.forEach(item=>{
                    if(item.type == "windoor"){
                        totalNum += Tooler.toNumber(item.setnum);
                        totalArea += Tooler.toNumber(item.detail.acreage) * item.setnum;
                        totalPrice += Tooler.toNumber(item.detail.amount) * item.setnum;
                    }
                    else{
                        totalNum += Tooler.toNumber(item.windoor_number);
                        totalArea += Tooler.toNumber(item.acreage);
                        totalPrice += Tooler.toNumber(item.windoor_price);
                    }
                    
                })
                this.totalNum = totalNum;
                this.totalArea = totalArea.toFixed(2);
                this.totalPrice = totalPrice.toFixed(2);
                this.isTip = false;
            }
            else{
                this.tip = "此方案暂无报价";
            }
        },
        close() {
            this.$store.commit("changePriceAllVisible", false);
        },
        getImage(obj){
            var host = price.getHost();

            // var url = host + '/data/upload' + obj.plan_path + "/" + obj.plan_img;
            var url = obj.plan_img || obj.thumb;
            if(obj.old){
                url = host + '/data/upload' + obj.plan_path + "/" + obj.plan_img;
            }
            return url;
        },
        getSize(obj){
            return [Number(obj.plan_l).toFixed(0), Number(obj.plan_h).toFixed(0), Number(obj.plan_w).toFixed(0)].join("x");
            // return price.getSize(obj);
        },
        jump(item){
            console.log(item, 'jump');
            if(item.type == "windoor"){
                this.$store.commit("changePriceDetailVisible", true);
                this.$store.commit("changePriceItem", item);
            }
            else{
                this.$store.commit("changePriceWindowVisible", true);
                this.$store.commit("changePartItem", item);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>