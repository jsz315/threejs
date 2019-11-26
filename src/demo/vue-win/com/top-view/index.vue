<template>
    <div class="top-view">
        <div class="logo"></div>
        <div class="info">
            <div class="hot"></div>人气：{{num}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            num: 0
        };
    },
    components: {},
    computed: {},
    beforeCreate(){
        console.log("1111111 top-view beforeCreate");
    },
    created(){
        console.log("1111111 top-view created");
    },
    async mounted(){
        console.log("1111111 top-view mounted");
        let res = await this.$post("/mapi/index.php?app=count_client&fnn=model_views", {
            model_id: this.$store.state.modelId,
            type_id: this.$store.state.modelType
        });
        
        if(res.data.code == 200){
            this.num = res.data.datas.views;
        }
    },
    methods: {

    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>