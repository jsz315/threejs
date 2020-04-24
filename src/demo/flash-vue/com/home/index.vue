<template>
    <div class="home" v-if="visible">
        <div class="view">
            <SwiperView :pics="pics" @change="onChange"></SwiperView>
            <ProgressView :tips="tips" ref="progress" @end="onEnd"></ProgressView>
        </div>
    </div>
</template>

<script>
import SwiperView from '../swiper-view/index.vue'
import ProgressView from '../progress-view/index.vue'
import listener from "../../lib/listener"
import axios from "axios";

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return r[2];
    return '';
}

let pics = [
    'http://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/42a98226cffc1e177a2eb0404290f603738de92a.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586502962707&di=ee98af61cb765ad0afa14e1f66e02629&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201505%2F13%2F20150513144838_UkA58.thumb.700_0.jpeg',
    'http://pic2.52pk.com/files/130426/1283568_114807_4882.jpg',
    'http://www.1lifan.com/uploads/allimg/180731/230ILS6-5.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586510568232&di=ff9c981c6849e5abc8fcd4dec7590851&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Ff11f3a292df5e0fe285a6174566034a85edf7201.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2207089593,3263649201&fm=15&gp=0.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586502962693&di=83606ae7627dee2503a9a1e6ed163941&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fb90e7bec54e736d1e3eb0c7b9b504fc2d46269cd.jpg'
];

export default {
    data() {
        return {
            isDebug: getQueryString('debug') == 1,
            pics: [],
            tips: [],
            visible: false
        };
    },
    components: {SwiperView, ProgressView},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    async mounted(){
        await this.loadImages();
        await this.loadTips();
    },
    methods: {
        async loadTips(){
            console.log(this.isDebug, getQueryString('debug'));
            var host = this.isDebug ? 'http://3d.mendaow.com' : location.origin;
            var res = await axios.get(host + `/mapi/index.php?app=tips&fnn=showtips`);
            console.log(res);
            if(res.data && res.data.datas){
                this.tips = res.data.datas.map(item=>item['tips_value']);
                console.log(this.tips, 'this.tips');
                setTimeout(() => {
                    this.onChange();
                }, 30);
            }
        },
        async loadImages(){
            console.log(this.isDebug, getQueryString('debug'));
            var host = this.isDebug ? 'http://3d.mendaow.com' : location.origin;
            var key = getQueryString('key');
            var res = await axios.post(host + `/mapi/index.php?app=getapi&fnn=setting_imglist`, {
                key: key
            });
            console.log(res.data, 'res');
            if(res.data.datas && res.data.datas.list){
                res.data.datas.list.forEach(item => {
                    if(item['is_use'] == 2){
                        this.pics.push(item['img_name']);
                    }
                });
            }
            // this.pics = pics;//测试数据===================================================================

            console.log(this.pics, 'this.pics');
            if(this.pics.length > 0){
                this.visible = true;
            }

            listener.on('loaded', ()=>{
                this.$refs.progress.end();
            })
        },
        onEnd(){
            this.visible = false;
        },
        onChange(){
            if(this.visible){
                this.$refs.progress.changeTip();
            }
        }
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
