<template>
    <div class="loading-view" v-if="visible">
        <div class="gif"></div>
    </div>
    
</template>

<script>
import listener from '../../lib/listener'

export default {
    data() {
        return {
            visible: true
        };
    },
    components: {},
    computed: {},
    mounted(){
        listener.on("loaded", e => {
            console.log("ok");
            this.visible = false;
        });
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>