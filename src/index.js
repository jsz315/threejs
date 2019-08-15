import './index.less'
import {httpGet, httpPost} from './common/request'
import Game from'./ts/Door'
import File from './ts/File'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

let game = new Game();
game.setup();

let file = new File();

let gui;
let API = {
    lightMapIntensity: 0.1,
    aoMapIntensity: 0.25,
    emissiveIntensity: 0.25,
    opacity: 0.4,
    roughness: 0.1,
    metalness:0.1,
    color: 0xffffff,
    emissive: 0xffffff
};

initGui();

function updateUvTransform(){
    game.changeMaterial(API);
}

function initGui() {
    gui = new GUI();

    gui.add( API, 'opacity', 0.0, 1).name( 'opacity' ).onChange( updateUvTransform );
    gui.add( API, 'lightMapIntensity', 0.0, 2.0 ).name( 'lightMapIntensity' ).onChange( updateUvTransform );
    gui.add( API, 'aoMapIntensity', 0.0, 2.0 ).name( 'aoMapIntensity' ).onChange( updateUvTransform );
    gui.add( API, 'emissiveIntensity', 0.0, 2.0 ).name( 'emissiveIntensity' ).onChange( updateUvTransform );
    gui.add( API, 'roughness', 0.0, 2.0 ).name( 'roughness' ).onChange( updateUvTransform );
    gui.add( API, 'metalness', 0.0, 2.0 ).name( 'metalness' ).onChange( updateUvTransform );
    gui.addColor( API, 'color', 0, 0xffffff ).name( 'color' ).onChange( updateUvTransform );
    gui.addColor( API, 'emissive', 0, 0xffffff ).name( 'emissive' ).onChange( updateUvTransform );
}

$("#toggle-sidebar").click(function(){
    $(".page-wrapper").toggleClass("open");	 
});

$("#btn").click(function(){
    game.saveObject();
})

$("#load").click(function(){
    game.loadObject();
})

$("#write").click(function(){
    file.write("您的昵称是 jsz315");
})

document.querySelector("#Background").addEventListener("change", onChangeColor);
document.querySelector("#AmbientLight").addEventListener("change", onChangeColor);
document.querySelector("#DirectionalLight").addEventListener("change", onChangeColor);

function onChangeColor(e){
    window.dispatchEvent(new CustomEvent("change_color", {
        detail: {
            name: e.target.getAttribute("id"),
            data: e.target.value
        }
    }))
}

$("#rotation").change(function(){
    console.log(this.value);
    game.changeRotation(this.value);
})

window.addEventListener("change_color", function(e){
    game.changeColor(e.detail);
})

var $info = $(".info");
window.addEventListener("info", function(e) {
    if($info){
        var str = ["x = ", e.detail.x.toFixed(6), "<br/>y = ", e.detail.y.toFixed(6), "<br/>z = ", e.detail.z.toFixed(6)].join("");
        $info.html(str);
    } 
})
