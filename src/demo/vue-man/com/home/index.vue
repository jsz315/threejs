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
        <LoadingView class="ui" :style="loading"></LoadingView>
        <!-- <WalkView class="ui" :style="walk"></WalkView> -->
        <div class="menu" @click="showMenu" :style="menu"></div>

        <DesignView></DesignView>
        <EffectView></EffectView>
        <DetailView></DetailView>
        <PriceView></PriceView>
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
import PriceView from '../price-view/index.vue'
import RoleView from '../role-view/index.vue'
import ColorView from '../color-view/index.vue'
import GuiderView from '../guider-view/index.vue'
import LoadingView from '../loading-view/index.vue'
// import WalkView from '../walk-view/index.vue'
import listener from '../../lib/listener'
import Tooler from '../../core/Tooler.ts'

var isWalk;

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
            loading: {
                transform: 'translateY(0)',
                opacity: 1
            },
            menu: {
                transform: 'translateX(20px)',
                opacity: 0
            },
            walk: {
                transform: 'translateY(300px)',
                opacity: 0
            },
            retry: false,
            imgs: []
        };
    },
    components: {BottomView, RightView, TopView, DesignView, EffectView, DetailView, RoleView, ColorView, GuiderView, LoadingView, PriceView},
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
            this.hideMenu(false);
            isWalk = false;
        })

        listener.on("startWalk", () => {
            this.hideMenu(true);
            isWalk = true;
        })

        let id = this.$store.state.modelId;
        this.getImg(id);
    },
    methods: {
        hideMenu(isWalk){
            this.top = {
                transform: 'translateY(-20px)',
                opacity: 0
            };
            this.right = {
                transform: 'translateX(20px)',
                opacity: 0
            };
            this.bottom = {
                transform: 'translateY(120px)',
                opacity: 0
            };
            this.role = {
                transform: 'translateY(20px)',
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
            if(isWalk){
                this.walk = {
                    transform: 'translateY(0)',
                    opacity: 1
                };
            }

        },
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
            };

            if(isWalk){
                this.walk ={
                    transform: 'translateY(300px)',
                    opacity: 0
                };
                listener.emit("stopWalk");
            }
        },
        async getImg(id) {
            let res;
            let link = "";
            if (location.search.indexOf("//3d.") != -1) {
                link = "/mapi/index.php";
                res = await this.$get(link, {
                        id: id,
                        app: "index",
                        fnn: "sysdiss",
                        type_id: this.$store.state.modelType
                    });
            } else {
                link = "/api/index/sysdiss";
                res = await this.$post(link, {id: id});
            }

            if (res.data && res.data.datas) {
                let datas = res.data.datas;
                if (datas["sys_img"] || datas["brand_img"]) {
                    datas["sys_img"] && this.imgs.push(datas["sys_img"]);
                    datas["brand_img"] && this.imgs.push(datas["brand_img"]);

                    this.$store.commit("changeProductImages", [].concat(this.imgs));
                    this.$store.commit("changeLogoImage", datas["vr_img"]);
                } else {
                    if (!this.retry) {
                        this.retry = true;
                        this.getImg(26);
                    }
                }
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
