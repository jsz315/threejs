import './index.less'
import App from'./App'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';

let app = new App();
app.setup();

let gui;
let API = {
    meshColor: 0xffffff,
    lineColor: 0xff0000,
    meshOpacity: 0.5,
    lineOpacity: 0.5,
    scale: 1.0,
    rotateNum: 0.01,
    translateNum: 0.01
};

initGui();
initStats();
window.addEventListener("info", e => {
    let pot = e.detail.position;
    let x = fixNumber(pot.x);
    let y = fixNumber(pot.y);
    let z = fixNumber(pot.z);
    $pot.val([x, y, z].join(","));
    // API.x = x;
    // API.y = y;
    // API.z = z;
})

function fixNumber(n){
    var num = n.toFixed(4);
    return Number(num);
}

function updateGUIParam(){
    app.updateGUIParam(API);
}

function initGui() {
    gui = new GUI();
    gui.add( API, 'rotateNum', -0.2, 0.2 ).name( 'rotateNum' ).onChange( updateGUIParam );
    gui.add( API, 'translateNum', -1.0, 1.0 ).name( 'translateNum' ).onChange( updateGUIParam );
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

let $pot = $(".pot");

$(".add").click(function(e){
    var list = $pot.val().split(",");   
    var pots = list.map(item => {
        return Number(item);
    })
    app.addPots(pots);
});

$(".set").click(function(e){
    app.set(getPot());
});

$(".del").click(function(e){
    app.del(getPot());
});

$(".drawObject").click(function(e){
    app.drawObject();
});

$(window).keydown(function(event){
    if(event.keyCode == 87){
        app.setMode( "translate" );
    }
    else if(event.keyCode == 69){
        app.setMode( "rotate" );
    }
    else if(event.keyCode == 82){
        app.setMode( "scale" );
    }
})

function getPot(){
    var pot = $pot.val();
    var list = pot.split(",");
    return {
        x: Number(list[0]),
        y: Number(list[1]),
        z: Number(list[2]),
    }
}