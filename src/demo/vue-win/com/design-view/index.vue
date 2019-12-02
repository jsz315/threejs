<template>
    <div class="design-view" v-if="visible">
        <SlotView title="免费设计">
            <div slot="content">
                <input class="txt" type="text" placeholder="请输入姓名" v-model="name">
                <input class="txt" type="text" placeholder="请输入手机号" v-model="phone" @change="onPhone">
                <div class="area">
                    <input class="txt" type="text" :value="area0.label" placeholder="省/市" @click="picker(0)">
                    <input class="txt" type="text" :value="area1.label" placeholder="区" @click="picker(1)">
                    <input class="txt" type="text" :value="area2.label" placeholder="县" @click="picker(2)">
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
// import provcityarea from '../../lib/area'

var Provcityarea = function(list){
    var obj = {};
    obj.getProvs = function(){
        return list.map((item, index)=>{
            return {
                label: item.label,
                value: item.value,
                id: index
            }
        });
    }
    obj.getCitysByProvId = function(id){
        return list[id].children.map((item, index)=>{
            return {
                label: item.label,
                value: item.value,
                id: index
            }
        });
    }
    obj.getAreasByCityId = function(mid, sid){
        return list[mid].children[sid].children.map((item, index)=>{
            return {
                label: item.label,
                value: item.value,
                id: index
            }
        });
    }
    return obj;
}

var provcityarea;

export default {
    data() {
        return {
            name: "",
            phone: "",
            area0: {label: ""},
            area1: {label: ""},
            area2: {label: ""}
        };
    },
    components: {SlotView, PickerView},
    computed: {
        visible(){
            return this.$store.state.designVisible;
        }
    },
    async mounted(){
        this.$on("close", ()=>{
            this.$store.commit("changeDesignVisible", false);
        });

        // let res = await this.$get("/asset/area-serve.json");
        let data = new FormData();
        data.append('deep', '3');
        let res = await this.$post("/mapi/index.php?app=count_client&fnn=get_allarea", {deep: 3});
        if(res && res.data){
            provcityarea = new Provcityarea(res.data.datas);
        }
    },
    methods: {
        onPhone(){
            console.log("phone: " + this.phone);
        },
        async onPost(){
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
            let param = {
                type: this.$store.state.modelType,
                client_name: this.name,
                model_id: this.$store.state.modelId,
                city: [this.area0.label, this.area1.label, this.area2.label].join(""),
                telephone: this.phone,
                prodvince_id: this.area0.id,
                city_id: this.area1.id,
                area_id: this.area2.id
            };
            let res = await this.$post("/mapi/index.php?app=count_client&fnn=count_model_save", param);
            if(res.data.code == 200 && res.data.datas){
                this.$toast('提交成功');
            }
        },
        picker(n){
            let list;
            if(n == 0){
                list = provcityarea.getProvs();
            }
            else if(n == 1){
                if(!this.area0.id){
                    this.$toast('请先选择前面市区');
                    return;
                }
                list = provcityarea.getCitysByProvId(this.area0.id);
            }
            else if(n == 2){
                if(!this.area0.id || !this.area1.id){
                    this.$toast('请先选择前面市区');
                    return;
                }
                list = provcityarea.getAreasByCityId(this.area0.id, this.area1.id);
            }
            this.$refs.picker.show(n, list);
        },
        onSelect(obj){
            this["area" + obj.type] = obj.select;
            if(obj.type < 1){
                this.area1 = provcityarea.getCitysByProvId(this.area0.id)[0];
            }
            if(obj.type < 2){
                this.area2 = provcityarea.getAreasByCityId(this.area0.id, this.area1.id)[0];
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>