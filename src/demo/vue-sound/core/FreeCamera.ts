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


    constructor(domElement:HTMLCanvasElement){
        super(75, window.innerWidth / window.innerHeight, 20, 8000);

        this.domElement = domElement; 
        this.orbit = new OrbitControls(this, this.domElement);
        this.orbit.enabled = true;
        this.position.set(100, 100, 100);
        this.lookAt(new THREE.Vector3());
    }
    
}