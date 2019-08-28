import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(3, 4, 5);
        this.camera.lookAt(new THREE.Vector3());
        window.addEventListener("resize", e => this.onResize(e), false);
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    loadObject():void{
        let loader = new GLTFLoader();
        loader.setPath('obj/gl/');
        loader.load('win.gltf', (gltf) => {

            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    console.log(child);
                    child.name = "load_mesh";
                }
            })
            
            let size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
            let max = Math.max(size.x, size.y, size.z);
            let scale = 10 / max;            
            gltf.scene.scale.set(scale, scale, scale);

            this.scene.add(gltf.scene);
            gltf.scene.name = "load_scene";

            let c = new THREE.Box3().setFromObject(gltf.scene);
            let x = (c.min.x + c.max.x) / 2;
            let y = (c.min.y + c.max.y) / 2;
            let z = (c.min.z + c.max.z) / 2;
            gltf.scene.position.set(0 - x, 0 - y, 0 - z);
        })
    }

    setup():void {
        this.addLights();
        this.loadObject();
        this.animate();
    }

    addLights():void{
        //环境光
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);

        //聚光灯
        var spotLight:THREE.SpotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 2.02;
        spotLight.castShadow = true;
        spotLight.angle = 1.0;
        spotLight.penumbra = 0.2;
        this.scene.add(spotLight);
        spotLight.position.set(-2, 7, 4);
    }
}