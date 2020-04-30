<template>
    <div class="detail-view" v-if="visible">
        <div class="header">
            <div class="title">产品详情</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="content">
            <DebugView></DebugView>
            <img class="img" v-for="item in imgs" v-bind:Key="item" :src="item">
            <div class="tip" v-if="isTip">-- {{tip}} --</div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import DebugView from '../debug-view/index.vue'
import listener from "../../lib/listener"
import price from "../../lib/price"

export default {
    data() {
        return {
            retry: false,
            isInit: false,
            isTip: true,
            tip: "数据加载中"
        };
    },
    components: {DebugView},
    computed: {
        visible() {
            return this.$store.state.detailVisible;
        },
        imgs(){
            // return this.$store.state.productImages;
            return this.$store.state.productImages.concat(this.$store.state.sellerImages);
        }
    },
    mounted() {
        // console.log("url ==============");
        // let url = Tooler.getQueryString("url");
        // console.log(url);
        // let id = url.split("/").pop().split(".")[0];

        // let id = this.$store.state.modelId;
        // this.getImg(id);
        listener.on("detail", ()=>{
            let id = this.$store.state.modelId;
            this.sellerData(id);
        })
    },
    methods: {
        close() {
            this.$store.commit("changeDetailVisible", false);
        },
        async sellerData(id){
            if(this.isInit){
                return;
            }
            this.isInit = true;

            var u = Tooler.getQueryString("u");
            var type_id = u.split("-")[3];
            var host = price.getHost();
            var link = host + "/mapi/index.php?app=seller_show&fnn=mobile_list";
            var res = await this.$get(link, {
                    yun3d_id: id,
                    sourcetype: type_id
                });
                
            console.log(res, 'seller_show');
            if(res.data && res.data.datas){
                var t = res.data.datas;
                var list = [];
                for(var i in t){
                    if(i != 1){
                        t[i].forEach(item=>{
                            list.push(item['pic_path']);
                        })
                    }
                    
                }
                this.$store.commit("changeSellerImages", list);
                if(list.length == 0){
                    this.tip = "暂无数据";
                }
                else{
                    this.isTip = false; 
                }
            }
            
        },
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>