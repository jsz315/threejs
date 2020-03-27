<template>
    <div class="effect-view" v-if="visible">
        <SlotView :title="param.name" @close='close(false)'>
            <div slot="content">
                
                <RangeView v-if="param.roughness>=0" :num="param.roughness" attr="roughness" @change="onChange" class="param" label="粗糙度" :min="0" :max="2"></RangeView>
                <RangeView v-if="param.metalness>=0" :num="param.metalness" attr="metalness" @change="onChange" class="param" label="金属性" :min="0" :max="1"></RangeView>
                <RangeView v-if="param.alpha>=0" :num="param.alpha" attr="alpha" @change="onChange" class="param" label="透明度" :min="0" :max="1"></RangeView>
                <RangeView v-if="param.intensity>=0" :num="param.intensity" attr="intensity" @change="onChange" class="param" label="光强度" :min="0" :max="1"></RangeView>

                <ColorView :num="param.color" attr="color" @change="onChange" class="param" label="颜色值"></ColorView>
                <CheckView :num="param.visible" attr="visible" @change="onChange" class="param" label="显示值"></CheckView>

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
        ...mapState(['panel', 'params']),
        visible(){
            return this.panel.visible;
        },
        param(){
            const obj = this.params[this.panel.type] || {};
            return obj;
        }
    },
    mounted(){
        
    },
    methods: {
        ...mapMutations(['changePanel', 'changeTypeParams']),
        close(n){
            var panel = copy.newData(this.panel);
            panel.visible = false;
            this.changePanel(panel);
        },
        onChange(attr, num){
            // console.log(attr, num);
            let param = copy.newData(this.param);
            param[attr] = num;
            this.changeTypeParams(param);
            listener.emit('param', this.panel.type, attr, num);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>