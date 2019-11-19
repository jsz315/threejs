<template>
    <div class="design-view" v-if="visible">
        <SlotView title="免费设计">
            <div slot="content">
                <input class="txt" type="text" placeholder="请输入姓名">
                <input class="txt" type="text" placeholder="请输入手机号">
                <div class="area">
                    <input class="txt" type="text" placeholder="省/市" @click="picker(0)">
                    <input class="txt" type="text" placeholder="区" @click="picker(1)">
                    <input class="txt" type="text" placeholder="县" @click="picker(2)">
                </div>
                <div class="info">
                    <div class="label">当前门店：门道云深圳店</div>
                    <div class="label">联系电话：13588774569</div>
                    <div class="label">地址：广东省深圳市南山区中山园1路君翔达大厦</div>
                </div>
                <div class="btn">立即申请</div>
            </div>
        </SlotView>

        <PickerView ref="picker"></PickerView>
    </div>
</template>

<script>
import SlotView from '../slot-view/index.vue'
import PickerView from '../picker-view/index.vue'
export default {
    data() {
        return {
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
    components: {SlotView, PickerView},
    computed: {
        visible(){
            return this.$store.state.designVisible;
        }
    },
    mounted(){
        this.$on("close", ()=>{
            this.$store.commit("changeDesignVisible", false);
        });
    },
    methods: {
        picker(n){
            this.$refs.picker.show(n);
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