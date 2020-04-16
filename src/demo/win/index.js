import './index.less'
import App from'./core/App'
import Stats from 'three/examples/jsm/libs/stats.module';
import axios from "axios";
import Tooler from "./core/Tooler.ts"
import price from "./lib/price"
import listener from "./lib/listener"
import Vue from 'vue'
import Home from "./com/home/index.vue"
import store from "./store/index";
import MintUI from 'mint-ui'
import { Toast } from 'mint-ui';
import 'mint-ui/lib/style.css'

let stats;
let app;

Vue.use(MintUI)
Vue.prototype.$toast = (tip) => {
    Toast({
        message: tip,
        position: 'top',
        duration: 2000
    });
}

window.onload = function(){
    console.log(store, 'store');
    let canvas = $("#canvas");
    app = new App(canvas);
    app.setup(store.state.param);
    init();
}

function showDebug(){
    if(location.search.indexOf("debug=1") != -1){
        $(".debug").style.display = "block";
        $(".preview-img").style.display = "none";
        let info = navigator.userAgent.toLowerCase();
        if(info.match(/iPhone\sOS/i)){
            $("#useCamera").removeAttribute("capture");
            $("#useVideo").removeAttribute("capture");
        }

        let video = $("#video");
        $("#openVideo").addEventListener("click", ()=>{
            if(!navigator.mediaDevices){
                navigator.mediaDevices = {};
            }
            let getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if(!getUserMedia){
                alert("无法打开摄像头");
                return;
            }
            getUserMedia({
                audio: false,
                video: true
            }).then((stream) => {
                video.srcObject = stream;
                video.play()
            }).catch((error) => {
                console.log(error);
                alert("打开摄像头失败");
            })
        })

        $("#drawImage").addEventListener("click", ()=>{
            var canvas = $("#preview-canvas");
            var context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        })

        previewImage("usePhoto");
        previewImage("useCamera");
        previewImage("useVideo");
    }
    
}

function previewImage(id){
    var dom = document.getElementById(id);
    dom.onchange = function(){
        var file = dom.files[0];
        var fileReader = new FileReader();
        fileReader.onloadend = function(){
            if(fileReader.readyState == fileReader.DONE){
                $(".preview-img").setAttribute("src", fileReader.result);
                $(".preview-img").style.display = "block";
            }
        }
        fileReader.readAsDataURL(file);
    }
}

function init(){
    stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.domElement.style.display = 'none';
    document.body.appendChild(stats.domElement);
    app.setStats(stats);

    $("#setting").onclick = function(){
        listener.emit("setting");

        // var control = $("#control");
        // if(control.style.display == "none" || control.style.display == ""){
        //     control.style.display = "block";
        //     stats.domElement.style.display = 'block';

        //     ambient.value = app.ambientLightIntensity;
        //     showNum(app.ambientLightIntensity, "ambient_num");

        //     directional.value = app.focusLightIntensity;
        //     showNum(app.focusLightIntensity, "directional_num");

        //     roughness.value = app.roughness;
        //     showNum(app.roughness, "roughness_num");

        //     metalness.value = app.metalness;
        //     showNum(app.metalness, "metalness_num");

        //     // distance.value = app.far;
        //     // showNum(app.far, "distance_num");
        // }
        // else{
        //     control.style.display = "none";
        //     stats.domElement.style.display = 'none';
        // }
    }

    $("#info").onclick = function(){
        let pot = document.documentElement.scrollTop;
        let size = app.getStageSize();
        let tid = setInterval(()=>{
            pot += 10;
            if(pot > size.height){
                clearInterval(tid);
            }
            document.documentElement.scrollTop = pot;
        })
        
    }

}

function $(sel){
    return document.querySelector(sel);
}

new Vue({
    store,
    render: h => h(Home)
}).$mount("#vue");
