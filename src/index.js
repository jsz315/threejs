import './index.less'
import {httpGet, httpPost} from './common/request'
import Game from'./ts/Dom'
import File from './ts/File'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

let game = new Game();
game.setup();

let file = new File();

let gui;
let API = {
    intensity: 0.7,      
    angle: 0.3,    
    penumbra: 0.2,    
    decay: 2,    
    distance: 50,
    roughness: 0.1,
    metalness: 0.1
};

initGui();

function updateGUIParam(){
    game.updateGUIParam(API);
}

function initGui() {
    gui = new GUI();

    gui.add( API, 'intensity', 0.0, 2.0).name( 'intensity' ).onChange( updateGUIParam );
    gui.add( API, 'angle', 0.0, 2.0 ).name( 'angle' ).onChange( updateGUIParam );
    gui.add( API, 'penumbra', 0.0, 2.0 ).name( 'penumbra' ).onChange( updateGUIParam );
    gui.add( API, 'distance', 0.0, 100 ).name( 'distance' ).onChange( updateGUIParam );
    gui.add( API, 'decay', 0.0, 10 ).name( 'decay' ).onChange( updateGUIParam );
    gui.add( API, 'roughness', 0.0, 2.0 ).name( 'roughness' ).onChange( updateGUIParam );
    gui.add( API, 'metalness', 0.0, 2.0 ).name( 'metalness' ).onChange( updateGUIParam );
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

document.querySelector("#control").addEventListener("change", function(e){
    game.toggerControl($('#control').is(':checked'));
});

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
