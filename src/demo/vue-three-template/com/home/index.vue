<template>
    <div class="home">
        <GameView/>
    </div>
</template>

<script>
import listener from "../../lib/listener"

import GameView from "../game-view/index.vue"
import axios from "axios";

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return r[2];
    return '';
}

export default {
    data() {
        return {
            
        };
    },
    components: {GameView},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    async mounted(){
        
    },
    methods: {
        
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
