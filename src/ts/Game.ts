import * as THREE from 'three'
let OrbitControls = require('three-orbit-controls')(THREE);

// import {OrbitControls} from 'three-orbitcontrols-ts'
// import {OrbitControls} from 'three/examples/js/controls/OrbitControls';

export default class Game{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth /window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer();
    }

    setup(){

        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshNormalMaterial();
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, -4, 0);
        this.scene.add(cube);

        let ambient = new THREE.AmbientLight(0xff9900);
        this.scene.add(ambient);

        let directional = new THREE.DirectionalLight(0x999);
        this.scene.add(directional);

        let loader = new THREE.ObjectLoader();
        loader.load("/obj/teapot-claraio.json", (obj: THREE.Object3D)=>{
            this.scene.add(obj);
        })

        let controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.z = 10;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);


        this.loadObj();
        this.animate();
    }

    loadObj(){
        
    }

    animate(){
        requestAnimationFrame(()=>{
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }
}