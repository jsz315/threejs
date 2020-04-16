<template>
    <div class="table-view" v-if="visible">
        <div class="list" v-for="(item, index) in list" v-bind:key="index">
            <div class="table">
                <div class="t-title">
                    <div class="t-ico"></div>
                    <div class="t-tip1">{{item.seriesName}}-门窗报价</div>
                </div>
                <div class="t-title">
                    <div class="t-tip2">{{item.area | formatNum}}m²</div>
                    <div class="t-tip3">￥{{item.price | formatNum}}</div>
                    <div class="t-arrow" :class="{hide: item.hide}" @click="hideTable(item, index)"></div>
                </div>
                <div class="t-list" :class="{hide: item.hide}" ref="list">
                    <table class="table" border="0" cellspacing="0">
                        <tr class="t-header">
                            <td class="td">窗名-项目名</td>
                            <td class="td">单价</td>
                            <td class="td">数量/面积</td>
                            <td class="td">折扣</td>
                            <td class="td">折后金额</td>
                        </tr>
                        <tr v-for="(obj, i) in item.items" v-bind:key="index * 100 + i" v-show="!obj.deleted">
                            <td class="td t-name">{{obj.hostBale + '-' + obj.label}}</td>
                            <td class="td">{{obj.univalent | formatNum}}</td>
                            <td class="td">{{obj.count | formatNum}}</td>
                            <td class="td">{{obj.discount | formatDiscount}}</td>
                            <td class="td t-price">{{obj.amount | formatNum}}</td>
                        </tr>
                    </table>
                </div>
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
            visible: false,
            list: [],
            heights: [0]
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
        async init(){
            let res = await price.getList();
            if(res.list.length == 0){
                return;
            }
            res.list.forEach(item=>{
                item.hide = false;
            });
            console.log("==list==");
            console.log(res.list);
            this.list = res.list;
            this.visible = true;
        },
        hideTable(item, index){
            item.hide = !item.hide;
            var div = this.$refs.list[index];
            if(this.heights[index] == 0){
                console.log("初始化", index, div.offsetHeight);
                this.heights[index] = div.offsetHeight;
            }
            if(item.hide){
                div.style.maxHeight = '0';
            }
            else{
                div.style.maxHeight = this.heights[index] + 'px';
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>