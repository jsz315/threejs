<template>
    <div class="table-view">
        <div class="list" v-for="(item, index) in list" v-bind:key="index">
            <div class="table">
                <div class="t-title">
                    <div class="t-ico"></div>
                    <div class="t-tip1 big">门窗报价</div>
                </div>
                <div class="t-title">
                    <div class="t-tip1">{{item.planname}}-{{item.pro_name}}-{{item.sys_name}}</div>
                </div>
                <div class="t-title">
                    <div class="t-tip2">{{item.detail.acreage | formatNum}}m²</div>
                    <div class="t-tip3">￥{{item.detail.cost | formatNum}}</div>
                </div>
                <div class="t-list">
                    <table class="table" border="0" cellspacing="0">
                        <tr class="t-header">
                            <td class="td">窗名-项目名</td>
                            <td class="td">单价</td>
                            <td class="td">数量/面积</td>
                            <td class="td">折扣</td>
                            <td class="td">折后金额</td>
                        </tr>
                        <tr v-for="(obj, i) in item.detail.items" v-bind:key="index * 100 + i" v-show="!obj.deleted">
                            <td class="td t-name">{{obj.hostBale + '-' + obj.label}}</td>
                            <td class="td">{{obj.univalent | formatNum}}</td>
                            <td class="td">{{obj.count | formatNum}}</td>
                            <td class="td">{{obj.discount | formatDiscount}}</td>
                            <td class="td t-price">{{obj.amount | formatNum}}</td>
                        </tr>
                    </table>
                </div>

                <div class="t-title">
                    <div class="t-ico"></div>
                    <div class="t-tip1 big">洞口照片</div>
                </div>
                <img v-if="src" class="pic" :src="src" />
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
            list: [],
            src: "",
        };
    },
    components: {},
    computed: {
        
    },
    mounted() {
        this.init();
    },
    filters: {
        formatNum: function (value) {
            if (!value) return '-';
            return Number(value).toFixed(2);
        },
        formatDiscount: function(value){
            if(value == 1){
                return '不打折';
            }
            if (!value) return '-';
            return Number(value).toFixed(2);
        }
    },
    methods: {
        init(){
            this.list = [this.$store.state.priceItem];
            console.log(this.list, 'list');
            this.src = this.getImage();
        },
        getImage(obj){
            var obj = this.$store.state.priceItem;
            var host = price.getHost();
            var url = host + '/data/upload' + obj.plan_path + "/" + obj.plan_img;
            return url;
        },
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>