<template>
    <div class="home">
        <FileView/>
        <TransformView/>
        <RightView/>
    </div>
</template>

<script>
import Vue from "vue";
// import { Range } from 'mint-ui';
// import { Button } from 'mint-ui';

// Vue.component(Button.name, Button);
// Vue.component(Range.name, Range);

import FileView from '../file-view/index.vue'
import TransformView from '../transform-view/index.vue'
import RightView from '../right-view/index.vue'
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'

export default {
    data() {
        return {
            
        };
    },
    components: {FileView, TransformView, RightView},
    computed: {},
    beforeCreate(){
    //     this.$store.commit("changeModelId", modelId);
    //     this.$store.commit("changeModelType", modelType);
    },
    created(){
        
    },
    mounted(){
        listener.on("full", () => {
            
        })
    },
    methods: {
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
