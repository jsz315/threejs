<template>
    <div class="price-detail-view" v-if="visible">
        <div class="header">
            <div class="close" @click="close"></div>
            <div class="title">报价明细</div>
        </div>
        <div class="content">
            <TableView></TableView>
        </div>
    </div>
</template>

<script>
import Tooler from "../../core/Tooler.ts"
import price from "../../lib/price"
import TableView from '../table-view/index.vue'

export default {
    data() {
        return {
            
        };
    },
    components: {TableView},
    computed: {
        visible() {
            return this.$store.state.priceDetailVisible;
        },
        
    },
    async mounted() {
        
    },
    methods: {
        close() {
            this.$store.commit("changePriceDetailVisible", false);
        },
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>