<template>
    <div class="role-view">
        <div class="header" :style="{'background-image': 'url(' + header + ')'}"></div>
        <div class="info">
            <div class="name">{{name}}</div>
            <div class="phone">{{phone}}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "名字",
            phone: "15688996633",
            header: "./asset/img/logo.png"
        };
    },
    components: {},
    computed: {},
    async mounted(){
        let res = await this.$post("/mapi/index.php?app=count_client&fnn=model_user", {
            model_id: this.$store.state.modelId,
            type_id: this.$store.state.modelType
        });
        let datas = res.data.datas;
        this.name = datas.member_name;
        this.phone = datas.member_mobile;
        this.header = datas.member_avatar;
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>