import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls'

export default class App {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    updateGUIParam(param: any){

    }

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
      
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = false;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.addLights();
        this.addObj();
        this.animate();
        this.camera.lookAt(new THREE.Vector3());
        document.body.appendChild(this.renderer.domElement);
    }
    
    addObj(){
        
    }


    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);
    }
}