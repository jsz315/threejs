<template>
    <div class="home">
        
        <!-- <TopView class="ui" :style="top"></TopView> -->
        <RightView class="ui" :style="right"></RightView>
        <!-- <BottomView class="ui" :style="bottom"></BottomView> -->
     
        <LoadingView class="ui" :style="loading"></LoadingView>
        <!-- <WalkView class="ui" :style="walk"></WalkView> -->
        <div class="menu" @click="showMenu" :style="menu"></div>

        <EffectView></EffectView>
      
        <GuiderView></GuiderView>
    </div>
</template>

<script>
// import BottomView from '../bottom-view/index.vue'
import RightView from '../right-view/index.vue'
// import TopView from '../top-view/index.vue'
import EffectView from '../effect-view/index.vue'
// import ColorView from '../color-view/index.vue'
import GuiderView from '../guider-view/index.vue'
import LoadingView from '../loading-view/index.vue'
// import WalkView from '../walk-view/index.vue'
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'

export default {
    data() {
        return {
            right: {
                transform: 'translateX(0)',
                opacity: 1
            },
            loading: {
                transform: 'translateY(0)',
                opacity: 1
            },
            menu: {
                transform: 'translateX(20px)',
                opacity: 0
            },
            retry: false,
            imgs: []
        };
    },
    components: {RightView, EffectView, GuiderView, LoadingView},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    mounted(){
        listener.on("full", () => {
            this.hideMenu();
        })

        listener.on("loaded", e => {
            this.init();
        });
    },
    methods: {
        init(){
            var params = this.$store.state.params;
            for(var i in params){
                for(var j in params[i]){
                    console.log(i, j, params[i][j]);
                    listener.emit('param', i, j, params[i][j]);
                }
            }
        },
        hideMenu(){
            this.right = {
                transform: 'translateX(20px)',
                opacity: 0
            };
            this.loading = {
                transform: 'translateY(20px)',
                opacity: 0
            };
            this.menu = {
                transform: 'translateX(0)',
                opacity: 1
            };
        },
        showMenu(){
            this.right = {
                transform: 'translateX(0)',
                opacity: 1
            };
            this.menu = {
                transform: 'translateX(20px)',
                opacity: 0
            };
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
