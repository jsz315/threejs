<template>
    <div class="right-view">

        <div class="ico share" @click="openShare"></div>
        <div class="ico effect" @click="openEffect"></div>
        <div class="ico full" @click="fullSize"></div>
        <div class="ico picture" @click="openPicture" v-if="false"></div>
        <div class="ico camera" @click="openCamera" v-if="false"></div>
        <div class="ico thumb" @click="sendThumb"></div>

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
            this.$store.commit("changeEffectVisible", true);
            // if(e.target.className == "tip"){
            //     if(e.target.innerText == "效果"){
            //         this.$store.commit("changeEffectVisible", true);
            //     }
            //     else{
            //         this.$store.commit("changeColorVisible", true);
            //     }
            //     this.effectMenuVisible = false;
            // }
            // else{
            //     this.effectMenuVisible = !this.effectMenuVisible;
            // }
        },
        openShare(){
            // this.$store.commit("changeGuiderVisible", true);
            this.$store.commit("changeTransformVisible", true);
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
        async sendThumb(){
            let param = {
                model_id: this.$store.state.modelId,
                type_id: this.$store.state.modelType
            };
            let res = await this.$post("/mapi/index.php?app=count_client&fnn=model_like", param);
            if(res.data.code == 200){
                this.$toast("点赞成功");
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>