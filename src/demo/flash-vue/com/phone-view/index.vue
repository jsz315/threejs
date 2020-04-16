<template>
    <div class="phone-view" v-if="visible">
        <div class="box">
            <div class="tip">手机号</div>
            <input type="text" class="text" v-model="phone" placeholder="请输入顾客手机号">
            <div class="tip">留言</div>
            <input type="text" class="text" v-model="word" placeholder="请输入留言内容">
            <div class="btn" @click="send">确定</div>
            <div class="close" @click="hide"></div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import listener from "../../lib/listener"
import axios from "axios";

export default {
    data() {
        return {
            phone: "",
            word: ""
        };
    },
    components: {},
    computed: {
        visible(){
            return this.$store.state.phoneVisible;
        }
    },
    mounted() {
        // this.init();
    },
    filters: {
        
    },
    methods: {
        hide(){
            console.log("hide");
            this.$store.commit('changePhoneVisible', false);
        },
        async send(){
            console.log(this.phone, this.word);
            if(!(/^1[3456789]\d{9}$/.test(this.phone))){
                this.$toast("手机号码有误，请重填");  
                return false; 
            }
            var u = Tooler.getQueryString("u");
            var type_id = u.split("-")[3];
            var id = u.split("-")[4];
            var host = price.getHost();

            var res = await axios.post(host + `/mapi/index.php?app=modelshow&fnn=modelNoteUpdate`, {
                sourcetype: type_id,
                yun3d_id: id,
                phone: this.phone,
                note: this.word,
            });
            if(res.data.code == 200){
                this.$toast("提交成功"); 
                this.hide();
            }
            else{
                this.$toast("提交失败"); 
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>