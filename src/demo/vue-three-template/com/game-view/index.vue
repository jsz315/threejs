<template>
    <div class="game-view">
        <canvas ref="canvas" class="canvas"></canvas>
        <ControlView />
        <SettingView />
    </div>
</template>

<script>
import ControlView from "../control-view/index.vue"
import SettingView from "../setting-view/index.vue"
import App from '../../core/App'
export default {
    data() {
        return {
            
        };
    },
    components: {ControlView, SettingView},
    computed:{
        
    },
    mounted() {
        this.$nextTick(()=>{
            new App(this.$refs.canvas);
        })
    },
    destroyed(){
        
    },
    methods:{
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import "./index.less";
</style>
