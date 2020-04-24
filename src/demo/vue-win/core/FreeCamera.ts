import * as THREE from 'three'
import Tooler from './Tooler';
const TWEEN = require('../lib/Tween.js');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import listener from '../lib/listener';

export class FreeCamera extends THREE.PerspectiveCamera{

    aim:THREE.Vector3 = new THREE.Vector3(-5000, 0, -5000);
    size: number = 0;
    orbit: OrbitControls;
    first: FirstPersonControls;
    domElement: HTMLCanvasElement;
    startPot: THREE.Vector3 = new THREE.Vector3(-5000, 5000, -5000);
    clock:THREE.Clock = new THREE.Clock();
    walking:boolean = false;
    active:boolean = false;
    lastPoint:any = null;
    isMobile = Tooler.checkMobile();
    floorY: number = 32;

    actions: any = {
        left: false,
        right: false,
        front: false,
        back: false,
        up: false,
        down: false
    };

    resetFirstPersonControls():void{
        this.first = new FirstPersonControls(this);
        this.first.enabled = false;
        this.first.lookSpeed = 0.02; //鼠标移动查看的速度
        this.first.movementSpeed = 10; //相机移动速度
        this.first.constrainVertical = true; //约束垂直
        this.first.verticalMin = 1.0;
        this.first.verticalMax = 2.0;
    }
    

    constructor(domElement:HTMLCanvasElement){
        super(75, window.innerWidth / window.innerHeight, 20, 80000);
        this.position.copy(this.startPot);
        this.startPot = this.position.clone().normalize();
        console.log("startPot", this.startPot);

        this.domElement = domElement; 
        this.resetOrbitControls();
        // this.resetFirstPersonControls();

        this.lookAt(this.aim);
        
        listener.on("startWalk", ()=>{
            this.startWalk();
        });

        listener.on("stopWalk", ()=>{
            this.stopWalk();
        });

        listener.on("touchstart", (n:String)=>{
            this.walking = true;
            this.actions[n + ""] = true;
            // this.updateMatrix();
            // this.orbit.target = this.aim.clone();       
            // this.orbit.update();
            // this.resetOrbitControls();
        });
        
        listener.on("touchend", (n:String)=>{
            this.walking = false;
            this.actions[n + ""] = false;
            // this.updateProjectionMatrix();
            // this.orbit.target = this.aim.clone();       
            // this.orbit.update(); 
            // this.lookAt(this.orbit.target);

            // this.resetOrbitControls();
        });

        this.domElement.addEventListener(this.isMobile ? "touchstart" : "mousedown", this.moveStart.bind(this));
        this.domElement.addEventListener(this.isMobile ? "touchmove" : "mousemove", this.moveRunning.bind(this));
        this.domElement.addEventListener(this.isMobile ? "touchend" : "mouseup", this.moveEnd.bind(this));
    }

    resetOrbitControls():void{
        this.orbit = new OrbitControls(this, this.domElement);
        this.orbit.enabled = true;
        this.orbit.minPolarAngle = -90 * Math.PI / 180;
        this.orbit.maxPolarAngle = 90 * Math.PI / 180;
    }

    startWalk(){
        this.orbit.enabled = false;
        console.log(this.orbit, 'this.orbit');
        this.position.set(this.position.x, this.orbit.target.y, this.position.z);
        this.lookAt(this.orbit.target);
    }

    moveStart(e:any):void{
        if(!this.orbit.enabled){
            if (this.isMobile) {
                e = e.changedTouches[0];
            }
            console.log('moveStart');
            console.log(e);
            this.lastPoint = {x: e.clientX, y: e.clientY};
        }
        
    }

    moveRunning(e:any):void{
        if(this.lastPoint){
            if (this.isMobile) {
                e = e.changedTouches[0];
            }
            var x = e.clientX - this.lastPoint.x;
            var y = e.clientY - this.lastPoint.y;
            this.lastPoint = {x: e.clientX, y: e.clientY};
            // this.rotateY(x * 0.002);
            this.rotateX(y * 0.002);

            this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), x * 0.002);

            // this.translateZ(y * 0.02);
            // this.rotation.y = 0;

            // this.position.y += y * 1;
            // if(this.position.y < this.floorY){
            //     this.position.y = this.floorY;
            // }
        }
    }

    moveEnd(e:any):void{
        if(this.lastPoint){
            console.log('moveEnd');
            console.log(e);
            this.lastPoint = null;
            console.log(this, this.rotation);
        }
    }

    stopWalk(){
        this.orbit.update();
        // this.resetOrbitControls();
        this.orbit.enabled = true;
    }

    update(){
        if(this.actions["left"]){
            this.translateX(-10);
        }
        if(this.actions["right"]){
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
            if(this.position.y > this.floorY){
                this.translateY(-10);
            }
        }
    }

    reset(obj:THREE.Object3D){
        let bs = Tooler.getBoxSize(obj);
        let s = Math.max(bs.x, bs.y, bs.z) * 2;
        if(s > this.size){
            this.size = s;
            let offset = Tooler.getOffsetVector3(obj);
            let pot = this.startPot.clone();

            console.log("【加载模型位置】");
            console.log(offset);

            console.log("当前舞台尺寸 size = " + s);
            console.log(pot);

            this.orbit.enabled = false;

            TWEEN.removeAll();
            new TWEEN.Tween(this.aim).to({
                x: offset.x,
                y: offset.y,
                z: offset.z
            }, 300).start();
            new TWEEN.Tween(this.position).to({
                // x: pot.x * s + 8000, 
                // y: pot.y * s, 
                // z: pot.z * s + 12000
                x: offset.x + 3000, 
                y: 4000, 
                z: offset.z + 4000
            }, 300).onUpdate(()=>{
                this.lookAt(this.aim);
            }).onComplete(()=>{
                this.orbit.target = offset;
                this.orbit.enabled = true;
            }).start();
            
        }
       
    }
    
}