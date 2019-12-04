import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from './tool/FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import Tooler from './Tooler'

export default class App {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    clock:THREE.Clock = new THREE.Clock();
    mixer: any;

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

    setStats(stats: any):void{
        this.stats = stats;
    }

    animate():void {
        var delta = this.clock.getDelta();
        // console.log("delta: " + delta);
        if ( this.mixer ) this.mixer.update( delta );
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
      
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.addLights();
        this.addObj();
        this.animate();
        this.camera.lookAt(new THREE.Vector3());
        document.body.appendChild(this.renderer.domElement);
    }
    
    addObj(){
        let url = '/obj/fbx/Running.fbx';
        if(url.indexOf(".fbx") != -1){
            this.loadFbxObj(url);
        }
        else{
            this.loadDaeObj(url);
        }

        this.scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()));

    }

    fitModel(group: THREE.Object3D): void {
        let parent: THREE.Object3D = group;

        // while (parent.children.length == 1) {
        //     parent = parent.children[0];
        // }
        let scale: number = Tooler.getFitScale(parent, 10);
        // parent.position.set(0, 0, 0);
        parent.scale.multiplyScalar(scale);
        // parent.rotateX(-Math.PI / 2);
        this.scene.add(parent);
        parent.name = "load_scene";

        let aim = new THREE.Object3D();
        aim.name = "aim_scene";
        aim.add(parent);
        this.scene.add(aim);
        let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
        console.log("offset ==== ");
        console.log(offset);
        aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);
    }

    loadDaeObj(url:string){
        var loader = new ColladaLoader();
        loader.load(url, (object:any) => {
            let daeModel = object.scene;
            // daeModel.scale.set( 0.1, 0.1, 0.1 );
            // daeModel.position.set( -6, 0, 0 );
            this.fitModel( daeModel );
        })
    }

    loadFbxObj(url:string){
        var loader = new FBXLoader();
        loader.load(url, ( object:any )=> {
            this.mixer = new THREE.AnimationMixer( object );
            var action = this.mixer.clipAction( object.animations[ 0 ] );
            action.play();

            object.traverse( function ( child:any) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );

            this.fitModel( object );

        } );
    }


    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);

        var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
        this.scene.add(directionalLight);
        directionalLight.position.set(20, 60, 20);
        directionalLight.lookAt(new THREE.Vector3());
    }
}