import './index.less'
import App from'./App'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

let app = new App();
app.setup();

let gui;
let API = {

    spotLight: true,
    spotLightColor: 0xffffff,
    spotLightIntensity: 0.7,      
    spotLightAngle: 0.3,    
    spotLightPenumbra: 0.2,    
    spotLightDistance: 50,
    spotLightDecay: 2,    

    directionalLight: true,
    directionalLightColor: 0xffffff,
    directionalLightIntensity: 0.7,

    obj: true,
    objRoughness: 0.1,
    objMetalness: 0.1,
    objColor: 0xff0000,
    objEmissive: 0x000000,
    objOpacity: 1.0,

    plane: true,
    planeRoughness: 0.1,
    planeMetalness: 0.1,
    planeColor: 0xff0000,
    planeEmissive: 0x000000,
    
};

initGui();

function updateGUIParam(){
    app.updateGUIParam(API);
}

function initGui() {
    gui = new GUI();

    gui.add( API, 'spotLight' ).name( '聚光灯' ).onChange( updateGUIParam );
    gui.addColor( API, 'spotLightColor' ).name( 'color' ).onChange( updateGUIParam );
    gui.add( API, 'spotLightIntensity', 0.0, 10.0).name( 'intensity' ).onChange( updateGUIParam );
    gui.add( API, 'spotLightAngle', 0.0, 2.0 ).name( 'angle' ).onChange( updateGUIParam );
    gui.add( API, 'spotLightPenumbra', 0.0, 2.0 ).name( 'penumbra' ).onChange( updateGUIParam );
    gui.add( API, 'spotLightDistance', 0.0, 100 ).name( 'distance' ).onChange( updateGUIParam );
    gui.add( API, 'spotLightDecay', 0.0, 10 ).name( 'decay' ).onChange( updateGUIParam );

    gui.add( API, 'directionalLight' ).name( '平行光' ).onChange( updateGUIParam );
    gui.addColor( API, 'directionalLightColor' ).name( 'color' ).onChange( updateGUIParam );
    gui.add( API, 'directionalLightIntensity', 0.0, 10.0).name( 'intensity' ).onChange( updateGUIParam );

    gui.add( API, 'obj' ).name( '物体' ).onChange( updateGUIParam );
    gui.add( API, 'objRoughness', 0.0, 2.0 ).name( 'roughness' ).onChange( updateGUIParam );
    gui.add( API, 'objMetalness', 0.0, 2.0 ).name( 'metalness' ).onChange( updateGUIParam );
    gui.addColor( API, 'objColor' ).name( 'color' ).onChange( updateGUIParam );
    gui.addColor( API, 'objEmissive' ).name( 'emissive' ).onChange( updateGUIParam );
    gui.add( API, 'objOpacity', 0.0, 1.0 ).name( 'opacity' ).onChange( updateGUIParam );

    gui.add( API, 'plane' ).name( '地面' ).onChange( updateGUIParam );
    gui.add( API, 'planeRoughness', 0.0, 2.0 ).name( 'roughness' ).onChange( updateGUIParam );
    gui.add( API, 'planeMetalness', 0.0, 2.0 ).name( 'metalness' ).onChange( updateGUIParam );
    gui.addColor( API, 'planeColor' ).name( 'color' ).onChange( updateGUIParam );
    gui.addColor( API, 'planeEmissive' ).name( 'emissive' ).onChange( updateGUIParam );
}

let $control = $(".control");
$control.click(function(e){
    $control.toggleClass("open");
    app.toggerControl($control.hasClass("open"));
});