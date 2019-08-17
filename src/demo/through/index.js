import './index.less'
import App from'./App'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';

let app = new App();
app.setup();

let gui;
let API = {
    color: 0xffffff
};

initGui();
initStats();

function updateGUIParam(){
    app.updateGUIParam(API);
}

function initGui() {
    gui = new GUI();
    gui.addColor( API, 'color' ).name( 'color' ).onChange( updateGUIParam );
}

function initStats(){
    var stats = new Stats();
    // 0: fps, 1: ms
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    
    app.setStats(stats);
}

let $control = $(".control");
$control.click(function(e){
    $control.toggleClass("open");
    app.toggerControl($control.hasClass("open"));
});