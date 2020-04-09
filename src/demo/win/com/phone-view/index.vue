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
                alert("手机号码有误，请重填");  
                return false; 
            }
            // await axios.post(link, {
            //     id: id,
            //     type_id: type_id,
            //     u: u
            // });
            this.hide();
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>