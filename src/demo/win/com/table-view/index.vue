<template>
    <div class="table-view" v-if="visible">
        <div class="list" v-for="(item, index) in list" v-bind:key="index">
            <div class="table">
                <div class="t-title">
                    <div class="t-ico"></div>
                    <div class="t-tip1">门窗报价</div>
                    <div class="t-tip2">{{item.area}}m²</div>
                    <div class="t-tip3">￥{{item.price}}</div>
                    <div class="t-arrow" :class="{hide: item.hide}" @click="item.hide = !item.hide"></div>
                </div>
                <div class="t-list" :class="{hide: item.hide}">
                    <div class="t-item header">
                        <div class="t-i1">窗名-项目名</div>
                        <div class="t-i2">单价</div>
                        <div class="t-i3">数量/面积</div>
                        <div class="t-i4">折扣</div>
                        <div class="t-i5">折后金额</div>
                    </div>
                    <div class="price">
                        <div class="t-item data" v-for="(obj, i) in item.items" v-bind:key="index * 100 + i">
                            <div class="t-i1 ti">{{obj.hostBale + '-' + obj.label}}</div>
                            <div class="t-i2 ti">{{obj.price}}</div>
                            <div class="t-i3 ti"></div>
                            <div class="t-i4 ti">{{obj.discount}}</div>
                            <div class="t-i5 ti">{{obj.price * obj.discount}}</div>
                        </div>
                    </div>
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
            list: []
        };
    },
    components: {},
    computed: {
        
    },
    mounted() {
        this.init();
    },
    methods: {
        async init(){
            let res = await price.getList();
            res.list.forEach(item=>{
                item.hide = false;
            });
            console.log(res.list);
            this.list = res.list;
            this.visible = true;
            // var list = res.list[0].items.map(item=>{
            //     var div = ['<div class="t-item data">',
            //             '<div class="t-i1 ti">' + item.hostBale + '-' + item.label+ '</div>',
            //             '<div class="t-i2 ti">' + item.price + '</div>',
            //             '<div class="t-i3 ti"></div>',
            //             '<div class="t-i4 ti">' + item.discount + '</div>',
            //             '<div class="t-i5 ti">' + (item.price * item.discount) + '</div>',
            //         '</div>'];
            //     return div.join("");
            // })

            // $("#price").innerHTML = list.join('');

            // $(".t-tip2").innerHTML = res.list[0].acreage + 'm²';
            // $(".t-tip3").innerHTML = '￥' + res.list[0].price;
            // $(".table").setAttribute("class", "table");
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>