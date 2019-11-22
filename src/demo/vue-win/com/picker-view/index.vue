<template>
    <div class="picker-view" v-if="visible">
        <div class="panel">
            <div class="btns">
                <div class="btn" @click="choose(false)">取消</div>
                <div class="btn" @click="choose(true)">确定</div>
            </div>
            <div class="list">
                <mt-picker :slots="slots" @change="onValuesChange" value-key="label" ref="picker" :visible-item-count="7"></mt-picker>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            select: null,
            type: null,
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: "slot1",
                    textAlign: "center"
                }
            ]
        };
    },
    components: {},
    computed: {},
    methods: {
        show(n, list){
            this.type = n;

            this.visible = true;
            this.slots[0].values = list;
            this.select = list[0];
        },
        choose(n){
            this.visible = false;
            if(n){
                this.$emit("select", {select: this.select, type: this.type});
            }
        },
        onValuesChange(picker, values) {
            this.select = values[0];
            // console.log(values);
            // if (values[0] > values[1]) {
            //     picker.setSlotValue(1, values[0]);
            // }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>