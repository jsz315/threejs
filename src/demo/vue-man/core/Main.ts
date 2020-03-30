import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from '../lib/FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Tooler from './Tooler'
import listener from '../lib/listener';
import { GLTFExporter } from '../../vue-win/lib/GLTFExporter'
import Part from './Part'

export default class Main {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    clock:THREE.Clock = new THREE.Clock();
    mixer: any;
    isMobile: boolean = Tooler.checkMobile();
    rayCaster: THREE.Raycaster = new THREE.Raycaster();
    canvas: any;
    part: Part;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;


    constructor(canvas: any) {
        this.canvas = canvas;
        this.canvas.width =  window.innerWidth;
        this.canvas.height =  window.innerHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas
        });
        window.addEventListener("resize", e => this.onResize(e), false);
        listener.on('export', () => {
            var obj:THREE.Object3D = this.scene.getObjectByName('load_scene');
            Tooler.toGLTFData(obj, 'man');
        })
        listener.on('param', (type:string, attr:string, data:any) => {
            console.log(type, attr, data);
            if(type == 'ambient' || type == 'directional'){
                var obj:any = this;
                if(attr == 'color'){
                    obj[type + 'Light'][attr] = new THREE.Color(data);
                }
                else{
                    obj[type + 'Light'][attr] = data;
                }                
            }
            else if(type == 'system'){
                if(attr == 'background'){
                    this.renderer.setClearColor(new THREE.Color(data));
                }
            }
            else{
                this.part.change(type, attr, data);
            }
            
        })
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

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
      
        this.orbit = new OrbitControls(this.camera, this.canvas);
        this.orbit.enabled = true;
        this.camera.position.set(20, 20, 20);

        this.addLights();
        this.loadGlb();
        this.animate();
        this.camera.lookAt(new THREE.Vector3());
        this.canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.choose(e), false);
    }

    choose(e:any){
        listener.emit('hideEffect');
        if (this.isMobile) {
            e = e.changedTouches[0];
        }
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
        }
    }
    
    loadGlb(){
        let loader = new GLTFLoader();
        loader.setCrossOrigin('anonymous');
        loader.load('./asset/obj/man.glb', (gltf:any) => {
            console.log("【GLTF数据】");
            console.log(gltf);
            this.fitModel(gltf.scene);
            this.initMaterial(gltf.scene);
            listener.emit('loaded');
        }, e=>{
            console.log(e);
        })
    }

    fitModel(group: THREE.Object3D): void {
        let scale: number = Tooler.getFitScale(group, 20);
        group.scale.multiplyScalar(scale);
        group.name = "load_scene";
        let aim = new THREE.Object3D();
        aim.name = "aim_scene";
        aim.add(group);
        this.scene.add(aim);
    }

    initMaterial(obj: THREE.Object3D):void{
        this.part =new Part(obj);
    }

    addLights():void{
        var ambientLight:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.intensity = 0.2;
        this.scene.add(ambientLight);

        var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight(0x0000ff);
        this.scene.add(directionalLight);
        directionalLight.position.set(20, 60, 20);
        directionalLight.lookAt(new THREE.Vector3());

        this.ambientLight = ambientLight;
        this.directionalLight = directionalLight;
    }
}