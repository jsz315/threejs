import * as THREE from 'three'
let OrbitControls = require('three-orbit-controls')(THREE);

import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
// import {OrbitControls} from 'three-orbitcontrols-ts'
// import {OrbitControls} from 'three/examples/js/controls/OrbitControls';

export default class Game {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer();
    }

    setup() {
        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshNormalMaterial();
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, -4, 0);
        this.scene.add(cube);

        let ambient = new THREE.AmbientLight(0xff9900);
        this.scene.add(ambient);

        let directional = new THREE.DirectionalLight(0x999);
        this.scene.add(directional);

        this.camera.position.z = 10;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        new OrbitControls(this.camera, this.renderer.domElement);

        this.ambient = ambient;
        this.directional = directional;

        this.loadJSON();
        this.load3DS();
        this.animate();
    }

    changeColor(param: any) {
        if (param.name == "Background") {
            this.renderer.setClearColor(new THREE.Color(param.data));
        }
        else if (param.name == "AmbientLight") {
            this.ambient.color = new THREE.Color(param.data);
        }
        else if (param.name == "DirectionalLight") {
            this.directional.color = new THREE.Color(param.data)
        }
    }

    loadJSON() {
        let loader = new THREE.ObjectLoader();
        loader.load("/obj/teapot-claraio.json", (obj: any) => {
            obj.material = new THREE.MeshNormalMaterial();
            obj.position.set(0, 4, 0);
            this.scene.add(obj);
        })
    }

    load3DS() {
        let loader = new TDSLoader();
        // var resourcePath = '/obj/portalgun/textures/';
        // var url = '/obj/portalgun/portalgun.3ds';

        var resourcePath = '/obj/house/';
        var url = '/obj/house/QQ.3DS';
        loader.setResourcePath(resourcePath);
        loader.load(url, (object) => {
            console.log(object)
            object.traverse(function (child: any) {
                if (child.isMesh) {
                    console.log(child);
                    // child.material.normalMap = normal;
                    // child.material = new THREE.MeshNormalMaterial();
                    child.scale.set(0.004, 0.004, 0.004);
                }

            });
            this.scene.add(object);
        })
    }

    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }
}