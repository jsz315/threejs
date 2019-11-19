<template>
    <div class="picker-view" v-if="visible">
        <div class="panel">
            <div class="btns">
                <div class="btn" @click="choose(false)">取消</div>
                <div class="btn" @click="choose(true)">确定</div>
            </div>
            <div class="picker">
                <mt-picker :slots="slots" @change="onValuesChange" ref="picker"></mt-picker>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            slots: [
                {
                    flex: 1,
                    values: [
                        "2015-01",
                        "2015-02",
                        "2015-03",
                        "2015-04",
                        "2015-05",
                        "2015-06"
                    ],
                    className: "slot1",
                    textAlign: "center"
                }
            ]
        };
    },
    components: {},
    computed: {},
    methods: {
        show(n){
            console.log(n);
            this.visible = true;
        },
        choose(){
            this.visible = false;
        },
        onValuesChange(picker, values) {
            console.log(values);
            // if (values[0] > values[1]) {
            //     picker.setSlotValue(1, values[0]);
            // }
        },
        areaChange(){
            console.log(this.$refs.picker.values);
            // this.slots[0].values = ["1", "2", "3"]
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>