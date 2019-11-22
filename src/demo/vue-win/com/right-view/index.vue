<template>
    <div class="right-view">

        <div class="ico share"></div>
        <div class="ico effect" @click="openEffect">
            <div class="menu" v-show="effectMenuVisible">
                <div class="tip">效果</div>
                <div class="tip">颜色</div>
            </div>
        </div>
        <div class="ico full" @click="fullSize"></div>
        <div class="ico picture" @click="openPicture"></div>
        <div class="ico camera" @click="openCamera"></div>
        <div class="ico thumb"></div>

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
    mounted(){
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
    },
    methods: {
        openEffect(e){
            console.log(e);
            if(e.target.className == "tip"){
                if(e.target.innerText == "效果"){
                    this.$store.commit("changeEffectVisible", true);
                }
                else{
                    this.$store.commit("changeColorVisible", true);
                }
                this.effectMenuVisible = false;
            }
            else{
                this.effectMenuVisible = !this.effectMenuVisible;
            }
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
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>