import * as THREE from 'three'
// let OrbitControls = require('three-orbit-controls')(THREE);
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EquirectangularToCubeGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator';
import { PMREMCubeUVPacker } from 'three/examples/jsm/pmrem/PMREMCubeUVPacker';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { BoxHelper, Vector3, Mesh } from 'three';

const ThreeBSP = require('three-js-csg')(THREE);

export default class Game {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    raycaster: THREE.Raycaster = new THREE.Raycaster();

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer();
        window.addEventListener("mousedown", e => {this.onMouseDown(e)}, false);
    }

    onMouseDown(e: MouseEvent){
        let x = (e.clientX / window.innerWidth) * 2 - 1;
        let y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera({x: x, y: y}, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);
        if(intersects[0]){
            this.saveObject(intersects[0].object);
        }
    }

    setup() {
        // let geometry = new THREE.BoxBufferGeometry();
        // let material = new THREE.MeshStandardMaterial({color: 0xff0099});
        // material.emissiveMap = new THREE.TextureLoader().load("/girl.jpg");
        // material.emissive = new THREE.Color(0x00ff00);
        // material.needsUpdate = true;

        // let cube = new THREE.Mesh(geometry, material);
        // cube.receiveShadow = true;
        // cube.castShadow = true;
        // cube.position.set(2, 4, 2);
        // this.scene.add(cube);

        let m = new THREE.MeshStandardMaterial();
        // specularMap//高光贴图
        // diffuseMap//颜色贴图
        let list = [
            m.envMap,
            m.bumpMap,//细节贴图，没有光影效果
            m.alphaMap,
            m.lightMap,
            m.metalnessMap,//金属性
            m.normalMap,//凹凸细节，模拟光影效果
            m.emissiveMap,//自发光
            m.displacementMap//高模烘培贴图，给低模更真实的效果
        ]
        let geometry = new THREE.BoxGeometry(3, 3, 3);
        let material = new THREE.MeshNormalMaterial();
        let mat = new THREE.MeshStandardMaterial({wireframe: true});
        let cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        // const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 30, 30), material);
        const sphere = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material)
        sphere.position.y = -1;
        this.scene.add(sphere);

        let cBSP = new ThreeBSP(cube);
        let sBSP = new ThreeBSP(sphere);
        let rBSP = cBSP.subtract(sBSP);
        // let rBSP = cBSP.union(sBSP);
        let rMesh = rBSP.toMesh();
        rMesh.material = material;
        rMesh.position.y = -7;
        this.scene.add(rMesh);

        cube.position.set(-4, -3, 0);
        sphere.position.set(0, -4, 0);
        rMesh.position.set(4, -3, 0);

        let helper = new BoxHelper(rMesh, new THREE.Color(0xff0000));
        this.scene.add(helper);
        helper.position.set(rMesh.position.x, rMesh.position.y, rMesh.position.z);


        let grid = new THREE.GridHelper(40, 40);
        this.scene.add(grid);

        let ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        let directional = new THREE.DirectionalLight(0xffffff);
        directional.castShadow = true;
        // directional.shadow.mapSize.width = 400;
        // directional.shadow.mapSize.height = 400;
        // directional.shadow.camera.left = -50;
        // directional.shadow.camera.right = 50;
        // directional.shadow.camera.top = 50;
        // directional.shadow.camera.bottom = -50;
        // directional.shadow.camera.far = 100;
        directional.shadow.bias = -0.002;

        directional.position.set(4, 9, 2);
        directional.lookAt(new THREE.Vector3());
        this.scene.add(directional);
        this.scene.add(new THREE.DirectionalLightHelper(directional));

        this.camera.position.set(0, 0, 10);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x333333));
        this.renderer.shadowMapEnabled = true;
        document.body.appendChild(this.renderer.domElement);
        new OrbitControls(this.camera, this.renderer.domElement);

        this.ambient = ambient;
        this.directional = directional;

        this.loadJSON();
        this.load3DS();
        this.loadGLTF();
        this.animate();
        this.addPlane();
    }

    addPlane(){
        let geometry = new THREE.PlaneGeometry(10, 10);
        let meterial = new THREE.MeshStandardMaterial({color: 0xffaa88, side: THREE.DoubleSide});
        let mesh = new THREE.Mesh(geometry, meterial);
        mesh.receiveShadow = true;
        mesh.rotateX(Math.PI * -90 / 180);
        this.scene.add(mesh);

        this.addPath();
    }

    addPath(){
        let shape = new THREE.Shape();
        shape.arc(0, 0, 1, 0, Math.PI * 2, false);
        let p1 = new THREE.Vector3(3, -4, 6);
        let p2 = new THREE.Vector3(-3, 6, 12);
        let path = new THREE.LineCurve3(p1, p2);
        
        let extrudeSettings = {
            bevelEnabled: true,
            bevelSize: 1,
            bevelThickness: 3,
            bevelOffset: 0,
            bevelSegments: 4,
            step: 10,
            depth: 2,
            extrudePath: path
        }

        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( -10, 0, 10 ),
            new THREE.Vector3( -5, 5, 5 ),
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 5, -5, 5 ),
            new THREE.Vector3( 10, 0, 10 )
        ] );

        var points = curve.getPoints(200);
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
        // let extrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // let geometry = new THREE.TubeGeometry(curve, 10, 2, 8, true);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
        this.scene.add(mesh);
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

    saveObject(obj: THREE.Object3D){
        let exporter = new GLTFExporter();
        exporter.parse(obj, (gltf: any) => {
            console.log(gltf);
        }, {});
    }

    loadJSON() {
        let loader = new THREE.ObjectLoader();
        loader.load("/obj/teapot-claraio.json", (obj: any) => {
            obj.material = new THREE.MeshNormalMaterial();
            obj.position.set(0, 4, 0);
            this.scene.add(obj);
            this.scene.add(new BoxHelper(obj, new THREE.Color(0xff0000)));
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
        }

        loader.setResourcePath(resourcePath);
        loader.load(url, (object) => {
            object.traverse((child: any) => {
                if (child.isMesh) {
                    console.log(child);
                }

            });
            isDebug && object.scale.set(0.05, 0.05, 0.05);
            object.position.set(4, 2, 1);
            this.scene.add(object);
            this.scene.add(new THREE.BoxHelper(object));
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
                this.scene.add(new THREE.BoxHelper(gltf.scene));
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