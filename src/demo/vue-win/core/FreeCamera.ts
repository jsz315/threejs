import * as THREE from 'three'
import Tooler from './Tooler';
const TWEEN = require('../lib/Tween.js');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import listener from '../lib/listener';

export class FreeCamera extends THREE.PerspectiveCamera{

    aim:THREE.Vector3 = new THREE.Vector3();
    size: number = 0;
    orbit: OrbitControls;
    domElement: HTMLCanvasElement;
    startPot: THREE.Vector3 = new THREE.Vector3(-400, 600, -800);
    actions: any = {
        left: false,
        right: false,
        front: false,
        back: false,
        up: false,
        down: false
    };
    

    constructor(domElement:HTMLCanvasElement){
        super(75, window.innerWidth / window.innerHeight, 20, 80000);
        this.position.copy(this.startPot);
        this.startPot = this.position.clone().normalize();
        console.log("startPot", this.startPot);

        this.domElement = domElement; 

        this.orbit = new OrbitControls(this, domElement);
        this.orbit.enabled = true;
        this.orbit.minPolarAngle = 1;
        this.orbit.maxPolarAngle = 90 * Math.PI / 180;

        this.lookAt(this.aim);
        
        listener.on("startWalk", ()=>{
            this.startWalk();
        });

        listener.on("stopWalk", ()=>{
            this.stopWalk();
        });

        listener.on("touchstart", (n:String)=>{
            this.actions[n + ""] = true;
        });
        
        listener.on("touchend", (n:String)=>{
            this.actions[n + ""] = false;
        });
    }

    startWalk(){
        // this.orbit.enabled = false;

        console.log(this);
        console.log(this.aim);
        console.log(this.orbit.target);

        this.aim = this.orbit.target.clone();
        new TWEEN.Tween(this.position).to({
            y: 60,
        }).start();
        new TWEEN.Tween(this.aim).to({
            x: 0,
            y: 60,
            z: 10
        }).onUpdate(()=>{
            this.lookAt(this.aim);
        }).start();
    }

    stopWalk(){
        this.orbit.enabled = true;
    }

    update(){
        if(this.actions["left"]){
            // this.rotateY(0.02);
            this.translateX(-10);
        }
        if(this.actions["right"]){
            // this.rotateY(-0.02);
            this.translateX(10);
        }
        if(this.actions["front"]){
            this.translateZ(-10);
        }
        if(this.actions["back"]){
            this.translateZ(10);
        }
        if(this.actions["up"]){
            this.translateY(10);
        }
        if(this.actions["down"]){
            if(this.position.y > 32){
                this.translateY(-10);
            }
        }
    }

    reset(obj:THREE.Object3D){
        let bs = Tooler.getBoxSize(obj);
        let s = Math.max(bs.x, bs.y, bs.z) * 1.2;
        if(s > this.size){
            this.size = s;
            let offset = Tooler.getOffsetVector3(obj);
            let pot = this.startPot.clone();

            // console.log("【加载模型位置】");
            // console.log(offset);

            console.log("当前舞台尺寸 size = " + s);
            console.log(pot);

            this.orbit.enabled = false;

            TWEEN.removeAll();
            new TWEEN.Tween(this.aim).to({
                x: offset.x,
                y: offset.y,
                z: offset.z
            }).start();
            new TWEEN.Tween(this.position).to({
                x: pot.x * s, 
                y: pot.y * s, 
                z: pot.z * s
            }, 3000).onUpdate(()=>{
                this.lookAt(this.aim);
            }).onComplete(()=>{
                this.orbit.target = offset;
                this.orbit.enabled = true;
            }).start();
            
        }
       
    }
    
}