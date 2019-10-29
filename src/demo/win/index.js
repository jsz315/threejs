import './index.less'
import App from'./core/App'
import Stats from 'three/examples/jsm/libs/stats.module';
import axios from "axios";
import Tooler from "./core/Tooler.ts"

let stats;
let app;
let retry = false;

window.onload = function(){
    let canvas = $("#canvas");
    app = new App(canvas);
    app.setup();
    init();
    addMap();

    let url = Tooler.getQueryString("url");
    let id = url.split("/").pop().split(".")[0];
    getImg(id);

    showDebug();
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

async function getImg(id){
    // id = 16433;
    let res;
    let link = "";
    if(location.search.indexOf("//3d.") != -1){
        link = "/mapi/index.php";
        res = await axios.get(link, {
            params: {
                id: id,
                app: "index",
                fnn: "sysdiss"
            }
        });
    }
    else{
        link = "/api/index/sysdiss";
        res = await axios.post(link, {
            id: id
        });
    }
    
    if(res.data && res.data.datas){
        let datas = res.data.datas;
        if(datas["sys_img"] || datas["brand_img"]){
            let list = [];
            datas["sys_img"] && list.push(`<img class="img" src="${datas["sys_img"]}">`);
            datas["brand_img"] && list.push(`<img class="img" src="${datas["brand_img"]}">`);
            $(".img-box").innerHTML = list.join("");
        }
        else{
            if(!retry){
                retry = true;
                getImg(26);
            }
            
        }
    }
}

function addMap(){
    var list = [];
    for(let i = 0; i < 12; i++){
        let src = `./asset/map/p${i + 1}.jpg`;
        let div = `<div class="color" style="background-image: url(${src})"></div>`;
        list.push(div);
    }
    $("#colors").innerHTML = list.join("");
    $("#colors").addEventListener("click", (e)=>{
        console.log(e.target);
        if(e.target.className == "color"){
            console.log(e.target.className);
            console.log(e.target.style.backgroundImage);
            let url = e.target.style.backgroundImage.replace(/(url\()|\)|"/g, "");
            app.changeMap(url);
        }
    })

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
    
    var ambient = $("#ambient");
    ambient.oninput = function(e){
        app.setAmbient(e.target.value);
        showNum(e.target.value, "ambient_num");
    }
    var directional = $("#directional");
    directional.oninput = function(e){
        app.setDirectional(e.target.value);
        showNum(e.target.value, "directional_num");
    }
    var roughness = $("#roughness");
    roughness.oninput = function(e){
        app.setRoughness(e.target.value);
        showNum(e.target.value, "roughness_num");
    }
    var metalness = $("#metalness");
    metalness.oninput = function(e){
        app.setMetalness(e.target.value);
        showNum(e.target.value, "metalness_num");
    }
    var distance = $("#distance");
    distance.oninput = function(e){
        app.setDistance(e.target.value);
        showNum(e.target.value, "distance_num");
    }

    $("#btn").onclick = function(){
        var control = $("#control");
        if(control.style.display == "none" || control.style.display == ""){
            control.style.display = "block";
            stats.domElement.style.display = 'block';

            ambient.value = app.ambientLightIntensity;
            showNum(app.ambientLightIntensity, "ambient_num");

            directional.value = app.focusLightIntensity;
            showNum(app.focusLightIntensity, "directional_num");

            roughness.value = app.roughness;
            showNum(app.roughness, "roughness_num");

            metalness.value = app.metalness;
            showNum(app.metalness, "metalness_num");

            distance.value = app.far;
            showNum(app.far, "distance_num");
        }
        else{
            control.style.display = "none";
            stats.domElement.style.display = 'none';
        }
    }

    $(".animate").onclick = function(){
        app.playAnimate();
        this.className = "animate disable";
    }

    $("#info").onclick = function(){
        console.log("info");
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

    window.addEventListener("animate", (e) => {
        $(".animate").className = "animate";
    });
}


function showNum(n, tip){
    var n = Number(n);
    $("#" + tip).innerHTML = n.toFixed(3);
}

function $(sel){
    return document.querySelector(sel);
}