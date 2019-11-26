<template>
    <div class="detail-view" v-if="visible">
        <div class="header">
            <div class="title">产品详情</div>
            <div class="close" @click="close"></div>
        </div>
        <div class="content">
            <img class="img" v-for="item in imgs" v-bind:Key="item" :src="item">
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"

export default {
    data() {
        return {
            retry: false,
            imgs: []
        };
    },
    components: {},
    computed: {
        visible() {
            return this.$store.state.detailVisible;
        }
    },
    mounted() {
        // console.log("url ==============");
        // let url = Tooler.getQueryString("url");
        // console.log(url);
        // let id = url.split("/").pop().split(".")[0];

        let id = this.$store.state.modelId;
        this.getImg(id);
    },
    methods: {
        close() {
            this.$store.commit("changeDetailVisible", false);
        },
        async getImg(id) {
            let res;
            let link = "";
            if (location.search.indexOf("//3d.") != -1) {
                link = "/mapi/index.php";
                res = await this.$get(link, {
                        id: id,
                        app: "index",
                        fnn: "sysdiss"
                    });
            } else {
                link = "/api/index/sysdiss";
                res = await this.$post(link, {id: id});
            }

            if (res.data && res.data.datas) {
                let datas = res.data.datas;
                if (datas["sys_img"] || datas["brand_img"]) {
                    datas["sys_img"] && this.imgs.push(datas["sys_img"]);
                    datas["brand_img"] && this.imgs.push(datas["brand_img"]);
                } else {
                    if (!this.retry) {
                        this.retry = true;
                        this.getImg(26);
                    }
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>