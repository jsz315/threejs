<template>
    <div class="home">
        <!-- <mt-range v-model="rangeValue" :min="0" :max="100" :step="1" :bar-height="1">
            <div slot="start" class="start p-num">0</div>
            <div slot="end" class="end p-num">100</div>
        </mt-range>
        <mt-picker :slots="slots" @change="onValuesChange" ref="picker"></mt-picker> -->

        <TopView class="ui" :style="top"></TopView>
        <RightView class="ui" :style="right"></RightView>
        <BottomView class="ui" :style="bottom"></BottomView>
        <RoleView class="ui" :style="role"></RoleView>

        <div class="menu" @click="showMenu" :style="menu"></div>

        <DesignView></DesignView>
        <EffectView></EffectView>
        <DetailView></DetailView>
        <ColorView></ColorView>
        <GuiderView></GuiderView>
    </div>
</template>

<script>
import Vue from "vue";
// import { Range } from 'mint-ui';
// import { Button } from 'mint-ui';

// Vue.component(Button.name, Button);
// Vue.component(Range.name, Range);

import BottomView from '../bottom-view/index.vue'
import RightView from '../right-view/index.vue'
import TopView from '../top-view/index.vue'
import DesignView from '../design-view/index.vue'
import EffectView from '../effect-view/index.vue'
import DetailView from '../detail-view/index.vue'
import RoleView from '../role-view/index.vue'
import ColorView from '../color-view/index.vue'
import GuiderView from '../guider-view/index.vue'
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'

export default {
    data() {
        return {
            top: {
                transform: 'translateY(0)',
                opacity: 1
            },
            right: {
                transform: 'translateX(0)',
                opacity: 1
            },
            bottom: {
                transform: 'translateY(0)',
                opacity: 1
            },
            role: {
                transform: 'translateY(0)',
                opacity: 1
            },
            menu: {
                transform: 'translateX(20px)',
                opacity: 0
            }
        };
    },
    components: {BottomView, RightView, TopView, DesignView, EffectView, DetailView, RoleView, ColorView, GuiderView},
    computed: {},
    beforeCreate(){
        var url = Tooler.getQueryString("u")||"";
        var list = url.split("-");
        var modelId = list[4];
        var modelType =list[3];
        this.$store.commit("changeModelId", modelId);
        this.$store.commit("changeModelType", modelType);
    },
    created(){
        
    },
    mounted(){
        listener.on("full", () => {
            this.top = {
                transform: 'translateY(-20px)',
                opacity: 0
            };
            this.right = {
                transform: 'translateX(20px)',
                opacity: 0
            };
            this.bottom = {
                transform: 'translateY(20px)',
                opacity: 0
            };
            this.role = {
                transform: 'translateY(20px)',
                opacity: 0
            };

            this.menu = {
                transform: 'translateX(0)',
                opacity: 1
            }
        })
    },
    methods: {
        showMenu(){
            this.top = {
                transform: 'translateY(0)',
                opacity: 1
            };
            this.right = {
                transform: 'translateX(0)',
                opacity: 1
            };
            this.bottom = {
                transform: 'translateY(0)',
                opacity: 1
            };
            this.role = {
                transform: 'translateY(0)',
                opacity: 1
            };

            this.menu = {
                transform: 'translateX(20px)',
                opacity: 0
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
