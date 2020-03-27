<template>
    <div class="right-view">

        <div class="ico share" @click="openShare"></div>
        <div class="ico effect" @click="openEffect">
            <div class="menu" v-show="effectMenuVisible">
                <div class="tip" data-key="muscle">肌肉</div>
                <div class="tip" data-key="bones">骨骼</div>
                <div class="tip" data-key="eye">眼睛</div>
                <div class="tip" data-key="tooth">牙齿</div>
                <div class="tip" data-key="other">其他</div>
                <div class="tip" data-key="ambient">环境光</div>
                <div class="tip" data-key="directional">平行光</div>
            </div>
        </div>
        <div class="ico full" @click="fullSize"></div>
        <div class="ico picture" @click="openPicture" v-if="false"></div>
        <div class="ico camera" @click="openCamera" v-if="false"></div>
        <div class="ico walk" @click="toggle(1)"></div>
        <div class="ico thumb" @click="toggle(2)"></div>

        <input class="file" type="file" ref="usePhoto">
        <input class="file" type="file" ref="useCamera" accept="image/*" capture="camera">
    </div>
</template>

<script>
import listener from '../../lib/listener'

export default {
    data() {
        return {
            effectMenuVisible: false
        };
    },
    components: {},
    computed: {},
    beforeCreate(){
        
    },
    created(){
        
    },
    async mounted(){
        let info = navigator.userAgent.toLowerCase();
        if(info.match(/iPhone\sOS/i)){
            this.$refs.useCamera.removeAttribute("capture");
        }
        this.$refs.usePhoto.onchange = () => {
            this.previewImage(this.$refs.usePhoto);
        }
        this.$refs.useCamera.onchange = () => {
            this.previewImage(this.$refs.useCamera);
        }
        
        let param = {
            model_id: this.$store.state.modelId,
            type_id: this.$store.state.modelType
        };
        
        let res = await this.$post("/mapi/index.php?app=count_client&fnn=getlikes", param);
        if(res.data.code == 200){
            // console.log("点赞数：" + res.data.datas.like_num);
        }
    },
    methods: {
        openEffect(e){
            if(e.target.className == "tip"){
                // var type = e.target.innerText;
                var type = e.target.dataset.key;
                var panel = this.$store.state.panel;
                panel.type = type;
                panel.visible = true;
                this.$store.commit("changePanel", panel);
                this.effectMenuVisible = false;
            }
            else{
                this.effectMenuVisible = !this.effectMenuVisible;
            }
        },
        openShare(){
            this.$store.commit("changeGuiderVisible", true);
        },
        fullSize(){
            listener.emit("full");
        },
        openPicture(){
            this.$refs.usePhoto.click();
        },
        openCamera(){
            if(!navigator.mediaDevices){
                navigator.mediaDevices = {};
            }
            let getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if(!getUserMedia){
                this.$toast("无法打开摄像头");
                return;
            }
            getUserMedia({
                audio: false,
                video: true
            }).then((stream) => {
                video.srcObject = stream;
                video.play();
            }).catch((error) => {
                console.log(error);
                this.$toast("打开摄像头失败");
            })
        },
        previewImage(dom){
            var file = dom.files[0];
            var fileReader = new FileReader();
            fileReader.onloadend = function(){
                if(fileReader.readyState == fileReader.DONE){
                    listener.emit("background", fileReader.result);
                }
            }
            fileReader.readAsDataURL(file);
        },
        toggle(n){
            listener.emit("toggle", n);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>