<template>
    <div class="control-view">
        <div class="btn" :class="{'disable': !anim}" @click="play">
            开关动效
            <div class="lang-tip">Action</div>
        </div>
        <div class="btn" @click="showPhone">
            确认审核
            <div class="lang-tip">Confirm audit</div>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import listener from "../../lib/listener"

export default {
    data() {
        return {
            
        };
    },
    components: {},
    computed: {
        anim(){
            return this.$store.state.effectVisible;
        }
    },
    mounted() {
        // this.init();
    },
    filters: {
        formatNum: function (value) {
            if (!value) return '-';
            return Number(value).toFixed(2);
        }
    },
    methods: {
        play(){
            listener.emit('play');
        },
        showPhone(){
            this.$store.commit('changePhoneVisible', true);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>