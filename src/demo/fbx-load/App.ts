import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from './tool/FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { JSZip } from 'three/examples/js/libs/jszip.min.js';
const JSZip = require('three/examples/js/libs/jszip.min.js');
import Pickup from './tool/Pickup'
import Tooler from './Tooler'
import FitSize from './tool/FitSize'
import FineLoader from './tool/FineLoader'

export default class App {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    clock: THREE.Clock = new THREE.Clock();
    mixer: any;
    rayCaster: THREE.Raycaster = new THREE.Raycaster();

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
        new Pickup(this.renderer.domElement, this.scene, this.camera);
    }

    onResize(e: Event): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setStats(stats: any): void {
        this.stats = stats;
    }

    animate(): void {
        var delta = this.clock.getDelta();
        this.mixer && this.mixer.update(delta);
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }

    setup(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x111111));
        this.renderer.shadowMap.enabled = true;

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(10, 30, 100);
        // this.camera.position.set(0, 0, 0);

        // this.addLights();
        this.addObj();
        this.animate();
        // this.test();
        // this.addPots();
        // this.loadZip3();

        this.camera.lookAt(new THREE.Vector3());
        document.body.appendChild(this.renderer.domElement);
    }
    

    async addObj() {
        let url = '/obj/fbx/woman/succubus.fbx';
        let obj:any = await FineLoader.loadFbx(url);
        this.fitModel(obj);
        // let url = '/obj/fbx/woman/succubus.fbx';
        // if (url.indexOf(".fbx") != -1) {
        //     this.loadFbxObj(url);
        // }
        // else {
        //     this.loadDaeObj(url);
        // }
    }

    fitModel(group: THREE.Object3D): void {
        FitSize.resize(group, 100);
        this.scene.add(group);
        var helper:THREE.BoxHelper = new THREE.BoxHelper(group);
        var size:THREE.Vector3 = Tooler.getBoxSize(helper);
        // var box:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x , size.y, size.z), new THREE.MeshStandardMaterial({
        //     color: new THREE.Color(0xff9900),
        //     opacity: 0.3,
        //     transparent: true
        // }))

        var ball:THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(100), new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color(0x000000),
            opacity: 0.01,
            transparent: true
        }));
        ball.name = 'ball';

        // box.material = new THREE.MeshNormalMaterial();
        // box.position.copy(helper.position);
        this.scene.add(ball);
        // this.scene.add(helper);
    }

    initMaterial(obj: THREE.Object3D): void {
        var mat1: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffad77 });
        var mat2: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x3cce02 });
        var mat3: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        var mat4: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        var mat5: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        obj.traverse(function (child: any) {
            if (child.isMesh) {
                // child.castShadow = true;
                // child.receiveShadow = true;
                console.log(child.name);
                if (child.name.indexOf('肌肉') != -1) {
                    (child as THREE.Mesh).material = mat1;
                }
                else if (child.name.indexOf('Box') != -1) {
                    (child as THREE.Mesh).material = mat2;
                }
                else if (child.name.indexOf('眼睛') != -1) {
                    (child as THREE.Mesh).material = mat3;
                }
                else if (child.name.indexOf('QuadPatch') != -1) {
                    // (child as THREE.Mesh).material = mat4;
                    child.parent.remove(child);
                }
                else {
                    (child as THREE.Mesh).material = mat5;
                }
            }

        });
    }

    addLights(): void {
        var ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.8;
        this.scene.add(ambient);

        var directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
        this.scene.add(directionalLight);
        directionalLight.position.set(20, 60, 20);
        directionalLight.lookAt(new THREE.Vector3());
    }
}