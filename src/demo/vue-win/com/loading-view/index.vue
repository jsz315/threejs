<template>
    <div class="loading-view" v-if="visible">
        模型加载中{{this.pots}}
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
            visible: true
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
       
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>