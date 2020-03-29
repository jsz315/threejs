<template>
    <div class="right-view">

        <div class="ico share" @click="openShare"></div>
        <div class="ico effect" @click="openEffect">
            <div class="menu" v-show="effectMenuVisible">
                <div class="tip" data-key="muscle">肌肉</div>
                <div class="tip" data-key="bones">骨骼</div>
                <div class="tip" data-key="eye">眼睛</div>
                <div class="tip" data-key="ambient">环境光</div>
                <div class="tip" data-key="directional">平行光</div>
                <div class="tip" data-key="system">系统</div>
            </div>
        </div>
        <div class="ico full" @click="fullSize"></div>
        <div class="ico thumb" @click="exportModel"></div>
    </div>
</template>

<script>
import listener from '../../lib/listener'

export default {
    data() {
        return {
            effectMenuVisible: false
        };
    },
    components: {},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    async mounted(){
        
    },
    methods: {
        openEffect(e){
            if(e.target.className == "tip"){
                // var type = e.target.innerText;
                var type = e.target.dataset.key;
                var panel = this.$store.state.panel;
                panel.type = type;
                panel.visible = true;
                this.$store.commit("changePanel", panel);
                this.effectMenuVisible = false;
            }
            else{
                this.effectMenuVisible = !this.effectMenuVisible;
            }
        },
        openShare(){
            this.$store.commit("changeGuiderVisible", true);
        },
        fullSize(){
            listener.emit("full");
        },
        exportModel(){
            listener.emit("export");
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>