import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

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

    setStats(stats: any){
        this.stats = stats;
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

    updateGUIParam(param: any){

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

        this.addPlane();
        this.addLights();
        this.addObj();
        this.addDrag();
        this.animate();

        this.camera.lookAt(App.ZERO);
    }

    toggerControl(use: boolean):void{
        this.orbit.enabled = use;
        this.dragControls.enabled = !use;
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
        this.scene.add(new THREE.GridHelper(80, 80));
        this.scene.add(new THREE.AxesHelper(4));
    }

    addObj(){

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
    }

}