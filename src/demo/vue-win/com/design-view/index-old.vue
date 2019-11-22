<template>
    <div class="design-view" v-if="visible">
        <SlotView title="免费设计">
            <div slot="content">
                <input class="txt" type="text" placeholder="请输入姓名" v-model="name">
                <input class="txt" type="text" placeholder="请输入手机号" v-model="phone" @change="onPhone">
                <div class="area">
                    <input class="txt" type="text" :value="area0.text" placeholder="省/市" @click="picker(0)">
                    <input class="txt" type="text" :value="area1.text" placeholder="区" @click="picker(1)">
                    <input class="txt" type="text" :value="area2.text" placeholder="县" @click="picker(2)">
                </div>
                <div class="info">
                    <div class="label">当前门店：门道云深圳店</div>
                    <div class="label">联系电话：13588774569</div>
                    <div class="label">地址：广东省深圳市南山区中山园1路君翔达大厦</div>
                </div>
                <div class="btn" @click="onPost">立即申请</div>
            </div>
        </SlotView>

        <PickerView ref="picker" @select="onSelect"></PickerView>
    </div>
</template>

<script>
import SlotView from '../slot-view/index.vue'
import PickerView from '../picker-view/index.vue'
import provcityarea from '../../lib/area'

export default {
    data() {
        return {
            name: "",
            phone: "",
            area0: {text: ""},
            area1: {text: ""},
            area2: {text: ""}
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
        onPhone(){
            console.log("phone: " + this.phone);
        },
        onPost(){
            if(/^\s*$/.test(this.name)){
                this.$toast("名字不能为空");
                return;
            }
            if(!/^1(3|4|5|7|8)\d{9}$/.test(this.phone)){
                this.$toast("手机号不正确");
                return;
            }
            if(/^\s*$/.test(this.area0.text)){
                this.$toast("请选择地区");
                return;
            }
            console.log(this.name, this.phone);
        },
        picker(n){
            let list;
            if(n == 0){
                list = this.getPickerList(provcityarea.getProvs());
            }
            else if(n == 1){
                if(!this.area0.id){
                    this.$toast('请先选择前面市区');
                    return;
                }
                list = this.getPickerList(provcityarea.getCitysByProvId(this.area0.id));
            }
            else if(n == 2){
                if(!this.area0.id || !this.area1.id){
                    this.$toast('请先选择前面市区');
                    return;
                }
                list = this.getPickerList(provcityarea.getAreasByCityId(this.area1.id));
            }
            this.$refs.picker.show(n, list);
        },
        onSelect(obj){
            this["area" + obj.type] = obj.select;
            if(obj.type < 1){
                this.area1 = this.getPickerList(provcityarea.getCitysByProvId(this.area0.id))[0];
            }
            if(obj.type < 2){
                this.area2 = this.getPickerList(provcityarea.getAreasByCityId(this.area1.id))[0];
            }
        },
        getPickerList(obj){
            let list = [];
            for(var i in obj){
                list.push({
                    text: obj[i],
                    id: i
                })
            }
            return list;
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>