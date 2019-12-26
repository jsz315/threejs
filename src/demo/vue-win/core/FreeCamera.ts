import * as THREE from 'three'
import Tooler from './Tooler';
const TWEEN = require('../lib/Tween.js');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class FreeCamera extends THREE.PerspectiveCamera{

    target:THREE.Vector3 = new THREE.Vector3();
    size: number = 0;
    orbit: OrbitControls;
    domElement: HTMLCanvasElement;
    startPot: THREE.Vector3 = new THREE.Vector3(10.267941883040285, 12.752462870020817, -12.486184913116992);
    

    constructor(domElement:HTMLCanvasElement){
        super(75, window.innerWidth / window.innerHeight, 0.1, 24000);
        this.position.set(10.267941883040285, 12.752462870020817, -12.486184913116992);
        this.startPot = this.position.clone().normalize();
        console.log("startPot", this.startPot);
        this.lookAt(new THREE.Vector3());
        this.domElement = domElement; 


        this.orbit = new OrbitControls(this, domElement);
        this.orbit.enabled = true;
        this.orbit.minPolarAngle = 1;
        this.orbit.maxPolarAngle = 90 * Math.PI / 180;
    }

    reset(obj:THREE.Object3D){
        let bs = Tooler.getBoxSize(obj);
        let s = Math.max(bs.x, bs.y, bs.z) * 1.2;
        if(s > this.size){
            this.size = s;
            let offset = Tooler.getOffsetVector3(obj);
            let pot = this.startPot.clone();
            new TWEEN.Tween(this.position).to({
                x: pot.x * s, 
                y: pot.y * s, 
                z: pot.z * s
            }, 3000).onUpdate(()=>{
                this.lookAt(offset);
            }).onComplete(()=>{
                this.orbit.target = offset;
            }).start();
            
        }
       
    }
    
}