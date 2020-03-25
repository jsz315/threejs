<template>
    <div class="price-view" v-if="visible">
        <div class="header">
            <div class="title">门窗整体报价</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="find" v-if="list.length==0">此方案暂无报价</div>
        <div class="content">
            <div class="box" v-for="(item, index) in list" v-bind:key="index">
                <div class="logo">
                    <img class="ico" :src="logo" />
                    {{item.brand_name}}
                </div>
                <div class="win">
                    <img class="img" :src="getImage(item)"/>
                    <div class="info">
                        <div class="name">{{item.sys_name}}-{{item.pro_name}}</div>
                        <div class="total">￥{{item.price}}</div>
                        <div class="total">x{{item.setnum}}</div>
                    </div>
                </div>
                <div class="tb">
                    <div class="label">颜 色:</div>
                    <div class="value">{{item.color_name}}</div>
                </div>
                <div class="tb">
                    <div class="label">尺 寸:</div>
                    <div class="value">{{item.size}}</div>
                </div>
                <div class="tb">
                    <div class="label">面 积:</div>
                    <div class="value">{{item.area}}m²</div>
                </div>
                <div class="tb">
                    <div class="label">折 扣:</div>
                    <div class="value color">{{item.count}}</div>
                </div>
                <div class="all">共{{item.setnum}}件 计:<span class="color">￥{{item.all}}</span></div>
            </div>

            <div class="result">
                <div class="item">总数量：{{totalNum}}</div>
                <div class="item">总面积：{{totalArea}}</div>
                <div class="item color">合计：￥{{totalPrice}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"

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
    mounted() {
        // console.log("url ==============");
        // let url = Tooler.getQueryString("url");
        // console.log(url);
        // let id = url.split("/").pop().split(".")[0];

        // let id = this.$store.state.modelId;
        // this.getImg(id);
        this.init();
    },
    methods: {
        close() {
            this.$store.commit("changePriceVisible", false);
        },
        getImage(obj){
            var host = Tooler.getQueryString("debug")== 1 ? 'http://3d.mendaow.com' : 'https://3d.mendaoyun.com';
            var url = host + '/data/upload' + obj.plan_path + "/" + obj.plan_img;
            console.log(url);
            var json = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file;
            this.getPrice(json, obj);
            return url;
        },
        async getPrice(url, obj){
            let res = await this.$get(url);
            var data = res.data;
            console.log(data);
            obj.area = data.acreage;
            obj.price = data.price;
            obj.count = data.items[0].discount;           
            obj.all = obj.count * obj.price * obj.setnum;
            obj.size = [data.length, data.height, data.width].join(" x ");

            var over = this.list.every(item=>{
                return item.all != '-';
            })
            if(over){
                var totalNum = 0;
                var totalArea = 0;
                var totalPrice = 0;
                this.list.forEach(item=>{
                    totalNum += item.setnum;
                    totalArea += item.area;
                    totalPrice += item.all;
                })
                this.totalNum = totalNum;
                this.totalArea = totalArea;
                this.totalPrice = totalPrice;
            }
            else{
                console.log("价格未初始化完成");
            }
        },
        getSize(obj){
            var h = obj.height;
            var l = obj.length;
            var w = obj.width;
            return [h, l, w].join(" X ");
        },
        async init() {
            let u = Tooler.getQueryString("u");
            if(!u){
                return;
            }
            let id = u.split("-").pop();
            let link = "/mapi/index.php";
            let res = await this.$get(link, {
                    app:"scheme",
                    fnn:"getPrice",
                    yun3d_id:id
                });
            console.log(res);
            if (res.data && res.data.code == 200) {
               res.data.datas.forEach(item=>{
                   item.price = '-';
                   item.count = '-';
                   item.area = '-';
                   item.all = '-';
                   item.size = '-';
               })

               this.list = res.data.datas;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>