<template>
    <div class="order-view" v-if="visible">
        <div class="box">
            <div class="t-title">
                <div class="t-ico"></div>
                <div class="t-tip1">预约设计</div>
                <div class="close" @click="close"></div>
            </div>
            <div class="input-box">
                <input class="text" v-model="name" type="text" placeholder="请输入姓名"/>
            </div>
            <div class="input-box">
                <input class="text" v-model="phone" type="text" placeholder="请输入手机号"/>
            </div>
            <div class="t-title">
                <div class="t-ico"></div>
                <div class="t-tip1">预约记录</div>
            </div>
            <ScrollView :list="list" v-if="list.length"></ScrollView>
            <div class="btn" @click="sure">立即预约</div>
        </div>
        <div class="toast" v-if="success"><div class="ico"></div>预约成功！</div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import ScrollView from '../scroll-view/index.vue'
import listener from '../../lib/listener'

export default {
    data() {
        return {
            name: "",
            phone: "",
            success: false,
            list: [],
            isInit: false
        };
    },
    components: {ScrollView},
    computed: {
        visible() {
            return this.$store.state.orderVisible;
        },
    },
    mounted() {
        listener.on("order", ()=>{
            if(!this.isInit){
                this.isInit = true;
                this.init();
            }
        })
    },
    filters: {
        
    },
    methods: {
        close() {
            this.$store.commit("changeOrderVisible", false);
        },
        async init(){
            var host = Tooler.getHost();
            var url = host + "/mapi/index.php";
            var res = await this.$get(url, {
                file_id: this.$store.state.modelId,
                key: "6211a9dbc6d3b7f80e7e7499b87b7da0",
                mix: "yy",
                app: "count_client",
                fnn: "client_list",
                setapp: "count_client",
                setfnn: "client_list",
                type: this.$store.state.modelType,
            });
            console.log(res, 'res');
            this.list = res.data.datas.list;
            // this.list = [
            //     {
            //         "client_name": "张先生",
            //         "phone": 13566778899,
            //     },
            //     {
            //         "client_name": "倪先生",
            //         "phone": 13566778899,
            //     },
            //     {
            //         "client_name": "王女士",
            //         "phone": 13566778899,
            //     },
            // ];
        },
        async sure(){
            console.log(this.phone, this.name);
            // this.$toast('提交成功');
            if(!(/^1[3456789]\d{9}$/.test(this.phone))){ 
                this.$toast("手机号码有误，请重填");  
                return; 
            }
            if(this.name.replace(/\s/g, "").length == 0){
                this.$toast("请输入姓名");  
                return; 
            }
            
            var u = Tooler.getQueryString("u");
            var temp = u.split('-');
            var userId = temp[2];
            let param = {
                type: this.$store.state.modelType,
                model_id: this.$store.state.modelId,
                client_name: this.name,
                telephone: this.phone,
                user_id: userId
            };
            var host = Tooler.getHost();
            let res = await this.$post(host + "/mapi/index.php?app=count_client&fnn=count_model_save", param);
            if(res.data.code == 200 && res.data.datas){
                // this.$toast('提交成功');
                this.success = true;
                setTimeout(()=>{
                    this.success = false;
                }, 3000);
            }
            
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>