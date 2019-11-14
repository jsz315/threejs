<template>
    <div class="com">
        <mt-range v-model="rangeValue" :min="0" :max="100" :step="1" :bar-height="1">
            <div slot="start" class="start p-num">0</div>
            <div slot="end" class="end p-num">100</div>
        </mt-range>
        <mt-picker :slots="slots" @change="onValuesChange" ref="picker"></mt-picker>
        <mt-button type="primary" @click="areaChange">primary</mt-button>
    </div>
</template>

<script>
import Vue from "vue";
// import { Range } from 'mint-ui';
// import { Button } from 'mint-ui';

// Vue.component(Button.name, Button);
// Vue.component(Range.name, Range);

export default {
    data() {
        return {
            rangeValue: 10,
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
                    textAlign: "right"
                },
                {
                    divider: true,
                    content: "-",
                    className: "slot2"
                },
                {
                    flex: 1,
                    values: [
                        "2015年01",
                        "2015年02",
                        "2015年03",
                        "2015年04",
                        "2015年05",
                        "2015年062015年062015年062015年062015年06"
                    ],
                    className: "slot3",
                    textAlign: "left"
                },
                {
                    flex: 1,
                    values: [
                        "西湖区",
                        "主城区",
                        "上城区",
                        "滨江区",
                        "萧山区",
                    ],
                    className: "slot4",
                    textAlign: "left"
                }
            ]
        };
    },
    components: {},
    computed: {},
    methods: {
        onValuesChange(picker, values) {
            console.log(values);
            if (values[0] > values[1]) {
                picker.setSlotValue(1, values[0]);
            }
        },
        areaChange(){
            console.log(this.$refs.picker.values);
            this.slots[0].values = ["1", "2", "3"]
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
