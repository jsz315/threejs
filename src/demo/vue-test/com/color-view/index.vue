<template>
    <div class="color-view" v-if="visible" @click="click">
        <div class="panel">
            <div class="header">
                <div class="title">颜色</div>
            </div>
            <div class="content">
                <div v-for="item in list" v-bind:key="item" @click="changeMap(item)" class="img" :style="{backgroundImage: 'url(' + item + ')'}"></div>
            </div>
        </div>
    </div>
</template>

<script>
import listener from '../../lib/listener'
export default {
    data() {
        return {
            list: []
        };
    },
    components: {},
    computed: {
        visible(){
            return this.$store.state.colorVisible;
        },
    },
    mounted(){
        for(var i = 0; i < 12; i++){
            this.list.push(`./asset/map/p${i + 1}.jpg`);
        }
    },
    methods: {
        changeMap(url){
            listener.emit("map", url);
        },
        click(e){
            if(e.target.className == "color-view"){
                this.$store.commit("changeColorVisible", false);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>