<template>
    <div class="guider-view" v-if="visible" @click="hideGuider">
        <div class="img"></div>
        <div class="info">
            <p>好东西要多分享哦~<br>你可以<br>点击【发送给朋友】<br>或【分享到朋友圈】</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    components: {},
    computed: {
        visible(){
            return this.$store.state.guiderVisible;
        }
    },
    methods: {
        hideGuider(){
            this.$store.commit("changeGuiderVisible", false);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>