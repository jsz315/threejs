import * as THREE from 'three'
const TWEEN = require('../lib/Tween.js');
import listener from '../lib/listener';
import { FreeCamera } from './FreeCamera';
import FocusLight from './FocusLight';

export default class ViewHelper extends THREE.Object3D{
    
    cameraHelper:THREE.CameraHelper;
    lightHelper:THREE.DirectionalLightHelper;
    camera:FreeCamera;
    light:FocusLight;
    box:THREE.Mesh;
    aim:THREE.Vector3;

    constructor(){
        super();
        this.box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        // this.add(this.box);
    }

    addCamera(view:FreeCamera):void{
        this.camera = view;
        this.cameraHelper = new THREE.CameraHelper(view);
        // this.add(this.cameraHelper);
    }

    addLight(view:FocusLight):void{
        this.light = view;
        this.lightHelper = new THREE.DirectionalLightHelper(view);
        // this.add(this.lightHelper);
    }

    update():void{
        // this.cameraHelper && this.cameraHelper.update();
        // this.lightHelper && this.lightHelper.update();
    }

    play():void{
        TWEEN.removeAll();

        var spot:THREE.Vector3 = this.camera.orbit.target;
        var epot:THREE.Vector3 = this.camera.position.clone();

        this.box.position.copy(epot);

        this.light.position.copy(this.camera.position);
        // this.light.distance = epot.distanceTo(spot);
        console.log(this.light);

        new TWEEN.Tween(epot).to({
            x: spot.x,
            y: spot.y,
            z: spot.z
        }, 8000).onUpdate(()=>{
            this.box.position.copy(epot.clone());
            this.light.target = this.box;
        }).onComplete(()=>{
            
        }).start();
    }

}