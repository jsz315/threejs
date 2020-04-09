<template>
    <div class="home">
        <SettingView></SettingView>
        <ControlView></ControlView>
        <ColorView></ColorView>
        <TableView></TableView>
        <DetailView></DetailView>
        <PhoneView></PhoneView>
    </div>
</template>

<script>
import ControlView from '../control-view/index.vue'
import ColorView from '../color-view/index.vue'
import TableView from '../table-view/index.vue'
import DetailView from '../detail-view/index.vue'
import PhoneView from '../phone-view/index.vue'
import SettingView from '../setting-view/index.vue'
import Tooler from "../../core/Tooler.ts"
import listener from "../../lib/listener"
import price from "../../lib/price"
import axios from "axios";

let retry = false;

export default {
    data() {
        return {
            
        };
    },
    components: {ControlView, ColorView, TableView, DetailView, PhoneView, SettingView},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    mounted(){
        let url = Tooler.getQueryString("url");
        let id = url.split("/").pop().split(".")[0];
        this.fetchData(id);

        listener.on("effect", ()=>{
            this.$store.commit("changeEffectVisible", true);
        })
        listener.on("colorMap", (n)=>{
            this.$store.commit("changeIsSingle", n);
        })
    },
    methods: {
        async fetchData(id){
            // id = 16433;
            let res;
            let link = "";
            var u = Tooler.getQueryString("u");
            var type_id = u.split("-")[3];

            var host = price.getHost();
            if(location.search.indexOf("//3d.") != -1){
                link = host + "/mapi/index.php";
                res = await axios.get(link, {
                    params: {
                        id: id,
                        app: "index",
                        fnn: "sysdiss",
                        type_id: type_id,
                        u: u
                    }
                });
            }
            else{
                link = host + "/api/index/sysdiss";
                res = await axios.post(link, {
                    id: id,
                    type_id: type_id,
                    u: u
                });
            }
            if(res.data && res.data.datas){
                let datas = res.data.datas;
                datas["color"] && this.$store.commit("changeColorList", datas["color"]);
                if(datas["sys_img"] || datas["brand_img"]){
                    let list = [];
                    datas["sys_img"] && list.push(datas["sys_img"]);
                    datas["brand_img"] && list.push(datas["brand_img"]);
                    // $(".img-box").innerHTML = list.join("");
                    this.$store.commit("changeProductImages", list);
                }
                else{
                    if(!retry){
                        retry = true;
                        this.fetchData(26);
                    }
                    
                }
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
