<template>
    <div class="game-view">
        <canvas ref="canvas" class="canvas"></canvas>
    </div>
</template>

<script>
import App from '../../core/App'
export default {
    data() {
        return {
            
        };
    },
    components: {},
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
