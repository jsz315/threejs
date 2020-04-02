<template>
    <div class="effect-view" v-if="visible">
        <SlotView :title="param.name" @close='close(true)'>
            <div slot="content">
                
                <RangeView v-if="isShow('roughness')" :num="param.roughness" attr="roughness" @change="onChange" class="param" label="粗糙度" :min="0" :max="max"></RangeView>
                <RangeView v-if="isShow('metalness')" :num="param.metalness" attr="metalness" @change="onChange" class="param" label="金属性" :min="0" :max="max"></RangeView>
                <RangeView v-if="isShow('alpha')" :num="param.alpha" attr="alpha" @change="onChange" class="param" label="透明度" :min="0" :max="1"></RangeView>
                <RangeView v-if="isShow('intensity')" :num="param.intensity" attr="intensity" @change="onChange" class="param" label="光强度" :min="0" :max="max"></RangeView>

                <ColorView v-if="isShow('color')" :num="param.color" attr="color" @change="onChange" class="param" label="颜色值"></ColorView>
                <CheckView v-if="isShow('visible')" :num="param.visible" attr="visible" @change="onChange" class="param" label="显示值" tip="控制是否显示"></CheckView>

                <ColorView v-if="isShow('background')" :num="param.background" attr="background" @change="onChange" class="param" label="背景色"></ColorView>
                <CheckView v-if="isShow('exposure')" :num="param.exposure" attr="exposure" @change="onChange" class="param" label="曝光度" tip="控制滑块最大值"></CheckView>

                <div class="btns">
                    <div class="btn" @click="close(false)">取消</div>
                    <div class="btn" @click="close(true)">确定</div>
                </div>
            </div>
        </SlotView>
    </div>
</template>

<script>
import SlotView from '../slot-view/index.vue'
import RangeView from '../range-view/index.vue'
import ColorView from '../color-view/index.vue'
import CheckView from '../check-view/index.vue'
import listener from '../../lib/listener'
import copy from '../../lib/copy'

import {mapState, mapMutations} from 'vuex'

export default {
    data() {
        return {
            cur: 0
        };
    },
    components: {SlotView, RangeView, ColorView, CheckView},
    computed: {
        ...mapState(['panel', 'params', 'tempParam']),
        visible(){
            return this.panel.visible;
        },
        param(){
            const obj = this.params[this.panel.type] || {};
            return obj;
        },
        max(){
            if(this.params.system.exposure){
                return 10;
            }
            return 1;
        }
    },
    mounted(){
        console.log("创建面板");
    },
    methods: {
        ...mapMutations(['changePanel', 'changeTypeParams', 'limitMax']),
        isShow(key){
            return this.param.hasOwnProperty(key);
        },
        close(n){
            var panel = copy.newData(this.panel);
            panel.visible = false;
            let param = copy.newData(this.tempParam);
            if(n == false){
                this.changeTypeParams(param);
                for(var i in param){
                    listener.emit('param', this.panel.type, i, param[i]);
                }
            }
            this.changePanel(panel);
        },
        onChange(attr, num){
            let param = copy.newData(this.param);
            param[attr] = num;
            this.changeTypeParams(param);
            listener.emit('param', this.panel.type, attr, num);
            if(attr == 'exposure'){
                if(num == false){
                    this.limitMax();
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>