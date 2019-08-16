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
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default class Game {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambient: THREE.AmbientLight;
    directional: THREE.SpotLight;
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    mat: THREE.MeshStandardMaterial;
    drag: THREE.Mesh;
    orbit: OrbitControls;
    helper: THREE.SpotLightHelper;
    
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        // window.addEventListener("mousedown", e => this.onMouseDown(e), false);
        window.addEventListener("resize", e => this.onResize(e), false);
    }

    onMouseDown(e: MouseEvent):void{
        let x = (e.clientX / window.innerWidth) * 2 - 1;
        let y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera({x: x, y: y}, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);
        console.log(intersects[0]);
        if(intersects[0] && intersects[0].face){
            
        }
    }

    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    loadObject():void{
        let loader = new GLTFLoader();
        loader.setPath('/obj/glTF/');
        loader.load('scene.gltf', (gltf) => {
            console.log("gltf");
            console.log(gltf);
            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                    if(child.material.map){
                        child.material.map.flipY = true;
                    }
                    child.uvsNeedUpdate = true;
                }
            })
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            this.scene.add(gltf.scene);
            this.scene.add(new THREE.BoxHelper(gltf.scene, new THREE.Color(0x333333)));
        })
    }

    rotateAroundWorldAxis(object:any, axis:any, radians:number) {
        let rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }
    
    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }

    updateGUIParam(param: any){
        this.directional.intensity = param.intensity;
        this.directional.angle = param.angle;
        this.directional.penumbra = param.penumbra;
        this.directional.decay = param.decay;
        this.directional.distance = param.distance;

        this.mat.roughness = param.roughness;
        this.mat.metalness = param.metalness;
    }

    toggerControl(use: boolean):void{
        this.orbit.enabled = use;
    }

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = false;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.addGrid();
        this.addPlane();
        this.addLights();
        this.addObj();
        this.animate();
        this.addDrag();

        this.camera.lookAt(Game.ZERO);
    }

    addDrag():void{
        this.drag = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshNormalMaterial());
        this.scene.add(this.drag);
        this.drag.position.copy(this.directional.position);
        this.drag.lookAt(this.directional.target.position);

        let controls = new TrackballControls( this.camera, this.renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        var dragControls = new DragControls( [this.drag], this.camera, this.renderer.domElement );
        dragControls.addEventListener( 'dragstart', () => {
            controls.enabled = false;
        } );
        dragControls.addEventListener( 'drag', () => {
            this.directional.position.copy(this.drag.position);
            this.drag.lookAt(Game.ZERO);
            this.helper.update();
        } );
        dragControls.addEventListener( 'dragend', () => {
            controls.enabled = true;
        } );
    }

    addGrid():void{
        // let grid = new THREE.GridHelper(80, 80);
        // this.scene.add(grid);
        this.scene.add(new THREE.AxesHelper(4));
    }

    addPlane():void{
        let geometry = new THREE.PlaneGeometry(30, 30);
        let meterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide, emissive: 0x909090});
        let mesh = new THREE.Mesh(geometry, meterial);
        mesh.rotateX(Math.PI * -90 / 180);
        // mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    addObj(){
        let mat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x000000,
            opacity: 1,
            premultipliedAlpha: true,
            transparent: true,
            roughness: 0,
            metalness: 0,
        })

        for(let i = 0; i < 3; i++){
            let geo = i % 2 ? new THREE.BoxGeometry(1, 1, 1) : new THREE.SphereGeometry(0.5, 18, 18);
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.set((1 - i) * 2, 1, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        }

        this.mat = mat;
    }


    addLights():void{
        //方向性光源
        var directional:THREE.SpotLight = new THREE.SpotLight(0xffffff);
        directional.intensity = 0.7;
        directional.castShadow = true;
        directional.angle = 0.3;
        directional.penumbra = 0.2;
        directional.decay = 2;
        directional.distance = 50;

       
        //环境光
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;

        this.scene.add(directional);
        this.scene.add(ambient);

        directional.position.set(-2, 7, 4);

        this.helper = new THREE.SpotLightHelper(directional);
        this.scene.add(this.helper);

        this.directional = directional;
    }

}