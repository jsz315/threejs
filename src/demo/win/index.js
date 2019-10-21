import './index.less'
import App from'./App'
import Stats from 'three/examples/jsm/libs/stats.module';
import axios from "axios";
import Tooler from "./Tooler.ts"

let stats;
let app;

window.onload = function(){
    let canvas = document.getElementById("canvas");
    app = new App(canvas);
    app.setup();
    init();
    addMap();
    getImg();
}

function getImg(){
    let url = Tooler.getQueryString("url");
    let id = url.split("/").pop().split(".")[0];
    axios.post("/api/window_library/sysdiss", {
        id: id
    }).then(res=>{
        console.log(res.data);
        let list = [];
        list[0] = `<img class="img" src="${res.data.datas["sys_img"]}">`;
        list[1] = `<img class="img" src="${res.data.datas["brand_img"]}">`;
        document.querySelector(".img-box").innerHTML = list.join("");
    })
}

function addMap(){
    var list = [];
    for(let i = 0; i < 12; i++){
        let src = `./asset/map/p${i + 1}.jpg`;
        let div = `<div class="color" style="background-image: url(${src})"></div>`;
        list.push(div);
    }
    document.getElementById("colors").innerHTML = list.join("");
    document.getElementById("colors").addEventListener("click", (e)=>{
        console.log(e.target);
        if(e.target.className){
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
    
    var ambient = document.getElementById("ambient");
    ambient.oninput = function(e){
        console.log(e.target.value);
        app.setAmbient(e.target.value);
        showNum(e.target.value, "ambient_num");
    }
    var directional = document.getElementById("directional");
    directional.oninput = function(e){
        console.log(e.target.value);
        app.setDirectional(e.target.value);
        showNum(e.target.value, "directional_num");
    }
    var roughness = document.getElementById("roughness");
    roughness.oninput = function(e){
        console.log(e.target.value);
        app.setRoughness(e.target.value);
        showNum(e.target.value, "roughness_num");
    }
    var metalness = document.getElementById("metalness");
    metalness.oninput = function(e){
        console.log(e.target.value);
        app.setMetalness(e.target.value);
        showNum(e.target.value, "metalness_num");
    }

    document.getElementById("btn").onclick = function(){
        var control = document.getElementById("control");
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
        }
        else{
            control.style.display = "none";
            stats.domElement.style.display = 'none';
        }
    }

    document.querySelector(".animate").onclick = function(){
        app.playAnimate();
        this.className = "animate disable";
    }

    document.getElementById("info").onclick = function(){
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
        document.querySelector(".animate").className = "animate";
    });
}


function showNum(n, tip){
    var n = Number(n);
    document.getElementById(tip).innerHTML = n.toFixed(3);
}