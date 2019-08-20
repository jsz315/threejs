import './index.less'
import App from'./App'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';

let app = new App();
app.setup();

let gui;
let API = {
    scale: 1.0
};

initGui();
initStats();

function updateGUIParam(){
    app.updateGUIParam(API);
}

function initGui() {
    gui = new GUI();
    var rotation = gui.addFolder("rotation");
    rotation.add(API, 'scale', 1, 10).step( 1 ).onChange( updateGUIParam );
}

function initStats(){
    var stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    
    app.setStats(stats);
}