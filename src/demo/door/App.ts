import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    objMaterial: THREE.MeshStandardMaterial;
    planeMaterial: THREE.MeshStandardMaterial;
    orbit: OrbitControls;

    spotLight: THREE.SpotLight;
    spotDrag: THREE.Mesh;
    spotLightHelper: THREE.SpotLightHelper;

    directionalLight: THREE.DirectionalLight;
    directionalDrag: THREE.Mesh;
    directionalLightHelper: THREE.DirectionalLightHelper;
    
    dragControls: DragControls;
    debugObjects: Array<THREE.Object3D>;
    
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

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }

    updateGUIParam(param: any){

        this.spotLight.color = new THREE.Color(param.spotLightColor);
        this.spotLight.intensity = param.spotLightIntensity;
        this.spotLight.angle = param.spotLightAngle;
        this.spotLight.penumbra = param.spotLightPenumbra;
        this.spotLight.decay = param.spotLightDecay;
        this.spotLight.distance = param.spotLightDistance;

        this.directionalLight.color = new THREE.Color(param.directionalLightColor);
        this.directionalLight.intensity = param.directionalLightIntensity;

        this.objMaterial.roughness = param.objRoughness;
        this.objMaterial.metalness = param.objMetalness;
        this.objMaterial.color = new THREE.Color(param.objColor);
        this.objMaterial.emissive = new THREE.Color(param.objEmissive);
        this.objMaterial.opacity = param.objOpacity;

        this.planeMaterial.roughness = param.planeRoughness;
        this.planeMaterial.metalness = param.planeMetalness;
        this.planeMaterial.color = new THREE.Color(param.planeColor);
        this.planeMaterial.emissive = new THREE.Color(param.planeEmissive);

        if(param.spotLight){
            this.scene.add(this.spotLight);
        }
        else{
            this.scene.remove(this.spotLight);
        }

        if(param.directionalLight){
            this.scene.add(this.directionalLight);
        }
        else{
            this.scene.remove(this.directionalLight);
        }
        console.log(param.spotLight);
    }

    toggerControl(use: boolean):void{
        this.orbit.enabled = use;
        this.dragControls.enabled = !use;
    }

    toggerHide(use: boolean):void{
        this.debugObjects.forEach((item: THREE.Object3D) => {
            item.visible = use;
        })
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

        this.debugObjects = [];

        this.addPlane();
        this.addLights();
        this.addObj();
        this.animate();
        this.addDrag();
        this.loadObject();

        this.camera.lookAt(App.ZERO);

        this.toggerControl(true);
    }

    addDrag():void{
        this.spotDrag = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshNormalMaterial());
        this.scene.add(this.spotDrag);
        this.spotDrag.position.copy(this.spotLight.position);
        this.spotDrag.lookAt(this.spotLight.target.position);

        this.directionalDrag = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshNormalMaterial());
        this.scene.add(this.directionalDrag);
        this.directionalDrag.position.copy(this.directionalLight.position);
        this.directionalDrag.lookAt(this.directionalLight.target.position);

        this.debugObjects.push(this.spotDrag, this.directionalDrag);


        let controls = new TrackballControls( this.camera, this.renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        var dragControls = new DragControls( [this.spotDrag, this.directionalDrag], this.camera, this.renderer.domElement );
        dragControls.addEventListener( 'dragstart', () => {
            controls.enabled = false;
        } );
        dragControls.addEventListener( 'drag', () => {
            this.spotLight.position.copy(this.spotDrag.position);
            this.spotDrag.lookAt(App.ZERO);
            this.spotLightHelper.update();

            this.directionalLight.position.copy(this.directionalDrag.position);
            this.directionalDrag.lookAt(App.ZERO);
            this.directionalLightHelper.update();
        } );
        dragControls.addEventListener( 'dragend', () => {
            controls.enabled = true;
        } );

        this.dragControls = dragControls;
    }
   
    addPlane():void{
        let geometry = new THREE.PlaneGeometry(30, 30);
        let material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide, 
            emissive: 0x909090, 
            color: 0x333333,
            roughness: 0,
            metalness: 0,
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI * -90 / 180);
        // mesh.castShadow = true;
        mesh.receiveShadow = true;
        // this.scene.add(mesh);

        // this.scene.add(new THREE.AxesHelper(4));
        this.planeMaterial = material;
    }

    addObj(){
        let material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x000000,
            opacity: 1,
            premultipliedAlpha: true,
            transparent: true,
            roughness: 0,
            metalness: 0,
        })

        for(let i = 0; i < 3; i++){
            let geometry = i % 2 ? new THREE.BoxGeometry(1, 1, 1) : new THREE.SphereGeometry(0.5, 18, 18);
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set((1 - i) * 2, 1, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // this.scene.add(mesh);
        }

        this.objMaterial = material;
    }


    addLights():void{
        //环境光
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);

        //聚光灯
        var spotLight:THREE.SpotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0.7;
        spotLight.castShadow = true;
        spotLight.angle = 0.3;
        spotLight.penumbra = 0.2;
        spotLight.decay = 2;
        spotLight.distance = 50;
        this.scene.add(spotLight);
        spotLight.position.set(-2, 7, 4);

        this.spotLightHelper = new THREE.SpotLightHelper(spotLight);
        this.scene.add(this.spotLightHelper);

        //平行光
        var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.intensity = 0.7;
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        directionalLight.position.set(4, 7, 5);

        this.directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        this.scene.add(this.directionalLightHelper);

        this.spotLight = spotLight;
        this.directionalLight = directionalLight;

        this.debugObjects.push(this.spotLightHelper, this.directionalLightHelper);
    }

    loadObject():void{
        let loader = new GLTFLoader();
        loader.setPath('/obj/gl/');
        loader.load('win.gltf', (gltf) => {
            console.log("gltf");
            console.log(gltf);

            let mat = new THREE.MeshLambertMaterial({
                color: 0xff0000,
                emissive: 0xffffff,
                emissiveMap: new THREE.TextureLoader().load("/texture/w1.jpg"),
                map: new THREE.TextureLoader().load("/texture/w1.jpg")
            })

            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                    // if(child.material.map){
                    //     child.material.map.flipY = true;
                    // }
                    
                    // child.material = mat;
                    child.uvsNeedUpdate = true;
                    
                }
            })
            
            let size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
            let max = Math.max(size.x, size.y, size.z);
            let scale = 10 / max;            
            gltf.scene.scale.set(scale, scale, scale);

            this.scene.add(gltf.scene);

            let c = new THREE.Box3().setFromObject(gltf.scene);
            let x = (c.min.x + c.max.x) / 2;
            let y = (c.min.y + c.max.y) / 2;
            let z = (c.min.z + c.max.z) / 2;
            gltf.scene.position.set(0 - x, 0 - y, 0 - z);

        })
    }

}