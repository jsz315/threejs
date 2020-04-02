<template>
    <div class="home">
        <PriceView></PriceView>
    </div>
</template>

<script>
import Vue from "vue";
// import { Range } from 'mint-ui';
// import { Button } from 'mint-ui';

// Vue.component(Button.name, Button);
// Vue.component(Range.name, Range);


import PriceView from '../price-view/index.vue'

import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'

var isWalk;

export default {
    data() {
        return {
            
        };
    },
    components: {PriceView},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    mounted(){
        
    },
    methods: {
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
