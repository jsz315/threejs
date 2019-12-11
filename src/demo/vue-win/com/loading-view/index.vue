<template>
    <div class="loading-view" v-if="visible">
        <div class="tip" v-if="isInit">
            请不要关闭窗口
            <br/>
            <br/>
            模型加载中{{this.pots}}
        </div>
        <div class="gif" v-if="!isInit"></div>
    </div>
    
</template>

<script>
import listener from '../../lib/listener'
let tid = 0;
let total = 0;
export default {
    data() {
        return {
            pots: "",
            visible: true,
            isInit: false
        };
    },
    components: {},
    computed: {},
    mounted(){
        tid = setInterval(()=>{
            this.pots = "....".substring(0, ++total % 5);
        }, 200);

        window.addEventListener("all loaded", e => {
            this.visible = false;
            clearInterval(tid);
        })

        listener.on("init", ()=>{
            this.isInit = true;
        })
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>