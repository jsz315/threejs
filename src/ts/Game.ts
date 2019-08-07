import * as THREE from 'three'
// let OrbitControls = require('three-orbit-controls')(THREE);
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
// import {OrbitControls} from 'three-orbitcontrols-ts'
// import {OrbitControls} from 'three/examples/js/controls/OrbitControls';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EquirectangularToCubeGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator';
import { PMREMCubeUVPacker } from 'three/examples/jsm/pmrem/PMREMCubeUVPacker';

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

        let ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        let directional = new THREE.DirectionalLight(0xffffff);
        this.scene.add(directional);

        this.camera.position.z = 10;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        document.body.appendChild(this.renderer.domElement);
        new OrbitControls(this.camera, this.renderer.domElement);

        this.ambient = ambient;
        this.directional = directional;

        this.loadJSON();
        this.load3DS();
        this.loadGLTF();
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
        let isDebug = location.search.indexOf("debug=1") != -1;
        var resourcePath = '/obj/portalgun/textures/';
        var url = '/obj/portalgun/portalgun.3ds';
        
        if(isDebug){
            resourcePath = '/obj/house/';
            url = '/obj/house/QQ.3DS';

            // resourcePath = '/obj/car/';
            // url ='/obj/car/motom.3ds';
        }

        loader.setResourcePath(resourcePath);
        loader.load(url, (object) => {
            console.log("-----");
            console.log(object);
            object.traverse((child: any) => {
                if (child.isMesh) {
                    console.log(child);
                    // child.material.normalMap = normal;
                    // child.material = new THREE.MeshNormalMaterial();
                    // isDebug && child.scale.set(0.004, 0.004, 0.004);
                    // isDebug && child.scale.set(0.04, 0.04, 0.04);
                }

            });
            isDebug && object.scale.set(0.05, 0.05, 0.05);
            this.scene.add(object);
        })
    }

    loadGLTF(){

        let rgbeLoader = new RGBELoader();
        rgbeLoader.setDataType(THREE.UnsignedByteType);
        rgbeLoader.load( '/obj/glTF/pedestrian_overpass_2k.hdr', texture => {

						var cubeGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 1024 } );
						var texture: THREE.DataTexture = cubeGenerator.update( this.renderer );

						var pmremGenerator = new PMREMGenerator( texture );
						pmremGenerator.update( this.renderer );

						var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
						pmremCubeUVPacker.update( this.renderer );

						var envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

                        let loader = new GLTFLoader();
                        loader.setPath('/obj/glTF/');
                        loader.load('DamagedHelmet.gltf', (gltf) => {
                            gltf.scene.traverse((child:any) => {
                                if(child.isMesh){
                                    child.material.envMap = envMap;
                                }
                            })
                            this.scene.add(gltf.scene);
                        })
                    })
    }

    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }
}